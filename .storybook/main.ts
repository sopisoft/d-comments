import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';
import { markdownHtmlPlugin } from '../scripts/markdownHtmlPlugin.ts';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  staticDirs: ['../.storybook/public', '../src/raw'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-vitest'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    config.plugins ??= [];
    config.plugins.push(markdownHtmlPlugin());
    config.resolve ??= {};
    config.resolve.alias = {
      ...(typeof config.resolve.alias === 'object' ? config.resolve.alias : {}),
      '@': path.resolve(rootDir, '../src'),
    };
    config.server ??= {};
    config.server.watch = {
      ignored: ['**/.direnv/**', '**/dist/**', '**/.wxt/**', '**/storybook-static/**'],
    };
    return config;
  },
};

export default config;
