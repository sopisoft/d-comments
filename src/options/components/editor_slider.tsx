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

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  type config_keys,
  getConfig,
  getDefaultValue,
  getValueType,
  setConfig,
} from "@/config";
import { useEffect, useState } from "react";
import browser from "webextension-polyfill";

function EditorSlider(props: {
  _key: config_keys;
  text: string;
}) {
  const key = props._key;
  const text = props.text;

  const type = getValueType(key);
  if (type !== "slider")
    return (
      <p>
        EditorNumber: Invalid type {type} for {key}
      </p>
    );
  type value = number;
  const [value, setValue] = useState<value>(getDefaultValue(key) as value);

  useEffect(() => {
    getConfig(key).then((v) => {
      setValue(v as value);
    });
    browser.storage.onChanged.addListener((changes) => {
      if (!changes[key]) return;
      if (typeof changes[key].newValue !== "number") return;
      setValue(changes[key].newValue);
    });
  }, [key]);

  return (
    <div className="grid grid-cols-4 gap-1 justify-items-stretch items-center">
      <Label
        htmlFor={key}
        className="m-2 text-sm font-medium leading-tight col-span-3"
      >
        {text}
      </Label>
      <Slider
        id={key}
        name={key}
        value={[value]}
        defaultValue={[value]}
        max={100}
        step={10}
        className="col-span-1 justify-self-center w-32"
        onValueChange={(v) => {
          const value = v[0];
          setValue(value);
          setConfig(key, value);
        }}
      />
    </div>
  );
}

export default EditorSlider;
