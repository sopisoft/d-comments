import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExternalLink } from "lucide-react";
import React from "react";

function VideoIdInput() {
  return (
    <>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger>
            <span className="text-lg font-bold">
              動画ID からコメントを取得・表示
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <a
              href="https://dic.nicovideo.jp/a/id"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2"
            >
              <ExternalLink className="w-4 h-4 mx-2" />
              動画ID（ニコニコ大百科）
            </a>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="grid grid-cols-7 gap-2 my-2">
        <Input placeholder="動画ID" className="col-span-3" />

        <div className="col-span-4 flex justify-end items-center space-x-2">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="outline">JSON に保存</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>コメントを JSON に保存し、ダウンロードします。</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="outline">コメントを表示</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>入力された動画IDのコメントを表示します。</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </>
  );
}

export default VideoIdInput;
