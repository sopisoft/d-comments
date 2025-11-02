const OVERLAY_ID = "d-comments-canvas-container";
const OVERLAY_STYLE: Record<string, string> = {
  position: "absolute",
  inset: "0",
  width: "100%",
  height: "100%",
  display: "block",
  overflow: "hidden",
  pointerEvents: "none",
  zIndex: "2",
};

export function queryVideoElement(): HTMLVideoElement | null {
  return document.querySelector<HTMLVideoElement>("video");
}

export function mountOverlay(video: HTMLVideoElement): {
  video: HTMLVideoElement;
  overlay: HTMLDivElement;
} {
  const current = document.getElementById(OVERLAY_ID);
  current?.remove();

  const container = video.parentElement;
  if (!container) {
    const overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    Object.assign(overlay.style, OVERLAY_STYLE);
    document.body.appendChild(overlay);
    return { video, overlay };
  }

  const overlay = document.createElement("div");
  overlay.id = OVERLAY_ID;
  Object.assign(overlay.style, OVERLAY_STYLE);
  container.appendChild(overlay);

  return { video, overlay };
}
