"use client";

import { useEffect } from "react";
import { useProgress } from "@/lib/progress-store";
import { useUI } from "@/lib/ui-store";
import { SearchDialog } from "@/components/layout/search-dialog";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    void useProgress.persist.rehydrate();

    const onStorage = (e: StorageEvent) => {
      if (e.key === useProgress.persist.getOptions().name) void useProgress.persist.rehydrate();
    };
    window.addEventListener("storage", onStorage);

    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        useUI.getState().setSearchOpen(!useUI.getState().searchOpen);
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        useUI.getState().setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <>
      {children}
      <SearchDialog />
    </>
  );
}
