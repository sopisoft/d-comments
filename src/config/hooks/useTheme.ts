import { useEffect, useMemo, useState } from "react";
import { adjustColor, readableTextOnHex } from "@/lib/color";
import { getConfig, watchConfig } from "../storage";
import type { ThemeColorScale, ThemeMode, ThemePalette, ThemeSchemes } from "../theme";
import { type ColorMode, ui } from "../theme";

export type ThemeConfig = {
  mode: ThemeMode;
  configMode: ColorMode;
  palette: ThemePalette;
  schemes: ThemeSchemes;
  styles: ReturnType<typeof createStyles>;
  isPending: boolean;
};
type ThemeState = {
  configMode: ColorMode;
  systemMode: ThemeMode;
  isPending: boolean;
};

const ACCENT = "#EB5528";
const getSystemMode = (): ThemeMode => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
const resolveMode = (s: ThemeState): ThemeMode => (s.configMode === "auto" ? s.systemMode : s.configMode);
const isColorMode = (v: unknown): v is ColorMode => v === "light" || v === "dark" || v === "auto";

const BASE_PALETTES: Record<ThemeMode, Omit<ThemePalette, "accent">> = {
  light: {
    bg: {
      base: "#FFFFFF",
      elevated: "#F8F9FA",
      surface: "#F1F3F5",
      deep: "#E9ECEF",
    },
    text: { primary: "#212529", secondary: "#495057", muted: "#6C757D" },
    border: { default: "#CED4DA", subtle: "#DEE2E6" },
  },
  dark: {
    bg: {
      base: "#1A1B1E",
      elevated: "#25262B",
      surface: "#2C2E33",
      deep: "#373A40",
    },
    text: { primary: "#F8F9FA", secondary: "#DEE2E6", muted: "#ADB5BD" },
    border: { default: "#495057", subtle: "#3D4349" },
  },
};

export const createPalette = (mode: ThemeMode): ThemePalette => ({
  ...BASE_PALETTES[mode],
  accent: ACCENT,
});
const ACCENT_STOPS = [0.9, 0.7, 0.5, 0.35, 0.2, 0, -0.12, -0.24, -0.38, -0.5];
const createAccentScale = (accent: string): ThemeColorScale =>
  ACCENT_STOPS.map((d) => adjustColor(accent, d)) as ThemeColorScale;
const FIXED_SCHEMES: ThemeSchemes = {
  light: {
    colors: { accent: createAccentScale(ACCENT) },
    primaryColor: "accent",
    primaryShade: { light: 5, dark: 5 },
  },
  dark: {
    colors: { accent: createAccentScale(ACCENT) },
    primaryColor: "accent",
    primaryShade: { light: 5, dark: 5 },
  },
};

const createStyles = (p: ThemePalette) => {
  const pair = (bg: string) => ({
    background: bg,
    foreground: readableTextOnHex(bg),
  });
  const bgPairs = {
    base: pair(p.bg.base),
    elevated: pair(p.bg.elevated),
    surface: pair(p.bg.surface),
    deep: pair(p.bg.deep),
  } as const;
  const accentPair = pair(p.accent);
  return {
    bg: p.bg,
    text: p.text,
    border: p.border,
    accent: p.accent,
    accentText: accentPair.foreground,
    pairs: { accent: accentPair, bg: bgPairs },
    inputStyles: {
      input: {
        background: bgPairs.surface.background,
        color: bgPairs.surface.foreground,
        borderColor: p.border.default,
      },
    },
    panel: {
      background: bgPairs.elevated.background,
      border: `1px solid ${p.border.default}`,
      borderRadius: ui.radius.md,
      text: bgPairs.elevated.foreground,
    },
  } as const;
};

export function useTheme(): ThemeConfig {
  const [state, setState] = useState<ThemeState>({
    configMode: "auto",
    systemMode: getSystemMode(),
    isPending: true,
  });

  useEffect(() => {
    let active = true;
    getConfig("theme_color_mode").then((m) => {
      if (active)
        setState((p) => ({
          ...p,
          configMode: isColorMode(m) ? m : "auto",
          isPending: false,
        }));
    });
    const modeWatcher = watchConfig("theme_color_mode", (m) =>
      setState((p) => ({ ...p, configMode: isColorMode(m) ? m : p.configMode }))
    );
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => setState((p) => ({ ...p, systemMode: e.matches ? "dark" : "light" }));
    mq.addEventListener("change", onChange);
    return () => {
      active = false;
      modeWatcher.then((d) => d?.());
      mq.removeEventListener("change", onChange);
    };
  }, []);

  return useMemo(() => {
    const mode = resolveMode(state);
    const palette = createPalette(mode);
    return {
      mode,
      configMode: state.configMode,
      palette,
      schemes: FIXED_SCHEMES,
      styles: createStyles(palette),
      isPending: state.isPending,
    };
  }, [state]);
}
