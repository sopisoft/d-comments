import { getConfig } from '@/config/storage';
import { addon_disable_new_window } from './disable_new_window';
import { add_button_to_play } from './work_page';

export default defineContentScript({
  async main() {
    const path = window.location.pathname;
    if (path.includes('/animestore/ci_pc')) {
      if (await getConfig('enable_addon_add_button_to_play')) await add_button_to_play();
      if (await getConfig('enable_addon_disable_new_window')) await addon_disable_new_window();
    }
  },
  matches: ['https://animestore.docomo.ne.jp/animestore/*'],
});
