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

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  type config_keys,
  type config_value,
  getConfig,
  getConfigText,
  getDefaultValue,
  getValueType,
  setConfig,
} from "@/config";
import { CircleX, Plus } from "lucide-react";
import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import browser from "webextension-polyfill";

function Editor<T extends config_keys>(props: {
  _key: T;
  text?: string;
  className?: string;
}) {
  const key = useMemo(() => props._key, [props._key]);
  const text = useMemo(() => props.text, [props.text]);
  const type = useMemo(() => getValueType(key), [key]);

  const [value, setValue] = useState<config_value<T>>(getDefaultValue(key));

  const setOption = (key: T, value: config_value<T>) => {
    setValue(value);
    setConfig(key, value);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const name = target.name as typeof key;
    const v = target.value;
    setOption(name, v);
  };

  const onCheckedChange = (v: boolean) => {
    setOption(key, v);
  };
  const onSliderChange = (v: number) => {
    setOption(key, v);
  };

  type TTextList = { key: string; value: string; enabled: boolean };
  const onTextListChange = (target: string, new_value: string) => {
    const v = value as TTextList[];
    const i = v.findIndex((v) => v.key === target);
    v[i].value = new_value;
    setOption(key, v);
  };
  const onTextListToggle = (text_key: string) => {
    const v = value as TTextList[];
    const i = v.findIndex((v) => v.key === text_key);
    v[i].enabled = !v[i].enabled;
    setOption(key, v);
  };
  const onTextListAdd = () => {
    const v = value as TTextList[];
    const new_key = crypto.getRandomValues(new Uint32Array(1))[0].toString();
    const new_value = "[(ネタ|ねた)][(バレ|ばれ)]";
    v.push({ key: new_key, value: new_value, enabled: true });
    setOption(key, v);
  };
  const onTextListRemove = (text_key: string) => {
    const v = value as TTextList[];
    const i = v.findIndex((v) => v.key === text_key);
    v.splice(i, 1);
    setOption(key, v);
  };

  useEffect(() => {
    browser.storage.onChanged.addListener((changes) => {
      if (changes[key] === undefined) return;
      setValue(changes[key].newValue as config_value<T>);
    });
    getConfig(key).then((v) => setValue(v));
  }, [key]);

  switch (type) {
    case "number":
      return (
        <Input
          type="number"
          id={key}
          name={key}
          value={value as number}
          onChange={onChange}
          className={`${props.className} w-32`}
        />
      );
    case "checkbox":
      return (
        <Checkbox
          id={key}
          name={key}
          title={text}
          checked={value as boolean}
          onCheckedChange={onCheckedChange}
          className={props.className}
        />
      );
    case "color":
      return (
        <Input
          type="color"
          id={key}
          name={key}
          value={value as string}
          onChange={onChange}
          className={`${props.className} w-32`}
        />
      );
    case "slider":
      return (
        <Slider
          id={key}
          name={key}
          value={[value as number]}
          defaultValue={[value as number]}
          max={100}
          step={10}
          className={`${props.className} w-32`}
          onValueChange={(v) => {
            const target = v[0];
            onSliderChange(target);
          }}
        />
      );
    case "switch":
      return (
        <Switch
          id={key}
          name={key}
          title={text}
          checked={value as boolean}
          onCheckedChange={onCheckedChange}
          className={props.className}
        />
      );
    case "text_list": {
      if (!Array.isArray(value)) return <div>An error has occurred.</div>;
      return (
        <>
          <Plus className="cursor-pointer" onClick={onTextListAdd} />
          <div className="w-full col-span-4 flex flex-col gap-3 items-center justify-center text-center">
            <div className="w-full grid grid-cols-4 gap-3">
              <div className="col-span-2">テキスト</div>
              <div className="col-span-1">有効</div>
              <div className="col-span-1">削除</div>
            </div>
            {value.map((v) => (
              <div
                key={v.key}
                className="w-full grid grid-cols-4 gap-3 items-center justify-center place-items-center"
              >
                <Input
                  type="text"
                  value={v.value}
                  onChange={(e) => onTextListChange(v.key, e.target.value)}
                  className="col-span-2"
                />
                <Switch
                  checked={v.enabled}
                  onCheckedChange={() => onTextListToggle(v.key)}
                  className="col-span-1"
                />
                <CircleX
                  className="cursor-pointer col-span-1"
                  onClick={() => onTextListRemove(v.key)}
                />
              </div>
            ))}
          </div>
        </>
      );
    }
    default:
      return <div>An error has occurred.</div>;
  }
}

const EditorWrapper = (props: { _key: config_keys }) => {
  const key = useMemo(() => props._key, [props._key]);
  const text = getConfigText(key);
  const type = getValueType(key);

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
      <Editor
        _key={key}
        text={text}
        className="col-span-1 justify-self-center"
      />
    </div>
  );
};

export default EditorWrapper;
