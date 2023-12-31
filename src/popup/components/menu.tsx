import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HelpCircle, Settings } from "lucide-react";
import React from "react";
import browser from "webextension-polyfill";

function Menu() {
  return (
    <>
      <Separator className="mt-2" />

      <div className="flex flex-row space-x-2 justify-evenly items-center">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger className="flex flex-row items-center justify-center space-x-2 m-2 p-2 w-2/5">
              <a
                href={browser.runtime.getURL("options.html")}
                target="_blank"
                rel="noopener noreferrer"
                className="grid items-center gap-1.5 grid-cols-3"
              >
                <Settings className="w-5 h-5 mr-2" />
                <span className="col-span-2">設定</span>
              </a>
            </TooltipTrigger>
            <TooltipContent>新しいタブで設定ページを開きます。</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="h-5" />

        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger className="flex flex-row items-center justify-center space-x-2 m-2 p-2 w-2/5">
              <a
                href={browser.runtime.getURL("how_to_use.html")}
                target="_blank"
                rel="noopener noreferrer"
                className="grid items-center gap-1.5 grid-cols-3"
              >
                <HelpCircle className="w-5 h-5 mr-2" />
                <span className="col-span-2">つかいかた</span>
              </a>
            </TooltipTrigger>
            <TooltipContent>
              新しいタブでつかいかたページを開きます。
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Separator />
    </>
  );
}

export default Menu;
