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

import addMenu from "./menuPage";
import render from "./watchPage";

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
      addMenu();
      break;
    case isWatchPage: {
      const setDocument = async () => {
        const apiUrl = document
          .getElementById("restApiUrl")
          ?.getAttribute("value")
          ?.split("&")[0];
        const res = await fetch(
          `${apiUrl}&${window.location.search.split("?")[1]}`
        );
        const data = await res.json();
        const title = data["data"]["title"];
        const description = data["data"]["partExp"];
        document.title = title ?? document.title;
        document
          .querySelector("meta[name=Description]")
          ?.setAttribute("content", description);
      };
      let url = new Object();
      url = window.location.href;
      setInterval(() => {
        if (url !== window.location.href) {
          url = window.location.href;
          setDocument();
        }
      }, 1000);
      setDocument();
      break;
    }
  }
};

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "render" && isWatchPage) {
    render(message.movieId);
  }
});
