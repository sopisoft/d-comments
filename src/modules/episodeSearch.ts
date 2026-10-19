import type { SnapShotQuery, SnapShotResponse } from '@/entrypoints/background/search';
import { err, ok, type Result } from '@/lib/types';
import { toVideoData } from '@/lib/utils';
import { buildEpisodeSearchQueries, buildSearchQuery, type EpisodeIdentity } from './search';
import { type NicoCandidate, rankCompatibleCandidates } from './videoMatching';

// 候補が見つかるまで段階的に検索する
export const searchEpisodeCandidates = async (
  episode: EpisodeIdentity,
  search: (query: SnapShotQuery) => Promise<Result<SnapShotResponse, Error>>,
  knownChannelId?: number
): Promise<Result<NicoCandidate[], Error>> => {
  let lastError: Error | undefined;
  let succeeded = false;
  for (const query of buildEpisodeSearchQueries(episode)) {
    const result = await search(buildSearchQuery(query));
    if (!result.ok) {
      lastError = result.error;
      continue;
    }
    succeeded = true;
    const compatible = rankCompatibleCandidates(episode, toVideoData(result.value), knownChannelId);
    if (compatible.length) return ok(compatible);
  }
  return !succeeded && lastError ? err(lastError) : ok([]);
};
