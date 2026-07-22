import { Box } from '@mantine/core';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fireEvent, within } from 'storybook/test';
import { createPalette } from '@/config/hooks/useTheme';
import { ui } from '@/config/theme';
import type { SidebarConfig } from '../context/SidebarContext';
import { ResizeHandle } from './SidebarResizeHandle';

const config = {
  mode: 'light',
  palette: createPalette('light'),
  width: 600,
  fontSize: ui.font.size.md,
  opacity: 95,
  visibility: true,
  showNicoru: true,
  scrollSmoothly: false,
  timingOffset: 0,
  fps: 60,
  alpha: (a: number) => `rgba(33, 37, 41, ${a})`,
  setWidth: () => {},
  saveWidth: () => {},
} satisfies SidebarConfig;

const meta = {
  title: 'Sidebar/ResizeHandle',
  component: ResizeHandle,
  args: { config },
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ResizeHandle>;

export default meta;
type Story = StoryObj<typeof meta>;

const ResizeHandleStory = ({ config }: { config: SidebarConfig }): React.ReactElement => {
  const [width, setWidth] = useState(config.width);
  const interactiveConfig = { ...config, setWidth, saveWidth: setWidth, width };
  return (
    <Box pos="relative" h={360} w={width} style={{ border: '1px solid #CED4DA' }}>
      <ResizeHandle config={interactiveConfig} />
    </Box>
  );
};

export const Default: Story = {
  render: (args) => <ResizeHandleStory config={args.config} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const handle = canvas.getByRole('slider', { name: 'サイドバー幅の調整' });
    await expect(handle).toHaveAttribute('aria-valuenow', '600');
    await fireEvent.mouseDown(handle, { clientX: 100 });
    await fireEvent.mouseMove(document, { clientX: 50 });
    await fireEvent.mouseUp(document, { clientX: 50 });
    await expect(handle).toHaveAttribute('aria-valuenow', '650');
  },
};
