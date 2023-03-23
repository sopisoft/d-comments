# d-comments

d アニメストアの動画再生画面でニコニコ動画のコメントを表示する Chromium 拡張機能です。

[Chrome Web Store](https://chrome.google.com/webstore/detail/d-comments/jocjhkklfiaojhhnjiejmimlohaemiep)

## Requirements

- node.js ^18.15.0 ([Node.js](https://nodejs.org/ja/))
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

## Build in dev mode

```PowerShell
npm run dev
```

## Format

```PowerShell
npm run format
```

## Lint

```PowerShell
npm run lint
```

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
