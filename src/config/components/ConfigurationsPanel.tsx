import { Divider, Stack } from "@mantine/core";
import { memo } from "react";
import { type ConfigKeysWithUIType, getUiType } from "../defaults";
import { useTheme } from "../hooks/useTheme";
import { configSections, type SectionDefinition, type SectionField } from "../sections";
import { CheckboxGroupField, NumberField, SegmentedControlField, SliderField, SwitchField } from "./Fields";
import { SectionCard } from "./SectionCard";

const renderField = (f: SectionField) => {
  const kind = getUiType(f.configKey);
  switch (kind) {
    case "switch":
      return (
        <SwitchField
          configKey={f.configKey as ConfigKeysWithUIType<"switch">}
          label={f.label}
          description={f.description}
        />
      );
    case "number":
      return (
        <NumberField
          configKey={f.configKey as ConfigKeysWithUIType<"number">}
          label={f.label}
          description={f.description}
        />
      );
    case "slider":
      return (
        <SliderField
          configKey={f.configKey as ConfigKeysWithUIType<"slider">}
          label={f.label}
          description={f.description}
        />
      );
    case "checkbox_group":
      return (
        <CheckboxGroupField
          configKey={f.configKey as ConfigKeysWithUIType<"checkbox_group">}
          label={f.label}
          description={f.description}
        />
      );
    case "segmented_control":
      return (
        <SegmentedControlField
          configKey={f.configKey as ConfigKeysWithUIType<"segmented_control">}
          label={f.label}
          description={f.description}
        />
      );
  }
};

const ConfigSection = memo(({ section, dividerColor }: { section: SectionDefinition; dividerColor: string }) => (
  <SectionCard icon={section.icon} title={section.title} description={section.description}>
    <Stack gap="lg">
      <Divider color={dividerColor} />
      {section.fields.map((f) => (
        <div key={f.configKey}>{renderField(f)}</div>
      ))}
    </Stack>
  </SectionCard>
));

export function ConfigurationsPanel() {
  const { styles: ps } = useTheme();
  return (
    <Stack gap="xl" align="center">
      {configSections.map((s) => (
        <ConfigSection key={s.key} section={s} dividerColor={ps.border.subtle} />
      ))}
    </Stack>
  );
}
