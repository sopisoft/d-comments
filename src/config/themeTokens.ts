export type ThemeMode = 'light' | 'dark';
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

export type ColorMode = 'light' | 'dark' | 'auto';

export const ui = {
  alpha: (hex: string, a: number) =>
    `${hex}${Math.round(a * 255)
      .toString(16)
      .padStart(2, '0')}`,
  font: {
    sans: '"Noto Sans JP", "Hiragino Sans", sans-serif',
    mono: '"JetBrains Mono", monospace',
  },
  radius: { sm: 4, md: 6, lg: 8 },
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
  transition: '150ms ease',
} as const;
