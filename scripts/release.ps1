$Error.Clear()

Write-Output "Releasing..."

Write-Output "Removing old dist..."
IF (Test-Path dist) {
	Remove-Item dist -Recurse
}

Write-Output "Linting..."
npx rome format ./src --write
npx rome check ./src --apply-unsafe
npx rome ci ./src

Write-Output "Building..."
npx tsx ./build.ts

$browsers = @("chrome", "firefox")
ForEach ($browser in $browsers) {
	Get-ChildItem -Path dist/$browser/src -Recurse -Include *.html | Move-Item -Destination dist/$browser -Force
	Remove-Item -Path dist/$browser/src -Recurse -Force
	./scripts/manifest_json $browser
}

Write-Output "Zipping for Chrome..."
#Foreach ($browser in $browsers) {
	$browser = "chrome"
	$file = Get-ChildItem -Path dist/$browser -Recurse
	Compress-Archive -Path $file -DestinationPath dist/$browser.zip
#}

Write-Output "Zipping for Firefox..."
IF (Test-Path web-ext-artifacts) {
	Remove-Item -Path web-ext-artifacts -Recurse
}
npx web-ext build --source-dir dist/firefox --overwrite-dest
Copy-Item -Path web-ext-artifacts/*.zip -Destination dist/firefox.zip -Force

If ($Error) {
	Foreach ($error in $Error) {
		Write-Output "Error: "$error
	}
	Exit 1
} else {
	Write-Output "`nDone!"
	Get-ChildItem -Path dist -Recurse -Include *.zip -Depth 1 | Format-Table -Property Name, Length -AutoSize
	Exit 0
}