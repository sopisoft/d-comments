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

const url = new URL(window.location.href);
window.onload = async () => {
  switch (true) {
    case url.pathname.includes("ci_pc"):
      addMenu();
      break;
    case url.pathname.includes("sc_d_pc"): {
      const restApi = document.getElementById("restApiUrl") as HTMLDivElement;
      const res = await fetch(restApi.getAttribute("value") as string);
      const data = await res.json();
      const title = data["data"]["title"];
      document.title = title ?? document.title;
      break;
    }
  }
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "renderComments" && url.pathname.includes("sc_d_pc")) {
    render(message.movieId);
    sendResponse("Trying to render comments");
  } else {
    sendResponse("Not supported");
  }
});
