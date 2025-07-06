import { find_element } from "@/lib/dom";
import { isError } from "@/lib/utils";

type WorkInfo = {
  version: number;
  data: {
    partId: string;
    workTitle: string;
    workTitleKana: string;
    mainKeyVisualPath: string;
    partDispNumber: string;
    partExp: string;
    partTitle: string;
    title: string;
    mainScenePath: string;
  };
};

async function getWorkInfo(): Promise<WorkInfo | Error> {
  const partId = new URLSearchParams(location.search).get("partId")?.toString();
  const base_url = "https://animestore.docomo.ne.jp/animestore/rest/WS010105";
  const params = {
    viewType: "5",
    partId: partId ?? "",
    defaultPlay: "5",
  };
  const params_str = new URLSearchParams(params);
  const url = `${base_url}?${params_str}`;
  const res = await fetch(url, {
    method: "GET",
    cache: "no-cache",
  })
    .then(async (res) => {
      return (await res.json()) as WorkInfo;
    })
    .catch((e) => {
      return e as Error;
    });
  return res;
}

/**
 * 視聴ページで title と description をパートタイトルと説明に書き換える
 */
export async function updateWorkInfo(): Promise<WorkInfo | Error> {
  const res = await getWorkInfo();
  if (isError(res)) return res;

  const { title, partExp, workTitle } = res.data;
  const description = partExp ? partExp : workTitle;

  const titleEl = await find_element("title");
  if (titleEl) titleEl.textContent = title;
  const descriptionEl = await find_element("meta[name=Description]");
  if (descriptionEl) descriptionEl.setAttribute("content", description);

  return res;
}
