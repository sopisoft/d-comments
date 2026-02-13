const OVERLAY_ID = 'd-comments-canvas-container';
const OVERLAY_STYLE: Record<string, string> = {
  display: 'block',
  height: '100%',
  inset: '0',
  overflow: 'hidden',
  pointerEvents: 'none',
  position: 'absolute',
  width: '100%',
  zIndex: '2',
};

export function queryVideoElement(): HTMLVideoElement | null {
  return document.querySelector<HTMLVideoElement>('video');
}

export function mountOverlay(video: HTMLVideoElement): {
  video: HTMLVideoElement;
  overlay: HTMLDivElement;
} {
  const existing = document.getElementById(OVERLAY_ID) as HTMLDivElement | null;
  const container = video.parentElement;
  if (existing) {
    if (container && existing.parentElement !== container) container.appendChild(existing);
    return { overlay: existing, video };
  }

  const overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;
  Object.assign(overlay.style, OVERLAY_STYLE);
  if (!container) document.body.appendChild(overlay);
  else container.appendChild(overlay);
  return { overlay, video };
}
