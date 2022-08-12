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
import * as Storage from "../../Content/localStorage";
import "./index.scss";

const Popup = () => {
  const [movieId, setMovieId] = React.useState("");
  const [word, setWord] = React.useState("");
  const [result, setResult] = React.useState<SearchResult>();
  const [isActive, setIsActive] = React.useState(false);

  type SearchResult = {
    meta: {
      status: number;
      totalCount: number;
      id: string;
    };
    data: {
      contentId: string;
      title: string;
      commentCounter: number;
      thumbnailUrl: string;
      viewCounter: number;
      lengthSeconds: number;
    }[];
  };

  const sendMessage = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id as number, {
        type: "renderComments",
        movieId: movieId,
      }),
        (response: string) => {
          console.log(response);
        };
    });
  };

  const handler = (value: string) => {
    window.localStorage.setItem("movieId", value);
    setMovieId(value);
  };

  const search = async (word: string) => {
    chrome.runtime
      .sendMessage({
        type: "search",
        word: word,
        UserAgent: navigator.userAgent ?? "",
      })
      .then((response) => {
        console.log(response);
        window.localStorage.setItem("searchResult", JSON.stringify(response));
        setResult(response);
      });
  };

  React.useEffect(() => {
    const init = (title: string) => {
      Storage.getOption(
        "ポップアップを開いたとき最後に入力した動画IDを表示する",
        (value) => {
          if (value === true) {
            setMovieId(window.localStorage.getItem("movieId") ?? "");
          }
        }
      );
      Storage.getOption(
        "ポップアップを開いたとき自動で動画検索を開始する",
        (value) => {
          if (value === true) {
            setWord(title);
            search(title);
          } else {
            setResult(
              JSON.parse(window.localStorage.getItem("searchResult") as string)
            );
          }
        }
      );
    };
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log(tabs[0]?.url);
      tabs[0]?.url?.includes(
        "https://animestore.docomo.ne.jp/animestore/sc_d_pc"
      )
        ? (setIsActive(true), init(tabs[0]?.title ?? ""))
        : setIsActive(false);
    });
  }, []);

  return (
    <>
      <a
        href="options.html"
        className="btn-option"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>
          <i className="codicon codicon-settings-gear" />
        </span>
      </a>

      {isActive ? (
        <>
          <label className="movieId">
            <p>
              動画ID
              <a
                href="https://dic.nicovideo.jp/a/id"
                target="_blank"
                rel="noopener noreferrer"
              >
                【詳細】
              </a>
            </p>
            <input value={movieId} onChange={(e) => handler(e.target.value)} />
            <a
              className="btn btn-draw"
              onClick={() => {
                sendMessage();
              }}
            >
              表示
            </a>
          </label>
          <label className="search">
            <p>検索ワード</p>
            <input value={word} onChange={(e) => setWord(e.target.value)} />
            <a
              className="btn btn-search"
              onClick={() => {
                search(word);
              }}
            >
              <span>
                <i className="codicon codicon-search" />
              </span>
            </a>
          </label>
          <ul className="result">
            {result?.meta?.status === 200 &&
              result?.data?.map((item, index) => (
                <li
                  key={index}
                  onClick={() => {
                    handler(item.contentId);
                  }}
                >
                  <a className="title">
                    <span>{item.title}</span>
                  </a>
                  <div className="wrapper">
                    <img src={item.thumbnailUrl} alt={item.title} />
                    <div className="info">
                      <p>動画情報</p>
                      <a>再生数&emsp;&emsp;&nbsp;:&nbsp;{item.viewCounter}</a>
                      <a>コメント数&nbsp;:&nbsp;{item.commentCounter}</a>
                      <a>
                        動画の尺&emsp;&nbsp;:&nbsp;
                        {Math.floor(item.lengthSeconds / 3600) > 0
                          ? `${Math.floor(item.lengthSeconds / 3600)}時間`
                          : ""}
                        {Math.floor(item.lengthSeconds / 60) > 0
                          ? `${Math.floor(item.lengthSeconds / 60)}分`
                          : ""}
                        {item.lengthSeconds % 60}秒
                      </a>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </>
      ) : (
        <p className="error">
          <span className="inner">
            <i className="codicon codicon-info" />
          </span>
          <a>現在使用中のタブでは使用できません。</a>
        </p>
      )}
    </>
  );
};

export default Popup;
