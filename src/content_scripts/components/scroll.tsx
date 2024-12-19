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
import { Button } from "@/components/ui/button";
import { type config_keys, getConfig } from "@/config";
import { find_element } from "@/lib/dom";
import { MessageSquare, Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Virtuoso, type VirtuosoHandle } from "react-virtuoso";
import browser from "webextension-polyfill";
import { sortComments } from "../comments";
import { threads as getThreads, on_threads_change } from "../state";
import Dialog from "./optionsDialog";
import useAnimationFrame from "./useAnimationFrame";

export function Scroll() {
  const loop = useAnimationFrame(scroll, 120);

  const videoEl = useRef<HTMLVideoElement | null>(null);
  const parent = useRef<HTMLDivElement | null>(null);
  const isParentHovered = useRef(false);
  const virtuoso = useRef<VirtuosoHandle>(null);
  const isAutoScrollEnabled = useRef(true);

  const [visibility, setVisibility] = useState(false);
  const [show_nicoru, setShowNicoru] = useState(false);
  const [show_vpos, setShowVpos] = useState(false);
  const [width, setWidth] = useState<number>();
  const [fontSize, setFontSize] = useState<number>();
  const [bgColor, setBgColor] = useState<string>();
  const [textColor, setTextColor] = useState<string>();
  const [opacity, setOpacity] = useState<number>();
  const [comments, setComments] = useState<nv_comment[]>([]);
  const [timing_offset, setTimingOffset] = useState<number>(0);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  function scroll() {
    if (!isAutoScrollEnabled.current || isParentHovered.current) return;
    if (videoEl.current && !videoEl.current.paused) {
      const currentTimeMs = videoEl.current.currentTime * 1000;
      if (virtuoso.current) {
        virtuoso.current.scrollToIndex({
          index: comments.findIndex(
            (c) => c.vposMs > currentTimeMs + timing_offset
          ),
          align: "end",
        });
      }
    }
  }

  useEffect(() => {
    parent.current?.addEventListener("mouseenter", () => {
      isAutoScrollEnabled.current = false;
    });
    parent.current?.addEventListener("mouseleave", () => {
      isAutoScrollEnabled.current = true;
    });
    isParentHovered.current = parent.current?.matches(":hover") ?? false;

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

      if (!threads) setComments([]);
      else setComments(await sortComments(await flatten_comments(threads)));

      if (await getConfig("show_comments_in_list")) {
        setVisibility(true);
      }
    }

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
            isAutoScrollEnabled.current = await getConfig("enable_auto_scroll");
            break;
          case "show_comments_in_list": {
            setVisibility(await getConfig("show_comments_in_list"));
            break;
          }
          case "show_nicoru_count": {
            setShowNicoru(await getConfig("show_nicoru_count"));
            break;
          }
          case "show_comment_vpos": {
            setShowVpos(await getConfig("show_comment_vpos"));
            break;
          }
          case "comment_timing_offset": {
            setTimingOffset(Number(changes[key].newValue));
            break;
          }
        }
      }
    });
    on_threads_change(async () => {
      console.log("on_threads_change_scroll");
      await set_comments();
    });

    set_comments();
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
      setShowNicoru(await getConfig("show_nicoru_count"));
      setShowVpos(await getConfig("show_comment_vpos"));
      setTimingOffset(await getConfig("comment_timing_offset"));

      videoEl.current = await find_element<HTMLVideoElement>("video");
      videoEl.current?.addEventListener("play", loop.start);
      videoEl.current?.addEventListener("pause", loop.pause);
      if (!videoEl.current?.paused) loop.start();
    })();

    setIsInitialized(true);
  }, [isInitialized, loop]);

  function nicoru_color(nicoru: number) {
    const nicoruLv0 = "rgba(255, 216, 66, 0)";
    const nicoruLv1 = "rgba(252, 216, 66, 0.102)";
    const nicoruLv2 = "rgba(252, 216, 66, 0.2)";
    const nicoruLv3 = "rgba(252, 216, 66, 0.4)";
    const nicoruLv4 = "rgba(252, 216, 66, 0.6)";
    if (nicoru === 0) return nicoruLv0;
    if (nicoru < 6) return nicoruLv1;
    if (nicoru < 11) return nicoruLv2;
    if (nicoru < 21) return nicoruLv3;
    return nicoruLv4;
  }

  function vpos_to_time(vpos: number) {
    const minutes = Math.floor(vpos / 60000);
    const seconds = Math.floor((vpos % 60000) / 1000);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function CommentWithVpos({ comment }: { comment: nv_comment }) {
    return (
      <div className="flex flex-col gap-1">
        <span>{comment.body}</span>
        <span className="text-xs">{vpos_to_time(comment.vposMs)}</span>
      </div>
    );
  }
  function CommentItemWithNicoru({ comment }: { comment: nv_comment }) {
    return (
      <div className="grid grid-cols-[1fr,auto] gap-2 items-center">
        {show_vpos ? <CommentWithVpos comment={comment} /> : comment.body}
        <span className="flex flex-col p-1 items-center">
          <svg
            className="size-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            style={{
              filter: "grayscale(100%)",
            }}
          >
            <title>Nicoru Icon</title>
            <text
              x="50%"
              y="50%"
              dominant-baseline="middle"
              text-anchor="middle"
            >
              😃
            </text>
          </svg>
          <span className="text-xs">{comment.nicoruCount}</span>
        </span>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <div
        className="flex flex-col h-full max-h-svh"
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
        <div className="flex flex-row justify-around items-center gap-4 p-1 border-b border-gray-300">
          {comments.length > 0 && (
            <div className="flex flex-row items-center gap-2">
              <MessageSquare className="size-4" />
              {comments.length}
            </div>
          )}
          <Button
            className="p-2 aspect-square"
            onClick={() => setIsDialogOpen(true)}
          >
            <Settings className="size-4" />
          </Button>
          <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
        </div>
        <div ref={parent} className="w-full h-full">
          <Virtuoso
            ref={virtuoso}
            data={comments}
            style={{
              backgroundColor:
                show_nicoru && comments.length > 0
                  ? "rgb(255, 255, 255)"
                  : "transparent",
              color: show_nicoru && comments.length > 0 ? "black" : "inherit",
            }}
            components={{
              Header: () => {
                return (
                  <div
                    className={`flex flex-row justify-center items-center gap-4 ${comments.length === 0 ? "p-4 text-center" : "hidden"}`}
                  >
                    {comments.length === 0 && (
                      <>
                        表示できるコメントがありません
                        <Button onClick={() => setVisibility(false)}>
                          閉じる
                        </Button>
                      </>
                    )}
                  </div>
                );
              },
              Footer: () => {
                return (
                  <div
                    className={
                      comments.length > 0 ? "p-4 text-center" : "hidden"
                    }
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
                className="block w-full p-1 border-b border-gray-300"
                style={{
                  backgroundColor: show_nicoru
                    ? nicoru_color(comment.nicoruCount)
                    : "transparent",
                }}
              >
                {show_nicoru ? (
                  <CommentItemWithNicoru comment={comment} />
                ) : show_vpos ? (
                  <CommentWithVpos comment={comment} />
                ) : (
                  comment.body
                )}
              </span>
            )}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Scroll;
