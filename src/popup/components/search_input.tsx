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
import { createRef, useContext, useEffect, useState } from "react";
import browser from "webextension-polyfill";
import search from "../api/search";
import { SnapshotContext } from "../popup";
import { ErrorMessage } from "../utils";

function Search() {
  const ref = createRef<HTMLInputElement>();
  const [word, setWord] = useState<searchApi["data"]["word"]>("");
  const { setSnapshot } = useContext(SnapshotContext);
  const { toast } = useToast();

  async function get_tabs_title() {
    const tabs_title = await browser.tabs
      .query({ active: true, currentWindow: true })
      .then((tabs) => {
        return tabs[0]?.title ?? "";
      });
    return tabs_title;
  }

  async function _search() {
    const _word = ref.current?.dataset.word ?? word;
    const snapshot = await search(_word.replaceAll("-", " "));
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
        if (enabled) await _search();
      });
    })();
  });

  async function on_search_button_click() {
    await _search();
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
          ref={ref}
          placeholder="検索ワード"
          className="col-span-5"
          type="text"
          defaultValue={word}
          onChange={(e) => {
            const value = e.target.value;
            e.target.dataset.word = value;
          }}
        />

        <Button
          variant="outline"
          className="col-span-2 flex justify-center items-center"
          aria-label="検索ボタン"
          role="button"
          onClick={on_search_button_click}
        >
          <SearchIcon className="w-5 h-5 mr-2" />
          検索
        </Button>
      </div>
    </>
  );
}

export default Search;
