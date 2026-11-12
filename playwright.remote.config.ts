import { defineConfig, devices } from '@playwright/test';
import { resolveRemoteTarget } from './tests/remote/target';

const { target, baseURL } = resolveRemoteTarget();

export default defineConfig({
  testDir: './tests/remote',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  workers: 2,
  outputDir: `test-results/remote-${target}`,
  reporter: [
    ['list'],
    [
      'html',
      { open: 'never', outputFolder: `playwright-report/remote-${target}` },
    ],
  ],
  expect: { timeout: 10_000 },
  use: {
    baseURL,
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
  // No webServer: this suite may only inspect an explicitly approved public target.
});
