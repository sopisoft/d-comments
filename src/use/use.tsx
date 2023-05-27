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

import md from "./use.md?raw";
import "./use.scss";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkToc from "remark-toc";
import { Suspense, createSignal, onMount } from "solid-js";
import { unified } from "unified";
import "zenn-content-css";

const parseMarkdown = async (text: string): Promise<string> => {
	const file = await unified()
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
		.process(text);
	return String(file);
};
const Use = () => {
	const [content, setContent] = createSignal("");
	parseMarkdown(md).then((html) => {
		setContent(html);
	});

	return (
		<>
			<Suspense fallback={<div>Loading...</div>}>
				<div class="znc" innerHTML={content()} />
			</Suspense>
		</>
	);
};

export default Use;
