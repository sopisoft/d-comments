echo "Releasing..."

echo "Removing old dist..."
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force dist.zip -ErrorAction SilentlyContinue

echo "Building..."
npm run format
npm run lint
npm run rome
npm run build

Compress-Archive -Path dist -DestinationPath dist.zip

echo "Done."
