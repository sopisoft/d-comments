import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { useTheme } from '../hooks/useTheme';
import type { NgEntry } from '../storage';
import { NgEntryRow } from './NgEntryRow';

const entry: NgEntry = { value: 'example-user', enabled: true };
type StoryArgs = Omit<React.ComponentProps<typeof NgEntryRow>, 'ps'>;

const meta = {
  title: 'Settings/NgEntryRow',
  component: ThemeAwareNgEntryRow,
  args: {
    entry,
    isEditing: false,
    onEdit: () => {},
    onSave: () => {},
    onCancel: () => {},
    onToggle: () => {},
    onDelete: () => {},
  },
} satisfies Meta<typeof ThemeAwareNgEntryRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('example-user')).toBeVisible();
    await expect(canvas.getByRole('button', { name: '編集' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: '削除' })).toBeVisible();
  },
};

export const Editing: Story = {
  args: { isEditing: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByDisplayValue('example-user')).toBeVisible();
    await expect(canvas.getByRole('button', { name: '保存' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'キャンセル' })).toBeVisible();
  },
};

function ThemeAwareNgEntryRow(args: StoryArgs): React.ReactElement {
  const { styles } = useTheme();
  return <NgEntryRow {...args} ps={styles} />;
}
