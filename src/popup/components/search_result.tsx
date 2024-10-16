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

import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { MessageSquare, Play, Timer } from "lucide-react";
import { useContext } from "react";
import { VideoIdContext } from "../popup";
import { ErrorMessage } from "../utils";
import Owner from "./owner";

/**
 * lengthSeconds -> "〇時間〇分〇秒" | "〇分〇秒" | "〇秒" | "は取得できませんでした"
 * @param lengthSeconds 動画の尺
 * @returns "は取得できませんでした" | "〇時間〇分〇秒" | "〇分〇秒" | "〇秒
 */
const video_length = (lengthSeconds: number | null) => {
  if (lengthSeconds === null) {
    return "は取得できませんでした";
  }
  const hour = Math.floor(lengthSeconds / 3600);
  const minute = Math.floor(lengthSeconds / 60);
  const second = lengthSeconds % 60;
  function toStr(l: number, s: string) {
    return l > 0 ? l + s : "";
  }
  return toStr(hour, "時間") + toStr(minute, "分") + toStr(second, "秒");
};

function SearchResult(props: { snapshot: Snapshot; className?: string }) {
  const { data } = props.snapshot;

  const { videoId, setVideoId } = useContext(VideoIdContext);
  const { toast } = useToast();

  function handler(contentId: string) {
    if (contentId === videoId) {
      const t = ErrorMessage(toast, {
        message: {
          title: "入力済み",
          description: "既に入力されている動画IDです。",
        },
      });
      setTimeout(() => t.dismiss(), 1000);
    }
    setVideoId(contentId);
  }

  return data.length > 0 ? (
    <ul
      className={cn(
        "w-full flex flex-col gap-1 list-none p-1 m-0 text-base overflow-y-scroll overflow-x-hidden scrollbar-thin",
        props.className
      )}
      aria-label="検索結果一覧 "
      style={{
        height: "calc(600px - 0.75 * 2rem)",
      }}
    >
      {data.map((item) => {
        const {
          contentId,
          title,
          description,
          userId,
          channelId,
          thumbnailUrl,
          viewCounter,
          commentCounter,
          lengthSeconds,
        } = item;
        return (
          <li
            onClick={() => handler(contentId)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handler(contentId);
            }}
            key={contentId}
            className="m-0 py-2 h-48 flex flex-col cursor-pointer rounded hover:bg-gray-200 border border-gray-300"
          >
            <div className="flex flex-row">
              {thumbnailUrl && title && (
                <img
                  src={thumbnailUrl}
                  alt={title}
                  className="object-cover aspect-video h-20 m-1"
                />
              )}
              <div className="mx-2 h-20 flex flex-col items-center">
                <span className="font-semibold overflow-y-auto overflow-x-hidden scrollbar-thin">
                  {title}
                </span>
              </div>
            </div>

            <Owner userId={userId} channelId={channelId} />
            <div className="m-auto text-sm grid grid-cols-3 gap-2 w-4/5">
              <span className="col-span-1 flex flex-row items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                {viewCounter}
              </span>
              <span className="col-span-1 flex flex-row items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" />
                {commentCounter}
              </span>
              <span className="col-span-1 flex flex-row items-center justify-center gap-2">
                <Timer className="w-4 h-4" />
                {video_length(lengthSeconds)}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  ) : (
    <div className="col-span-1 row-span-2">
      キーワードに一致する結果が見つかりませんでした
    </div>
  );
}

export default SearchResult;
