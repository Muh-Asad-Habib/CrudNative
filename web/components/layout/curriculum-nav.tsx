"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, ChevronDown, PenLine } from "lucide-react";
import { tracks } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress-store";
import { overallStats } from "@/lib/progress-stats";
import { cn } from "@/lib/utils";
import { ProgressBar } from "@/components/ui/card";
import { trackTone } from "@/components/ui/track-icon";

function normalize(path: string) {
  return path.endsWith("/") ? path : `${path}/`;
}

export function CurriculumNav({ onNavigate, className }: { onNavigate?: () => void; className?: string }) {
  const pathname = normalize(usePathname() || "/");
  const completed = useProgress((s) => s.completed);
  const hydrated = useProgress((s) => s.hydrated);
  const activeTrack = tracks.find((t) => pathname.startsWith(`/belajar/${t.slug}/`))?.slug;
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(tracks.map((t) => [t.slug, activeTrack ? t.slug === activeTrack : t.number === 0])),
  );
  const activeRef = useRef<HTMLAnchorElement>(null);

  const [prevActiveTrack, setPrevActiveTrack] = useState(activeTrack);
  if (activeTrack !== prevActiveTrack) {
    setPrevActiveTrack(activeTrack);
    if (activeTrack && !open[activeTrack]) setOpen({ ...open, [activeTrack]: true });
  }

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [pathname]);

  const stats = overallStats(completed);

  return (
    <nav aria-label="Kurikulum" className={cn("text-sm", className)}>
      <div className="mb-3 border-b border-border pb-3">
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <span className="font-mono text-xs tracking-wider text-subtle-foreground uppercase">Daftar isi</span>
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {hydrated ? stats.done : "–"} dari {stats.total} selesai
          </span>
        </div>
        <ProgressBar value={hydrated ? stats.percent : 0} label="Progres keseluruhan" className="h-1.5" />
      </div>

      <ul className="space-y-1.5">
        {tracks.map((track) => {
          const isOpen = open[track.slug];
          const doneCount = track.lessons.filter((l) => completed[`${track.slug}/${l.slug}`]).length;
          const tone = trackTone[track.slug];
          const trackHref = `/belajar/${track.slug}/`;
          const trackActive = pathname === trackHref;
          return (
            <li key={track.slug}>
              <div className="relative flex items-center gap-1 pl-3">
                <span className={cn("absolute top-1.5 bottom-1.5 left-0 w-[3px] rounded-[1px]", tone.tab)} aria-hidden />
                <Link
                  href={trackHref}
                  onClick={onNavigate}
                  aria-current={trackActive ? "page" : undefined}
                  className="group flex min-h-11 min-w-0 flex-1 items-center gap-2 rounded-md py-1.5 pr-1 lg:min-h-10"
                >
                  <span className="min-w-0 flex-1 leading-tight">
                    <span className="block font-mono text-xs tracking-wider text-subtle-foreground uppercase">
                      Bab {String(track.number).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "block truncate font-serif text-[15px] font-semibold group-hover:underline",
                        trackActive ? "text-foreground" : "text-foreground/90",
                      )}
                    >
                      {trackActive ? <span className="marker">{track.shortTitle}</span> : track.shortTitle}
                    </span>
                  </span>
                  {hydrated ? (
                    <span className="font-mono text-xs tabular-nums text-subtle-foreground">
                      {doneCount}/{track.lessons.length}
                    </span>
                  ) : null}
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen((o) => ({ ...o, [track.slug]: !o[track.slug] }))}
                  aria-expanded={isOpen}
                  aria-controls={`nav-${track.slug}`}
                  aria-label={`${isOpen ? "Tutup" : "Buka"} daftar pelajaran ${track.shortTitle}`}
                  className="flex size-11 shrink-0 items-center justify-center rounded-md text-subtle-foreground hover:bg-surface-2 hover:text-foreground lg:size-9"
                >
                  <ChevronDown className={cn("size-4 transition-transform duration-200", isOpen && "rotate-180")} />
                </button>
              </div>

              {isOpen ? (
                <ul id={`nav-${track.slug}`} className="mt-0.5 mb-3 ml-3 border-l border-border">
                  {track.lessons.map((lesson, i) => {
                    const id = `${track.slug}/${lesson.slug}`;
                    const href = `/belajar/${id}/`;
                    const active = pathname === href;
                    const done = Boolean(completed[id]);
                    return (
                      <li key={lesson.slug}>
                        <Link
                          ref={active ? activeRef : undefined}
                          href={href}
                          onClick={onNavigate}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "-ml-px flex min-h-11 items-start gap-2 border-l-2 py-2 pr-1 pl-2.5 leading-snug transition-colors lg:min-h-9 lg:py-1.5",
                            active
                              ? "border-foreground font-semibold text-foreground"
                              : "border-transparent text-muted-foreground hover:border-border-strong hover:text-foreground",
                          )}
                        >
                          <span className="mt-px w-7 shrink-0 font-mono text-xs tabular-nums text-subtle-foreground">
                            {track.number}.{i + 1}
                          </span>
                          <span className="min-w-0 flex-1">
                            {active ? <span className="marker">{lesson.title}</span> : lesson.title}
                          </span>
                          {done ? (
                            <span className="mt-0.5 shrink-0 text-success">
                              <Check className="size-4" strokeWidth={2.5} aria-hidden />
                              <span className="sr-only">(selesai)</span>
                            </span>
                          ) : null}
                        </Link>
                      </li>
                    );
                  })}
                  <li>
                    <Link
                      href={`/belajar/${track.slug}/kuis/`}
                      onClick={onNavigate}
                      aria-current={pathname === `/belajar/${track.slug}/kuis/` ? "page" : undefined}
                      className={cn(
                        "-ml-px flex min-h-11 items-center gap-2 border-l-2 py-2 pr-1 pl-2.5 lg:min-h-9",
                        pathname === `/belajar/${track.slug}/kuis/`
                          ? "border-foreground font-semibold text-foreground"
                          : "border-transparent text-muted-foreground hover:border-border-strong hover:text-foreground",
                      )}
                    >
                      <span className="w-7 shrink-0 text-subtle-foreground">
                        <PenLine className="size-3.5" aria-hidden />
                      </span>
                      <span className="underline decoration-border-strong decoration-dotted underline-offset-4">
                        Kuis akhir bab
                      </span>
                    </Link>
                  </li>
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}