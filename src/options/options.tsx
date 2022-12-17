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
import * as ReactDOM from "react-dom/client";
import "./options.scss";
import * as Config from "../content_script/config";
import Editor from "./editor";

const Options = () => {
  const [options, setOptions] = React.useState<Array<Config.config>>(
    Config.defaultConfigs
  );

  React.useEffect(() => {
    const t: Array<Config.config> = [];
    Config.defaultConfigs.forEach((i, idx, array) => {
      Config.getConfig(i.key, (value) => {
        const r: Config.config = {
          key: i.key,
          value: value,
          type: i.type,
        };
        t.push(r);
        if (idx === array.length - 1) {
          setOptions(t);
        }
      });
    });
  }, []);

  const setOption = (m: string, v: string | number | boolean) => {
    const d = Config.defaultConfigs.find((i) => i.key === m)?.type;
    const t: Array<Config.config> = options.filter((n) => n.key !== m);
    const r: Config.config = {
      key: m,
      value: v,
      type: d as string,
    };
    setOptions(t.concat(r));
  };

  const onChange = (e: any) => {
    const n = e.target.name;
    if (e.target.type === "checkbox") {
      const v = options.find((i) => i.key === n)?.value;
      setOption(n, !v);
      Config.setConfig(n, !v);
    } else {
      const v = e.target.value;
      setOption(n, v);
      Config.setConfig(n, v);
    }
  };

  return (
    <>
      <header>
        <span className="inner">
          <i className="codicon codicon-settings-gear" />
        </span>
        <h1>設定</h1>
      </header>
      <main>
        <div className="wrapper">
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
          <Editor p="コメント欄の幅 (px)" o={options} update={onChange} />
          <h2>視聴ページ</h2>
          <Editor
            p="スクロールモードを利用可能にする"
            o={options}
            update={onChange}
          />
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
          <h2>コメントの種類</h2>
          <Editor p="投稿者コメント" o={options} update={onChange} />
          <Editor p="通常コメント" o={options} update={onChange} />
          <Editor p="かんたんコメント" o={options} update={onChange} />
        </div>
      </main>
      <footer>
        <span className="info">
          {chrome.runtime.getManifest().name}
          &nbsp;-&nbsp;Version&nbsp;{chrome.runtime.getManifest().version}
        </span>
        <span className="info">
          &copy;&nbsp;{new Date().getFullYear()}&nbsp;
          {chrome.runtime.getManifest().author}
        </span>
        <div className="links">
          <span className="link">
            <a href="https://forms.office.com/r/JR9KksWHJD" target="_blank">
              <i className="codicon codicon-feedback" />
              &nbsp;
              <span>FeedBack</span>
            </a>
          </span>
          <span className="link">
            <a href="https://github.com/gobosan/d-comments" target="_blank">
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

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<Options />);
