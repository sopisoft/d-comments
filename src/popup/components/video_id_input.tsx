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
import { getConfig } from "@/content_scripts/config";
import api from "@/lib/api";
import { ExternalLink } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ErrorMessage, isWatchPage } from "../utils";

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
        <Input
          id="video_id_input"
          placeholder="動画ID"
          className="col-span-3"
        />

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
