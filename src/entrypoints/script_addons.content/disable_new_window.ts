import { getConfig } from "@/config/";
import { findElements } from "@/lib/dom";
import { logger } from "@/lib/logger";

export async function addon_disable_new_window() {
  logger.debug("addon_disable_new_window");

  const config = await getConfig("addon_option_play_in_same_tab");
  const items = await findElements<HTMLAnchorElement>("section.clearfix > a");

  for (const item of items) {
    const href = item.getAttribute("href");
    const partId = href?.replace(/[^0-9]/g, "");
    if (!href) continue;
    const openUrl = `https://animestore.docomo.ne.jp/animestore/sc_d_pc?partId=${partId}`;
    item.addEventListener("click", () => {
      window.open(openUrl, config ? "_self" : "_blank");
    });
    item.style.cursor = "pointer";
    item.removeAttribute("href");
  }
}
