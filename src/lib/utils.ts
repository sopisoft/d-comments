import type { SnapShotResponse } from "@/entrypoints/background/search";
import type {
  CommentVideoData,
  SuccessfulResponseData,
  VideoData,
} from "@/types/";

function isDAnimeChannel(channelId: number): boolean {
  return Number(channelId) === 2632720;
}

function isOfficialAnimeChannel(
  channelId: number,
  categoryTags: string
): boolean {
  if (!channelId) return false;
  const tags = categoryTags.split(" ");
  return tags.includes("アニメ");
}

export function toVideoData(
  snapshot: SnapShotResponse
): CommentVideoData["videoData"][] {
  return snapshot.data.map((item) => ({
    contentId: item.contentId ?? "",
    title: item.title ?? "",
    description: item.description ?? "",
    commentCounter: item.commentCounter ?? 0,
    viewCounter: item.viewCounter ?? 0,
    lengthSeconds: item.lengthSeconds ?? 0,
    channelId: item.channelId ?? 0,
    isOfficialAnime: isOfficialAnimeChannel(
      item.channelId ?? 0,
      item.categoryTags ?? ""
    ),
    isDAnime: isDAnimeChannel(item.channelId ?? 0),
    thumbnailUrl: item.thumbnailUrl ?? "",
  }));
}

export function toCommentVideoData(
  videoData: SuccessfulResponseData<VideoData>
): CommentVideoData["videoData"] {
  const res = videoData.response;
  const video = res.video;
  const mvd: CommentVideoData["videoData"] = {
    contentId: video.id,
    title: video.title,
    description: video.description,
    commentCounter: video.count.comment,
    viewCounter: video.count.view,
    lengthSeconds: video.duration,
    isDAnime: isDAnimeChannel(Number(res.channel?.id)),
    thumbnailUrl: video.thumbnail.url,
  };
  return mvd;
}
