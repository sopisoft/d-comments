import { ActionIcon, Button, Group, Stack, Text, Textarea } from "@mantine/core";
import { memo, useCallback, useState } from "react";
import { addNgEntry } from "@/config/storage";
import { ui } from "@/config/theme";
import { vposToTime } from "@/modules/formatting";
import type { NvCommentItem } from "@/types/api";
import type { ThemeProps } from "./types";

export type CommentDetailViewProps = {
  comment: NvCommentItem;
  theme: ThemeProps;
  onSeek: () => void;
  onClose: () => void;
};

export const CommentDetailView = memo<CommentDetailViewProps>(({ comment, theme, onSeek, onClose }) => {
  const [ngWord, setNgWord] = useState(comment.body);
  const blockUser = useCallback(() => addNgEntry("ng_user_ids", comment.userId), [comment.userId]);
  const blockWord = useCallback(() => addNgEntry("ng_words", ngWord), [ngWord]);

  const boxStyle = {
    padding: ui.space.sm,
    border: `1px solid ${theme.alpha(0.15)}`,
    borderRadius: ui.radius.md,
    backgroundColor: theme.alpha(0.02),
  };
  const quoteStyle = {
    padding: ui.space.sm,
    backgroundColor: theme.alpha(0.04),
    borderRadius: ui.radius.sm,
    borderLeft: `3px solid ${theme.palette.accent}`,
  };
  const btnProps = {
    fullWidth: true,
    size: "xs",
    variant: "filled",
    color: "accent",
  };

  return (
    <Stack
      gap="sm"
      style={{
        ...boxStyle,
        width: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      <Group justify="space-between" align="center">
        <Text size="sm" fw={600} c={theme.palette.text.primary}>
          コメント詳細
        </Text>
        <ActionIcon onClick={onClose} variant="subtle" c={theme.palette.text.primary} size="xs">
          ×
        </ActionIcon>
      </Group>
      <div style={quoteStyle}>
        <Text
          size="sm"
          c={theme.palette.text.primary}
          style={{
            whiteSpace: "pre-wrap",
            lineHeight: 1.6,
            wordBreak: "break-word",
            overflowWrap: "anywhere",
          }}
        >
          {comment.body}
        </Text>
      </div>
      <Text size="xs" c={theme.palette.text.secondary}>
        No.{comment.no} ・ {vposToTime(comment.vposMs)} ・ ニコる: {comment.nicoruCount}
      </Text>
      <Stack gap={6}>
        <Button {...btnProps} onClick={onSeek}>
          再生位置へ移動
        </Button>
        <Button {...btnProps} variant="outline" onClick={blockUser}>
          ユーザーを NG 登録
        </Button>
      </Stack>
      <div
        style={{
          borderTop: `1px solid ${theme.alpha(0.1)}`,
          paddingTop: ui.space.sm,
          marginTop: ui.space.xs,
        }}
      >
        <Text size="xs" c={theme.palette.text.secondary} mb={6}>
          コメントを編集して NG 登録
        </Text>
        <Textarea
          value={ngWord}
          placeholder="NG ワードを入力"
          onChange={(e) => setNgWord(e.currentTarget.value)}
          size="xs"
          minRows={2}
          maxRows={3}
          autosize
          styles={{
            input: {
              color: theme.palette.text.primary,
              borderColor: theme.alpha(0.15),
              backgroundColor: "transparent",
              resize: "none",
            },
          }}
        />
        <Button {...btnProps} variant="outline" mt={6} onClick={blockWord}>
          NG ワードとして登録
        </Button>
      </div>
    </Stack>
  );
});
