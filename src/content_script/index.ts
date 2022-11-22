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

import * as util from "./util";
import showComments from "./watchPage";
import exportJson from "./export";

const href = window.location.href;

const isMenuPage = href.match(
  /https:\/\/animestore\.docomo\.ne\.jp\/animestore\/ci_pc\?workId=\d+/
)
  ? true
  : false;

const isWatchPage = href.match(
  /https:\/\/animestore\.docomo\.ne\.jp\/animestore\/sc_d_pc\?partId=\d+/
)
  ? true
  : false;

window.onload = async () => {
  switch (true) {
    case isMenuPage:
      util.addMenu();
      break;
    case isWatchPage: {
      let url = new Object();
      url = window.location.href;
      setInterval(() => {
        if (url !== window.location.href) {
          url = window.location.href;
          util.setInfo();
        }
      }, 1000);
      util.setInfo();
      break;
    }
  }
};

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "showComments" && isWatchPage) {
    showComments(message.movieId, message.data);
  }
  if (message.type === "exportJson" && isWatchPage) {
    exportJson(message.movieId);
  }
});
