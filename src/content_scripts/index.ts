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
import * as Config from "./config";
import { addMenu } from "./danime_dom/mypage";
import { setWorkInfo } from "./danime_dom/watch";
import exportJson from "./export";
import fire from "./play/fire";

switch (location.pathname) {
  case "/animestore/ci_pc": {
    Config.getConfig("add_button_to_show_comments_while_playing", (value) => {
      value && addMenu();
    });
    break;
  }
  case "/animestore/sc_d_pc": {
    setWorkInfo();

    // called from popup/popup.tsx
    browser.runtime.onMessage.addListener((message) => {
      if (message.type === "renderComments") {
        fire(message.movieId, message.data);
      }
      if (message.type === "exportJson") {
        exportJson(message.movieId);
      }
      return undefined;
    });
    break;
  }
  default:
    break;
}

const ua =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.3";

function setUserAgent(userAgent: string) {
  const userAgentProp: PropertyDescriptor = {
    get: () => userAgent,
  };
  try {
    Object.defineProperty(window.navigator, "userAgent", userAgentProp);
  } catch (e) {
    window.navigator = Object.create(navigator, {
      userAgent: userAgentProp,
    });
  }
}

for (let i = 0; navigator.userAgent !== ua || i < 3; i++) {
  setUserAgent(ua);
}
