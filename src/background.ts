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

import { getConfig, migrate } from "@/content_scripts/config";
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

/**
 * 動画情報を取得する
 * @param movieId ニコニコ動画の動画ID
 * @param sendResponse (response) => void
 */

const getMovieData = async (movieId: string) => {
  return new Promise<SearchResult | Error>((resolve) => {
    getConfig("allow_login_to_nicovideo", (config) => {
      const url = `https://www.nicovideo.jp/api/watch/${
        config ? "v3" : "v3_guest"
      }/${movieId}`;
      const params = {
        _frontendId: "6",
        _frontendVersion: "0",
        actionTrackId: `${Math.random().toString(36).slice(-10)}_${getRandomInt(
          10 ** 12,
          10 ** 13
        )}`,
      };
      const fetch_options: RequestInit = {
        credentials: config ? "include" : "omit",
        headers: {
          "x-frontend-id": "6",
          "x-frontend-version": "0",
        },
      };
      config &&
        browser.cookies
          .get({ url: "https://www.nicovideo.jp/", name: "user_session" })
          .then((cookie) => {
            Object.assign(fetch_options.headers as HeadersInit, {
              Cookie: `user_session=${cookie?.value}`,
            });
          });

      fetch(`${url}?${new URLSearchParams(params)}`, fetch_options)
        .then((res) => {
          return res.json();
        })
        .then((v) => {
          return resolve(v as SearchResult);
        })
        .catch((e) => {
          return resolve(e);
        });
    });
  });
};

/**
 * コメントスレッドの情報とコメントを取得
 * @param movieData getMovieData で取得した動画情報
 * @returns Promise<Response>
 */

const getThreadComments = async (
  movieData: SearchResult
): Promise<Threads | Error> => {
  const nvComment = movieData.data.comment.nvComment;
  const serverUrl = `${nvComment.server}/v1/threads`;
  const headers: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      "x-frontend-id": "6",
      "x-frontend-version": "0",
    } as HeadersInit,
    method: "POST",
    body: JSON.stringify({
      threadKey: nvComment.threadKey,
      params: nvComment.params,
      additionals: {},
    }),
  };
  const res = await fetch(`${serverUrl}?_frontendId=6`, headers).catch((e) => {
    return e;
  });
  if (!res.ok) {
    return res;
  }
  return res.json();
};

/**
 * スナップショットAPIを使って動画を検索する
 * @see https://site.nicovideo.jp/search-api-docs/snapshot
 */
const search = async (word: string, UserAgent: string): Promise<Snapshot> => {
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
  }).catch((e) => {
    return e;
  });
  return !res.ok ? res : res.json();
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
  videoId: VideoId,
  ownerId: string
): Promise<Owner | Error> => {
  switch (type) {
    case "user": {
      const url = `https://nvapi.nicovideo.jp/v1/users/${videoId}`;
      const headers: RequestInit = {
        headers: {
          "User-Agent": navigator.userAgent ?? "",
          "x-frontend-id": "6",
          "x-frontend-version": "0",
        },
      };
      const res = await fetch(url, headers)
        .then((res) => {
          return res.json();
        })
        .catch((e) => {
          return e;
        });
      if (!res.ok) {
        return res;
      }

      return {
        contentId: videoId,
        ownerId: ownerId,
        ownerName: res.data.user.nickname,
        ownerIconUrl: res.data.user.icons.small,
      };
    }
    case "channel": {
      const url = `https://api.cas.nicovideo.jp/v2/tanzakus/channel/ch${videoId}`;
      const res = await fetch(url)
        .then((res) => {
          return res.json();
        })
        .catch((e) => {
          return e;
        });
      if (!res.ok) {
        return res;
      }
      return {
        contentId: videoId,
        ownerId: ownerId,
        ownerName: res.data.name,
        ownerIconUrl: res.data.icon,
      };
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
        const data = message.data as videoDataApi["data"];
        return getMovieData(data.videoId);
      }
      case "thread_data": {
        const data = message.data as threadDataApi["data"];
        return getThreadComments(data.videoData);
      }
      case "search": {
        const data = message.data as searchApi["data"];
        return search(data.word, data.UserAgent);
      }
      case "owner_info": {
        const data = message.data as ownerInfoApi["data"];
        return get_user_info(data.type, data.videoId, data.ownerId);
      }
      default: {
        throw new Error("Invalid message type");
      }
    }
  }
);

/**
 * インストール直後につかいかたページを開く
 */
browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    browser.tabs.create({
      url: browser.runtime.getURL("how_to_use.html"),
    });
  }

  // Config keys migration
  migrate();
});

export default {};
