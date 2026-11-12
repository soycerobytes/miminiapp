import { chromium, expect } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';

const output = 'docs/review/motion-default';
const origin = 'http://127.0.0.1:4326';
const server = spawn(
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
  { stdio: 'ignore', env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' } },
);
const browser = await chromium.launch();
const results: object[] = [];
try {
  await mkdir(output, { recursive: true });
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(`${origin}/es/`)).ok) break;
    } catch {
      /* Server starting. */
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  for (const locale of ['es', 'en'])
    for (const [device, width, height] of [
      ['desktop', 1440, 1080],
      ['mobile', 393, 851],
    ] as const)
      for (const theme of ['light', 'dark']) {
        const context = await browser.newContext({
          viewport: { width, height },
          colorScheme: theme as 'light' | 'dark',
          reducedMotion: 'reduce',
        });
        await context.addInitScript(
          (theme) => localStorage.setItem('miminiapp.appearance', theme),
          theme,
        );
        const page = await context.newPage();
        await page.goto(`${origin}/${locale}/`);
        await page.evaluate(() => document.fonts.ready);
        await expect(page.locator('.hero-art')).toHaveAttribute(
          'data-motion-entered',
          'true',
        );
        await page.locator('[data-motion-control]').click();
        await expect(page.locator('main [data-motion-control]')).toHaveCount(0);
        await expect(page.locator('header [data-motion-control]')).toHaveCount(
          1,
        );
        await page.screenshot({
          path: `${output}/${device}-${locale}-${theme}.png`,
          fullPage: true,
        });
        if (locale === 'es') {
          const control = page.locator('[data-motion-control]');
          await control.click();
          await expect(control).toBeEnabled();
          await expect(control.locator('.motion-icon-slash')).toBeHidden();
          await page.locator('header').screenshot({
            path: `${output}/header-${device}-${theme}-playing.png`,
          });
          await control.click();
          await expect(control.locator('.motion-icon-slash')).toBeVisible();
          await expect(page.locator('html')).toHaveAttribute(
            'data-motion-paused',
            'true',
          );
          await page.locator('header').screenshot({
            path: `${output}/header-${device}-${theme}-paused.png`,
          });
          results.push({
            device,
            theme,
            ...(await page.evaluate(() => {
              const motion = document.querySelector('[data-motion-control]')!;
              return {
                pausedLabel: motion.getAttribute('aria-label'),
                dropdown: motion.hasAttribute('popovertarget'),
                languageFont: getComputedStyle(
                  document.querySelector('.locale-navigation')!,
                ).fontSize,
                languageWidth: document
                  .querySelector('.locale-navigation')!
                  .getBoundingClientRect().width,
                buttons: document
                  .querySelector('.header-controls')!
                  .getBoundingClientRect().width,
              };
            })),
          });
          await page.locator('[data-appearance-trigger]').click();
          await page.screenshot({
            path: `${output}/popover-${device}-${theme}.png`,
          });
        }
        await context.close();
      }
  await writeFile(
    `${output}/header-controls.json`,
    JSON.stringify({ browser: browser.version(), results }, null, 2) + '\n',
  );
  console.log(
    'Eight home captures refreshed; header icon checked running/paused, no dropdown, compact language links.',
  );
} finally {
  await browser.close();
  server.kill('SIGTERM');
}
