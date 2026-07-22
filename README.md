# d-anime comments viewer

![d-comments logo](./.store/assets/logo.png)

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

- [Nix](https://nixos.org/download/)
- Latest Firefox Based Browser
  - [Firefox](https://www.mozilla.org/ja/firefox/new/)
  - etc...
- Latest Chromium Based Browser
  - [Google Chrome](https://www.google.com/intl/ja_jp/chrome/)
  - [Microsoft Edge](https://www.microsoft.com/ja-jp/edge)
  - etc...

### Setup development environment

Run the following command:

```sh
nix develop
```

### Install dependencies

Install local dependencies by running:

```sh
pnpm install
```

### Build

Run the following command:

```sh
pnpm build:chrome
pnpm build:firefox
```

### Zip

Run the following command:

```sh
pnpm zip:chrome
pnpm zip:firefox
```

This will create a zip file in the `dist` directory.

### Type check

Run the following command:

```sh
pnpm compile
```

### Lint

Run the following command:

```sh
pnpm lint
```

### UI / E2E debugging

Storybook はブラウザ拡張のUI部品を、拡張APIや実サイトから切り離して確認するために使います。
現在はコメントカードの通常・選択中・ニコる非表示の状態を収録しています。

```sh
pnpm storybook
```

拡張機能は Playwright で Chrome にビルド済み拡張を読み込み、DOM・操作結果・コンソールエラーを検証します。

```sh
pnpm test:e2e
pnpm test:e2e:headed # headed Chromiumでデバッグするとき
pnpm test:e2e:debug # Playwright Inspectorで停止しながら調査するとき
```

テストレポートは `/tmp/d-comments-playwright-report` に出力されます。E2E実行前に `pnpm exec playwright install chromium` を一度実行してください。

dアニメストアの実サイトを検証する場合は、専用のChromiumプロファイルを指定してheadedモードで起動し、ブラウザ上で手動ログインした状態を使ってください。

```sh
pnpm auth:chrome
pnpm test:e2e:headed
```

認証済みプロファイルはデフォルトで`~/.local/state/d-comments/chrome-profile`に保存されます。通常の拡張ページのスモークテストは、認証なしの一時プロファイルで実行されます。

認証済みの実サイトでcontent scriptまで検証する場合は、対象の視聴ページURLを指定して実行します。2段階認証を含むログインは、先に`pnpm auth:chrome`で手動完了してください。

```sh
node scripts/e2e.ts \
  --danime-url "https://animestore.docomo.ne.jp/animestore/sc_d_pc?partId=YOUR_PART_ID"
```

`--danime-url`を指定すると、認証済みプロファイルの利用とdアニメストア統合テストが自動的に有効になります。プロファイルを変更する場合は`--profile-dir PATH`、画面を表示する場合は`--headed`を追加してください。Playwright Inspectorで調査する場合は`--debug`を使います。

この統合テストは、dアニメストアの動画要素、拡張が追加する`#d-comments-wrapper`／`#d-comments-side`、Popupのロードを確認します。対象作品やサイト側の状態に依存するため、URLは実際に視聴できるページを指定してください。

`pnpm auth:chrome` は専用のChromeプロファイルを開き、dアニメストアのログインと2段階認証を手動で完了するための補助コマンドです。認証情報は入力・保存せず、Cookieなどのセッション情報だけをOSのユーザーディレクトリ（`~/.local/state/d-comments/chrome-profile`、権限700）へ保存します。通常利用中のChromeと同じプロファイルを同時に開かないでください。

### Format

Run the following command:

```sh
pnpm format
```

## License

[Gnu General Public License v3.0](LICENSE.txt)
