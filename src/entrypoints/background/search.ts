import { getConfig } from '@/config/storage';
import { err, ok, type Result, toError } from '@/lib/types';

type Integer = number;
type Fields = {
  contentId: string;
  title: string;
  description: string;
  userId: Integer;
  channelId: Integer;
  viewCounter: Integer;
  mylistCounter: Integer; // マイリスト数またはお気に入り数
  likeCounter: Integer;
  lengthSeconds: Integer;
  thumbnailUrl: string;
  startTime: string; // コンテンツの投稿時間 (ISO 8601)
  lastResBody: string;
  commentCounter: Integer;
  lastCommentTime: string; // 最新コメントの投稿時間 (ISO 8601)
  categoryTags: string; // カテゴリータグ (空白区切り)
  tags: string; // タグ (空白区切り)
  tagsExact: string[]; // タグ完全一致
  genre: string;
  'genre.keyword': string; // ジャンル完全一致
};

type Targets = keyof Pick<Fields, 'title' | 'description' | 'tags' | 'tagsExact'>;

type fields = keyof Omit<Fields, 'tagsExact' | 'genre.keyword'>;

export type _sort = keyof Pick<
  Fields,
  'viewCounter' | 'mylistCounter' | 'likeCounter' | 'lengthSeconds' | 'startTime' | 'commentCounter' | 'lastCommentTime'
>;

type Filters = keyof Omit<Fields, 'title' | 'description' | 'userId' | 'channelId' | 'thumbnailUrl' | 'lastResBody'>;

type FiltersQuery = {
  key: Filters;
  /**
   * Operator は以下のいずれかを指定します
   * gte は以上、gt はより大きい、lte は以下、lt はより小さい
   * number は等しい, 同一 field に複数値を指定する場合は number を increnment してください
   */
  operator: 'gte' | 'gt' | 'lte' | 'lt' | 'not' | number;
  /**
   * Value の type は field によって変わります
   */
  value: Fields[Filters];
};

type JsonFilter =
  | { type: 'equal'; field: Filters; value: Fields[Filters] }
  | {
      type: 'range';
      field: Filters;
      from: Fields[Filters];
      to: Fields[Filters];
      include_lower?: boolean; // From の値を含めるか
      include_upper?: boolean; // To の値を含めるか
    }
  | { type: 'or' | 'and'; filters: JsonFilter[] }
  | { type: 'not'; filter: JsonFilter };

export interface SnapShotQuery {
  q: string; // 検索クエリ
  targets: Targets[]; // 検索対象のフィールド
  fields?: fields[]; // レスポンスに含めるフィールド
  filters?: FiltersQuery[]; // フィルター
  jsonFilter?: JsonFilter; // フィルター
  _sort: `${'+' | '-'}${_sort}`; //  ソートの方向は昇順または降順かを'+'か'-'で指定します
  _offset?: number; // オフセット
  _limit?: number; // 取得件数 (最大100)
  _context?: string; // 最大40文字
}

type Nullable<T> = { [P in keyof T]: T[P] | null };
type Marge<T, U> = {
  [P in keyof T | keyof U]: P extends keyof T ? T[P] : P extends keyof U ? U[P] : never;
};

export type SnapShotResponse = {
  meta: {
    status: 200 | 400 | 500 | 503;
    errorCode?: 'QUERY_PARSE_ERROR' | 'INTERNAL_SERVER_ERROR' | 'MAINTENANCE';
    errorMessage?: string;
    totalCount?: number;
    id?: string;
  };
  data: Marge<Nullable<Fields>, { contentId: string }>[];
};

type VideoSearchItem = {
  id: string;
  title: string;
  registeredAt: string;
  count: { view: number; comment: number; mylist: number; like: number };
  thumbnail: { url: string };
  duration: number;
  shortDescription: string;
  isChannelVideo: boolean;
  owner?: { type?: string; id?: string };
};

type VideoSearchResponse = {
  meta: { status: number; errorMessage?: string };
  data: {
    totalCount: number;
    hasNext: boolean;
    genres?: { key: string; label: string }[];
    items: VideoSearchItem[];
    additionals?: { tags?: { text: string }[] };
  };
};

const sortKeyByField: Record<_sort, string> = {
  viewCounter: 'viewCount',
  mylistCounter: 'mylistCount',
  likeCounter: 'likeCount',
  lengthSeconds: 'duration',
  startTime: 'registeredAt',
  commentCounter: 'commentCount',
  lastCommentTime: 'lastCommentTime',
};

