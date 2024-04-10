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
import { Suspense, useContext, useEffect, useState } from "react";
import { get_owner_info } from "../api/owner_info";
import { VideoIdContext } from "../popup";
import { ErrorMessage } from "../utils";

/**
 * lengthSeconds -> "〇時間〇分〇秒" | "〇分〇秒" | "〇秒" | "は取得できませんでした"
 * @param lengthSeconds 動画の尺
 * @returns "は取得できませんでした" | "〇時間〇分〇秒" | "〇分〇秒" | "〇秒
 */
const video_length = (lengthSeconds: number | undefined) => {
  if (lengthSeconds === undefined) {
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

const storage = window.sessionStorage;

function Owner(props: {
  userId: string | undefined;
  channelId: string | undefined;
}) {
  const { userId, channelId } = props;
  if (!userId && !channelId) return null;

  const key = userId ?? channelId;
  const ownerInfo = storage.getItem(`${key}`);
  const [owner, setOwner] = useState<ownerInfoApi["response"] | null>(
    ownerInfo ? JSON.parse(ownerInfo) : null
  );

  useEffect(() => {
    if (!storage.getItem(`${key}`)) {
      get_owner_info({
        type: userId ? "user" : "channel",
        ownerId: userId ?? channelId,
      }).then((res) => {
        if (res instanceof Error) {
        } else {
          setOwner(res);
          storage.setItem(`${key}`, JSON.stringify(res));
        }
      });
    }
  });

  const { ownerName, ownerIconUrl } = owner ?? {};

  return (
    <div className="grid grid-cols-5 gap-2 justify-center items-center m-2 h-6">
      <img
        src={ownerIconUrl}
        alt={ownerName}
        className="aspect-square size-8"
      />
      <span className="col-span-4 p-0 m-0">{ownerName}</span>
    </div>
  );
}

function SearchResult(props: { snapshot: Snapshot }) {
  const { snapshot } = props;
  const data = snapshot.data;

  const { videoId, setVideoId } = useContext(VideoIdContext);
  const { toast } = useToast();

  function handler(contentId: string) {
    if (contentId === videoId) {
      ErrorMessage(toast, {
        message: {
          title: "Error",
          description: "既に入力されている動画IDです。",
        },
      });
    }
    setVideoId(contentId);
  }

  return data.length > 0 ? (
    <ul
      className="w-full max-h-80 list-none p-0 m-0 text-base overflow-y-scroll overflow-x-hidden"
      aria-label="検索結果一覧 "
    >
      {data.map((item) => (
        <li
          onClick={() => handler(item.contentId)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handler(item.contentId);
          }}
          className="cursor-pointer rounded hover:bg-gray-200 border-t-2  border-gray-300"
        >
          <div className="flex flex-col my-1">
            <div className="flex flex-row">
              <img
                src={item.thumbnailUrl}
                alt={item.title}
                className="object-cover aspect-video h-24"
              />
              <div className="mx-2 flex flex-col">
                <span className="font-semibold overflow-y-auto">
                  {item.title}
                </span>
              </div>
            </div>
            <Owner userId={item.userId} channelId={item.channelId} />
            <table className="table-auto">
              <tr>
                <td>再生数</td>
                <td>{item.viewCounter}</td>
              </tr>
              <tr>
                <td>コメント数</td>
                <td>{item.commentCounter}</td>
              </tr>
              <tr>
                <td>動画の尺</td>
                <td>{video_length(item.lengthSeconds)}</td>
              </tr>
            </table>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <div>キーワードに一致する結果が見つかりませんでした</div>
  );
}

export default SearchResult;
