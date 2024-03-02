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
import { useEffect, useState } from "react";
import browser from "webextension-polyfill";
import {
  bgColor as bgColorFn,
  onBgColorChange,
  onOpacityChange,
  onTextColorChange,
  opacity as opacityFn,
  textColor as textColorFn,
} from "../state";
import Scroll from "./scroll";

function Root() {
  const [bgColor, setBgColor] = useState<string>();
  const [textColor, setTextColor] = useState<string>();
  const [opacity, setOpacity] = useState<number>();

  useEffect(() => {
    (async () => {
      setBgColor(await bgColorFn());
      setTextColor(await textColorFn());
      setOpacity(await opacityFn());
    })();
  }, []);

  onBgColorChange((_prev, next) => {
    setBgColor(next);
  });
  onTextColorChange((_prev, next) => {
    setTextColor(next);
  });
  onOpacityChange((_prev, next) => {
    setOpacity(next);
  });

  return (
    <div
      className="w-full h-full"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        opacity: (opacity ?? 100) / 100,
      }}
    >
      <link
        rel="stylesheet"
        href={browser.runtime.getURL("assets/css/index.css")}
      />
      <ThemeProvider>
        <div className="h-full w-full p-4 bg-transparent">
          <Scroll />
        </div>
      </ThemeProvider>
    </div>
  );
}

export default Root;
