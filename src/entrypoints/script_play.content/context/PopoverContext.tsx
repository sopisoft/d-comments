import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import type { NvCommentItem } from "@/types/api";

type PopoverContextType = {
  comment: NvCommentItem | null;
  setComment: (comment: NvCommentItem | null) => void;
  close: () => void;
};

const PopoverContext = createContext<PopoverContextType | undefined>(undefined);

export function PopoverProvider({ children }: { children: ReactNode }) {
  const [comment, setComment] = useState<NvCommentItem | null>(null);

  const close = () => setComment(null);

  return (
    <PopoverContext.Provider value={{ comment, setComment, close }}>
      {children}
    </PopoverContext.Provider>
  );
}

export function usePopover() {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error("usePopover must be used within PopoverProvider");
  }
  return context;
}
