import type { SnapShotQuery, SnapShotResponse } from '@/entrypoints/background/search';
import { err, ok, type Result } from '@/lib/types';
import { toVideoData } from '@/lib/utils';
import { type CommentSourcePolicy, selectCommentSources } from './commentSource';
import { buildEpisodeSearchQueries, buildSearchQuery, type EpisodeIdentity } from './search';
import { type NicoCandidate, rankCompatibleCandidates } from './videoMatching';

// 候補が見つかるまで段階的に検索する
export const searchEpisodeCandidates = async (
  episode: EpisodeIdentity,
  search: (query: SnapShotQuery) => Promise<Result<SnapShotResponse, Error>>,
  knownChannelId?: number,
  policy: CommentSourcePolicy = 'official-and-danime'
): Promise<Result<NicoCandidate[], Error>> => {
  const candidates = new Map<string, NicoCandidate>();
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
    for (const candidate of compatible) candidates.set(candidate.contentId, candidate);
    const selected = selectCommentSources([...candidates.values()], policy);
    if (selected.length >= (policy === 'official-and-danime' ? 2 : 1)) {
      return ok([...candidates.values()]);
    }
  }
  return !succeeded && lastError ? err(lastError) : ok([...candidates.values()]);
};
