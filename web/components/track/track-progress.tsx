"use client";

import Link from "next/link";
import { ArrowRight, Check, PenLine } from "lucide-react";
import { getTrackLessons, LEVEL_LABEL } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress-store";
import { countCompleted, percent } from "@/lib/progress-stats";
import { trackQuizId } from "@/lib/quiz";
import { cn } from "@/lib/utils";
import { buttonClass } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/card";

export function TrackProgressCard({ trackSlug }: { trackSlug: string }) {
  const lessons = getTrackLessons(trackSlug);
  const completed = useProgress((s) => s.completed);
  const hydrated = useProgress((s) => s.hydrated);
  const quiz = useProgress((s) => s.quizzes[trackQuizId(trackSlug)]);
  const done = hydrated ? countCompleted(completed, lessons.map((l) => l.id)) : 0;
  const pct = percent(done, lessons.length);
  const next = hydrated ? lessons.find((l) => !completed[l.id]) : lessons[0];

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">Progres bab</p>
      <p className="mt-1.5 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground tabular-nums">{done}</span> dari {lessons.length} pelajaran selesai
      </p>
      <ProgressBar value={pct} className="mt-2.5" tone={pct === 100 ? "success" : "primary"} label={`Progres bab ${pct}%`} />
      {quiz ? (
        <p className="mt-2.5 font-mono text-xs text-muted-foreground">
          Kuis akhir: skor terbaik {quiz.best}/{quiz.total}
        </p>
      ) : null}
      <div className="mt-4 flex flex-col gap-2">
        {next ? (
          <Link href={next.href} className={buttonClass("primary", "md", "w-full")}>
            {done === 0 ? "Mulai bab ini" : "Lanjutkan"} <ArrowRight aria-hidden />
          </Link>
        ) : (
          <Link href={`/belajar/${trackSlug}/kuis/`} className={buttonClass("accent", "md", "w-full")}>
            Kerjakan kuis bab <ArrowRight aria-hidden />
          </Link>
        )}
        {next && done > 0 ? <p className="truncate text-xs text-subtle-foreground">Berikutnya: {next.title}</p> : null}
      </div>
    </div>
  );
}

export function TrackLessonList({ trackSlug, trackNumber }: { trackSlug: string; trackNumber: number }) {
  const lessons = getTrackLessons(trackSlug);
  const completed = useProgress((s) => s.completed);
  const hydrated = useProgress((s) => s.hydrated);

  return (
    <ol className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
      {lessons.map((l) => {
        const done = hydrated && Boolean(completed[l.id]);
        return (
          <li key={l.id}>
            <Link href={l.href} className="group flex gap-3 p-4 transition-colors hover:bg-surface sm:gap-4 sm:px-5">
              <span className="flex w-14 shrink-0 items-center gap-2 self-start pt-0.5">
                <span
                  className={cn(
                    "flex size-4 shrink-0 items-center justify-center rounded-[3px] border",
                    done ? "border-foreground/70 text-foreground" : "border-border-strong",
                  )}
                >
                  {done ? <Check className="size-3.5" strokeWidth={3} aria-hidden /> : null}
                </span>
                <span className="font-mono text-sm tabular-nums text-muted-foreground">
                  {trackNumber}.{l.index + 1}
                </span>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-serif text-[17px] leading-snug font-semibold text-pretty group-hover:underline group-hover:underline-offset-4">
                  {l.title}
                </span>
                <span className="mt-1 line-clamp-2 block text-sm text-muted-foreground">{l.description}</span>
                <span className="mt-2 block font-mono text-xs text-subtle-foreground">
                  {l.minutes} mnt · {LEVEL_LABEL[l.level]}
                  {l.lang === "ts" ? " · TypeScript" : ""}
                  {done ? <span className="text-success"> · selesai</span> : null}
                </span>
              </span>
              <ArrowRight
                className="mt-1 hidden size-4 shrink-0 text-subtle-foreground group-hover:text-foreground sm:block"
                aria-hidden
              />
            </Link>
          </li>
        );
      })}
      <li className="bg-surface">
        <Link href={`/belajar/${trackSlug}/kuis/`} className="group flex gap-3 p-4 transition-colors hover:bg-surface-2 sm:gap-4 sm:px-5">
          <span className="flex w-14 shrink-0 items-center gap-2 self-start pt-0.5 text-accent">
            <PenLine className="size-4" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-serif text-[17px] leading-snug font-semibold group-hover:underline group-hover:underline-offset-4">
              Kuis akhir bab
            </span>
            <span className="mt-1 block text-sm text-muted-foreground">
              Soal pilihan ganda dari semua pelajaran di bab ini. Boleh diulang.
            </span>
          </span>
          <ArrowRight className="mt-1 hidden size-4 shrink-0 text-subtle-foreground group-hover:text-foreground sm:block" aria-hidden />
        </Link>
      </li>
    </ol>
  );
}