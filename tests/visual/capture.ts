import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { captureBrowserZoom } from './zoom.ts';

// Real screenshots of the ordinary static build; no mockups or video UI mode.
const output = resolve('.local/verification/i02/visual');
const origin = 'http://127.0.0.1:4321';
await mkdir(output, { recursive: true });
const preview = spawn(
  process.execPath,
  [
    'node_modules/astro/bin/astro.mjs',
    'preview',
    '--host',
    '127.0.0.1',
    '--port',
    '4321',
    '--ignore-lock',
  ],
  {
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
  },
);
let serverLog = '';
preview.stdout.on('data', (data: Buffer) => (serverLog += data.toString()));
preview.stderr.on('data', (data: Buffer) => (serverLog += data.toString()));
const views: object[] = [];
const issues: string[] = [];

try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    if (preview.exitCode !== null) throw new Error(serverLog);
    try {
      ready = (await fetch(`${origin}/es/`)).ok;
    } catch {
      // Server has not bound its loopback port yet.
    }
    if (ready) break;
    await new Promise((done) => setTimeout(done, 100));
  }
  if (!ready) throw new Error(`Preview did not start: ${serverLog}`);
  const browser = await chromium.launch();
  try {
    const executable = chromium.executablePath();
    if (!executable.includes('chromium-1248')) {
      throw new Error(`Unexpected Playwright browser: ${executable}`);
    }
    for (const locale of ['es', 'en']) {
      for (const [label, width, height] of [
        ['desktop', 1440, 1080],
        ['mobile', 393, 851],
        ['tablet', 768, 1024],
      ] as const) {
        const page = await browser.newPage({
          viewport: { width, height },
          deviceScaleFactor: 1,
          reducedMotion: 'reduce',
        });
        page.on('pageerror', (error) => issues.push(error.message));
        await page.goto(`${origin}/${locale}/`);
        await page.evaluate(() => document.fonts.ready);
        const filename = `${label}-${locale}.png`;
        await page.screenshot({
          path: `${output}/${filename}`,
          fullPage: true,
        });
        views.push({
          filename,
          locale,
          width,
          height,
          ...(await page.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            viewportWidth: document.documentElement.clientWidth,
            headingFont: getComputedStyle(document.querySelector('h1')!)
              .fontFamily,
            bodyFont: getComputedStyle(document.body).fontFamily,
            colors: {
              paper: getComputedStyle(document.body).backgroundColor,
              canvas: getComputedStyle(document.documentElement)
                .backgroundColor,
              ink: getComputedStyle(document.body).color,
              action: getComputedStyle(
                document.querySelector('.primary-action')!,
              ).backgroundColor,
              actionText: getComputedStyle(
                document.querySelector('.primary-action')!,
              ).color,
              lead: getComputedStyle(document.querySelector('.hero-lead')!)
                .color,
            },
            title: document.title,
          }))),
        });
        await page.close();
      }
    }
    // 360 × 640 CSS px at DPR 3 is exactly 1080 × 1920 output pixels.
    // This is the actual mobile layout at a readable recording scale.
    const vertical = await browser.newPage({
      viewport: { width: 360, height: 640 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      reducedMotion: 'reduce',
    });
    await vertical.goto(`${origin}/es/`);
    await vertical.evaluate(() => document.fonts.ready);
    for (const scene of ['home', 'catalogue']) {
      if (scene === 'catalogue') {
        await vertical.locator('#catalogo').scrollIntoViewIfNeeded();
      }
      const filename = `vertical-9x16-${scene}.png`;
      await vertical.screenshot({ path: `${output}/${filename}` });
      views.push({
        filename,
        cssViewport: '360x640',
        dpr: 3,
        output: '1080x1920',
      });
    }
    await vertical.close();
    const focus = await browser.newPage({
      viewport: { width: 393, height: 851 },
    });
    await focus.goto(`${origin}/es/`);
    await focus.keyboard.press('Tab');
    await focus.screenshot({ path: `${output}/keyboard-focus.png` });
    await focus.close();
    const manifest = [];
    for (const view of views) {
      const filename = (view as { filename: string }).filename;
      const bytes = await readFile(`${output}/${filename}`);
      manifest.push({
        filename,
        bytes: bytes.length,
        sha256: createHash('sha256').update(bytes).digest('hex'),
      });
    }
    await writeFile(
      `${output}/capture.json`,
      JSON.stringify(
        {
          capturedAt: new Date().toISOString(),
          browser: browser.version(),
          executable,
          purpose:
            'Implemented I-02 static build, ordinary mobile and desktop layouts',
          views,
          manifest,
          issues,
        },
        null,
        2,
      ) + '\n',
    );
    if (issues.length) throw new Error(issues.join('\n'));
    await captureBrowserZoom(origin, output);
    console.log(
      `Captured ${views.length} real views plus keyboard focus in ${output}`,
    );
  } finally {
    await browser.close();
  }
} finally {
  preview.kill('SIGTERM');
  await writeFile(`${output}/preview.log`, serverLog);
}
