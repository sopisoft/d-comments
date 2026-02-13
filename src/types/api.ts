export type ApiSuccess<T> = {
  meta: {
    status: 200;
    id?: string;
  };
  data: T;
};

export type ApiError = {
  meta: {
    status: 500;
    id?: string;
    errorCode?: string;
    errorMessage?: string;
  };
  data: null;
};

export type BaseResponse<T> = ApiSuccess<T> | ApiError;

export type SuccessfulResponseData<T extends BaseResponse<unknown>> = T extends ApiSuccess<infer D> ? D : never;

type Thread = {
  id: number;
  fork: number;
  forkLabel: 'owner' | 'main' | 'easy';
};

export type NvComment = {
  threadKey: string;
  server: string;
  params: {
    language: string; // "ja-jp"
    targets: {
      id: string; // Thread["id"] to stringify
      fork: Thread['forkLabel'];
    }[];
  };
};

export type NvCommentItem = {
  id: string; // 64bit integer
  no: number;
  vposMs: number;
  body: string;
  commands: string[];
  userId: string;
  isPremium: boolean;
  score: number;
  postedAt: string; // ISO8601
  nicoruCount: number;
  nicoruId: string | null; // 自分がニコった場合26文字の大文字か数字で構成される文字列が返る(ULID?) @see https://gist.github.com/otya128/9c7499cf667e75964b43d46c8c567e37
  source: 'leaf' | 'nicoru' | 'trunk';
  isMyPost: boolean;
};

export type Threads = {
  id: Thread['id'];
  fork: Thread['forkLabel'];
  commentCount: number;
  comments: NvCommentItem[];
}[];

export type VideoData = BaseResponse<{
  response: {
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
      layers: {
        index: number;
        isTranslucent: boolean;
        threadIds: Thread[];
      }[];
      threads: {
        id: Thread['id'];
        fork: Thread['fork'];
        forkLabel: Thread['forkLabel'];
        videoId: string; // ContentId
        isOwnerThread: boolean;
        isActive: boolean;
        isDefaultPostTarget: boolean;
        isEasyCommentPostTarget: boolean;
        isLeafRequired: boolean;
        isThreadkeyRequired: boolean;
        threadkey: string;
        is184Forced: boolean;
        hasNicoscript: boolean;
        label: 'owner' | 'default' | 'community' | 'easy' | 'extra-community' | 'extra-easy';
        postKeyStatus: number;
        server: string;
      }[];
      nvComment: NvComment;
    };
    video: {
      id: string; // ContentId
      title: string;
      description: string; // HTML
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
}>;

export type ThreadsDataResponse = BaseResponse<{
  globalComments: [
    {
      id: number;
      count: number;
    },
  ];
  threads: Threads;
}>;

export type ThreadKeyResponse = BaseResponse<{
  threadKey: string;
}>;

export type Owner = {
  ownerId: string;
  ownerName: string;
  ownerIconUrl: string;
};
