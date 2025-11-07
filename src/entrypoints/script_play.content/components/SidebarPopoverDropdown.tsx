import {
  Badge,
  Button,
  Divider,
  Group,
  Stack,
  Text,
  Textarea,
} from "@mantine/core";
import { useCallback, useEffect, useState } from "react";
import { getConfig, setConfig } from "@/config/";
import type { NvCommentItem } from "@/types/api";
import { useSidebarConfig } from "../hooks/useSidebarConfig";
import { vposToTime } from "../utils/formatting";

type SidebarPopoverDropdownProps = {
  comment: NvCommentItem;
  onSeek(): void;
};

type NgEntry = { value: string; enabled: boolean };

export function SidebarPopoverDropdown({
  comment,
  onSeek,
}: SidebarPopoverDropdownProps) {
  const config = useSidebarConfig();
  const [wordText, setWordText] = useState(comment.body);

  useEffect(() => {
    setWordText(comment.body);
  }, [comment.body]);

  const addToNg = useCallback(
    async (key: "ng_user_ids" | "ng_words", value: string) => {
      if (!value.trim()) return;
      const list = (await getConfig(key)) as NgEntry[] | undefined;
      const entries = list ?? [];
      if (entries.some((e) => e.value === value)) {
        return;
      }
      await setConfig(key, [...entries, { value, enabled: true }]);
    },
    []
  );

  return (
    <Stack gap="md">
      <div>
        <Text size="xs" c="dimmed" fw={500} mb="6px">
          コメント
        </Text>
        <Text size="sm" style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
          {comment.body}
        </Text>
      </div>

      <Group gap="sm" justify="space-between">
        <Badge
          size="sm"
          variant="outline"
          c={config.textColor}
          style={{ borderColor: `${config.textColor}40` }}
        >
          ⏱ {vposToTime(comment.vposMs)}
        </Badge>
        <Badge
          size="sm"
          variant="outline"
          c={config.textColor}
          style={{ borderColor: `${config.textColor}40` }}
        >
          ❤ {comment.nicoruCount}
        </Badge>
      </Group>

      {/* アクションボタン */}
      <Stack gap="xs">
        <Button
          fullWidth
          size="xs"
          onClick={onSeek}
          bg={config.bgColor}
          c={config.textColor}
          variant="outline"
        >
          ▶ 再生位置へ移動
        </Button>
        <Button
          fullWidth
          size="xs"
          onClick={() => addToNg("ng_user_ids", comment.userId)}
          bg={config.bgColor}
          c={config.textColor}
          variant="outline"
        >
          🚫 ユーザーをブロック
        </Button>
      </Stack>

      <Divider />

      <Stack gap="xs">
        <div>
          <Text size="xs" c="dimmed" fw={500} mb="6px">
            このコメントをブロック
          </Text>
          <Textarea
            value={wordText}
            placeholder="ワードを入力"
            onChange={(e) => setWordText(e.currentTarget.value)}
            size="xs"
            minRows={2}
            maxRows={3}
            styles={{
              input: {
                color: config.textColor,
                borderColor: `${config.textColor}40`,
                backgroundColor: "transparent",
              },
            }}
          />
        </div>
        <Button
          fullWidth
          size="xs"
          onClick={() => addToNg("ng_words", wordText)}
          bg={config.bgColor}
          c={config.textColor}
          variant="outline"
        >
          ブロック
        </Button>
      </Stack>
    </Stack>
  );
}
