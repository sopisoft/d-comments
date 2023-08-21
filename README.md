# d-comments

![d-comments logo](./.store/d-comments.png)

[![GitHub release (latest by date)](https://img.shields.io/github/v/release/gobosan/d-comments)](
 https://github.com/gobosan/d-comments/releases/latest)
![GitHub Code Size in Bytes](https://img.shields.io/github/languages/code-size/gobosan/d-comments)
![GitHub Stars](https://img.shields.io/github/stars/gobosan/d-comments)
[![GitHub](https://img.shields.io/github/license/gobosan/d-comments)](./LICENSE.txt)

d アニメストアの動画再生画面でニコニコ動画のコメントを表示する Chromium 拡張機能です。

## Installation

[Chrome Web Store](https://chrome.google.com/webstore/detail/d-comments/jocjhkklfiaojhhnjiejmimlohaemiep)

## Development

### Requirements

- [Node.js](https://nodejs.org/ja/)
- Latest Firefox Based Browser
  - [Firefox](https://www.mozilla.org/ja/firefox/new/)
  - etc...
- Latest Chromium Based Browser
  - [Google Chrome](https://www.google.com/intl/ja_jp/chrome/)
  - [Microsoft Edge](https://www.microsoft.com/ja-jp/edge)
  - etc...
- [PowerShell](https://docs.microsoft.com/ja-jp/powershell/scripting/install/installing-powershell)
- [Visual Studio Code](https://code.visualstudio.com/)

Install local dependencies by running:

```sh
npm install
```

### How to build

Run the following command:

```sh
npm run release
```

If you have some errors, please try the following command with PowerShell in the project root directory:

```powershell
./scripts/release.ps1
```

This will create a zip file in the `dist` directory and `web-ext-artifacts` directory.

A zip file in the `dist` directory is for uploading to the Chrome Web Store.

A zip file in the `web-ext-artifacts` directory is for uploading to the Firefox Add-ons site.

### Linter

Run the following command:

```sh
npm run lint
```

## License

[Gnu General Public License v3.0](LICENSE.txt)
