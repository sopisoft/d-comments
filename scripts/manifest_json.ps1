Param($browser)

$exclude_js_files = @(
	"popup.js",
	"options.js",
	"how_to_use.js",
	"background.js"
)

$js_files = Get-ChildItem -Path "dist/$browser/js" -Recurse -Exclude $exclude_js_files

$node_package_version = Get-Content -Path "package.json" | ConvertFrom-Json | Select-Object -ExpandProperty version

$web_accessible_resources = @(
	@{
		matches = @(
			"*://animestore.docomo.ne.jp/*"
		)
		resources = @(
			$js_files | ForEach-Object { "js/$($_.Name)"}
		)
	}
)

$background_chrome = @{
	service_worker = "js/background.js";
	type = "module"
}

$background_firefox = @{
	scripts = @(
		"background.js"
	);
}

$firefox_specific_settings = @{
	"gecko" = @{
		"id" = "{7817f7db-9b81-4857-8e67-d5c32aa6b52e}"
	}
}


$manifest_common = Get-Content -Path "src/manifest_base.json" | ConvertFrom-Json
$manifest_common.version = $node_package_version
$manifest_common.web_accessible_resources = $web_accessible_resources
$manifest_common.background = IF ($browser -eq "chrome") { $background_chrome } ELSE { $background_firefox }
IF ($browser -eq "firefox") {
	$manifest_common = $manifest_common | Add-Member -MemberType NoteProperty -Name "browser_specific_settings" -Value $firefox_specific_settings -PassThru
}

$manifest = $manifest_common[0] | ConvertTo-Json -Depth 100

$manifest | Out-File -FilePath "dist/$browser/manifest.json" -Encoding UTF8 -Force