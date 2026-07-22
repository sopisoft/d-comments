import { Stack, Text, Title } from '@mantine/core';
import { MdFeedback } from 'react-icons/md';
import { ui } from '@/config/theme';
import { useTheme } from '../hooks/useTheme';
import { Surface } from './Surface';

const getFormUrl = () => {
  const version = browser.runtime.getManifest().version;
  const url = new URL('https://forms.office.com/Pages/ResponsePage.aspx');
  url.searchParams.append('id', 'DQSIkWdsW0yxEjajBLZtrQAAAAAAAAAAAAMAABWTsPtUNkUyNzMwSFkyNEVENTExTVdINUNBUDBFNC4u');
  url.searchParams.append('r4fc5e3af4be04561a824b6564847f811', version);
  url.searchParams.append('embed', 'true');
  return url.toString();
};

export function SurveyFormPanel(): React.ReactElement {
  const { styles: ps } = useTheme();
  return (
    <Stack gap="lg" maw="56rem" mx="auto">
      <Surface p="md" radius="md">
        <Stack gap="xs">
          <Title order={4} fw={ui.font.weight.semibold} c={ps.accent}>
            <MdFeedback size={ui.icon.xl} style={{ marginRight: ui.space.sm, verticalAlign: 'middle' }} />
            フィードバック
          </Title>
          <Text size="sm" c={ps.text.muted}>
            不具合報告や機能リクエストをお寄せください
          </Text>
        </Stack>
      </Surface>
      <Surface p={0} radius="md" style={{ overflow: 'hidden' }}>
        <iframe
          title="フィードバックフォーム"
          src={getFormUrl()}
          allowFullScreen
          style={{ border: 0, display: 'block', height: ui.layout.formEmbedHeight, width: '100%' }}
        />
      </Surface>
    </Stack>
  );
}
