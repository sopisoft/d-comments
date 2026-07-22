import { expect } from '@playwright/test';
import { test } from './fixtures';

test('loaded extension exposes its background service worker', async ({ extension }) => {
  expect(extension.serviceWorker.url()).toBe(`chrome-extension://${extension.id}/background.js`);
  await expect.poll(() => extension.serviceWorker.evaluate(() => typeof browser)).toBe('object');
});

test('options page renders and its main tabs work', async ({ extensionPage, extension }) => {
  const errors: string[] = [];
  extensionPage.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await extensionPage.goto(`chrome-extension://${extension.id}/options.html`);

  await expect(extensionPage).toHaveTitle('設定');
  await expect(extensionPage.getByRole('heading', { name: 'd-comments 設定' })).toBeVisible();
  await expect(extensionPage.getByRole('tab', { name: 'NG 管理' })).toBeVisible();
  await extensionPage.getByRole('tab', { name: 'クイック設定' }).click();
  await expect(extensionPage.getByRole('tab', { name: 'クイック設定' })).toHaveAttribute('aria-selected', 'true');
  await extensionPage.getByRole('tab', { name: 'NG 管理' }).click();
  await expect(extensionPage.getByRole('heading', { name: 'NG 管理' })).toBeVisible();
  await extensionPage.getByRole('tab', { name: 'フォーム' }).click();
  await expect(extensionPage.getByRole('tab', { name: 'フォーム' })).toHaveAttribute('aria-selected', 'true');
  await extensionPage.getByRole('tab', { name: '使用方法' }).click();
  await expect(extensionPage.getByRole('tab', { name: '使用方法' })).toHaveAttribute('aria-selected', 'true');
  expect(errors, errors.join('\n')).toEqual([]);
});

test('popup page renders and its tabs work', async ({ extensionPage, extension }) => {
  const errors: string[] = [];
  extensionPage.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await extensionPage.goto(`chrome-extension://${extension.id}/popup.html`);

  await expect(extensionPage).toHaveTitle('Popup');
  await expect(extensionPage.getByText('dアニメストアの視聴ページでご利用ください')).toBeVisible();
  await extensionPage.getByRole('tab', { name: '設定' }).click();
  await expect(extensionPage.getByRole('tab', { name: '設定' })).toHaveAttribute('aria-selected', 'true');
  await extensionPage.getByRole('tab', { name: 'その他' }).click();
  await expect(extensionPage.getByRole('tab', { name: 'その他' })).toHaveAttribute('aria-selected', 'true');
  expect(errors, errors.join('\n')).toEqual([]);
});

test('usage page renders markdown content and bundled images', async ({ extensionPage, extension }) => {
  const errors: string[] = [];
  extensionPage.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await extensionPage.goto(`chrome-extension://${extension.id}/usage.html`);

  await expect(extensionPage).toHaveTitle('使いかた');
  await expect(extensionPage.getByRole('heading', { name: 'd-commments のつかいかた' })).toBeVisible();
  await expect(extensionPage.locator('img')).toHaveCount(3);
  await expect(extensionPage.locator('img').first()).toBeVisible();
  expect(errors, errors.join('\n')).toEqual([]);
});
