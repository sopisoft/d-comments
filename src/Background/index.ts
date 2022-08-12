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

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case "movieData": {
      const actionTrackId =
        Math.random().toString(36).slice(-10) +
        "_" +
        getRandomInt(10 ** 12, 10 ** 13);
      const url = `https://www.nicovideo.jp/api/watch/v3_guest/${message.movieId}`;
      const params = {
        _frontendId: "6",
        _frontendVersion: "0",
        actionTrackId: actionTrackId,
      };
      fetch(url + "?" + new URLSearchParams(params), {
        credentials: "omit",
        headers: {
          "x-client-os-type": "android",
          "x-frontend-id": "3",
          "x-frontend-version": "0.1.0",
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
    case "threadData": {
      const nvComment = message.watchData["data"]["comment"]["nvComment"];
      const serverUrl = nvComment["server"] + "/v1/threads";
      const jsonBody = {
        threadKey: nvComment["threadKey"],
        params: nvComment["params"],
        additionals: {},
      };
      fetch(serverUrl + "?_frontendId=6", {
        headers: {
          "Content-Type": "application/json",
          "x-frontend-id": "6",
          "x-frontend-version": "0",
        },
        method: "POST",
        body: JSON.stringify(jsonBody),
      })
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
      const endpoint =
        "https://api.search.nicovideo.jp/api/v2/snapshot/video/contents/search";
      const params = {
        q: message.word,
        targets: "title,description,tags",
        _sort: "-commentCounter",
        fields:
          "contentId,title,thumbnailUrl,commentCounter,viewCounter,lengthSeconds",
        _limit: "20",
        _context: "d-comments",
      };
      fetch(endpoint + "?" + new URLSearchParams(params), {
        headers: {
          "User-Agent": message.UserAgent,
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
    default:
      return false;
  }
});

export default {};
