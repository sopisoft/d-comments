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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { getConfig } from "@/config";
import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import browser from "webextension-polyfill";
import search from "../api/search";
import { ErrorMessage } from "../utils";
import SearchResult from "./search_result";

function Search() {
  const [word, setWord] = useState<searchApi["data"]["word"]>("");
  const [snapshot, setSnapshot] = useState<Snapshot>();
  const { toast } = useToast();

  async function get_tabs_title() {
    const tabs_title = await browser.tabs
      .query({ active: true, currentWindow: true })
      .then((tabs) => {
        return tabs[0]?.title ?? "";
      });
    return tabs_title;
  }

  async function _search(word: string) {
    const snapshot = await search(word);
    if (snapshot instanceof Error) {
      ErrorMessage(toast, { error: snapshot });
      setSnapshot(undefined);
      return;
    }
    setSnapshot(snapshot);
  }

  useEffect(() => {
    (async () => {
      const tabs_title = await get_tabs_title();
      const title = tabs_title.replaceAll("-", " ");
      setWord(title);
      getConfig("auto_search", async (enabled) => {
        if (enabled) _search(title);
      });
    })();
  }, [get_tabs_title, _search]);

  async function on_search_button_click() {
    _search(word);
  }

  return (
    <>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger>
            <span className="text-lg font-bold">動画検索</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>ニコニコ動画の動画を検索します。</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="grid grid-cols-7 gap-2 my-2">
        <Input
          id="search_video_input"
          placeholder="検索ワード"
          className="col-span-5"
          type="text"
          value={word}
          onChange={(e) => {
            setWord(e.target.value);
          }}
        />

        <Button
          variant="outline"
          className="grid items-center gap-1.5 grid-cols-3 w-32"
          aria-label="検索ボタン"
          role="button"
          onClick={on_search_button_click}
        >
          <SearchIcon className="w-5 h-5 mr-2" />
          <span className="col-span-2">検索</span>
        </Button>
      </div>

      {snapshot && <SearchResult snapshot={snapshot} />}
    </>
  );
}

export default Search;
