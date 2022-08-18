# d-comments

dアニメストアの動画再生画面でニコニコ動画のコメントを表示する Chromium 拡張機能です。

[Chrome Web Store](https://chrome.google.com/webstore/detail/d-comments/jocjhkklfiaojhhnjiejmimlohaemiep)

[Microsoft Edge Addon](https://microsoftedge.microsoft.com/addons/detail/dcomments/megnnllcbcmllggmljcgbadfblpodanp)

## Requirements

- node.js ^16.17.0 (<https://nodejs.org/ja/>)
- Google Chrome (Latest) or Microsoft Edge (Latest)

## Option

- [Visual Studio Code](https://code.visualstudio.com/) (Recommended)

## Setup

```bash
npm install
```

## Build

```bash
npm run build
```

## Build in watch mode

```bash
npm run watch
```

## Format

```bash
npm run prettier
```

## Zip

[PowerShell](https://docs.microsoft.com/ja-jp/powershell/scripting/install/installing-powershell) (Required)

```PowerShell
Compress-Archive -Path dist -DestinationPath dist.zip -Force
```
