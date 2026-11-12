import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { chromium, devices, expect } from '@playwright/test';

/** Review populated states without changing the production registry or shell. */
export async function verifyFixtureCatalogue(
  baseURL: string,
  evidenceDir: string,
  slugs: string[],
) {
  await mkdir(evidenceDir, { recursive: true });
  const browser = await chromium.launch();
  const results = [];
  try {
    expect(browser.version()).toBe('156.0.8078.4');
    const context = await browser.newContext({ baseURL });
    const page = await context.newPage();
    try {
      for (const theme of ['light', 'dark'] as const) {
        await page.emulateMedia({
          colorScheme: theme,
          reducedMotion: 'reduce',
        });
        for (const locale of ['es', 'en']) {
          for (const width of [320, 768, 1440]) {
            await page.setViewportSize({ width, height: 1000 });
            const response = await page.goto(`/${locale}/`);
            expect(response?.status()).toBe(200);
            await page.locator('[data-appearance-trigger]').click();
            await page.locator(`[data-appearance-option="${theme}"]`).click();
            await expect(page.locator('html')).toHaveAttribute(
              'data-theme',
              theme,
            );
            await expect(page.locator('.catalogue-card')).toHaveCount(
              slugs.length,
            );
            await expect(page.locator('.empty-catalogue')).toHaveCount(0);
            const dimensions = await page.evaluate(() => ({
              scroll: document.documentElement.scrollWidth,
              viewport: document.documentElement.clientWidth,
            }));
            expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.viewport);
            for (const slug of slugs) {
              await expect(
                page.locator(`#catalogo a[href="/${locale}/apps/${slug}/"]`),
              ).toBeVisible();
            }
            await page.locator('#catalogo').scrollIntoViewIfNeeded();
            const filename = `catalogue-${slugs.length}-${locale}-${width}-${theme}.png`;
            await page.screenshot({
              path: join(evidenceDir, filename),
              fullPage: true,
            });
            results.push({
              locale,
              theme,
              width,
              entries: slugs.length,
              filename,
            });
          }
        }

        for (const slug of slugs) {
          await page.goto(`/es/apps/${slug}/`);
          await expect(page.locator('html')).toHaveAttribute(
            'data-theme',
            theme,
          );
          expect(
            (
              await new AxeBuilder({ page })
                .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
                .analyze()
            ).violations,
          ).toEqual([]);
          const english = page.locator('header a[hreflang="en"]');
          await expect(english).toHaveAttribute('href', `/en/apps/${slug}/`);
          await english.focus();
          await page.keyboard.press('Enter');
          await expect(page).toHaveURL(new RegExp(`/en/apps/${slug}/$`));
          await expect(page.locator('html')).toHaveAttribute('lang', 'en');
          await expect(page.locator('html')).toHaveAttribute(
            'data-theme',
            theme,
          );
        }
      }
      await writeFile(
        join(evidenceDir, 'populated-catalogue.json'),
        `${JSON.stringify({ slugs, results, contextSwitches: slugs.length * 2 }, null, 2)}\n`,
      );
      return { slugs, results, contextSwitches: slugs.length * 2 };
    } finally {
      await context.close();
    }
  } finally {
    await browser.close();
  }
}

/**
 * Preserve I-01's browser regressions against the isolated synthetic build.
 * This helper is deliberately outside tests/e2e: the deliverable has no fixture
 * route, and the modular harness supplies a separate temporary preview URL.
 */
