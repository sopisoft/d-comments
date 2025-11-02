import { findElement } from "@/lib/dom";
import { err, ok, type Result } from "@/lib/types";

export type WorkInfo = {
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

async function getWorkInfo(): Promise<Result<WorkInfo, Error>> {
  const partId = new URLSearchParams(location.search).get("partId")?.toString();
  const baseUrl = "https://animestore.docomo.ne.jp/animestore/rest/WS010105";
  const params = {
    viewType: "5",
    partId: partId ?? "",
    defaultPlay: "5",
  };
  const paramsStr = new URLSearchParams(params);
  const url = `${baseUrl}?${paramsStr}`;
  return fetch(url, {
    method: "GET",
    cache: "no-cache",
  })
    .then((res) => res.json() as Promise<WorkInfo>)
    .then((data) => ok(data))
    .catch((error: unknown) =>
      err(
        error instanceof Error
          ? error
          : new Error(`Failed to fetch work info: ${String(error)}`)
      )
    );
}

/**
 * 視聴ページで title と description をパートタイトルと説明に書き換える
 */
export async function updateWorkInfo(): Promise<Result<WorkInfo, Error>> {
  const res = await getWorkInfo();
  if (!res.ok) return res;

  const info = res.value;

  if (!info.data || typeof info.data !== "object") {
    return err(new Error("Invalid workInfo response: missing data property"));
  }

  const { title, partExp, workTitle } = info.data;
  const description = partExp ? partExp : workTitle;

  const titleEl = await findElement("title");
  if (titleEl) titleEl.textContent = title;
  const descriptionEl = await findElement("meta[name=Description]");
  if (descriptionEl) descriptionEl.setAttribute("content", description);

  return ok(info);
}
