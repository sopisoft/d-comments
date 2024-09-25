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

export async function addon_disable_new_window() {
  console.log("addon_disable_new_window");

  const config = await getConfig("addon_option_play_in_same_tab");
  const items = await find_elements<HTMLAnchorElement>("section.clearfix > a");

  for (const item of items) {
    const href = item.getAttribute("href");
    const partID = href?.replace(/[^0-9]/g, "");
    if (!href) continue;
    const openUrl = `https://animestore.docomo.ne.jp/animestore/sc_d_pc?partId=${partID}`;
    item.addEventListener("click", () => {
      window.open(openUrl, config ? "_self" : "_blank");
    });
    item.style.cursor = "pointer";
    item.removeAttribute("href");
  }
}
