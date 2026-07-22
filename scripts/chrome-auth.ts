import { spawnSync } from 'node:child_process';
import { chmodSync, mkdirSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import readline from 'node:readline/promises';
import { chromium } from '@playwright/test';

const args = process.argv.slice(2);
const defaultProfileDir = path.join(os.homedir(), '.local', 'state', 'd-comments', 'chrome-profile');
const valueOf = (name: string) => {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
};

if (args.includes('--help')) {
  console.info('使用法: node scripts/chrome-auth.ts [--profile-dir PATH] [--login-url URL]');
  process.exit(0);
}

const profileDir = valueOf('--profile-dir') ?? process.env.E2E_PROFILE_DIR ?? defaultProfileDir;
const loginUrl = valueOf('--login-url') ?? process.env.DANIME_LOGIN_URL ?? 'https://animestore.docomo.ne.jp/';
const extensionPath = path.resolve('dist/chrome-mv3');

const build = spawnSync('pnpm', ['exec', 'wxt', 'build', '-b', 'chrome', '--mv3'], { stdio: 'inherit' });
if (build.status !== 0) process.exit(build.status ?? 1);

mkdirSync(profileDir, { recursive: true, mode: 0o700 });
chmodSync(profileDir, 0o700);

const context = await chromium.launchPersistentContext(profileDir, {
  channel: 'chromium',
  headless: false,
  args: [`--disable-extensions-except=${extensionPath}`, `--load-extension=${extensionPath}`],
});

const page = await context.newPage();
await page.goto(loginUrl);
console.info(`Chromeを開きました: ${loginUrl}`);
console.info('dアニメストアにログインしてください');
const input = readline.createInterface({ input: process.stdin, output: process.stdout });
await input.question('ログイン完了後，このターミナルでEnterを押してください');
input.close();
await context.close();
console.info(`認証済みChromeプロファイルを保存しました: ${profileDir}`);
