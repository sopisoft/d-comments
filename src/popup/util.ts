import browser, { Tabs } from "webextension-polyfill";

/**
 * 作品視聴ページか判定
 * @returns boolean
 */
export const isWatchPage = async (location?: Tabs.Tab["url"]) => {
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  const url = new URL(location ?? tabs[0]?.url ?? "");
  return url.pathname === "/animestore/sc_d_pc";
};

export function ErrorMessage(
  toast: (props: { title: string; description: string }) => void,
  props?: {
    error?: Error;
    message?: { title: string; description: string };
  }
) {
  const { error, message } = props ?? {};

  toast({
    title: message?.title || error?.name || "エラー",
    description:
      message?.description ||
      error?.message ||
      "予期しないエラーが発生しました。",
  });
}
