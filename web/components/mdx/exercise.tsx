"use client";

import { useEffect, useRef, useState } from "react";
import { Lightbulb, PencilLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { InlineText } from "./inline-text";

const difficultyMeta = {
  mudah: { dots: "●○○", tone: "text-success" },
  sedang: { dots: "●●○", tone: "text-warning" },
  sulit: { dots: "●●●", tone: "text-danger" },
} as const;

export function Exercise({
  title,
  difficulty = "sedang",
  hints = [],
  children,
}: {
  title: string;
  difficulty?: keyof typeof difficultyMeta;
  hints?: string[];
  children: React.ReactNode;
}) {
  const [shown, setShown] = useState(0);
  const lastHintRef = useRef<HTMLLIElement>(null);
  const focusLastHint = useRef(false);
  const d = difficultyMeta[difficulty] ?? difficultyMeta.sedang;

  useEffect(() => {
    if (!focusLastHint.current) return;
    focusLastHint.current = false;
    lastHintRef.current?.focus();
  }, [shown]);

  return (
    <section className="my-9 overflow-hidden rounded-md border border-border-strong bg-card shadow-notebook">
      <header className="border-b border-border px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
          <p className="!my-0 flex items-center gap-1.5 font-mono text-[0.6875rem] leading-5 font-semibold tracking-[0.12em] text-primary uppercase">
            <PencilLine className="size-3.5" strokeWidth={2.25} aria-hidden /> Latihan
          </p>
          <p className="!my-0 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
            <span className="sr-only">Tingkat kesulitan:</span>
            <span className={cn("tracking-[0.12em]", d.tone)} aria-hidden>
              {d.dots}
            </span>
            {difficulty}
          </p>
        </div>
        <p className="!mt-1 !mb-0 font-serif text-[1.0625rem] leading-snug font-semibold text-pretty text-foreground sm:text-lg">
          {title}
        </p>
      </header>
      <div className="px-4 py-1 sm:px-5 [&>:first-child]:mt-4 [&>:last-child]:mb-4">{children}</div>
      {hints.length > 0 ? (
        <div className="border-t border-dashed border-border-strong bg-surface/60 px-4 py-3 sm:px-5">
          {shown > 0 ? (
            <ol className="!my-0 mb-3 !list-none space-y-2.5 !pl-0">
              {hints.slice(0, shown).map((hint, i) => {
                const isLast = i === hints.length - 1;
                return (
                  <li
                    key={i}
                    ref={isLast ? lastHintRef : undefined}
                    tabIndex={isLast ? -1 : undefined}
                    className="!my-0 border-l-2 border-accent !pl-3 text-sm leading-relaxed animate-fade-in"
                  >
                    <span className="block font-mono text-[0.6875rem] font-semibold tracking-[0.1em] text-accent uppercase">
                      Petunjuk {i + 1}
                    </span>
                    <InlineText text={hint} />
                  </li>
                );
              })}
            </ol>
          ) : null}
          {shown < hints.length ? (
            <button
              type="button"
              onClick={() => {
                // Tombol ini hilang setelah petunjuk terakhir dibuka, jadi fokus dipindah ke petunjuk itu.
                if (shown + 1 >= hints.length) focusLastHint.current = true;
                setShown((n) => n + 1);
              }}
              className={cn(
                "inline-flex min-h-11 items-center gap-2 rounded-md border border-border-strong bg-card px-3.5 text-sm font-medium text-foreground transition-colors hover:bg-surface",
                shown > 0 && "mt-3",
              )}
            >
              <Lightbulb className="size-4 text-accent" aria-hidden />
              {shown === 0 ? "Lihat petunjuk" : "Petunjuk berikutnya"}
              <span className="font-mono text-xs text-muted-foreground">
                {shown}/{hints.length}
              </span>
            </button>
          ) : (
            <p className="!my-0 mt-3 text-xs text-muted-foreground">
              Semua petunjuk sudah dibuka. Coba kerjakan sendiri dulu sebelum membuka solusi.
            </p>
          )}
        </div>
      ) : null}
    </section>
  );
}
