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

import { ThemeProvider } from "@/components/theme-provider";
import { useState } from "react";
import { createRoot } from "react-dom/client";
import browser from "webextension-polyfill";

function Menu() {
  return (
    <div className="w-[32rem] h-full p-4">
      <link
        rel="stylesheet"
        href={browser.runtime.getURL("assets/css/client.css")}
      />
      <ThemeProvider>
        <div
          className="bg-white rounded-lg shadow-lg p-4"
          style={{ height: "100%" }}
        >
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">d-comments</h1>
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}

const uiInit = () => {
  const video = document.getElementById("video");
  for (let i = 0; i < 10; i++) {
    if (!video) {
      setTimeout(() => {}, 150);
      continue;
    }

    const wrapper_id = "d-comments-wrapper";
    const prev_wrapper = document.getElementById(wrapper_id);
    const wrapper = prev_wrapper || document.createElement("div");
    if (!prev_wrapper) {
      wrapper.id = wrapper_id;
      Object.assign(wrapper.style, {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "100%",
      });
      video.parentElement?.before(wrapper);
      wrapper.append(video.parentElement as HTMLElement);
    }

    const sideMenu = document.createElement("div");
    wrapper.appendChild(sideMenu);

    const root = createRoot(sideMenu);
    root.render(<Menu />);
  }
};

export default uiInit;
