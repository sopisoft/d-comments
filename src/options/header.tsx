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
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";
import React from "react";
import browser from "webextension-polyfill";

const contents: {
  title: string;
  href: string;
  description: string;
  target?: "_blank";
}[] = [
  {
    title: "つかいかた",
    href: browser.runtime.getURL("how_to_use.html"),
    description: "この拡張機能の使い方を説明したページを開きます。",
  },
  {
    title: "バグ報告",
    href: "https://github.com/gobosan/d-comments/issues/new/choose",
    description:
      "バグ報告ページを開きます。報告には GitHub アカウントが必要です。",
    target: "_blank",
  },
];

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
          target={props.target}
          rel={props.target === "_blank" ? "noopener noreferrer" : undefined}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});

function Header() {
  return (
    <header className="flex items-center justify-between w-full px-4 py-2 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center space-x-4 basis-[calc(100%-10rem)]">
        <Settings className="w-10 h-10" />
        <h1 className="scroll-m-20 text-3xl font-semibold tracking-tight">
          設定
        </h1>
        <NavigationMenu className="ml-8 hidden md:block">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>メニュー</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] list-none">
                  {contents.map((component) => (
                    <ListItem
                      key={component.title}
                      title={component.title}
                      href={component.href}
                      target={component.target}
                    >
                      {component.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <ModeToggle />
    </header>
  );
}

export default Header;
