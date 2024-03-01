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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { useRef, useState } from "react";
import { load_comments_from_json } from "../api/json_files";
import { ErrorMessage } from "../utils";

function JsonFileInput() {
  const input = useRef<HTMLInputElement>(null);
  const [fileList, setFileList] = useState<FileList | null>(null);

  const [fileStr, setFileStr] = useState<string>("");
  const { toast } = useToast();

  function input_handler() {
    const [file] = input.current?.files || [null];

    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        if (input.current?.files) {
          setFileList(input.current.files);
          const result = reader.result?.toString();
          if (!result) return;
          setFileStr(result);
        }
      },
      false
    );
    if (file) {
      reader.readAsText(file);
    }
  }

  function button_handler() {
    if (fileList) {
      load_comments_from_json(fileStr).catch((e) =>
        ErrorMessage(toast, { error: e })
      );
    } else {
      ErrorMessage(toast, {
        message: {
          title: "ファイルが選択されていません。",
          description: "ファイルを選択してください。",
        },
      });
    }
  }

  return (
    <>
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="json_file_input">
                <span className="text-lg font-bold">
                  JSON ファイルからコメント読み込み
                </span>
              </Label>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            JSON ファイルからコメントを読み込み、表示します。
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="grid grid-cols-7 gap-2 my-2">
        <Input
          ref={input}
          className="col-span-5"
          type="file"
          onChange={input_handler}
        />

        <div className="col-span-2 flex justify-end items-center space-x-2">
          <Button
            variant="outline"
            className="w-32"
            disabled={!fileList}
            onClick={button_handler}
          >
            コメントを表示
          </Button>
        </div>
      </div>
    </>
  );
}

export default JsonFileInput;
