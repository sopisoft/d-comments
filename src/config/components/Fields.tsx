import {
  Checkbox,
  ColorInput,
  Input,
  NumberInput,
  Slider,
  Stack,
  Switch,
} from "@mantine/core";
import { type ConfigKeysWithUIType, getRawDefaultConfig } from "@/config/";
import { useConfigValue } from "../hooks/useConfigValue";

export function SwitchField({
  configKey,
  label,
  description,
}: {
  configKey: ConfigKeysWithUIType<"switch">;
  label: string;
  description: string;
}) {
  const { value, defaultValue, isPending, save } = useConfigValue(configKey);
  const checked = (value ?? defaultValue) as boolean;

  return (
    <Switch
      label={label}
      description={description}
      checked={checked}
      disabled={isPending}
      onChange={(event) => save(event.currentTarget.checked)}
    />
  );
}

export function ColorField({
  configKey,
  label,
  description,
}: {
  configKey: ConfigKeysWithUIType<"color">;
  label: string;
  description: string;
}) {
  const { value, defaultValue, isPending, save } = useConfigValue(configKey);
  const current = (value ?? defaultValue) as string;

  return (
    <ColorInput
      label={label}
      description={description}
      value={current}
      disabled={isPending}
      onChange={(color) => save(color)}
    />
  );
}

export function NumberField({
  configKey,
  label,
  description,
}: {
  configKey: ConfigKeysWithUIType<"number">;
  label: string;
  description: string;
}) {
  const { value, defaultValue, isPending, save } = useConfigValue(configKey);
  const options = getRawDefaultConfig(configKey).ui_options;
  const { min, max } = options;
  const step = "step" in options ? options.step : undefined;
  const current = Number(value ?? defaultValue);

  return (
    <NumberInput
      label={label}
      description={description}
      value={current}
      disabled={isPending}
      onChange={(next) => {
        const numeric = Number(next);
        if (!Number.isFinite(numeric)) return;
        save(numeric);
      }}
      min={min}
      max={max}
      step={step}
      clampBehavior="strict"
    />
  );
}

export function SliderField({
  configKey,
  label,
  description,
}: {
  configKey: ConfigKeysWithUIType<"slider">;
  label: string;
  description: string;
}) {
  const { value, defaultValue, isPending, save } = useConfigValue(configKey);
  const options = getRawDefaultConfig(configKey).ui_options;
  const { min, max, step, unit } = options;
  const current = Number(value ?? defaultValue);

  return (
    <Input.Wrapper label={label} description={description}>
      <Slider
        value={current}
        disabled={isPending}
        onChange={(next) => save(next)}
        min={min}
        max={max}
        step={step}
        marks={
          unit
            ? [
                { value: min, label: `${min}${unit}` },
                { value: max, label: `${max}${unit}` },
              ]
            : undefined
        }
      />
    </Input.Wrapper>
  );
}

export function CheckboxGroupField({
  configKey,
  label,
  description,
}: {
  configKey: ConfigKeysWithUIType<"checkbox_group">;
  label: string;
  description: string;
}) {
  const { value, defaultValue, isPending, save } = useConfigValue(configKey);
  const current = value ?? defaultValue;
  const visible = current
    .filter((item) => item.enabled)
    .map((item) => item.key);

  const onCheckedChange = (checked: boolean, key: string) => {
    const next = current.map((item) =>
      item.key === key ? { ...item, enabled: checked } : item
    );
    save(next);
  };

  return (
    <Checkbox.Group label={label} description={description} value={visible}>
      <Stack gap="sm" mt="sm">
        {defaultValue.map((item) => (
          <Checkbox
            key={item.key}
            label={item.value}
            value={item.key}
            checked={current.find((i) => i.key === item.key)?.enabled ?? false}
            onChange={(event) =>
              onCheckedChange(event.currentTarget.checked, item.key)
            }
            disabled={isPending}
          />
        ))}
      </Stack>
    </Checkbox.Group>
  );
}

export function CheckboxField({
  configKey,
  label,
  description,
}: {
  configKey: ConfigKeysWithUIType<"checkbox">;
  label: string;
  description: string;
}) {
  const { value, defaultValue, isPending, save } = useConfigValue(configKey);
  const checked = (value ?? defaultValue) as boolean;

  return (
    <Checkbox
      label={label}
      description={description}
      checked={checked}
      disabled={isPending}
      onChange={(event) => save(event.currentTarget.checked)}
    />
  );
}
