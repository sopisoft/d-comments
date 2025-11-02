import { getConfig } from "@/config/";
import { addon_disable_new_window } from "./disable_new_window";
import { addon_smooth_player } from "./smooth_player";
import { add_button_to_play } from "./work_page";

export default defineContentScript({
  matches: ["https://animestore.docomo.ne.jp/animestore/*"],
  async main() {
    const path = window.location.pathname;
    if (path.includes("/animestore/ci_pc")) {
      if (await getConfig("enable_addon_add_button_to_play")) {
        await add_button_to_play();
      }
      if (await getConfig("enable_addon_disable_new_window")) {
        await addon_disable_new_window();
      }
    } else if (path.includes("/animestore/sc_d_pc")) {
      if (await getConfig("enable_addon_smooth_player")) {
        await addon_smooth_player();
      }
    }
  },
});
