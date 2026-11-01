import { ChevronRight } from "lucide-react";

export function Solution({ title = "Lihat solusi", children }: { title?: string; children: React.ReactNode }) {
  return (
    <details className="group my-4 overflow-hidden rounded-md border border-dashed border-border-strong bg-card open:border-solid">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 px-4 py-2 text-sm font-semibold text-foreground select-none hover:bg-surface [&::-webkit-details-marker]:hidden">
        <ChevronRight className="size-4 text-muted-foreground transition-transform group-open:rotate-90" aria-hidden />
        {title}
      </summary>
      <div className="border-t border-dashed border-border-strong px-4 py-1 sm:px-5 [&>:first-child]:mt-3 [&>:last-child]:mb-3">
        {children}
      </div>
    </details>
  );
}
