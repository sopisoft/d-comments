import type { Threads } from '@/types/api';
import { applyLayout, computeBeforeVpos } from './layout';
import { measureComment } from './measurement';
import { parseMailCommands } from './parser';
import type { CommentStyle, TimelineComment } from './types';

const normalizeCommands = (commands: readonly string[] | undefined): readonly string[] => commands ?? [];

const CA_SCORE_MIN = 10;
const CA_GAP = 100;
const CA_RANGE = 3600;
const CA_TIME_RANGE = 300;
const CA_COMMANDS = new Set(['ca', 'patissier', 'ender', 'full']);
const CA_IGNORE = /@[\d.]+|184|device:.+|patissier|ca/;

type RawEntry = {
  id: string;
  body: string;
  commands: readonly string[];
  date: number;
  vpos: number;
  owner: boolean;
  userId: string | null;
};

const buildCALayers = (threads: Threads): Map<string, number> => {
  const entries: RawEntry[] = [];
  for (const thread of threads) {
    const owner = thread.fork === 'owner';
    for (const raw of thread.comments) {
      if (!raw?.body) continue;
      const id = `${thread.id}:${raw.id}:${raw.no}`;
      const date = Math.floor(Date.parse(raw.postedAt) / 1000) || 0;
      entries.push({
        body: raw.body,
        commands: normalizeCommands(raw.commands),
        date,
        id,
        owner,
        userId: raw.userId || null,
        vpos: Math.floor(raw.vposMs / VPOS_FRAME_MS),
      });
    }
  }

  const scores = new Map<string, number>();
  for (const entry of entries) {
    if (!entry.userId) continue;
    let score = scores.get(entry.userId) ?? 0;
    if (entry.commands.some((command) => CA_COMMANDS.has(command))) score += 5;
    const breakCount = (entry.body.match(/\r\n|\n|\r/g) ?? []).length;
    if (breakCount > 2) score += breakCount / 2;
    scores.set(entry.userId, score);
  }

  const lastByKey = new Map<string, RawEntry>();
  const filtered: RawEntry[] = [];
  for (const entry of entries) {
    const key = `${entry.body}@@${[...entry.commands]
      .sort((left, right) => left.localeCompare(right))
      .filter((command) => !CA_IGNORE.test(command))
      .join('')}`;
    const last = lastByKey.get(key);
    if (!last) {
      lastByKey.set(key, entry);
      filtered.push(entry);
      continue;
    }
    if (entry.vpos - last.vpos > CA_GAP || Math.abs(entry.date - last.date) < CA_RANGE) {
      lastByKey.set(key, entry);
      filtered.push(entry);
    }
  }

  const byUser = new Map<string, RawEntry[]>();
  for (const entry of filtered) {
    if (entry.owner || !entry.userId) continue;
    if ((scores.get(entry.userId) ?? 0) < CA_SCORE_MIN) continue;
    const list = byUser.get(entry.userId) ?? [];
    list.push(entry);
    byUser.set(entry.userId, list);
  }

  const layers = new Map<string, number>();
  let layerId = 0;
  for (const list of byUser.values()) {
    const groups: { start: number; end: number; comments: RawEntry[] }[] = [];
    for (const entry of list) {
      let group = groups.find(
        (grp) => grp.start - CA_TIME_RANGE <= entry.date && grp.end + CA_TIME_RANGE >= entry.date
      );
      if (!group) {
        group = { comments: [], end: entry.date, start: entry.date };
        groups.push(group);
      }
      group.comments.push(entry);
      group.start = Math.min(group.start, entry.date);
      group.end = Math.max(group.end, entry.date);
    }
    for (const group of groups) {
      for (const entry of group.comments) layers.set(entry.id, layerId);
      layerId++;
    }
  }
  return layers;
};

