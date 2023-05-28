import { getConfig, setConfig } from "./config";

export const migrate = () => {
	chrome.storage.local.get(["way_to_render_comments"], (way) => {
		if (!way["way_to_render_comments"]) {
			chrome.storage.local.get(["flow_comments"], (result) => {
				if (result["flow_comments"]) {
					setConfig("way_to_render_comments", "right_to_left");
				} else if (result["flow_comments"] === false) {
					setConfig("way_to_render_comments", "list");
				}
			});
		}
	});
};
