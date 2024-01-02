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
import { ExternalLink } from "lucide-react";
import React, { useEffect, useState } from "react";
import api from "../api/api";
import { ErrorMessage, isWatchPage } from "../util";

function VideoIdInput() {
  const [videoId, setVideoId] = useState<VideoId>();
  const { toast } = useToast();

  const render_comments = async (videoId: VideoId) => {
    if (!(await isWatchPage())) {
      ErrorMessage(toast, {
        message: {
          title: "作品視聴ページ以外で実行されました。",
          description: "render_comments は作品視聴ページでのみ実行できます。",
        },
      });
      return;
    }
    const query: {
      type: renderCommentsApi["type"];
      data: renderCommentsApi["data"];
      active_tab: renderCommentsApi["active_tab"];
    } = {
      type: "render_comments",
      data: {
        videoId: videoId,
      },
      active_tab: true,
    };
    return await api(query).catch((error) => {
      ErrorMessage(toast, { error: error });
    });
  };

  useEffect(() => {
    getConfig("show_last_searched_video_id", (value) => {
      value === true &&
        setVideoId(window.localStorage.getItem("videoId") as VideoId);
    });
  }, []);

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
          <Button variant="outline">JSON に保存</Button>

          <Button variant="outline" className="w-32">
            コメントを表示
          </Button>
        </div>
      </div>
    </>
  );
}

export default VideoIdInput;
