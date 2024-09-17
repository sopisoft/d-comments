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

import { type config_keys, getConfig } from "@/config";
import NiconiComments from "@xpadev-net/niconicomments";
import type { Options, V1Thread } from "@xpadev-net/niconicomments";
import browser from "webextension-polyfill";
import { find_element } from "../danime/dom";
import {
  threads as getThreads,
  on_partId_change,
  on_threads_change,
} from "../state";

const canvas_id = "d-comments-canvas";

export class Interval {
  private id: number | null;
  private last = 0;
  private fps: number;
  private callback: () => void;
  constructor(fps: number, callback: () => void) {
    this.id = null;
    this.fps = fps;
    this.callback = callback;
  }
  start() {
    if (this.id) return;
    const loop = (timestamp: number) => {
      const delta = timestamp - this.last;
      if (delta > 1000 / this.fps) {
        this.callback();
        this.last = timestamp;
      }
      this.id = requestAnimationFrame(loop);
    };
    this.id = requestAnimationFrame(loop);
  }
  stop() {
    if (!this.id) return;
    cancelAnimationFrame(this.id);
    this.id = null;
  }
  changeFPS(fps: number) {
    this.fps = fps;
    this.stop();
    this.start();
  }
}

export class Renderer {
  private canvas: HTMLCanvasElement;
  private video: HTMLVideoElement;
  private NiconiComments: NiconiComments;
  private options: Options;
  private threads: V1Thread[];
  private interval: Interval;
  constructor(
    canvas: HTMLCanvasElement,
    video: HTMLVideoElement,
    options: Options
  ) {
    this.canvas = canvas;
    this.video = video;
    const threads: V1Thread[] = [];
    this.NiconiComments = new NiconiComments(canvas, threads, options);
    this.threads = threads;
    this.options = options;
    this.interval = new Interval(60, () => {
      this.render();
    });
  }
  start() {
    this.NiconiComments = new NiconiComments(
      new NiconiComments.internal.renderer.CanvasRenderer(this.canvas),
      this.threads,
      this.options
    );
    this.interval.start();
  }
  private render() {
    this.NiconiComments.drawCanvas(Math.floor(this.video.currentTime * 100));
    if (this.options.format !== "v1") {
      console.error("format should be v1");
    }
  }
  setThread(threads: V1Thread[]) {
    this.threads = threads;
    this.start();
  }
  setOptions(options: Options) {
    this.options = options;
    this.start();
  }
  getOptions() {
    return this.options;
  }
  destroy() {
    this.NiconiComments.clear();
    this.interval.stop();
  }
}

async function getCanvas(video: HTMLVideoElement): Promise<HTMLCanvasElement> {
  const canvas = document.getElementById(canvas_id) as HTMLCanvasElement;
  if (!canvas) {
    const canvas = document.createElement("canvas");
    const opacity = (await getConfig("comment_area_opacity_percentage")) / 100;
    canvas.id = canvas_id;
    canvas.width = 1920;
    canvas.height = 1080;
    Object.assign(canvas.style, {
      objectFit: "contain",
      width: "100%",
      height: "100%",
      position: "absolute",
      opacity: opacity.toString(),
      zIndex: "2",
    });
    const parent = video?.parentElement;
    const parent_parent = parent?.parentElement;
    while (!parent_parent || !document.body.contains(parent_parent)) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    parent.appendChild(canvas);
    return canvas;
  }
  return canvas;
}

async function initRenderer() {
  const video = await find_element<HTMLVideoElement>("video");
  if (!video) return new Error("video element not found");
  const canvas = await getCanvas(video);

  const scale = (await getConfig("nicoarea_scale")) / 100;
  const options: Options = {
    format: "v1",
    scale: scale,
  };
  const renderer = new Renderer(canvas, video, options);

  on_threads_change(async (_prev, next) => {
    console.log("on_threads_change_canvas", next);
    if (!next) return;
    renderer.setThread(next.threads);
  });
  on_partId_change(() => {
    console.log("on_partId_change_canvas");
    renderer.destroy();
  });

  browser.storage.onChanged.addListener(async (changes) => {
    for (const key in changes) {
      switch (key as config_keys) {
        case "comment_area_opacity_percentage": {
          if (changes[key].newValue) {
            const opacity = Number(changes[key].newValue) / 100;
            canvas.style.opacity = opacity.toString();
          }
          break;
        }
        case "nicoarea_scale": {
          if (changes[key].newValue) {
            const scale = Number(changes[key].newValue) / 100;
            renderer.setOptions({ ...renderer.getOptions(), scale });
          }
          break;
        }
        case "show_comments_in_niconico_style": {
          if (changes[key].newValue) {
            renderer.start();
          } else {
            renderer.destroy();
          }
          break;
        }
      }
    }
  });

  if (!(await getConfig("show_comments_in_niconico_style"))) return;
  const threads = getThreads()?.threads;
  if (threads) renderer.setThread(threads);
}

export default initRenderer;
