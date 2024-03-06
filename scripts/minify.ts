import fs from "fs";
import Bun from "bun";
import { minify } from "terser";

const option = {
  module: true,
  compress: {
    module: true,
    unused: true,
    passes: 3,
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
  console.log(`Minifying js for ${browser}`);
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
