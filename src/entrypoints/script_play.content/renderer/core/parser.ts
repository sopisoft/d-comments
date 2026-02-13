import { type CommandParseContext, parseColorToken, parseCommandColorOverride, type RGBAColor } from './color';
import {
  CONTEXT_FILL_LIVE_OPACITY,
  CONTEXT_STROKE_COLOR,
  CONTEXT_STROKE_INVERSION_COLOR,
  CONTEXT_STROKE_OPACITY,
} from './constants';
import { type FontAttributes, getFontDefinitions, type StandardFontName } from './fonts';
import type { CommentLocation, CommentSize } from './types';

const clampValue = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

export type { CommandParseContext, RGBAColor } from './color';
export { parseColorToken };

export type CommandInfo = {
  size: CommentSize;
  loc: CommentLocation;
  font: {
    key: StandardFontName;
    family: string;
    weight: number;
    offset: number;
  };
  durationMs: number;
  fill: number;
  fillAlpha?: number;
  stroke: RGBAColor;
  background?: RGBAColor;
  border?: RGBAColor;
  isFullWidth: boolean;
  disableResize: boolean;
  opacity?: number;
  invisible?: boolean;
};

const DEFAULT_FILL = 0xffffff;

const FONT_DEFINITIONS: Record<StandardFontName, FontAttributes> = getFontDefinitions();

const FONT_ALIAS_MAP: Record<string, StandardFontName> = {
  defont: 'defont',
  gothic: 'gothic',
  mincho: 'mincho',
};

const TOKEN_SPLIT = /\s+/;

const tokenize = (commands: readonly string[]): string[] =>
  commands.flatMap((command) =>
    command
      ? command
          .split(TOKEN_SPLIT)
          .map((token) => token.trim().toLowerCase())
          .filter(Boolean)
      : []
  );

const resolveSize = (tokens: readonly string[]): CommentSize =>
  tokens.includes('big') ? 'big' : tokens.includes('small') ? 'small' : 'medium';

const resolveLocation = (tokens: readonly string[]): CommentLocation =>
  tokens.includes('ue') ? 'top' : tokens.includes('shita') ? 'bottom' : 'middle';

const resolveFont = (tokens: readonly string[]) => {
  for (const token of tokens) {
    const key = FONT_ALIAS_MAP[token];
    if (key) {
      const def = FONT_DEFINITIONS[key];
      return {
        family: def.family,
        key,
        offset: def.offset,
        weight: def.weight,
      };
    }
  }
  const def = FONT_DEFINITIONS.defont;
  return {
    family: def.family,
    key: 'defont' as StandardFontName,
    offset: def.offset,
    weight: def.weight,
  };
};

const resolveFill = (tokens: readonly string[], ctx: CommandParseContext): RGBAColor => {
  for (let index = tokens.length - 1; index >= 0; index -= 1) {
    const token = tokens[index];
    const parsed = parseColorToken(token, ctx, false);
    if (parsed) return parsed;
    const override = parseCommandColorOverride(token);
    if (override) return override;
  }
  return { color: DEFAULT_FILL };
};

const createDefaultInfo = (): CommandInfo => {
  const def = FONT_DEFINITIONS.defont;
  return {
    disableResize: false,
    durationMs: 3000,
    fill: DEFAULT_FILL,
    font: {
      key: 'defont' as StandardFontName,
      family: def.family,
      weight: def.weight,
      offset: def.offset,
    },
    isFullWidth: false,
    loc: 'middle',
    size: 'medium',
    stroke: { color: CONTEXT_STROKE_COLOR, alpha: CONTEXT_STROKE_OPACITY },
  };
};

const parseDuration = (token: string): number | null => {
  if (!token.startsWith('@')) return null;
  const durationSeconds = Number(token.slice(1));
  if (!Number.isFinite(durationSeconds) || durationSeconds < 0) return null;
  return Math.floor(durationSeconds * 1000);
};

const parseNicoPrefix = (token: string, ctx: CommandParseContext): { key: string; parsed: RGBAColor | null } | null => {
  const prefixes = ['nico:stroke:', 'nico:fill:', 'nico:waku:'] as const;
  for (const prefix of prefixes) {
    if (token.startsWith(prefix)) {
      const value = token.slice(prefix.length);
      return {
        key: prefix.slice(5, -1),
        parsed: parseColorToken(value, ctx, true) ?? parseCommandColorOverride(value),
      };
    }
  }
  return null;
};

export const parseMailCommands = (commands: readonly string[], ctx: CommandParseContext): CommandInfo => {
  const tokens = tokenize(commands);
  const info = createDefaultInfo();
  info.size = resolveSize(tokens);
  info.loc = resolveLocation(tokens);
  info.font = resolveFont(tokens);
  const fill = resolveFill(tokens, ctx);
  info.fill = fill.color;
  const baseFillAlpha = clampValue(fill.alpha ?? 1, 0, 1);

  let explicitOpacity = false;
  let opacity = 1;
  for (const token of tokens) {
    if (token === 'ender') {
      info.disableResize = true;
      continue;
    }
    if (token === 'full') {
      info.isFullWidth = true;
      continue;
    }

    const duration = parseDuration(token);
    if (duration !== null) {
      info.durationMs = duration;
      continue;
    }

    const nicoResult = parseNicoPrefix(token, ctx);
    if (nicoResult?.parsed) {
      if (nicoResult.key === 'stroke') info.stroke = nicoResult.parsed;
      else if (nicoResult.key === 'fill') info.background = nicoResult.parsed;
      else if (nicoResult.key === 'waku') info.border = nicoResult.parsed;
      continue;
    }

    if (token.startsWith('nico:opacity:')) {
      const value = Number(token.slice('nico:opacity:'.length));
      if (!Number.isNaN(value)) {
        opacity = clampValue(value, 0, 1);
        explicitOpacity = true;
      }
      continue;
    }
    if (token === 'invisible') {
      info.invisible = true;
      continue;
    }
    if (token === '_live' && !explicitOpacity) opacity = CONTEXT_FILL_LIVE_OPACITY;
  }

  if (!info.stroke || info.stroke.color === undefined) {
    info.stroke = {
      alpha: CONTEXT_STROKE_OPACITY,
      color: info.fill === 0x000000 ? CONTEXT_STROKE_INVERSION_COLOR : CONTEXT_STROKE_COLOR,
    };
  } else if (info.stroke.alpha === undefined) {
    info.stroke = { ...info.stroke, alpha: CONTEXT_STROKE_OPACITY };
  }
  const strokeAlpha = clampValue(info.stroke.alpha ?? 1, 0, 1);
  info.opacity = opacity !== 1 ? opacity : undefined;
  info.fillAlpha = clampValue(baseFillAlpha, 0, 1);
  info.stroke = { ...info.stroke, alpha: clampValue(strokeAlpha, 0, 1) };
  return info;
};
