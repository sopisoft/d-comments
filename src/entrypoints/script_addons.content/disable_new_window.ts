import { getConfig } from "@/config";
import { find_elements } from "@/lib/dom";

export async function addon_disable_new_window() {
  console.log("addon_disable_new_window");

  const config = await getConfig("addon_option_play_in_same_tab");
  const items = await find_elements<HTMLAnchorElement>("section.clearfix > a");

  for (const item of items) {
    const href = item.getAttribute("href");
    const partID = href?.replace(/[^0-9]/g, "");
    if (!href) continue;
    const openUrl = `https://animestore.docomo.ne.jp/animestore/sc_d_pc?partId=${partID}`;
    item.addEventListener("click", () => {
      window.open(openUrl, config ? "_self" : "_blank");
    });
    item.style.cursor = "pointer";
    item.removeAttribute("href");
  }
}
