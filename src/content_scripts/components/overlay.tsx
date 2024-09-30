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

import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { createRoot } from "react-dom/client";
import browser from "webextension-polyfill";
import { on_messages_change } from "../state";

function Overlay() {
  const { toast, dismiss } = useToast();

  const toast_duration = 2 * 10 ** 3;

  on_messages_change((_, next) => {
    const next_message = next?.[next.length - 1];
    if (next && next_message instanceof Error) {
      toast({
        title: next_message.name,
        description: next_message.message,
        duration: toast_duration,
      });
      setTimeout(dismiss, toast_duration);
    } else if (next_message) {
      const message = next_message as { title?: string; description?: string };
      message.title = message.title ?? "Message";
      message.description = message.description ?? "No description";
      toast({
        title: message.title,
        description: message.description,
        duration: toast_duration,
      });
      setTimeout(dismiss, toast_duration);
    }
  });

  return (
    <>
      <link
        rel="stylesheet"
        href={browser.runtime.getURL("assets/css/index.css")}
      />
      <Toaster />
    </>
  );
}

function setOverlay() {
  const overlay_id = "d-comments-overaly";
  const prev_overlay = document.getElementById(overlay_id);
  const overlay = prev_overlay ?? document.createElement("div");
  if (!prev_overlay) {
    overlay.id = overlay_id;
    Object.assign(overlay.style, {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100svw",
      height: "100svh",
      backgroundColor: "transparent",
      zIndex: "3",
    });
    document.body.appendChild(overlay);
  }

  const root = createRoot(overlay);
  root.render(<Overlay />);
}

export default setOverlay;
