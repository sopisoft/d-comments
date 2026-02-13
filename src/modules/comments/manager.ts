import { getConfig } from '@/config/storage';
import { ok, type Result } from '@/lib/types';
import { toCommentVideoData } from '@/lib/utils';
import type { NvCommentItem, Threads } from '@/types/api';
import type { CommentVideoData } from '@/types/comments';
import { createNgFilter, normalizeNgList } from './ngFilters';
import { createCommentService } from './service';
import type { CommentManager, CommentManagerDependencies } from './types';

const clone = <T>(value: T): T => structuredClone(value);

const filterThreadComments = (threads: Threads, shouldFilterComment: (comment: NvCommentItem) => boolean): Threads =>
  threads.map((thread) => ({
    ...thread,
    comments: thread.comments.filter((comment) => !shouldFilterComment(comment)).map(clone),
  }));

export const createCommentManager = (deps: CommentManagerDependencies = {}): CommentManager => ({
  now: deps.now ?? (() => Date.now()),
  playing: [],
  service: deps.service ?? createCommentService(),
});

export const getComments = async (
  manager: CommentManager,
  videoId: string
): Promise<Result<CommentVideoData, Error>> => {
  const videoInfo = await manager.service.fetchVideoInfo(videoId);
  if (!videoInfo.ok) return videoInfo;

  const threadsResponse = await manager.service.fetchComments(videoInfo.value.response.comment.nvComment);
  if (!threadsResponse.ok) return threadsResponse;

  const shouldFilterComment = createNgFilter({
    userEntries: normalizeNgList(await getConfig('ng_user_ids')),
    wordEntries: normalizeNgList(await getConfig('ng_words')),
  });

  const threads = filterThreadComments(threadsResponse.value.threads, shouldFilterComment);

  return ok({
    date: manager.now(),
    threads,
    videoData: toCommentVideoData(videoInfo.value),
  });
};

export const getPlaying = (manager: CommentManager): CommentVideoData[] => manager.playing.map(clone);

export const getThreads = (manager: CommentManager): Threads =>
  manager.playing.flatMap((video) => video.threads.map(clone));

export const addPlayingVideo = (manager: CommentManager, video: CommentVideoData): CommentManager => {
  const updated = clone({ ...video, date: manager.now() });
  const index = manager.playing.findIndex((item) => item.videoData.contentId === updated.videoData.contentId);
  if (index >= 0) {
    const copy = [...manager.playing];
    copy[index] = updated;
    return { ...manager, playing: copy };
  }
  return { ...manager, playing: [...manager.playing, updated] };
};

export const removePlayingVideo = (manager: CommentManager, videoId: string): CommentManager => ({
  ...manager,
  playing: manager.playing.filter((video) => video.videoData.contentId !== videoId),
});

export const clearPlayingVideos = (manager: CommentManager): CommentManager => ({
  ...manager,
  playing: [],
});

export const sortComments = (list: readonly NvCommentItem[]): NvCommentItem[] =>
  [...list].sort((a, b) => a.vposMs - b.vposMs);

export const flattenComments = (threads: Threads, forks: readonly string[]): NvCommentItem[] => {
  const targets = new Set(forks);
  return threads.filter((thread) => targets.has(thread.fork)).flatMap((thread) => thread.comments.map(clone));
};
