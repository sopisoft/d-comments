import { useEffect, useState } from "react";
import { type ConfigKey, getConfig, watchConfig } from "@/config/";
import { findElement } from "@/lib/dom";

export type SidebarState = {
  fps: number;
  width: number;
  fontSize: number;
  bgColor: string;
  textColor: string;
  opacity: number;
  scrollSmoothly: boolean;
  visibility: boolean;
  showNicoru: boolean;
  timingOffset: number;
};

export function useVideoElement() {
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let current: HTMLVideoElement | null = null;
    let onPlay: (() => void) | undefined;
    let onPause: (() => void) | undefined;

    findElement<HTMLVideoElement>("video").then((element) => {
      if (!element) return;
      current = element;
      setVideo(element);
      setIsPlaying(!element.paused);

      onPlay = () => setIsPlaying(true);
      onPause = () => setIsPlaying(false);
      element.addEventListener("play", onPlay);
      element.addEventListener("pause", onPause);
    });

    return () => {
      if (!current) return;
      if (onPlay) current.removeEventListener("play", onPlay);
      if (onPause) current.removeEventListener("pause", onPause);
    };
  }, []);

  return { video, isPlaying };
}

export function useSidebarConfig() {
  const [state, setState] = useState<SidebarState>(Object);

  useEffect(() => {
    const w = (key: ConfigKey) => {
      watchConfig(key, (value) => {
        setState((prev) => ({ ...prev, [key]: value }));
      });
    };

    (async () => {
      const state = {
        fps: await getConfig("comment_renderer_fps"),
        width: await getConfig("comment_area_width_px"),
        fontSize: await getConfig("comment_area_font_size_px"),
        bgColor: await getConfig("comment_area_background_color"),
        textColor: await getConfig("comment_text_color"),
        opacity: await getConfig("comment_area_opacity_percentage"),
        scrollSmoothly: await getConfig("enable_smooth_scrolling"),
        visibility: await getConfig("show_comments_in_list"),
        showNicoru: await getConfig("show_nicoru_count"),
        timingOffset: await getConfig("comment_timing_offset"),
      };
      setState(state);

      w("comment_renderer_fps");
      w("comment_area_width_px");
      w("comment_area_font_size_px");
      w("comment_area_background_color");
      w("comment_text_color");
      w("comment_area_opacity_percentage");
      w("enable_smooth_scrolling");
      w("show_comments_in_list");
      w("show_nicoru_count");
      w("comment_timing_offset");
    })();
  }, []);

  return state;
}
