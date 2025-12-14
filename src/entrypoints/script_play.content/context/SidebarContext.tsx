import {
  type CSSProperties,
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { type ConfigKey, defaultConfigs, getDefaultValue } from "@/config/defaults";
import { useConfigs } from "@/config/hooks/useConfigs";
import { createPalette, type ThemeConfig, useTheme } from "@/config/hooks/useTheme";
import { setConfig } from "@/config/storage";
import { ui } from "@/config/theme";
import { findElement } from "@/lib/dom";

type LayoutState = { width: number; fontSize: number; opacity: number };
type FeatureState = {
  visibility: boolean;
  showNicoru: boolean;
  scrollSmoothly: boolean;
  timingOffset: number;
  fps: number;
};

export type SidebarConfig = {
  mode: ThemeConfig["mode"];
  palette: ThemeConfig["palette"];
  alpha: (a: number) => string;
  setWidth: (width: number) => void;
  saveWidth: () => void;
} & LayoutState &
  FeatureState;

const defaultLayout: LayoutState = {
  width: getDefaultValue("comment_area_width_px"),
  fontSize: getDefaultValue("comment_area_font_size_px"),
  opacity: getDefaultValue("comment_area_opacity_percentage"),
};
const defaultFeatures: FeatureState = {
  visibility: getDefaultValue("show_comments_in_list"),
  showNicoru: getDefaultValue("show_nicoru_count"),
  scrollSmoothly: getDefaultValue("enable_smooth_scrolling"),
  timingOffset: getDefaultValue("comment_timing_offset"),
  fps: getDefaultValue("comment_renderer_fps"),
};
const defaultPalette = createPalette("light");
const sidebarDefaultConfig: SidebarConfig = {
  mode: "light",
  palette: defaultPalette,
  ...defaultLayout,
  ...defaultFeatures,
  alpha: (a) => ui.alpha("#F8F9FA", a),
  setWidth: () => {},
  saveWidth: () => {},
};

const SidebarContext = createContext<SidebarConfig>(sidebarDefaultConfig);
const createAlpha = (textColor: string) => (a: number) => ui.alpha(textColor, a);
const layoutKeys: ConfigKey[] = [
  "comment_area_width_px",
  "comment_area_font_size_px",
  "comment_area_opacity_percentage",
];
const featureKeys: ConfigKey[] = [
  "show_comments_in_list",
  "show_nicoru_count",
  "enable_smooth_scrolling",
  "comment_timing_offset",
  "comment_renderer_fps",
];

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const { mode, palette } = useTheme();
  const [layout, setLayout] = useState<LayoutState>(defaultLayout);
  const [features, setFeatures] = useState<FeatureState>(defaultFeatures);
  const { values: lv } = useConfigs(layoutKeys);
  const { values: fv } = useConfigs(featureKeys);

  useEffect(() => {
    setLayout({
      width: lv.comment_area_width_px,
      fontSize: lv.comment_area_font_size_px,
      opacity: lv.comment_area_opacity_percentage,
    });
  }, [lv]);
  useEffect(() => {
    setFeatures({
      visibility: fv.show_comments_in_list,
      showNicoru: fv.show_nicoru_count,
      scrollSmoothly: fv.enable_smooth_scrolling,
      timingOffset: fv.comment_timing_offset,
      fps: fv.comment_renderer_fps,
    });
  }, [fv]);

  const { ui_options } = defaultConfigs.comment_area_width_px;
  const handleSetWidth = useCallback(
    (w: number) =>
      setLayout((l) => ({
        ...l,
        width: Math.max(ui_options.min, Math.min(ui_options.max, w)),
      })),
    [ui_options.min, ui_options.max]
  );
  const handleSaveWidth = useCallback(
    () =>
      setLayout((l) => {
        setConfig("comment_area_width_px", l.width);
        return l;
      }),
    []
  );

  const value = useMemo<SidebarConfig>(
    () => ({
      mode,
      palette,
      ...layout,
      ...features,
      alpha: createAlpha(palette.text.primary),
      setWidth: handleSetWidth,
      saveWidth: handleSaveWidth,
    }),
    [mode, palette, layout, features, handleSetWidth, handleSaveWidth]
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

export const useSidebar = (): SidebarConfig => useContext(SidebarContext);

export const createSidebarStyles = (c: SidebarConfig): Record<string, CSSProperties> => ({
  root: {
    position: "relative",
    height: "100%",
    display: c.visibility ? "flex" : "none",
    flexDirection: "column",
    backgroundColor: c.palette.bg.base,
    color: c.palette.text.primary,
    opacity: c.opacity / 100,
    width: c.width,
    fontSize: c.fontSize,
    overflow: "hidden",
  },
  header: {
    padding: `${ui.space.sm}px ${ui.space.md}px`,
    borderBottom: `1px solid ${c.alpha(0.08)}`,
    flexShrink: 0,
  },
  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    minHeight: 0,
  },
  list: { flex: 1, minHeight: 0, overflow: "hidden" },
});

export const useVideoElement = () => {
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    (async () => {
      const el = await findElement<HTMLVideoElement>("video");
      if (!el) return;
      setVideo(el);
      setIsPlaying(!el.paused);
      const onPlay = () => setIsPlaying(true);
      const onPause = () => setIsPlaying(false);
      el.addEventListener("play", onPlay);
      el.addEventListener("pause", onPause);
      cleanup = () => {
        el.removeEventListener("play", onPlay);
        el.removeEventListener("pause", onPause);
      };
    })();
    return () => cleanup?.();
  }, []);

  return { video, isPlaying };
};
