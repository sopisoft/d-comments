import { ActionIcon, Badge, Box, Group, Image, Stack, Text, Tooltip } from "@mantine/core";
import {
  MdOutlineInsertComment,
  MdOutlinePlayArrow,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
} from "react-icons/md";
import { useTheme } from "@/config/";
import { ui } from "@/config/theme";
import { toJapaneseNumber, vposToTime } from "@/modules/formatting";
import type { CommentVideoData } from "@/types";

export function VideoCard({
  item,
  playing,
  togglePlaying,
}: {
  item: CommentVideoData["videoData"];
  playing: boolean;
  togglePlaying: (videoId: string) => Promise<void>;
}) {
  const { styles: ps } = useTheme();
  const cardStyle = {
    padding: ui.space.sm,
    borderRadius: ui.radius.md,
    background: playing ? ps.bg.surface : ps.bg.elevated,
    border: `1px solid ${playing ? ps.accent : ps.border.default}`,
    transition: ui.transition,
  };

  return (
    <div style={cardStyle}>
      <Group gap="md" align="flex-start">
        <Box
          pos="relative"
          component="a"
          href={`https://www.nicovideo.jp/watch/${item.contentId}`}
          target="_blank"
          rel="noreferrer noopener"
          style={{
            width: 140,
            flexShrink: 0,
            aspectRatio: "16/9",
            overflow: "hidden",
            borderRadius: ui.radius.sm,
          }}
        >
          <Image
            src={item.thumbnailUrl}
            alt={item.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
          {item.channelId && (
            <Badge
              pos="absolute"
              top={4}
              left={4}
              size="xs"
              color={item.isDAnime ? "orange" : "cyan"}
              variant="filled"
              style={{
                textTransform: "none",
              }}
            >
              {item.isDAnime ? "dアニメ" : "公式"}
            </Badge>
          )}
          <Badge pos="absolute" bottom={4} right={4} size="xs" color="dark" variant="white">
            {vposToTime(item.lengthSeconds * 1000)}
          </Badge>
        </Box>
        <Stack justify="space-between" gap="xs" style={{ flex: 1, minWidth: 0 }}>
          <Text fw={600} lineClamp={2} size="sm" c={ps.text.primary} style={{ lineHeight: 1.4 }}>
            {item.title}
          </Text>
          <Group justify="space-between" align="center">
            <Group gap="sm">
              <Group gap={4}>
                <MdOutlinePlayArrow size={14} color={ps.text.muted} />
                <Text size="xs" c={ps.text.muted}>
                  {toJapaneseNumber(item.viewCounter)}
                </Text>
              </Group>
              <Group gap={4}>
                <MdOutlineInsertComment size={14} color={ps.text.muted} />
                <Text size="xs" c={ps.text.muted}>
                  {toJapaneseNumber(item.commentCounter)}
                </Text>
              </Group>
            </Group>
            <Tooltip label={playing ? "表示をやめる" : "表示する"} position="left" withArrow>
              <ActionIcon
                variant={playing ? "light" : "subtle"}
                color={playing ? "orange" : "gray"}
                onClick={() => {
                  void togglePlaying(item.contentId);
                }}
              >
                {playing ? <MdOutlineVisibility size={18} /> : <MdOutlineVisibilityOff size={18} />}
              </ActionIcon>
            </Tooltip>
          </Group>
        </Stack>
      </Group>
    </div>
  );
}
