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
import { createRoot } from "react-dom/client";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";
import "zenn-content-css";
import "./how_to_use.css";
import md from "./how_to_use.md";

const HowToUse = () => {
  return (
    <Markdown
      className="znc"
      remarkPlugins={[
        remarkGfm,
        [
          remarkToc,
          {
            heading: "目次",
          },
        ],
      ]}
      rehypePlugins={[rehypeRaw, rehypeSlug]}
    >
      {md}
    </Markdown>
  );
};

const root = document.createElement("div");
root.id = "root";
document.body.appendChild(root);

createRoot(root).render(<HowToUse />);
