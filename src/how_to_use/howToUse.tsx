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

import "@/index.css";
import "github-markdown-css";
import "./markdown-body.css";
import { ArrowUp } from "lucide-react";
import { createRoot } from "react-dom/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { find_elements } from "../lib/dom";
import { html, toc } from "./how_to_use.md";

function decode(str: string) {
  let result: string = str;
  const regex = /&#x[0-9A-Fa-f]+;/g;
  const matches = str.match(regex);
  if (matches) {
    for (const match of matches) {
      const code = match.slice(3, -1);
      result = result.replace(
        match,
        String.fromCharCode(Number.parseInt(code, 16))
      );
    }
  }
  return decodeURIComponent(result);
}

const HowToUse = () => {
  return (
    <div className="container flex flex-row gap-4">
      <Card className="p-0 max-w-[30rem] h-[80vh] overflow-auto sticky top-[calc(50vh-40vh)] select-none hidden lg:block">
        <CardHeader>
          <CardTitle>目次</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-none p-0 m-0 flex flex-col gap-2">
            {toc.map((item) => (
              <li
                data-level={item.level}
                key={item.content}
                style={{ marginLeft: `${(Number(item.level) - 1) * 1.5}rem` }}
              >
                <a href={`#${decode(item.content)}`}>{decode(item.content)}</a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div
        className="markdown-body max-w-[800px] mx-auto my-8"
        // biome-ignore lint:
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <a
        href="#top"
        className="fixed bottom-4 right-4 p-2 border border-gray-300 rounded-full bg-white text-gray-700"
      >
        <ArrowUp />
      </a>
    </div>
  );
};

const root = document.createElement("div");
root.id = "root";
document.body.appendChild(root);

createRoot(root).render(<HowToUse />);

window.addEventListener("load", async () => {
  const headers = await find_elements("h1, h2, h3, h4, h5, h6");
  for (const header of headers) {
    header.id = header.textContent || "";
  }

  const anchors = await find_elements("a");
  for (const anchor of anchors) {
    const href = anchor.getAttribute("href");
    if (href === "#top") {
      anchor.addEventListener("click", (e: Event) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    } else if (href?.startsWith("#")) {
      anchor.addEventListener("click", (e: Event) => {
        e.preventDefault();
        const target = document.getElementById(href.slice(1));
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  }
});
