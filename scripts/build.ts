import { cp, rmdir, writeFile } from "node:fs/promises";
import { build } from "vite";
// @ts-expect-error
import webExt from "web-ext";
import { manifest } from "./manifest";

const browsers = ["chrome", "firefox"] as const;
process.env.NODE_ENV = "production";

try {
  await rmdir("dist", { recursive: true });

  await build({
    build: {
      outDir: `../dist/${"chrome"}`,
    },
  });

  await cp("dist/chrome", "dist/firefox", { recursive: true });

  for (const browser of browsers) {
    const m = await manifest(browser);
    const dist = `dist/${browser}`;

    await writeFile(`${dist}/manifest.json`, JSON.stringify(m));
    await cp("LICENSE.txt", `${dist}/LICENSE.txt`, { force: true });
    webExt.cmd.build({
      sourceDir: dist,
      artifactsDir: "dist",
      asNeeded: false,
      overwriteDest: true,
      ignoreFiles: [],
      filename: `${browser}.zip`,
    });
  }
} catch (error) {
  console.error(error);
  process.exit(1);
}
