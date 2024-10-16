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

import { useState } from "react";
import { get_owner_info } from "../api/owner_info";

const storage = window.sessionStorage;

function Owner(props: {
  userId: string | null;
  channelId: string | null;
}) {
  const { userId, channelId } = props;
  if (!userId && !channelId) return null;

  const key = userId ?? channelId;
  const ownerInfo = storage.getItem(`${key}`);
  const [owner, setOwner] = useState<ownerInfoApi["response"] | null>(
    ownerInfo ? JSON.parse(ownerInfo) : null
  );

  if (!storage.getItem(`${key}`)) {
    get_owner_info({
      type: userId ? "user" : "channel",
      ownerId: (userId ?? channelId) as string,
    }).then((res) => {
      if (res instanceof Error) {
      } else {
        setOwner(res);
        storage.setItem(`${key}`, JSON.stringify(res));
      }
    });
  }

  const { ownerName, ownerIconUrl } = owner ?? {};

  return (
    <div className="grid grid-cols-5 gap-2 justify-center items-center m-auto mb-2 w-4/5">
      <img
        src={ownerIconUrl}
        alt={ownerName}
        className="aspect-square size-6"
      />
      <span className="col-span-4 p-0 m-0 h-7 content-center overflow-auto scrollbar-thin">
        {ownerName}
      </span>
    </div>
  );
}

export default Owner;
