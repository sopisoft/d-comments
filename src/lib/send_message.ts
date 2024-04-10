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

async function send_message<T extends messages>(
  props: query<T>
): Promise<T["response"] | Error> {
  if (props.active_tab) {
    const tabs = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    const tabId = tabs[0].id;
    if (!tabId) return new Error("No active tab");
    const res = await browser.tabs.sendMessage(tabId, {
      type: props.type,
      data: props.data,
    });
    return res;
  }
  const res = await browser.runtime.sendMessage({
    type: props.type,
    data: props.data,
  });
  return res;
}

export default send_message;
