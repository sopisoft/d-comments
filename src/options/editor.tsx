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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import React, { Suspense, useState } from "react";
import browser from "webextension-polyfill";
import {
  config,
  defaultConfigs,
  getConfig,
  setConfig,
} from "../content_scripts/config";

const Editor = (props: { _key: config["key"]; text?: string }) => {
  const [value, setValue] = useState<config["value"]>();
  getConfig(props._key).then((v) => {
    setValue(v);
  });

  const setOption = (key: config["key"], value: config["value"]) => {
    setValue(value);
    setConfig(key, value);
  };

  const key = props._key;
  const text = props.text;
  const type = defaultConfigs.find((item) => item.key === key)?.type;

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const name = target.name as typeof key;
    const v = target.value;
    setOption(name, v);
  };

  const onCheckedChange = (v: boolean) => {
    setOption(key, v);
  };

  const onSelectedChange = (v: string) => {
    setOption(key, v);
  };
  const options = (defaultConfigs.find((item) => item.key === key) as config)
    .options;

  browser.storage.onChanged.addListener((changes) => {
    for (const [key, { newValue }] of Object.entries(changes)) {
      if (newValue && key === props._key) {
        setOption(key as config["key"], newValue);
      }
    }
  });

  switch (type) {
    case "number":
      return (
        <Input
          type="number"
          id={key}
          name={key}
          value={value as number}
          onChange={onChange}
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
        />
      );
    case "select":
      return (
        <Select
          name={key}
          value={value as string}
          onValueChange={onSelectedChange}
        >
          <SelectTrigger id={key} title={text} className="w-[180px]">
            <SelectValue placeholder={text} />
          </SelectTrigger>
          <SelectContent>
            {options?.map((option) => {
              return (
                <SelectItem value={option.value}>{option.name}</SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      );
    case "switch":
      return (
        <Switch
          id={key}
          name={key}
          title={text}
          checked={value as boolean}
          onCheckedChange={onCheckedChange}
        />
      );
    default:
      return <div>An error has occurred.</div>;
  }
};

const EditorWrapper = (props: { _key: config["key"] }) => {
  const key = props._key;
  const text = defaultConfigs.find((item) => item.key === key)?.text;
  const type = defaultConfigs.find((item) => item.key === key)?.type;
  return (
    <div
      className={`flex items-center ${
        type === "checkbox" && "flex-row-reverse justify-evenly"
      }`}
    >
      <Label
        htmlFor={key}
        className="text-sm font-medium leading-tight basis-[80%]"
      >
        {text}
      </Label>
      <Editor _key={key} text={text} />
    </div>
  );
};

export default EditorWrapper;
