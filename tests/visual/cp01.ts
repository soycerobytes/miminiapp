import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { captureBrowserZoom } from './zoom.ts';

// CP-01 static build, plus explicitly labelled approval references/comparisons.
// Run: npm run build && node tests/visual/cp01.ts
const output = resolve('.local/verification/cp01/iteration-1/visual');
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

    // Reference-only views: the original prototype is opened unchanged, with
    // reduced motion, so its static geometry can be compared with the build.
    const reference = await browser.newPage({
      viewport: { width: 1440, height: 1080 },
      reducedMotion: 'reduce',
    });
    for (const locale of ['es', 'en']) {
      for (const [label, width, height] of [
        ['desktop', 1440, 1080],
        ['mobile', 393, 851],
      ] as const) {
        await reference.setViewportSize({ width, height });
        await reference.goto(
          `file://${resolve('.local/creative-playground-v2/scene.html')}?word=compact&hero=B`,
        );
        await reference.evaluate(() => document.fonts.ready);
        if (locale === 'en')
          await reference.locator('#language-choice').click();
        const filename = `reference-${label}-${locale}.png`;
        await reference
          .locator('#scene-frame .site-inner')
          .screenshot({ path: `${output}/${filename}` });
        views.push({
          filename,
          role: 'unchanged prototype reference',
          locale,
          width,
          height,
        });
      }
    }
    await reference.close();
    const detail = await browser.newPage({
      viewport: { width: 1440, height: 1080 },
    });
    await detail.goto(`${origin}/es/`);
    await detail.evaluate(() => document.fonts.ready);
    for (const [name, selector] of [
      ['header', '.site-header'],
      ['footer', '.site-footer'],
      ['hero', '.hero-art'],
    ] as const) {
      const filename = `detail-${name}.png`;
      await detail
        .locator(selector)
        .screenshot({ path: `${output}/${filename}` });
      views.push({ filename, role: 'real build detail' });
    }
    const icon = await (await fetch(`${origin}/favicon.svg`)).text();
    await detail.setContent(
      `<html lang="es"><head><meta charset="utf-8"><title>Favicon a tamaño real</title></head><body style="font:16px system-ui;background:#f7f5f0;color:#242136;padding:40px"><h1>Favicon · tamaño real</h1><p>SVG publicado por el build local; sin animaciones.</p><div style="display:flex;gap:40px;align-items:end">${[16, 32, 48].map((size) => `<div>${icon.replace('<svg ', `<svg width="${size}" height="${size}" `)}<p>${size} px</p></div>`).join('')}</div></body></html>`,
    );
    await detail.screenshot({ path: `${output}/favicon-sizes.png` });
    views.push({
      filename: 'favicon-sizes.png',
      role: 'build favicon, actual rendered sizes',
    });
    for (const locale of ['es', 'en']) {
      for (const label of ['desktop', 'mobile']) {
        const imageData = async (filename: string) =>
          `data:image/png;base64,${(await readFile(`${output}/${filename}`)).toString('base64')}`;
        const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>CP-01 comparación ${label} ${locale}</title><style>*{box-sizing:border-box}body{margin:0;padding:30px;background:#eee8f5;color:#242136;font:16px/1.5 system-ui}h1{margin:0 0 8px}p{margin:0 0 24px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}article{background:#fff;border-radius:16px;padding:20px;min-width:0}h2{font-size:18px}img{width:100%;height:auto;display:block}${label === 'mobile' ? '.grid{max-width:880px;margin:auto}' : ''}</style></head><body><h1>CP-01 · ${label} · ${locale.toUpperCase()}</h1><p>Referencia v2 estática y aplicación real. Se conserva la maquetación del producto; el prototipo es una reconstrucción de exploración.</p><div class="grid"><article><h2>Referencia aprobada · movimiento reducido</h2><img alt="Referencia del prototipo" src="${await imageData(`reference-${label}-${locale}.png`)}"></article><article><h2>Build real · Iteración 1 estática</h2><img alt="Aplicación implementada" src="${await imageData(`${label}-${locale}.png`)}"></article></div></body></html>`;
        const htmlFile = `${output}/comparison-${label}-${locale}.html`;
        await writeFile(htmlFile, html);
        await detail.setViewportSize({
          width: label === 'mobile' ? 1000 : 1600,
          height: 1100,
        });
        await detail.goto(`file://${htmlFile}`);
        await detail.screenshot({
          path: `${output}/comparison-${label}-${locale}.png`,
          fullPage: true,
        });
        views.push({
          filename: `comparison-${label}-${locale}.png`,
          role: 'labelled reference and real build comparison',
        });
      }
    }
    await detail.close();

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
            'CP-01 iteration 1: real static identity; no animation implementation',
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
