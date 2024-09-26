/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="esnext" />
/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="vite/client" />

declare module "*.md" {
  const attributes: Record<string, unknown>;
  const toc: { level: string; content: string }[];
  const html: string;
  const raw: string;
  export { attributes, toc, html };
}
