import { test as base, expect } from '@playwright/test';

export const test = base.extend<{
  browserHealth: void;
  expected404Paths: string[];
}>({
  expected404Paths: [[], { option: true }],
  browserHealth: [
    async ({ page, baseURL, expected404Paths }, use) => {
      if (!baseURL)
        throw new Error('The local preview baseURL must be configured.');
      const expectedOrigin = new URL(baseURL).origin;
      const issues: string[] = [];
      const consoleErrors: { text: string; url: string }[] = [];
      const expected404Urls = new Set(
        expected404Paths.map((path) => new URL(path, baseURL).href),
      );
      const observed404Documents = new Set<string>();

      page.on('console', (message) => {
        if (message.type() === 'error')
          consoleErrors.push({
            text: message.text(),
            url: message.location().url,
          });
      });
      page.on('pageerror', (error) => issues.push(`Page: ${error.message}`));
      page.on('requestfailed', (request) => {
        issues.push(
          `Request: ${request.url()} (${request.failure()?.errorText})`,
        );
      });
      page.on('response', (response) => {
        if (
          response.status() === 404 &&
          response.request().isNavigationRequest() &&
          response.request().frame() === page.mainFrame() &&
          expected404Urls.has(response.url())
        ) {
          observed404Documents.add(response.url());
        } else if (response.status() >= 400) {
          issues.push(`HTTP ${response.status()}: ${response.url()}`);
        }
      });
      page.on('request', (request) => {
        const url = new URL(request.url());
        if (url.protocol !== 'data:' && url.origin !== expectedOrigin) {
          issues.push(`Unexpected external request: ${request.url()}`);
        }
      });

      await use();

      for (const error of consoleErrors) {
        // Chromium reports the deliberate missing document as a console error.
        // Only exempt the exact URL/status asserted by that 404 test; asset
        // failures and all application errors remain failures.
        if (!(
          observed404Documents.has(error.url) &&
          /^Failed to load resource: the server responded with a status of 404\b/.test(
            error.text,
          )
        )) {
          issues.push(`Console: ${error.text} (${error.url})`);
        }
      }

      expect(
        issues,
        'The built application must use local resources without unexpected errors.',
      ).toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
