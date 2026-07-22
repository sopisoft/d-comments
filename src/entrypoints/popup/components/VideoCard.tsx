import { ActionIcon, Badge, Box, Group, Image, Stack, Text, Tooltip } from '@mantine/core';
import { memo } from 'react';
import {
  MdOutlineInsertComment,
  MdOutlinePlayArrow,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
} from 'react-icons/md';
import { useTheme } from '@/config/hooks/useTheme';
import { ui } from '@/config/theme';
import { logger } from '@/lib/logger';
import { toJapaneseNumber, vposToTime } from '@/modules/formatting';
import type { CommentVideoData } from '@/types/comments';

export const VideoCard = memo(function VideoCard({
  item,
  playing,
  togglePlaying,
}: {
  item: CommentVideoData['videoData'];
  playing: boolean;
  togglePlaying: (videoId: string) => Promise<void>;
}): React.ReactElement {
  const { styles: ps } = useTheme();
  const cardStyle = {
    background: playing ? ps.bg.surface : ps.bg.elevated,
    border: `1px solid ${playing ? ps.accent : ps.border.default}`,
    borderRadius: ui.radius.md,
    padding: ui.space.sm,
    transition: ui.transition.fast,
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
            aspectRatio: '16/9',
            borderRadius: ui.radius.sm,
            flexShrink: 0,
            overflow: 'hidden',
            width: ui.layout.videoThumbnailWidth,
          }}
        >
          <Image
            src={item.thumbnailUrl}
            alt={item.title}
            style={{ height: '100%', objectFit: 'cover', objectPosition: 'center', width: '100%' }}
          />
          {item.channelId && (
            <Badge
              pos="absolute"
              top={4}
              left={4}
              size="xs"
              color={item.isDAnime ? 'orange' : 'cyan'}
              variant="filled"
              style={{ textTransform: 'none' }}
            >
              {item.isDAnime ? 'dアニメ' : '公式'}
            </Badge>
          )}
          <Badge pos="absolute" bottom={4} right={4} size="xs" color="dark" variant="white">
            {vposToTime(item.lengthSeconds * 1000)}
          </Badge>
        </Box>
        <Stack justify="space-between" gap="xs" style={{ flex: 1, minWidth: 0 }}>
          <Text
            fw={ui.font.weight.semibold}
            lineClamp={2}
            size="sm"
            c={ps.text.primary}
            style={{ lineHeight: ui.font.lineHeight.normal }}
          >
            {item.title}
          </Text>
          <Group justify="space-between" align="center">
            <Group gap="sm">
              <Group gap={4}>
                <MdOutlinePlayArrow size={ui.icon.sm} color={ps.text.muted} />
                <Text size="xs" c={ps.text.muted}>
                  {toJapaneseNumber(item.viewCounter)}
                </Text>
              </Group>
              <Group gap={4}>
                <MdOutlineInsertComment size={ui.icon.sm} color={ps.text.muted} />
                <Text size="xs" c={ps.text.muted}>
                  {toJapaneseNumber(item.commentCounter)}
                </Text>
              </Group>
            </Group>
            <Tooltip label={playing ? '表示をやめる' : '表示する'} position="left" withArrow>
              <ActionIcon
                aria-label={playing ? 'コメント表示をやめる' : 'コメントを表示する'}
                variant={playing ? 'light' : 'subtle'}
                color={playing ? 'orange' : 'gray'}
                onClick={() => {
                  togglePlaying(item.contentId).catch(logger.error);
                }}
              >
                {playing ? <MdOutlineVisibility size={ui.icon.lg} /> : <MdOutlineVisibilityOff size={ui.icon.lg} />}
              </ActionIcon>
            </Tooltip>
          </Group>
        </Stack>
      </Group>
    </div>
  );
});
