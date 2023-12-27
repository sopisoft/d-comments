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
import Editor from "./editor";
import "./options.scss";

const Options = () => {
  const [options, setOptions] = useState<Array<Config.config>>(
    Config.defaultConfigs
  );

  const t: Array<Config.config> = [];
  for (const i of Config.defaultConfigs) {
    Config.getConfig(i.key, (value) => {
      const r: Config.config = {
        key: i.key,
        value: value,
        type: i.type,
      };
      t.push(r);
      if (i === Config.defaultConfigs[Config.defaultConfigs.length - 1]) {
        setOptions(t);
      }
    });
  }

  const setOption = (m: string, v: string | number | boolean) => {
    const d = Config.defaultConfigs.find((i) => i.key === m)?.type;
    const t: Array<Config.config> = options.filter((n) => n.key !== m);
    const r: Config.config = {
      key: m,
      value: v,
      type: d as "number" | "text" | "checkbox" | "color" | "select",
    };
    setOptions(t.concat(r));
  };

  const onChange = (
    e: Event & { currentTarget: HTMLInputElement; target: Element }
  ) => {
    const target = e.target as HTMLInputElement;
    const name = target.name;
    if (target.type === "checkbox") {
      const v = options.find((i) => i.key === name)?.value;
      setOption(name, !v);
      Config.setConfig(name, !v);
    } else {
      const v = target.value;
      setOption(name, v);
      Config.setConfig(name, v);
    }
  };

  browser.storage.onChanged.addListener((changes) => {
    for (const [key, { newValue }] of Object.entries(changes)) {
      setOption(key, newValue);
    }
  });

  return (
    <>
      <header>
        <span className="inner">
          <i className="codicon codicon-settings-gear" />
        </span>
        <h1>設定</h1>
      </header>
      <div className="wrapper">
        <div id="left-side">
          <div>
            <h2>ポップアップ</h2>
            <Editor
              p="ポップアップを開いたとき最後に入力した動画IDを表示する"
              o={options}
              update={onChange}
            />
            <Editor
              p="ポップアップを開いたとき自動で動画検索を開始する"
              o={options}
              update={onChange}
            />
          </div>
          <div>
            <h2>作品ページ</h2>
            <Editor
              p="作品ページに「コメントを表示しながら再生」ボタンを追加する"
              o={options}
              update={onChange}
            />
            <Editor
              p="「コメントを表示しながら再生」ボタンでは新しいタブで開く"
              o={options}
              update={onChange}
            />
          </div>
          <div>
            <h2>コメントの種類</h2>
            <Editor p="投稿者コメント" o={options} update={onChange} />
            <Editor p="通常コメント" o={options} update={onChange} />
            <Editor p="かんたんコメント" o={options} update={onChange} />
          </div>{" "}
          <div>
            <h2>ニコニコ動画へのログイン</h2>
            <Editor
              p="allow_login_to_nicovideo"
              o={options}
              update={onChange}
            />
          </div>
        </div>
        <div id="right-side">
          <div>
            <h2>視聴ページ</h2>
            <Editor
              p="スクロールモードを利用可能にする"
              o={options}
              update={onChange}
            />
            <Editor
              p="自動スクロールの実行間隔 (ミリ秒)"
              o={options}
              update={onChange}
            />
            <Editor p="コメント欄の幅 (px)" o={options} update={onChange} />
            <Editor
              p="コメント欄のスクールバーを表示する"
              o={options}
              update={onChange}
            />
          </div>
          <div>
            <h2>コメント欄の色</h2>
            <Editor p="コメント欄の背景色" o={options} update={onChange} />
            <Editor
              p="コメント欄の背景不透明度 (%)"
              o={options}
              update={onChange}
            />
            <Editor p="コメントの文字色" o={options} update={onChange} />
          </div>
          <div>
            <h2>コメントの表示方法</h2>
            <Editor p="way_to_render_comments" o={options} update={onChange} />
          </div>
          <div
            style={{
              opacity:
                options.find((i) => i.key === "way_to_render_comments")
                  ?.value === "list_overlay"
                  ? 1
                  : 0.6,
            }}
          >
            <h2>コメントリストのオーバーレイ （β版）</h2>
            <Editor
              p="画面の上部分からの距離 (%)"
              o={options}
              update={onChange}
            />
            <Editor
              p="画面の左部分からの距離 (%)"
              o={options}
              update={onChange}
            />
            <Editor p="コメント欄の高さ (%)" o={options} update={onChange} />
          </div>
        </div>
      </div>

      <footer>
        <span className="info">
          {browser.runtime.getManifest().name}
          &nbsp;-&nbsp;Version&nbsp;{browser.runtime.getManifest().version}
        </span>
        <span className="info">
          &copy;&nbsp;{new Date().getFullYear()}&nbsp;
          {browser.runtime.getManifest().author}
        </span>
        <div className="links">
          <span className="link">
            <a
              href="https://forms.office.com/r/JR9KksWHJD"
              target="_blank"
              rel="noreferrer"
            >
              <i className="codicon codicon-feedback" />
              &nbsp;
              <span>FeedBack</span>
            </a>
          </span>
          <span className="link">
            <a
              href="https://github.com/gobosan/d-comments"
              target="_blank"
              rel="noreferrer"
            >
              <i className="codicon codicon-mark-github" />
              &nbsp;
              <span>GitHub</span>
            </a>
          </span>
        </div>
      </footer>
    </>
  );
};

const root = document.createElement("div");
root.id = "options";
document.body.appendChild(root);

createRoot(root).render(<Options />);
