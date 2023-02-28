# d-comments

d アニメストアの動画再生画面でニコニコ動画のコメントを表示する Chromium 拡張機能です。

[Chrome Web Store](https://chrome.google.com/webstore/detail/d-comments/jocjhkklfiaojhhnjiejmimlohaemiep)

## Requirements

- node.js ^18.13.0 ([Node.js](https://nodejs.org/ja/))
- Google Chrome (Latest) or Microsoft Edge (Latest)
- [PowerShell](https://docs.microsoft.com/ja-jp/powershell/scripting/install/installing-powershell)
- [Visual Studio Code](https://code.visualstudio.com/)

## Setup

```PowerShell
npm install
```

## Build

Command Palette (Ctrl+Shift+P) → `Tasks: build`

## Build in dev mode

Command Palette (Ctrl+Shift+P) → `Tasks: dev`

## Format

Command Palette (Ctrl+Shift+P) → `Tasks: format`

## Lint

Command Palette (Ctrl+Shift+P) → `Tasks: lint`

## Clean

```PowerShell
# Remove build directory
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
npm run zip
# or
Compress-Archive -Path dist -DestinationPath dist.zip -Force
```

## License

[Gnu General Public License v3.0](LICENSE.txt)
