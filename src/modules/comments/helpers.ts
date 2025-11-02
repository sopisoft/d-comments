import type { NvCommentItem, Threads } from "@/types/api";
import type { CommentVideoData } from "@/types/comments";

export const cloneComment = (comment: NvCommentItem): NvCommentItem => ({
  ...comment,
  commands: [...comment.commands],
});

export const cloneThread = (thread: Threads[number]): Threads[number] => ({
  ...thread,
  comments: thread.comments.map(cloneComment),
});

export const cloneVideo = (video: CommentVideoData): CommentVideoData => ({
  ...video,
  threads: video.threads.map(cloneThread),
});
