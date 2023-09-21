#!/bin/bash -eu

echo "Removing old dist..."
if [ -d dist ]; then
  rm -rf dist
fi

bunx prettier --check ./src
bunx eslint --fix ./src

npx tsx ./build.ts
# bun run ./build.ts

if [ -d web-ext-artifacts ]; then
  rm -rf web-ext-artifacts
fi

browsers=("chrome" "firefox")
for browser in "${browsers[@]}"; do
  find dist/${browser}/src -name '*.html' | xargs mv -t dist/${browser}
  rm -rf dist/${browser}/src
  bunx web-ext build --source-dir ./dist/${browser}/ --overwrite-dest
  mv web-ext-artifacts/*.zip dist/${browser}.zip
  rm -rf web-ext-artifacts
done

echo "Done!"