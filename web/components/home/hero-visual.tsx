"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { ArrowDown, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";

const NEW_TASK = "Laporan Praktikum Basis Data";

const existingRows = [
  { id: 1, title: "Kuis Pemrograman Mobile", done: 0 },
  { id: 2, title: "Baca Bab 4 Jaringan", done: 1 },
];

function Stage({ n, label, active, children }: { n: number; label: string; active: boolean; children: React.ReactNode }) {
  return (
    <div>
      <p className="flex items-baseline gap-2">
        <span className="font-mono text-[11px] text-subtle-foreground">0{n}</span>
        <span className={cn("text-sm font-semibold", active && "marker")}>{label}</span>
      </p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Hop({ label }: { label: string }) {
  return (
    <p className="flex min-w-0 items-center gap-2 py-2 pl-1 font-mono text-[11px] text-subtle-foreground">
      <ArrowDown className="size-3.5 shrink-0" aria-hidden />
      <span className="truncate">{label}</span>
    </p>
  );
}

/** Kartu indeks di hero: perjalanan satu data dari tombol Simpan sampai jadi baris di tabel. */
export function HeroVisual() {
  const reduce = useReducedMotion();
  const [stage, setStage] = useState(2);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduce || paused) return;
    const t = setInterval(() => setStage((s) => (s + 1) % 3), 2600);
    return () => clearInterval(t);
  }, [reduce, paused]);

  const live = reduce ? 2 : stage;
  const toggleLabel = paused ? "Putar animasi" : "Jeda animasi";

  return (
    // Tombol jeda tidak boleh berada di dalam role="img", jadi role itu dipasang di isi kartu saja.
    <div className="relative w-full max-w-[440px] select-none lg:mx-auto 2xl:max-w-[480px]">
      <div className="mb-2 text-right" aria-hidden>
        <span className="inline-block -rotate-2 pr-1 font-hand text-[1.375rem] leading-none text-primary sm:text-2xl">
          intinya cuma 3 langkah ini ↓
        </span>
      </div>

      <div className="overflow-hidden rounded-md border border-border-strong bg-card shadow-notebook">
        <div className="flex items-center justify-between gap-3 border-b-2 border-danger/30 px-4 py-2.5 font-mono text-[11px] text-muted-foreground">
          <span className="tracking-wider uppercase" aria-hidden>
            Kartu 1 · Alur simpan
          </span>
          <span className="flex items-center">
            <span aria-hidden>tasks</span>
            {/* Disembunyikan lewat CSS saat reduced motion (animasi memang tidak jalan), agar markup server dan klien sama. */}
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={toggleLabel}
              title={toggleLabel}
              className="-my-2.5 -mr-3 flex size-11 shrink-0 items-center justify-center rounded-md transition-colors hover:text-foreground focus-visible:outline-offset-[-2px] motion-reduce:hidden"
            >
              {paused ? <Play className="size-3.5" aria-hidden /> : <Pause className="size-3.5" aria-hidden />}
            </button>
          </span>
        </div>

        <div
          role="img"
          aria-label={`Alur data: tombol Simpan mengirim POST /api/tasks ke server, lalu tugas "${NEW_TASK}" tersimpan sebagai baris baru di tabel tasks.`}
          className="p-4 sm:p-5"
        >
          <Stage n={1} label="Kamu menekan Simpan" active={live === 0}>
            <div className="flex items-center gap-2">
              <span className="min-w-0 flex-1 truncate rounded border border-border-strong bg-background px-2.5 py-1.5 text-[13px]">
                {NEW_TASK}
              </span>
              <span
                className={cn(
                  "shrink-0 rounded bg-primary px-3 py-1.5 text-[13px] font-semibold text-primary-foreground ring-offset-2 ring-offset-card transition-shadow duration-300",
                  live === 0 && "ring-2 ring-highlight",
                )}
              >
                Simpan
              </span>
            </div>
          </Stage>

          <Hop label='fetch("/api/tasks", { method: "POST" })' />

          <Stage n={2} label="Server menerima request" active={live === 1}>
            <div className="rounded border border-code-border bg-code-bg px-3 py-2 font-mono text-[11.5px] leading-relaxed">
              <p>
                <span className="font-semibold text-success">POST</span> /api/tasks
              </p>
              <p className="truncate text-muted-foreground">{`{ "title": "${NEW_TASK}" }`}</p>
              <p className="text-muted-foreground">
                → <span className="font-semibold text-success">201</span> Created
              </p>
            </div>
          </Stage>

          <Hop label="INSERT INTO tasks (title) VALUES (…)" />

          <Stage n={3} label="Datanya jadi baris baru" active={live === 2}>
            <table className="w-full table-fixed border-collapse font-mono text-[11.5px]">
              <thead>
                <tr className="border-b border-border-strong text-left text-subtle-foreground">
                  <th className="w-8 py-1 font-medium">id</th>
                  <th className="py-1 font-medium">title</th>
                  <th className="w-11 py-1 text-right font-medium">done</th>
                </tr>
              </thead>
              <tbody>
                {existingRows.map((r) => (
                  <tr key={r.id} className="border-b border-border">
                    <td className="py-1 text-subtle-foreground">{r.id}</td>
                    <td className="truncate py-1 pr-2">{r.title}</td>
                    <td className="py-1 text-right">{r.done}</td>
                  </tr>
                ))}
                <tr className={cn("bg-marker transition-opacity duration-300", live === 2 ? "opacity-100" : "opacity-0")}>
                  <td className="py-1 pl-1">3</td>
                  <td className="truncate py-1 pr-2 font-semibold">{NEW_TASK}</td>
                  <td className="py-1 pr-1 text-right">0</td>
                </tr>
              </tbody>
            </table>
          </Stage>
        </div>
      </div>
    </div>
  );
}
