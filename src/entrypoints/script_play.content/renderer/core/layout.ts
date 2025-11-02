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

type LayoutTimeline = Map<number, LayoutItem[]>;

type CollisionState = {
  top: CollisionMap;
  bottom: CollisionMap;
  left: CollisionMap;
  right: CollisionMap;
};

const ensureList = (map: CollisionMap, key: number): LayoutItem[] => {
  const existing = map.get(key);
  if (existing) return existing;
  const created: LayoutItem[] = [];
  map.set(key, created);
  return created;
};

const pushUnique = (map: CollisionMap, key: number, value: LayoutItem) => {
  const list = ensureList(map, key);
  if (!list.includes(value)) {
    list.push(value);
  }
};

const pushTimeline = (
  timeline: LayoutTimeline,
  key: number,
  value: LayoutItem
) => {
  const list = timeline.get(key);
  if (list) {
    if (!list.includes(value)) list.push(value);
    return;
  }
  timeline.set(key, [value]);
};

const computeScrollSpeed = (width: number, long: number): number =>
  (COMMENT_DRAW_RANGE + width * NAKA_COMMENT_SPEED_OFFSET) / (long + 100);

const computeScrollLeft = (item: LayoutItem, vpos: number): number => {
  if (item.loc !== "middle") {
    return (CANVAS_WIDTH - item.width) / 2;
  }
  const speed = computeScrollSpeed(item.width, item.long);
  const elapsed = vpos - item.vpos;
  return COMMENT_DRAW_PADDING + COMMENT_DRAW_RANGE - (elapsed + 100) * speed;
};

type PosYResult = {
  currentPos: number;
  isChanged: boolean;
  isBreak: boolean;
};

const resolvePosY = (
  currentPos: number,
  target: LayoutItem,
  collisions: readonly LayoutItem[] | undefined,
  isChanged = false
): PosYResult => {
  if (!collisions || collisions.length === 0) {
    return { currentPos, isChanged, isBreak: false };
  }

  let pos = currentPos;
  let changed = isChanged;
  let shouldBreak = false;

  for (const collision of collisions) {
    if (collision.index === target.index || collision.posY < 0) continue;
    if (collision.owner !== target.owner || collision.layer !== target.layer) {
      continue;
    }
    const collisionBottom = collision.posY + collision.height;
    const targetBottom = pos + target.height;
    if (pos < collisionBottom && targetBottom > collision.posY) {
      if (collisionBottom > pos) {
        pos = collisionBottom;
        changed = true;
      }
      if (pos + target.height > CANVAS_HEIGHT) {
        if (CANVAS_HEIGHT < target.height) {
          pos =
            target.loc === "middle" ? (target.height - CANVAS_HEIGHT) / -2 : 0;
        } else {
          const limit = CANVAS_HEIGHT - target.height;
          pos = limit > 0 ? Math.floor(Math.random() * limit) : 0;
        }
        shouldBreak = true;
        break;
      }
      return resolvePosY(pos, target, collisions, true);
    }
  }

  return { currentPos: pos, isChanged: changed, isBreak: shouldBreak };
};

const getFixedPosY = (item: LayoutItem, collision: CollisionMap): number => {
  let pos = 0;
  let changed = true;
  let guard = 0;

  while (changed && guard < PUSH_GUARD_LIMIT) {
    changed = false;
    guard += 1;
    for (let offset = 0; offset < item.long; offset += 1) {
      const collisions = collision.get(item.vpos + offset);
      const result = resolvePosY(pos, item, collisions, changed);
      pos = result.currentPos;
      changed = result.isChanged;
      if (result.isBreak) break;
    }
  }

  return pos;
};

