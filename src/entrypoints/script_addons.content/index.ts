import { getConfigs } from "@/config/storage";
import { addon_disable_new_window } from "./disable_new_window";
import { addon_smooth_player } from "./smooth_player";
import { add_button_to_play } from "./work_page";

export default defineContentScript({
  matches: ["https://animestore.docomo.ne.jp/animestore/*"],
  async main() {
    const path = window.location.pathname;
    if (path.includes("/animestore/ci_pc")) {
      const { enable_addon_add_button_to_play: addButton, enable_addon_disable_new_window: disableNewWindow } =
        await getConfigs(["enable_addon_add_button_to_play", "enable_addon_disable_new_window"]);
      if (addButton) {
        await add_button_to_play();
      }
      if (disableNewWindow) {
        await addon_disable_new_window();
      }
    } else if (path.includes("/animestore/sc_d_pc")) {
      const { enable_addon_smooth_player: smoothPlayer } = await getConfigs(["enable_addon_smooth_player"]);
      if (smoothPlayer) {
        await addon_smooth_player();
      }
    }
  },
});
