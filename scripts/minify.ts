import fs from "fs";
import Bun from "bun";
import { minify } from "terser";

const option = {
  module: true,
  compress: {
    drop_console: true,
    drop_debugger: true,
    module: true,
    unused: true,
  },
  mangle: {
    toplevel: true,
    module: true,
  },
  format: {
    comments: false,
  },
  toplevel: true,
};

export async function minifyJs(browser: browsers[number]) {
  const files = fs.readdirSync(`dist/${browser}/js`);
  Promise.all(
    files.map(async (file) => {
      const f = Bun.file(`dist/${browser}/js/${file}`);
      const code = await f.text();
      const result = await minify(code, option);
      result.code && Bun.write(f, result.code);
    })
  );
}
