import { getPublishedMetadata } from '../../src/lib/miniapp-registry';
import { miniappPath } from '../../src/lib/locales';
import { miniappRegistry } from '../../src/miniapps/registry';
import { expect, test } from '../e2e/fixtures';
import { expectedReleaseIdentity } from './target';

const published = getPublishedMetadata(miniappRegistry);
const homes = [
  {
    locale: 'es',
    otherLocale: 'en',
    heading: 'Ideas que se vuelven herramientas.',
    catalogue: 'El catálogo',
    empty: 'Un espacio para lo que viene.',
    cta: 'Ver el catálogo',
  },
  {
    locale: 'en',
    otherLocale: 'es',
    heading: 'Ideas become little tools.',
    catalogue: 'The catalogue',
    empty: 'A place for what comes next.',
    cta: 'Explore the catalogue',
  },
] as const;

test('serves the exact trusted release identity', async ({ request }) => {
  const response = await request.get('/release-manifest.json', {
    maxRedirects: 0,
  });
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toMatch(/application\/json/i);
  expect(await response.json()).toEqual(expectedReleaseIdentity());
});

for (const home of homes) {
  test(`serves the ${home.locale} catalogue and equivalent language navigation`, async ({
    page,
  }) => {
    const response = await page.goto(`/${home.locale}/`);
    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', home.locale);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      home.heading,
    );
    await expect(page.getByRole('heading', { level: 2 })).toHaveText(
      home.catalogue,
    );
    await expect(page).toHaveTitle(/MiMiniApp/);
    expect(
      await page.locator('meta[name="description"]').getAttribute('content'),
    ).toBeTruthy();
    expect(await page.content()).not.toMatch(
      /I02_FIXTURE_|i02-fixture-|I02_DRAFT_/,
    );

    // Expected cards derive from the registry; adding a tool needs no suite edit.
    await expect(page.locator('.catalogue-card')).toHaveCount(published.length);
    if (published.length === 0) {
      await expect(page.locator('.empty-catalogue')).toBeVisible();
      await expect(page.getByRole('heading', { level: 3 })).toHaveText(
        home.empty,
      );
      await expect(page.locator('a[href*="/apps/"]')).toHaveCount(0);
    } else {
      await expect(page.locator('.empty-catalogue')).toHaveCount(0);
      for (const descriptor of published) {
        const card = page.locator('.catalogue-card').filter({
          has: page.getByRole('heading', {
            name: descriptor.copy[home.locale].title,
            exact: true,
          }),
        });
        await expect(card).toContainText(
          descriptor.copy[home.locale].description,
        );
        await expect(
          card.locator(
            `a[href="${miniappPath(home.locale, descriptor.slug)}"]`,
          ),
        ).toBeVisible();
      }
    }

    await page.getByRole('link', { name: home.cta, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/${home.locale}/#catalogo$`));
    await expect(page.locator('#catalogo')).toBeInViewport();
    await page.locator(`header a[hreflang="${home.otherLocale}"]`).focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`/${home.otherLocale}/$`));
    await expect(page.locator('html')).toHaveAttribute(
      'lang',
      home.otherLocale,
    );
  });

  test(`retains visible keyboard focus on the ${home.locale} platform`, async ({
    page,
  }) => {
    await page.goto(`/${home.locale}/`);
    await page.keyboard.press('Tab');
    await expect(page.locator('a[href="#contenido"]')).toBeFocused();
    await expect(page.locator('a[href="#contenido"]')).toBeInViewport();
    await page.keyboard.press('Enter');
    await expect(page.locator('main')).toBeFocused();

    await page.goto(`/${home.locale}/`);
    for (const link of await page
      .locator('a:visible, button:visible:not(:disabled)')
      .all()) {
      await page.keyboard.press('Tab');
      await expect(link).toBeFocused();
      await expect(link).toBeVisible();
      const focus = await link.evaluate((element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return {
          style: style.outlineStyle,
          width: Number.parseFloat(style.outlineWidth),
          targetHeight: rect.height,
          targetWidth: rect.width,
          left: rect.left,
          right: rect.right,
          viewport: document.documentElement.clientWidth,
        };
      });
      expect(focus.style).toBe('solid');
      expect(focus.width).toBeGreaterThanOrEqual(3);
      expect(focus.targetHeight).toBeGreaterThanOrEqual(48);
      expect(focus.targetWidth).toBeGreaterThanOrEqual(48);
      expect(focus.left).toBeGreaterThanOrEqual(0);
      expect(focus.right).toBeLessThanOrEqual(focus.viewport);
    }
  });

  test(`reflows the ${home.locale} platform at mobile, tablet and desktop widths`, async ({
    page,
  }) => {
    for (const width of [320, 393, 768, 1280, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`/${home.locale}/`);
      await page.evaluate(() => document.fonts.ready);
      const dimensions = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        viewport: document.documentElement.clientWidth,
      }));
      expect(
        dimensions.scroll,
        `${width}px: horizontal overflow`,
      ).toBeLessThanOrEqual(dimensions.viewport);
      for (const selector of ['header', 'main', '#catalogo', 'footer']) {
        const bounds = await page.locator(selector).boundingBox();
        expect(bounds?.x).toBeGreaterThanOrEqual(0);
        expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(
          width,
        );
      }
      for (const link of await page.locator('header nav a').all()) {
        await expect(link).toBeVisible();
        expect((await link.boundingBox())?.height).toBeGreaterThanOrEqual(48);
      }
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.getByRole('link', { name: home.cta, exact: true }).click();
    await expect(page.locator('#catalogo')).toBeInViewport();
  });

  test(`loads local fonts without storing platform state in ${home.locale}`, async ({
    page,
    context,
  }) => {
    await page.goto(`/${home.locale}/`);
    await page.evaluate(() => document.fonts.ready);
    const resources = await page.evaluate(() => ({
      headingFont: getComputedStyle(document.querySelector('h1')!).fontFamily,
      bodyFont: getComputedStyle(document.body).fontFamily,
      loadedFonts: [...document.fonts].filter(
        (face) => face.status === 'loaded',
      ).length,
      localStorage: localStorage.length,
      sessionStorage: sessionStorage.length,
    }));
    expect(resources.headingFont).toMatch(/Space Grotesk/);
    expect(resources.bodyFont).toMatch(/DM Sans/);
    expect(resources.loadedFonts).toBeGreaterThanOrEqual(2);
    expect(resources.localStorage).toBe(0);
    expect(resources.sessionStorage).toBe(0);
    expect(await context.cookies()).toEqual([]);
    await expect(page.locator('script[src]')).toHaveCount(0);
  });
}

