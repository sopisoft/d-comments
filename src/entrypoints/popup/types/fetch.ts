import type {
  SnapShotQuery,
  SnapShotResponse,
} from "@/entrypoints/background/search";

export type SnapshotStorage = {
  date: number;
  query_string: string;
  query: SnapShotQuery;
  with_auth: boolean;
  result: SnapShotResponse;
};

export type MinimalVideoData = {
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
