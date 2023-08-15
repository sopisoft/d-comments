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
	./scripts/manifest_json.ps1 $browser
}

Write-Output "Zipping..."
Foreach ($browser in $browsers) {
	Compress-Archive -Path dist/$browser -DestinationPath dist/$browser.zip
}

If ($Error) {
	Foreach ($error in $Error) {
		Write-Output "Error: "$error
	}
	Exit 1
} else {
	Write-Output "`nDone!"
	Exit 0
}