import { Checkbox, Input, NumberInput, Paper, SegmentedControl, Slider, Stack, Switch } from "@mantine/core";
import { memo } from "react";
import {
  type ConfigKey,
  type ConfigKeysWithUIType,
  type ConfigValue,
  getRawDefaultConfig,
  getUiOptions,
} from "@/config/defaults";
import { useConfigValue } from "../hooks/useConfigValue";
import { useTheme } from "../hooks/useTheme";

type FieldProps<TKey extends ConfigKey> = {
  configKey: TKey;
  label: string;
  description?: string;
};

const useFieldAppearance = () => {
  const { styles: ps } = useTheme();
  const textStyles = {
    label: { color: ps.text.primary },
    description: { color: ps.text.secondary },
  } as const;
  return {
    ps,
    textStyles,
    inputStyles: { ...ps.inputStyles, ...textStyles },
  } as const;
};

export const SwitchField = memo(({ configKey, label, description }: FieldProps<ConfigKeysWithUIType<"switch">>) => {
  const { textStyles } = useFieldAppearance();
  const { currentValue, isPending, save } = useConfigValue(configKey);
  return (
    <Switch
      label={label}
      description={description}
      checked={currentValue}
      disabled={isPending}
      onChange={(e) => save(e.currentTarget.checked)}
      color="accent"
      styles={textStyles}
    />
  );
});

export const CheckboxField = memo(({ configKey, label, description }: FieldProps<ConfigKeysWithUIType<"checkbox">>) => {
  const { textStyles } = useFieldAppearance();
  const { currentValue, isPending, save } = useConfigValue(configKey);
  return (
    <Checkbox
      label={label}
      checked={currentValue}
      disabled={isPending}
      onChange={(e) => save(e.currentTarget.checked)}
      color="accent"
      styles={textStyles}
      description={description}
    />
  );
});

export const NumberField = memo(({ configKey, label, description }: FieldProps<ConfigKeysWithUIType<"number">>) => {
  const options = getRawDefaultConfig(configKey).ui_options;
  const { inputStyles } = useFieldAppearance();
  const { currentValue, isPending, save } = useConfigValue(configKey);
  return (
    <NumberInput
      label={label}
      description={description}
      value={Number(currentValue)}
      disabled={isPending}
      onChange={(n) => {
        const v = Number(n);
        if (Number.isFinite(v)) save(v);
      }}
      min={options.min}
      max={options.max}
      step={"step" in options ? options.step : undefined}
      clampBehavior="strict"
      styles={inputStyles}
    />
  );
});

export const SliderField = memo(({ configKey, label, description }: FieldProps<ConfigKeysWithUIType<"slider">>) => {
  const { min, max, step, unit } = getRawDefaultConfig(configKey).ui_options;
  const { textStyles } = useFieldAppearance();
  const { currentValue, isPending, save } = useConfigValue(configKey);
  const marks = unit
    ? [
        { value: min, label: `${min}${unit}` },
        { value: max, label: `${max}${unit}` },
      ]
    : undefined;
  return (
    <Input.Wrapper label={label} description={description} styles={textStyles}>
      <Slider
        value={Number(currentValue)}
        disabled={isPending}
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
});

export const CheckboxGroupField = memo(
  ({ configKey, label, description }: FieldProps<ConfigKeysWithUIType<"checkbox_group">>) => {
    const { ps, textStyles } = useFieldAppearance();
    const { currentValue, defaultValue, isPending, save } = useConfigValue(configKey);
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
            color: ps.text.primary,
            border: ps.panel.border,
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
                  disabled={isPending}
                  color="accent"
                  styles={{ label: textStyles.label }}
                />
              );
            })}
          </Stack>
        </Paper>
      </Checkbox.Group>
    );
  }
);

export const SegmentedControlField = memo(
  <TKey extends ConfigKeysWithUIType<"segmented_control">>({ configKey, label, description }: FieldProps<TKey>) => {
    const { styles } = useTheme();
    const { textStyles } = useFieldAppearance();
    const { currentValue, defaultValue, isPending, save } = useConfigValue(configKey);
    type ValueType = Extract<ConfigValue<TKey>, string>;
    const options = getUiOptions(configKey);
    if (!options || !Array.isArray(options)) return null;

    const current = (currentValue ?? defaultValue) as ValueType;
    const saveFromString = (v: string) => save(v as unknown as ConfigValue<TKey>);

    return (
      <Input.Wrapper label={label} description={description} styles={textStyles}>
        <SegmentedControl
          fullWidth
          my="md"
          value={String(current)}
          disabled={isPending}
          onChange={saveFromString}
          data={options.map((option) => ({
            value: String(option.value),
            label: option.icon ? (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <option.icon size={16} />
                {option.label}
              </span>
            ) : (
              option.label
            ),
          }))}
          styles={{ label: textStyles.label }}
          style={{ color: styles.text.primary, background: styles.bg.surface }}
        />
      </Input.Wrapper>
    );
  }
);
