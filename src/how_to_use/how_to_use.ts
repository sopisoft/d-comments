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

let opend: boolean | undefined = false;

export async function openHowToUseIfNotRead() {
  const read_flag_key = "read_how_to_use";
  const latest_how_to_use_version = "1.0.1";

  const isHowToUseRead: boolean =
    (await browser.storage.local.get(read_flag_key))[read_flag_key] ===
    latest_how_to_use_version;

  if (!isHowToUseRead && !opend) {
    opend = true;
    browser.tabs
      .create({
        url: browser.runtime.getURL("how_to_use/how_to_use.html"),
      })
      .then(() =>
        browser.storage.local.set({
          [read_flag_key]: latest_how_to_use_version,
        })
      );
  }
}
