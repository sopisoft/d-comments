/*
    This file is part of d-comments.

    d-comments is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    d-comments is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with d-comments.  If not, see <https://www.gnu.org/licenses/>.
*/

import browser, { type Tabs } from "webextension-polyfill";

/**
 * 作品視聴ページか判定
 * @returns boolean
 */
export const isWatchPage = async (location?: Tabs.Tab["url"] | URL) => {
  const tabs = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });
  const url = new URL(location ?? tabs[0]?.url ?? "");
  return (
    url.hostname === "animestore.docomo.ne.jp" &&
    url.pathname === "/animestore/sc_d_pc"
  );
};

export const isVideoId = (id: string) => {
  const videoId_prefix = [
    "sm",
    "nm",
    "so",
    "ca",
    "ax",
    "yo",
    "nl",
    "ig",
    "na",
    "cw",
    "z[a-e]",
    "om",
    "sk",
    "yk",
  ];
  const videoId_suffix = ["\\d{1,14}"];
  const videoId = new RegExp(
    `^(${videoId_prefix.join("|")})(${videoId_suffix.join("|")})$`
  );
  return videoId.test(id);
};

export function ErrorMessage(
  toast: (props: {
    title: string;
    description: string;
  }) => ReturnType<typeof import("@/components/ui/use-toast").toast>,
  props?: {
    error?: Error;
    message?: { title: string; description: string };
  }
) {
  const { error, message } = props ?? {};

  const t = toast({
    title: message?.title || error?.name || "エラー",
    description:
      message?.description ||
      error?.message ||
      "予期しないエラーが発生しました。",
  });

  return t;
}
