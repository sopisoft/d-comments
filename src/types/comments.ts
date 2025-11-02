import type { Threads } from "./api";

type VideoData = {
  contentId: string;
  title: string;
  description: string;
  commentCounter: number;
  viewCounter: number;
  lengthSeconds: number;
  channelId?: number;
  isOfficialAnime?: boolean;
  isDAnime: boolean;
  thumbnailUrl: string;
};

export type CommentVideoData = {
  date: number;
  videoData: VideoData;
  threads: Threads;
};
