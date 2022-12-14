/*
    This file is part of d-comments_For_DMM-TV.

    d-comments_For_DMM-TV is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    d-comments_For_DMM-TV is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with d-comments_For_DMM-TV.  If not, see <https://www.gnu.org/licenses/>.
*/

/**
 * 任意の範囲のランダムな整数を返す
 * @param min 最小値
 * @param max 最大値
 * @returns min 以上 max 以下のランダムな整数
 */
const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

/**
 * 動画情報を取得する
 * @param movieId　ニコニコ動画の動画ID
 * @returns　Promise<Response>
 */
const getMovieData = (movieId: string) => {
  const actionTrackId =
    Math.random().toString(36).slice(-10) +
    "_" +
    getRandomInt(10 ** 12, 10 ** 13);
  const url = `https://www.nicovideo.jp/api/watch/v3_guest/${movieId}`;
  const params = {
    _frontendId: "6",
    _frontendVersion: "0",
    actionTrackId: actionTrackId,
  };

  const d = fetch(url + "?" + new URLSearchParams(params), {
    credentials: "omit",
    headers: {
      "x-frontend-id": "6",
      "x-frontend-version": "0",
    },
  }).then((res) => {
    return res;
  });

  return d;
};

/**
 * コメントスレッドの情報とコメントを取得
 * @param movieData getMovieData で取得した動画情報
 * @returns　Promise<Response>
 */
const getThreadComments = (movieData: any) => {
  const nvComment = movieData["data"]["comment"]["nvComment"];
  const serverUrl = nvComment["server"] + "/v1/threads";
  const jsonBody = {
    threadKey: nvComment["threadKey"],
    params: nvComment["params"],
    additionals: {},
  };

  const d = fetch(serverUrl + "?_frontendId=6", {
    headers: {
      "Content-Type": "application/json",
      "x-frontend-id": "6",
      "x-frontend-version": "0",
    },
    method: "POST",
    body: JSON.stringify(jsonBody),
  }).then((res) => {
    return res;
  });

  return d;
};

const search = (word: string, UserAgent: string) => {
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
  /**
   * スナップショットAPIを使って動画を検索する
   * @see https://site.nicovideo.jp/search-api-docs/snapshot
   */
  const d = fetch(endpoint + "?" + new URLSearchParams(params), {
    headers: {
      "User-Agent": UserAgent,
    },
  }).then((res) => {
    return res;
  });

  return d;
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "movieData": {
      getMovieData(message.movieId)
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          sendResponse(json);
        })
        .catch((err) => {
          sendResponse(err);
        });
      return true;
    }
    case "threadData": {
      getThreadComments(message.movieData)
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          sendResponse(json["data"]);
        })
        .catch((err) => {
          sendResponse(err);
        });
      return true;
    }
    case "search": {
      search(message.word, message.UserAgent)
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          sendResponse(json);
        })
        .catch((err) => {
          sendResponse(err);
        });
      return true;
    }
    case "user": {
      const url = "https://nvapi.nicovideo.jp/v1/users/" + message.id;
      fetch(url, {
        headers: {
          "User-Agent": message.UserAgent,
          "x-frontend-id": "6",
          "x-frontend-version": "0",
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          sendResponse(json);
        })
        .catch((err) => {
          sendResponse(err);
        });
      return true;
    }
    case "channel": {
      const url =
        "https://public.api.nicovideo.jp/v1/channel/channelapp/channels/" +
        message.id +
        ".json";
      fetch(url)
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          sendResponse(json);
        })
        .catch((err) => {
          sendResponse(err);
        });
      return true;
    }
    default:
      return false;
  }
});

/**
 * インストール直後につかいかたページを開く
 */
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.tabs.create({
      url: chrome.runtime.getURL("use.html"),
    });
  }
});

export default {};
