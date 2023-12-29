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
import * as Config from "../content_scripts/config";
import { config, defaultConfigs, getConfig } from "../content_scripts/config";
import { configs, setOption } from "./states";

const Editor = (props: { _key: config["key"]; text?: string }) => {
  const key = props._key;
  const text = props.text;
  const type = defaultConfigs.find((item) => item.key === key)?.type;
  const value = configs.find((item) => item.key === key)?.value;

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const name = target.name as typeof key;
    if (target.type === "checkbox") {
      const v = configs.find((i) => i.key === name)?.value;
      setOption(name, !v);
      Config.setConfig(name, !v);
    } else {
      const v = target.value;
      setOption(name, v);
      Config.setConfig(name, v);
    }
  };

  switch (type) {
    case "number":
      return (
        <input
          type="number"
          id={key}
          name={key}
          value={value as number}
          onChange={onChange}
        />
      );
    case "checkbox":
      return (
        <input
          type="checkbox"
          id={key}
          name={key}
          checked={value as boolean}
          onChange={onChange}
        />
      );
    case "color":
      return (
        <input
          type="color"
          id={key}
          name={key}
          value={value as string}
          onChange={onChange}
        />
      );
    case "select":
      return (
        <select
          name={key}
          value={value as string}
          title={text}
          onChange={onChange}
        >
          {(
            defaultConfigs.find((item) => item.key === key) as Config.config
          ).options?.map((option) => {
            return <option value={option.value}>{option.name}</option>;
          })}
        </select>
      );
    default:
      return <div>An error has occurred.</div>;
  }
};

const EditorWrapper = (props: { _key: config["key"] }) => {
  const key = props._key;
  const text = defaultConfigs.find((item) => item.key === key)?.text;
  return (
    <div className="editor">
      <label htmlFor={key}>{text}</label>
      <Editor _key={key} text={text} />
    </div>
  );
};

export default EditorWrapper;
