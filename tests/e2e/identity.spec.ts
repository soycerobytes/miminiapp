import { readFile } from 'node:fs/promises';
import { expect, test } from './fixtures';

const referenceRoot = 'docs/design-docs/assets/creative-playground-v2/';
const compactReference = await readFile(
  `${referenceRoot}wordmark-compact.svg`,
  'utf8',
);

for (const locale of ['es', 'en']) {
  test(`preserves the approved integrated geometry and accessible brand in ${locale}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`/${locale}/`);
    await page.locator('[data-motion-control]').click();
    const links = page.getByRole('link', { name: 'MiMiniApp', exact: true });
    await expect(links).toHaveCount(2);
    for (const link of await links.all()) {
      await expect(link).toHaveAttribute('href', `/${locale}/`);
      await expect(link.locator('svg')).toHaveCount(1);
      await expect(link.locator('svg')).toHaveAttribute('aria-hidden', 'true');
    }
    const geometry = await page.evaluate((reference) => {
      const approved = new DOMParser().parseFromString(
        reference,
        'image/svg+xml',
      );
      const shape = (n: Element) => ({
        tag: n.localName,
        attributes: ['x', 'y', 'width', 'height', 'rx', 'd'].map((a) => [
          a,
          n.getAttribute(a),
        ]),
      });
      const pieces = [...approved.querySelectorAll('.piece')].map(shape);
      const letters = [...approved.querySelectorAll('.letter')].map(shape);
      return {
        expected: {
          pieces,
          letters,
          viewBox: approved.documentElement.getAttribute('viewBox'),
        },
        marks: [...document.querySelectorAll('.brand-wordmark')].map((svg) => ({
          pieces: [...svg.querySelectorAll('.brand-piece')].map(shape),
          letters: [...svg.querySelectorAll('.letter')].map(shape),
          viewBox: svg.getAttribute('viewBox'),
        })),
        initials: [...document.querySelectorAll('.brand-initial')].map((g) =>
          [...g.children].map(shape),
        ),
      };
    }, compactReference);
    expect(geometry.marks).toHaveLength(2);
    geometry.marks.forEach((mark) => expect(mark).toEqual(geometry.expected));
    // Header, footer, empty catalogue and hero all share the selected four pieces.
    expect(geometry.initials).toHaveLength(4);
    geometry.initials.forEach((pieces) =>
      expect(pieces).toEqual(geometry.expected.pieces),
    );
    await expect(page.locator('.hero-art')).toHaveAttribute(
      'viewBox',
      '-15 -12 540 490',
    );
    await expect(page.locator('.hero-art g[transform]')).toHaveAttribute(
      'transform',
      'translate(205 146) rotate(-10 42 76) scale(1.2)',
    );
    await page.locator('header .brand').hover();
    expect(
      await page
        .locator('.site-container')
        .evaluate((n) =>
          n
            .getAnimations({ subtree: true })
            .every((a) => a.playState === 'paused'),
        ),
    ).toBe(true);
    await expect(page.locator('script[type="module"]')).toHaveCount(1);
    await expect(page.locator('script[src]')).toHaveCount(0);
    await expect(
      page.getByRole('button', {
        name: locale === 'es' ? 'Reanudar animaciones' : 'Resume animations',
        exact: true,
      }),
    ).toBeEnabled();
    await links.last().focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`/${locale}/$`));
  });

  test(`keeps the complete identity and navigation usable without JavaScript in ${locale}`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 320, height: 568 },
    });
    try {
      const page = await context.newPage();
      await page.goto(`http://127.0.0.1:4321/${locale}/`);
      await expect(page.locator('header .brand-wordmark')).toBeVisible();
      await expect(page.locator('.hero-art .brand-piece')).toHaveCount(4);
      await page
        .getByRole('link', {
          name: locale === 'es' ? 'Ver el catálogo' : 'Explore the catalogue',
          exact: true,
        })
        .click();
      await expect(page.locator('#catalogo')).toBeInViewport();
      await page.locator('footer .brand').click();
      await expect(page).toHaveURL(new RegExp(`/${locale}/$`));
    } finally {
      await context.close();
    }
  });
}

test.describe('local identity resources', () => {
  test.use({ expected404Paths: ['/es/unknown-brand-page/'] });

  test('serves the selected local identity exports and static SVG favicon', async ({
    page,
    request,
  }) => {
    for (const file of [
      'wordmark-compact.svg',
      'wordmark-compact-dark.svg',
      'wordmark-editorial.svg',
      'wordmark-editorial-dark.svg',
      'M-isotype.svg',
      'M-isotype-dark.svg',
    ]) {
      const response = await request.get(`/brand/${file}`);
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('image/svg+xml');
      expect(await response.text()).toBe(
        await readFile(referenceRoot + file, 'utf8'),
      );
    }
    const icon = await request.get('/favicon.svg');
    expect(icon.status()).toBe(200);
    // CP-02 changes only the favicon's internal system color media rule.
    const iconText = await icon.text();
    const systemPalette =
      '@media(prefers-color-scheme:dark){.initial{fill:#A68AFF}}';
    expect(iconText).toContain(systemPalette);
    expect(iconText.replace(systemPalette, '')).toBe(
      await readFile(referenceRoot + 'M-isotype.svg', 'utf8'),
    );
    for (const path of ['/es/', '/en/', '/es/unknown-brand-page/']) {
      await page.goto(path);
      await expect(page.locator('link[rel="icon"]')).toHaveAttribute(
        'href',
        '/favicon.svg',
      );
    }
  });
});
