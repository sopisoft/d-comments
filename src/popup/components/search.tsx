import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { getConfig } from "@/content_scripts/config";
import { SearchIcon } from "lucide-react";
import React, { useState } from "react";
import browser from "webextension-polyfill";
import search from "../api/search";
import { ErrorMessage } from "../util";

function Search() {
  const [word, setWord] = useState<searchApi["data"]["word"]>("");
  const [snapshot, setSnapshot] = useState<Snapshot>();
  const [owner, setOwner] = useState<Owner>();
  const { toast } = useToast();

  getConfig("auto_search", async (value) => {
    if (value === true) {
      const work_title = await browser.tabs
        .query({ active: true, currentWindow: true })
        .then((tabs) => {
          return tabs[0]?.title ?? "";
        });

      setWord(work_title);
      search(work_title).then((res) => {
        typeof res === typeof Error
          ? ErrorMessage(toast, { error: res as Error })
          : setSnapshot(res as Snapshot);
      });
    }
  });

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
          onClick={() => {
            search(word).then((res) => {
              typeof res === typeof Error
                ? ErrorMessage(toast, { error: res as Error })
                : setSnapshot(res as Snapshot);
            });
          }}
        >
          <SearchIcon className="w-5 h-5 mr-2" />
          <span className="col-span-2">検索</span>
        </Button>
      </div>
    </>
  );
}

export default Search;
