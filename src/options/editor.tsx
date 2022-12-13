import React from "react";
import * as Config from "../content_script/config";
type Editor = {
  p: string;
  o: Array<Config.config>;
  update: React.ChangeEventHandler;
};
const Editor = (props: Editor) => {
  const { p, o } = props;
  const type = o.find((i) => i.key === p)?.type;
  const value = o.find((i) => i.key === p)?.value;

  return (
    <div className="editor" key={p}>
      <>
        <label htmlFor={p}>{p}</label>
        {type === "text" ? (
          <input
            type="text"
            id={p}
            name={p}
            value={value as string}
            onChange={props.update}
          />
        ) : type === "number" ? (
          <input
            type="number"
            id={p}
            name={p}
            value={value as number}
            onChange={props.update}
          />
        ) : type === "checkbox" ? (
          <input
            type="checkbox"
            id={p}
            name={p}
            checked={value as boolean}
            onChange={props.update}
          />
        ) : (
          ""
        )}
      </>
    </div>
  );
};

export default Editor;
