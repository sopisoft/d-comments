import type {
  SnapShotQuery,
  SnapShotResponse,
} from "@/entrypoints/background/search";
import type {
  NvComment,
  Owner,
  ThreadKeyResponse,
  Threads,
  ThreadsDataResponse,
  VideoData,
} from "@/types/api";
import type { CommentVideoData } from "@/types/comments";

export interface ProtocolMap {
  // Background <-> Content Script
  search(query: SnapShotQuery): Promise<SnapShotResponse>;
  video_data(videoId: string): Promise<VideoData>;
  threads_data(NvComment: NvComment): Promise<ThreadsDataResponse>;
  thread_key(videoId: string): Promise<ThreadKeyResponse>;
  user_data(userId: string): Promise<Owner>;
  channel_data(channelId: string): Promise<Owner>;

  // Comment store coordination (popup/content script <-> background)
  add_video(payload: {
    video: CommentVideoData;
    tabId?: number;
  }): Promise<CommentVideoData[]>;
  remove_video(payload: {
    videoId: string;
    tabId?: number;
  }): Promise<CommentVideoData[]>;
  clear_videos(payload?: { tabId?: number }): Promise<CommentVideoData[]>;
  playing_video(payload?: { tabId?: number }): Promise<CommentVideoData[]>;
  comment_state_update(payload: {
    tabId: number;
    videos: CommentVideoData[];
    threads: Threads;
  }): void;
}

export type MessageType = keyof ProtocolMap;
export type MessagePayload<TType extends MessageType> = Parameters<
  ProtocolMap[TType]
>[0];
export type MessageResponse<TType extends MessageType> =
  | ReturnType<ProtocolMap[TType]>
  | { error: string };
export type Message<TType extends MessageType> = {
  type: TType;
  payload: MessagePayload<TType>;
};

export type MaybePromise<TValue> = TValue | Promise<TValue>;
