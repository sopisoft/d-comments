# d-comments

d アニメストアの動画再生画面でニコニコ動画のコメントを表示する Chromium 拡張機能です。

[Chrome Web Store](https://chrome.google.com/webstore/detail/d-comments/jocjhkklfiaojhhnjiejmimlohaemiep)

[Microsoft Edge Addon](https://microsoftedge.microsoft.com/addons/detail/dcomments/megnnllcbcmllggmljcgbadfblpodanp)

## Requirements

- node.js ^16.17.0 ([Node.js](https://nodejs.org/ja/))
- Google Chrome (Latest) or Microsoft Edge (Latest)
- [PowerShell](https://docs.microsoft.com/ja-jp/powershell/scripting/install/installing-powershell)
- [Visual Studio Code](https://code.visualstudio.com/)

## Setup

```PowerShell
npm install
```

## Build

```PowerShell
npm run build
```

## Build in watch mode

```PowerShell
npm run watch
```

## Format

```PowerShell
npm run prettier
```

## Clean

```PowerShell
# Remove build directory
npm run clean:build
# or
Remove-Item -Recurse -Force dist

# Remove zipped build file
npm run clean:zip
# or
Remove-Item -Recurse -Force dist.zip

# Remove node_modules directory
Remove-Item -Recurse -Force node_modules
```

## Zip

```PowerShell
Compress-Archive -Path dist -DestinationPath dist.zip -Force
```
