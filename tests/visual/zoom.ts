import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium, expect, type Worker } from '@playwright/test';

type ZoomApi = {
  tabs: {
    query: (query: { url: string }) => Promise<{ id?: number }[]>;
    setZoom: (tabId: number, factor: number) => Promise<void>;
    getZoom: (tabId: number) => Promise<number>;
  };
};

async function setBrowserZoom(worker: Worker, origin: string, factor: number) {
  return worker.evaluate(
    async ({ targetOrigin, zoomFactor }) => {
      const { chrome } = globalThis as unknown as { chrome: ZoomApi };
      const tabs = await chrome.tabs.query({ url: `${targetOrigin}/*` });
      const id = tabs[0]?.id;
      if (id === undefined)
        throw new Error('The local application tab is missing.');
      await chrome.tabs.setZoom(id, zoomFactor);
      return chrome.tabs.getZoom(id);
    },
    { targetOrigin: origin, zoomFactor: factor },
  );
}

/**
 * Capture actual Chrome browser zoom, using its local extension API.
 * No CSS zoom, page-scale emulation, or deviceScaleFactor substitute is used.
 * The disposable extension/profile remain outside the source and delivered app.
 */
export async function captureBrowserZoom(baseURL: string, evidenceDir: string) {
  await mkdir(evidenceDir, { recursive: true });
  const temporaryRoot = await mkdtemp(join(tmpdir(), 'miminiapp-i02-zoom-'));
  const extension = join(temporaryRoot, 'extension');
  await mkdir(extension);
  await writeFile(
    join(extension, 'manifest.json'),
    JSON.stringify({
      manifest_version: 3,
      name: 'MiMiniApp isolated zoom verification',
      version: '1.0.0',
      permissions: ['tabs'],
      background: { service_worker: 'background.js' },
    }),
  );
  await writeFile(
    join(extension, 'background.js'),
    'chrome.runtime.onInstalled.addListener(() => {});\n',
  );

  const context = await chromium.launchPersistentContext(
    join(temporaryRoot, 'profile'),
    {
      // This selects Playwright's full bundled Chromium, revision 1248, because
      // extension APIs require full Chromium rather than its headless shell.
      channel: 'chromium',
      headless: true,
      viewport: { width: 1280, height: 900 },
      locale: 'es-ES',
      args: [
        `--disable-extensions-except=${extension}`,
        `--load-extension=${extension}`,
      ],
    },
  );

  try {
    const worker =
      context.serviceWorkers()[0] ??
      (await context.waitForEvent('serviceworker', { timeout: 15_000 }));
    const page = context.pages()[0] ?? (await context.newPage());
    const session = await context.newCDPSession(page);
    async function captureViewport(filename: string) {
      // Capture the native surface with no clip. Playwright's screenshot/scroll
      // convenience coordinates assume a 1:1 browser zoom and can crop an image
      // even though the actual page reflows correctly at 200%.
      const screenshot = await session.send('Page.captureScreenshot', {
        format: 'png',
        fromSurface: true,
        captureBeyondViewport: false,
      });
      await writeFile(
        join(evidenceDir, filename),
        Buffer.from(screenshot.data, 'base64'),
      );
    }
    const issues: string[] = [];
    const origin = new URL(baseURL).origin;
    page.on('pageerror', (error) => issues.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') issues.push(message.text());
    });
    page.on('request', (request) => {
      const url = new URL(request.url());
      if (url.protocol !== 'data:' && url.origin !== origin)
        issues.push(`Unexpected external request: ${request.url()}`);
    });
    page.on('requestfailed', (request) =>
      issues.push(`Failed request: ${request.url()}`),
    );
    page.on('response', (response) => {
      if (response.status() >= 400)
        issues.push(`HTTP ${response.status()}: ${response.url()}`);
    });

    const captures = [];
    for (const locale of ['es', 'en']) {
      const response = await page.goto(new URL(`/${locale}/`, baseURL).href);
      expect(response?.status()).toBe(200);
      expect(await setBrowserZoom(worker, origin, 1)).toBe(1);
      const before = await page.evaluate(() => ({
        innerWidth,
        innerHeight,
        devicePixelRatio,
        clientWidth: document.documentElement.clientWidth,
      }));
      const zoom = await setBrowserZoom(worker, origin, 2);
      expect(zoom).toBe(2);
      await expect
        .poll(() => page.evaluate(() => document.documentElement.clientWidth))
        .toBe(Math.round(before.clientWidth / 2));
      await page.evaluate(() => document.fonts.ready);
      const after = await page.evaluate(() => ({
        innerWidth,
        innerHeight,
        devicePixelRatio,
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(after.scrollWidth).toBeLessThanOrEqual(after.clientWidth);
      expect(after.devicePixelRatio).toBe(before.devicePixelRatio * 2);
      for (const link of await page.locator('header a').all()) {
        await expect(link).toBeVisible();
        const rect = await link.boundingBox();
        expect(rect?.height).toBeGreaterThanOrEqual(48);
        expect(rect?.x).toBeGreaterThanOrEqual(0);
        expect((rect?.x ?? 0) + (rect?.width ?? 0)).toBeLessThanOrEqual(
          after.clientWidth,
        );
      }
      const filename = `zoom-200-${locale}.png`;
      await captureViewport(filename);
      await page.evaluate(() => {
        document.querySelector('#catalogo')?.scrollIntoView({
          block: 'start',
          behavior: 'instant',
        });
      });
      await page.evaluate(
        () =>
          new Promise<void>((resolve) => {
            requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
          }),
      );
      const catalogueFilename = `zoom-200-${locale}-catalogue.png`;
      await captureViewport(catalogueFilename);
      captures.push({
        locale,
        zoom,
        before,
        after,
        filename,
        catalogueFilename,
      });
    }

    expect(
      issues,
      'Browser zoom review must remain local and error-free',
    ).toEqual([]);
    const version = context.browser()?.version();
    expect(version).toBe('156.0.8078.4');
    const result = {
      version,
      resolvedChromiumExecutable: chromium.executablePath(),
      channel: 'chromium',
      method: 'chrome.tabs.setZoom(2) in a disposable local extension',
      layoutViewportAndDevicePixelRatioAsserted: true,
      captures,
    };
    await writeFile(
      join(evidenceDir, 'zoom.json'),
      `${JSON.stringify(result, null, 2)}\n`,
    );
    return result;
  } finally {
    await context.close();
    await rm(temporaryRoot, { recursive: true, force: true });
  }
}
