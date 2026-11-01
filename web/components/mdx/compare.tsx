import { CircleCheck, CircleMinus, CircleX } from "lucide-react";
import { cn } from "@/lib/utils";

export function Compare({ children }: { children: React.ReactNode }) {
  return <div className="my-7 grid gap-3 md:grid-cols-2">{children}</div>;
}

const tones = {
  good: { icon: CircleCheck, top: "border-t-success", head: "text-success" },
  bad: { icon: CircleX, top: "border-t-danger", head: "text-danger" },
  neutral: { icon: CircleMinus, top: "border-t-subtle-foreground", head: "text-muted-foreground" },
} as const;

export function CompareItem({
  title,
  tone = "neutral",
  children,
}: {
  title: string;
  tone?: keyof typeof tones;
  children: React.ReactNode;
}) {
  const t = tones[tone] ?? tones.neutral;
  const Icon = t.icon;
  return (
    <div className={cn("min-w-0 overflow-hidden rounded-md border border-t-[3px] border-border bg-card", t.top)}>
      <p className={cn("!my-0 flex items-start gap-2 border-b border-dashed border-border px-4 py-2.5 text-sm leading-snug font-semibold", t.head)}>
        <Icon className="mt-px size-4 shrink-0" aria-hidden />
        <span className="min-w-0">{title}</span>
      </p>
      <div className="px-4 py-1 text-[0.9375rem] [&>:first-child]:mt-3 [&>:last-child]:mb-3 [&_[data-rehype-pretty-code-figure]]:my-3">
        {children}
      </div>
    </div>
  );
}
