import { getConfig } from "@/config/";
import { findElements } from "@/lib/dom";
import { logger } from "@/lib/logger";

/**
 * 作品ページの各パートに新しいタブで開くボタンを追加する
 */
export const add_button_to_play = async () => {
  logger.debug("addon_addMenu");
  const playInSameTab = await getConfig("addon_option_play_in_same_tab");

  const aArray = await findElements("section.clearfix > a");
  for (const item of aArray) {
    const partId = item?.getAttribute("href")?.replace(/[^0-9]/g, "");
    if (!partId) continue;

    const bgColor = window.getComputedStyle(item).backgroundColor;
    const a = document.createElement("a");
    a.href = `sc_d_pc?partId=${partId}`;

    Object.assign(a.style, {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      height: "5rem",
      padding: "1.4rem 1.8rem",
      borderTop: "1px solid rgb(224 224 224)",
      backgroundColor: bgColor,
    });

    const section = item.parentElement;
    const target = section?.parentElement;
    const aExist = target?.querySelector(`a[href="sc_d_pc?partId=${partId}"]`);

    if (section && target && !aExist) {
      target?.appendChild(a);
    }

    a.textContent = playInSameTab ? "現在のタブで開く" : "新しいタブで開く";
    a.target = playInSameTab ? "_self" : "_blank";
    a.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (playInSameTab) {
        window.location.href = a.href;
      } else {
        window.open(a.href);
      }
    });
  }
};