const createStyleKey = (style: CommentStyle): string =>
  `${style.fontKey}|${style.fontWeight}|${style.fontSize}|${style.fill}|${style.fillAlpha}|${style.stroke}|${
    style.strokeAlpha
  }|${style.strokeWidth}|${style.lineHeight}|${style.charSize}|${style.backgroundColor ?? ''}|${
    style.backgroundAlpha ?? ''
  }|${style.borderColor ?? ''}|${style.borderWidth ?? 0}|${style.borderAlpha ?? ''}`;

const applyFontScale = (style: CommentStyle, fontScale: number): CommentStyle => {
  if (fontScale === 1) return style;
  return {
    ...style,
    borderWidth: style.borderWidth !== undefined ? style.borderWidth * fontScale : undefined,
    charSize: style.charSize * fontScale,
    contentWidth: style.contentWidth * fontScale,
    fontOffset: style.fontOffset * fontScale,
    hiResScale: style.hiResScale,
    fontSize: style.fontSize * fontScale,
    laneHeight: style.laneHeight * fontScale,
    lineHeight: style.lineHeight * fontScale,
    strokeWidth: style.strokeWidth * fontScale,
  };
};

const VPOS_FRAME_MS = 10;

export const buildTimeline = (threads: Threads, fontScale: number): Record<number, TimelineComment[]> => {
  const caLayers = buildCALayers(threads);
  const all: TimelineComment[] = [];
  for (let threadIndex = 0; threadIndex < threads.length; threadIndex++) {
    const thread = threads[threadIndex];
    const owner = thread.fork === 'owner';
    for (const raw of thread.comments) {
      if (!raw?.body) continue;
      const info = parseMailCommands(normalizeCommands(raw.commands), {
        isPremium: raw.isPremium,
      });
      if (info.invisible) continue;
      const content = raw.body.replace(/\t/g, '\u2003\u2003');
      const measuredStyle = measureComment(content, info, {
        disableResize: info.disableResize,
      });
      const style = applyFontScale(measuredStyle, fontScale);
      const durationVpos = Math.max(1, Math.floor(info.durationMs / 10));
      const laneCount = Math.max(1, style.lineCount);
      const width = Math.max(1, Math.ceil(style.contentWidth));
      const height = Math.max(1, Math.ceil(style.lineHeight * (laneCount - 1) + style.charSize));

      const vpos = Math.floor(raw.vposMs / VPOS_FRAME_MS);
      const comment: TimelineComment = {
        id: `${thread.id}:${raw.id}:${raw.no}`,
        vposMs: raw.vposMs,
        vpos,
        body: content,
        loc: info.loc,
        size: info.size,
        style,
        styleKey: createStyleKey(style),
        durationMs: info.durationMs,
        durationVpos,
        isFullWidth: info.isFullWidth,
        enterMs: raw.vposMs,
        exitMs: raw.vposMs + info.durationMs,
        width,
        height,
        posY: -1,
        owner,
        layer: caLayers.get(`${thread.id}:${raw.id}:${raw.no}`) ?? 0,
        invisible: info.invisible,
      };
      all.push(comment);
    }
  }

  applyLayout(all);

  const timeline: Record<number, TimelineComment[]> = {};
  for (const comment of all) {
    const long = Math.max(1, comment.durationVpos);
    if (comment.loc === 'middle') {
      const beforeVpos = computeBeforeVpos(comment.width, long);
      const startVpos = comment.vpos + beforeVpos;
      const endVpos = comment.vpos + long + 125;
      for (let vpos = startVpos; vpos < endVpos; vpos++) {
        const list = timeline[vpos] ?? [];
        list.push(comment);
        timeline[vpos] = list;
      }
      continue;
    }
    const endVpos = comment.vpos + long;
    for (let vpos = comment.vpos; vpos < endVpos; vpos++) {
      const list = timeline[vpos] ?? [];
      list.push(comment);
      timeline[vpos] = list;
    }
  }

  for (const list of Object.values(timeline)) {
    const ownerComments: TimelineComment[] = [];
    const userComments: TimelineComment[] = [];
    for (const comment of list) (comment.owner ? ownerComments : userComments).push(comment);
    list.length = 0;
    list.push(...userComments, ...ownerComments);
  }
  return timeline;
};
