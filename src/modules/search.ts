import type { SnapShotQuery } from "@/entrypoints/background/search";

/**
 *タイトルを検索用に整える
 *danime-save-annict-2
 *https://github.com/TomoTom0/danime-save-annict-2/blob/105851c64900b4994eb095f0f1bd83e755cb5f1d/src/scripts/index.js#L447-L463
 */
export function sanitizeTitle(title: string) {
  const deleteArray = [
    "(?!^)([\\[《（(【＜〈～-].+[-～〉＞】)）》\\]])$",
    "第?\\d{1,2}期$",
    "^映画",
    "^劇場版",
    "(TV|テレビ|劇場)(アニメーション|アニメ)",
    "^アニメ",
    "Ⅰ",
    "Ⅱ",
    "II",
    "Ⅲ",
    "III",
    "Ⅳ",
    "IV",
    "Ⅴ",
    "Ⅵ",
    "Ⅶ",
    "VII",
    "Ⅷ",
    "VIII",
    "Ⅸ",
    "IX",
    "Ⅹ",
  ];
  const remakeWords = { "\u3000": " ", "\u00A0": " ", "!": "！" };

  const titleRegex = /^(TV|テレビ|劇場|オリジナル)?\s?(アニメーション|アニメ)\s?[｢「『]/;
  const match = title.match(titleRegex);
  let trimmedTitle = title;
  if (match && match.index !== undefined) {
    const index = match.index + match[0].length;
    trimmedTitle = trimmedTitle.substring(index).replace(/[」｣』]/, " ");
  }

  return trimmedTitle
    .replace(
      /[Ａ-Ｚａ-ｚ０-９：＆]/g,
      (s) => String.fromCharCode(s.charCodeAt(0) - 65248) // 全角を半角に
    )
    .replace(new RegExp(deleteArray.join("|"), "g"), "")
    .replace(
      new RegExp(Object.keys(remakeWords).join("|"), "g"),
      (match) => remakeWords[match as keyof typeof remakeWords]
    )
    .trim();
}

/**
 * Build search query from work title
 */
export function buildSearchQuery(word: string, sort: SnapShotQuery["_sort"] = "-commentCounter"): SnapShotQuery {
  const q = sanitizeTitle(word);
  return {
    q,
    fields: [
      "contentId",
      "title",
      "description",
      "tags",
      "genre",
      "categoryTags",
      "commentCounter",
      "viewCounter",
      "startTime",
      "lengthSeconds",
      "channelId",
      "userId",
      "thumbnailUrl",
    ],
    _sort: sort,
    targets: ["title", "description"],
    _limit: 50,
  };
}
