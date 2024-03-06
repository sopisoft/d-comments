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

import { getConfig } from "@/config";
import browser from "webextension-polyfill";

/**
 * 任意の範囲のランダムな整数を返す
 * @param min 最小値
 * @param max 最大値
 * @returns min 以上 max 以下のランダムな整数
 */
const getRandomInt = (min: number, max: number) => {
  const minNum = Math.ceil(min);
  const maxNum = Math.floor(max);
  return Math.floor(Math.random() * (maxNum - minNum) + minNum);
};

function getActionTrackId() {
  const f = Math.random().toString(36).slice(-10);
  const b = getRandomInt(10 ** 12, 10 ** 13);
  return `${f}_${b}`;
}

/**
 * 動画情報を取得する
 * @param videoId ニコニコ動画の動画ID
 * @param sendResponse (response) => void
 */

const getVideoData = async (videoId: string) => {
  const config = await getConfig("allow_login_to_nicovideo");
  const url = `https://www.nicovideo.jp/api/watch/${
    config ? "v3" : "v3_guest"
  }/${videoId}`;
  const params = {
    _frontendId: "6",
    _frontendVersion: "0",
    actionTrackId: getActionTrackId(),
  };
  const fetch_options: RequestInit = {
    credentials: config ? "include" : "omit",
    headers: {
      "x-frontend-id": "6",
      "x-frontend-version": "0",
    },
  };
  if (config)
    browser.cookies
      .get({ url: "https://www.nicovideo.jp/", name: "user_session" })
      .then((cookie) => {
        if (!cookie) return;
        Object.assign(fetch_options.headers as HeadersInit, {
          Cookie: `user_session=${cookie.value}`,
        });
      });

  return await fetch(`${url}?${new URLSearchParams(params)}`, fetch_options)
    .then(async (res) => {
      const json = (await res.json()) as SearchResponse;
      return json;
    })
    .catch((e) => {
      return e as Error;
    });
};

/**
 * コメントスレッドの情報とコメントを取得
 */
const getThreadComments = async (
  nvComment: SearchResult["data"]["comment"]["nvComment"]
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
    "https://api.search.nicovideo.jp/api/v2/snapshot/video/contents/search";
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
    headers: {
      "User-Agent": UserAgent,
    },
  })
    .then(async (res) => {
      const json = await res.json();
      return json as searchApi["response"];
    })
    .catch((e) => {
      return e as Error;
    });

  return res;
};

/**
 *
 * @param type "user" | "channel"
 * @param videoId 動画ID
 * @param ownerId ユーザーID または チャンネルID
 * @returns Owner
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
  (message: messages): Promise<messages["response"] | Error> => {
    switch (message.type) {
      case "video_data": {
        const data = message.data;
        return getVideoData(data.videoId);
      }
      case "thread_data": {
        const data = message.data;
        return getThreadComments(data.videoData);
      }
      case "search": {
        const data = message.data;
        return search(data.word, data.UserAgent);
      }
      case "owner_info": {
        const data = message.data;
        const { type, ownerId } = data;
        return get_user_info(type, ownerId);
      }
      default: {
        return new Promise((r) => r(false));
      }
    }
  }
);

browser.runtime.onInstalled.addListener((_details) => {
  const read_flag_key = "read_how_to_use";
  const latest_how_to_use_version = 1;
  browser.storage.local.get(read_flag_key).then((res) => {
    if (res[read_flag_key] !== latest_how_to_use_version) {
      browser.tabs
        .create({
          url: browser.runtime.getURL("how_to_use/how_to_use.html"),
        })
        .then(() => {
          browser.storage.local.set({
            [read_flag_key]: latest_how_to_use_version,
          });
        });
    }
  });
});
