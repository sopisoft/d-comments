import { Checkbox, Input, NumberInput, Paper, SegmentedControl, Slider, Stack, Switch } from '@mantine/core';
import { type ConfigKey, type ConfigKeysWithUIType, type ConfigValue, getUiOptions } from '@/config/defaults';
import { useConfig } from '../hooks/useConfigs';
import { useTheme } from '../hooks/useTheme';

type FieldProps<TKey extends ConfigKey> = {
  configKey: TKey;
  label: string;
  description?: string;
};

const useFieldAppearance = () => {
  const { styles: ps } = useTheme();
  const textStyles = {
    description: { color: ps.text.secondary },
    label: { color: ps.text.primary },
  } as const;
  return {
    inputStyles: { ...ps.inputStyles, ...textStyles },
    ps,
    textStyles,
  } as const;
};

export const SwitchField = ({
  configKey,
  label,
  description,
}: FieldProps<ConfigKeysWithUIType<'switch'>>): React.ReactElement => {
  const { textStyles } = useFieldAppearance();
  const { currentValue, save } = useConfig(configKey);
  return (
    <Switch
      label={label}
      description={description}
      checked={currentValue}
      onChange={(e) => save(e.currentTarget.checked)}
      color="accent"
      styles={textStyles}
    />
  );
};

export const NumberField = ({
  configKey,
  label,
  description,
}: FieldProps<ConfigKeysWithUIType<'number'>>): React.ReactElement => {
  const options = getUiOptions(configKey) as { min: number; max: number; step?: number };
  const { inputStyles } = useFieldAppearance();
  const { currentValue, save } = useConfig(configKey);
  return (
    <NumberInput
      label={label}
      description={description}
      value={Number(currentValue)}
      onChange={(n) => {
        const v = Number(n);
        if (Number.isFinite(v)) save(v);
      }}
      min={options.min}
      max={options.max}
      step={'step' in options ? options.step : undefined}
      styles={inputStyles}
    />
  );
};

export const SliderField = ({
  configKey,
  label,
  description,
}: FieldProps<ConfigKeysWithUIType<'slider'>>): React.ReactElement => {
  const { min, max, step, unit } = getUiOptions(configKey) as {
    min: number;
    max: number;
    step: number;
    unit?: string;
  };
  const { textStyles } = useFieldAppearance();
  const { currentValue, save } = useConfig(configKey);
  const marks = unit
    ? [
        { label: `${min}${unit}`, value: min },
        { label: `${max}${unit}`, value: max },
      ]
    : undefined;
  return (
    <Input.Wrapper label={label} description={description} styles={textStyles}>
      <Slider
        value={Number(currentValue)}
        onChange={save}
        min={min}
        max={max}
        step={step}
        mt="md"
        mb="xl"
        color="accent"
        marks={marks}
        styles={{ markLabel: textStyles.description }}
      />
    </Input.Wrapper>
  );
};

export const CheckboxGroupField = ({
  configKey,
  label,
  description,
}: FieldProps<ConfigKeysWithUIType<'checkbox_group'>>): React.ReactElement => {
  const { ps, textStyles } = useFieldAppearance();
  const { currentValue, defaultValue, save } = useConfig(configKey);
  const keyOf = (item: { key?: string; value: string }) => item.key ?? item.value;
  const effectiveVisible = currentValue.filter((item) => item.enabled).map(keyOf);
  const onCheckedChange = (checked: boolean, key: string) =>
    save(currentValue.map((item) => (keyOf(item) === key ? { ...item, enabled: checked } : item)));
  return (
    <Checkbox.Group label={label} description={description} value={effectiveVisible} styles={textStyles}>
      <Paper
        p="sm"
        mt="sm"
        radius="sm"
        style={{
          background: ps.bg.surface,
          border: ps.panel.border,
          color: ps.text.primary,
        }}
      >
        <Stack gap="sm">
          {defaultValue.map((item) => {
            const k = keyOf(item);
            return (
              <Checkbox
                key={k}
                label={item.value}
                value={k}
                checked={currentValue.find((i) => keyOf(i) === k)?.enabled ?? false}
                onChange={(e) => onCheckedChange(e.currentTarget.checked, k)}
                color="accent"
                styles={{ label: textStyles.label }}
              />
            );
          })}
        </Stack>
      </Paper>
    </Checkbox.Group>
  );
};

export const SegmentedControlField = <TKey extends ConfigKeysWithUIType<'segmented_control'>>({
  configKey,
  label,
  description,
}: FieldProps<TKey>): React.ReactElement | null => {
  const { styles } = useTheme();
  const { textStyles } = useFieldAppearance();
  const { currentValue, defaultValue, save } = useConfig(configKey);
  const options = getUiOptions(configKey) as Array<{
    value: string;
    label: string;
    icon?: React.ComponentType<{ size?: number }>;
  }>;
  if (!options?.length) return null;
  const current = String(currentValue ?? defaultValue);
  const saveFromString = (v: string) => save(v as ConfigValue<TKey>);

  return (
    <Input.Wrapper label={label} description={description} styles={textStyles}>
      <SegmentedControl
        fullWidth
        my="md"
        value={current}
        onChange={saveFromString}
        data={options.map((option) => ({
          label: option.icon ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <option.icon size={16} />
              {option.label}
            </span>
          ) : (
            option.label
          ),
          value: String(option.value),
        }))}
        styles={{ label: textStyles.label }}
        style={{ background: styles.bg.surface, color: styles.text.primary }}
      />
    </Input.Wrapper>
  );
};
