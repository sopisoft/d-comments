import { getConfig } from "@/config";
import { ok, type Result } from "@/lib/types";
import { toCommentVideoData } from "@/lib/utils";
import type { Threads } from "@/types/api";
import type { CommentVideoData } from "@/types/comments";
import { cloneThread, cloneVideo } from "./helpers";
import { createCommentService } from "./service";
import type { CommentManager, CommentManagerDependencies } from "./types";

type NgEntry = { value: string; enabled: boolean; isRegex?: boolean };

type NgWordRule = {
  raw: string;
  isRegex: boolean;
  regex?: RegExp;
  enabled: boolean;
};

const buildNgWordRules = (items: NgEntry[] | undefined): NgWordRule[] => {
  if (!items) return [];
  return items.map((entry) => {
    const raw = entry.value ?? "";
    const trimmed = raw.trim();
    const enabled = entry.enabled ?? true;
    if (entry.isRegex || trimmed.startsWith("re:")) {
      const body = entry.isRegex ? trimmed : trimmed.slice(3);
      try {
        const m = body.match(/^\/(.*)\/(i?)$/);
        if (m) {
          const r = new RegExp(m[1], m[2] === "i" ? "i" : undefined);
          return { raw, isRegex: true, regex: r, enabled };
        }
        const r = new RegExp(body);
        return { raw, isRegex: true, regex: r, enabled };
      } catch {
        return { raw, isRegex: false, enabled };
      }
    }
    return { raw, isRegex: false, enabled };
  });
};

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

  const ngUserIdsRaw = await getConfig("ng_user_ids");
  const ngWordsRaw = await getConfig("ng_words");
  const ngUserIds = (ngUserIdsRaw ?? [])
    .filter((e) => e.enabled)
    .map((e) => e.value);
  const ngWords = buildNgWordRules(ngWordsRaw ?? []);

  const shouldFilterComment = (c: { body: string; userId?: string }) => {
    if (c.userId && ngUserIds && ngUserIds.includes(c.userId)) return true;
    if (!c.body) return false;
    for (const rule of ngWords) {
      if (!rule.enabled) continue;
      if (rule.isRegex && rule.regex) {
        if (rule.regex.test(c.body)) return true;
      } else {
        if (rule.raw.length === 0) continue;
        if (c.body.toLowerCase().includes(rule.raw.toLowerCase())) return true;
      }
    }
    return false;
  };

  const threads = threadsResponse.value.threads.map((t) => ({
    ...cloneThread(t),
    comments: t.comments.filter((c) => !shouldFilterComment(c)),
  }));

  return ok({
    date: manager.now(),
    videoData: toCommentVideoData(videoInfo.value),
    threads,
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