test.describe('Cloudflare HTTP routing', () => {
  test.use({ locale: 'en-US' });

  test('redirects the root with HTTP 301 to Spanish independently of browser language', async ({
    page,
    request,
    baseURL,
  }) => {
    const response = await request.get('/', { maxRedirects: 0 });
    expect(response.status()).toBe(301);
    expect(new URL(response.headers().location, baseURL).href).toBe(
      new URL('/es/', baseURL).href,
    );
    await page.goto('/');
    await expect(page).toHaveURL(/\/es\/$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  });

  test('normalizes locale directory URLs with a trailing slash', async ({
    request,
    baseURL,
  }) => {
    for (const locale of ['es', 'en']) {
      const response = await request.get(`/${locale}`, { maxRedirects: 0 });
      expect(response.status()).toBe(307);
      expect(new URL(response.headers().location, baseURL).href).toBe(
        new URL(`/${locale}/`, baseURL).href,
      );
      expect(
        (await request.get(`/${locale}/`, { maxRedirects: 0 })).status(),
      ).toBe(200);
    }
  });
});

const missingPaths = [
  '/fr/',
  '/es/no-existe/',
  '/en/apps/no-such-tool/',
  '/es/apps/i02-fixture-draft/',
  '/en/apps/i02-fixture-published/',
];

test.describe('real 404 and unpublished module exclusion', () => {
  test.use({ expected404Paths: missingPaths });

  test('returns 404 with bilingual recovery for unknown and synthetic module routes', async ({
    page,
  }) => {
    for (const path of missingPaths) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(404);
      await expect(page.locator('main')).toBeVisible();
      await expect(page.locator('[lang="es"]')).not.toHaveCount(0);
      await expect(page.locator('[lang="en"]')).not.toHaveCount(0);
      await expect(page.locator('main a[href="/es/"]')).toBeVisible();
      await expect(page.locator('main a[href="/en/"]')).toBeVisible();
      await expect(page.locator('astro-island')).toHaveCount(0);
    }
    await page.locator('main a[href="/en/"]').focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/en\/$/);
  });
});
