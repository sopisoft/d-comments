import { Container, Graphics, Text, TextStyle, type TextStyleFontWeight } from "pixi.js";
import type { TimelineComment } from "./core/types";

export type CommentNode = {
  container: Container;
  width: number;
  height: number;
  resolution: number;
  signature: string;
};

const stableHiResScale = (v: number) => (v > 0 ? v : 1);

export const signatureOf = (c: TimelineComment) => `${c.styleKey}:${c.width}:${c.height}`;

export const createCommentNode = (
  c: TimelineComment,
  resolution: number,
  styleCache: Map<string, TextStyle>
): CommentNode => {
  const container = new Container();
  container.eventMode = "none";
  const padding = c.style.padding;

  let textStyle = styleCache.get(c.styleKey);
  if (!textStyle) {
    const hi = stableHiResScale(c.style.hiResScale);
    textStyle = new TextStyle({
      fontFamily: c.style.fontFamily,
      fontSize: Math.max(1, c.style.fontSize / hi),
      fontWeight: `${c.style.fontWeight}` as TextStyleFontWeight,
      fill: { color: c.style.fill, alpha: c.style.fillAlpha },
      stroke: {
        color: c.style.stroke,
        width: c.style.strokeWidth,
        alpha: c.style.strokeAlpha,
      },
      align: "left",
      wordWrap: false,
      breakWords: false,
    });
    styleCache.set(c.styleKey, textStyle);
  }

  const hi = stableHiResScale(c.style.hiResScale);
  for (const m of c.style.lineMetrics) {
    const txt = m.text.length > 0 ? m.text : " ";
    const t = new Text(txt, textStyle);
    t.resolution = resolution;
    t.roundPixels = true;
    t.scale.set(hi);
    t.x = padding;
    t.y = padding + (m.top - c.style.contentTop);
    container.addChild(t);
  }

  if (c.style.backgroundColor !== undefined || c.style.borderColor !== undefined) {
    const bg = new Graphics();
    if (c.style.backgroundColor !== undefined) {
      bg.rect(0, 0, c.width, c.height);
      bg.fill({
        color: c.style.backgroundColor,
        alpha: c.style.backgroundAlpha ?? 1,
      });
    }
    if (c.style.borderColor !== undefined && c.style.borderWidth) {
      bg.rect(0, 0, c.width, c.height);
      bg.stroke({
        color: c.style.borderColor,
        width: c.style.borderWidth,
        alpha: c.style.borderAlpha ?? 1,
      });
    }
    container.addChildAt(bg, 0);
  }

  return {
    container,
    width: c.width,
    height: c.height,
    resolution,
    signature: signatureOf(c),
  };
};

export const ensureResolution = (n: CommentNode, res: number) => {
  if (n.resolution !== res) {
    for (const child of n.container.children) if (child instanceof Text) child.resolution = res;
    n.resolution = res;
  }
};
