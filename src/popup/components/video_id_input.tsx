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
import export_comments_json from "@/content_scripts/export";
import api from "@/lib/api";
import { ExternalLink } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { VideoIdContext } from "../popup";
import { ErrorMessage, isVideoId, isWatchPage } from "../utils";

function VideoIdInput() {
  const { videoId, setVideoId } = useContext(VideoIdContext);

  const { toast } = useToast();

  const check_video_id = async (videoId: string | undefined | null) => {
    if (videoId === undefined || videoId === null) {
      ErrorMessage(toast, {
        message: {
          title: "動画IDが入力されていません。",
          description: "動画IDを入力してください。",
        },
      });
      return false;
    }
    if (isVideoId(videoId) === false) {
      ErrorMessage(toast, {
        message: {
          title: "動画IDが不正です。",
          description: "動画IDを正しく入力してください。",
        },
      });
      return false;
    }
    return videoId as VideoId;
  };

  const render_comments = async () => {
    const video_id = await check_video_id(videoId);
    if (!video_id) return;
    const query: {
      type: renderCommentsApi["type"];
      data: renderCommentsApi["data"];
      active_tab: renderCommentsApi["active_tab"];
    } = {
      type: "render_comments",
      data: {
        videoId: video_id,
      },
      active_tab: true,
    };
    return await api(query).catch((error) => {
      ErrorMessage(toast, { error: error });
    });
  };

  async function on_save_json_button_clicked() {
    const video_id = await check_video_id(videoId);
    if (!video_id) return;
    export_comments_json(video_id);
  }

  getConfig("show_last_searched_video_id", (value) => {
    if (value === true) {
      const last_id = window.localStorage.getItem("videoId");
      if (!last_id) return;
      setVideoId(last_id);
    }
  });

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
          value={videoId}
          onChange={(e) => {
            const video_id = e.target.value;
            setVideoId(video_id);
          }}
        />

        <div className="col-span-4 flex justify-end items-center space-x-2">
          <Button
            variant="outline"
            onClick={on_save_json_button_clicked}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                on_save_json_button_clicked;
              }
            }}
            disabled={!videoId}
          >
            JSON に保存
          </Button>

          <Button
            variant="outline"
            className="w-32"
            onClick={render_comments}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                render_comments;
              }
            }}
            disabled={!videoId}
          >
            コメントを表示
          </Button>
        </div>
      </div>
    </>
  );
}

export default VideoIdInput;
