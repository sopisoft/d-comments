import type { CommentVideoData } from '@/types/comments';

type VideoId = string;

export type VideoDictionary = Record<VideoId, CommentVideoData>;

export type MergeOrder = 'append' | 'prepend';

export const shouldPreferIncoming = (current: CommentVideoData | undefined, incoming: CommentVideoData): boolean => {
  if (!current) return true;
  const incomingHasThreads = incoming.threads.length > 0;
  if (!incomingHasThreads) return false;
  const currentHasThreads = current.threads.length > 0;
  if (!currentHasThreads) return true;
  return incoming.date > current.date;
};

export const mergeVideoEntries = (
  entries: VideoDictionary,
  incoming: readonly CommentVideoData[],
  prefer = shouldPreferIncoming
): VideoDictionary => {
  let changed = false;
  const next: VideoDictionary = { ...entries };

  for (const video of incoming) {
    const id = video.videoData.contentId;
    const current = entries[id];
    if (!prefer(current, video)) continue;
    next[id] = video;
    if (!changed && current !== video) changed = true;
  }

  return changed ? next : entries;
};

export const mergeVideoOrder = (
  order: readonly VideoId[],
  incomingIds: readonly VideoId[],
  mergeOrder: MergeOrder
): VideoId[] => {
  const seen = new Set(order);
  const freshIds = incomingIds.filter((id) => !seen.has(id));
  if (freshIds.length === 0) return order as VideoId[];
  return mergeOrder === 'prepend' ? [...freshIds, ...order] : [...order, ...freshIds];
};

export const buildDisplayVideos = (
  playing: readonly CommentVideoData[],
  entries: VideoDictionary,
  order: readonly VideoId[]
): CommentVideoData[] => {
  const seen = new Set<VideoId>();
  const list: CommentVideoData[] = [];

  for (const video of playing) {
    const id = video.videoData.contentId;
    if (seen.has(id)) continue;
    seen.add(id);
    list.push(entries[id] ?? video);
  }

  for (const id of order) {
    if (seen.has(id)) continue;
    const entry = entries[id];
    if (!entry) continue;
    seen.add(id);
    list.push(entry);
  }

  return list;
};
