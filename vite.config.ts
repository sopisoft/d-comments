import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { crx, defineManifest } from "@crxjs/vite-plugin";

const manifest = defineManifest({
	manifest_version: 3,
	name: "__MSG_name__",
	description: "__MSG_description__",
	default_locale: "ja",
	version: process.env.npm_package_version,
	author: "牛蒡",
	icons: {
		"16": "assets/icons/16.png",
		"32": "assets/icons/32.png",
		"48": "assets/icons/48.png",
		"128": "assets/icons/128.png",
		"256": "assets/icons/256.png",
	},
	action: {
		default_popup: "src/popup/popup.html",
	},
	options_page: "options.html",
	content_scripts: [
		{
			js: ["src/content_scripts/index.ts"],
			matches: ["https://animestore.docomo.ne.jp/*"],
			run_at: "document_start",
			all_frames: true,
		},
	],
	background: {
		service_worker: "src/background.ts",
		type: "module",
	},
	permissions: ["storage", "tabs"],
	web_accessible_resources: [
		{
			resources: ["assets/fonts/BIZ_UDPGothic.ttf"],
			matches: ["https://animestore.docomo.ne.jp/*"],
		},
		{
			resources: ["assets/fonts/BIZ_UDPGothic-Bold.ttf"],
			matches: ["https://animestore.docomo.ne.jp/*"],
		},
	],
	host_permissions: [
		"http://animestore.docomo.ne.jp/*",
		"https://www.nicovideo.jp/*",
		"https://nvcomment.nicovideo.jp/*",
		"https://nvapi.nicovideo.jp/v1/users/*",
		"https://public.api.nicovideo.jp/v1/channel/channelapp/channels/*",
		"https://api.search.nicovideo.jp/*",
	],
});

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [solidPlugin(), crx({ manifest })],
	build: {
		rollupOptions: {
			input: {
				use: "./use.html",
			},
			output: {
				entryFileNames: "js/[hash].js",
				chunkFileNames: "js/[hash].js",
				assetFileNames: "assets/[hash].[ext]",
			},
		},
	},
});
