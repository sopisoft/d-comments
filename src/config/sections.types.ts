import type { IconType } from "react-icons";
import type { BooleanConfigKeys, ConfigKeysWithUIType } from "@/config/";
import type { UiType } from "./types";

type FieldConfigKey<K extends UiType> = K extends "switch" | "checkbox"
  ? BooleanConfigKeys<K>
  : ConfigKeysWithUIType<K>;

type FieldBase<K extends UiType> = {
  id: string;
  kind: K;
  configKey: FieldConfigKey<K>;
  label: string;
  description: string;
};

export type ThemeSettingsField = {
  id: string;
  kind: "theme_settings";
};

export type SectionField =
  | FieldBase<"switch">
  | FieldBase<"checkbox">
  | FieldBase<"number">
  | FieldBase<"slider">
  | FieldBase<"checkbox_group">
  | ThemeSettingsField;

export type SectionDefinition = {
  key: string;
  title: string;
  description?: string;
  icon?: IconType;
  fields: SectionField[];
};
