import { getConfig } from "@/config/storage";

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
  "genre.keyword": string; // ジャンル完全一致
};

type Targets = keyof Pick<Fields, "title" | "description" | "tags" | "tagsExact">;

type fields = keyof Omit<Fields, "tagsExact" | "genre.keyword">;

export type _sort = keyof Pick<
  Fields,
  "viewCounter" | "mylistCounter" | "likeCounter" | "lengthSeconds" | "startTime" | "commentCounter" | "lastCommentTime"
>;

type Filters = keyof Omit<Fields, "title" | "description" | "userId" | "channelId" | "thumbnailUrl" | "lastResBody">;

type FiltersQuery = {
  key: Filters;
  /**
   * operator は以下のいずれかを指定します
   * gte は以上、gt はより大きい、lte は以下、lt はより小さい
   * number は等しい, 同一 field に複数値を指定する場合は number を increnment してください
   */
  operator: "gte" | "gt" | "lte" | "lt" | "not" | number;
  /**
   * value の type は field によって変わります
   */
  value: Fields[Filters];
};

type JsonFilter =
  | {
      type: "equal";
      field: Filters;
      value: Fields[Filters];
    }
  | {
      type: "range";
      field: Filters;
      from: Fields[Filters];
      to: Fields[Filters];
      include_lower?: boolean; // from の値を含めるか
      include_upper?: boolean; // to の値を含めるか
    }
  | {
      type: "or" | "and";
      filters: JsonFilter[];
    }
  | {
      type: "not";
      filter: JsonFilter;
    };

export interface SnapShotQuery {
  q: string; // 検索クエリ
  targets: Targets[]; // 検索対象のフィールド
  fields?: fields[]; // レスポンスに含めるフィールド
  filters?: FiltersQuery[]; // フィルター
  jsonFilter?: JsonFilter; // フィルター
  _sort: `${"+" | "-"}${_sort}`; //  ソートの方向は昇順または降順かを'+'か'-'で指定します
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
    errorCode?: "QUERY_PARSE_ERROR" | "INTERNAL_SERVER_ERROR" | "MAINTENANCE";
    errorMessage?: string;
    totalCount?: number;
    id?: string;
  };
  data: Marge<Nullable<Fields>, { contentId: string }>[];
};

const buildSearchUrl = (query: SnapShotQuery): URL => {
  const url = new URL("https://snapshot.search.nicovideo.jp/api/v2/snapshot/video/contents/search");
  const { searchParams } = url;
  searchParams.set("q", query.q);
  searchParams.set("targets", query.targets.join(","));
  if (query.fields) searchParams.set("fields", query.fields.join(","));
  query.filters?.forEach((f) => {
    if (f.operator === "not") {
      const v = f.value.toString();
      searchParams.set(`filters[-${f.key}][0]`, v);
      searchParams.set(`filters[${f.key}][${f.operator}]`, v);
    }
  });
  if (query.jsonFilter) searchParams.set("jsonFilter", JSON.stringify(query.jsonFilter));
  if (query._sort) searchParams.set("_sort", query._sort);
  if (query._offset) searchParams.set("_offset", `${Number(query._offset)}`);
  if (query._limit) searchParams.set("_limit", `${query._limit}`);
  searchParams.set("_context", query._context || "d-comments");
  return url;
};

const emptyResponse = (message?: string): SnapShotResponse => ({
  meta: {
    status: 500,
    errorCode: "INTERNAL_SERVER_ERROR",
    errorMessage: message,
  },
  data: [],
});

export const search = async (query: SnapShotQuery): Promise<SnapShotResponse> =>
  fetch(buildSearchUrl(query))
    .then((res) => res.json() as Promise<SnapShotResponse>)
    .then(async (res) => {
      if (await getConfig("channels_only")) res.data = res.data.filter((v) => v.channelId !== null);
      return res;
    })
    .catch((error: unknown) => emptyResponse(error instanceof Error ? error.message : undefined));
