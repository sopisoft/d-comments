import { createTheme, DEFAULT_THEME, MantineProvider } from '@mantine/core';
import { type ReactElement, type ReactNode, useCallback, useMemo, useRef } from 'react';
import { useTheme } from './hooks/useTheme';
import { ui } from './themeTokens';

export { ui } from './themeTokens';
export type {
  ColorMode,
  ThemeColorScale,
  ThemeColorScheme,
  ThemeMode,
  ThemePalette,
  ThemeSchemes,
} from './themeTokens';

const THEME_ROOT_ATTR = 'data-d-comments-root';
const THEME_ROOT_SELECTOR = `[${THEME_ROOT_ATTR}]`;

export const ThemedMantineProvider = ({ children }: { children: ReactNode }): ReactElement | null => {
  const { mode, configMode, schemes, isPending, styles } = useTheme();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fallbackRoot: HTMLElement | undefined = typeof document === 'undefined' ? undefined : document.documentElement;
  const getRootElement = useCallback<() => HTMLElement | undefined>(
    () => containerRef.current ?? fallbackRoot,
    [fallbackRoot]
  );

  const theme = useMemo(() => {
    if (isPending) return null;
    const currentScheme = schemes[mode];
    const colors = {
      ...DEFAULT_THEME.colors,
      ...currentScheme.colors,
    } satisfies typeof DEFAULT_THEME.colors;
    return createTheme({
      colors,
      defaultRadius: ui.radius.sm,
      focusRing: 'auto',
      fontFamily: ui.font.sans,
      fontFamilyMonospace: ui.font.mono,
      primaryColor: currentScheme.primaryColor,
      primaryShade: { light: 5, dark: 5 },
    });
  }, [isPending, mode, schemes]);

  if (!theme) return null;

  const schemeProps = {
    defaultColorScheme: configMode === 'auto' ? 'auto' : configMode,
    forceColorScheme: mode,
  } as const;

  return (
    <div
      ref={containerRef}
      {...{ [THEME_ROOT_ATTR]: '' }}
      style={{
        backgroundColor: styles.bg.surface,
        color: styles.text.primary,
        display: 'contents',
      }}
    >
      <MantineProvider
        theme={theme}
        {...schemeProps}
        classNamesPrefix="d-comments"
        getRootElement={getRootElement}
        cssVariablesSelector={THEME_ROOT_SELECTOR}
      >
        {children}
      </MantineProvider>
    </div>
  );
};
