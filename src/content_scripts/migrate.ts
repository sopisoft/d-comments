import { getConfig, setConfig } from "./config";

export const migrate = () => {
	getConfig("way_to_render_comments", (way) => {
		if (!way) {
			getConfig("flow_comments", (val) => {
				if (val) {
					setConfig("way_to_render_comments", "right_to_left");
				} else if (val === false) {
					setConfig("way_to_render_comments", "list");
				}
			});
		}
	});
};
