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

import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import browser from "webextension-polyfill";

import * as Config from "../content_scripts/config";
import "../global.css";
import "./popup.scss";

const Popup = () => {
  const [tabPage, setTabPage] = useState<"watch" | "other">("other");

  const [movieId, setMovieId] = useState("");
  const [word, setWord] = useState("");

  const [owner, setOwner] = useState<Owner>();
  const [result, setResult] = useState<SearchResult>();

  type SearchResult = {
    meta: {
      status: number;
      totalCount: number;
      id: string;
    };
    data: {
      contentId: string;
      title: string;
      userId: string;
      channelId: string;
      commentCounter: number;
      thumbnailUrl: string;
      viewCounter: number;
      lengthSeconds: number;
    }[];
  };

  type Owner = {
    contentId: string;
    ownerId: string;
    ownerName: string;
    ownerIconUrl: string;
  }[];

  /**
   * 作品視聴ページか判定
   * @param href window.location
   * @returns boolean
   */
  const isWatchPage = (location: string | undefined) => {
    if (location) {
      const url = new URL(location);
      return url.pathname === "/animestore/sc_d_pc";
    }
    return false;
  };

  /**
   * 視聴ページでコメントを表示する
   */
  const sendMessage = () => {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      isWatchPage(tabs[0]?.url) &&
        browser.tabs.sendMessage(tabs[0].id as number, {
          type: "renderComments",
          movieId: movieId,
          data: undefined,
        });
    });
  };

  /**
   * コメントをファイルで出力する
   */
  const exportJson = () => {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      isWatchPage(tabs[0]?.url) &&
        browser.tabs.sendMessage(tabs[0].id as number, {
          type: "exportJson",
          movieId: movieId,
        });
    });
  };

  /**
   * 動画ID用 Input ハンドラ
   */
  const handler = (value: string) => {
    window.localStorage.setItem("movieId", value);
    setMovieId(value);
  };

  /**
   * コメントファイル Input ハンドラ
   */

  const onFileInputChange = (e: Event & { target: HTMLInputElement }) => {
    console.log(e.target.files);
    const f = e.target.files?.[0];
    if (f) {
      const reader = new FileReader();
      reader.onload = () => {
        console.log("FileData", reader.result);
        loadFile(reader.result as string);
      };
      reader.readAsText(f);
    } else {
      return;
    }
  };

  /**
   * コメントファイル読み込み
   */
  const loadFile = (data: string) => {
    if (data.length > 0) {
      browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        isWatchPage(tabs[0]?.url) &&
          browser.tabs.sendMessage(tabs[0].id as number, {
            type: "renderComments",
            movieId: movieId,
            data: data,
          });
      });
    }
  };

  /**
   * スナップショットAPIを使ってキーワードで動画を検索
   * @param word キーワード
   * @returns 動画情報
   * @see https://site.nicovideo.jp/search-api-docs/snapshot
   */
  const search = async (word: string) => {
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
      isWatchPage(tabs[0]?.url) &&
        browser.runtime
          .sendMessage({
            type: "search",
            word: word,
            UserAgent: "d-comments",
          })
          .then((response) => {
            if (response.meta.status === 200) {
              console.log("検索結果", response);
              setResult(response);
              for (const item of response.data) {
                const isUser = item.userId ? true : false;
                getOwnerInfo(
                  item.contentId,
                  isUser ? item.userId : item.channelId,
                  isUser ? true : false
                );
              }
            } else {
              return;
            }
          });
    });
  };

  /**
   * 動画投稿者の名前、アイコンURLを取得
   * @param contentId 動画ID
   * @param ownerId ユーザーID または チャンネルID
   * @param isUser ユーザーかチャンネルか
   * @returns 動画投稿者の名前、アイコンURL
   */
  const getOwnerInfo = (
    contentId: string,
    ownerId: string,
    isUser: boolean
  ) => {
    const res: Owner = [];
    browser.runtime
      .sendMessage({
        type: isUser ? "user" : "channel",
        id: ownerId,
        UserAgent: navigator.userAgent ?? "",
      })
      .then((response) => {
        if (response.meta.status === 200) {
          const setOwnerInfo = async () => {
            res.push({
              contentId: contentId,
              ownerId: ownerId,
              ownerName: isUser
                ? response.data.user.nickname
                : response.data.name,
              ownerIconUrl: isUser
                ? response.data.user.icons.small
                : response.data.icon,
            });
          };
          setOwnerInfo().then(() => {
            setOwner((owner) => (owner ? [...owner, ...res] : res));
          });
        } else {
          return;
        }
      });
    return res;
  };

  const init = (title: string) => {
    Config.getConfig("show_last_searched_video_id", (value) => {
      if (value === true) {
        setMovieId(window.localStorage.getItem("movieId") ?? "");
      }
    });
    Config.getConfig("auto_search", (value) => {
      if (value === true) {
        setWord(title);
        search(title);
      }
    });
  };

  browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
    console.log(tabs[0]?.url);
    isWatchPage(tabs[0]?.url) && setTabPage("watch");
    init(tabs[0]?.title ?? "");
  });

  return (
    <>
      <a
        aria-label="設定"
        href={browser.runtime.getURL("options.html")}
        className="btn-option"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span>
          <i className="codicon codicon-settings-gear" />
        </span>
      </a>

      {tabPage === "watch" ? (
        <>
          <label>
            <p>
              動画ID
              <a
                href="https://dic.nicovideo.jp/a/id"
                target="_blank"
                rel="noopener noreferrer"
              >
                【動画IDとは】
              </a>
            </p>
            <div>
              <input
                className="input-movieId"
                value={movieId}
                onInput={(e) => handler((e.target as HTMLInputElement).value)}
              />
              <button
                type="button"
                aria-label="コメントをファイルに出力する"
                className="btn"
                onClick={() => {
                  exportJson();
                }}
              >
                保存
              </button>
              <button
                type="button"
                aria-label="視聴ページでコメントを表示する"
                className="btn"
                onClick={() => {
                  sendMessage();
                }}
              >
                表示
              </button>
            </div>
          </label>
          <label>
            <p>コメントファイル読み込み</p>
            <div>
              <input
                className="input-file"
                type="file"
                accept=".json"
                onChange={() => {
                  onFileInputChange;
                }}
              />
            </div>
          </label>
          <label>
            <p>動画検索</p>
            <div>
              <input
                className="input-search"
                value={word}
                onChange={(e) => setWord((e.target as HTMLInputElement).value)}
                placeholder="検索ワードを入力"
              />
              <button
                type="button"
                aria-label="検索"
                className="btn"
                onClick={() => {
                  search(word);
                }}
              >
                <span>
                  <i className="codicon codicon-search" />
                </span>
              </button>
            </div>
          </label>
          <ul className="result">
            {result?.meta?.status === 200 &&
              result?.data?.map((item) => (
                <li
                  onClick={() => {
                    handler(item.contentId);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handler(item.contentId);
                    }
                  }}
                >
                  <span className="title">
                    <span>{item.title}</span>
                  </span>
                  <div className="wrapper">
                    <img src={item.thumbnailUrl} alt={item.title} />
                    <div className="info">
                      <p>動画情報</p>
                      <div className="owner">
                        <img
                          src={
                            owner?.find(
                              (ownerItem) =>
                                ownerItem.contentId === item.contentId
                            )?.ownerIconUrl
                          }
                          alt={
                            owner?.find(
                              (ownerItem) =>
                                ownerItem.contentId === item.contentId
                            )?.ownerName
                          }
                        />
                        <p>
                          {
                            owner?.find(
                              (ownerItem) =>
                                ownerItem.contentId === item.contentId
                            )?.ownerName
                          }
                        </p>
                      </div>
                      <span>
                        再生数&emsp;&emsp;&nbsp;:&nbsp;{item.viewCounter}
                      </span>
                      <span>コメント数&nbsp;:&nbsp;{item.commentCounter}</span>
                      <span>
                        動画の尺&emsp;&nbsp;:&nbsp;
                        {Math.floor(item.lengthSeconds / 3600) > 0 &&
                          `${Math.floor(item.lengthSeconds / 3600)}時間`}
                        {Math.floor(item.lengthSeconds / 60) > 0 &&
                          `${Math.floor(item.lengthSeconds / 60)}分`}
                        {item.lengthSeconds % 60}秒
                      </span>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </>
      ) : (
        <div className="not-active">
          <div className="message">
            <i className="codicon codicon-info" />
            <p>現在のタブでは使用できません。</p>
          </div>
          <div className="link">
            <a
              href={browser.runtime.getURL("options.html")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              <i className="codicon codicon-settings-gear" />
              <span>設定</span>
            </a>
          </div>
          <div className="link">
            <a
              href={browser.runtime.getURL("how_to_use.html")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              <i className="codicon codicon-question" />
              <span>つかいかた</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
};

createRoot(document.body).render(<Popup />);
