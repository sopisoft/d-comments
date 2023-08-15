import { resolve } from "path";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

// https://ja.vitejs.dev/config/
export default defineConfig({
	// [Root](https://ja.vitejs.dev/config/shared-options.html#root) を src にすると何故か HMR が効かない
	publicDir: "src/raw",
	plugins: [solidPlugin()],
	build: {
		target: "esnext",
		minify: "terser",
		rollupOptions: {
			input: {
				index: resolve(__dirname, "src", "content_scripts", "index.ts"),
				background: resolve(__dirname, "src", "background.ts"),

				popup: resolve(__dirname, "src", "popup", "popup.html"),
				options: resolve(__dirname, "src", "options", "options.html"),
				how_to_use: resolve(__dirname, "src", "how_to_use", "how_to_use.html"),
			},
			output: {
				entryFileNames: "js/[name].js",
				chunkFileNames: "js/[name].js",
				assetFileNames: "assets/[ext]/[name].[ext]",
			},
		},
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
				module: true,
				unused: true,
				passes: 5,
			},
			mangle: {
				toplevel: true,
				module: true,
			},
			format: {
				comments: false,
			},
			toplevel: true,
		},
	},
});
