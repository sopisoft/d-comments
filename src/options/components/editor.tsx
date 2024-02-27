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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  type config,
  defaultConfigs,
  getConfig,
  setConfig,
} from "@/content_scripts/config";
import { type ChangeEvent, useState } from "react";
import browser from "webextension-polyfill";

const Editor = (props: {
  _key: config["key"];
  text?: string;
  className?: string;
}) => {
  const [value, setValue] = useState<config["value"]>();

  const setOption = (key: config["key"], value: config["value"]) => {
    setValue(value);
    setConfig(key, value);
  };

  const key = props._key;
  const text = props.text;
  const type = defaultConfigs.find((item) => item.key === key)?.type;

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
  const select_options = (
    defaultConfigs.find((item) => item.key === key) as config
  ).options;

  const onSliderChange = (v: number) => {
    setOption(key, v);
  };

  browser.storage.onChanged.addListener((changes) => {
    if (changes[key]) setValue(changes[key].newValue);
  });

  if (value === undefined) {
    getConfig(key).then((v) => {
      setValue(v);
    });
  }

  switch (type) {
    case "number":
      return (
        <Input
          type="number"
          id={key}
          name={key}
          value={value as number}
          onChange={onChange}
          className={`${props.className} w-24`}
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
          className={`${props.className} w-24`}
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
          step={1}
          className={`${props.className} w-24`}
          onValueChange={(v) => {
            const target = v[0];
            onSliderChange(target);
          }}
        />
      );
    case "select":
      return (
        <Select
          name={key}
          value={value as string}
          onValueChange={onSelectedChange}
        >
          <SelectTrigger
            id={key}
            title={text}
            className={`${props.className} w-24`}
          >
            <SelectValue placeholder={text} />
          </SelectTrigger>
          <SelectContent>
            {select_options?.map((option) => {
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
          className={props.className}
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
