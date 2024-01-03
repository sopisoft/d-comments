#!/bin/bash -eu

browsers=("chrome" "firefox")

if [ -d dist ]; then
  rm -r dist
fi

if [ -d web-ext-artifacts ]; then
  rm -r web-ext-artifacts
fi

chmod +x ./scripts/*.sh
./scripts/format.sh
./scripts/lint.sh

bunx --bun tsc

export NODE_ENV=production
bun --bun run ./scripts/build.ts
