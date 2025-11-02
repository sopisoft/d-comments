import { ok, type Result } from "@/lib/types";
import { toCommentVideoData } from "@/lib/utils";
import type { Threads } from "@/types/api";
import type { CommentVideoData } from "@/types/comments";
import { cloneThread, cloneVideo } from "./helpers";
import { createCommentService } from "./service";
import type { CommentManager, CommentManagerDependencies } from "./types";

export const createCommentManager = (
  deps: CommentManagerDependencies = {}
): CommentManager => ({
  service: deps.service ?? createCommentService(),
  now: deps.now ?? (() => Date.now()),
  playing: [],
});

export const getComments = async (
  manager: CommentManager,
  videoId: string
): Promise<Result<CommentVideoData, Error>> => {
  const videoInfo = await manager.service.fetchVideoInfo(videoId);
  if (!videoInfo.ok) return videoInfo;

  const threadsResponse = await manager.service.fetchComments(
    videoInfo.value.response.comment.nvComment
  );
  if (!threadsResponse.ok) return threadsResponse;

  return ok({
    date: manager.now(),
    videoData: toCommentVideoData(videoInfo.value),
    threads: threadsResponse.value.threads.map(cloneThread),
  });
};

export const getPlaying = (manager: CommentManager): CommentVideoData[] =>
  manager.playing.map(cloneVideo);

export const getThreads = (manager: CommentManager): Threads =>
  manager.playing.flatMap((video) => video.threads.map(cloneThread));

export const addPlayingVideo = (
  manager: CommentManager,
  video: CommentVideoData
): CommentManager => {
  const updated = cloneVideo({ ...video, date: manager.now() });
  const index = manager.playing.findIndex(
    (item) => item.videoData.contentId === updated.videoData.contentId
  );
  if (index >= 0) {
    const copy = [...manager.playing];
    copy[index] = updated;
    return { ...manager, playing: copy };
  }
  return { ...manager, playing: [...manager.playing, updated] };
};

export const removePlayingVideo = (
  manager: CommentManager,
  videoId: string
): CommentManager => ({
  ...manager,
  playing: manager.playing.filter(
    (video) => video.videoData.contentId !== videoId
  ),
});

export const clearPlayingVideos = (
  manager: CommentManager
): CommentManager => ({
  ...manager,
  playing: [],
});
