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
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import "@/index.css";
import { Settings } from "lucide-react";
import { createContext, useState } from "react";
import { createRoot } from "react-dom/client";
import browser from "webextension-polyfill";
import Inputs from "./components/inputs";
import Menu from "./components/menu";
import Search from "./components/search_input";
import { isWatchPage as isWatchPageFn } from "./utils";

export const VideoIdContext = createContext<{
  videoId: string;
  setVideoId: (videoId: string) => void;
}>({ videoId: "", setVideoId: () => {} });

export const Popup = () => {
  const manifest = browser.runtime.getManifest();
  const { name, version } = manifest;

  const [isWatchPage, setIsWatchPage] = useState(false);
  const [videoId, _setVideoId] = useState("");

  function setVideoId(video_id: string) {
    _setVideoId(video_id);
  }

  isWatchPageFn().then(setIsWatchPage);

  return (
    <Card className="max-w-2xl h-full overflow-hidden">
      <CardHeader className="p-3">
        <CardTitle className="text-lg flex justify-around items-start">
          {name} (Version: {version})
          {isWatchPage && (
            <Settings
              className="w-8 h-8 p-1 cursor-pointer rounded-md border border-solid border-transparent hover:border-gray-300 "
              onClick={() => {
                browser.tabs.create({
                  url: browser.runtime.getURL("options/options.html"),
                });
              }}
            />
          )}
        </CardTitle>
      </CardHeader>
      <div className="px-3">
        {isWatchPage ? (
          <VideoIdContext.Provider value={{ videoId, setVideoId }}>
            <Inputs />
            <Search />
          </VideoIdContext.Provider>
        ) : (
          <Menu />
        )}
      </div>
    </Card>
  );
};

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(
    <ThemeProvider>
      <Popup />
      <Toaster />
    </ThemeProvider>
  );
}
