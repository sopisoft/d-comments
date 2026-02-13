import type { SnapShotResponse } from '@/entrypoints/background/search';
import type { SuccessfulResponseData, VideoData } from '@/types/api';
import type { CommentVideoData } from '@/types/comments';

const isDAnimeChannel = (channelId: number): boolean => channelId === 2632720;

const isOfficialAnimeChannel = (channelId: number, categoryTags: string): boolean =>
  channelId > 0 && categoryTags.split(' ').includes('アニメ');

export const toVideoData = (snapshot: SnapShotResponse): CommentVideoData['videoData'][] =>
  snapshot.data.map((item) => ({
    channelId: item.channelId ?? 0,
    commentCounter: item.commentCounter ?? 0,
    contentId: item.contentId ?? '',
    description: item.description ?? '',
    isDAnime: isDAnimeChannel(item.channelId ?? 0),
    isOfficialAnime: isOfficialAnimeChannel(item.channelId ?? 0, item.categoryTags ?? ''),
    lengthSeconds: item.lengthSeconds ?? 0,
    thumbnailUrl: item.thumbnailUrl ?? '',
    title: item.title ?? '',
    viewCounter: item.viewCounter ?? 0,
  }));

export const toCommentVideoList = (snapshot: SnapShotResponse): CommentVideoData[] =>
  toVideoData(snapshot).map((v) => ({ date: -1, threads: [], videoData: v }));

export const toCommentVideoData = (videoData: SuccessfulResponseData<VideoData>): CommentVideoData['videoData'] => {
  const { video, channel } = videoData.response;
  return {
    commentCounter: video.count.comment,
    contentId: video.id,
    description: video.description,
    isDAnime: isDAnimeChannel(Number(channel?.id)),
    lengthSeconds: video.duration,
    thumbnailUrl: video.thumbnail.url,
    title: video.title,
    viewCounter: video.count.view,
  };
};
