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
              p="show_last_searched_video_id"
              o={options}
              update={onChange}
            />
            <Editor p="auto_search" o={options} update={onChange} />
          </div>
          <div>
            <h2>作品ページ</h2>
            <Editor
              p="add_button_to_show_comments_while_playing"
              o={options}
              update={onChange}
            />
            <Editor
              p="open_in_new_tab_when_clicking_show_comments_while_playing_button"
              o={options}
              update={onChange}
            />
          </div>
          <div>
            <h2>コメントの種類</h2>
            <Editor p="show_owner_comments" o={options} update={onChange} />
            <Editor p="show_main_comments" o={options} update={onChange} />
            <Editor p="show_easy_comments" o={options} update={onChange} />
          </div>
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
            <Editor p="enable_scroll_mode" o={options} update={onChange} />
            <Editor p="scroll_interval_ms" o={options} update={onChange} />
            <Editor p="comment_area_width_px" o={options} update={onChange} />
            <Editor p="show_comment_scrollbar" o={options} update={onChange} />
          </div>
          <div>
            <h2>コメント欄の色</h2>
            <Editor
              p="comment_area_background_color"
              o={options}
              update={onChange}
            />
            <Editor
              p="comment_area_opacity_percent"
              o={options}
              update={onChange}
            />
            <Editor p="comment_text_color" o={options} update={onChange} />
          </div>
          <div>
            <h2>コメントの表示方法</h2>
            <Editor
              p="comment_rendering_method"
              o={options}
              update={onChange}
            />
          </div>
          <div
            style={{
              opacity:
                options.find((i) => i.key === "comment_rendering_method")
                  ?.value === "list_overlay"
                  ? 1
                  : 0.6,
            }}
          >
            <h2>コメントリストのオーバーレイ</h2>
            <Editor
              p="distance_from_top_percent"
              o={options}
              update={onChange}
            />
            <Editor
              p="distance_from_left_percent"
              o={options}
              update={onChange}
            />
            <Editor
              p="comment_area_height_percent"
              o={options}
              update={onChange}
            />
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
