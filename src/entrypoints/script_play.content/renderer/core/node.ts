import {
  CanvasTextMetrics,
  Container,
  Graphics,
  type Renderer,
  RenderTexture,
  Sprite,
  Text,
  TextStyle,
  type TextStyleFontWeight,
} from 'pixi.js';
import { HIRES_COMMENT_CORRECTION } from './constants';
import type { TimelineComment } from './types';

export type Node = { container: Container; signature: string; sprite: Sprite };
export type NodeOptions = {
  renderer: Renderer;
  styleCache: Map<string, TextStyle>;
  textureCache: Map<string, RenderTexture>;
  getResolution: () => number;
};

type NodeContext = { options: NodeOptions; comment: TimelineComment };

const RES_MAX = 1;
const clampRes = (value: number): number => Math.max(1, Math.min(RES_MAX, value));
const textLines = (comment: TimelineComment): string =>
  comment.body
    .split(/\r?\n/)
    .map((line) => line || ' ')
    .join('\n');

const toWeight = (value: number): TextStyleFontWeight => {
  const rounded = `${Math.round(value)}`;
  switch (rounded) {
    case '100':
    case '200':
    case '300':
    case '400':
    case '500':
    case '600':
    case '700':
    case '800':
    case '900':
      return rounded;
    default:
      return 'normal';
  }
};

const strokeWidth = (style: TextStyle): number => {
  const stroke = style.stroke;
  if (!stroke || typeof stroke !== 'object' || !('width' in stroke)) return 0;
  const width = stroke.width;
  return typeof width === 'number' ? width : 0;
};

const offsetY = (comment: TimelineComment, style: TextStyle): number => {
  const metrics = CanvasTextMetrics.measureText('M', style);
  const fontSize = metrics.fontProperties.fontSize || style.fontSize;
  const lineHeight = metrics.lineHeight || style.lineHeight || fontSize;
  const lineShift = Math.max(0, (lineHeight - fontSize) / 2);
  const baselineFromTop = strokeWidth(style) / 2 + metrics.fontProperties.ascent + lineShift + style.padding;
  const paddingTop = (10 - comment.style.hiResScale * 10) * ((comment.style.lineCount + 1) / HIRES_COMMENT_CORRECTION);
  const baseline = comment.style.lineHeight * (1 + paddingTop) + comment.style.fontOffset;
  const hi = Math.max(comment.style.hiResScale, 1e-6);
  return baseline / hi - baselineFromTop;
};

const signatureOf = (comment: TimelineComment): string =>
  `${comment.styleKey}:${comment.width}:${comment.height}:${comment.posY}`;

const textureKeyOf = (comment: TimelineComment, resolution: number): string =>
  `${clampRes(resolution)}:${comment.styleKey}:${textLines(comment)}`;

const ensureStyle = (comment: TimelineComment, cache: Map<string, TextStyle>): TextStyle => {
  const cached = cache.get(comment.styleKey);
  if (cached) return cached;
  const hi = Math.max(comment.style.hiResScale, 1e-6);
  const style = new TextStyle({
    align: 'left',
    breakWords: false,
    fill: { alpha: comment.style.fillAlpha, color: comment.style.fill },
    fontFamily: comment.style.fontFamily,
    fontSize: Math.max(1, comment.style.fontSize / hi),
    fontWeight: toWeight(comment.style.fontWeight),
    lineHeight: Math.max(1, comment.style.lineHeight / hi),
    stroke: { alpha: comment.style.strokeAlpha, color: comment.style.stroke, width: comment.style.strokeWidth / hi },
    padding: 0,
    whiteSpace: 'pre',
    wordWrap: false,
  });
  cache.set(comment.styleKey, style);
  return style;
};

const buildTexture = (ctx: NodeContext, style: TextStyle, text: string, resolution: number): RenderTexture => {
  const temp = new Text({ style, text });
  temp.eventMode = 'none';
  temp.interactiveChildren = false;
  temp.resolution = resolution;
  temp.roundPixels = false;
  temp.anchor.set(0, 0);
  temp.x = 0;
  temp.y = offsetY(ctx.comment, style);
  temp.scale.set(ctx.comment.style.hiResScale, ctx.comment.style.hiResScale);

  const wrap = new Container();
  wrap.eventMode = 'none';
  wrap.interactiveChildren = false;
  wrap.addChild(temp);

  const texture = ctx.options.renderer.textureGenerator.generateTexture({
    antialias: true,
    resolution,
    target: wrap,
  });

  temp.destroy({ style: false, texture: true, textureSource: true });
  wrap.destroy({ children: true });

  return texture;
};

const ensureTexture = (ctx: NodeContext, style: TextStyle): RenderTexture => {
  const resolution = clampRes(ctx.options.getResolution());
  const key = textureKeyOf(ctx.comment, resolution);
  const cached = ctx.options.textureCache.get(key);
  if (cached) return cached;
  const texture = buildTexture(ctx, style, textLines(ctx.comment), resolution);
  ctx.options.textureCache.set(key, texture);
  return texture;
};

const buildBg = (comment: TimelineComment): Graphics | null => {
  if (comment.style.backgroundColor === undefined && comment.style.borderColor === undefined) return null;
  const bg = new Graphics();
  if (comment.style.backgroundColor !== undefined) {
    bg.rect(0, 0, comment.width, comment.height);
    bg.fill({ alpha: comment.style.backgroundAlpha ?? 1, color: comment.style.backgroundColor });
  }
  if (comment.style.borderColor !== undefined && comment.style.borderWidth) {
    bg.rect(0, 0, comment.width, comment.height);
    bg.stroke({
      alpha: comment.style.borderAlpha ?? 1,
      color: comment.style.borderColor,
      width: comment.style.borderWidth,
    });
  }
  return bg;
};

const syncSprite = (sprite: Sprite, comment: TimelineComment): void => {
  sprite.alpha = comment.style.opacity ?? 1;
  sprite.roundPixels = false;
  sprite.anchor.set(0, 0);
  sprite.x = 0;
  sprite.y = 0;
};

export const createNodeOps = (
  options: NodeOptions
): {
  clearTextures: () => void;
  makeNode: (comment: TimelineComment) => Node;
  nodeSignature: (comment: TimelineComment) => string;
  textureKey: (comment: TimelineComment) => string;
  updateNode: (node: Node, comment: TimelineComment) => void;
} => {
  const makeNode = (comment: TimelineComment): Node => {
    const container = new Container();
    container.eventMode = 'none';
    container.interactiveChildren = false;
    const style = ensureStyle(comment, options.styleCache);
    const texture = ensureTexture({ options, comment }, style);
    const sprite = new Sprite(texture);
    sprite.eventMode = 'none';
    sprite.interactiveChildren = false;
    syncSprite(sprite, comment);
    container.addChild(sprite);
    const bg = buildBg(comment);
    if (bg) container.addChildAt(bg, 0);
    return { container, signature: signatureOf(comment), sprite };
  };

  const updateNode = (node: Node, comment: TimelineComment): void => {
    const style = ensureStyle(comment, options.styleCache);
    const texture = ensureTexture({ options, comment }, style);
    if (node.sprite.texture !== texture) node.sprite.texture = texture;
    syncSprite(node.sprite, comment);
    node.signature = signatureOf(comment);
  };

  const clearTextures = (): void => {
    for (const texture of options.textureCache.values()) texture.destroy(true);
    options.textureCache.clear();
  };

  return {
    clearTextures,
    makeNode,
    nodeSignature: signatureOf,
    textureKey: (comment: TimelineComment) => textureKeyOf(comment, options.getResolution()),
    updateNode,
  } as const;
};
