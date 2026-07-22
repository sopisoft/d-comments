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
    size: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20 },
    weight: { regular: 400, medium: 500, semibold: 600 },
    lineHeight: { tight: 1.25, normal: 1.5, relaxed: 1.6 },
  },
  icon: { xs: 12, sm: 14, md: 16, lg: 18, xl: 20, section: 34, sectionGlyph: 18 },
  radius: { sm: 4, md: 6, lg: 8 },
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 },
  border: { thin: 1, strong: 2 },
  control: { resizeHandle: 6 },
  layout: {
    headerHeight: 56,
    popup: { height: 600, width: 720 },
    sidebarStoryWidth: 480,
    contentMaxWidth: 900,
    videoThumbnailWidth: 140,
    formEmbedHeight: 640,
    usageHeaderHeight: 60,
    usageNavbarWidth: 300,
    usageScrollOffset: 80,
  },
  transition: { fast: '150ms ease' },
} as const;
