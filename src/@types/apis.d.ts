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

type videoDataApi = {
  type: "video_data";
  data: {
    videoId: string;
  };
  active_tab: false;
  response: SearchResult;
};
type threadDataApi = {
  type: "thread_data";
  data: {
    videoData: SearchResult;
  };
  active_tab: false;
  response: ThreadsData;
};

type searchApi = {
  type: "search";
  data: {
    word: string;
    UserAgent: string;
  };
  active_tab: false;
  response: Snapshot;
};
type ownerInfoApi = {
  type: "owner_info";
  data: {
    type: "user" | "channel";
    ownerId: string;
  };
  active_tab: false;
  response: Owner;
};
type renderCommentsApi = {
  type: "render_comments";
  data: {
    videoId: VideoId;
  };
  active_tab: true;
  response: boolean;
};
type exportCommentsJsonApi = {
  type: "export_comments_json";
  data: {
    videoId: VideoId;
  };
  active_tab: true;
  response: comments_json;
};

declare type messages =
  | videoDataApi
  | threadDataApi
  | searchApi
  | ownerInfoApi
  | renderCommentsApi
  | exportCommentsJsonApi;

type messaging_api = {
  type: messages["type"];
  data: messages["data"];
  active_tab?: messages["active_tab"];
  response?: messages["response"];
};
