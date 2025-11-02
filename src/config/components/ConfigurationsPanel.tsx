import { Fieldset, Stack, Title } from "@mantine/core";
import { memo } from "react";
import {
  configSections,
  type SectionDefinition,
  type SectionField,
} from "../sections";
import {
  CheckboxField,
  CheckboxGroupField,
  ColorField,
  NumberField,
  SliderField,
  SwitchField,
} from "./Fields";

const renderField = (field: SectionField) => {
  switch (field.kind) {
    case "switch":
      return (
        <SwitchField
          configKey={field.configKey}
          label={field.label}
          description={field.description}
        />
      );
    case "checkbox":
      return (
        <CheckboxField
          configKey={field.configKey}
          label={field.label}
          description={field.description}
        />
      );
    case "number":
      return (
        <NumberField
          configKey={field.configKey}
          label={field.label}
          description={field.description}
        />
      );
    case "slider":
      return (
        <SliderField
          configKey={field.configKey}
          label={field.label}
          description={field.description}
        />
      );
    case "color":
      return (
        <ColorField
          configKey={field.configKey}
          label={field.label}
          description={field.description}
        />
      );
    case "checkbox_group":
      return (
        <CheckboxGroupField
          configKey={field.configKey}
          label={field.label}
          description={field.description}
        />
      );
  }
};

const ConfigField = memo(({ field }: { field: SectionField }) =>
  renderField(field)
);

const sectionStyle = {
  width: "100%",
  maxWidth: "56rem",
  margin: "0 auto",
} as const;

const ConfigSection = memo(({ section }: { section: SectionDefinition }) => (
  <Fieldset
    radius="md"
    p="lg"
    style={sectionStyle}
    legend={<Title order={3}>{section.title}</Title>}
  >
    <Stack gap="lg">
      {section.fields.map((field) => (
        <ConfigField key={field.id} field={field} />
      ))}
    </Stack>
  </Fieldset>
));

export function ConfigurationsPanel() {
  return (
    <Stack gap="xl" align="center">
      {configSections.map((section) => (
        <ConfigSection key={section.key} section={section} />
      ))}
    </Stack>
  );
}
