import type { SnapShotQuery, SnapShotResponse } from '@/entrypoints/background/search';
import type { Result } from '@/lib/types';
import type { NvComment, Owner, ThreadKeyResponse, Threads, ThreadsDataResponse, VideoData } from '@/types/api';
import type { CommentVideoData } from '@/types/comments';

export interface ProtocolMap {
  // Background <-> Content Script (handlers return Result to avoid throwing)
  search(query: SnapShotQuery): Promise<Result<SnapShotResponse, Error>>;
  video_data(videoId: string): Promise<Result<VideoData, Error>>;
  threads_data(NvComment: NvComment): Promise<Result<ThreadsDataResponse, Error>>;
  thread_key(videoId: string): Promise<Result<ThreadKeyResponse, Error>>;
  user_data(userId: string): Promise<Result<Owner, Error>>;
  channel_data(channelId: string): Promise<Result<Owner, Error>>;

  // Comment store coordination (popup/content script <-> background)
  add_video(payload: { video: CommentVideoData; tabId?: number }): Promise<Result<CommentVideoData[], Error>>;
  remove_video(payload: { videoId: string; tabId?: number }): Promise<Result<CommentVideoData[], Error>>;
  clear_videos(payload?: { tabId?: number }): Promise<Result<CommentVideoData[], Error>>;
  playing_video(payload?: { tabId?: number }): Promise<Result<CommentVideoData[], Error>>;
  comment_state_update(payload: { tabId: number; videos: CommentVideoData[]; threads: Threads }): void;
}

export type MessageType = keyof ProtocolMap;
export type MessagePayload<TType extends MessageType> = Parameters<ProtocolMap[TType]>[0];
export type MessageResponse<TType extends MessageType> = ReturnType<ProtocolMap[TType]>;
export type Message<TType extends MessageType> = {
  type: TType;
  payload: MessagePayload<TType>;
};

export type MaybePromise<TValue> = TValue | Promise<TValue>;
