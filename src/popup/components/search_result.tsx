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

import React from "react";

function SearchResult(props: { snapshot: Snapshot; owners: Owner[] }) {
  const { snapshot, owners } = props;

  return (
    <div className="grid grid-cols-7 gap-2 my-2">
      {snapshot.data.map((video) => {
        return video.map((video) => {
          return (
            <div className="col-span-7">
              <div className="flex flex-row">
                <div className="flex flex-col">
                  <img
                    src={video.thumbnailUrl}
                    alt={`Thumbnail of ${video.title}`}
                    className="w-20 h-20"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="text-lg">{video.title}</p>
                </div>
              </div>
            </div>
          );
        });
      })}
    </div>
  );
}

export default SearchResult;
