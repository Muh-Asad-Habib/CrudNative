import { Coffee, Flag, Info, Lightbulb, NotebookPen, OctagonAlert, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/** Catatan di pinggir buku: label tegas + garis kiri warna status. `analogi` tampil sebagai kartu kertas kuning. */
const variants = {
  info: { icon: Info, label: "Info", box: "border-l-info bg-info-soft/60", tone: "text-info" },
  tip: { icon: Lightbulb, label: "Tips", box: "border-l-success bg-success-soft/60", tone: "text-success" },
  warning: { icon: TriangleAlert, label: "Perhatian", box: "border-l-warning bg-warning-soft/50", tone: "text-warning" },
  danger: { icon: OctagonAlert, label: "Bahaya", box: "border-l-danger bg-danger-soft/70", tone: "text-danger" },
  note: { icon: NotebookPen, label: "Catatan", box: "border-l-border-strong bg-surface/70", tone: "text-muted-foreground" },
  analogi: {
    icon: Coffee,
    label: "Contoh sehari-hari",
    box: "rounded-md border border-accent/30 border-l-4 border-l-accent bg-accent-soft shadow-notebook",
    tone: "text-accent",
  },
  capstone: { icon: Flag, label: "Langkah Capstone", box: "border-l-primary bg-primary-soft/60", tone: "text-primary" },
} as const;

export type CalloutType = keyof typeof variants;

export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}) {
  const v = variants[type] ?? variants.info;
  const Icon = v.icon;
  const isAnalogy = type === "analogi";
  const showTitle = Boolean(title && title.trim().toLowerCase() !== v.label.toLowerCase());
  return (
    <aside
      className={cn(
        "my-7 px-4 py-3.5 text-[0.9375rem] leading-relaxed sm:px-5 sm:py-4",
        isAnalogy ? "sm:my-8" : "rounded-r-md border-l-[3px]",
        v.box,
      )}
    >
      <p
        className={cn(
          "!m-0 flex items-center gap-1.5 font-mono text-[0.6875rem] leading-5 font-semibold tracking-[0.12em] uppercase",
          v.tone,
        )}
      >
        <Icon className="size-3.5 shrink-0" strokeWidth={2.25} aria-hidden />
        {v.label}
      </p>
      {showTitle ? (
        <p className="!mt-1 !mb-0 font-serif text-[1.0625rem] leading-snug font-semibold text-pretty text-foreground">
          {title}
        </p>
      ) : null}
      <div
        className={cn(
          "mt-2 min-w-0 [&_p]:my-2 [&>:first-child]:mt-0 [&>:last-child]:mb-0",
          isAnalogy && "font-serif text-[1.0313rem] leading-[1.7]",
        )}
      >
        {children}
      </div>
    </aside>
  );
}
