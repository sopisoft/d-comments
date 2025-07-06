export function isError<T>(value: T | Error): value is Error {
  return value instanceof Error;
}

import type { SnapShotResponse } from "@/entrypoints/background/search";
import type { MinimalVideoData } from "@/entrypoints/popup/types/fetch";
import type { SuccessfulResponseData, VideoData } from "@/types/nico_api_type";

function isDAnime(channelId: number): boolean {
  return Number(channelId) === 2632720;
}

function isOfficialChannel(channelId: number, categoryTags: string): boolean {
  if (!channelId) return false;
  const tags = categoryTags.split(" ");
  if (tags.includes("アニメ")) {
    return true;
  }
  return false;
}

export function snapshotToMinimalVideoData(
  snapshot: SnapShotResponse
): MinimalVideoData[] {
  const videos: MinimalVideoData[] = [];
  snapshot.data.forEach((item) => {
    videos.push({
      contentId: item.contentId ?? "",
      title: item.title ?? "",
      description: item.description ?? "",
      commentCounter: item.commentCounter ?? 0,
      viewCounter: item.viewCounter ?? 0,
      lengthSeconds: item.lengthSeconds ?? 0,
      channelId: item.channelId ?? 0,
      isOfficialAnime: isOfficialChannel(
        item.channelId ?? 0,
        item.categoryTags ?? ""
      ),
      isDAnime: isDAnime(item.channelId ?? 0),
      thumbnailUrl: item.thumbnailUrl ?? "",
    });
  });
  return videos;
}

export function videoDataToMinimalVideoData(
  videoData: SuccessfulResponseData<VideoData>
): MinimalVideoData {
  const res = videoData.response;
  const video = res.video;
  const mvd: MinimalVideoData = {
    contentId: video.id,
    title: video.title,
    description: video.description,
    commentCounter: video.count.comment,
    viewCounter: video.count.view,
    lengthSeconds: video.duration,
    isDAnime: isDAnime(Number(res.channel?.id)),
    thumbnailUrl: video.thumbnail.url,
  };
  return mvd;
}
