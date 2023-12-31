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

const get_thread_data: (
  video_data: threadDataApi["data"]["videoData"]
) => Promise<threadDataApi["response"] | Error> = async (video_data) => {
  const query: {
    type: threadDataApi["type"];
    data: threadDataApi["data"];
    active_tab: threadDataApi["active_tab"];
  } = {
    type: "thread_data",
    data: {
      videoData: video_data,
    },
    active_tab: false,
  };
  return await api(query).catch((err) => {
    return err;
  });
};

export default get_thread_data;
