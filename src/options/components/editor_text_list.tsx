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

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  type config,
  type config_keys,
  getConfig,
  getDefaultValue,
  getValueType,
  setConfig,
} from "@/config";
import { CircleX, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import browser from "webextension-polyfill";

type TextList = (
  | config["comment_ng_users"]
  | config["comment_ng_words"]
)["value"];

const EditorTextList = <T extends config_keys>(props: {
  _key: T;
  text: string;
}) => {
  const key = props._key;
  const text = props.text;
  const type = getValueType(key);

  if (type !== "text_list")
    return (
      <p>
        EditorWrapper: Invalid type {type} for {key}
      </p>
    );

  const [value, setValue] = useState<TextList>(
    getDefaultValue(key) as TextList
  );
  const setOption = (item: TextList[number], type: "save" | "remove") => {
    const v = value;
    switch (type) {
      case "save": {
        const i = v.findIndex((v) => v.key === item.key);
        v[i] = item;
        setValue(v);
        setConfig(key, v);
        break;
      }
      case "remove": {
        const i = v.findIndex((v) => v.key === item.key);
        v.splice(i, 1);
        setValue(v);
        setConfig(key, v);
        break;
      }
    }
  };

  const onTextListAdd = () => {
    const v = value;
    const new_key = crypto.getRandomValues(new Uint32Array(1))[0].toString();
    const new_value = "[(ネタ|ねた)][(バレ|ばれ)]";
    v.push({ key: new_key, value: new_value, enabled: true });
    setValue(v);
    setConfig(key, v);
  };

  useEffect(() => {
    getConfig(key).then((v) => {
      setValue(v as TextList);
    });
    browser.storage.onChanged.addListener((changes) => {
      if (!changes[key]) return;
      if (typeof changes[key].newValue !== "object") return;
      setValue(changes[key].newValue as TextList);
    });
  }, [key]);

  return (
    <div className="grid grid-cols-4 gap-1 justify-items-stretch items-center">
      <Label
        htmlFor={key}
        className={`m-2 text-sm font-medium leading-tight col-span-3 ${
          type === "checkbox" ? "order-1" : "-order-1"
        }`}
      >
        {text}
      </Label>
      <Plus className="cursor-pointer" onClick={onTextListAdd} />
      <div className="w-full col-span-4 flex flex-col gap-3 items-center justify-center text-center">
        <div className="w-full grid grid-cols-4 gap-3">
          <div className="col-span-2">テキスト</div>
          <div className="col-span-1">有効</div>
          <div className="col-span-1">削除</div>
        </div>
        {value.map((v) => (
          <Item
            key={v.key}
            value={v}
            requestSave={(...args) => setOption(...args)}
          />
        ))}
      </div>
    </div>
  );
};

const Item = (props: {
  value: TextList[number];
  requestSave: (value: TextList[number], type: "save" | "remove") => void;
}) => {
  const { key } = props.value;
  const ref = useRef<HTMLInputElement>(null);
  const [v, setV] = useState(props.value);
  const onChange = (new_value: string) => {
    const new_v = { ...v, value: new_value };
    setV(new_v);
    props.requestSave(new_v, "save");
  };
  const onToggle = () => {
    const new_v = { ...v, enabled: !v.enabled };
    setV(new_v);
    props.requestSave(new_v, "save");
  };
  const onRemove = () => {
    props.requestSave(v, "remove");
  };

  return (
    <div
      key={key}
      className="w-full grid grid-cols-4 gap-3 items-center justify-center place-items-center"
    >
      <Input
        type="text"
        ref={ref}
        value={v.value}
        onChange={(e) => onChange(e.target.value)}
        className="col-span-2"
      />
      <Switch
        checked={v.enabled}
        onCheckedChange={onToggle}
        className="col-span-1"
      />
      <CircleX className="cursor-pointer col-span-1" onClick={onRemove} />
    </div>
  );
};

export default EditorTextList;
