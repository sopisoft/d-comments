import {
  ActionIcon,
  Badge,
  Box,
  Card,
  Group,
  Image,
  Stack,
  Text,
} from "@mantine/core";
import { useEffect, useState } from "react";
import {
  MdOutlineInsertComment,
  MdOutlinePlayArrow,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
} from "react-icons/md";
import type { MinimalVideoData } from "../types/fetch";
import { lengthSecondsToTime, toJapaneseNumber } from "../utils";

export function VideoCard({
  item,
  isPlaying,
  togglePlaying,
}: {
  item: MinimalVideoData;
  isPlaying: (id: string) => Promise<boolean>;
  togglePlaying: (videoId: string) => Promise<void>;
}) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    isPlaying(item.contentId).then(setPlaying);
  }, [item.contentId, isPlaying]);

  return (
    <Card withBorder padding="sm" radius="md">
      <Group gap="md" align="center">
        <Box
          pos="relative"
          component="a"
          href={`https://www.nicovideo.jp/watch/${item.contentId}`}
          target="_blank"
          rel="noreferrer noopener"
          style={{
            width: "160px",
            flexShrink: 0,
            aspectRatio: "16 / 9",
            overflow: "hidden",
          }}
        >
          <Image
            src={item.thumbnailUrl}
            alt={item.title}
            radius="sm"
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
              color={item.isDAnime ? "orange" : "cyan"}
              variant="filled"
            >
              {item.isDAnime ? "dアニメ" : "公式"}
            </Badge>
          )}
          <Badge
            pos="absolute"
            bottom={3}
            right={4}
            color="dark"
            variant="white"
          >
            {lengthSecondsToTime(item.lengthSeconds)}
          </Badge>
        </Box>
        <Stack justify="space-between" h="100%" style={{ flex: 1 }}>
          <Text fw={700} lineClamp={3} size="sm">
            {item.title}
          </Text>
          <Group justify="space-between">
            <Group gap="xs">
              <Group gap={2}>
                <MdOutlinePlayArrow />
                <Text size="xs">{toJapaneseNumber(item.viewCounter)}</Text>
              </Group>
              <Group gap={2}>
                <MdOutlineInsertComment />
                <Text size="xs">{toJapaneseNumber(item.commentCounter)}</Text>
              </Group>
            </Group>
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => {
                togglePlaying(item.contentId);
                setPlaying((p) => !p);
              }}
              title={playing ? "表示をやめる" : "表示する"}
            >
              {playing ? <MdOutlineVisibility /> : <MdOutlineVisibilityOff />}
            </ActionIcon>
          </Group>
        </Stack>
      </Group>
    </Card>
  );
}
