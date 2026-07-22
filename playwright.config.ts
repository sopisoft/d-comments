import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI || process.env.E2E_PROFILE_DIR ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never', outputFolder: '/tmp/d-comments-playwright-report' }]],
  use: {
    ...devices['Desktop Chrome'],
    screenshot: 'off',
    video: 'off',
    trace: 'off',
    actionTimeout: 5000,
    navigationTimeout: 10000,
  },
});
