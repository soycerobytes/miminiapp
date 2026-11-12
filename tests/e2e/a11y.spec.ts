import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

for (const locale of ['es', 'en']) {
  test(`has no detected WCAG 2.2 AA violations on the ${locale} home and catalogue`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/`);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(
      results.violations,
      `Accessibility violations on /${locale}/`,
    ).toEqual([]);
  });
}

test.describe('404 accessibility', () => {
  test.use({ expected404Paths: ['/es/missing-a11y-page/'] });

  test('has no detected WCAG 2.2 AA violations on the bilingual 404', async ({
    page,
  }) => {
    const response = await page.goto('/es/missing-a11y-page/');
    expect(response?.status()).toBe(404);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(results.violations, 'Accessibility violations on the 404').toEqual(
      [],
    );
  });
});
