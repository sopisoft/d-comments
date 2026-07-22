import { spawnSync } from 'node:child_process';
import path from 'node:path';

const args = process.argv.slice(2);
const defaultDanimeUrl = 'https://animestore.docomo.ne.jp/animestore/sc_d_pc?partId=22864001';
const defaultProfileDir = path.resolve('.wxt/chrome-profile');
const hasFlag = (name: string) => args.includes(name);
const valueOf = (name: string) => {
  const index = args.indexOf(name);
  return index === -1 ? undefined : args[index + 1];
};

if (hasFlag('--help')) {
  console.info('使用法: node scripts/e2e.ts [--danime-url URL] [--profile-dir PATH] [--headed|--debug]');
  process.exit(0);
}

const danimeUrl = valueOf('--danime-url') ?? process.env.DANIME_TEST_URL ?? defaultDanimeUrl;
const profileDir = valueOf('--profile-dir') ?? process.env.E2E_PROFILE_DIR ?? defaultProfileDir;
const environment = { ...process.env };

if (danimeUrl) {
  environment.E2E_DANIME = '1';
  environment.DANIME_TEST_URL = danimeUrl;
  environment.E2E_PROFILE_DIR = profileDir;
} else if (valueOf('--profile-dir') || process.env.E2E_PROFILE_DIR) {
  environment.E2E_PROFILE_DIR = profileDir;
}

if (hasFlag('--headed') || hasFlag('--debug')) {
  environment.HEADED = '1';
}
if (hasFlag('--debug')) {
  environment.PWDEBUG = '1';
}

const result = spawnSync('pnpm', ['exec', 'wxt', 'build', '-b', 'chrome', '--mv3'], {
  env: environment,
  stdio: 'inherit',
});
if (result.status !== 0) process.exit(result.status ?? 1);

const testResult = spawnSync('pnpm', ['exec', 'playwright', 'test'], { env: environment, stdio: 'inherit' });
process.exit(testResult.status ?? 1);
