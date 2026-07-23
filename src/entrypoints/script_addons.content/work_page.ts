import { getConfig } from '@/config/storage';
import { findElements } from '@/lib/dom';
import { logger } from '@/lib/logger';

/**
 * 作品ページの各パートに再生リンクを追加する
 */
export const add_button_to_play = async (): Promise<void> => {
  logger.debug('addon_addMenu');
  const playInSameTab = await getConfig('addon_option_play_in_same_tab');

  const aArray = await findElements('section.clearfix > a');
  for (const item of aArray) {
    const partId = item?.getAttribute('href')?.replace(/[^0-9]/g, '');
    if (!partId) continue;

    const bgColor = window.getComputedStyle(item).backgroundColor;
    const a = document.createElement('a');
    a.href = `sc_d_pc?partId=${partId}`;

    Object.assign(a.style, {
      alignItems: 'center',
      backgroundColor: bgColor,
      borderTop: '1px solid rgb(224 224 224)',
      display: 'flex',
      height: '5rem',
      justifyContent: 'center',
      padding: '1.4rem 1.8rem',
      width: '100%',
    });

    const section = item.parentElement;
    const target = section?.parentElement;
    const aExist = target?.querySelector(`a[href="sc_d_pc?partId=${partId}"]`);

    if (section && target && !aExist) {
      target?.appendChild(a);
    }

    a.textContent = playInSameTab ? '同じタブで再生' : '新しいタブで再生';
    a.target = playInSameTab ? '_self' : '_blank';
  }
};
