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

const get_video_data: (
  videoId: VideoId
) => Promise<videoDataApi["response"] | Error> = async (videoId) => {
  const query: {
    type: videoDataApi["type"];
    data: videoDataApi["data"];
    active_tab: videoDataApi["active_tab"];
  } = {
    type: "video_data",
    data: {
      videoId: videoId,
    },
    active_tab: false,
  };
  const res = await api(query)
    .then((v) => {
      return v as videoDataApi["response"];
    })
    .catch((e) => {
      return e as Error;
    });
  return res;
};

export default get_video_data;
