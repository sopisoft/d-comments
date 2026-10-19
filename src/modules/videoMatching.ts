import type { CommentVideoData } from '@/types/comments';
import { type EpisodeIdentity, normalizeText } from './search';

export const DANIME_NICO_CHANNEL_ID = 2632720;
export type NicoCandidate = CommentVideoData['videoData'];

export const parseEpisodeNumber = (value: string): number | undefined => {
  const text = normalizeText(value);
  const match = text.match(/(?:#\s*|Episode\s+)(\d+(?:\.\d+)?)(?![\d.])(?:\s*話)?|(?<![\d.])(\d+(?:\.\d+)?)\s*話/i);
  const number = match?.[1] ?? match?.[2] ?? (/^\d+(?:\.\d+)?$/.test(text) ? text : undefined);
  return number === undefined ? undefined : Number(number);
};

const bigrams = (value: string): Set<string> => {
  const text = normalizeText(value).toLowerCase();
  return new Set(Array.from({ length: Math.max(text.length - 1, 0) }, (_, i) => text.slice(i, i + 2)));
};

export const similarity = (a: string, b: string): number => {
  const left = normalizeText(a).toLowerCase();
  const right = normalizeText(b).toLowerCase();
  if (!left || !right) return 0;
  if (left === right) return 1;
  const x = bigrams(left);
  const y = bigrams(right);
  if (!x.size || !y.size) return 0;
  return (2 * [...x].filter((gram) => y.has(gram)).length) / (x.size + y.size);
};

const titleSimilarity = (part: string, title: string): number => {
  const normalized = normalizeText(part);
  const full = normalizeText(title);
  if (!normalized) return 0;
  if (full.includes(normalized)) return 1;
  let best = similarity(normalized, full);
  for (let i = 0; i <= full.length - normalized.length; i++) {
    best = Math.max(best, similarity(normalized, full.slice(i, i + normalized.length)));
  }
  return best;
};

type MatchResult = { compatible: boolean; sameEpisode: boolean; workTitle: number; subtitle: number };

// 作品名・話数・副題などからdアニメとニコニコの動画が同一のエピソードかどうかを判定する
export const matchEpisodeCandidate = (
  episode: EpisodeIdentity,
  candidate: NicoCandidate,
  knownChannelId?: number
): MatchResult => {
  const expected = parseEpisodeNumber(episode.partDispNumber);
  const actual = parseEpisodeNumber(candidate.title);
  const sameEpisode = expected !== undefined && actual !== undefined && expected === actual;
  const conflict = expected !== undefined && actual !== undefined && expected !== actual;
  const workTitle = titleSimilarity(episode.workTitle, candidate.title);
  const subtitle = titleSimilarity(episode.partTitle, candidate.title);
  const knownChannel = candidate.channelId !== DANIME_NICO_CHANNEL_ID && candidate.channelId === knownChannelId ? 1 : 0;
  const workMatches = knownChannel === 1 || workTitle >= 0.8 || (workTitle >= 0.55 && subtitle >= 0.8);
  const episodeMatches = sameEpisode || (subtitle >= 0.8 && normalizeText(episode.partTitle).length >= 4);
  const compatible = !conflict && workMatches && episodeMatches;
  return { compatible, sameEpisode, workTitle, subtitle };
};

export const rankCompatibleCandidates = (
  episode: EpisodeIdentity,
  candidates: Iterable<NicoCandidate>,
  knownChannelId?: number
): NicoCandidate[] =>
  [...candidates]
    .filter((candidate) => matchEpisodeCandidate(episode, candidate, knownChannelId).compatible)
    .sort((a, b) => b.commentCounter - a.commentCounter);
