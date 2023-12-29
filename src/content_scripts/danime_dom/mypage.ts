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

import * as Config from "../config";

/**
 * 作品ページの各パートに新しいタブで開くボタンを追加する
 */
export const addMenu = async () => {
  let items: NodeListOf<Element>;
  await new Promise((resolve) => {
    (function getItems() {
      items = document.querySelectorAll(".itemModule.list a");
      if (items.length <= 0) {
        setTimeout(getItems, 100);
      } else {
        resolve(null);
      }
    })();
  });

  Config.getConfig(
    "open_in_new_tab_when_clicking_show_comments_while_playing_button",
    (value) => {
      for (const item of items) {
        const partID = item?.getAttribute("href")?.replace(/[^0-9]/g, "");
        const bgColor = window.getComputedStyle(item).backgroundColor;
        const a = document.createElement("a");
        a.href = `sc_d_pc?partId=${partID}`;
        if (value) {
          a.target = "_blank";
          a.innerText = "新しいタブでコメントを表示しながら再生";
          a.addEventListener("click", (e) => {
            window.open(a.href);
            e.preventDefault();
          });
        } else {
          a.innerText = "現在のタブでコメントを表示しながら再生";
          a.addEventListener("click", () => {
            window.location.href = a.href;
          });
        }
        item.parentElement?.parentElement?.appendChild(a);
        Object.assign(
          a.style,
          { type: "text/css" },
          {
            width: "100%",
            padding: "0.4rem 1.8rem",
            textAlign: "center",
            borderTop: "1px solid rgb(224 224 224)",
            backgroundColor: bgColor,
          }
        );
      }
    }
  );
};
