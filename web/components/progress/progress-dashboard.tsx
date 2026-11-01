"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Dialog } from "radix-ui";
import {
  ArrowRight,
  Bookmark,
  BookmarkX,
  Brain,
  Download,
  Flame,
  Footprints,
  Medal,
  Rocket,
  RotateCcw,
  Star,
  Target,
  Trophy,
  Upload,
  type LucideIcon,
} from "lucide-react";
import { exportProgress, useProgress, type ProgressData } from "@/lib/progress-store";
import {
  computeBadges,
  computeStreak,
  longestStreak,
  nextLessonToStudy,
  overallStats,
  trackStats,
  type Badge as BadgeT,
} from "@/lib/progress-stats";
import { allLessons, getLessonById, getTrack, tracks } from "@/lib/curriculum";
import { cn, formatMinutes, todayKey } from "@/lib/utils";
import { buttonClass } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/card";
import { trackTone } from "@/components/ui/track-icon";

const badgeIcon: Record<BadgeT["icon"], LucideIcon> = {
  sparkles: Footprints,
  flame: Flame,
  trophy: Trophy,
  brain: Brain,
  target: Target,
  medal: Medal,
  rocket: Rocket,
  star: Star,
};

function useProgressData(): ProgressData & { hydrated: boolean } {
  const completed = useProgress((s) => s.completed);
  const quizzes = useProgress((s) => s.quizzes);
  const bookmarks = useProgress((s) => s.bookmarks);
  const lastVisited = useProgress((s) => s.lastVisited);
  const activeDays = useProgress((s) => s.activeDays);
  const hydrated = useProgress((s) => s.hydrated);
  return { completed, quizzes, bookmarks, lastVisited, activeDays, hydrated };
}

