"use client";

import { Children, isValidElement, useId } from "react";
import { Tabs as RTabs } from "radix-ui";
import { cn } from "@/lib/utils";

export function Tabs({ items, children }: { items: string[]; children: React.ReactNode }) {
  const panels = Children.toArray(children).filter(isValidElement);
  const base = useId();
  return (
    <RTabs.Root defaultValue={`${base}-0`} className="my-7 overflow-hidden rounded-md border border-border bg-card">
      <RTabs.List
        aria-label="Pilihan"
        className="flex overflow-x-auto border-b border-border px-1 no-scrollbar scroll-shadow-x [--scroll-shadow-bg:var(--surface)]"
      >
        {items.map((label, i) => (
          <RTabs.Trigger
            key={label}
            value={`${base}-${i}`}
            className={cn(
              "relative min-h-11 shrink-0 px-3.5 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-offset-[-2px]",
              "data-[state=active]:font-semibold data-[state=active]:text-foreground data-[state=active]:after:absolute data-[state=active]:after:inset-x-2 data-[state=active]:after:bottom-0 data-[state=active]:after:h-0.5 data-[state=active]:after:bg-primary",
            )}
          >
            {label}
          </RTabs.Trigger>
        ))}
      </RTabs.List>
      {panels.map((panel, i) => (
        <RTabs.Content
          key={i}
          value={`${base}-${i}`}
          className="px-4 py-1 sm:px-5 [&_[data-rehype-pretty-code-figure]]:my-3"
        >
          {panel}
        </RTabs.Content>
      ))}
    </RTabs.Root>
  );
}

export function Tab({ children }: { children: React.ReactNode }) {
  return <div className="[&>:first-child]:mt-3 [&>:last-child]:mb-3">{children}</div>;
}
