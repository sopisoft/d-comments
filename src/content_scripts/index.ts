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
import { getConfig } from "./config";
import { addMenu } from "./danime_dom/mypage";
import { setWorkInfo, videoEventsListener } from "./danime_dom/watch";
import exportJson from "./export";
import fire from "./play/fire";

switch (location.pathname) {
  case "/animestore/ci_pc": {
    getConfig("add_button_to_show_comments_while_playing", (value) => {
      value && addMenu();
    });
    break;
  }
  case "/animestore/sc_d_pc": {
    Promise.all([setWorkInfo(), videoEventsListener()]);
    browser.runtime.onMessage.addListener((message: messages) => {
      switch (message.type) {
        case "render_comments":
          fire(true, message.data.videoId);
          break;
        case "render_comments_json":
          fire(false, message.data.comments);
          break;
        case "export_comments_json":
          exportJson(message.data.videoId);
          break;
        default:
          break;
      }
    });
    break;
  }
  default:
    break;
}
