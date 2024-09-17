/*
    This file is part of d-comments.

    d-comments is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    d-comments is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with d-comments.  If not, see <https://www.gnu.org/licenses/>.
*/

type thread = {
  id: number;
  fork: number;
  forkLabel: "owner" | "main" | "easy";
};

declare const VideoIdSymbol: unique symbol;
type VideoId = string & { [VideoIdSymbol]: never };

type SearchResponse = SearchResult | SearchErrorResponse;

type SearchErrorResponse = {
  meta: {
    errorCode: string;
  };
  data: {
    reasonCode: string | undefined;
  };
};

type SearchResult = {
  meta: {
    status: number;
    totalCount: number;
    id: string;
  };
  data: {
    ads: null;
    category: null;
    channel: {
      id: string;
      name: string;
      isOfficialAnime: boolean;
      isDisplayAdBanner: boolean;
      thumbnail: {
        url: string;
        smallUrl: string;
      };
      viewer: {
        follow: {
          isFollowed: boolean;
          isBookmarked: boolean;
          token: string;
          tokenTimestamp: number;
        };
      };
    } | null;
    client: {
      nicosid: string;
      watchId: string;
      watchTrackId: string;
    };
    comment: {
      server: {
        url: string;
      };
      keys: {
        userKey: string;
      };
      layers: [
        {
          index: number;
          isTranslucent: boolean;
          threadIds: thread[];
        }[],
      ];
      threads: [
        {
          id: thread["id"];
          fork: thread["fork"];
          forkLabel: thread["forkLabel"];
          videoId: string; // contentId
          isOwnerThread: boolean;
          label:
            | "owner"
            | "default"
            | "community"
            | "easy"
            | "extra-community"
            | "extra-easy";
          server: string;
        }[],
      ];
      nvComment: {
        threadKey: string;
        server: "https://nv-comment.nicovideo.jp";
        params: {
          targets: [
            {
              id: string; // thread["id"] to stringify
              fork: thread["forkLabel"];
            }[],
          ];
          language: "ja-jp";
        };
      };
    };
    video: {
      id: string; // contentId
      title: string;
      description: string;
      count: {
        view: number;
        comment: number;
        mylist: number;
        like: number;
      };
      duration: number;
      thumbnail: {
        url: string;
        middleUrl: string;
        largeUrl: string;
        player: string;
        ogp: string;
      };
    };
  };
};

type ThreadsData = {
  meta: {
    status: number;
  };
  data: Threads | undefined;
};

type comments_json = {
  version: 1;
  movieData: SearchResult;
  threadData: ThreadsData;
};

type Threads = {
  globalComments: [
    {
      id: string; // thread["id"] to stringify
      count: number;
    },
  ];
  threads: {
    id: string; // thread["id"] to stringify
    fork: thread["forkLabel"];
    commentCount: number;
    comments: nv_comment[];
  }[];
};

type nv_comment = {
  id: string; // 64bit integer
  no: 1;
  vposMs: number;
  body: string;
  commands: string[];
  userId: string;
  isPremium: boolean;
  score: 0;
  postedAt: string; // ISO8601
  nicoruCount: number;
  nicoruId: string | null; // 自分がニコった場合26文字の大文字か数字で構成される文字列が返る(ULID?) @see https://gist.github.com/otya128/9c7499cf667e75964b43d46c8c567e37
  source: "leaf" | "nicoru" | "trunk";
  isMyPost: boolean;
};

type Snapshot = {
  meta: {
    status: 200 | 400 | 500 | 503;
    totalCount: number; // ヒット件数
    id: string; // リクエストID
  };
  data: [
    {
      contentId: VideoId; // コンテンツID。https://nico.ms/ の後に連結することでコンテンツへのURLになります。
      title: string | null; // タイトル
      description: string | null; // 説明文
      userId: string | null; // ユーザー投稿動画の場合、投稿者のユーザーID
      channelId: string | null; // チャンネル動画の場合、チャンネルID
      viewCounter: number | null; // 再生数
      mylistCounter: number | null; // マイリスト数またはお気に入り数。
      likeCounter: number | null; // いいね！数
      lengthSeconds: number | null; // 再生時間(秒)
      thumbnailUrl: string | null; // サムネイルのURL
      startTime: string | null; // コンテンツの投稿時間。
      lastResBody: string | null; // 最新のコメント
      commentCounter: number | null; // コメント数
      lastCommentTime: string | null; // 最終コメント時間
      categoryTags: string | null; // カテゴリタグ
      tags: string | null; // タグ(空白区切り)
      tagsExact: string | null; // タグ完全一臇(空白区切り)
      genre: string | null; // ジャンル
    },
  ];
};

type Owner = {
  ownerId: string;
  ownerName: string;
  ownerIconUrl: string;
};
