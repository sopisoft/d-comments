Param($browser)

$exclude_js_files = @(
	"popup.js",
	"options.js",
	"how_to_use.js",
	"background.js"
)

$js_files = Get-ChildItem -Path "dist/$browser/js" -Recurse -Exclude $exclude_js_files

$web_accessible_resources = @(
	@{
		matches = @(
			"*://animestore.docomo.ne.jp/*"
		)
		resources = @(
			$js_files | ForEach-Object { "js/$($_.Name)"}
		)
	}
	@{
		matches = @(
			"*://animestore.docomo.ne.jp/*"
		)
		resources = @(
			"fonts/BIZ_UDPGothic.ttf",
			"fonts/BIZ_UDPGothic-Bold.ttf"
		)
	}
)

$background_chrome = @{
	service_worker = "background.js";
	type = "module"
}

$background_firefox = @{
	scripts = @(
		"background.js"
	);
}

$manifest_common = Get-Content -Path "src/manifest_base.json" | ConvertFrom-Json
$manifest_common.web_accessible_resources = $web_accessible_resources
$manifest_common.background = IF ($browser -eq "chrome") { $background_chrome } ELSE { $background_firefox }

$manifest = $manifest_common[0] | ConvertTo-Json -Depth 100

$manifest | Out-File -FilePath "dist/$browser/manifest.json" -Encoding UTF8 -Force