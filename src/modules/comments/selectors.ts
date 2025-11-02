import type { NvCommentItem, Threads } from "@/types/api";
import { cloneComment } from "./helpers";

export const sortComments = (list: readonly NvCommentItem[]): NvCommentItem[] =>
  [...list].sort((a, b) => a.vposMs - b.vposMs);

export const flattenComments = (
  threads: Threads,
  forks: readonly string[]
): NvCommentItem[] => {
  const targets = new Set(forks);
  return threads
    .filter((thread) => targets.has(thread.fork))
    .flatMap((thread) => thread.comments.map(cloneComment));
};
