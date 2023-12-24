# Mozilla のアドオン開発者センターに提出するソースコードの zip ファイルを作成する。


temp_dir=temp
if [ -d ${temp_dir} ]; then
	rm -rf ${temp_dir}
fi
mkdir ${temp_dir}

cp -r src ${temp_dir}
cp -r scripts ${temp_dir}

others=(".babelrc" "bun.lockb" "LICENSE.txt" "package.json" "README.md" "tsconfig.json" "vite.config.ts")
for file in "${others[@]}"; do
	cp ${file} ${temp_dir}
done

mkdir ${temp_dir}/.store
cp .store/d-comments.png ${temp_dir}/.store

zip -r source_code.zip ${temp_dir}
rm -r ${temp_dir}
