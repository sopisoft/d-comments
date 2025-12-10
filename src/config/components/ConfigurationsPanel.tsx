import { Divider, Stack } from "@mantine/core";
import { memo } from "react";
import { useTheme } from "../hooks/useTheme";
import { configSections } from "../sections";
import type { SectionDefinition, SectionField } from "../sections.types";
import { CheckboxField, CheckboxGroupField, NumberField, SliderField, SwitchField } from "./Fields";
import { SectionCard } from "./SectionCard";
import { ThemeSettingsPanel } from "./ThemeSettingsPanel";

const renderField = (f: SectionField) => {
  switch (f.kind) {
    case "switch":
      return <SwitchField configKey={f.configKey} label={f.label} description={f.description} />;
    case "checkbox":
      return <CheckboxField configKey={f.configKey} label={f.label} description={f.description} />;
    case "number":
      return <NumberField configKey={f.configKey} label={f.label} description={f.description} />;
    case "slider":
      return <SliderField configKey={f.configKey} label={f.label} description={f.description} />;
    case "checkbox_group":
      return <CheckboxGroupField configKey={f.configKey} label={f.label} description={f.description} />;
    case "theme_settings":
      return <ThemeSettingsPanel />;
  }
};

const ConfigSection = memo(({ section, dividerColor }: { section: SectionDefinition; dividerColor: string }) => (
  <SectionCard icon={section.icon} title={section.title} description={section.description}>
    <Stack gap="lg">
      <Divider color={dividerColor} />
      {section.fields.map((f) => (
        <div key={f.id}>{renderField(f)}</div>
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
