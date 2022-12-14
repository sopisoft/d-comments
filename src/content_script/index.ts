/*
    This file is part of d-comments_For_DMM-TV.

    d-comments_For_DMM-TV is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    d-comments_For_DMM-TV is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with d-comments_For_DMM-TV.  If not, see <https://www.gnu.org/licenses/>.
*/

import fire from "./play/fire";
import exportJson from "./export";

const href = window.location.href;

const isWatchPage = href.match(/https:\/\/tv\.dmm\.com\/vod\/playback/)
  ? true
  : false;

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "showComments" && isWatchPage) {
    fire(message.movieId, message.data);
  }
  if (message.type === "exportJson" && isWatchPage) {
    exportJson(message.movieId);
  }
});
