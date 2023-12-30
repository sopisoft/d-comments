import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle } from "lucide-react";
import React from "react";

function VideoIdInput() {
  return (
    <>
      <TooltipProvider>
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
            >
              <span className="text-lg font-bold max-w-sm">
                動画IDとは、ニコニコ動画の動画のURLの「sm」または「so」とその後に続く数字のことです。
                <span>例: sm9, so123456</span>
              </span>
            </a>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="grid grid-cols-7 gap-2 my-2">
        <Input placeholder="動画ID" className="col-span-3" />
        <div className="col-span-4 flex justify-end items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Button variant="outline">JSON に保存</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>コメントを JSON に保存し、ダウンロードします。</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
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