export async function verifyI01InFixture(baseURL: string, evidenceDir: string) {
  await mkdir(evidenceDir, { recursive: true });
  const browser = await chromium.launch();
  const version = browser.version();
  const resolvedChromiumExecutable = chromium.executablePath();
  const results: {
    project: string;
    checks: string[];
    accessibilityStates: string[];
    screenshots: string[];
  }[] = [];

  try {
    expect(version).toBe('156.0.8078.4');
    expect(resolvedChromiumExecutable).toContain('chromium-1248');

    for (const [project, device] of [
      ['chromium-desktop', devices['Desktop Chrome']],
      ['chromium-mobile', devices['Pixel 7']],
    ] as const) {
      const context = await browser.newContext({
        ...device,
        baseURL,
        locale: 'es-ES',
      });
      const page = await context.newPage();
      const issues: string[] = [];
      const origin = new URL(baseURL).origin;
      const checks: string[] = [];
      const accessibilityStates: string[] = [];
      const screenshots: string[] = [];
      page.on('console', (message) => {
        if (message.type() === 'error') issues.push(message.text());
      });
      page.on('pageerror', (error) => issues.push(error.message));
      page.on('requestfailed', (request) =>
        issues.push(`Request failed: ${request.url()}`),
      );
      page.on('response', (response) => {
        if (response.status() >= 400)
          issues.push(`HTTP ${response.status()}: ${response.url()}`);
      });
      page.on('request', (request) => {
        const url = new URL(request.url());
        if (url.protocol !== 'data:' && url.origin !== origin)
          issues.push(`External request: ${request.url()}`);
      });

      try {
        const response = await page.goto('/es/apps/i02-fixture-a/');
        expect(response?.status()).toBe(200);
        await expect(page.getByTestId('environment-fixture')).toHaveAttribute(
          'data-hydrated',
          'true',
        );
        checks.push('Astro entry statically imports and hydrates React');

        const fixture = page.getByTestId('environment-fixture');
        const input = fixture.getByRole('textbox', {
          name: 'Etiqueta de prueba',
        });
        const submit = fixture.getByRole('button', {
          name: 'Comprobar',
          exact: true,
        });
        const reset = fixture.getByRole('button', { name: 'Restablecer' });

        async function captureAndAudit(state: string) {
          const audit = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
            .analyze();
          expect(
            audit.violations,
            `${project}: isolated I-01 ${state}`,
          ).toEqual([]);
          accessibilityStates.push(state);
          const file = `${project}-${state}.png`;
          await page.screenshot({
            path: join(evidenceDir, file),
            fullPage: true,
          });
          screenshots.push(file);
        }

        await captureAndAudit('initial');
        await input.focus();
        await page.keyboard.press('Enter');
        await expect(input).toBeFocused();
        await expect(fixture.getByRole('alert')).toHaveText(
          'Escribe una etiqueta.',
        );
        await expect(input).toHaveAttribute('aria-invalid', 'true');
        await expect(input).toHaveAccessibleDescription(
          /Escribe una etiqueta\./,
        );
        await captureAndAudit('error');

        await page.keyboard.type('ab');
        await page.keyboard.press('Enter');
        await expect(fixture.getByRole('alert')).toHaveText(
          'Usa al menos 3 caracteres.',
        );
        await input.fill('');
        await page.keyboard.type('  Entorno   comprobado  ');
        await page.keyboard.press('Enter');
        await expect(fixture.getByRole('status')).toHaveText(
          'Etiqueta confirmada: Entorno comprobado',
        );
        await expect(input).toHaveValue('Entorno comprobado');
        await expect(input).toHaveAttribute('aria-invalid', 'false');
        await expect(fixture.getByRole('alert')).toHaveCount(0);
        checks.push('Keyboard validation, live error and normalized success');
        await captureAndAudit('success');

        await page.keyboard.press('Tab');
        await expect(submit).toBeFocused();
        const focus = await submit.evaluate((element) => {
          const style = getComputedStyle(element);
          return {
            style: style.outlineStyle,
            width: Number.parseFloat(style.outlineWidth),
          };
        });
        expect(focus.style).toBe('solid');
        expect(focus.width).toBeGreaterThanOrEqual(2);
        await page.keyboard.press('Tab');
        await expect(reset).toBeFocused();
        await page.keyboard.press('Enter');
        await expect(input).toBeFocused();
        await expect(input).toHaveValue('');
        await expect(fixture.getByRole('status')).toBeEmpty();
        await expect(fixture.getByRole('alert')).toHaveCount(0);
        checks.push('Visible keyboard focus and reset returns focus to input');

        const layout = await page
          .getByTestId('fixture-layout')
          .evaluate((element) => {
            const style = getComputedStyle(element);
            return {
              display: style.display,
              columns: style.gridTemplateColumns.split(' ').length,
              gap: Number.parseFloat(style.columnGap),
            };
          });
        expect(layout.display).toBe('grid');
        expect(layout.columns).toBe(project === 'chromium-mobile' ? 1 : 2);
        expect(layout.gap).toBeGreaterThan(0);
        expect(
          await submit.evaluate(
            (element) => element.getBoundingClientRect().height,
          ),
        ).toBeGreaterThanOrEqual(48);
        const dimensions = await page.evaluate(() => ({
          scroll: document.documentElement.scrollWidth,
          viewport: document.documentElement.clientWidth,
        }));
        expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.viewport);
        checks.push('Compiled Tailwind grid, 48px controls and no overflow');
        expect(issues, `${project}: browser errors`).toEqual([]);
        results.push({
          project,
          checks,
          accessibilityStates,
          screenshots,
        });
      } finally {
        await context.close();
      }
    }

    const report = {
      version,
      resolvedChromiumExecutable,
      noChannelOrExecutableOverride: true,
      baseURL,
      results,
    };
    await writeFile(
      join(evidenceDir, 'i01-browser-regression.json'),
      `${JSON.stringify(report, null, 2)}\n`,
    );
    return report;
  } finally {
    await browser.close();
  }
}
