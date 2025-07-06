import { createRoot, type Root } from "react-dom/client";
import { find_element } from "@/lib/dom";

export async function videoWrapper(): Promise<Root | undefined> {
  const video = await find_element<HTMLVideoElement>("video");
  if (!video) return;

  const wrapper_id = "d-comments-wrapper";
  const prev_wrapper = document.getElementById(wrapper_id);
  const wrapper = prev_wrapper ?? document.createElement("div");
  if (!prev_wrapper) {
    wrapper.id = wrapper_id;
    Object.assign(wrapper.style, {
      display: "flex",
      flexDirection: "row",
      maxWidth: "100%",
      width: "100%",
      maxHeight: "100%",
      height: "100%",
      overflow: "hidden",
    });

    const parent = video.parentElement;
    if (parent?.parentElement && document.body.contains(parent.parentElement)) {
      parent.before(wrapper);
      wrapper.append(parent);
    } else {
      const observer = new MutationObserver((_mutations, obs) => {
        const parent = video.parentElement;
        if (
          parent?.parentElement &&
          document.body.contains(parent.parentElement)
        ) {
          parent.before(wrapper);
          wrapper.append(parent);
          obs.disconnect();
        }
      });
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
      return;
    }
  }

  const side_menu_id = "d-comments-side";
  const prev_side_menu = document.getElementById(side_menu_id);
  const side_menu = prev_side_menu ?? document.createElement("div");
  if (!prev_side_menu) {
    side_menu.id = side_menu_id;
    Object.assign(side_menu.style, {
      backgroundColor: "rgb(0, 0, 0)",
      zIndex: "10",
    });
    wrapper.appendChild(side_menu);
  }

  const root = createRoot(side_menu);
  return root;
}
