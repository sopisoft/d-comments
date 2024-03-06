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
import {
  mode,
  on_mode_change,
  on_partId_change,
  on_threads_change,
  threads as getThreads,
} from "../state";
import useAnimationFrame from "./useAnimationFrame";

export function Scroll() {
  const loop = useAnimationFrame(scroll, 120);

  const virtuoso = useRef<VirtuosoHandle>(null);
  const videoEl = useRef<HTMLVideoElement | null>(null);
  const isAutoScrollEnabled = useRef(true);

  const [width, setWidth] = useState<number>();
  const [bgColor, setBgColor] = useState<string>();
  const [textColor, setTextColor] = useState<string>();
  const [opacity, setOpacity] = useState<number>();
  const [comments, setComments] = useState<nv_comment[]>();

  async function set_comments(threads?: Threads) {
    const t = threads || getThreads();
    if (t && t.threads.length > 0)
      return await getComments(t).then((nc) => {
        if (!Object.is(comments, nc)) {
          setComments(nc);
          return nc;
        }
      });
  }

  async function start() {
    const _comments = await set_comments();
    if (_comments) console.log("list_started", "comments", _comments);
    getConfig("comment_area_width_px").then((width) => {
      setWidth(width);
    });
    find_element<HTMLVideoElement>("video").then((video) => {
      videoEl.current = video;
      videoEl.current?.addEventListener("play", loop.start);
      videoEl.current?.addEventListener("pause", loop.pause);
      videoEl.current?.addEventListener("ended", end);
    });
    loop.start();
  }

  function end() {
    console.log("list_ended");
    setComments([]);
    loop.stop();
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
    if (!comments || !isAutoScrollEnabled.current) return;
    if (videoEl.current && !videoEl.current.paused) {
      const currentTimeMs = videoEl.current.currentTime * 1000;
      const id = get_item_id(currentTimeMs);
      if (virtuoso.current && typeof id === "number") {
        virtuoso.current.scrollToIndex({
          index: id,
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
    on_mode_change(async (_prev, next) => {
      const threads = getThreads();
      if (next.includes("list") && threads && threads.threads.length > 0) {
        console.log("list_mode_changed", next, "threads", threads);
        start();
      } else end();
    });
    on_threads_change(async (_prev, next) => {
      const modes = mode();
      if (modes.includes("list") && next && next?.threads.length > 0) {
        console.log("list_threads_changed", next, "mode", modes);
        start();
      } else end();
    });
    on_partId_change(() => {
      end();
    });
    browser.storage.onChanged.addListener(async (changes) => {
      for (const key in changes) {
        switch (key as config_keys) {
          case "show_owner_comments":
            await set_comments();
            break;
          case "show_main_comments":
            await set_comments();
            break;
          case "show_easy_comments":
            await set_comments();
            break;
          case "comment_area_width_px":
            setWidth(changes[key].newValue);
            break;
          case "comment_area_background_color":
            setBgColor(changes[key].newValue);
            break;
          case "comment_text_color":
            setTextColor(changes[key].newValue);
            break;
          case "comment_area_opacity_percentage":
            setOpacity(changes[key].newValue);
            break;
          case "enable_auto_scroll":
            isAutoScrollEnabled.current = changes[key].newValue;
            break;
        }
      }
    });
  }, []);

  return (
    <ThemeProvider>
      <div
        className="flex flex-col h-full max-h-svh"
        style={{
          display: (comments?.length ?? 0) > 0 ? "block" : "none",
          backgroundColor: bgColor,
          color: textColor,
          opacity: (opacity ?? 100) / 100,
          maxWidth: `${width}px`,
          minWidth: `${width}px`,
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
