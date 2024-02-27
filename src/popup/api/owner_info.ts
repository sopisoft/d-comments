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

import api from "@/lib/api";

const get_owner_info: (arg: {
  type: "user" | "channel";
  videoId: VideoId;
  ownerId: string;
}) => Promise<ownerInfoApi["response"] | Error> = async (arg) => {
  const { type, videoId, ownerId } = arg;
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
  return await api(query).catch((err) => {
    return err;
  });
};

/**
 * @param snapshot Snapshot
 * @returns Owner[] | Error
 */
const get_owner_info_from_snapshot: (
  snapshot: Snapshot
) => Promise<ownerInfoApi["response"][] | Error> = async (snapshot) => {
  const owners: ownerInfoApi["response"][] = [];
  for (const data of snapshot.data) {
    get_owner_info({
      type: data.userId ? "user" : data.contentId ? "channel" : "user",
      videoId: data.contentId,
      ownerId: (data.userId ?? data.channelId) as string,
    }).then((res) => {
      if (res instanceof Error) {
        return res;
      }
      owners.push(res as ownerInfoApi["response"]);
    });
  }
  return owners;
};

export default get_owner_info_from_snapshot;
