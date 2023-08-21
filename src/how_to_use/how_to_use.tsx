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

import "./how_to_use.scss";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkToc from "remark-toc";
import { Suspense, createSignal, onMount } from "solid-js";
import { render } from "solid-js/web";
import { unified } from "unified";
import browser from "webextension-polyfill";
import "zenn-content-css";

const parseMarkdown = async (text: string): Promise<string> => {
	return String(
		await unified()
			.use(remarkParse)
			.use(remarkToc, {
				heading: "目次",
				tight: true,
				prefix: "user-content-",
			})
			.use(remarkGfm)
			.use(remarkRehype)
			.use(rehypeSlug)
			.use(rehypeSanitize)
			.use(rehypeStringify)
			.process(text),
	);
};

const how_to_use = () => {
	const [content, setContent] = createSignal("");

	const md = fetch(browser.runtime.getURL("how_to_use.md")).then((response) =>
		response.text(),
	);

	md.then((text) => {
		parseMarkdown(text).then((html) => {
			setContent(html);
		});
	});

	return (
		<>
			<Suspense fallback={<div>Loading...</div>}>
				<div class="znc" innerHTML={content()} />
			</Suspense>
		</>
	);
};

const root = document.createElement("div");
root.id = "use";
document.body.appendChild(root);

render(how_to_use, root);
