import './browser';
import '../src/types/assets.d.ts';
import '@mantine/core/styles.css';
import { type Decorator, type Preview } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { useTheme } from '../src/config/hooks/useTheme';
import { ThemedMantineProvider } from '../src/config/theme';
import { ui } from '../src/config/themeTokens';
import { configureBrowserMock } from './browser';

const ThemeCanvas = ({ children }: { children: ReactNode }) => {
  const { styles } = useTheme();
  return (
    <div style={{ background: styles.bg.base, color: styles.text.primary, minHeight: '100vh', padding: ui.space.lg }}>
      {children}
    </div>
  );
};

const PopupCanvas = ({ children }: { children: ReactNode }) => (
  <div
    className="storybook-popup-frame"
    style={{
      boxSizing: 'border-box',
      display: 'block',
      height: `${ui.layout.popup.height}px`,
      maxHeight: '100vh',
      maxWidth: '100vw',
      minHeight: 0,
      minWidth: 0,
      overflowX: 'hidden',
      overflowY: 'auto',
      position: 'relative',
      width: `${ui.layout.popup.width}px`,
    }}
  >
    <style>{`
      .storybook-popup-frame .d-comments-AppShell-root {
        height: 100%;
        min-height: 0;
        min-width: 0;
        width: 100%;
      }

      .storybook-popup-frame .d-comments-Tabs-root {
        height: 100%;
      }

      .storybook-popup-frame .d-comments-AppShell-header {
        position: absolute;
        width: 100%;
      }

      .storybook-popup-frame .d-comments-AppShell-main {
        box-sizing: border-box;
        min-width: 0;
        width: 100%;
      }

      .storybook-popup-frame .d-comments-Tabs-list,
      .storybook-popup-frame .d-comments-Group-root {
        min-width: 0;
      }

      .storybook-popup-frame .d-comments-Tabs-list {
        max-width: 100%;
        overflow-x: auto;
      }
    `}</style>
    <div style={{ boxSizing: 'border-box', height: '100%', minHeight: 0, minWidth: 0, width: '100%' }}>{children}</div>
  </div>
);

const withExtensionTheme: Decorator = (Story, context) => {
  configureBrowserMock({
    ...context.parameters.extension,
    themeMode: context.globals.theme ?? context.parameters.extension?.themeMode ?? 'auto',
  });
  const story = <Story />;
  return (
    <ThemedMantineProvider>
      <ThemeCanvas>{context.parameters.popup ? <PopupCanvas>{story}</PopupCanvas> : story}</ThemeCanvas>
    </ThemedMantineProvider>
  );
};

const preview: Preview = {
  globalTypes: {
    theme: {
      description: '表示テーマ',
      defaultValue: 'auto',
      toolbar: { icon: 'paintbrush', items: ['light', 'dark', 'auto'] },
    },
  },
  decorators: [withExtensionTheme],
  parameters: { a11y: { test: 'error' }, controls: { expanded: true }, extension: { themeMode: 'auto' }, popup: false },
};

export default preview;
