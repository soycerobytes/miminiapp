import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '../e2e/fixtures';

for (const locale of ['es', 'en']) {
  test(`has no detected WCAG 2.2 AA violations on the remote ${locale} home`, async ({
    page,
  }) => {
    const response = await page.goto(`/${locale}/`);
    expect(response?.status()).toBe(200);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

test.describe('remote 404 accessibility', () => {
  test.use({ expected404Paths: ['/es/missing-a11y-page/'] });

  test('has no detected WCAG 2.2 AA violations on the bilingual remote 404', async ({
    page,
  }) => {
    const response = await page.goto('/es/missing-a11y-page/');
    expect(response?.status()).toBe(404);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
