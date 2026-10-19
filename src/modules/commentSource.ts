import { DANIME_NICO_CHANNEL_ID, type NicoCandidate } from './videoMatching';

export type CommentSourcePolicy = 'general' | 'official-channel' | 'danime-channel' | 'official-and-danime';

export const matchesCommentSource = (video: { channelId?: number | null }, policy: CommentSourcePolicy): boolean => {
  if (policy === 'general') return true;
  if (policy === 'danime-channel') return video.channelId === DANIME_NICO_CHANNEL_ID;
  if (policy === 'official-channel') return Boolean(video.channelId && video.channelId !== DANIME_NICO_CHANNEL_ID);
  return Boolean(video.channelId);
};

export const selectCommentSources = (candidates: NicoCandidate[], policy: CommentSourcePolicy): NicoCandidate[] => {
  const sorted = candidates
    .filter((candidate) => matchesCommentSource(candidate, policy))
    .sort((a, b) => b.commentCounter - a.commentCounter);
  const selected =
    policy === 'official-and-danime'
      ? [
          sorted.find((candidate) => matchesCommentSource(candidate, 'official-channel')),
          sorted.find((candidate) => matchesCommentSource(candidate, 'danime-channel')),
        ]
      : [sorted[0]];
  return selected.filter((candidate): candidate is NicoCandidate => candidate !== undefined);
};
