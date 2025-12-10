import { Group, Paper, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import { useTheme } from "../hooks/useTheme";

export function SectionCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: string;
  icon?: IconType;
  children: ReactNode;
}) {
  const { styles: ps } = useTheme();
  return (
    <Paper
      radius="md"
      p="lg"
      style={{
        width: "100%",
        maxWidth: "56rem",
        margin: "0 auto",
        background: ps.pairs.bg.elevated.background,
        border: ps.panel.border,
      }}
    >
      <Stack gap="lg">
        <Group gap="sm" align="flex-start">
          {Icon && (
            <ThemeIcon color="accent" size={34} radius="md" variant="light">
              <Icon size={18} />
            </ThemeIcon>
          )}
          <div>
            <Title order={4} fw={600} c={ps.text.primary}>
              {title}
            </Title>
            {description && (
              <Text size="sm" c={ps.text.muted} mt={4}>
                {description}
              </Text>
            )}
          </div>
        </Group>
        {children}
      </Stack>
    </Paper>
  );
}
