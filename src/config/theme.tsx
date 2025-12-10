import { createTheme, DEFAULT_THEME, MantineProvider } from "@mantine/core";
import { type ReactNode, useCallback, useMemo, useRef } from "react";
import { useTheme } from "./hooks/useTheme";

export type ThemeMode = "light" | "dark";
export type ThemePalette = {
  bg: { base: string; elevated: string; surface: string; deep: string };
  text: { primary: string; secondary: string; muted: string };
  border: { default: string; subtle: string };
  accent: string;
};
export type ThemeColorScale = [string, string, string, string, string, string, string, string, string, string];
export type ThemeColorScheme = {
  colors: Record<string, ThemeColorScale>;
  primaryColor: string;
  primaryShade: number | { light: number; dark: number };
};
export type ThemeSchemes = Record<ThemeMode, ThemeColorScheme>;

export type ColorMode = "light" | "dark" | "auto";

// UI共通値
export const ui = {
  radius: { sm: 4, md: 6, lg: 8 },
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
  font: {
    sans: '"Noto Sans JP", "Hiragino Sans", sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  transition: "150ms ease",
  alpha: (hex: string, a: number) =>
    `${hex}${Math.round(a * 255)
      .toString(16)
      .padStart(2, "0")}`,
} as const;

const THEME_ROOT_ATTR = "data-d-comments-root";
const THEME_ROOT_SELECTOR = `[${THEME_ROOT_ATTR}]`;

export const ThemedMantineProvider = ({ children }: { children: ReactNode }) => {
  const { mode, configMode, schemes, isPending, styles } = useTheme();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fallbackRoot: HTMLElement | undefined = typeof document === "undefined" ? undefined : document.documentElement;
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
      fontFamily: ui.font.sans,
      fontFamilyMonospace: ui.font.mono,
      defaultRadius: ui.radius.sm,
      primaryColor: currentScheme.primaryColor,
      primaryShade: { light: 5, dark: 5 },
      focusRing: "auto",
      colors,
    });
  }, [isPending, mode, schemes]);

  if (!theme) return null;

  const schemeProps = {
    defaultColorScheme: configMode === "auto" ? "auto" : configMode,
    forceColorScheme: mode,
  } as const;

  return (
    <div
      ref={containerRef}
      {...{ [THEME_ROOT_ATTR]: "" }}
      style={{
        display: "contents",
        color: styles.text.primary,
        backgroundColor: styles.bg.surface,
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
