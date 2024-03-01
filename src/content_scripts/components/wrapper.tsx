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

import { type config, getConfig } from "@/config";
import { createRoot } from "react-dom/client";
import browser from "webextension-polyfill";
import { find_element } from "../danime/dom";
import Root from "./root";

/**
 * @description
 * This function wraps the video element and the comments area.
 */
async function wrap(): Promise<void> {
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

  // const resize_handle_id = "d-comments-resize-handle";
  // const prev_resize_handle = document.getElementById(resize_handle_id);
  // const resize_handle = prev_resize_handle ?? document.createElement("div");
  // if (!prev_resize_handle) {
  //   resize_handle.id = resize_handle_id;
  //   resize_handle.draggable = false;
  //   Object.assign(resize_handle.style, {
  //     width: "5px",
  //     height: "100%",
  //     cursor: "col-resize",
  //     borderLeft: "2px solid rgb(0, 0, 0)",
  //     borderRight: "2px solid rgb(204, 204, 204)",
  //   });
  //   wrapper.appendChild(resize_handle);
  // }

  const side_menu_id = "d-comments-side";
  const prev_side_menu = document.getElementById(side_menu_id);
  const side_menu = prev_side_menu ?? document.createElement("div");
  if (!prev_side_menu) {
    side_menu.id = side_menu_id;
    Object.assign(side_menu.style, {
      height: "100%",
      width: `${await getConfig("comment_area_width_px")}px`,
      backgroundColor: "rgb(0, 0, 0)",
      display: (await getConfig("show_comments_in_list")) ? "block" : "none",
    });
    wrapper.appendChild(side_menu);
  }

  // resize_handle.onpointerdown = (event) => {
  //   resize_handle.onpointermove = (event) => {
  //     const new_width = side_menu.offsetWidth - event.movementX;
  //     side_menu.style.width = `${new_width}px`;
  //     resize_handle.setPointerCapture(event.pointerId);
  //   };
  //   resize_handle.setPointerCapture(event.pointerId);
  // };
  // resize_handle.onpointerup = (event) => {
  //   setConfig("comment_area_width_px", side_menu.offsetWidth);
  //   resize_handle.onpointermove = null;
  //   resize_handle.releasePointerCapture(event.pointerId);
  // };

  browser.storage.onChanged.addListener((changes) => {
    for (const key in changes) {
      switch (key as config["key"]) {
        case "comment_area_width_px":
          side_menu.style.width = `${changes[key].newValue}px`;
          break;
        case "show_comments_in_list":
          side_menu.style.display = changes[key].newValue ? "block" : "none";
          break;
      }
    }
  });

  const root = createRoot(side_menu);
  root.render(<Root />);
}

export default wrap;
