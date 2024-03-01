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
import { type config, getConfig } from "@/config";
import { useState } from "react";
import browser from "webextension-polyfill";

function Root() {
  const [bgColor, setBgColor] = useState<string>("black");
  const [textColor, setTextColor] = useState<string>("white");
  const [opacity, setOpacity] = useState<number>(100);

  getConfig("comment_area_background_color", (value) => {
    setBgColor(value as string);
  });
  getConfig("comment_text_color", (value) => {
    setTextColor(value as string);
  });
  getConfig("comment_area_opacity_percentage", (value) => {
    setOpacity(value as number);
  });

  browser.storage.onChanged.addListener((changes) => {
    for (const key in changes) {
      switch (key as config["key"]) {
        case "comment_area_background_color":
          setBgColor(changes[key].newValue);
          break;
        case "comment_text_color":
          setTextColor(changes[key].newValue);
          break;
        case "comment_area_opacity_percentage":
          setOpacity(changes[key].newValue);
          break;
      }
    }
  });

  return (
    <div
      className="w-[32rem] h-full"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        opacity: opacity / 100,
      }}
    >
      <link
        rel="stylesheet"
        href={browser.runtime.getURL("assets/css/index.css")}
      />
      <ThemeProvider>
        <div className="h-full p-4 bg-transparent">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">d-comments</h1>
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}

export default Root;
