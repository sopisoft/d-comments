# d-anime comments viewer

![d-comments logo](./.store/d-comments.png)

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/sopisoft/d-comments)](https://github.com/sopisoft/d-comments/releases/latest)
![GitHub Code Size in Bytes](https://img.shields.io/github/languages/code-size/sopisoft/d-comments)
![GitHub Stars](https://img.shields.io/github/stars/sopisoft/d-comments)
[![GitHub](https://img.shields.io/github/license/sopisoft/d-comments)](./LICENSE.txt)

d アニメストアの動画再生画面でニコニコ動画のコメントを表示するブラウザ拡張機能です。

## Installation

<!-- https://developer.chrome.com/docs/webstore/branding?hl=ja -->
<!-- https://extensionworkshop.com/documentation/publish/promoting-your-extension/ -->

[![Chrome WebStore](https://developer.chrome.com/static/docs/webstore/branding/image/UV4C4ybeBTsZt43U4xis.png)](https://chrome.google.com/webstore/detail/d-comments/jocjhkklfiaojhhnjiejmimlohaemiep)
[![Firefox Browser ADD-ONS](https://extensionworkshop.com/assets/img/documentation/publish/get-the-addon-178x60px.dad84b42.png)](https://addons.mozilla.org/ja/firefox/addon/d-comments/)

## Development

### Requirements

- [Node.js](https://nodejs.org/ja/)
- [pnpm](https://pnpm.io/)
- Latest Firefox Based Browser
  - [Firefox](https://www.mozilla.org/ja/firefox/new/)
  - etc...
- Latest Chromium Based Browser
  - [Google Chrome](https://www.google.com/intl/ja_jp/chrome/)
  - [Microsoft Edge](https://www.microsoft.com/ja-jp/edge)
  - etc...
- [Visual Studio Code](https://code.visualstudio.com/)

### Install dependencies

Install local dependencies by running:

```sh
pnpm install
```

### Build

Run the following command:

```sh
pnpm build
```

This will create a zip file in the `dist` directory.

`dist/chrome.zip` is for Chromium based browsers.

`dist/firefox.zip` is for Firefox based browsers.

### Lint

Run the following command:

```sh
pnpm lint
```

### Format

Run the following command:

```sh
pnpm format
```

## License

[Gnu General Public License v3.0](LICENSE.txt)
