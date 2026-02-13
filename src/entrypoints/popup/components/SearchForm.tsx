import { Button, Group, Select, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useCallback, useEffect } from 'react';
import { useTheme } from '@/config/hooks/useTheme';
import { getConfig } from '@/config/storage';
import type { _sort, SnapShotQuery, SnapShotResponse } from '@/entrypoints/background/search';
import { logger } from '@/lib/logger';
import { unwrap } from '@/lib/types';
import { toCommentVideoList } from '@/lib/utils';
import { requestMessageResult } from '@/messaging/runtime';
import { buildSearchQuery } from '@/modules/search';
import type { CommentVideoData } from '@/types/comments';

const sortOptions: [_sort, string][] = [
  ['viewCounter', '再生数'],
  ['lengthSeconds', '動画の尺'],
  ['commentCounter', 'コメント数'],
];
const sortOrder: [string, string][] = [
  ['-', '降順（大 → 小）'],
  ['+', '昇順（小 → 大）'],
];

export function SearchForm({
  initialWord,
  addVideos,
}: {
  initialWord?: string;
  addVideos: (videos: CommentVideoData[]) => Promise<void>;
}): React.ReactElement {
  const { styles: ps } = useTheme();
  const inputStyles = { ...ps.inputStyles, label: { color: ps.text.primary } };
  const form = useForm({
    initialValues: {
      sort_option: 'commentCounter',
      sort_order: '-',
      word: initialWord ?? '',
    },
  });

  const runSearch = useCallback(
    async (word: string, sort: SnapShotQuery['_sort']) => {
      const payload = unwrap<SnapShotResponse>(
        await requestMessageResult('search', buildSearchQuery(word, sort)),
        'Search failed'
      );
      if (!payload || payload.meta.status !== 200) {
        logger.error(payload?.meta.errorCode, payload?.meta.errorMessage);
        return;
      }
      await addVideos(toCommentVideoList(payload));
    },
    [addVideos]
  );

  useEffect(() => {
    getConfig('auto_search').then(async (v) => {
      if (v) await runSearch(form.getValues().word, '-commentCounter');
    });
  }, [form, runSearch]);

  return (
    <form
      onSubmit={form.onSubmit((v) => runSearch(v.word, `${v.sort_order}${v.sort_option}` as SnapShotQuery['_sort']))}
    >
      <Stack gap="md">
        <TextInput
          label="検索ワード"
          required
          placeholder="まちカドまぞく"
          key={form.key('word')}
          {...form.getInputProps('word')}
          styles={inputStyles}
        />
        <Group gap="md">
          <Select
            label="並び替え"
            data={sortOptions.map(([value, label]) => ({ label, value }))}
            key={form.key('sort_option')}
            {...form.getInputProps('sort_option')}
            styles={inputStyles}
          />
          <Select
            label="並び順"
            data={sortOrder.map(([value, label]) => ({ label, value }))}
            key={form.key('sort_order')}
            {...form.getInputProps('sort_order')}
            styles={inputStyles}
          />
        </Group>
        <Button type="submit" loading={form.submitting} variant="filled">
          検索
        </Button>
      </Stack>
    </form>
  );
}
