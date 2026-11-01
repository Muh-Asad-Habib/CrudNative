"use client";

import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { allLessons, getLessonById } from "@/lib/curriculum";
import { useProgress, type ProgressData } from "@/lib/progress-store";
import { computeStreak, nextLessonToStudy, overallStats } from "@/lib/progress-stats";
import { buttonClass } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/card";

const firstLesson = allLessons[0];

/** Pelajaran terakhir yang dibuka, asalkan id-nya masih ada di kurikulum. */
function lastVisitedLesson(lastVisited: ProgressData["lastVisited"]) {
  return lastVisited ? getLessonById(lastVisited.id) : undefined;
}

/** Lanjut ke pelajaran terakhir yang belum selesai; kalau tidak ada, ke pelajaran pertama yang belum selesai. */
function resumeTarget(completed: ProgressData["completed"], lastVisited: ProgressData["lastVisited"]) {
  const last = lastVisitedLesson(lastVisited);
  return last && !completed[last.id] ? last : nextLessonToStudy(completed);
}

/** CTA di hero: "Mulai" untuk pengunjung baru, "Lanjutkan" bila sudah ada progres. */
export function HeroCta() {
  const hydrated = useProgress((s) => s.hydrated);
  const completed = useProgress((s) => s.completed);
  const lastVisited = useProgress((s) => s.lastVisited);
  const started = hydrated && (Object.keys(completed).length > 0 || Boolean(lastVisitedLesson(lastVisited)));
  const target = started ? resumeTarget(completed, lastVisited) : null;

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {started && target ? (
        <Link href={target.href} className={buttonClass("primary", "lg")}>
          Lanjutkan membaca <ArrowRight aria-hidden />
        </Link>
      ) : (
        <Link href={firstLesson?.href ?? "/belajar/"} className={buttonClass("primary", "lg")}>
          Mulai dari Bab {firstLesson?.trackNumber ?? 0} <ArrowRight aria-hidden />
        </Link>
      )}
      <a href="#daftar-isi" className={buttonClass("outline", "lg")}>
        Lihat daftar isi
      </a>
    </div>
  );
}

/** Pembatas buku "terakhir sampai di sini", hanya muncul jika pengguna sudah pernah belajar. */
export function ContinueCard() {
  const hydrated = useProgress((s) => s.hydrated);
  const completed = useProgress((s) => s.completed);
  const lastVisited = useProgress((s) => s.lastVisited);
  const activeDays = useProgress((s) => s.activeDays);
  // lastVisited bisa menunjuk pelajaran yang sudah dihapus/diganti nama; anggap belum pernah berkunjung.
  if (!hydrated || (!lastVisitedLesson(lastVisited) && Object.keys(completed).length === 0)) return null;

  const stats = overallStats(completed);
  const target = resumeTarget(completed, lastVisited);
  const streak = computeStreak(activeDays);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-10 sm:px-6 sm:pt-12 2xl:max-w-[1440px]" aria-label="Lanjutkan belajar">
      <div className="animate-fade-in relative flex flex-col gap-4 overflow-hidden rounded-md border border-border-strong bg-card py-4 pr-4 pl-6 sm:flex-row sm:items-center sm:gap-6 sm:py-5 sm:pr-5 sm:pl-7">
        <span className="absolute inset-y-0 left-0 w-1.5 bg-highlight" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
            {target ? `Terakhir sampai di Bab ${target.trackNumber}` : "Semua bab selesai"}
          </p>
          <p className="mt-1 line-clamp-2 font-serif text-lg font-semibold text-balance">
            {target ? target.title : "Kamu sudah menyelesaikan semua pelajaran."}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <ProgressBar value={stats.percent} className="max-w-xs min-w-12 flex-1" label={`Progres ${stats.percent}%`} />
            <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
              {stats.done}/{stats.total} selesai
            </span>
            {streak > 0 ? (
              <span className="inline-flex shrink-0 items-center gap-1 text-xs text-accent" title={`${streak} hari berturut-turut`}>
                <Flame className="size-3.5" aria-hidden /> {streak} hari
              </span>
            ) : null}
          </div>
        </div>
        <Link href={target ? target.href : "/progres/"} className={buttonClass("primary", "md", "shrink-0")}>
          {target ? "Lanjutkan" : "Lihat progres"} <ArrowRight aria-hidden />
        </Link>
      </div>
    </section>
  );
}
