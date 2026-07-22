import path from 'node:path';
import { test as base, type BrowserContext, chromium, type Page, type Worker } from '@playwright/test';

export type ExtensionFixtures = {
  extension: { context: BrowserContext; id: string; serviceWorker: Worker };
  extensionPage: Page;
};

export const test = base.extend<ExtensionFixtures>({
  extension: async ({ browserName: _browserName }, use) => {
    const extensionPath = path.resolve('dist/chrome-mv3');
    const context = await chromium.launchPersistentContext(process.env.E2E_PROFILE_DIR ?? '', {
      channel: 'chromium',
      headless: process.env.HEADED !== '1',
      args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
    });
    const serviceWorker = context.serviceWorkers()[0] ?? (await context.waitForEvent('serviceworker'));
    const id = new URL(serviceWorker.url()).host;
    await use({ context, id, serviceWorker });
    await context.close();
  },
  extensionPage: async ({ extension }, use) => {
    const page = await extension.context.newPage();
    await use(page);
    await page.close();
  },
});
