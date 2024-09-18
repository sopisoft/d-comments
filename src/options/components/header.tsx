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

import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Settings } from "lucide-react";
import browser from "webextension-polyfill";

function Header(props: { tabsList: React.ReactNode }) {
  const contents: {
    title: string;
    href: string;
    description: string;
  }[] = [
    {
      title: "つかいかた",
      href: browser.runtime.getURL("how_to_use/how_to_use.html"),
      description: "この拡張機能の使い方を説明したページを開きます。",
    },
    {
      title: "Form",
      href: "https://forms.office.com/r/JR9KksWHJD",
      description: "バグ報告・機能リクエストのできるフォームを開きます。",
    },
    {
      title: "Issue",
      href: "https://github.com/sopisoft/d-comments/issues/new/choose",
      description:
        "バグ報告ページを開きます。報告には GitHub アカウントが必要です。",
    },
  ];

  return (
    <header className="flex items-center justify-center w-fullpx-4 py-2 border-b border-gray-200">
      <div className="flex items-center space-x-4 max-w-4xl">
        <Settings className="w-10 h-10 max-md:w-4 maxmd:h-4" />
        <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight max-md:text-base">
          設定
        </h1>
        <ul className="flex items-center list-none space-x-2 mx-2">
          <li className="mx-3">{props.tabsList}</li>
          {contents.map((component) => (
            <li key={component.href}>
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger>
                    <a
                      href={component.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-2 border rounded-md border-gray-300"
                    >
                      <p>{component.title}</p>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{component.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </li>
          ))}
        </ul>
      </div>
      <ModeToggle />
    </header>
  );
}

export default Header;
