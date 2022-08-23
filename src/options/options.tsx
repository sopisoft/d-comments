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
import { defaultOptions, options } from "../content_script/localStorage";

const Options = () => {
  const [options, setOptions] = React.useState<options>(defaultOptions);

  const onChange = (key: string, value: string | number | boolean) => {
    const newOptions = { ...options, [key]: value };
    setOptions(newOptions);
    chrome.storage.local.set(newOptions, () => {
      console.log("保存しました！", { key, value });
    });
  };

  React.useEffect(() => {
    chrome.storage.local.get(null, (result) => {
      Object.keys(defaultOptions).map((key: string) => {
        if (result[key] === undefined) {
          result[key] = defaultOptions[key];
        }
      });
      Object.keys(result).map((key: string) => {
        if (!(key in defaultOptions)) {
          delete result[key];
          chrome.storage.local.remove(key as string, () => {
            console.log("存在しないオプションを削除しました！");
          });
        }
      });
      console.log("取得しました！", result);
      setOptions(result);
    });
  }, []);

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
          {Object.keys(options).map((key) => {
            return (
              <div className="editor" key={key}>
                <>
                  <label htmlFor={key}>{key}</label>
                  {typeof options[key] === "boolean" ? (
                    <input
                      type="checkbox"
                      id={key}
                      name={key}
                      checked={options[key] as boolean}
                      onChange={() => onChange(key, !(options[key] as boolean))}
                    />
                  ) : typeof options[key] === "number" ? (
                    <input
                      type="number"
                      id={key}
                      name={key}
                      value={options[key] as number}
                      onChange={(e) => onChange(key, parseInt(e.target.value))}
                    />
                  ) : (
                    <input
                      type="text"
                      id={key}
                      name={key}
                      value={options[key] as string}
                      onChange={(e) => onChange(key, e.target.value)}
                    />
                  )}
                </>
              </div>
            );
          })}
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
        <span className="github">
          <a href="https://github.com/gobosan/d-comments" target="_blank">
            <i className="codicon codicon-mark-github" />
            &nbsp;
            <span>GitHub</span>
          </a>
        </span>
      </footer>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Options />);
