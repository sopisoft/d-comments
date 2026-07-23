import { ActionIcon, Button, Group, Stack, Text, Textarea } from '@mantine/core';
import { useCallback, useState } from 'react';
import { MdBlock, MdClose, MdPersonOff, MdPlayArrow } from 'react-icons/md';
import { addNgEntry } from '@/config/storage';
import { ui } from '@/config/theme';
import { readableTextOnHex } from '@/lib/color';
import { logger } from '@/lib/logger';
import { vposToTime } from '@/modules/formatting';
import type { NvCommentItem } from '@/types/api';
import type { ThemeProps } from './types';

export type CommentDetailViewProps = {
  comment: NvCommentItem;
  theme: ThemeProps;
  onSeek: () => void;
  onClose: () => void;
};

export const CommentDetailView = ({ comment, theme, onSeek, onClose }: CommentDetailViewProps): React.ReactElement => {
  const [ngWord, setNgWord] = useState(comment.body);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const blockUser = useCallback(async () => {
    setErrorMessage(null);
    try {
      await addNgEntry('ng_user_ids', comment.userId);
    } catch (error) {
      logger.error('ユーザーのNG登録に失敗しました', error);
      setErrorMessage('NG登録に失敗しました');
    }
  }, [comment.userId]);
  const blockWord = useCallback(async () => {
    setErrorMessage(null);
    try {
      await addNgEntry('ng_words', ngWord);
    } catch (error) {
      logger.error('NGワードの登録に失敗しました', error);
      setErrorMessage('NG登録に失敗しました');
    }
  }, [ngWord]);

  const btnProps = {
    fullWidth: true,
    size: 'xs',
    styles: {
      inner: { justifyContent: 'flex-start' },
      label: { flex: 1, textAlign: 'left' as const },
    },
  };
  const filledButtonStyle = {
    backgroundColor: theme.palette.accent,
    borderColor: theme.palette.accent,
    color: readableTextOnHex(theme.palette.accent),
  };
  const outlineButtonStyle = {
    backgroundColor: 'transparent',
    borderColor: theme.palette.accent,
    color: theme.palette.accent,
  };

  return (
    <Stack gap="xs" style={{ boxSizing: 'border-box', overflow: 'hidden', width: '100%' }}>
      <Group justify="space-between" align="center" gap="xs" wrap="nowrap">
        <Group gap="xs" align="center" wrap="nowrap">
          <Text size="xs" c={theme.palette.text.secondary}>
            No.{comment.no} ・ 時刻: {vposToTime(comment.vposMs)} ・ ニコる: {comment.nicoruCount}
          </Text>
        </Group>
        <ActionIcon aria-label="閉じる" onClick={onClose} variant="subtle" c={theme.palette.text.primary} size="sm">
          <MdClose size={ui.icon.md} />
        </ActionIcon>
      </Group>
      <Textarea
        aria-label="NGワード"
        value={ngWord}
        onChange={(e) => setNgWord(e.currentTarget.value)}
        size="xs"
        minRows={2}
        maxRows={3}
        autosize
        styles={{
          input: {
            backgroundColor: 'transparent',
            borderColor: theme.alpha(0.15),
            color: theme.palette.text.primary,
            resize: 'none',
          },
        }}
      />
      {errorMessage && (
        <Text role="alert" size="xs" c="red">
          {errorMessage}
        </Text>
      )}
      <Stack gap={ui.space.xs}>
        <Button
          {...btnProps}
          leftSection={
            <span
              style={{
                display: 'inline-flex',
                justifyContent: 'center',
                width: ui.icon.xl,
              }}
            >
              <MdPlayArrow size={ui.icon.md} />
            </span>
          }
          style={filledButtonStyle}
          onClick={onSeek}
        >
          再生位置へ移動
        </Button>
        <Button
          {...btnProps}
          leftSection={
            <span
              style={{
                display: 'inline-flex',
                justifyContent: 'center',
                width: ui.icon.xl,
              }}
            >
              <MdPersonOff size={ui.icon.md} />
            </span>
          }
          variant="outline"
          style={outlineButtonStyle}
          onClick={blockUser}
        >
          ユーザーを NG 登録
        </Button>
        <Button
          {...btnProps}
          leftSection={
            <span
              style={{
                display: 'inline-flex',
                justifyContent: 'center',
                width: ui.icon.xl,
              }}
            >
              <MdBlock size={ui.icon.md} />
            </span>
          }
          variant="outline"
          style={outlineButtonStyle}
          onClick={blockWord}
        >
          NG ワードとして登録
        </Button>
      </Stack>
    </Stack>
  );
};
