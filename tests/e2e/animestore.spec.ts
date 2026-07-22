import { expect } from '@playwright/test';
import { test } from './fixtures';

const testUrl = process.env.DANIME_TEST_URL;

test.describe('dアニメストア integration', () => {
  test.skip(!process.env.E2E_DANIME || !testUrl, 'E2E_DANIME=1 と DANIME_TEST_URL が必要です');

  test('loads the content script, sidebar, and popup on an authenticated video page', async ({
    extension,
    extensionPage,
  }) => {
    const danimePage = await extension.context.newPage();
    const errors: string[] = [];
    danimePage.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    await danimePage.goto(testUrl as string, { waitUntil: 'domcontentloaded' });
    await expect(danimePage).toHaveURL(/animestore\.docomo\.ne\.jp/);
    await expect(danimePage.locator('video')).toBeAttached({ timeout: 30_000 });
    await expect(danimePage.locator('#d-comments-wrapper')).toBeAttached({ timeout: 30_000 });
    await expect(danimePage.locator('#d-comments-side')).toBeAttached({ timeout: 30_000 });
    const sidebar = danimePage.locator('d-comments-sidebar');
    await expect(sidebar).toBeAttached({ timeout: 30_000 });
    const firstComment = sidebar.getByRole('button', { name: /コメント:/ }).first();
    await firstComment.click();
    await expect(sidebar.getByRole('dialog')).toBeVisible();
    await firstComment.click();
    await expect(sidebar.getByRole('dialog')).toBeHidden();
    const resizeHandle = sidebar.getByRole('slider', { name: 'サイドバー幅の調整' });
    await expect(resizeHandle).toBeAttached();
    await expect(resizeHandle).toHaveAttribute('aria-orientation', 'horizontal');
    await expect(resizeHandle).toHaveAttribute('aria-valuemin');
    await expect(resizeHandle).toHaveAttribute('aria-valuemax');
    await expect(resizeHandle).toHaveAttribute('aria-valuenow');

    await danimePage.bringToFront();
    await extensionPage.goto(`chrome-extension://${extension.id}/popup.html`);
    await expect(extensionPage).toHaveTitle('Popup');
    await expect(extensionPage.getByRole('tab', { name: 'コメント取得' })).toBeVisible();
    await expect(extensionPage.getByRole('tab', { name: '設定' })).toBeVisible();
    await expect(extensionPage.getByRole('tab', { name: 'その他' })).toBeVisible();
    await expect(extensionPage.getByRole('tab', { name: '検索' })).toBeVisible();
    await expect(extensionPage.getByRole('tab', { name: '動画ID' })).toBeVisible();
    await extensionPage.getByRole('tab', { name: '動画ID' }).click();
    await expect(extensionPage.getByRole('tab', { name: '動画ID' })).toHaveAttribute('aria-selected', 'true');
    expect(errors, errors.join('\n')).toEqual([]);
    await danimePage.close();
  });
});
