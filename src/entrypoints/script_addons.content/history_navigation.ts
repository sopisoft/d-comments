import type { ContentScriptContext } from 'wxt/utils/content-script-context';

/**
 * Dアニメは通常タブでの視聴時、ブラウザの戻る/進む(popstate)で動画プレイヤーを
 * URLに追従させないため、動画とコメント・タイトルがズレる。
 * 視聴ページで履歴移動を検知したらページをリロードし、再生中の動画をURLに一致させる。
 *
 * 話数切替はdアニメ内部ではpushStateで行われ popstate は発火しないため通常操作には
 * 干渉せず、reload は popstate を発火させないため無限ループにもならない。
 * popstate は戻る/進むが存在する環境でしか飛ばないため常時有効で安全。
 */
export const reload_on_history_navigation = (ctx: ContentScriptContext): void => {
  ctx.addEventListener(window, 'popstate', () => {
    if (window.location.href.includes('/animestore/sc_d_pc?partId=')) {
      window.location.reload();
    }
  });
};
