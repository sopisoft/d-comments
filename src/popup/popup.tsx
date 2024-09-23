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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/toaster";
import "@/index.css";
import EditorCheckbox from "@/options/components/editor_checkbox";
import { Settings } from "lucide-react";
import { createContext, useState } from "react";
import { createRoot } from "react-dom/client";
import browser from "webextension-polyfill";
import Inputs from "./components/inputs";
import Menu from "./components/menu";
import Search from "./components/search_input";
import SearchResult from "./components/search_result";
import { isWatchPage as isWatchPageFn } from "./utils";

export const VideoIdContext = createContext<{
  videoId: string;
  setVideoId: (videoId: string) => void;
}>({ videoId: "", setVideoId: () => {} });

export const SnapshotContext = createContext<{
  snapshot: Snapshot | undefined;
  setSnapshot: (snapshot: Snapshot | undefined) => void;
}>({ snapshot: undefined, setSnapshot: () => {} });

export const Popup = () => {
  const manifest = browser.runtime.getManifest();
  const { name, version } = manifest;

  const [isWatchPage, setIsWatchPage] = useState(false);
  const [videoId, _setVideoId] = useState("");
  const [snapshot, _setSnapshot] = useState<Snapshot>();

  function setVideoId(video_id: string) {
    _setVideoId(video_id);
  }

  function setSnapshot(snapshot: Snapshot | undefined) {
    _setSnapshot(snapshot);
  }

  isWatchPageFn().then(setIsWatchPage);

  return (
    <div className="w-[800px] h-[600px] grid grid-cols-2 grid-rows-2 gap-4 justify-items-stretch overflow-hidden p-3">
      <VideoIdContext.Provider value={{ videoId, setVideoId }}>
        <SnapshotContext.Provider value={{ snapshot, setSnapshot }}>
          {snapshot ? (
            <SearchResult
              className="row-span-2 col-span-1"
              snapshot={snapshot}
            />
          ) : (
            <Card className="row-span-2 col-span-1" />
          )}

          <Card className="row-span-1 col-span-1">
            <CardHeader className="flex-col items-center justify-around">
              <CardTitle className="text-lg">{name}</CardTitle>
              <span className="text-xs">version {version}</span>
            </CardHeader>
            <CardContent>
              {isWatchPage ? (
                <>
                  <Inputs />
                  <Search />
                </>
              ) : (
                <p className="p-6">
                  dアニメストアの視聴ページでご利用ください。
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="row-span-1 col-span-1">
            <Menu />
            {isWatchPage && (
              <div className="p-4">
                <EditorCheckbox
                  _key="show_comments_in_list"
                  text="コメントリストコンテナを表示"
                />
              </div>
            )}
          </Card>
        </SnapshotContext.Provider>
      </VideoIdContext.Provider>
    </div>
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
