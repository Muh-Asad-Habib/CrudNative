"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Coffee, Search, X } from "lucide-react";
import type { GlossaryCategory, GlossaryEntry } from "@/lib/glossary";
import { getLessonById } from "@/lib/curriculum";
import { cn } from "@/lib/utils";

const ALL = "Semua";
type Filter = GlossaryCategory | typeof ALL;

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function firstLetter(term: string) {
  const c = term.trim().charAt(0).toUpperCase();
  return /[A-Z]/.test(c) ? c : "#";
}

export function GlossaryExplorer({ entries, categories }: { entries: GlossaryEntry[]; categories: GlossaryCategory[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>(ALL);
  const deferred = useDeferredValue(query);
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // Expose the sticky bar height so anchor targets (#jwt, #huruf-A) land just below it.
  useEffect(() => {
    const root = rootRef.current;
    const bar = barRef.current;
    if (!root || !bar || typeof ResizeObserver === "undefined") return;
    const sync = () => root.style.setProperty("--gbar-h", `${bar.offsetHeight}px`);
    sync();
    // The initial #hash jump happens before the bar is measured; re-align it once.
    const id = decodeURIComponent(window.location.hash.slice(1));
    const target = id ? document.getElementById(id) : null;
    if (target && root.contains(target)) target.scrollIntoView({ block: "start" });
    const ro = new ResizeObserver(sync);
    ro.observe(bar);
    return () => ro.disconnect();
  }, []);

  const sorted = useMemo(() => [...entries].sort((a, b) => a.term.localeCompare(b.term, "id")), [entries]);

  const filtered = useMemo(() => {
    const q = normalize(deferred.trim());
    return sorted.filter((e) => {
      if (filter !== ALL && e.category !== filter) return false;
      if (!q) return true;
      return normalize([e.term, ...(e.aliases ?? []), e.definition].join(" ")).includes(q);
    });
  }, [sorted, deferred, filter]);

  const groups = useMemo(() => {
    const map = new Map<string, GlossaryEntry[]>();
    for (const e of filtered) {
      const k = firstLetter(e.term);
      map.set(k, [...(map.get(k) ?? []), e]);
    }
    return [...map.entries()].sort(([a], [b]) => (a === "#" ? 1 : b === "#" ? -1 : a.localeCompare(b)));
  }, [filtered]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { [ALL]: entries.length };
    for (const e of entries) c[e.category] = (c[e.category] ?? 0) + 1;
    return c;
  }, [entries]);

  return (
    <div ref={rootRef}>
      <div
        ref={barRef}
        className="sticky top-[var(--header-h)] z-10 -mx-4 border-b border-border-strong bg-background px-4 py-3 sm:-mx-6 sm:px-6 [@media(max-height:30rem)]:static"
      >
        <label className="relative block">
          <span className="sr-only">Cari istilah</span>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-subtle-foreground" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari istilah, misalnya JWT"
            className="h-11 w-full min-w-0 rounded-md border border-border-strong bg-card pr-11 pl-10 text-base outline-none placeholder:text-subtle-foreground focus:border-primary focus:ring-2 focus:ring-primary/25 sm:text-sm [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute top-1/2 right-0 flex size-11 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
              aria-label="Hapus pencarian"
            >
              <X className="size-4" aria-hidden />
            </button>
          )}
        </label>
        <div
          className="-mx-4 mt-2 flex gap-1 overflow-x-auto px-4 pb-1 scrollbar-thin sm:mx-0 sm:px-0 lg:flex-wrap lg:overflow-visible lg:pb-0"
          role="group"
          aria-label="Filter kategori"
        >
          {([ALL, ...categories] as Filter[]).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              aria-pressed={filter === c}
              className={cn(
                "inline-flex h-11 shrink-0 items-center gap-1.5 rounded-md border px-3 text-sm transition-colors lg:h-9 lg:pointer-coarse:h-11",
                filter === c
                  ? "border-foreground bg-foreground font-semibold text-background"
                  : "border-transparent text-muted-foreground hover:border-border-strong hover:text-foreground",
              )}
            >
              {c}
              <span className={cn("font-mono text-xs tabular-nums", filter === c ? "opacity-80" : "text-subtle-foreground")}>
                {counts[c] ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {groups.length > 1 && (
        <nav
          aria-label="Indeks huruf"
          className="-mx-4 mt-4 flex overflow-x-auto px-4 pb-1 scrollbar-thin sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0"
        >
          {groups.map(([l]) => (
            <a
              key={l}
              href={`#huruf-${l}`}
              className="flex h-11 min-w-9 shrink-0 items-center justify-center rounded-md font-serif text-lg text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {l}
            </a>
          ))}
        </nav>
      )}

      <p className="mt-3 font-mono text-xs text-muted-foreground" aria-live="polite">
        {filtered.length} istilah
        {filter !== ALL ? ` · kategori ${filter}` : ""}
        {deferred.trim() ? ` · cocok dengan “${deferred.trim()}”` : ""}
      </p>

      {groups.length === 0 ? (
        <div className="mt-6 rounded-md border border-dashed border-border-strong px-4 py-8 text-center">
          <p className="font-semibold">Tidak ada istilah yang cocok.</p>
          <p className="mt-2 text-sm text-muted-foreground">Coba kata lain, atau tampilkan lagi semua istilah.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFilter(ALL);
            }}
            className="mt-4 inline-flex h-11 items-center rounded-md border border-border-strong bg-card px-4 text-sm font-semibold hover:bg-surface"
          >
            Tampilkan semua istilah
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-10">
          {groups.map(([letter, items]) => (
            <section key={letter} id={`huruf-${letter}`} className={ANCHOR_OFFSET} aria-labelledby={`h-${letter}`}>
              <div className="flex items-end gap-4 border-b border-border-strong pb-1">
                <h2 id={`h-${letter}`} className="text-4xl leading-none font-semibold sm:text-5xl">
                  {letter}
                </h2>
                <span className="mb-1 ml-auto font-mono text-xs text-muted-foreground">{items.length} istilah</span>
              </div>
              <div className="md:columns-2 md:gap-10">
                {items.map((e) => (
                  <GlossaryItem key={e.slug} entry={e} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

// html already reserves header + 16px via scroll-padding-top; this only clears the sticky search bar.
const ANCHOR_OFFSET =
  "scroll-mt-[calc(var(--gbar-h,7.75rem)+0.5rem)] lg:scroll-mt-[calc(var(--gbar-h,10.25rem)+0.5rem)] [@media(max-height:30rem)]:scroll-mt-2";

function GlossaryItem({ entry }: { entry: GlossaryEntry }) {
  const lesson = entry.lesson ? getLessonById(entry.lesson) : undefined;
  return (
    <article
      id={entry.slug}
      className={cn(
        "-mx-2 min-w-0 break-inside-avoid border-b border-border px-2 py-4 target:bg-marker/40",
        ANCHOR_OFFSET,
      )}
    >
      <h3 className="font-sans text-base leading-snug wrap-break-word">
        <span className="font-bold">{entry.term}</span>
        <span className="ml-2 font-mono text-xs font-normal whitespace-nowrap text-muted-foreground">{entry.category}</span>
      </h3>
      {entry.aliases && entry.aliases.length > 0 && (
        <p className="mt-0.5 text-sm wrap-break-word text-muted-foreground italic">juga: {entry.aliases.join(", ")}</p>
      )}
      <p className="mt-1.5 text-sm leading-relaxed wrap-break-word sm:text-base">{entry.definition}</p>
      {entry.analogy && (
        <p className="mt-2 flex gap-2 text-sm leading-relaxed text-muted-foreground">
          <Coffee className="mt-1 size-3.5 shrink-0 text-accent" strokeWidth={2.25} aria-hidden />
          <span className="min-w-0 wrap-break-word">
            <span className="font-hand text-[1.0625rem] leading-none text-accent">Contoh sehari-hari:</span>{" "}
            <span className="italic">{entry.analogy}</span>
          </span>
        </p>
      )}
      {entry.example && (
        <pre className="mt-2 max-w-full overflow-x-auto rounded-md border border-code-border bg-code-bg px-3 py-2 font-mono text-xs leading-relaxed scrollbar-thin">
          <code>{entry.example}</code>
        </pre>
      )}
      {lesson && (
        <p className="mt-2 text-sm text-muted-foreground">
          Dibahas di{" "}
          <Link
            href={lesson.href}
            className="py-1 font-medium text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
          >
            Pelajaran {lesson.trackNumber}.{lesson.index + 1}: {lesson.title}
          </Link>
        </p>
      )}
    </article>
  );
}
