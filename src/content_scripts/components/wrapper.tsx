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

import { createRoot } from "react-dom/client";
import { find_element } from "../danime/dom";
import Scroll from "./scroll";

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
      maxWidth: "100%",
      width: "100%",
      maxHeight: "100%",
      height: "100%",
      overflow: "hidden",
    });

    const parent = video.parentElement;
    const parent_parent = parent?.parentElement;
    if (parent_parent && document.body.contains(parent_parent)) {
      parent.before(wrapper);
      wrapper.append(parent);
    } else {
      setTimeout(wrap, 100);
      return;
    }
  }

  const side_menu_id = "d-comments-side";
  const prev_side_menu = document.getElementById(side_menu_id);
  const side_menu = prev_side_menu ?? document.createElement("div");
  if (!prev_side_menu) {
    side_menu.id = side_menu_id;
    Object.assign(side_menu.style, {
      backgroundColor: "rgb(0, 0, 0)",
      zIndex: "10",
    });
    wrapper.appendChild(side_menu);
  }

  const root = createRoot(side_menu);
  root.render(<Scroll />);
}

export default wrap;
