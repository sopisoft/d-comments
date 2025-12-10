const fontTemplates = {
  arial: {
    font: 'Arial, "ＭＳ Ｐゴシック", "MS PGothic", MSPGothic, MS-PGothic',
    offset: 0.01,
    weight: 600,
  },
  gothic: {
    font: '"游ゴシック体", "游ゴシック", "Yu Gothic", YuGothic, yugothic, YuGo-Medium',
    offset: -0.04,
    weight: 400,
  },
  gulim: {
    font: 'Gulim, "黒体", SimHei',
    offset: 0.03,
    weight: 400,
  },
  mincho: {
    font: '"游明朝体", "游明朝", "Yu Mincho", YuMincho, yumincho, YuMin-Medium',
    offset: -0.01,
    weight: 400,
  },
  simsun: {
    font: '"宋体", SimSun',
    offset: 0.135,
    weight: 400,
  },
  macGothicPro6: {
    font: '"ヒラギノ角ゴ ProN W6", HiraKakuProN-W6, "ヒラギノ角ゴ ProN", HiraKakuProN, "Hiragino Kaku Gothic ProN"',
    offset: -0.05,
    weight: 600,
  },
  macGothicPro3: {
    font: '"ヒラギノ角ゴ ProN W3", HiraKakuProN-W3, "ヒラギノ角ゴ ProN", HiraKakuProN, "Hiragino Kaku Gothic ProN"',
    offset: -0.04,
    weight: 300,
  },
  macMincho: {
    font: '"ヒラギノ明朝 ProN W3", HiraMinProN-W3, "ヒラギノ明朝 ProN", HiraMinProN, "Hiragino Mincho ProN"',
    offset: -0.02,
    weight: 300,
  },
  macGothic1: {
    font: '"ヒラギノ角ゴシック", "Hiragino Sans", HiraginoSans',
    offset: -0.05,
    weight: 600,
  },
  macGothic2: {
    font: '"ヒラギノ角ゴシック", "Hiragino Sans", HiraginoSans',
    offset: -0.04,
    weight: 300,
  },
  sansSerif600: {
    font: "sans-serif",
    offset: 0,
    weight: 600,
  },
  sansSerif400: {
    font: "sans-serif",
    offset: 0,
    weight: 400,
  },
  serif: {
    font: "serif",
    offset: 0,
    weight: 400,
  },
} as const;

const build = (templates: ReadonlyArray<{ font: string; offset: number; weight: number }>) =>
  templates.reduce(
    (acc, template, index) => {
      if (index === 0) {
        acc.font = template.font;
        acc.offset = template.offset;
        acc.weight = template.weight;
        return acc;
      }
      acc.font += `, ${template.font}`;
      return acc;
    },
    { font: "", offset: 0, weight: 600 }
  );

const fontSets = {
  win7: {
    defont: build([fontTemplates.arial]),
    gothic: build([fontTemplates.gothic, fontTemplates.gulim, fontTemplates.arial]),
    mincho: build([fontTemplates.mincho, fontTemplates.simsun, fontTemplates.arial]),
  },
  win8_1: {
    defont: build([fontTemplates.arial]),
    gothic: build([fontTemplates.gothic, fontTemplates.simsun, fontTemplates.arial]),
    mincho: build([fontTemplates.mincho, fontTemplates.simsun, fontTemplates.arial]),
  },
  win: {
    defont: build([fontTemplates.arial]),
    gothic: build([fontTemplates.gulim, fontTemplates.arial]),
    mincho: build([fontTemplates.simsun, fontTemplates.arial]),
  },
  mac10_9: {
    defont: build([fontTemplates.macGothicPro6]),
    gothic: build([fontTemplates.gothic, fontTemplates.macGothicPro3]),
    mincho: build([fontTemplates.mincho, fontTemplates.macMincho, fontTemplates.macGothicPro3]),
  },
  mac10_11: {
    defont: build([fontTemplates.macGothic1]),
    gothic: build([fontTemplates.gothic, fontTemplates.macGothic2]),
    mincho: build([fontTemplates.mincho, fontTemplates.macMincho, fontTemplates.macGothic2]),
  },
  mac: {
    defont: build([fontTemplates.macGothicPro6]),
    gothic: build([fontTemplates.macGothicPro3]),
    mincho: build([fontTemplates.macMincho]),
  },
  other: {
    defont: build([fontTemplates.sansSerif600]),
    gothic: build([fontTemplates.sansSerif400]),
    mincho: build([fontTemplates.serif]),
  },
} as const;

export type StandardFontName = "defont" | "gothic" | "mincho";

export type FontAttributes = {
  key: StandardFontName;
  family: string;
  weight: number;
  offset: number;
};

const detectPlatform = (): keyof typeof fontSets => {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  if (/windows nt 6\.[12]/i.test(ua)) return "win7";
  if (/windows nt (6\.3|10\.\d+)|win32/i.test(ua)) return "win8_1";
  if (/mac os x 10_[89]/i.test(ua)) return "mac10_9";
  if (/mac os x 10_1[01]/i.test(ua)) return "mac10_11";
  if (/mac os x/i.test(ua)) return "mac";
  if (/windows/i.test(ua)) return "win";
  return "other";
};

let cachedFonts: Record<StandardFontName, FontAttributes> | undefined;

export const getFontDefinitions = (): Record<StandardFontName, FontAttributes> => {
  if (cachedFonts) return cachedFonts;
  const platform = detectPlatform();
  const selected = fontSets[platform] ?? fontSets.other;
  cachedFonts = {
    defont: {
      key: "defont",
      family: selected.defont.font,
      weight: selected.defont.weight,
      offset: selected.defont.offset,
    },
    gothic: {
      key: "gothic",
      family: selected.gothic.font,
      weight: selected.gothic.weight,
      offset: selected.gothic.offset,
    },
    mincho: {
      key: "mincho",
      family: selected.mincho.font,
      weight: selected.mincho.weight,
      offset: selected.mincho.offset,
    },
  };
  return cachedFonts;
};
