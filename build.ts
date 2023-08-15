import { build } from "vite";

Promise.all(
	["chrome", "firefox"].map((browser) =>
		build({
			mode: browser,
			build: {
				outDir: `dist/${browser}`,
			},
		}),
	),
);
