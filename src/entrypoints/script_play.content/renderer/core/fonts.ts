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
  macGothicPro3: {
    font: '"ヒラギノ角ゴ ProN W3", HiraKakuProN-W3, "ヒラギノ角ゴ ProN", HiraKakuProN, "Hiragino Kaku Gothic ProN"',
    offset: -0.04,
    weight: 300,
  },
  macGothicPro6: {
    font: '"ヒラギノ角ゴ ProN W6", HiraKakuProN-W6, "ヒラギノ角ゴ ProN", HiraKakuProN, "Hiragino Kaku Gothic ProN"',
    offset: -0.05,
    weight: 600,
  },
  macMincho: {
    font: '"ヒラギノ明朝 ProN W3", HiraMinProN-W3, "ヒラギノ明朝 ProN", HiraMinProN, "Hiragino Mincho ProN"',
    offset: -0.02,
    weight: 300,
  },
  mincho: {
    font: '"游明朝体", "游明朝", "Yu Mincho", YuMincho, yumincho, YuMin-Medium',
    offset: -0.01,
    weight: 400,
  },
  sansSerif400: {
    font: 'sans-serif',
    offset: 0,
    weight: 400,
  },
  sansSerif600: {
    font: 'sans-serif',
    offset: 0,
    weight: 600,
  },
  serif: {
    font: 'serif',
    offset: 0,
    weight: 400,
  },
  simsun: {
    font: '"宋体", SimSun',
    offset: 0.135,
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
    { font: '', offset: 0, weight: 600 }
  );

const fontSets = {
  mac: {
    defont: build([fontTemplates.macGothicPro6]),
    gothic: build([fontTemplates.macGothicPro3]),
    mincho: build([fontTemplates.macMincho]),
  },
  mac10_11: {
    defont: build([fontTemplates.macGothic1]),
    gothic: build([fontTemplates.gothic, fontTemplates.macGothic2]),
    mincho: build([fontTemplates.mincho, fontTemplates.macMincho, fontTemplates.macGothic2]),
  },
  mac10_9: {
    defont: build([fontTemplates.macGothicPro6]),
    gothic: build([fontTemplates.gothic, fontTemplates.macGothicPro3]),
    mincho: build([fontTemplates.mincho, fontTemplates.macMincho, fontTemplates.macGothicPro3]),
  },
  other: {
    defont: build([fontTemplates.sansSerif600]),
    gothic: build([fontTemplates.sansSerif400]),
    mincho: build([fontTemplates.serif]),
  },
  win: {
    defont: build([fontTemplates.arial]),
    gothic: build([fontTemplates.gulim, fontTemplates.arial]),
    mincho: build([fontTemplates.simsun, fontTemplates.arial]),
  },
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
} as const;

export type StandardFontName = 'defont' | 'gothic' | 'mincho';

export type FontAttributes = {
  key: StandardFontName;
  family: string;
  weight: number;
  offset: number;
};

const detectPlatform = (): keyof typeof fontSets => {
  if (typeof navigator === 'undefined') return 'other';
  const ua = navigator.userAgent;
  if (/windows nt 6\.[12]/i.test(ua)) return 'win7';
  if (/windows nt (6\.3|10\.\d+)|win32/i.test(ua)) return 'win8_1';
  if (/mac os x 10_[89]/i.test(ua)) return 'mac10_9';
  if (/mac os x 10_1[01]/i.test(ua)) return 'mac10_11';
  if (/mac os x/i.test(ua)) return 'mac';
  if (/windows/i.test(ua)) return 'win';
  return 'other';
};

let cachedFonts: Record<StandardFontName, FontAttributes> | undefined;

export const getFontDefinitions = (): Record<StandardFontName, FontAttributes> => {
  if (cachedFonts) return cachedFonts;
  const platform = detectPlatform();
  const selected = fontSets[platform] ?? fontSets.other;
  cachedFonts = {
    defont: {
      family: selected.defont.font,
      key: 'defont',
      offset: selected.defont.offset,
      weight: selected.defont.weight,
    },
    gothic: {
      family: selected.gothic.font,
      key: 'gothic',
      offset: selected.gothic.offset,
      weight: selected.gothic.weight,
    },
    mincho: {
      family: selected.mincho.font,
      key: 'mincho',
      offset: selected.mincho.offset,
      weight: selected.mincho.weight,
    },
  };
  return cachedFonts;
};
