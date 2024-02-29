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

export const get_owner_info: (arg: {
  type: "user" | "channel";
  ownerId: string | undefined;
}) => Promise<ownerInfoApi["response"] | Error> = async (arg) => {
  if (!arg.ownerId) return new Error("ownerId is undefined");
  const { type, ownerId } = arg;
  const query: {
    type: ownerInfoApi["type"];
    data: ownerInfoApi["data"];
    active_tab: ownerInfoApi["active_tab"];
  } = {
    type: "owner_info",
    data: {
      type: type,
      ownerId: ownerId, // userId or channelId
    },
    active_tab: false,
  };
  return await api(query).catch((err) => {
    return err;
  });
};
