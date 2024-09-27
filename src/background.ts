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

import browser from "webextension-polyfill";
import { openHowToUseIfNotRead } from "./how_to_use/how_to_use";

/**
 * 動画情報を取得する
 * @param videoId ニコニコ動画の動画ID
 */
async function getVideoData(videoId: string): Promise<SearchResponse | Error> {
  const url = `https://www.nicovideo.jp/watch/${videoId}?responseType=json`;
  const res = await fetch(url)
    .then(async (res) => {
      const json = await res.json();
      return json as SearchResponse;
    })
    .catch((e) => {
      return e as Error;
    });
  return res;
}

/**
 * コメントスレッドの情報とコメントを取得
 */
const getThreadComments = async (
  nvComment: SearchResult["data"]["response"]["comment"]["nvComment"]
) => {
  const { server, threadKey, params } = nvComment;
  const serverUrl = `${server}/v1/threads`;
  const headers: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      "x-frontend-id": "6",
      "x-frontend-version": "0",
    } as HeadersInit,
    method: "POST",
    body: JSON.stringify({
      threadKey: threadKey,
      params: params,
      additionals: {},
    }),
  };
  const res = await fetch(`${serverUrl}?_frontendId=6`, headers)
    .then(async (res) => {
      if (res.status !== 200) return new Error("Failed to fetch threads");
      const json = (await res.json()) as ThreadsData;
      return json;
    })
    .catch((e) => {
      return e as Error;
    });
  return res;
};

/**
 * スナップショットAPIを使って動画を検索する
 * @see https://site.nicovideo.jp/search-api-docs/snapshot
 */
const search = async (
  word: string,
  UserAgent: string
): Promise<searchApi["response"] | Error> => {
  const endpoint =
    "https://snapshot.search.nicovideo.jp/api/v2/snapshot/video/contents/search";
  const params = {
    q: word,
    targets: "title,description,tags",
    _sort: "-commentCounter",
    fields:
      "contentId,title,thumbnailUrl,commentCounter,viewCounter,lengthSeconds,userId,channelId",
    _limit: "40",
    _context: "d-comments",
  };

  const res = await fetch(`${endpoint}?${new URLSearchParams(params)}`, {
    credentials: "omit",
    headers: {
      "User-Agent": UserAgent,
    },
  })
    .then(async (res) => {
      const json = await res.json();
      if (res.ok && res.status === 200) return json as searchApi["response"];

      const error =
        json?.meta?.errorMessage || json?.meta?.errorCode || json?.message;
      if (error) return new Error(error);
      return new Error("Failed to fetch search results");
    })
    .catch((e) => {
      return e as Error;
    });

  return res;
};

/**
 *
 * @param type "user" | "channel"
 * @param ownerId ユーザーID または チャンネルID
 */
const get_user_info = async (
  type: "user" | "channel",
  ownerId: string
): Promise<ownerInfoApi["response"] | Error> => {
  switch (type) {
    case "user": {
      const url = `https://nvapi.nicovideo.jp/v1/users/${ownerId}`;
      const headers: RequestInit = {
        headers: {
          "User-Agent": navigator.userAgent ?? "",
          "x-frontend-id": "6",
          "x-frontend-version": "0",
        },
      };
      return await fetch(url, headers)
        .then(async (res) => {
          const json = await res.json();
          const { nickname, icons } = json.data.user;
          const owner: Owner = {
            ownerId: ownerId,
            ownerName: nickname,
            ownerIconUrl: icons.small,
          };
          return owner;
        })
        .catch((e) => {
          return e;
        });
    }
    case "channel": {
      const url = `https://api.cas.nicovideo.jp/v2/tanzakus/channel/ch${ownerId}`;
      return await fetch(url)
        .then(async (res) => {
          const json = await res.json();
          const { name, icon } = json.data;
          const owner: Owner = {
            ownerId: ownerId,
            ownerName: name,
            ownerIconUrl: icon,
          };
          return owner;
        })
        .catch((e) => {
          return e;
        });
    }
    default: {
      throw new Error("invalid type of owner");
    }
  }
};

browser.runtime.onMessage.addListener(
  (message): Promise<messages["response"] | Error> => {
    const msg = message as messages;
    switch (msg.type) {
      case "video_data": {
        return getVideoData(msg.data.videoId);
      }
      case "thread_data": {
        return getThreadComments(msg.data.videoData);
      }
      case "search": {
        const { data } = msg;
        return search(data.word, data.UserAgent);
      }
      case "owner_info": {
        const { type, ownerId } = msg.data;
        return get_user_info(type, ownerId);
      }
      default: {
        return new Promise((r) => r(false));
      }
    }
  }
);

browser.runtime.onInstalled.addListener(async (_details) => {
  await openHowToUseIfNotRead();
});
