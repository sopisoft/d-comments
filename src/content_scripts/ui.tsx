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
import { type config, getConfig, setConfig } from "@/config";
import { useContext, useState } from "react";
import { createRoot } from "react-dom/client";
import browser from "webextension-polyfill";
import type { Context } from "./context";
import { ctx as ContextProvider } from "./context";
import { find_element } from "./danime/dom";

function Menu() {
  const [bgColor, setBgColor] = useState<string>("black");
  const [textColor, setTextColor] = useState<string>("white");
  const [opacity, setOpacity] = useState<number>(100);

  const [mode, setMode] = useState<Context["mode"]>("list");
  const [videoId, setVideoId] = useState<VideoId>();
  const [workId, setWorkId] = useState<string>();
  const [threads, setThreads] = useState<Threads>();
  const [nvComment, setNvComment] = useState<nv_comment>();

  getConfig("comment_area_background_color", (value) => {
    setBgColor(value as string);
  });
  getConfig("comment_text_color", (value) => {
    setTextColor(value as string);
  });
  getConfig("comment_area_opacity_percentage", (value) => {
    setOpacity(value as number);
  });

  browser.storage.onChanged.addListener((changes) => {
    for (const key in changes) {
      switch (key as config["key"]) {
        case "comment_area_background_color":
          setBgColor(changes[key].newValue);
          break;
        case "comment_text_color":
          setTextColor(changes[key].newValue);
          break;
        case "comment_area_opacity_percentage":
          setOpacity(changes[key].newValue);
          break;
      }
    }
  });

  return (
    <ContextProvider.Provider
      value={{
        mode,
        setMode,
        videoId,
        setVideoId,
        workId,
        setWorkId,
        threads,
        setThreads,
        nvComment,
        setNvComment,
      }}
    >
      <div
        className="w-[32rem] h-full"
        style={{
          backgroundColor: bgColor,
          color: textColor,
          opacity: opacity / 100,
        }}
      >
        <link
          rel="stylesheet"
          href={browser.runtime.getURL("assets/css/index.css")}
        />
        <ThemeProvider>
          <div className="h-full p-4 bg-transparent">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">d-comments</h1>
            </div>
          </div>
        </ThemeProvider>
      </div>
    </ContextProvider.Provider>
  );
}

const uiInit = async () => {
  const video = await find_element("video");
  if (!video) return;

  const wrapper_id = "d-comments-wrapper";
  const prev_wrapper = document.getElementById(wrapper_id);
  const wrapper = prev_wrapper ?? document.createElement("div");
  if (!prev_wrapper) {
    wrapper.id = wrapper_id;
    Object.assign(wrapper.style, {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      height: "100%",
      overflow: "hidden",
    });
    video.parentElement?.before(wrapper);
    wrapper.append(video.parentElement as HTMLElement);
  }

  const resize_handle_id = "d-comments-resize-handle";
  const prev_resize_handle = document.getElementById(resize_handle_id);
  const resize_handle = prev_resize_handle ?? document.createElement("div");
  if (!prev_resize_handle) {
    resize_handle.id = resize_handle_id;
    Object.assign(resize_handle.style, {
      width: "5px",
      height: "100%",
      cursor: "col-resize",
      borderLeft: "1px solid #ccc",
      WebkitTouchCallout: "none",
      userSelect: "none",
      "&:hover, &:active": {
        borderStyle: "double",
      },
    });
    wrapper.appendChild(resize_handle);
  }

  const side_menu_id = "d-comments-side";
  const prev_side_menu = document.getElementById(side_menu_id);
  const side_menu = prev_side_menu ?? document.createElement("div");
  if (!prev_side_menu) {
    side_menu.id = side_menu_id;
    Object.assign(side_menu.style, {
      height: "100%",
      width: `${await getConfig("comment_area_width_px")}px`,
      backgroundColor: "rgb(0, 0, 0)",
    });
    wrapper.appendChild(side_menu);
  }

  resize_handle.onpointermove = (event) => {
    if (event.buttons) {
      const new_width = side_menu.offsetWidth - event.movementX;
      side_menu.style.width = `${new_width}px`;
      resize_handle.draggable = false;
      resize_handle.setPointerCapture(event.pointerId);
      setConfig("comment_area_width_px", new_width);
    }
  };

  browser.storage.onChanged.addListener((changes) => {
    for (const key in changes) {
      if (key === "comment_area_width_px") {
        side_menu.style.width = `${changes[key].newValue}px`;
      }
    }
  });

  const root = createRoot(side_menu);
  root.render(<Menu />);
};

export default uiInit;
