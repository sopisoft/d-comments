# Mozilla のアドオン開発者センターに提出するソースコードの zip ファイルを作成する。

$src_dir = "src"
$build_scripts_dir = "scripts"
$files = @(
	".\.babelrc",
	"build.ts",
	"LICENSE.txt",
	"package-lock.json",
	"package.json",
	"README.md",
	"rome.json",
	"tsconfig.json",
	"vite.config.ts"
)

$source_code_temp_dir = "source_code"
if (Test-Path $source_code_temp_dir) {
	Remove-Item -Recurse -Force $source_code_temp_dir
}
New-Item -ItemType Directory -Force $source_code_temp_dir | Out-Null

Copy-Item -Recurse -Force $src_dir $source_code_temp_dir | Out-Null
Copy-Item -Recurse -Force $build_scripts_dir $source_code_temp_dir | Out-Null
foreach ($file in $files) {
	Copy-Item -Force $file $source_code_temp_dir | Out-Null
}
New-Item -ItemType Directory -Force "$source_code_temp_dir/.store" | Out-Null
Copy-Item -Force ".store/d-comments.png" "$source_code_temp_dir/.store" | Out-Null

$zip_file_name = "source_code.zip"
if (Test-Path $zip_file_name) {
	Remove-Item -Force $zip_file_name
}
Compress-Archive -Path $source_code_temp_dir -DestinationPath $zip_file_name | Out-Null

Remove-Item -Recurse -Force $source_code_temp_dir