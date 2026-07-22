import { ActionIcon, Checkbox, Group, Paper, Text, TextInput, Tooltip } from '@mantine/core';
import { useState } from 'react';
import { MdCheck, MdClose, MdDelete, MdEdit } from 'react-icons/md';
import { ui } from '@/config/theme';
import type { useTheme } from '../hooks/useTheme';
import type { NgEntry } from '../storage';

type PS = ReturnType<typeof useTheme>['styles'];

type EntryRowProps = {
  entry: NgEntry;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (value: string) => void;
  onCancel: () => void;
  onToggle: () => void;
  onDelete: () => void;
  ps: PS;
};

export function NgEntryRow({
  entry,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onToggle,
  onDelete,
  ps,
}: EntryRowProps): React.ReactElement {
  const [value, setValue] = useState(entry.value);
  const { accent, bg } = ps.pairs;
  const rowStyle = {
    background: bg.surface.background,
    border: `1px solid ${ps.border.default}`,
  };

  if (isEditing) {
    return (
      <Paper p="sm" radius="sm" style={rowStyle}>
        <Group justify="space-between" align="center" gap="sm">
          <TextInput
            size="xs"
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSave(value)}
            placeholder="値を入力"
            flex={1}
            styles={{
              input: {
                background: bg.elevated.background,
                borderColor: accent.background,
              },
            }}
          />
          <Group gap={4}>
            <Tooltip label="保存">
              <ActionIcon aria-label="保存" size="sm" variant="light" color="green" onClick={() => onSave(value)}>
                <MdCheck size={ui.icon.md} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="キャンセル">
              <ActionIcon aria-label="キャンセル" size="sm" variant="subtle" color="gray" onClick={onCancel}>
                <MdClose size={ui.icon.md} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Paper>
    );
  }

  return (
    <Paper p="sm" radius="sm" style={{ ...rowStyle, opacity: entry.enabled ? 1 : 0.6 }}>
      <Group justify="space-between" align="center" gap="sm">
        <Checkbox
          label={
            <Text size="sm" style={{ wordBreak: 'break-all' }} c={ps.text.primary}>
              {entry.value}
            </Text>
          }
          checked={entry.enabled}
          onChange={onToggle}
          size="sm"
        />
        <Group gap={4}>
          <Tooltip label="編集">
            <ActionIcon aria-label="編集" size="sm" variant="subtle" color="gray" onClick={onEdit}>
              <MdEdit size={ui.icon.md} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="削除">
            <ActionIcon aria-label="削除" size="sm" variant="subtle" color="red" onClick={onDelete}>
              <MdDelete size={ui.icon.md} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </Paper>
  );
}
