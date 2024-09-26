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
import { find_elements } from "@/lib/dom";

/**
 * 作品ページの各パートに新しいタブで開くボタンを追加する
 */
export const addMenu = async () => {
  console.log("addon_addMenu");

  const a_array = await find_elements("section.clearfix > a");

  for (const item of a_array) {
    const partID = item?.getAttribute("href")?.replace(/[^0-9]/g, "");
    if (!partID) continue;
    const bgColor = window.getComputedStyle(item).backgroundColor;
    const a = document.createElement("a");
    a.href = `sc_d_pc?partId=${partID}`;
    Object.assign(
      a.style,
      { type: "text/css" },
      {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "5rem",
        padding: "1.4rem 1.8rem",
        borderTop: "1px solid rgb(224 224 224)",
        backgroundColor: bgColor,
      }
    );

    const section = item.parentElement;
    const target = section?.parentElement;
    const a_exist = target?.querySelector(`a[href="sc_d_pc?partId=${partID}"]`);
    if (section && target && !a_exist) {
      target?.appendChild(a);
    } else if (!section || !target) {
      setTimeout(addMenu, 100);
      break;
    }

    getConfig("addon_option_play_in_same_tab").then((config) => {
      a.textContent = config === true ? "現在のタブで開く" : "新しいタブで開く";
      a.target = config === true ? "_self" : "_blank";
      a.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (config === true) window.open(a.href);
        else window.location.href = a.href;
      });
    });
  }
};
