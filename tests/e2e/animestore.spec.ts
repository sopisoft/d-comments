import { expect } from '@playwright/test';
import { test } from './fixtures';

const testUrl = process.env.DANIME_TEST_URL;
const workPageUrl = 'https://animestore.docomo.ne.jp/animestore/ci_pc?workId=22864';

const setPlayButtonOptions = async (extensionPage: import('@playwright/test').Page, sameTab: boolean) => {
  const addButton = extensionPage.getByRole('checkbox', { name: '再生ボタン' });
  const sameTabOption = extensionPage.getByRole('checkbox', { name: '同じタブで再生' });
  await addButton.check();
  if (sameTab) await sameTabOption.check();
  else await sameTabOption.uncheck();
  await expect(addButton).toBeChecked();
  await expect(sameTabOption).toBeChecked({ checked: sameTab });
};

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

  test('plays from the work page in the same tab', async ({ extension, extensionPage }) => {
    await extensionPage.goto(`chrome-extension://${extension.id}/options.html`);
    await setPlayButtonOptions(extensionPage, true);

    const workPage = await extension.context.newPage();
    await workPage.goto(workPageUrl, { waitUntil: 'domcontentloaded' });
    await expect(workPage).toHaveURL(/animestore\.docomo\.ne\.jp\/animestore\/ci_pc\?workId=22864/);

    const playLink = workPage.getByRole('link', { name: '同じタブで再生' }).first();
    await expect(playLink).toBeVisible({ timeout: 30_000 });
    const popup = workPage.waitForEvent('popup', { timeout: 1_000 }).catch(() => null);
    await playLink.click();
    await expect(workPage).toHaveURL(/animestore\.docomo\.ne\.jp\/animestore\/sc_d_pc\?partId=\d+/);
    expect(await popup).toBeNull();
    const video = workPage.locator('video');
    await expect(video).toBeAttached({ timeout: 30_000 });
    await expect
      .poll(
        () =>
          video.evaluate((element) => {
            const player = element as HTMLVideoElement;
            return !player.paused && player.currentTime > 0;
          }),
        { timeout: 30_000 }
      )
      .toBe(true);
    await workPage.close();
  });

  test('opens the added play button in a new tab when allowed', async ({ extension, extensionPage }) => {
    await extensionPage.goto(`chrome-extension://${extension.id}/options.html`);
    await setPlayButtonOptions(extensionPage, false);

    const workPage = await extension.context.newPage();
    await workPage.goto(workPageUrl, { waitUntil: 'domcontentloaded' });
    const playLink = workPage.getByRole('link', { name: '新しいタブで再生' }).first();
    await expect(playLink).toBeVisible({ timeout: 30_000 });
    await expect(playLink).toHaveAttribute('target', '_blank');
    const popup = workPage.waitForEvent('popup');
    await playLink.click();
    const popupPage = await popup;
    await expect(popupPage).toHaveURL(/animestore\.docomo\.ne\.jp\/animestore\/sc_d_pc\?partId=\d+/);
    const video = popupPage.locator('video');
    await expect(video).toBeAttached({ timeout: 30_000 });
    await expect
      .poll(
        () =>
          video.evaluate((element) => {
            const player = element as HTMLVideoElement;
            return !player.paused && player.currentTime > 0;
          }),
        { timeout: 30_000 }
      )
      .toBe(true);
    await popupPage.close();
    await workPage.close();
  });

  test('preserves the original work-page viewing flow when the addons are off', async ({
    extension,
    extensionPage,
  }) => {
    await extensionPage.goto(`chrome-extension://${extension.id}/options.html`);
    const addButton = extensionPage.getByRole('checkbox', { name: '再生ボタン' });
    await addButton.uncheck();
    await expect(addButton).not.toBeChecked();

    const workPage = await extension.context.newPage();
    await workPage.goto(workPageUrl, { waitUntil: 'domcontentloaded' });
    const originalLink = workPage.locator('section.clearfix > a').first();
    await expect(originalLink).toBeVisible({ timeout: 30_000 });
    await expect(originalLink).toHaveAttribute('href', 'cd_pc?partId=22864001');
    await originalLink.click();
    await expect(workPage).toHaveURL(/animestore\.docomo\.ne\.jp\/animestore\/ci_pc\?workId=22864&partId=22864001/);
    const modal = workPage.locator('modal.modalDialog').last();
    await expect(modal).toBeVisible({ timeout: 10_000 });
    const watchLink = modal.getByRole('link', { name: '視聴する', exact: true });
    await expect(watchLink).toBeVisible();
    await watchLink.click();
    await workPage.close();
  });
});
