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

import React from "react";
import "@/index.css";
import "./how_to_use.css";
import "github-markdown-css";
import { ArrowUp, CircleX } from "lucide-react";
import { createRoot } from "react-dom/client";
// @ts-ignore
import { html, toc } from "./how_to_use.md";

type Toc = {
  level: string;
  content: string;
};

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
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "30rem",
          height: "80vh",
          position: "fixed",
          top: "calc(50% - 40vh)",
          left: "calc((100% - 800px) / 2 - 35rem)",
          padding: "1rem",
          backgroundColor: "var(--bgColor-default)",
          borderRadius: "1rem",
          boxShadow: "0 0 1rem rgba(0, 0, 0, 0.1)",
          zIndex: 1,
          overflow: "auto",
        }}
        id="toc"
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2 style={{ margin: "1rem 0 0 1rem" }}>目次</h2>
          <CircleX
            style={{ cursor: "pointer" }}
            onClick={() => {
              const toc = document.getElementById("toc");
              if (toc) {
                toc.style.display = "none";
              }
            }}
          />
        </div>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {(toc as Toc[]).map((item) => (
            <li
              data-level={item.level}
              key={item.content}
              style={{ marginLeft: `${(Number(item.level) - 1) * 1.5}rem` }}
            >
              <a href={`#${decode(item.content)}`}>{decode(item.content)}</a>
            </li>
          ))}
        </ul>
      </div>
      {
        // biome-ignore lint:
        <div dangerouslySetInnerHTML={{ __html: html }} />
      }
      <a
        href="#top"
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          padding: "0.5rem",
          borderColor: "var(--fgColor-default)",
          borderWidth: "1px",
          borderRadius: "50%",
          cursor: "pointer",
          color: "var(--fgColor-default)",
          fontSize: "1.5rem",
          fontWeight: "bold",
        }}
      >
        <ArrowUp />
      </a>
    </>
  );
};

const root = document.createElement("div");
root.id = "root";
root.className = "markdown-body";
document.body.appendChild(root);

createRoot(root).render(<HowToUse />);

window.addEventListener("load", () => {
  const headers = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
  for (const header of headers) {
    header.id = header.textContent || "";
  }

  const anchors = document.querySelectorAll("a");
  for (const anchor of anchors) {
    const href = anchor.getAttribute("href");
    if (href === "#top") {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    } else if (href?.startsWith("#")) {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.getElementById(href.slice(1));
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    }
  }
});
