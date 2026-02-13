import {
  createContext,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { defaultConfigs, getDefaultValue } from '@/config/defaults';
import { useConfig } from '@/config/hooks/useConfigs';
import { createPalette, type ThemeConfig, useTheme } from '@/config/hooks/useTheme';
import { ui } from '@/config/theme';
import { findElement } from '@/lib/dom';

export type SidebarConfig = {
  mode: ThemeConfig['mode'];
  palette: ThemeConfig['palette'];
  width: number;
  fontSize: number;
  opacity: number;
  visibility: boolean;
  showNicoru: boolean;
  scrollSmoothly: boolean;
  timingOffset: number;
  fps: number;
  alpha: (a: number) => string;
  setWidth: (width: number) => void;
  saveWidth: (width: number) => void;
};
const defaultPalette = createPalette('light');
const sidebarDefaultConfig: SidebarConfig = {
  mode: 'light',
  palette: defaultPalette,
  width: getDefaultValue('comment_area_width_px'),
  fontSize: getDefaultValue('comment_area_font_size_px'),
  opacity: getDefaultValue('comment_area_opacity_percentage'),
  visibility: getDefaultValue('show_comments_in_list'),
  showNicoru: getDefaultValue('show_nicoru_count'),
  scrollSmoothly: getDefaultValue('enable_smooth_scrolling'),
  timingOffset: getDefaultValue('comment_timing_offset'),
  fps: getDefaultValue('comment_renderer_fps'),
  alpha: (a) => ui.alpha('#F8F9FA', a),
  setWidth: () => {},
  saveWidth: () => {},
};

const SidebarContext = createContext<SidebarConfig>(sidebarDefaultConfig);
const createAlpha = (textColor: string) => (a: number) => ui.alpha(textColor, a);

export const SidebarProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const { mode, palette } = useTheme();
  const { currentValue: configWidth, save: saveWidthConfig } = useConfig('comment_area_width_px');
  const { currentValue: fontSize } = useConfig('comment_area_font_size_px');
  const { currentValue: opacity } = useConfig('comment_area_opacity_percentage');
  const { currentValue: visibility } = useConfig('show_comments_in_list');
  const { currentValue: showNicoru } = useConfig('show_nicoru_count');
  const { currentValue: scrollSmoothly } = useConfig('enable_smooth_scrolling');
  const { currentValue: timingOffset } = useConfig('comment_timing_offset');
  const { currentValue: fps } = useConfig('comment_renderer_fps');
  const [width, setWidth] = useState(configWidth);

  useEffect(() => {
    setWidth(configWidth);
  }, [configWidth]);

  const { ui_options } = defaultConfigs.comment_area_width_px;
  const handleSetWidth = useCallback(
    (w: number) => setWidth(Math.max(ui_options.min, Math.min(ui_options.max, w))),
    [ui_options.min, ui_options.max]
  );

  const value = useMemo<SidebarConfig>(
    () => ({
      mode,
      palette,
      width,
      fontSize,
      opacity,
      visibility,
      showNicoru,
      scrollSmoothly,
      timingOffset,
      fps,
      alpha: createAlpha(palette.text.primary),
      setWidth: handleSetWidth,
      saveWidth: saveWidthConfig,
    }),
    [
      mode,
      palette,
      width,
      fontSize,
      opacity,
      visibility,
      showNicoru,
      scrollSmoothly,
      timingOffset,
      fps,
      handleSetWidth,
      saveWidthConfig,
    ]
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

export const useSidebar = (): SidebarConfig => useContext(SidebarContext);

export const createSidebarStyles = (c: SidebarConfig): Record<string, CSSProperties> => ({
  header: {
    padding: `${ui.space.sm}px ${ui.space.md}px`,
    borderBottom: `1px solid ${c.alpha(0.08)}`,
    flexShrink: 0,
  },
  list: { flex: 1, minHeight: 0, overflow: 'hidden' },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    minHeight: 0,
  },
  root: {
    position: 'relative',
    height: '100%',
    display: c.visibility ? 'flex' : 'none',
    flexDirection: 'column',
    backgroundColor: c.palette.bg.base,
    color: c.palette.text.primary,
    opacity: c.opacity / 100,
    width: c.width,
    fontSize: c.fontSize,
    overflow: 'hidden',
  },
});

export const useVideoElement = (): { isPlaying: boolean; video: HTMLVideoElement | null } => {
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let cleanup: (() => void) | undefined;
    (async () => {
      const el = await findElement<HTMLVideoElement>('video');
      if (!el) return;
      setVideo(el);
      setIsPlaying(!el.paused);
      const onPlay = () => setIsPlaying(true);
      const onPause = () => setIsPlaying(false);
      el.addEventListener('play', onPlay);
      el.addEventListener('pause', onPause);
      cleanup = () => {
        el.removeEventListener('play', onPlay);
        el.removeEventListener('pause', onPause);
      };
    })();
    return () => cleanup?.();
  }, []);

  return { isPlaying, video };
};
