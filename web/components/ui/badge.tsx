import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "primary" | "accent" | "success" | "warning" | "danger" | "info";

const tones: Record<Tone, string> = {
  neutral: "bg-surface text-muted-foreground border-border-strong",
  primary: "bg-primary-soft text-primary-soft-foreground border-primary/30",
  accent: "bg-accent-soft text-accent-soft-foreground border-accent/30",
  success: "bg-success-soft text-success border-success/35",
  warning: "bg-warning-soft text-warning border-warning/35",
  danger: "bg-danger-soft text-danger border-danger/35",
  info: "bg-info-soft text-info border-info/35",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm border px-2 py-0.5 text-xs font-semibold whitespace-nowrap [&_svg]:size-3.5",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

export const levelTone = {
  pemula: "success",
  menengah: "info",
  mahir: "accent",
  expert: "danger",
} as const;