export function ProgressDashboard() {
  const data = useProgressData();

  if (!data.hydrated) {
    return (
      <div className="grid gap-4 md:grid-cols-3" aria-busy="true" aria-label="Memuat progres">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={cn("h-40 animate-pulse rounded-lg bg-surface-2", i === 0 && "md:col-span-2")} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <Summary data={data} />
      <ActivityHeatmap activeDays={data.activeDays} />
      <TrackBreakdown completed={data.completed} />
      <Badges data={data} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <QuizResults quizzes={data.quizzes} />
        <Bookmarks bookmarks={data.bookmarks} />
      </div>
      <DataManagement data={data} />
    </div>
  );
}

/* ---------------------------------- Ringkasan --------------------------------- */

function Summary({ data }: { data: ProgressData }) {
  const overall = overallStats(data.completed);
  const streak = computeStreak(data.activeDays);
  const best = Math.max(longestStreak(data.activeDays), streak);
  const minutes = allLessons.filter((l) => data.completed[l.id]).reduce((s, l) => s + l.minutes, 0);
  const quizCount = Object.keys(data.quizzes).length;
  const next = nextLessonToStudy(data.completed);

  const rows: { label: string; value: string }[] = [
    { label: "Pelajaran selesai", value: `${overall.done}/${overall.total} (${overall.percent}%)` },
    { label: "Waktu belajar", value: minutes ? formatMinutes(minutes) : "0 menit" },
    { label: "Belajar berturut-turut", value: `${streak} hari` },
    { label: "Rekor berturut-turut", value: `${best} hari` },
    { label: "Kuis dikerjakan", value: String(quizCount) },
    { label: "Pelajaran ditandai", value: String(data.bookmarks.length) },
  ];

  return (
    <section
      aria-labelledby="ringkasan"
      className="grid overflow-hidden rounded-lg border border-border bg-card lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
    >
      <div className="flex flex-col border-b border-border p-5 sm:p-6 lg:border-r lg:border-b-0">
        <h2 id="ringkasan" className="font-mono text-xs font-normal tracking-wider text-muted-foreground uppercase">
          Ringkasan
        </h2>
        <p className="mt-2 font-serif text-xl leading-snug font-semibold text-balance sm:text-2xl">
          {overall.percent === 100
            ? "Semua pelajaran sudah selesai."
            : overall.done === 0
              ? "Belum ada pelajaran yang selesai."
              : `Sudah ${overall.done} pelajaran selesai.`}
        </p>
        <ProgressBar value={overall.percent} className="mt-4" label={`Progres keseluruhan ${overall.percent}%`} />
        <p className="mt-3 text-sm text-muted-foreground">
          {next ? (
            <>
              Berikutnya: <span className="font-medium text-foreground">{next.title}</span>
            </>
          ) : (
            "Kalau mau, ulangi kuis bab yang nilainya belum penuh."
          )}
        </p>
        <div className="mt-5">
          <Link href={next ? next.href : "/belajar/"} className={buttonClass(next ? "primary" : "outline", "md")}>
            {next ? (overall.done === 0 ? "Mulai dari 0.1" : "Lanjutkan") : "Lihat daftar isi"}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
      <div className="p-5 sm:p-6">
        <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase" aria-hidden>
          Rapor
        </p>
        <dl className="bg-ruled mt-2 [--rule-gap:2.5rem]">
          {rows.map((r) => (
            <div key={r.label} className="flex h-10 items-end justify-between gap-3 pb-1.5 text-sm">
              <dt className="min-w-0 truncate text-muted-foreground">{r.label}</dt>
              <dd className="shrink-0 font-mono font-semibold tabular-nums">{r.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* --------------------------------- Heatmap ---------------------------------- */

const WEEKS = 18;
const DAY_LABELS = ["Sen", "", "Rab", "", "Jum", "", "Min"];

function ActivityHeatmap({ activeDays }: { activeDays: string[] }) {
  const { weeks, activeCount } = useMemo(() => {
    const set = new Set(activeDays);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dow = (today.getDay() + 6) % 7; // 0 = Senin
    const start = new Date(today);
    start.setDate(today.getDate() - dow - (WEEKS - 1) * 7);
    const cols: { key: string; active: boolean; future: boolean; label: string }[][] = [];
    let count = 0;
    for (let w = 0; w < WEEKS; w++) {
      const col = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(start);
        date.setDate(start.getDate() + w * 7 + d);
        const key = todayKey(date);
        const future = date > today;
        const active = set.has(key);
        if (active && !future) count++;
        col.push({
          key,
          active,
          future,
          label: date.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" }),
        });
      }
      cols.push(col);
    }
    return { weeks: cols, activeCount: count };
  }, [activeDays]);

  const scrollerRef = useRef<HTMLDivElement>(null);
  // On narrow screens the calendar scrolls; start at the current week instead of 18 weeks ago.
  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  return (
    <section aria-labelledby="aktivitas" className="rounded-lg border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <div>
          <h2 id="aktivitas" className="font-serif text-lg font-semibold">
            Hari belajar
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {activeCount === 0
              ? `Belum ada hari belajar dalam ${WEEKS} minggu terakhir.`
              : `${activeCount} hari belajar dalam ${WEEKS} minggu terakhir.`}
          </p>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground" aria-hidden>
          <span className="size-3 rounded-[2px] bg-surface-2 dark:bg-border-strong" /> kosong
          <span className="ml-2 size-3 rounded-[2px] bg-primary" /> belajar
        </div>
      </div>
      <div ref={scrollerRef} className="-mx-1 mt-4 overflow-x-auto pb-1 scrollbar-thin">
        <div className="flex w-max gap-[3px] p-1" role="img" aria-label={`Kalender belajar: ${activeCount} hari belajar`}>
          <div className="sticky left-0 z-[1] grid grid-rows-7 gap-[3px] bg-card pr-1 font-mono text-xs leading-none text-subtle-foreground" aria-hidden>
            {DAY_LABELS.map((d, i) => (
              <span key={i} className="flex h-3.5 items-center sm:h-4">
                {d}
              </span>
            ))}
          </div>
          {weeks.map((col, i) => (
            <div key={i} className="grid grid-rows-7 gap-[3px]">
              {col.map((day) => (
                <span
                  key={day.key}
                  title={day.future ? undefined : `${day.label}${day.active ? " · belajar" : ""}`}
                  className={cn(
                    "size-3.5 rounded-[2px] sm:size-4",
                    day.future ? "bg-transparent" : day.active ? "bg-primary" : "bg-surface-2 dark:bg-border-strong",
                    day.key === todayKey() && "ring-1 ring-foreground ring-offset-1 ring-offset-card",
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ Progres per bab ----------------------------- */

function TrackBreakdown({ completed }: { completed: Record<string, number> }) {
  const stats = trackStats(completed);
  return (
    <section aria-labelledby="per-track">
      <h2 id="per-track" className="font-serif text-lg font-semibold">
        Progres per bab
      </h2>
      <ul className="mt-3 divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
        {stats.map((s) => {
          const track = getTrack(s.slug)!;
          const tone = trackTone[s.slug];
          return (
            <li key={s.slug}>
              <Link
                href={`/belajar/${s.slug}/`}
                className="group relative flex min-h-14 flex-wrap items-center gap-x-4 gap-y-2 py-3 pr-4 pl-5 transition-colors hover:bg-surface sm:flex-nowrap"
              >
                <span aria-hidden className={cn("absolute inset-y-0 left-0 w-1", tone?.tab)} />
                <span className="w-14 shrink-0 font-mono text-xs tracking-wider text-muted-foreground uppercase">
                  Bab {String(track.number).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1 font-serif font-semibold wrap-break-word group-hover:text-primary">{s.shortTitle}</span>
                <span className="flex w-full items-center gap-3 sm:w-64 sm:shrink-0">
                  <ProgressBar
                    value={s.percent}
                    tone={s.percent === 100 ? "success" : "primary"}
                    className="flex-1"
                    label={`Progres ${s.title}`}
                  />
                  <span className="w-24 shrink-0 text-right font-mono text-xs text-muted-foreground tabular-nums">
                    {s.done}/{s.total} · {s.percent}%
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ----------------------------------- Cap ------------------------------------ */

function Badges({ data }: { data: ProgressData }) {
  const badges = computeBadges(data);
  const earned = badges.filter((b) => b.earned).length;
  return (
    <section aria-labelledby="lencana">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="lencana" className="font-serif text-lg font-semibold">
          Cap prestasi
        </h2>
        <span className="font-mono text-xs text-muted-foreground">
          {earned} dari {badges.length} sudah dapat
        </span>
      </div>
      <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-6 rounded-lg border border-border bg-card px-4 py-6 sm:grid-cols-3 sm:px-6 lg:grid-cols-5">
        {badges.map((b, i) => {
          const Icon = badgeIcon[b.icon];
          return (
            <li key={b.id} className="flex flex-col items-center text-center">
              <span
                className={cn(
                  "flex size-16 items-center justify-center rounded-full border-2",
                  b.earned
                    ? cn(
                        "ring-1 ring-current ring-offset-2 ring-offset-card",
                        i % 2 === 0 ? "-rotate-6 border-primary text-primary" : "rotate-3 border-accent text-accent",
                      )
                    : "border-dashed border-border-strong text-subtle-foreground",
                )}
              >
                <Icon className="size-6" strokeWidth={1.75} aria-hidden />
              </span>
              <span className={cn("mt-3 font-serif text-sm font-semibold", !b.earned && "text-muted-foreground")}>{b.title}</span>
              <span className="mt-0.5 text-xs text-muted-foreground">{b.description}</span>
              <span className="sr-only">{b.earned ? "Sudah diraih" : "Belum diraih"}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
/* ----------------------------------- Kuis ----------------------------------- */

function quizLabel(id: string): { title: string; href?: string; sub: string } {
  if (id.startsWith("track:")) {
    const t = getTrack(id.slice(6));
    if (t) return { title: `Kuis akhir: ${t.shortTitle}`, href: `/belajar/${t.slug}/kuis/`, sub: `Bab ${t.number}` };
  }
  const l = getLessonById(id);
  if (l) return { title: l.title, href: l.href, sub: l.trackTitle };
  return { title: id, sub: "Kuis" };
}

function QuizResults({ quizzes }: { quizzes: ProgressData["quizzes"] }) {
  const items = Object.entries(quizzes).sort(([, a], [, b]) => b.at - a.at);
  return (
    <section aria-labelledby="hasil-kuis" className="min-w-0 rounded-lg border border-border bg-card p-5 sm:p-6">
      <h2 id="hasil-kuis" className="font-serif text-lg font-semibold">
        Nilai kuis
      </h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">Belum ada kuis yang dikerjakan. Kuis ada di akhir setiap pelajaran dan di akhir setiap bab.</p>
      ) : (
        <ul className="mt-3 divide-y divide-border">
          {items.map(([id, q]) => {
            const info = quizLabel(id);
            const pct = q.total ? Math.round((q.best / q.total) * 100) : 0;
            const content = (
              <>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{info.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {info.sub} · dikerjakan {q.attempts}×
                  </span>
                </span>
                <span
                  className={cn(
                    "shrink-0 rounded-sm border px-2 py-0.5 font-mono text-xs font-semibold tabular-nums",
                    pct === 100
                      ? "border-success/35 bg-success-soft text-success"
                      : pct >= 60
                        ? "border-primary/30 bg-primary-soft text-primary"
                        : "border-accent/35 bg-accent-soft text-accent",
                  )}
                >
                  {q.best}/{q.total}
                </span>
              </>
            );
            return (
              <li key={id}>
                {info.href ? (
                  <Link href={info.href} className="-mx-2 flex min-h-11 items-center gap-3 rounded-md px-2 py-2.5 hover:bg-surface">
                    {content}
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 py-2.5">{content}</div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

/* --------------------------------- Bookmark --------------------------------- */

function Bookmarks({ bookmarks }: { bookmarks: string[] }) {
  const toggle = useProgress((s) => s.toggleBookmark);
  const items = bookmarks.map((id) => getLessonById(id)).filter((l): l is NonNullable<typeof l> => Boolean(l));
  return (
    <section aria-labelledby="ditandai" className="min-w-0 rounded-lg border border-border bg-card p-5 sm:p-6">
      <h2 id="ditandai" className="flex items-center gap-2 font-serif text-lg font-semibold">
        <Bookmark className="size-4 text-muted-foreground" aria-hidden /> Pelajaran ditandai
      </h2>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">Belum ada. Tekan tombol tanda di halaman pelajaran supaya pelajaran itu muncul di sini.</p>
      ) : (
        <ul className="mt-3 divide-y divide-border">
          {items.map((l) => (
            <li key={l.id} className="flex items-center gap-2">
              <Link href={l.href} className="-ml-2 min-w-0 flex-1 rounded-md px-2 py-2.5 hover:bg-surface">
                <span className="block truncate text-sm font-semibold">{l.title}</span>
                <span className="block truncate text-xs text-muted-foreground">{l.trackTitle}</span>
              </Link>
              <button
                type="button"
                onClick={() => toggle(l.id)}
                className={buttonClass("ghost", "icon", "shrink-0 text-muted-foreground hover:text-danger")}
                aria-label={`Hapus tanda ${l.title}`}
              >
                <BookmarkX className="size-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ------------------------------- Kelola data -------------------------------- */

function DataManagement({ data }: { data: ProgressData }) {
  const importData = useProgress((s) => s.importData);
  const reset = useProgress((s) => s.reset);
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleExport() {
    const blob = new Blob([exportProgress(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `progres-crudnative-${todayKey()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setMessage({ type: "ok", text: "Progres berhasil diekspor." });
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.size > 1_000_000) {
      setMessage({ type: "error", text: "File terlalu besar (maks 1 MB)." });
      return;
    }
    try {
      const ok = importData(JSON.parse(await file.text()));
      setMessage(ok ? { type: "ok", text: "Progres berhasil diimpor." } : { type: "error", text: "Format file tidak dikenali." });
    } catch {
      setMessage({ type: "error", text: "File bukan JSON yang valid." });
    }
  }

  return (
    <section aria-labelledby="kelola-data" className="rounded-lg border border-dashed border-border-strong bg-surface p-5 sm:p-6">
      <h2 id="kelola-data" className="font-serif text-lg font-semibold">
        Simpan dan pindahkan progres
      </h2>
      <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
        Progres disimpan di browser ini (localStorage), tanpa akun. Ekspor ke file JSON untuk cadangan, atau impor file itu di perangkat lain, misalnya dari laptop ke HP.
      </p>
      <div className="mt-4 flex flex-col gap-2 min-[420px]:flex-row min-[420px]:flex-wrap">
        <button type="button" onClick={handleExport} className={buttonClass("secondary", "md")}>
          <Download className="size-4" aria-hidden /> Ekspor JSON
        </button>
        <button type="button" onClick={() => fileRef.current?.click()} className={buttonClass("outline", "md")}>
          <Upload className="size-4" aria-hidden /> Impor JSON
        </button>
        <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" tabIndex={-1} onChange={handleImport} aria-hidden />
        <Dialog.Root open={confirmOpen} onOpenChange={setConfirmOpen}>
          <Dialog.Trigger className={buttonClass("ghost", "md", "text-danger hover:bg-danger/10 hover:text-danger")}>
            <RotateCcw className="size-4" aria-hidden /> Reset progres
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-fade-in" />
            <Dialog.Content
              role="alertdialog"
              className="fixed top-1/2 left-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-lg border border-border-strong bg-card p-5 shadow-notebook data-[state=open]:animate-pop-in sm:p-6"
            >
              <Dialog.Title className="font-serif text-lg font-semibold">Reset semua progres?</Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-muted-foreground">
                Pelajaran selesai, nilai kuis, tanda, dan catatan hari belajar akan dihapus dari browser ini. Ini tidak bisa dibatalkan. Kalau ingin menyimpan cadangan, ekspor dulu.
              </Dialog.Description>
              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Dialog.Close className={buttonClass("outline", "md")}>Batal</Dialog.Close>
                <button
                  type="button"
                  className={buttonClass("danger", "md")}
                  onClick={() => {
                    reset();
                    setConfirmOpen(false);
                    setMessage({ type: "ok", text: "Progres sudah direset." });
                  }}
                >
                  Ya, reset
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
      <p
        role="status"
        className={cn("mt-3 min-h-5 text-sm font-medium", message?.type === "error" ? "text-danger" : "text-success")}
      >
        {message?.text}
      </p>
      <p className="font-mono text-xs text-subtle-foreground">
        {tracks.length} bab · {allLessons.length} pelajaran tercatat
      </p>
    </section>
  );
}
