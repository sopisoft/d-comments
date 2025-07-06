import {
  Checkbox,
  ColorInput,
  Input,
  NumberInput,
  Slider,
  Stack,
  Switch,
} from "@mantine/core";

import { useEffect, useState } from "react";
import {
  type ConfigKeysWithUIType,
  type ConfigValue,
  getConfig,
  getDefaultValue,
  getRawDefaultConfig,
  setConfig,
} from "@/config";

export function SwitchField({
  configKey,
  label,
  description,
}: {
  configKey: ConfigKeysWithUIType<"switch">;
  label: string;
  description: string;
}) {
  const [value, setValue] = useState<ConfigValue<typeof configKey> | null>(
    null
  );

  useEffect(() => {
    getConfig(configKey, setValue);
  }, [configKey]);

  function save_value(value: ConfigValue<typeof configKey>) {
    setConfig(configKey, value);
    setValue(value);
  }

  return (
    <Switch
      label={label}
      description={description}
      checked={value ?? getDefaultValue(configKey)}
      disabled={value === null}
      onChange={(event) => save_value(event.currentTarget.checked)}
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
  const [value, setValue] = useState<ConfigValue<typeof configKey> | null>(
    null
  );

  useEffect(() => {
    getConfig(configKey, setValue);
  }, [configKey]);

  return (
    <ColorInput
      label={label}
      description={description}
      value={value ?? getDefaultValue(configKey)}
      disabled={value === null}
      onChange={(color) => {
        setConfig(configKey, color);
        setValue(color);
      }}
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
  const [value, setValue] = useState<ConfigValue<typeof configKey> | null>(
    null
  );

  const rawConfig = getRawDefaultConfig(configKey);
  const {
    min = 0,
    max = 100,
    step = 1,
  } = "ui_options" in rawConfig ? rawConfig.ui_options : {};

  useEffect(() => {
    getConfig(configKey, setValue);
  }, [configKey]);

  return (
    <NumberInput
      label={label}
      description={description}
      value={value ?? getDefaultValue(configKey)}
      disabled={value === null}
      onChange={(value) => {
        setConfig(configKey, Number(value));
        setValue(Number(value));
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
  const [value, setValue] = useState<ConfigValue<typeof configKey> | null>(
    null
  );

  const rawConfig = getRawDefaultConfig(configKey);
  const {
    min = 0,
    max = 100,
    step = 1,
  } = "ui_options" in rawConfig ? rawConfig.ui_options : {};

  useEffect(() => {
    getConfig(configKey, setValue);
  }, [configKey]);

  return (
    <Input.Wrapper label={label} description={description}>
      <Slider
        defaultValue={value ?? getDefaultValue(configKey)}
        disabled={value === null}
        onChange={(value) => {
          setConfig(configKey, value);
          setValue(value);
        }}
        min={min}
        max={max}
        step={step}
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
  const items = getDefaultValue(configKey);
  const [value, setValue] = useState<ConfigValue<typeof configKey> | null>(
    null
  );

  useEffect(() => {
    getConfig(configKey, setValue);
  }, [configKey]);

  function onCheckedChange(checked: boolean, key: string) {
    if (value === null) return;
    const index = value.findIndex((item) => item.key === key);
    if (index !== -1) {
      const newValue = [...value];
      newValue[index] = { ...newValue[index], enabled: checked };
      setConfig(configKey, newValue);
      setValue(newValue);
    }
  }

  return (
    <Checkbox.Group
      label={label}
      description={description}
      value={
        value?.filter((item) => item.enabled).map((item) => item.key) ?? []
      }
    >
      <Stack gap="sm" mt="sm">
        {items.map((item) => (
          <Checkbox
            key={item.key}
            label={item.value}
            value={item.key}
            checked={value?.find((i) => i.key === item.key)?.enabled ?? false}
            onChange={(event) =>
              onCheckedChange(event.currentTarget.checked, item.key)
            }
            disabled={value === null}
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
  const [value, setValue] = useState<ConfigValue<typeof configKey> | null>(
    null
  );

  useEffect(() => {
    getConfig(configKey, setValue);
  }, [configKey]);

  return (
    <Checkbox
      label={label}
      description={description}
      checked={value ?? false}
      disabled={value === null}
      onChange={(event) => {
        setConfig(configKey, event.currentTarget.checked);
        setValue(event.currentTarget.checked);
      }}
    />
  );
}
