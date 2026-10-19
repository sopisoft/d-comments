import type { SnapShotQuery } from '@/entrypoints/background/search';

export const normalizeText = (value: string): string => value.normalize('NFKC').replace(/\s+/g, ' ').trim();

export type EpisodeIdentity = {
  workTitle: string;
  partDispNumber: string;
  partTitle: string;
};

export const buildEpisodeSearchQueries = (episode: EpisodeIdentity): string[] => {
  const queries = [episode.workTitle, `${episode.workTitle} ${episode.partDispNumber}`];
  if (episode.partTitle.trim()) queries.push(episode.partTitle, `${episode.partDispNumber} ${episode.partTitle}`);
  return [...new Set(queries.map(normalizeText).filter(Boolean))];
};

export function buildSearchQuery(word: string, sort: SnapShotQuery['_sort'] = '-commentCounter'): SnapShotQuery {
  return {
    _limit: 50,
    _sort: sort,
    fields: [
      'contentId',
      'title',
      'description',
      'tags',
      'genre',
      'categoryTags',
      'commentCounter',
      'viewCounter',
      'startTime',
      'lengthSeconds',
      'channelId',
      'userId',
      'thumbnailUrl',
    ],
    q: normalizeText(word),
    targets: ['title', 'description'],
  };
}
