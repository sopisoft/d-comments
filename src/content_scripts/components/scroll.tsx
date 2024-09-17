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
import { sortComments } from "../comments";
import { find_element } from "../danime/dom";
import {
  threads as getThreads,
  on_partId_change,
  on_threads_change,
} from "../state";
import useAnimationFrame from "./useAnimationFrame";

export function Scroll() {
  const loop = useAnimationFrame(scroll, 120);

  const videoEl = useRef<HTMLVideoElement | null>(null);
  const parent = useRef<HTMLDivElement | null>(null);
  const isParentHovered = useRef(false);
  const virtuoso = useRef<VirtuosoHandle>(null);
  const isAutoScrollEnabled = useRef(true);

  const [isInitialized, setIsInitialized] = useState(false);

  const [visibility, setVisibility] = useState(false);
  const [width, setWidth] = useState<number>();
  const [fontSize, setFontSize] = useState<number>();
  const [bgColor, setBgColor] = useState<string>();
  const [textColor, setTextColor] = useState<string>();
  const [opacity, setOpacity] = useState<number>();
  const [comments, setComments] = useState<nv_comment[]>([]);

  function get_item_id(vposMs: number) {
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
    if (!isAutoScrollEnabled.current || isParentHovered.current) return;
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

  async function flatten_comments(threads: Threads): Promise<nv_comment[]> {
    const owner = await getConfig("show_owner_comments");
    const main = await getConfig("show_main_comments");
    const easy = await getConfig("show_easy_comments");

    return threads.threads
      .filter((thread) => {
        if (thread.fork === "owner") return owner;
        if (thread.fork === "main") return main;
        if (thread.fork === "easy") return easy;
        return false;
      })
      .flatMap((thread) => thread.comments);
  }

  async function set_comments() {
    const threads = getThreads();
    if (!threads) return;

    const new_comments = await sortComments(await flatten_comments(threads));
    if (new_comments.length !== comments.length) {
      setComments(new_comments);
    }

    if (await getConfig("show_comments_in_list")) {
      setVisibility(true);
    }
  }

  on_threads_change(async (_, next) => {
    if (!next) return;
    const old_comments = comments;
    const new_comments = await sortComments(await flatten_comments(next));

    if (!Object.is(old_comments, new_comments)) {
      console.log("on_threads_change_scroll", new_comments.length);
      setComments(new_comments);
    }
  });

  on_partId_change(async () => {
    setComments([]);
    console.log("on_partId_change_scroll", comments);
  });

  browser.storage.onChanged.addListener(async (changes) => {
    for (const key in changes) {
      switch (key as config_keys) {
        case "show_owner_comments":
          await set_comments();
          break;
        case "show_main_comments":
          break;
        case "show_easy_comments":
          await set_comments();
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

  useEffect(() => {
    parent.current?.addEventListener("mouseenter", () => {
      isAutoScrollEnabled.current = false;
    });
    parent.current?.addEventListener("mouseleave", () => {
      isAutoScrollEnabled.current = true;
    });
    isParentHovered.current = parent.current?.matches(":hover") ?? false;
  }, []);

  useEffect(() => {
    if (isInitialized) return;

    (async () => {
      setWidth(await getConfig("comment_area_width_px"));
      setFontSize(await getConfig("comment_area_font_size_px"));
      setBgColor(await getConfig("comment_area_background_color"));
      setTextColor(await getConfig("comment_text_color"));
      setOpacity(await getConfig("comment_area_opacity_percentage"));
      isAutoScrollEnabled.current = await getConfig("enable_auto_scroll");
      setVisibility(await getConfig("show_comments_in_list"));

      videoEl.current = await find_element<HTMLVideoElement>("video");
      videoEl.current?.addEventListener("play", loop.start);
      videoEl.current?.addEventListener("pause", loop.pause);
      if (!videoEl.current?.paused) loop.start();
    })();

    setIsInitialized(true);
  }, [isInitialized, loop]);

  set_comments();

  return (
    <ThemeProvider>
      <div
        className="flex flex-col h-full max-h-svh"
        ref={parent}
        style={{
          display: visibility ? "block" : "none",
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
            Header: () => {
              return (
                <div
                  className={`flex flex-row justify-center items-center gap-4 ${comments.length === 0 ? "p-4 text-center" : "hidden"}`}
                >
                  {comments.length === 0 && (
                    <>
                      コメントがありません
                      <button
                        type="button"
                        className="bg-black text-white rounded border border-white px-2 py-1"
                        onClick={() => setVisibility(false)}
                      >
                        閉じる
                      </button>
                    </>
                  )}
                </div>
              );
            },
            Footer: () => {
              return (
                <div
                  className={comments.length > 0 ? "p-4 text-center" : "hidden"}
                >
                  {comments.length > 0 && "最後のコメントです"}
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
