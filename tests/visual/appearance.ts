import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { join, relative } from 'node:path';
import { captureBrowserZoom } from './zoom.ts';

// Real ordinary-build captures; the historical prototype remains separate.
const output = 'docs/review/cp02';
const local = '.local/verification/appearance';
const origin = 'http://127.0.0.1:4326';
await mkdir(output, { recursive: true });
await mkdir(local, { recursive: true });
const preview = spawn(
  process.execPath,
  [
    'node_modules/astro/bin/astro.mjs',
    'preview',
    '--host',
    '127.0.0.1',
    '--port',
    '4326',
    '--ignore-lock',
  ],
  { env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' }, stdio: 'ignore' },
);
const results: object[] = [];
const browser = await chromium.launch();
try {
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      if ((await fetch(`${origin}/es/`)).ok) break;
    } catch {
      /* Wait for the preview. */
    }
    await new Promise((done) => setTimeout(done, 100));
  }
  for (const locale of ['es', 'en'])
    for (const [device, width, height] of [
      ['desktop', 1440, 1080],
      ['mobile', 393, 851],
    ] as const)
      for (const theme of ['light', 'dark']) {
        const context = await browser.newContext({
          viewport: { width, height },
          reducedMotion: 'reduce',
        });
        await context.addInitScript(
          (mode) => localStorage.setItem('miminiapp.appearance', mode),
          theme,
        );
        const page = await context.newPage();
        await page.goto(`${origin}/${locale}/`);
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({
          path: `${output}/${device}-${locale}-${theme}.png`,
          fullPage: true,
        });
        if (locale === 'es') {
          await page.locator('[data-appearance-trigger]').click();
          await page.screenshot({
            path: `${output}/popover-${device}-${theme}.png`,
          });
          await page.keyboard.press('Escape');
        }
        const colors = await page.evaluate(() => {
          const color = (selector: string, property: string) =>
            getComputedStyle(
              document.querySelector(selector)!,
            ).getPropertyValue(property);
          return {
            text: color('html', 'color'),
            canvas: color('html', 'background-color'),
            muted: color('.hero-lead', 'color'),
            panel: color('.empty-catalogue', 'background-color'),
            buttonText: color('.primary-action', 'color'),
            button: color('.primary-action', 'background-color'),
            control: color('.appearance-options', 'background-color'),
            border: color('.appearance-options', 'border-top-color'),
            selectedText: color(
              '.appearance-option[aria-pressed=true]',
              'color',
            ),
            selected: color(
              '.appearance-option[aria-pressed=true]',
              'background-color',
            ),
            focus: getComputedStyle(document.documentElement)
              .getPropertyValue('--color-focus')
              .trim(),
          };
        });
        const luminance = (rgb: string) => {
          const bytes = rgb.startsWith('#')
            ? [1, 3, 5].map((i) => parseInt(rgb.slice(i, i + 2), 16))
            : rgb
                .match(/[\d.]+/g)!
                .slice(0, 3)
                .map(Number);
          return bytes
            .map((b) => b / 255)
            .map((c) =>
              c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
            )
            .reduce((sum, c, i) => sum + c * [0.2126, 0.7152, 0.0722][i], 0);
        };
        const ratio = (a: string, b: string) => {
          const l = [luminance(a), luminance(b)].sort((a, b) => a - b);
          return (l[1] + 0.05) / (l[0] + 0.05);
        };
        const contrasts = {
          textCanvas: ratio(colors.text, colors.canvas),
          textPanel: ratio(colors.text, colors.panel),
          mutedCanvas: ratio(colors.muted, colors.canvas),
          mutedPanel: ratio(colors.muted, colors.panel),
          action: ratio(colors.buttonText, colors.button),
          selected: ratio(colors.selectedText, colors.selected),
          border: ratio(colors.border, colors.control),
          focusCanvas: ratio(colors.focus, colors.canvas),
          focusSurface: ratio(colors.focus, colors.control),
        };
        for (const [name, value] of Object.entries(contrasts))
          if (value < (name.startsWith('focus') || name === 'border' ? 3 : 4.5))
            throw Error(`Contrast ${name}: ${value}`);
        results.push({ locale, device, theme, colors, contrasts });
        await context.close();
      }
  // Real browser zoom via CDP/input in the existing harness, not DPR simulation.
  await captureBrowserZoom(origin, local);
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1080 },
    reducedMotion: 'no-preference',
    recordVideo: { dir: local, size: { width: 1440, height: 1080 } },
  });
  const page = await context.newPage();
  await page.goto(`${origin}/es/`);
  await page.evaluate(() => document.fonts.ready);
  // Observe two complete orbit cycles, with the approved tile and normal motion.
  await page.waitForTimeout(18000);
  await page.locator('[data-appearance-trigger]').click();
  await page.locator('[data-appearance-option=dark]').click();
  await page.waitForTimeout(400);
  await page.locator('[data-appearance-trigger]').click();
  await page.locator('[data-appearance-option=light]').click();
  await page.waitForTimeout(400);
  await page.locator('[data-motion-control]').click();
  await page.locator('[data-appearance-trigger]').click();
  await page.locator('[data-appearance-option=dark]').click();
  await page.waitForTimeout(600);
  const video = page.video();
  await context.close();
  await video?.saveAs(`${output}/hero-theme-and-pause.webm`);
  const vertical = await browser.newContext({
    viewport: { width: 360, height: 640 },
    deviceScaleFactor: 3,
    reducedMotion: 'reduce',
  });
  const verticalPage = await vertical.newPage();
  await verticalPage.goto(`${origin}/es/`);
  await verticalPage.locator('[data-appearance-trigger]').click();
  await verticalPage.locator('[data-appearance-option=dark]').click();
  await verticalPage.evaluate(() => document.fonts.ready);
  await verticalPage.screenshot({ path: `${output}/vertical-9x16-dark.png` });
  await verticalPage.emulateMedia({ forcedColors: 'active' });
  await verticalPage.locator('[data-appearance-trigger]').focus();
  await verticalPage.screenshot({ path: `${output}/forced-colors-focus.png` });
  await vertical.close();
  // Filmstrip of a cold navigation with a stored override and CPU/network throttle.
  const cold = await browser.newContext({
    viewport: { width: 393, height: 851 },
    colorScheme: 'light',
    reducedMotion: 'reduce',
  });
  await cold.addInitScript(() =>
    localStorage.setItem('miminiapp.appearance', 'dark'),
  );
  const coldPage = await cold.newPage();
  const cdp = await cold.newCDPSession(coldPage);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 100,
    downloadThroughput: 200000,
    uploadThroughput: 100000,
  });
  const frames: { data: string; timestamp: number }[] = [];
  cdp.on('Page.screencastFrame', (event) => {
    frames.push({ data: event.data, timestamp: event.metadata.timestamp ?? 0 });
    void cdp.send('Page.screencastFrameAck', { sessionId: event.sessionId });
  });
  await cdp.send('Page.startScreencast', { format: 'png', everyNthFrame: 1 });
  await coldPage.goto(`${origin}/es/`);
  await coldPage.evaluate(() => document.fonts.ready);
  await coldPage.waitForTimeout(300);
  await cdp.send('Page.stopScreencast');
  await mkdir(`${local}/filmstrip`, { recursive: true });
  for (let i = 0; i < frames.length; i++)
    await writeFile(
      `${local}/filmstrip/${String(i).padStart(3, '0')}.png`,
      Buffer.from(frames[i].data, 'base64'),
    );
  await writeFile(
    `${local}/filmstrip.json`,
    JSON.stringify(
      frames.map((f, i) => ({ frame: i, timestamp: f.timestamp })),
      null,
      2,
    ),
  );
  results.push({
    coldNavigation: {
      frames: frames.length,
      cpuThrottle: 4,
      networkLatency: 100,
      stored: 'dark',
      system: 'light',
    },
  });
  frames.length = 0;
  await cdp.send('Page.startScreencast', { format: 'png', everyNthFrame: 1 });
  await coldPage.goto(`${origin}/`);
  await coldPage.waitForURL(`${origin}/es/`);
  await coldPage.waitForLoadState('load');
  await coldPage.evaluate(() => document.fonts.ready);
  await coldPage.waitForTimeout(300);
  await cdp.send('Page.stopScreencast');
  await mkdir(`${local}/root-filmstrip`, { recursive: true });
  for (let i = 0; i < frames.length; i++)
    await writeFile(
      `${local}/root-filmstrip/${String(i).padStart(3, '0')}.png`,
      Buffer.from(frames[i].data, 'base64'),
    );
  results.push({
    rootNavigation: {
      frames: frames.length,
      theme: await coldPage.locator('html').getAttribute('data-theme'),
      url: coldPage.url(),
    },
  });
  await cold.close();
  const html = await readFile('dist/es/index.html', 'utf8');
  const inline = html.match(/<script>([\s\S]*?)<\/script>/)![1];
  const budgets = {
    initGzip: gzipSync(inline).length,
    motionJSGzip: gzipSync(await readFile('src/scripts/motion.ts')).length,
    motionCSSGzip: gzipSync(await readFile('src/styles/motion.css')).length,
  };
  if (
    budgets.initGzip > 1024 ||
    budgets.motionJSGzip > 5120 ||
    budgets.motionCSSGzip > 5120
  )
    throw Error('Budget exceeded');
  await writeFile(
    `${output}/results.json`,
    JSON.stringify({ browser: browser.version(), results, budgets }, null, 2) +
      '\n',
  );
  const manifest = [];
  async function collect(directory: string): Promise<string[]> {
    const entries = await readdir(directory, { withFileTypes: true });
    const nested = await Promise.all(
      entries.map((entry) =>
        entry.isDirectory()
          ? collect(join(directory, entry.name))
          : [join(directory, entry.name)],
      ),
    );
    return nested.flat();
  }
  for (const filename of (await collect(output)).sort()) {
    if (filename === `${output}/manifest.json`) continue;
    const bytes = await readFile(filename);
    manifest.push({
      filename: relative(output, filename),
      bytes: bytes.length,
      sha256: createHash('sha256').update(bytes).digest('hex'),
    });
  }
  await writeFile(
    `${output}/manifest.json`,
    JSON.stringify(
      {
        createdAt: new Date().toISOString(),
        purpose: 'CP-02 ordinary production build, not prototype',
        manifest,
      },
      null,
      2,
    ) + '\n',
  );
  console.log(
    `Captured 8 ordinary views, measured contrast, browser zoom, 18-second loops + theme/pause video, cold-load filmstrip. ${JSON.stringify(budgets)}`,
  );
} finally {
  await browser.close();
  preview.kill('SIGTERM');
}
