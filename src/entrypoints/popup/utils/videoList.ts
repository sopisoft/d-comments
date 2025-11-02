import type { CommentVideoData } from "@/types/comments";

type VideoId = string;

export type VideoDictionary = Record<VideoId, CommentVideoData>;

export type MergeOrder = "append" | "prepend";

export const shouldPreferIncoming = (
  current: CommentVideoData | undefined,
  incoming: CommentVideoData
): boolean => {
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

  incoming.forEach((video) => {
    const id = video.videoData.contentId;
    const current = entries[id];
    if (!prefer(current, video)) return;
    next[id] = video;
    if (!changed && current !== video) {
      changed = true;
    }
  });

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
  if (mergeOrder === "prepend") {
    return [...freshIds, ...order];
  }
  return [...order, ...freshIds];
};

export const buildDisplayVideos = (
  playing: readonly CommentVideoData[],
  entries: VideoDictionary,
  order: readonly VideoId[]
): CommentVideoData[] => {
  const seen = new Set<VideoId>();
  const list: CommentVideoData[] = [];

  playing.forEach((video) => {
    const id = video.videoData.contentId;
    const entry = entries[id] ?? video;
    if (seen.has(id)) return;
    seen.add(id);
    list.push(entry);
  });

  order.forEach((id) => {
    if (seen.has(id)) return;
    const entry = entries[id];
    if (!entry) return;
    seen.add(id);
    list.push(entry);
  });

  return list;
};
