"use client";

import { buttonClass } from "@/components/ui/button";

export function PrintButton({ icon }: { icon?: React.ReactNode }) {
  return (
    <button type="button" onClick={() => window.print()} className={buttonClass("outline", "md")}>
      {icon} Cetak / simpan PDF
    </button>
  );
}
