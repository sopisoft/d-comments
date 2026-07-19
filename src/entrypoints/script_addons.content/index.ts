import { getConfig } from '@/config/storage';
import { addon_disable_new_window } from './disable_new_window';
import { reload_on_history_navigation } from './history_navigation';
import { add_button_to_play } from './work_page';

export default defineContentScript({
  async main(ctx) {
    const path = window.location.pathname;
    if (path.includes('/animestore/ci_pc')) {
      if (await getConfig('enable_addon_add_button_to_play')) await add_button_to_play();
      if (await getConfig('enable_addon_disable_new_window')) await addon_disable_new_window();
    }
    if (path.includes('/animestore/sc_d_pc')) {
      reload_on_history_navigation(ctx);
    }
  },
  matches: ['https://animestore.docomo.ne.jp/animestore/*'],
});
