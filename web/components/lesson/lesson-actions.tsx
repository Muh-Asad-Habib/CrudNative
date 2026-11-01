"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Bookmark, BookmarkCheck, ChevronLeft, ChevronRight, Square, SquareCheckBig } from "lucide-react";
import { getAdjacentLessons, getLessonById } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress-store";
import { cn } from "@/lib/utils";
import { buttonClass } from "@/components/ui/button";

/** Mencatat kunjungan (untuk "lanjutkan belajar" & streak). */
export function LessonTracker({ lessonId }: { lessonId: string }) {
  const hydrated = useProgress((s) => s.hydrated);
  const visit = useProgress((s) => s.visit);
  useEffect(() => {
    if (hydrated) visit(lessonId);
  }, [hydrated, lessonId, visit]);
  return null;
}

export function CompleteButton({ lessonId, className }: { lessonId: string; className?: string }) {
  const done = useProgress((s) => Boolean(s.completed[lessonId]));
  const hydrated = useProgress((s) => s.hydrated);
  const toggle = useProgress((s) => s.toggleComplete);
  return (
    <button
      type="button"
      onClick={() => toggle(lessonId)}
      disabled={!hydrated}
      aria-pressed={done}
      className={cn(
        buttonClass(done ? "outline" : "primary", "md"),
        done && "border-success/40 text-success hover:border-success/60 hover:bg-success-soft",
        className,
      )}
    >
      {done ? <SquareCheckBig aria-hidden /> : <Square aria-hidden />}
      {done ? "Sudah dibaca" : "Tandai sudah dibaca"}
    </button>
  );
}

export function BookmarkButton({ lessonId, className }: { lessonId: string; className?: string }) {
  const saved = useProgress((s) => s.bookmarks.includes(lessonId));
  const toggle = useProgress((s) => s.toggleBookmark);
  return (
    <button
      type="button"
      onClick={() => toggle(lessonId)}
      aria-pressed={saved}
      aria-label={saved ? "Hapus dari bookmark" : "Simpan ke bookmark"}
      title={saved ? "Hapus dari bookmark" : "Simpan ke bookmark"}
      className={cn(buttonClass("outline", "icon"), saved && "border-accent/50 text-accent", className)}
    >
      {saved ? <BookmarkCheck aria-hidden /> : <Bookmark aria-hidden />}
    </button>
  );
}

/** Catatan penutup di akhir pelajaran: tandai sudah dibaca lalu lanjut. */
export function LessonFinishCard({ lessonId }: { lessonId: string }) {
  const done = useProgress((s) => Boolean(s.completed[lessonId]));
  const markComplete = useProgress((s) => s.markComplete);
  const { next } = getAdjacentLessons(lessonId);
  const lesson = getLessonById(lessonId);
  const lastInTrack = Boolean(lesson && (!next || next.trackSlug !== lesson.trackSlug));

  return (
    <section
      aria-labelledby="akhir-pelajaran"
      className={cn(
        "mt-14 rounded-md border border-l-4 bg-card",
        done ? "border-success/35 border-l-success" : "border-border border-l-primary",
      )}
    >
      <p className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5 font-mono text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase sm:px-5">
        <span>Akhir pelajaran{lesson ? ` ${lesson.trackNumber}.${lesson.index + 1}` : ""}</span>
        {done ? (
          <span className="inline-flex items-center gap-1.5 text-success">
            <SquareCheckBig className="size-3.5" aria-hidden /> Sudah dibaca
          </span>
        ) : null}
      </p>
      <div className="px-4 py-4 sm:px-5 sm:py-5">
        <h2 id="akhir-pelajaran" className="font-serif text-lg leading-snug font-semibold text-balance sm:text-xl">
          {done
            ? lastInTrack
              ? "Kamu sudah sampai di akhir bab ini."
              : "Pelajaran ini sudah kamu tandai."
            : "Sudah paham isinya?"}
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-pretty text-muted-foreground">
          {done
            ? lastInTrack
              ? "Kerjakan kuis akhir bab dulu sebelum lanjut, supaya kelihatan bagian mana yang perlu diulang."
              : "Progresmu tersimpan otomatis di browser ini."
            : "Tandai sudah dibaca supaya progresmu tercatat di browser ini."}
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          {!done ? (
            <button type="button" onClick={() => markComplete(lessonId)} className={buttonClass("primary", "md")}>
              <Square aria-hidden /> Tandai sudah dibaca
            </button>
          ) : null}
          {done && lastInTrack && lesson ? (
            <Link href={`/belajar/${lesson.trackSlug}/kuis/`} className={buttonClass("accent", "md")}>
              Kuis akhir bab
            </Link>
          ) : null}
          {next ? (
            <Link
              href={next.href}
              onClick={() => markComplete(lessonId)}
              className={buttonClass(done ? "primary" : "outline", "md")}
            >
              {done ? "Pelajaran berikutnya" : "Tandai dan lanjut"} <ArrowRight aria-hidden />
            </Link>
          ) : (
            <Link href="/progres/" className={buttonClass("outline", "md")}>
              Lihat progres
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

/** Bar navigasi bawah khusus layar kecil. */
export function LessonBottomBar({ lessonId }: { lessonId: string }) {
  const { prev, next } = getAdjacentLessons(lessonId);
  const done = useProgress((s) => Boolean(s.completed[lessonId]));
  const hydrated = useProgress((s) => s.hydrated);
  const toggle = useProgress((s) => s.toggleComplete);

  const navCls =
    "flex size-11 shrink-0 items-center justify-center rounded-md border border-border-strong bg-card text-foreground transition-colors hover:bg-surface aria-disabled:pointer-events-none aria-disabled:opacity-40";

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden print:hidden">
      <div className="mx-auto flex max-w-xl items-center gap-2">
        {prev ? (
          <Link href={prev.href} className={navCls} aria-label={`Sebelumnya: ${prev.title}`}>
            <ChevronLeft className="size-5" aria-hidden />
          </Link>
        ) : (
          <span className={navCls} aria-disabled="true">
            <ChevronLeft className="size-5" aria-hidden />
          </span>
        )}
        <button
          type="button"
          onClick={() => toggle(lessonId)}
          disabled={!hydrated}
          aria-pressed={done}
          className={cn(
            "flex h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-md border text-sm font-semibold transition-colors disabled:opacity-60",
            done
              ? "border-success/40 bg-card text-success"
              : "border-primary bg-primary text-primary-foreground hover:bg-primary-hover",
          )}
        >
          {done ? <SquareCheckBig className="size-4 shrink-0" aria-hidden /> : <Square className="size-4 shrink-0" aria-hidden />}
          <span className="truncate">{done ? "Sudah dibaca" : "Tandai sudah dibaca"}</span>
        </button>
        {next ? (
          <Link href={next.href} className={navCls} aria-label={`Pelajaran berikutnya: ${next.title}`}>
            <ChevronRight className="size-5" aria-hidden />
          </Link>
        ) : (
          <span className={navCls} aria-disabled="true">
            <ChevronRight className="size-5" aria-hidden />
          </span>
        )}
      </div>
    </div>
  );
}
