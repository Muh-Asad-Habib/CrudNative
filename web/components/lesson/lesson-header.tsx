import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight, Clock } from "lucide-react";
import { getAdjacentLessons, getTrack, LEVEL_LABEL, type Lesson } from "@/lib/curriculum";
import { trackTone } from "@/components/ui/track-icon";
import { cn } from "@/lib/utils";
import { BookmarkButton, CompleteButton } from "./lesson-actions";

const pad = (n: number) => String(n).padStart(2, "0");

export function LessonHeader({ lesson }: { lesson: Lesson }) {
  const track = getTrack(lesson.trackSlug)!;
  const tone = trackTone[lesson.trackSlug];
  return (
    <header className="mb-10">
      <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-x-1 text-sm text-muted-foreground">
        <Link href="/belajar/" className="-my-1.5 inline-flex min-h-11 items-center rounded px-1 hover:text-foreground">
          Kurikulum
        </Link>
        <ChevronRight className="size-3.5 text-subtle-foreground" aria-hidden />
        <Link
          href={`/belajar/${track.slug}/`}
          className="-my-1.5 inline-flex min-h-11 items-center rounded px-1 hover:text-foreground"
        >
          Bab {track.number} · {track.shortTitle}
        </Link>
      </nav>

      <div className="sm:-ml-4 sm:pl-4 sm:margin-line sm:[--margin-x:0px] lg:-ml-6 lg:pl-6">
        <p className="flex items-center gap-2.5 font-mono text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">
          <span className={cn("h-3 w-1 rounded-[1px]", tone?.tab ?? "bg-accent")} aria-hidden />
          Bab {pad(track.number)} · Pelajaran {track.number}.{lesson.index + 1}
        </p>

        <h1 className="mt-3 font-serif text-[1.875rem] leading-[1.15] font-semibold tracking-[-0.015em] text-balance sm:text-[2.5rem]">
          {lesson.title}
        </h1>
        <p className="mt-3 max-w-[60ch] text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
          {lesson.description}
        </p>

        <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" aria-hidden />±{lesson.minutes} menit
          </span>
          <span aria-hidden className="text-subtle-foreground">
            ·
          </span>
          <span>{LEVEL_LABEL[lesson.level]}</span>
          <span aria-hidden className="text-subtle-foreground">
            ·
          </span>
          <span className="font-mono text-[0.8125rem]">{lesson.lang === "ts" ? "TypeScript" : "JavaScript"}</span>
        </p>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <CompleteButton lessonId={lesson.id} className="hidden lg:inline-flex" />
        <BookmarkButton lessonId={lesson.id} />
      </div>

      {lesson.objectives.length > 0 ? (
        <section className="mt-7 rounded-md border border-border bg-card" aria-labelledby="tujuan-belajar">
          <h2
            id="tujuan-belajar"
            className="border-b border-border px-4 py-2.5 font-mono text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase sm:px-5"
          >
            Target pelajaran ini
          </h2>
          <ul className="bg-ruled px-4 pt-1 pb-3 text-[0.9375rem] leading-7 [--rule-gap:1.75rem] sm:px-5">
            {lesson.objectives.map((o) => (
              <li key={o} className="flex gap-3">
                <span className="mt-[0.4375rem] size-3.5 shrink-0 rounded-[3px] border-[1.5px] border-primary/60" aria-hidden />
                <span className="min-w-0">{o}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </header>
  );
}

export function LessonPager({ lessonId }: { lessonId: string }) {
  const { prev, next } = getAdjacentLessons(lessonId);
  const card =
    "group flex min-h-20 flex-1 flex-col justify-center rounded-md border border-border bg-card px-4 py-3.5 transition-colors hover:border-border-strong hover:bg-surface";
  const num = (l: Lesson) => `${l.trackNumber}.${l.index + 1}`;
  return (
    <nav aria-label="Navigasi pelajaran" className="mt-8 flex flex-col gap-3 sm:flex-row">
      {prev ? (
        <Link href={prev.href} className={card}>
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <ArrowLeft className="size-3.5" aria-hidden /> Sebelumnya
            <span className="font-mono text-subtle-foreground">{num(prev)}</span>
          </span>
          <span className="mt-1 font-serif text-[1.0625rem] font-semibold text-pretty">{prev.title}</span>
        </Link>
      ) : (
        <span className="hidden flex-1 sm:block" />
      )}
      {next ? (
        <Link href={next.href} className={cn(card, "sm:items-end sm:text-right")}>
          <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <span className="font-mono text-subtle-foreground">{num(next)}</span>
            Pelajaran berikutnya <ArrowRight className="size-3.5" aria-hidden />
          </span>
          <span className="mt-1 font-serif text-[1.0625rem] font-semibold text-pretty">{next.title}</span>
          {next.trackSlug !== lessonId.split("/")[0] ? (
            <span className="mt-0.5 text-xs text-muted-foreground">Masuk bab baru: {next.trackTitle}</span>
          ) : null}
        </Link>
      ) : null}
    </nav>
  );
}
