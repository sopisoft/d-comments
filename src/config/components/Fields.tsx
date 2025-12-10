import { Checkbox, Input, NumberInput, Paper, Slider, Stack, Switch } from "@mantine/core";
import { memo } from "react";
import { type BooleanConfigKeys, type ConfigKeysWithUIType, getRawDefaultConfig } from "@/config/";
import { useConfigValue } from "../hooks/useConfigValue";
import { useTheme } from "../hooks/useTheme";

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

type FieldProps<K> = { configKey: K; label: string; description: string };

export const SwitchField = memo(({ configKey, label, description }: FieldProps<BooleanConfigKeys<"switch">>) => {
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

export const CheckboxField = memo(({ configKey, label, description }: FieldProps<BooleanConfigKeys<"checkbox">>) => {
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
    const effectiveVisible = currentValue.filter((item) => item.enabled).map((item) => item.key);
    const onCheckedChange = (checked: boolean, key: string) =>
      save(currentValue.map((item) => (item.key === key ? { ...item, enabled: checked } : item)));
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
            {defaultValue.map((item) => (
              <Checkbox
                key={item.key}
                label={item.value}
                value={item.key}
                checked={currentValue.find((i) => i.key === item.key)?.enabled ?? false}
                onChange={(e) => onCheckedChange(e.currentTarget.checked, item.key)}
                disabled={isPending}
                color="accent"
                styles={{ label: textStyles.label }}
              />
            ))}
          </Stack>
        </Paper>
      </Checkbox.Group>
    );
  }
);
