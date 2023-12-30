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

type message = bg_message_apis | fg_message_apis;

async function send_message(props: {
  type: message["type"];
  data: message["data"];
  active_tab?: message["active_tab"];
}): Promise<message["response"] | Error> {
  if (props.active_tab) {
    return browser.tabs
      .query({ active: true, currentWindow: true })
      .then((tabs) => {
        browser.tabs
          .sendMessage(tabs[0].id as number, {
            type: props.type,
            data: props.data,
          })
          .then((response) => {
            return response;
          });
      }) as Promise<message["response"]>;
  }
  const res = await browser.runtime.sendMessage({
    type: props.type,
    data: props.data,
  });
  return res;
}

export default send_message;
