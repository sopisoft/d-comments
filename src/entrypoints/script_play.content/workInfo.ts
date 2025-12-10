import { findElement } from "@/lib/dom";
import { err, ok, type Result, toError } from "@/lib/types";

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

const getWorkInfo = async (): Promise<Result<WorkInfo, Error>> => {
  const partId = new URLSearchParams(location.search).get("partId") ?? "";
  const params = new URLSearchParams({
    viewType: "5",
    partId,
    defaultPlay: "5",
  });
  const url = `https://animestore.docomo.ne.jp/animestore/rest/WS010105?${params}`;
  return fetch(url, { method: "GET", cache: "no-cache" })
    .then((res) => res.json() as Promise<WorkInfo>)
    .then(ok)
    .catch((e) => err(new Error(`Failed to fetch work info: ${toError(e).message}`)));
};

/** 視聴ページで title と description をパートタイトルと説明に書き換える */
export const updateWorkInfo = async (): Promise<Result<WorkInfo, Error>> => {
  const res = await getWorkInfo();
  if (!res.ok) return res;
  const { data } = res.value;
  if (!data || typeof data !== "object") {
    return err(new Error("Invalid workInfo response: missing data property"));
  }
  const { title, partExp, workTitle } = data;
  const titleEl = await findElement("title");
  if (titleEl) titleEl.textContent = title;
  const descEl = await findElement("meta[name=Description]");
  if (descEl) descEl.setAttribute("content", partExp || workTitle);
  return res;
};
