import type { Options, V1Thread } from "@xpadev-net/niconicomments";
import NiconiComments from "@xpadev-net/niconicomments";
import { getConfig, watchConfig } from "@/config";
import { find_element } from "@/lib/dom";

const canvas_id = "d-comments-canvas";
export class CommentRenderer {
  readonly canvas: HTMLCanvasElement;
  readonly video: HTMLVideoElement;
  private NiconiComments: NiconiComments;
  private options: Options;
  private threads: V1Thread[];
  private req: number | null = null;
  private last = 0;
  private fps = 30;
  private offset = 0;

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
  }
  start() {
    this.destroy();
    this.NiconiComments = new NiconiComments(
      this.canvas,
      this.threads,
      this.options
    );
    this.req = requestAnimationFrame(this.render.bind(this));
  }
  private render(timestamp: number) {
    const delta = timestamp - this.last;
    if (delta >= 1000 / this.fps) {
      this.NiconiComments.drawCanvas(
        Math.floor((this.video.currentTime + this.offset) * 100)
      );
      this.last = timestamp;
    }
    this.req = requestAnimationFrame(this.render.bind(this));
  }
  setThreads(threads: V1Thread[]) {
    this.NiconiComments = new NiconiComments(
      this.canvas,
      threads,
      this.options
    );
    this.threads = threads;
    this.start();
  }
  setOffset(offset: number) {
    this.offset = offset;
    this.start();
  }
  setOptions(options: Options) {
    this.NiconiComments = new NiconiComments(
      this.canvas,
      this.threads,
      options
    );
    this.options = options;
    this.start();
  }
  getOptions() {
    return this.options;
  }
  destroy() {
    this.NiconiComments.clear();
    if (this.req !== null) cancelAnimationFrame(this.req);
    this.req = null;
    this.last = 0;
  }
  setCommentsVisibility(visible: boolean) {
    visible ? this.start() : this.destroy();
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

async function initCommentRenderer(): Promise<CommentRenderer | Error> {
  const video = await find_element<HTMLVideoElement>("video");
  if (!video) return new Error("video element not found");
  const canvas = await getCanvas(video);

  const scale = (await getConfig("nicoarea_scale")) / 100;
  const options: Options = {
    format: "v1",
    scale: scale,
    keepCA: true,
  };
  const renderer = new CommentRenderer(canvas, video, options);

  watchConfig("comment_area_opacity_percentage", (value) => {
    const opacity = value / 100;
    canvas.style.opacity = opacity.toString();
  });
  watchConfig("nicoarea_scale", (value) => {
    const scale = value / 100;
    renderer.setOptions({ ...renderer.getOptions(), scale });
  });
  watchConfig("show_comments_in_niconico_style", (value) => {
    renderer.setCommentsVisibility(value);
  });
  watchConfig("comment_timing_offset", (value) => {
    renderer.setOffset(value);
  });

  renderer.setOffset(await getConfig("comment_timing_offset"));

  await getConfig("show_comments_in_niconico_style").then((v) =>
    renderer.setCommentsVisibility(v)
  );

  return renderer;
}

export default initCommentRenderer;
