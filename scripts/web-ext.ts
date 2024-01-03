// @ts-ignore
import webExt from "web-ext";

export async function webExtBuild(browser: browsers[number]) {
  const sourceDir = `dist/${browser}/`;
  webExt.cmd.build({
    sourceDir: sourceDir,
    artifactsDir: "dist",
    asNeeded: false,
    overwriteDest: true,
    ignoreFiles: [],
    filename: `${browser}.zip`,
  });
}
