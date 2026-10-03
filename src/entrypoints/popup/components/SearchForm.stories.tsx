import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { getConfig, setConfig } from "@/config/storage";
import { SearchForm } from "./SearchForm";

const meta = {
  title: "Popup/SearchForm",
  component: SearchForm,
  parameters: { popup: true },
  args: { addVideos: async () => {}, initialWord: "まちカドまぞく" },
} satisfies Meta<typeof SearchForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const searchInteraction: Story = {
  beforeEach: async ({ parameters }) => {
    const originalAutoSearch = await getConfig("auto_search");
    const originalSendMessage = browser.runtime.sendMessage;
    await setConfig("auto_search", parameters.autoSearch);
    browser.runtime.sendMessage = fn(async () => ({
      ok: true,
      value: { meta: { status: 200, totalCount: 0 }, data: [] },
    }));
    return async () => {
      browser.runtime.sendMessage = originalSendMessage;
      await setConfig("auto_search", originalAutoSearch);
    };
  },
  play: async ({ canvasElement, parameters }) => {
    const canvas = within(canvasElement);
    const initialSearchCount = parameters.autoSearch ? 1 : 0;
    if (parameters.autoSearch) {
      await waitFor(() =>
        expect(browser.runtime.sendMessage).toHaveBeenCalledTimes(1),
      );
      await expect(browser.runtime.sendMessage).toHaveBeenLastCalledWith({
        type: "search",
        payload: expect.objectContaining({
          q: "まちカドまぞく",
          _sort: "-commentCounter",
        }),
      });
    }

    const input = canvas.getByRole("textbox", { name: "検索ワード" });
    await userEvent.clear(input);
    await userEvent.type(input, "ゆるキャン");
    await userEvent.click(canvas.getByRole("combobox", { name: "並び替え" }));
    await userEvent.click(
      within(document.body).getByRole("option", { name: "再生数" }),
    );
    await userEvent.click(canvas.getByRole("combobox", { name: "並び順" }));
    await userEvent.click(
      within(document.body).getByRole("option", { name: "昇順（小 → 大）" }),
    );
    await expect(browser.runtime.sendMessage).toHaveBeenCalledTimes(
      initialSearchCount,
    );

    await userEvent.click(canvas.getByRole("button", { name: "検索" }));
    await waitFor(() =>
      expect(browser.runtime.sendMessage).toHaveBeenCalledTimes(
        initialSearchCount + 1,
      ),
    );
    await expect(browser.runtime.sendMessage).toHaveBeenLastCalledWith({
      type: "search",
      payload: expect.objectContaining({
        q: "ゆるキャン",
        _sort: "+viewCounter",
      }),
    });

    await userEvent.clear(input);
    await userEvent.type(input, "魔法少女まどか☆マギカ");
    await expect(browser.runtime.sendMessage).toHaveBeenCalledTimes(
      initialSearchCount + 1,
    );
    await userEvent.type(input, "{Enter}");
    await waitFor(() =>
      expect(browser.runtime.sendMessage).toHaveBeenCalledTimes(
        initialSearchCount + 2,
      ),
    );
    await expect(browser.runtime.sendMessage).toHaveBeenLastCalledWith({
      type: "search",
      payload: expect.objectContaining({
        q: "魔法少女まどか☆マギカ",
        _sort: "+viewCounter",
      }),
    });
  },
};

export const AutoSearchEnabled: Story = {
  ...searchInteraction,
  parameters: { autoSearch: true },
};
export const AutoSearchDisabled: Story = {
  ...searchInteraction,
  parameters: { autoSearch: false },
};
