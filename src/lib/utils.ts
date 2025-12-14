import type { SnapShotResponse } from "@/entrypoints/background/search";
import type { SuccessfulResponseData, VideoData } from "@/types/api";
import type { CommentVideoData } from "@/types/comments";

const isDAnimeChannel = (channelId: number): boolean => channelId === 2632720;

const isOfficialAnimeChannel = (channelId: number, categoryTags: string): boolean =>
  channelId > 0 && categoryTags.split(" ").includes("アニメ");

export const toVideoData = (snapshot: SnapShotResponse): CommentVideoData["videoData"][] =>
  snapshot.data.map((item) => ({
    contentId: item.contentId ?? "",
    title: item.title ?? "",
    description: item.description ?? "",
    commentCounter: item.commentCounter ?? 0,
    viewCounter: item.viewCounter ?? 0,
    lengthSeconds: item.lengthSeconds ?? 0,
    channelId: item.channelId ?? 0,
    isOfficialAnime: isOfficialAnimeChannel(item.channelId ?? 0, item.categoryTags ?? ""),
    isDAnime: isDAnimeChannel(item.channelId ?? 0),
    thumbnailUrl: item.thumbnailUrl ?? "",
  }));

export const toCommentVideoList = (snapshot: SnapShotResponse): CommentVideoData[] =>
  toVideoData(snapshot).map((v) => ({ date: -1, videoData: v, threads: [] }));

export const toCommentVideoData = (videoData: SuccessfulResponseData<VideoData>): CommentVideoData["videoData"] => {
  const { video, channel } = videoData.response;
  return {
    contentId: video.id,
    title: video.title,
    description: video.description,
    commentCounter: video.count.comment,
    viewCounter: video.count.view,
    lengthSeconds: video.duration,
    isDAnime: isDAnimeChannel(Number(channel?.id)),
    thumbnailUrl: video.thumbnail.url,
  };
};
