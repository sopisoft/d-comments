import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import type { Plugin } from 'vite';

const compiler = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeStringify);

export const markdownHtmlPlugin = (): Plugin => ({
  name: 'd-comments-markdown-html',
  async transform(source, id) {
    if (!id.endsWith('.md?html')) return null;
    const html = String(await compiler.process(source));
    return {
      code: `export default ${JSON.stringify(html)};`,
      map: null,
    };
  },
});
