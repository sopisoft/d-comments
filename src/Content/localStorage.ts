export type options = { [key: string]: unknown };

/**
 * デフォルト設定
 * @data コメントを表示する: true
 */
export const defaultOptions: options = {
  設定できる項目はありません: true,
  開発場所: "https://github.com/gobosan/d-comments.git",
};

/**
 * Chrome.storage.local に保存されている設定を取得する
 * @returns 設定 { [key: string]: unknown }
 */
export const getAllOptions = () => {
  chrome.storage.local.get(null, (result) => {
    Object.keys(defaultOptions).map((key: string) => {
      if (result[key] === undefined) {
        result[key] = defaultOptions[key];
      }
    });
    Object.keys(result).map((key: string) => {
      if (!(key in defaultOptions)) {
        delete result[key];
        chrome.storage.local.remove(key as string);
      }
    });
    return result;
  });
};

/**
 * Chrome.storage.local の設定を取得する
 * @param key 設定キー { string }
 * @returns 設定値 { unknown }
 */
export const getOption = (key: string) => {
  chrome.storage.local.get(key, (result) => {
    return result[key] ?? defaultOptions[key];
  });
};