const buildSearchUrl = (query: SnapShotQuery): URL => {
  const url = new URL('https://nvapi.nicovideo.jp/v2/search/video');
  const { searchParams } = url;
  searchParams.set('keyword', query.q);
  searchParams.set('pageSize', `${Math.min(query._limit ?? 50, 100)}`);
  searchParams.set('page', `${Math.floor((query._offset ?? 0) / (query._limit ?? 50)) + 1}`);
  searchParams.set('sortKey', sortKeyByField[query._sort.slice(1) as _sort]);
  searchParams.set('sortOrder', query._sort.startsWith('+') ? 'asc' : 'desc');
  return url;
};

const buildSnapshotSearchUrl = (query: SnapShotQuery): URL => {
  const url = new URL('https://snapshot.search.nicovideo.jp/api/v2/snapshot/video/contents/search');
  const { searchParams } = url;
  searchParams.set('q', query.q);
  searchParams.set('targets', query.targets.join(','));
  if (query.fields) searchParams.set('fields', query.fields.join(','));
  query.filters?.forEach((f) => {
    if (f.operator === 'not') {
      const v = f.value.toString();
      searchParams.set(`filters[-${f.key}][0]`, v);
      searchParams.set(`filters[${f.key}][${f.operator}]`, v);
    }
  });
  if (query.jsonFilter) searchParams.set('jsonFilter', JSON.stringify(query.jsonFilter));
  if (query._sort) searchParams.set('_sort', query._sort);
  if (query._offset) searchParams.set('_offset', `${Number(query._offset)}`);
  if (query._limit) searchParams.set('_limit', `${query._limit}`);
  searchParams.set('_context', query._context || 'd-comments');
  return url;
};

const toSnapshotResponse = (response: VideoSearchResponse): SnapShotResponse => {
  const genres = response.data.genres?.map((genre) => genre.label).join(' ') ?? '';
  const tags = response.data.additionals?.tags?.map((tag) => tag.text) ?? [];
  return {
    meta: { status: response.meta.status === 200 ? 200 : 500, totalCount: response.data.totalCount },
    data: response.data.items.map((item) => {
      const channelId = item.isChannelVideo ? Number(item.owner?.id?.replace(/^ch/, '')) : null;
      const userId = item.isChannelVideo ? null : Number(item.owner?.id);
      return {
        contentId: item.id,
        title: item.title,
        description: item.shortDescription,
        userId: Number.isFinite(userId) ? userId : null,
        channelId: Number.isFinite(channelId) ? channelId : null,
        viewCounter: item.count.view,
        mylistCounter: item.count.mylist,
        likeCounter: item.count.like,
        lengthSeconds: item.duration,
        thumbnailUrl: item.thumbnail.url,
        startTime: item.registeredAt,
        lastResBody: null,
        commentCounter: item.count.comment,
        lastCommentTime: null,
        categoryTags: genres,
        tags: tags.join(' '),
        tagsExact: tags,
        genre: response.data.genres?.[0]?.key ?? null,
        'genre.keyword': response.data.genres?.[0]?.key ?? null,
      };
    }),
  };
};

const fetchNvapiSearch = async (query: SnapShotQuery): Promise<Result<SnapShotResponse, Error>> => {
  try {
    const response = await fetch(buildSearchUrl(query), {
      headers: { 'x-frontend-id': '6', 'x-frontend-version': '0' },
    });
    if (!response.ok) return err(toError(`HTTP error: ${response.status}`));

    const json = (await response.json()) as VideoSearchResponse;
    if (json.meta.status !== 200) return err(toError(json.meta.errorMessage ?? 'Video search failed'));

    return ok(toSnapshotResponse(json));
  } catch (error) {
    return err(toError(error));
  }
};

const fetchSnapshotSearch = async (query: SnapShotQuery): Promise<Result<SnapShotResponse, Error>> => {
  try {
    const response = await fetch(buildSnapshotSearchUrl(query));
    if (!response.ok) return err(toError(`HTTP error: ${response.status}`));

    const json = (await response.json()) as SnapShotResponse;
    if (json.meta.status !== 200) return err(toError(json.meta.errorMessage ?? 'Snapshot search failed'));
    return ok(json);
  } catch (error) {
    return err(toError(error));
  }
};

export const search = async (query: SnapShotQuery): Promise<Result<SnapShotResponse, Error>> => {
  const nvapiResult = await fetchNvapiSearch(query);
  const result = nvapiResult.ok ? nvapiResult : await fetchSnapshotSearch(query);
  if (!result.ok) {
    const message = nvapiResult.ok
      ? result.error.message
      : `NVAPI search failed: ${nvapiResult.error.message}; Snapshot fallback failed: ${result.error.message}`;
    return err(toError(message));
  }

  const response = result.value;
  if (await getConfig('channels_only')) response.data = response.data.filter((item) => item.channelId !== null);
  return ok(response);
};
