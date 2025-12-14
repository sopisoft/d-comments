import { Badge, Card, Group, Stack, Text } from "@mantine/core";
import type { CSSProperties } from "react";
import { memo, useMemo } from "react";
import { ui } from "@/config/theme";
import { adjustColor } from "@/lib/color";
import { nicoruColor, vposToTime } from "@/modules/formatting";
import type { NvCommentItem } from "@/types/api";
import type { ThemeProps } from "./types";

const HOVER_BG = "linear-gradient(135deg, rgba(148,163,184,0.16) 0%, rgba(148,163,184,0.06) 100%)";
const activeGrad = (a: string) => `linear-gradient(135deg, ${ui.alpha(a, 0.2)} 0%, ${ui.alpha(a, 0.08)} 100%)`;
const nicoruGrad = (bg: string) =>
  `linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.18) 100%), ${bg}`;

export const NicoruIcon = memo<{ size?: number; color?: string }>(({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="ニコる">
    <title>ニコる</title>
    <path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      fill={color}
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));

const computeCardStyle = (isActive: boolean, hovered: boolean, nicorubg: string, accent: string): CSSProperties => {
  const hasNicoruBg = nicorubg !== nicoruColor(0);
  const bg = isActive
    ? activeGrad(accent)
    : hovered && hasNicoruBg
      ? nicoruGrad(nicorubg)
      : hovered
        ? HOVER_BG
        : hasNicoruBg
          ? nicorubg
          : "transparent";
  return {
    background: bg,
    borderColor: isActive ? accent : hovered ? adjustColor(accent, -0.12) : undefined,
    borderWidth: isActive ? 2 : 1,
    marginBottom: ui.space.sm,
    transition: ui.transition,
    cursor: "pointer",
  };
};

export type CommentCardViewProps = {
  comment: NvCommentItem;
  theme: ThemeProps;
  isActive: boolean;
  hovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
};

export const CommentCardView = memo<CommentCardViewProps>(
  ({ comment, theme, isActive, hovered, onMouseEnter, onMouseLeave, onClick }) => {
    const nicorubg = theme.showNicoru ? nicoruColor(comment.nicoruCount) : nicoruColor(0);
    const style = useMemo(
      () => computeCardStyle(isActive, hovered, nicorubg, theme.palette.accent),
      [isActive, hovered, nicorubg, theme.palette.accent]
    );

    return (
      <Card
        component="div"
        padding="xs"
        radius="sm"
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={style}
      >
        <Group gap="xs" wrap="nowrap" align="flex-start">
          <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
            <Text
              lineClamp={4}
              style={{
                wordBreak: "break-word",
                textStroke: `1px ${theme.palette.bg.surface}`,
              }}
            >
              {comment.body}
            </Text>
            <Badge
              variant="light"
              size="sm"
              style={{
                backgroundColor: theme.palette.bg.surface,
                color: theme.palette.text.secondary,
              }}
            >
              {vposToTime(comment.vposMs)}
            </Badge>
          </Stack>
          {theme.showNicoru && (
            <Stack gap={4} align="center" justify="center" style={{ flexShrink: 0 }}>
              <NicoruIcon size={20} />
              <Text style={{ textStroke: `1px ${theme.palette.bg.surface}` }} size="xs" fw={500}>
                {comment.nicoruCount}
              </Text>
            </Stack>
          )}
        </Group>
      </Card>
    );
  }
);
