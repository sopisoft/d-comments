import { Stack } from '@mantine/core';
import { QuickOptionsPanel } from '@/config/components/QuickOptionsPanel';

export function SettingsPanel(): React.ReactElement {
  return (
    <Stack p="md">
      <QuickOptionsPanel />
    </Stack>
  );
}