const getMovablePosY = (
  item: LayoutItem,
  collision: CollisionState,
  beforeVpos: number
): number => {
  if (CANVAS_HEIGHT < item.height) {
    return (item.height - CANVAS_HEIGHT) / -2;
  }

  let pos = 0;
  let changed = true;
  let lastUpdated: number | undefined;

  while (changed) {
    changed = false;
    for (let offset = beforeVpos; offset < item.long + 125; offset += 5) {
      const vpos = item.vpos + offset;
      const leftPos = computeScrollLeft(item, vpos);
      let shouldBreak = false;
      if (lastUpdated !== undefined && lastUpdated === vpos) {
        return pos;
      }
      if (
        leftPos + item.width >= COLLISION_RANGE.right &&
        leftPos <= COLLISION_RANGE.right
      ) {
        const result = resolvePosY(
          pos,
          item,
          collision.right.get(vpos),
          changed
        );
        pos = result.currentPos;
        if (result.isChanged) {
          changed = true;
          lastUpdated = vpos;
        }
        shouldBreak = result.isBreak;
      }
      if (
        leftPos + item.width >= COLLISION_RANGE.left &&
        leftPos <= COLLISION_RANGE.left
      ) {
        const result = resolvePosY(
          pos,
          item,
          collision.left.get(vpos),
          changed
        );
        pos = result.currentPos;
        if (result.isChanged) {
          changed = true;
          lastUpdated = vpos;
        }
        shouldBreak ||= result.isBreak;
      }
      if (shouldBreak) return pos;
    }
  }

  return pos;
};

const processFixed = (
  item: LayoutItem,
  collision: CollisionMap,
  timeline: LayoutTimeline
) => {
  const pos = getFixedPosY(item, collision);
  item.posY = pos;
  item.comment.posY = pos;

  for (let offset = 0; offset < item.long; offset += 1) {
    const vpos = item.vpos + offset;
    pushTimeline(timeline, vpos, item);
    if (offset > item.long - 20) continue;
    pushUnique(collision, vpos, item);
  }
};

const processMovable = (
  item: LayoutItem,
  collision: CollisionState,
  timeline: LayoutTimeline
) => {
  const beforeVpos =
    Math.round(-288 / ((1632 + item.width) / (item.long + 125))) - 100;
  const pos = getMovablePosY(item, collision, beforeVpos);
  item.posY = pos;
  item.comment.posY = pos;

  for (let offset = beforeVpos; offset < item.long + 125; offset += 1) {
    const vpos = item.vpos + offset;
    pushTimeline(timeline, vpos, item);
    const leftPos = computeScrollLeft(item, vpos);
    if (
      leftPos + item.width + COLLISION_PADDING >= COLLISION_RANGE.right &&
      leftPos <= COLLISION_RANGE.right
    ) {
      pushUnique(collision.right, vpos, item);
    }
    if (
      leftPos + item.width + COLLISION_PADDING >= COLLISION_RANGE.left &&
      leftPos <= COLLISION_RANGE.left
    ) {
      pushUnique(collision.left, vpos, item);
    }
  }
};

export const applyLayout = (comments: readonly TimelineComment[]): void => {
  if (comments.length === 0) return;

  const items: LayoutItem[] = comments.map((comment, index) => {
    const renderHeight = comment.height;
    const lineCount = Math.max(1, comment.style.lineCount);
    const laneHeight = comment.loc === "middle" ? 0 : comment.style.laneHeight;
    const collisionHeight =
      comment.loc === "middle"
        ? renderHeight
        : Math.max(renderHeight, laneHeight * lineCount);

    return {
      index,
      comment,
      width: comment.width,
      height: collisionHeight,
      vpos: comment.vpos,
      long: Math.max(1, comment.durationVpos),
      owner: comment.owner,
      layer: comment.layer,
      loc: comment.loc,
      posY: comment.posY,
      laneHeight,
    };
  });

  const sorted = [...items].sort((a, b) => {
    if (a.vpos !== b.vpos) return a.vpos - b.vpos;
    if (a.comment.enterMs !== b.comment.enterMs) {
      return a.comment.enterMs - b.comment.enterMs;
    }
    return a.index - b.index;
  });

  const collision: CollisionState = {
    top: new Map(),
    bottom: new Map(),
    left: new Map(),
    right: new Map(),
  };
  const timeline: LayoutTimeline = new Map();

  for (const item of sorted) {
    if (item.loc === "middle") {
      processMovable(item, collision, timeline);
      continue;
    }
    const targetCollision =
      item.loc === "top" ? collision.top : collision.bottom;
    processFixed(item, targetCollision, timeline);
  }
};
