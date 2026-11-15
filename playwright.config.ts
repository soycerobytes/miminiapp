import { defineConfig, devices } from '@playwright/test';

const previewUrl = 'http://127.0.0.1:4321/';

export default defineConfig({
  // Platform journeys live in tests/e2e; each tool keeps its own beside its code.
  testDir: '.',
  testMatch: ['tests/e2e/**/*.spec.ts', 'src/miniapps/*/tests/**/*.spec.ts'],
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  workers: 2,
  reporter: [['list'], ['html', { open: 'never' }]],
  expect: { timeout: 10_000 },
  use: {
    baseURL: previewUrl,
    headless: true,
    locale: 'es-ES',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'], browserName: 'chromium' },
    },
    {
      name: 'chromium-mobile',
      use: { ...devices['Pixel 7'], browserName: 'chromium' },
    },
  ],
  webServer: {
    command: 'npm run preview',
    url: previewUrl,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
