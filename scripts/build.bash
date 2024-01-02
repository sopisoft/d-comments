#!/bin/bash -eu

echo "Removing old dist..."
if [ -d dist ]; then
  rm -rf dist
fi

chmod +x ./scripts/*.sh
./scripts/format.sh
./scripts/lint.sh
tsc --noEmit

npx tsx ./scripts/build.ts
# bun run ./scripts/build.ts

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