import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-lg border border-border bg-card text-foreground", className)}
      {...props}
    />
  );
}

export function ProgressBar({
  value,
  className,
  tone = "primary",
  label,
}: {
  value: number;
  className?: string;
  tone?: "primary" | "accent" | "success";
  label?: string;
}) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  const color = tone === "accent" ? "bg-accent" : tone === "success" ? "bg-success" : "bg-primary";
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={v}
      aria-label={label ?? "Progres"}
      className={cn("h-2 w-full overflow-hidden rounded-[2px] bg-surface-2 ring-1 ring-border ring-inset", className)}
    >
      <div className={cn("h-full transition-[width] duration-500 ease-out", color)} style={{ width: `${v}%` }} />
    </div>
  );
}

export function Kbd({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        "inline-flex h-5 min-w-5 items-center justify-center rounded-[3px] border border-b-2 border-border-strong bg-card px-1 font-mono text-xs font-medium text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
