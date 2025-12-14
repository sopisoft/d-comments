import { logger } from "@/lib/logger";
import {
  addPlayingVideo,
  createCommentManager,
  getPlaying,
  getThreads,
  removePlayingVideo,
} from "@/modules/comments/manager";
import type { CommentManager } from "@/modules/comments/types";
import type { Threads } from "@/types/api";
import type { CommentVideoData } from "@/types/comments";

export type CommentStoreSnapshot = {
  videos: CommentVideoData[];
  threads: Threads;
};

const managers = new Map<number, CommentManager>();

const ensureManager = (tabId: number): CommentManager => {
  const existing = managers.get(tabId);
  if (existing) return existing;
  const manager = createCommentManager();
  managers.set(tabId, manager);
  return manager;
};

const storeSnapshot = (manager: CommentManager): CommentStoreSnapshot => ({
  videos: getPlaying(manager),
  threads: getThreads(manager),
});

const updateManager = (tabId: number, update: (manager: CommentManager) => CommentManager): CommentManager => {
  const current = ensureManager(tabId);
  const next = update(current);
  managers.set(tabId, next);
  return next;
};

export const addVideoToStore = async (tabId: number, video: CommentVideoData): Promise<CommentStoreSnapshot> => {
  logger.debug("Adding video to store", {
    tabId,
    id: video.videoData.contentId,
  });
  const next = updateManager(tabId, (manager) => addPlayingVideo(manager, video));
  return storeSnapshot(next);
};

export const removeVideoFromStore = (tabId: number, videoId: string): CommentStoreSnapshot => {
  logger.debug("Removing video from store", { tabId, videoId });
  const next = updateManager(tabId, (manager) => removePlayingVideo(manager, videoId));
  return storeSnapshot(next);
};

export const clearStore = (tabId: number): CommentStoreSnapshot => {
  logger.debug("Clearing store", { tabId });
  const next = updateManager(tabId, (manager) => ({ ...manager, playing: [] }));
  return storeSnapshot(next);
};

export const getStoreSnapshot = (tabId: number): CommentStoreSnapshot => storeSnapshot(ensureManager(tabId));
