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

import { getConfig } from "@/config";
import { find_elements } from "./dom";

/**
 * 作品ページの各パートに新しいタブで開くボタンを追加する
 */
export const addMenu = async () => {
  const a_array = await find_elements(".itemModule.list a");
  const config = await getConfig("make_play_button_open_new_tab");

  const inner_text = config
    ? "新しいタブでコメントを表示しながら再生"
    : "現在のタブでコメントを表示しながら再生";

  for (const item of a_array) {
    const partID = item?.getAttribute("href")?.replace(/[^0-9]/g, "");
    if (!partID) continue;
    const bgColor = window.getComputedStyle(item).backgroundColor;
    const a = document.createElement("a");
    a.href = `sc_d_pc?partId=${partID}`;
    a.innerText = inner_text;
    Object.assign(
      a.style,
      { type: "text/css" },
      {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        padding: "1.4rem 1.8rem",
        borderTop: "1px solid rgb(224 224 224)",
        backgroundColor: bgColor,
      }
    );

    const target = item.parentElement?.parentElement;
    if (!target?.querySelector(`a[href="sc_d_pc?partId=${partID}"]`))
      target?.appendChild(a);

    if (config === true) {
      a.target = "_blank";
      a.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.open(a.href);
      });
    } else {
      a.addEventListener("click", () => {
        window.location.href = a.href;
      });
    }
  }
};
