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

import browser from "webextension-polyfill";
import { configs } from "../../options/states";
import * as Config from "../config";

const hexToRgb = (color: string) => {
  return Object.fromEntries(
    (
      (color.match(/^#?[0-9A-Fa-f]{3}([0-9A-Fa-f]{3})?$/) ? color : "000")
        .replace(/^#?(.*)$/, (_, hex) =>
          hex.length === 3 ? hex.replace(/./g, "$&$&") : hex
        )
        .match(/../g) ?? []
    ).map((c: string, i: number) => ["rgb".charAt(i), parseInt(`0x${c}`)])
  ) as { r: number; g: number; b: number };
};

const overlay =
  configs.find((config) => config.key === "comment_rendering_method")?.value ===
  "list_overlay";
const width = configs.find((config) => config.key === "comment_area_width_px")
  ?.value as number;
const height = configs.find(
  (config) => config.key === "comment_area_height_percent"
)?.value as number;
const top = configs.find((config) => config.key === "distance_from_top_percent")
  ?.value as number;
const left = configs.find(
  (config) => config.key === "distance_from_left_percent"
)?.value as number;

const { r, g, b } = hexToRgb(
  configs.find((config) => config.key === "comment_area_background_color")
    ?.value as string
);
const a = configs.find(
  (config) => config.key === "comment_area_opacity_percent"
);
const color = configs.find((config) => config.key === "comment_text_color");
const scrollBar = configs.find(
  (config) => config.key === "show_comment_scrollbar"
)?.value as boolean;

(function setRoot() {
  const rgba = `${r} ${g} ${b} / ${a}%`;
  const root = `
:root {
	--d-comments-text-color:${color};
	--d-comments-container-position:${overlay ? "absolute" : "relative"};
	--d-comments-container-z-index:${overlay ? 1000 : 1};
	--d-comments-container-width:${width}px;
	--d-comments-container-height:${overlay ? height : 100}vh;
	--d-comments-container-top:${overlay ? top : 0}%;
	--d-comments-container-left:${overlay ? left : 0}%;
	--d-comments-container-background:rgba(${rgba})
}`;
  if (window.location.pathname === "/animestore/sc_d_pc") {
    const style = document.createElement("style");
    style.id = "d-comments-style-root";
    style.innerHTML = root;
    document.getElementById("d-comments-style-root")?.remove();
    document.head.appendChild(style);
  }
})();

(function setScrollBar() {
  const scrollBar_style = `
#d-comments-container ul::-webkit-scrollbar {
	display:block;
}
#d-comments-container ul::-webkit-scrollbar-track {
	background-color: #7a787830;
}
#d-comments-container ul::-webkit-scrollbar-thumb {
	background-color: #f9fafe4a;
}`;
  const scrollBarNone = `
#d-comments-container ul::-webkit-scrollbar {
	display:none;
}`;
  if (window.location.pathname === "/animestore/sc_d_pc") {
    const style = document.createElement("style");
    style.id = "d-comments-style-scrollBar";
    const css = `${scrollBar ? scrollBar_style : scrollBarNone}`;
    style.innerHTML = css;
    document.getElementById("d-comments-style-scrollBar")?.remove();
    document.head.appendChild(style);
  }
})();

/**
 * 視聴ページで追加する要素のスタイル
 */
export const setDefaultStyle = () => {
  const style = document.createElement("style");
  style.id = "d-comments-style";
  const css = `#d-comments-container::-webkit-scrollbar { display:none; }
`;
  style.innerHTML = css;
  document.getElementById("d-comments-style")?.remove();
  document.head.appendChild(style);
};

(() => {
  if (!document.getElementById("d-comments-font")) {
    const css = `
		@import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji');
		@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@200;300;400;500;600;700;800;900');`;
    const style = document.createElement("style");
    style.id = "d-comments-font";
    style.innerHTML = css;
    document.head.appendChild(style);
  }
})();
