/*
    This file is part of d-comments.

    d-comments is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    d-comments is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with d-comments.  If not, see <https://www.gnu.org/licenses/>.
*/

import { ThemeProvider } from "@/components/theme-provider";
import { type config_keys, getConfig } from "@/config";
import { useEffect, useRef, useState } from "react";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import browser from "webextension-polyfill";
import { getComments } from "../comments";
import { find_element } from "../danime/dom";
import { on_partId_change, on_threads_change } from "../state";
import useAnimationFrame from "./useAnimationFrame";

export function Scroll() {
  const loop = useAnimationFrame(scroll, 120);

  const videoEl = useRef<HTMLVideoElement | null>(null);
  const parent = useRef<HTMLDivElement | null>(null);
  const isParentHovered = useRef(false);
  const virtuoso = useRef<VirtuosoHandle>(null);
  const isAutoScrollEnabled = useRef(true);

  const [initialized, setInitialized] = useState(false);

  const [visibility, setVisibility] = useState(false);
  const [width, setWidth] = useState<number>();
  const [fontSize, setFontSize] = useState<number>();
  const [bgColor, setBgColor] = useState<string>();
  const [textColor, setTextColor] = useState<string>();
  const [opacity, setOpacity] = useState<number>();
  const [comments, setComments] = useState<nv_comment[]>();

  async function set_comments() {
    const new_comments = await getComments();
    if (!new_comments || new_comments.length === 0) return;
    if (new_comments !== comments) {
      setComments(new_comments);
      return new_comments;
    }
  }

  async function init() {
    if (initialized) return;
    return Promise.all([
      set_comments(),
      getConfig("comment_area_width_px").then((width) => {
        setWidth(width);
      }),
      getConfig("comment_area_font_size_px").then((size) => {
        setFontSize(size);
      }),
      find_element<HTMLVideoElement>("video").then((video) => {
        videoEl.current = video;
        videoEl.current?.addEventListener("play", loop.start);
        videoEl.current?.addEventListener("pause", loop.pause);
      }),
      loop.start(),
    ]).then(() => {
      setInitialized(true);
    });
  }

  function get_item_id(vposMs: number) {
    if (!comments) return;
    let left = 0;
    let right = comments.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (comments[mid].vposMs === vposMs) return mid;
      if (comments[mid].vposMs < vposMs) left = mid + 1;
      else right = mid - 1;
    }
    return right;
  }

  function scroll() {
    if (!comments || !isAutoScrollEnabled.current || isParentHovered.current)
      return;
    if (videoEl.current && !videoEl.current.paused) {
      const currentTimeMs = videoEl.current.currentTime * 1000;
      const id = get_item_id(currentTimeMs);
      if (virtuoso.current && id) {
        virtuoso.current.scrollToIndex({
          index: id,
          align: "center",
          behavior: "smooth",
        });
      }
    }
  }

  useEffect(() => {
    getConfig("comment_area_background_color").then((color) => {
      setBgColor(color);
    });
    getConfig("comment_text_color").then((color) => {
      setTextColor(color);
    });
    getConfig("comment_area_opacity_percentage").then((opacity) => {
      setOpacity(opacity);
    });
    getConfig("enable_auto_scroll").then((config) => {
      isAutoScrollEnabled.current = config;
    });
    on_threads_change(() => {
      set_comments();
    });
    on_partId_change(() => {});

    parent.current?.addEventListener("mouseenter", () => {
      isAutoScrollEnabled.current = false;
    });
    parent.current?.addEventListener("mouseleave", () => {
      isAutoScrollEnabled.current = true;
    });
    isParentHovered.current = parent.current?.matches(":hover") ?? false;

    browser.storage.onChanged.addListener(async (changes) => {
      for (const key in changes) {
        switch (key as config_keys) {
          case "show_owner_comments":
            set_comments();
            break;
          case "show_main_comments":
            set_comments();
            break;
          case "show_easy_comments":
            set_comments();
            break;
          case "comment_area_width_px":
            setWidth(Number(changes[key].newValue));
            break;
          case "comment_area_font_size_px":
            setFontSize(Number(changes[key].newValue));
            break;
          case "comment_area_background_color":
            setBgColor(changes[key].newValue as string);
            break;
          case "comment_text_color":
            setTextColor(changes[key].newValue as string);
            break;
          case "comment_area_opacity_percentage":
            setOpacity(Number(changes[key].newValue));
            break;
          case "enable_auto_scroll":
            if (typeof changes[key].newValue === "boolean") {
              isAutoScrollEnabled.current = changes[key].newValue;
            }
            break;
          case "show_comments_in_list": {
            changes[key].newValue ? setVisibility(true) : setVisibility(false);
            break;
          }
        }
      }
    });

    init();
  });

  return (
    <ThemeProvider>
      <div
        className="flex flex-col h-full max-h-svh"
        ref={parent}
        style={{
          display: visibility
            ? "block"
            : (comments?.length ?? 0) > 0
              ? "block"
              : "none",
          backgroundColor: bgColor,
          color: textColor,
          opacity: (opacity ?? 100) / 100,
          maxWidth: `${width}px`,
          minWidth: `${width}px`,
          fontSize: `${fontSize}px`,
        }}
      >
        <Virtuoso
          ref={virtuoso}
          data={comments}
          className="w-full h-full"
          components={{
            Footer: () => {
              return (
                <div
                  style={{
                    padding: "1rem",
                    textAlign: "center",
                  }}
                >
                  最後のコメントです
                </div>
              );
            },
          }}
          itemContent={(index, comment) => (
            <span
              key={index}
              data-vpos={comment?.vposMs}
              style={{
                display: "block",
                width: "100%",
                padding: "0.3rem",
                borderBottom: "1px solid #ccc",
              }}
            >
              {comment?.body}
            </span>
          )}
        />
      </div>
    </ThemeProvider>
  );
}

export default Scroll;
