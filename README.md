# d-comments

![d-comments logo](./.store/d-comments.png)

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/gobosan/d-comments)](https://github.com/gobosan/d-comments/releases/latest)
![GitHub Code Size in Bytes](https://img.shields.io/github/languages/code-size/gobosan/d-comments)
![GitHub Stars](https://img.shields.io/github/stars/gobosan/d-comments)
[![GitHub](https://img.shields.io/github/license/gobosan/d-comments)](./LICENSE.txt)

d アニメストアの動画再生画面でニコニコ動画のコメントを表示する Chromium 拡張機能です。

## Installation

[Chrome Web Store](https://chrome.google.com/webstore/detail/d-comments/jocjhkklfiaojhhnjiejmimlohaemiep)

[Firefox Browser Add-ons](https://addons.mozilla.org/ja/firefox/addon/d-comments/)

## Development

### Requirements

- [Node.js](https://nodejs.org/ja/)
- [bun](https://bun.sh)
- Latest Firefox Based Browser
  - [Firefox](https://www.mozilla.org/ja/firefox/new/)
  - etc...
- Latest Chromium Based Browser
  - [Google Chrome](https://www.google.com/intl/ja_jp/chrome/)
  - [Microsoft Edge](https://www.microsoft.com/ja-jp/edge)
  - etc...
- [Visual Studio Code](https://code.visualstudio.com/)

### How to setup

Install local dependencies by running:

```sh
bun install
```

### How to build

Run the following command:

```sh
bun run build
```

This will create a zip file in the `dist` directory.

`dist/chrome.zip` is for Chromium based browsers.

`dist/firefox.zip` is for Firefox based browsers.

### Linter

Run the following command:

```sh
bun run lint
```

### Formatter

Run the following command:

```sh
bun run format
```

### Make source code zip

Run the following command:

```sh
bun run zipsrc
```

## Troubleshooting

If the build fails, try removing `node_modules` and reinstalling the dependencies.

```sh
rm -r node_modules && bun install
```

## License

[Gnu General Public License v3.0](LICENSE.txt)
