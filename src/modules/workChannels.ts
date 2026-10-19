// 作品と通常チャンネルの対応を保存する。
import { type EpisodeIdentity, normalizeText } from './search';
import { DANIME_NICO_CHANNEL_ID, matchEpisodeCandidate, type NicoCandidate } from './videoMatching';

type WorkChannelMapping = { channelId: number };

const storageKey = (workTitle: string): string => `work-channel:${normalizeText(workTitle)}`;

export const getWorkChannel = async (workTitle: string): Promise<WorkChannelMapping | undefined> => {
  const key = storageKey(workTitle);
  const stored = await browser.storage.local.get(key);
  return stored[key] as WorkChannelMapping | undefined;
};

export const resolveWorkChannel = (
  episode: EpisodeIdentity,
  candidates: NicoCandidate[],
  previous?: WorkChannelMapping
): WorkChannelMapping | undefined => {
  const channels = new Set(
    candidates
      .filter((candidate) => {
        if (!candidate.channelId || candidate.channelId === DANIME_NICO_CHANNEL_ID) return false;
        const match = matchEpisodeCandidate(episode, candidate, previous?.channelId);
        return match.compatible && match.sameEpisode && match.workTitle >= 0.8 && match.subtitle >= 0.8;
      })
      .map((candidate) => candidate.channelId!)
  );
  const channelId = channels.size === 1 ? [...channels][0] : undefined;
  return channelId === undefined || channelId === previous?.channelId ? previous : { channelId };
};

export const saveWorkChannel = async (workTitle: string, mapping: WorkChannelMapping): Promise<WorkChannelMapping> => {
  await browser.storage.local.set({ [storageKey(workTitle)]: mapping });
  return mapping;
};
