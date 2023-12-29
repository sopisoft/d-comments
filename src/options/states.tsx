import { atom, selector, useRecoilState, useSetRecoilState } from "recoil";
import browser from "webextension-polyfill";
import * as Config from "../content_scripts/config";

const configsState = atom({
  key: "configsState",
  default: Config.getConfigsAll(),
});
const configsStateSelector = selector({
  key: configsState.key,
  get: ({ get }) => {
    const configs = get(configsState);
    return configs;
  },
  set: ({ set }, newValue) => {
    set(configsState, newValue);
  },
});

export const [configs, setConfigs] = useRecoilState(configsStateSelector);
export const setOption = (key: string, value: string | number | boolean) => {
  const defaultValue = Config.defaultConfigs.find((item) => item.key === key);
  const theOtherConfigs = configs.filter((item) => item.key !== key);
  const newConfig: Config.config = {
    key: key as Config.config["key"],
    value: value,
    type: defaultValue?.type as Config.config["type"],
    text: defaultValue?.text as Config.config["text"],
  };
  setConfigs([...theOtherConfigs, newConfig]);
};

browser.storage.onChanged.addListener((changes) => {
  for (const [key, { newValue }] of Object.entries(changes)) {
    if (newValue !== undefined) {
      setOption(key, newValue);
    }
  }
});
