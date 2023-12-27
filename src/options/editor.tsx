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
import { defaultConfigs, getConfig } from "../content_scripts/config";

type Editor = {
  p: string;
  o: Array<Config.config>;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  update: any;
};
const Editor = (props: Editor) => {
  const p = () => props.p;
  const o = () => props.o;
  const v = () => o().find((i) => i.key === p());
  const t = () => defaultConfigs.find((item) => item.key === p())?.text;
  const type = v()?.type;
  const value = () => v()?.value;

  const [selected, setSelected] = useState("");
  getConfig(p(), (val) => {
    setSelected(val as string);
  });

  return (
    <div className="editor">
      <label htmlFor={p()}>{t() ?? p()}</label>
      {type === "text" ? (
        <input
          type="text"
          id={p()}
          name={p()}
          value={value() as string}
          onChange={props.update}
        />
      ) : type === "number" ? (
        <input
          type="number"
          id={p()}
          name={p()}
          value={value() as number}
          onChange={props.update}
        />
      ) : type === "checkbox" ? (
        <input
          type="checkbox"
          id={p()}
          name={p()}
          checked={value() as boolean}
          onChange={props.update}
        />
      ) : type === "color" ? (
        <input
          type="color"
          id={p()}
          name={p()}
          value={value() as string}
          onChange={props.update}
        />
      ) : (
        type === "select" && (
          <select
            name={p()}
            value={selected}
            title={t()}
            onChange={props.update}
          >
            {defaultConfigs
              .find((item) => item.key === p())
              ?.options?.map((v) => {
                return <option value={v.value}>{v.name}</option>;
              })}
          </select>
        )
      )}
    </div>
  );
};

export default Editor;
