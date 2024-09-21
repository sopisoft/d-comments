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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  type config_keys,
  getDefaultValue,
  getValueType,
  setConfig,
} from "@/config";
import { getConfig } from "@/config";
import { useEffect, useState } from "react";
import browser from "webextension-polyfill";

function EditorNumber(props: {
  _key: config_keys;
  text: string;
}) {
  const key = props._key;
  const text = props.text;

  const type = getValueType(key);
  if (type !== "number")
    return (
      <p>
        EditorNumber: Invalid type {type} for {key}
      </p>
    );

  type value = number;
  const [value, setValue] = useState<value>(getDefaultValue(key) as value);

  function save(v: number) {
    setValue(v);
    setConfig(key, v);
  }

  function digits(n: number) {
    return String(n).split(".")[0].length;
  }

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
    <div className="gap-1 flex flex-row items-center justify-between">
      <Label htmlFor={key} className="m-2 text-sm font-medium leading-tight">
        {text}
      </Label>
      <div className="flex flex-row items justify-center gap-2">
        <Button
          variant="outline"
          onClick={() => {
            save(value - 10 ** (digits(value) - 1));
          }}
        >
          - {10 ** (digits(value) - 1)}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            save(value - 10 ** (digits(value) - 2));
          }}
        >
          - {10 ** (digits(value) - 2)}
        </Button>
        <Input
          id={key}
          type="number"
          name={key}
          value={value}
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            save(Number(target.value));
          }}
          className="w-20"
        />
        <Button
          variant="outline"
          onClick={() => {
            save(value + 10 ** (digits(value) - 2));
          }}
        >
          + {10 ** (digits(value) - 2)}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            save(value + 10 ** (digits(value) - 1));
          }}
        >
          + {10 ** (digits(value) - 1)}
        </Button>
      </div>
    </div>
  );
}

export default EditorNumber;
