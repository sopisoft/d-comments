import { createRoot, type Root } from "react-dom/client";
import { findElement } from "@/lib/dom";

export async function videoWrapper(): Promise<Root | undefined> {
  const video = await findElement<HTMLVideoElement>("video");
  if (!video) return undefined;

  const lookupHost = () => video.parentElement?.parentElement ?? null;
  let host = lookupHost();
  if (!host || !document.body.contains(host)) {
    host = await new Promise<HTMLElement | null>((resolve) => {
      const observer = new MutationObserver(() => {
        const candidate = lookupHost();
        if (candidate && document.body.contains(candidate)) {
          observer.disconnect();
          resolve(candidate);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      window.setTimeout(() => {
        observer.disconnect();
        resolve(null);
      }, 10_000);
    });
  }
  if (!host) return undefined;

  let wrapper = document.getElementById("d-comments-wrapper");
  if (!wrapper) {
    wrapper = document.createElement("div");
    wrapper.id = "d-comments-wrapper";
    Object.assign(wrapper.style, {
      display: "flex",
      flexDirection: "row",
      maxWidth: "100%",
      width: "100%",
      maxHeight: "100%",
      height: "100%",
      overflow: "hidden",
    });
  }

  const container = video.parentElement;
  if (!container) return undefined;
  if (container.parentElement !== wrapper) {
    host.insertBefore(wrapper, container);
    wrapper.append(container);
  }

  let sideMenu = document.getElementById("d-comments-side");
  if (!sideMenu) {
    sideMenu = document.createElement("div");
    sideMenu.id = "d-comments-side";
    Object.assign(sideMenu.style, {
      backgroundColor: "rgb(0, 0, 0)",
      zIndex: "10",
    });
    wrapper.append(sideMenu);
  } else if (!sideMenu.parentElement) {
    wrapper.append(sideMenu);
  }

  return createRoot(sideMenu);
}
