import { type CommandParseContext, parseColorToken, parseCommandColorOverride, type RGBAColor } from "./color";
import {
  CONTEXT_FILL_LIVE_OPACITY,
  CONTEXT_STROKE_COLOR,
  CONTEXT_STROKE_INVERSION_COLOR,
  CONTEXT_STROKE_OPACITY,
} from "./constants";
import { type FontAttributes, getFontDefinitions, type StandardFontName } from "./fontConfig";
import type { CommentLocation, CommentSize } from "./types";

const clampValue = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

export type { CommandParseContext, RGBAColor } from "./color";
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
  fill: number;
  fillAlpha?: number;
  stroke: RGBAColor;
  background?: RGBAColor;
  border?: RGBAColor;
  durationMs: number;
  isFullWidth: boolean;
  disableResize: boolean;
};

const DEFAULT_FILL = 0xffffff;

const FONT_DEFINITIONS: Record<StandardFontName, FontAttributes> = getFontDefinitions();

const FONT_ALIAS_MAP: Record<string, StandardFontName> = {
  defont: "defont",
  gothic: "gothic",
  mincho: "mincho",
};

const TOKEN_SPLIT = /\s+/;

const tokenize = (commands: readonly string[]): string[] =>
  commands.flatMap((cmd) =>
    cmd
      ? cmd
          .split(TOKEN_SPLIT)
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean)
      : []
  );

const resolveSize = (tokens: readonly string[]): CommentSize =>
  tokens.includes("big") ? "big" : tokens.includes("small") ? "small" : "medium";

const resolveLocation = (tokens: readonly string[]): CommentLocation =>
  tokens.includes("ue") ? "top" : tokens.includes("shita") ? "bottom" : "middle";

const resolveFont = (tokens: readonly string[]) => {
  for (const token of tokens) {
    const key = FONT_ALIAS_MAP[token];
    if (key) {
      const def = FONT_DEFINITIONS[key];
      return {
        key,
        family: def.family,
        weight: def.weight,
        offset: def.offset,
      };
    }
  }
  const def = FONT_DEFINITIONS.defont;
  return {
    key: "defont" as StandardFontName,
    family: def.family,
    weight: def.weight,
    offset: def.offset,
  };
};

const resolveFill = (tokens: readonly string[], ctx: CommandParseContext): number => {
  for (let i = tokens.length - 1; i >= 0; i -= 1) {
    const token = tokens[i];
    const parsed = parseColorToken(token, ctx, false);
    if (parsed) return parsed.color;
    const override = parseCommandColorOverride(token);
    if (override) return override.color;
  }
  return DEFAULT_FILL;
};

const createDefaultInfo = (): CommandInfo => {
  const def = FONT_DEFINITIONS.defont;
  return {
    size: "medium",
    loc: "middle",
    font: {
      key: "defont" as StandardFontName,
      family: def.family,
      weight: def.weight,
      offset: def.offset,
    },
    fill: DEFAULT_FILL,
    stroke: { color: CONTEXT_STROKE_COLOR, alpha: CONTEXT_STROKE_OPACITY },
    durationMs: 3000,
    isFullWidth: false,
    disableResize: false,
  };
};

const clampDuration = (valueMs: number): number =>
  !Number.isFinite(valueMs) || Number.isNaN(valueMs) ? 3000 : clampValue(Math.round(valueMs), 100, 120000);

const parseDuration = (token: string): number | null => {
  if (!token.startsWith("@")) return null;
  const seconds = Number(token.slice(1));
  if (!Number.isFinite(seconds) || seconds < 0) return null;
  return Math.round(seconds * 1000);
};

const parseNicoPrefix = (token: string, ctx: CommandParseContext): { key: string; parsed: RGBAColor | null } | null => {
  const prefixes = ["nico:stroke:", "nico:fill:", "nico:waku:"] as const;
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
  info.fill = resolveFill(tokens, ctx);

  let explicitFillAlpha = false;
  for (const token of tokens) {
    if (token === "ender") {
      info.disableResize = true;
      continue;
    }
    if (token === "long") {
      info.durationMs = clampDuration(6000);
      continue;
    }
    if (token === "full") {
      info.durationMs = clampDuration(6000);
      info.isFullWidth = true;
      continue;
    }
    if (token === "verylong") {
      info.durationMs = clampDuration(8000);
      continue;
    }

    const duration = parseDuration(token);
    if (duration !== null) {
      info.durationMs = clampDuration(duration);
      continue;
    }

    const nicoResult = parseNicoPrefix(token, ctx);
    if (nicoResult?.parsed) {
      if (nicoResult.key === "stroke") info.stroke = nicoResult.parsed;
      else if (nicoResult.key === "fill") info.background = nicoResult.parsed;
      else if (nicoResult.key === "waku") info.border = nicoResult.parsed;
      continue;
    }

    if (token.startsWith("nico:opacity:")) {
      const value = Number(token.slice("nico:opacity:".length));
      if (!Number.isNaN(value)) {
        info.fillAlpha = clampValue(value, 0, 1);
        explicitFillAlpha = true;
      }
      continue;
    }
    if (token === "_live" && !explicitFillAlpha) info.fillAlpha = CONTEXT_FILL_LIVE_OPACITY;
  }

  if (!info.stroke || info.stroke.color === undefined) {
    info.stroke = {
      color: info.fill === 0x000000 ? CONTEXT_STROKE_INVERSION_COLOR : CONTEXT_STROKE_COLOR,
      alpha: CONTEXT_STROKE_OPACITY,
    };
  } else if (info.stroke.alpha === undefined) {
    info.stroke = { ...info.stroke, alpha: CONTEXT_STROKE_OPACITY };
  }
  return info;
};
