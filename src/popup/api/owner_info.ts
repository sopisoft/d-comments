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

import api from "./api";

/**
 * 動画投稿者の名前、アイコンURLを取得
 * @param type user | channel
 * @param videoId
 * @param ownerId
 * @returns
 */
const get_owner_info: (
  type: "user" | "channel",
  videoId: VideoId,
  ownerId: string
) => Promise<ownerInfoApi["response"]> = async (type, videoId, ownerId) => {
  const query: {
    type: ownerInfoApi["type"];
    data: ownerInfoApi["data"];
    active_tab: ownerInfoApi["active_tab"];
  } = {
    type: "owner_info",
    data: {
      type: type,
      videoId: videoId,
      ownerId: ownerId,
    },
    active_tab: false as ownerInfoApi["active_tab"],
  };
  return (await api(query)) as ownerInfoApi["response"];
};

export default get_owner_info;
