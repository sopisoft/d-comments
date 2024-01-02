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

import React, { useContext } from "react";
import { VideoIdContext } from "../popup";

function SearchResult(props: { snapshot: Snapshot; owners: Owner[] }) {
  const { snapshot, owners } = props;

  const videoIdContext = useContext(VideoIdContext);

  const videoId = videoIdContext?.videoId;
  const setVideoId = videoIdContext?.setVideoId;

  const data = snapshot.data;
  const owner = (contentId?: string) => {
    return owners.find((owner) => owner.contentId === contentId);
  };
  const video_length = (lengthSeconds: number | undefined) => {
    if (lengthSeconds === undefined) {
      return "は取得できませんでした";
    }
    const hour = Math.floor(lengthSeconds / 3600);
    const minute = Math.floor(lengthSeconds / 60);
    const second = lengthSeconds % 60;
    return `${hour > 0 && `${hour}時間`} ${minute > 0 && `${minute}分`} ${
      second > 0 && `${second}秒`
    }`;
  };

  return (
    <div className="grid grid-cols-7 gap-2 my-2">
      {data.map((item) =>
        item.map((item) => (
          <li
            onClick={() => {
              setVideoId?.(item.contentId);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setVideoId?.(item.contentId);
              }
            }}
          >
            <span>
              <span>{item.title}</span>
            </span>
            <div>
              <img src={item.thumbnailUrl} alt={item.title} />
              <div>
                <p>動画情報</p>
                <div>
                  <img
                    src={owner(item.contentId)?.ownerIconUrl}
                    alt={owner(item.contentId)?.ownerName}
                  />
                  <p>{owner(item.contentId)?.ownerName}</p>
                </div>
                <span>再生数 {item.viewCounter}</span>
                <span>コメント数 {item.commentCounter}</span>
                <span>動画の尺 {video_length(item.lengthSeconds)}</span>
              </div>
            </div>
          </li>
        ))
      )}
    </div>
  );
}

export default SearchResult;
