/*
    This file is part of d-comments.

    d-comments is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    d-comments is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with d-comments.  If not, see <https://www.gnu.org/licenses/>.
*/

import { getConfig } from "@/config";
import browser from "webextension-polyfill";

import comments_ngfilter from "./comments_ngfilter?worker&url";
import comments_worker from "./comments_worker?worker&url";

type message = {
  comments: nv_comment[];
};

async function newWorker(url: string): Promise<Worker> {
  const script = await fetch(url).then((r) => r.text());
  const blob = new Blob([script], { type: "application/javascript" });
  const objURL = URL.createObjectURL(blob);
  const worker = new Worker(objURL, { type: "module" });
  worker.addEventListener("error", (_e) => {
    URL.revokeObjectURL(objURL);
  });
  return worker;
}

const ngfilter_worker = await newWorker(
  browser.runtime.getURL(comments_ngfilter)
);
const sort_worker = await newWorker(browser.runtime.getURL(comments_worker));

async function build_ng_filter_message(comments: nv_comment[]) {
  const id = Math.random().toString(36).slice(-8);

  const ng_words = await getConfig("comment_ng_words");
  const enabled_ng_words = ng_words.filter((w) => w.enabled);
  const regex = enabled_ng_words.map((w) => w.value).join("|");

  const ng_users = await getConfig("comment_ng_users");
  const enabled_ng_users = ng_users
    .filter((u) => u.enabled)
    .map((u) => u.value);

  if (enabled_ng_words.length === 0) {
    return {
      id: id,
      ng_words_regex: "skip-ng-words-filter",
      ng_users: enabled_ng_users,
      comments: comments,
    };
  }

  const ng_filter_message = {
    id: id,
    ng_words_regex: new RegExp(regex, "i"),
    ng_users: enabled_ng_users,
    comments: comments,
  };
  return ng_filter_message;
}
export async function ngFilter(comments: nv_comment[]): Promise<nv_comment[]> {
  const message = await build_ng_filter_message(comments);
  ngfilter_worker.postMessage(message);

  return await new Promise<nv_comment[]>((resolve) => {
    ngfilter_worker.addEventListener("message", (e) => {
      if (e.data.id === message.id) {
        resolve(e.data.comments);
      }
    });
  });
}

export async function sortComments(
  comments: nv_comment[]
): Promise<nv_comment[]> {
  sort_worker.postMessage({ comments });
  return await new Promise<nv_comment[]>((resolve) => {
    sort_worker.onmessage = (e: MessageEvent<message>) => {
      resolve(e.data.comments);
    };
  });
}
