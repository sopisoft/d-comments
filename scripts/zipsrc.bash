# Mozilla のアドオン開発者センターに提出するソースコードの zip ファイルを作成する。

src_dir=src
build_scripts_dir=scripts
other_files=(".babelrc" ".eslintrc.json" "build.ts" "bun.lockb" "LICENSE.txt" "package.json" "README.md" "tsconfig.json" "vite.config.ts")

temp_dir=temp
if [ -d ${temp_dir} ]; then
	rm -rf ${temp_dir}
fi
mkdir ${temp_dir}

cp -r ${src_dir} ${temp_dir}
cp -r ${build_scripts_dir} ${temp_dir}
for file in "${other_files[@]}"; do
	cp ${file} ${temp_dir}
done
mkdir ${temp_dir}/.store
cp .store/d-comments.png ${temp_dir}/.store

zip_file_name=source_code.zip
if [ -f ${zip_file_name} ]; then
	rm ${zip_file_name}
fi
zip -r ${zip_file_name} ${temp_dir}
rm -r ${temp_dir}

echo "Done."

