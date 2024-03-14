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
import { useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import browser from "webextension-polyfill";
import { on_messages_change } from "../state";

function Overlay() {
  const { toast, dismiss } = useToast();

  const toast_duration = 3 * 10 ** 3;
  const timer = useRef<number | null>(null);

  function ErrorMessage(props?: {
    error?: Error;
    message?: { title: string; description: string };
  }) {
    const { error, message } = props ?? {};
    toast({
      title: message?.title || error?.name || "エラー",
      description:
        message?.description ||
        error?.message ||
        "何らかのエラーが発生しました。",
    });
  }

  useEffect(() => {
    const handleBlur = () => {
      if (timer.current) clearTimeout(timer.current);

      timer.current = window.setTimeout(() => {
        dismiss();
      });
    };
    const handleFocus = () => {
      if (timer.current) clearTimeout(timer.current);
    };

    if (!document.hasFocus()) {
      timer.current = window.setTimeout(() => {
        dismiss();
      }, toast_duration);
      addEventListener("focus", handleFocus);
    }
    addEventListener("blur", handleBlur);
    addEventListener("focus", handleFocus);

    return () => {
      removeEventListener("blur", handleBlur);
      removeEventListener("focus", handleFocus);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [dismiss]);

  useEffect(() => {
    on_messages_change((_prev, next) => {
      if (next && next[next.length - 1] instanceof Error)
        ErrorMessage({ error: next[next.length - 1] as Error });
      else if (next?.[next.length - 1]) {
        ErrorMessage({
          message: next[next.length - 1] as {
            title: string;
            description: string;
          },
        });
      }
    });
  }, []);

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
