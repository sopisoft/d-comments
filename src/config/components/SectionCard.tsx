import { Group, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import type { ReactNode } from 'react';
import type { IconType } from 'react-icons';
import { ui } from '@/config/theme';
import { useTheme } from '../hooks/useTheme';
import { Surface } from './Surface';

export function SectionCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description?: ReactNode;
  icon?: IconType;
  children: ReactNode;
}): React.ReactElement {
  const { styles: ps } = useTheme();
  return (
    <Surface
      radius="md"
      p="lg"
      style={{
        margin: '0 auto',
        maxWidth: '56rem',
        width: '100%',
      }}
    >
      <Stack gap="lg">
        <Group gap="sm" align="flex-start">
          {Icon && (
            <ThemeIcon color="accent" size={ui.icon.section} radius="md" variant="light">
              <Icon size={ui.icon.sectionGlyph} />
            </ThemeIcon>
          )}
          <div>
            <Title order={4} fw={ui.font.weight.semibold} c={ps.text.primary}>
              {title}
            </Title>
            {typeof description === 'string' ? (
              <Text size="sm" c={ps.text.muted} mt={ui.space.xs}>
                {description}
              </Text>
            ) : (
              description
            )}
          </div>
        </Group>
        {children}
      </Stack>
    </Surface>
  );
}
