"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { setThemeChoice, useThemeChoice, type ThemeChoice } from "@/lib/theme";
import { cn } from "@/lib/utils";

const order: ThemeChoice[] = ["light", "dark", "system"];
const meta = {
  light: { icon: Sun, label: "Terang" },
  dark: { icon: Moon, label: "Gelap" },
  system: { icon: Monitor, label: "Ikuti sistem" },
} as const;

/** Tombol siklus tema: terang → gelap → sistem. */
export function ThemeToggle({ className }: { className?: string }) {
  const choice = useThemeChoice();
  const next = order[(order.indexOf(choice) + 1) % order.length];
  const Icon = meta[choice].icon;
  return (
    <button
      type="button"
      onClick={() => setThemeChoice(next)}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground",
        className,
      )}
      aria-label={`Tema: ${meta[choice].label}. Ganti ke ${meta[next].label}`}
      title={`Tema: ${meta[choice].label}`}
    >
      <Icon className="size-[18px]" aria-hidden />
    </button>
  );
}

/** Pilihan tema tersegmentasi (untuk menu mobile). */
export function ThemeSegmented() {
  const choice = useThemeChoice();
  return (
    <div role="radiogroup" aria-label="Pilih tema" className="grid grid-cols-3 gap-1 rounded-md border border-border bg-surface p-1">
      {order.map((c) => {
        const Icon = meta[c].icon;
        const active = c === choice;
        return (
          <button
            key={c}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setThemeChoice(c)}
            className={cn(
              "flex h-11 items-center justify-center gap-1.5 rounded-[4px] border text-xs font-semibold transition-colors",
              active
                ? "border-border-strong bg-card text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden />
            {meta[c].label.split(" ")[0]}
          </button>
        );
      })}
    </div>
  );
}
