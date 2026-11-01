"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { getTrackLessons, trackMinutes, tracks } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress-store";
import { nextLessonToStudy, overallStats, trackStats } from "@/lib/progress-stats";
import { trackQuizId } from "@/lib/quiz";
import { cn, formatMinutes } from "@/lib/utils";
import { buttonClass } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/card";
import { TrackIcon, trackTone } from "@/components/ui/track-icon";

export function OverallProgress() {
  const completed = useProgress((s) => s.completed);
  const hydrated = useProgress((s) => s.hydrated);
  const stats = overallStats(hydrated ? completed : {});
  const next = nextLessonToStudy(hydrated ? completed : {});

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5">
      <div className="min-w-0 flex-1">
        <p className="text-sm text-muted-foreground">
          {stats.done === 0 ? (
            "Belum ada pelajaran yang selesai."
          ) : (
            <>
              Sudah <span className="font-semibold text-foreground tabular-nums">{stats.done}</span> dari {stats.total}{" "}
              pelajaran selesai <span className="font-mono text-xs">({stats.percent}%)</span>.
            </>
          )}
        </p>
        <ProgressBar value={stats.percent} className="mt-2.5" label={`Progres keseluruhan ${stats.percent}%`} />
        {next && stats.done > 0 ? (
          <p className="mt-2 truncate text-xs text-subtle-foreground">Berikutnya: {next.title}</p>
        ) : null}
      </div>
      {next ? (
        <Link href={next.href} className={buttonClass("primary", "md", "shrink-0")}>
          {stats.done === 0 ? "Mulai dari 0.1" : "Lanjutkan"} <ArrowRight aria-hidden />
        </Link>
      ) : (
        <Link href="/progres/" className={buttonClass("outline", "md", "shrink-0")}>
          Lihat progres belajar
        </Link>
      )}
    </div>
  );
}

export function TrackRoadmap() {
  const completed = useProgress((s) => s.completed);
  const quizzes = useProgress((s) => s.quizzes);
  const hydrated = useProgress((s) => s.hydrated);
  const stats = trackStats(hydrated ? completed : {});

  return (
    <ol className="space-y-6">
      {tracks.map((track) => {
        const tone = trackTone[track.slug];
        const s = stats.find((x) => x.slug === track.slug)!;
        const lessons = getTrackLessons(track.slug);
        const next = lessons.find((l) => !(hydrated && completed[l.id]));
        const quiz = hydrated ? quizzes[trackQuizId(track.slug)] : undefined;
        const finished = s.percent === 100;

        return (
          <li key={track.slug}>
            <article className="relative overflow-hidden rounded-lg border border-border bg-card">
              <span className={cn("absolute inset-y-0 left-0 w-1", tone?.tab)} aria-hidden />
              <header className="py-4 pr-4 pl-5 sm:py-5 sm:pr-6 sm:pl-7">
                <p className="flex items-center gap-2 font-mono text-xs tracking-wider text-muted-foreground uppercase">
                  <TrackIcon icon={track.icon} className={cn("size-4", tone?.text)} />
                  Bab {String(track.number).padStart(2, "0")}
                  {finished ? <span className="text-success normal-case">· selesai</span> : null}
                </p>
                <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-balance sm:text-2xl">
                  <Link href={`/belajar/${track.slug}/`} className="hover:underline hover:decoration-2 hover:underline-offset-4">
                    {track.title}
                  </Link>
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-pretty text-muted-foreground sm:text-[15px]">
                  {track.description}
                </p>
                <p className="mt-3 font-mono text-xs text-subtle-foreground">
                  {track.lessons.length} pelajaran · ± {formatMinutes(trackMinutes(track))}
                  {quiz ? ` · kuis ${quiz.best}/${quiz.total}` : ""}
                </p>
              </header>

              <ol
                className="border-t border-dashed border-border-strong py-1 pr-3 pl-4 sm:pr-5 sm:pl-6"
                aria-label={`Pelajaran di ${track.title}`}
              >
                {lessons.map((l) => {
                  const done = hydrated && Boolean(completed[l.id]);
                  const isNext = s.done > 0 && !finished && next?.id === l.id;
                  return (
                    <li key={l.id}>
                      <Link
                        href={l.href}
                        className="group flex min-h-11 items-baseline gap-2.5 rounded-sm px-1 py-2.5 text-sm hover:bg-surface pointer-fine:min-h-9 pointer-fine:py-1.5 sm:gap-3"
                      >
                        <span
                          className={cn(
                            "flex size-4 shrink-0 translate-y-[3px] items-center justify-center rounded-[3px] border",
                            done ? "border-foreground/70 text-foreground" : "border-border-strong",
                          )}
                        >
                          {done ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : null}
                        </span>
                        <span className="w-8 shrink-0 font-mono text-xs tabular-nums text-subtle-foreground">
                          {track.number}.{l.index + 1}
                        </span>
                        <span
                          className={cn(
                            "min-w-0 group-hover:underline group-hover:underline-offset-4",
                            done ? "text-muted-foreground" : "text-foreground",
                            isNext && "font-semibold",
                          )}
                        >
                          {l.title}
                          {done ? <span className="sr-only"> (selesai)</span> : null}
                          {isNext ? <span className="sr-only"> (berikutnya)</span> : null}
                        </span>
                        <span className="hidden min-w-4 flex-1 translate-y-[-3px] border-b border-dotted border-border-strong sm:block" aria-hidden />
                        <span className="ml-auto shrink-0 font-mono text-xs tabular-nums text-subtle-foreground sm:ml-0">
                          {l.minutes} mnt
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>

              <footer className="flex flex-col gap-3 border-t border-border bg-surface py-3 pr-4 pl-5 sm:flex-row sm:items-center sm:pr-6 sm:pl-7">
                <div className="min-w-0 flex-1">
                  <p className="flex min-w-0 gap-1.5 text-xs text-muted-foreground">
                    <span className="shrink-0 font-mono tabular-nums">
                      {s.done}/{s.total} selesai
                    </span>
                    {next && s.done > 0 && !finished ? (
                      <span className="min-w-0 truncate">· berikutnya: {next.title}</span>
                    ) : null}
                  </p>
                  <ProgressBar
                    value={s.percent}
                    tone={finished ? "success" : "primary"}
                    className="mt-2 h-1.5"
                    label={`Progres ${track.shortTitle} ${s.percent}%`}
                  />
                </div>
                <Link
                  href={next ? next.href : `/belajar/${track.slug}/kuis/`}
                  className={buttonClass(finished ? "accent" : s.done > 0 ? "primary" : "outline", "md", "shrink-0")}
                >
                  {finished ? "Kerjakan kuis bab" : s.done > 0 ? "Lanjutkan" : "Mulai bab ini"} <ArrowRight aria-hidden />
                </Link>
              </footer>
            </article>
          </li>
        );
      })}
    </ol>
  );
}