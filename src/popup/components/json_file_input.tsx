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
import React from "react";
import { load_comments_json } from "../json_files";

function JsonFileInput() {
  const [file, setFile] = React.useState<File | null>(null);
  const { toast } = useToast();

  function ErrorMessage(props: {
    error?: Error;
    message?: { title: string; description: string };
  }) {
    toast({
      title: props.message?.title || props.error?.name || "エラー",
      description:
        props.message?.description ||
        props.error?.message ||
        "予期しないエラーが発生しました。",
    });
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
          id="json_file_input"
          className="col-span-5"
          type="file"
          onChange={(e) => {
            if (e.target.files) {
              setFile(e.target.files[0]);
            }
          }}
        />

        <div className="col-span-2 flex justify-end items-center space-x-2">
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger>
                <Button
                  variant="outline"
                  disabled={!file}
                  onClick={() => {
                    !file
                      ? ErrorMessage({
                          message: {
                            title: "ファイルが選択されていません。",
                            description: "ファイルを選択してください。",
                          },
                        })
                      : load_comments_json(file).catch((e) =>
                          ErrorMessage({ error: e })
                        );
                  }}
                >
                  コメントを表示
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                選択された JSON ファイルからコメントを読み込み、表示します。
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </>
  );
}

export default JsonFileInput;
