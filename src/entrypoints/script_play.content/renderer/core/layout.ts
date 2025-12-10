import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  COLLISION_PADDING,
  COLLISION_RANGE,
  COMMENT_DRAW_PADDING,
  COMMENT_DRAW_RANGE,
  NAKA_COMMENT_SPEED_OFFSET,
} from "./constants";
import type { CommentLocation, TimelineComment } from "./types";

const PUSH_GUARD_LIMIT = 10;

type LayoutItem = {
  index: number;
  comment: TimelineComment;
  width: number;
  height: number;
  vpos: number;
  long: number;
  owner: boolean;
  layer: number;
  loc: CommentLocation;
  posY: number;
  laneHeight: number;
};

type CollisionMap = Map<number, LayoutItem[]>;
type CollisionState = {
  top: CollisionMap;
  bottom: CollisionMap;
  left: CollisionMap;
  right: CollisionMap;
};

const ensureList = (map: CollisionMap, key: number): LayoutItem[] => {
  let list = map.get(key);
  if (!list) {
    list = [];
    map.set(key, list);
  }
  return list;
};

const pushUnique = (map: CollisionMap, key: number, value: LayoutItem) => {
  const list = ensureList(map, key);
  if (!list.includes(value)) list.push(value);
};

const computeScrollSpeed = (width: number, long: number): number =>
  (COMMENT_DRAW_RANGE + width * NAKA_COMMENT_SPEED_OFFSET) / (long + 100);

const computeScrollLeft = (item: LayoutItem, vpos: number): number =>
  item.loc !== "middle"
    ? (CANVAS_WIDTH - item.width) / 2
    : COMMENT_DRAW_PADDING + COMMENT_DRAW_RANGE - (vpos - item.vpos + 100) * computeScrollSpeed(item.width, item.long);

type PosYResult = { currentPos: number; isChanged: boolean; isBreak: boolean };

const resolvePosY = (
  currentPos: number,
  target: LayoutItem,
  collisions: readonly LayoutItem[] | undefined,
  isChanged = false
): PosYResult => {
  if (!collisions?.length) return { currentPos, isChanged, isBreak: false };

  let pos = currentPos;
  let changed = isChanged;
  for (const c of collisions) {
    if (c.index === target.index || c.posY < 0 || c.owner !== target.owner || c.layer !== target.layer) continue;
    const cBottom = c.posY + c.height;
    if (pos < cBottom && pos + target.height > c.posY) {
      if (cBottom > pos) {
        pos = cBottom;
        changed = true;
      }
      if (pos + target.height > CANVAS_HEIGHT) {
        if (CANVAS_HEIGHT < target.height) {
          pos = target.loc === "middle" ? (target.height - CANVAS_HEIGHT) / -2 : 0;
        } else {
          const limit = CANVAS_HEIGHT - target.height;
          pos = limit > 0 ? Math.floor(Math.random() * limit) : 0;
        }
        return { currentPos: pos, isChanged: changed, isBreak: true };
      }
      return resolvePosY(pos, target, collisions, true);
    }
  }
  return { currentPos: pos, isChanged: changed, isBreak: false };
};

const getFixedPosY = (item: LayoutItem, collision: CollisionMap): number => {
  let pos = 0;
  let changed = true;
  for (let guard = 0; changed && guard < PUSH_GUARD_LIMIT; guard++) {
    changed = false;
    for (let offset = 0; offset < item.long; offset++) {
      const result = resolvePosY(pos, item, collision.get(item.vpos + offset), changed);
      pos = result.currentPos;
      changed = result.isChanged;
      if (result.isBreak) break;
    }
  }
  return pos;
};

const getMovablePosY = (item: LayoutItem, collision: CollisionState, beforeVpos: number): number => {
  if (CANVAS_HEIGHT < item.height) return (item.height - CANVAS_HEIGHT) / -2;

  let pos = 0;
  let changed = true;
  let lastUpdated: number | undefined;

  while (changed) {
    changed = false;
    for (let offset = beforeVpos; offset < item.long + 125; offset += 5) {
      const vpos = item.vpos + offset;
      if (lastUpdated === vpos) return pos;
      const leftPos = computeScrollLeft(item, vpos);
      let shouldBreak = false;

      const checkCollision = (map: CollisionMap, range: number) => {
        if (leftPos + item.width >= range && leftPos <= range) {
          const result = resolvePosY(pos, item, map.get(vpos), changed);
          pos = result.currentPos;
          if (result.isChanged) {
            changed = true;
            lastUpdated = vpos;
          }
          return result.isBreak;
        }
        return false;
      };
      shouldBreak = checkCollision(collision.right, COLLISION_RANGE.right);
      shouldBreak ||= checkCollision(collision.left, COLLISION_RANGE.left);
      if (shouldBreak) return pos;
    }
  }
  return pos;
};

const processFixed = (item: LayoutItem, collision: CollisionMap) => {
  const pos = getFixedPosY(item, collision);
  item.posY = pos;
  item.comment.posY = pos;
  for (let offset = 0; offset < item.long - 20; offset++) {
    pushUnique(collision, item.vpos + offset, item);
  }
};

const processMovable = (item: LayoutItem, collision: CollisionState) => {
  const beforeVpos = Math.round(-288 / ((1632 + item.width) / (item.long + 125))) - 100;
  const pos = getMovablePosY(item, collision, beforeVpos);
  item.posY = pos;
  item.comment.posY = pos;

  for (let offset = beforeVpos; offset < item.long + 125; offset++) {
    const vpos = item.vpos + offset;
    const leftPos = computeScrollLeft(item, vpos);
    if (leftPos + item.width + COLLISION_PADDING >= COLLISION_RANGE.right && leftPos <= COLLISION_RANGE.right) {
      pushUnique(collision.right, vpos, item);
    }
    if (leftPos + item.width + COLLISION_PADDING >= COLLISION_RANGE.left && leftPos <= COLLISION_RANGE.left) {
      pushUnique(collision.left, vpos, item);
    }
  }
};

export const applyLayout = (comments: readonly TimelineComment[]): void => {
  if (comments.length === 0) return;

  const items: LayoutItem[] = comments.map((comment, index) => {
    const lineCount = Math.max(1, comment.style.lineCount);
    const laneHeight = comment.loc === "middle" ? 0 : comment.style.laneHeight;
    return {
      index,
      comment,
      width: comment.width,
      height: comment.loc === "middle" ? comment.height : Math.max(comment.height, laneHeight * lineCount),
      vpos: comment.vpos,
      long: Math.max(1, comment.durationVpos),
      owner: comment.owner,
      layer: comment.layer,
      loc: comment.loc,
      posY: comment.posY,
      laneHeight,
    };
  });

  const sorted = [...items].sort((a, b) =>
    a.vpos !== b.vpos
      ? a.vpos - b.vpos
      : a.comment.enterMs !== b.comment.enterMs
        ? a.comment.enterMs - b.comment.enterMs
        : a.index - b.index
  );

  const collision: CollisionState = {
    top: new Map(),
    bottom: new Map(),
    left: new Map(),
    right: new Map(),
  };

  for (const item of sorted) {
    if (item.loc === "middle") processMovable(item, collision);
    else processFixed(item, item.loc === "top" ? collision.top : collision.bottom);
  }
};
