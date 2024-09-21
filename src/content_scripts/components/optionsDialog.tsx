import Options from "@/options/components/options";
import { useEffect, useRef } from "react";

function Dialog(props: {
  open: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    function open() {
      if (ref.current) {
        const dialog = ref.current;
        dialog.showModal();
        dialog
          .animate(
            [
              { transform: "scale(0.9)", opacity: 0 },
              { transform: "scale(1)", opacity: 1 },
            ],
            {
              duration: 200,
              easing: "ease-in-out",
              fill: "forwards",
            }
          )
          .finished.then(() => {
            dialog.focus();
          });
      }
    }
    function close() {
      if (ref.current) {
        const dialog = ref.current;
        dialog
          .animate(
            [
              { transform: "scale(1)", opacity: 1 },
              { transform: "scale(0.9)", opacity: 0 },
            ],
            {
              duration: 200,
              easing: "ease-in-out",
              fill: "forwards",
            }
          )
          .finished.then(() => {
            dialog.close();
            props.onClose();
          });
      }
    }

    props.open ? open() : close();

    ref.current?.addEventListener("click", (e) => {
      if (e.target === ref.current) close();
    });
    ref.current?.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
    ref.current?.addEventListener("close", () => {
      props.onClose();
    });
  }, [props.open, props.onClose]);

  return (
    <dialog
      ref={ref}
      className="w-4/5 max-w-4xl h-4/5 bg-white rounded-lg shadow-lg"
    >
      <Options />
    </dialog>
  );
}

export default Dialog;
