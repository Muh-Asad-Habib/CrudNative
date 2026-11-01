"use client";

import { useEffect, useRef, useState } from "react";
import type { Database, QueryExecResult } from "sql.js";
import { ChevronDown, Database as DbIcon, Loader2, Play, RotateCcw, TableProperties } from "lucide-react";
import { SQL_PRESETS, SQL_SEED, SQL_TABLES } from "@/lib/labs/sql-seed";
import { asset, cn } from "@/lib/utils";
import { Kbd } from "@/components/ui/card";
import { buttonClass } from "@/components/ui/button";
import { LabShell, labActionClass, labCaptionClass, labChipClass } from "./lab-shell";

type RunResult =
  | { kind: "ok"; results: QueryExecResult[]; changes: number; ms: number }
  | { kind: "error"; message: string };

let sqlPromise: Promise<import("sql.js").SqlJsStatic> | null = null;
function loadSql() {
  if (!sqlPromise) {
    sqlPromise = import("sql.js").then((mod) => mod.default({ locateFile: () => asset("/sql-wasm.wasm") }));
    sqlPromise.catch(() => {
      sqlPromise = null;
    });
  }
  return sqlPromise;
}

/** DB aktif, muatan yang sedang berjalan, dan nomor generasi untuk membatalkan muatan lama. */
interface Engine {
  db: Database | null;
  pending: Promise<Database | null> | null;
  gen: number;
}

/** Dipakai Reset dan unmount: tutup DB aktif dan abaikan muatan yang belum selesai. */
function closeEngine(engine: Engine) {
  engine.gen += 1;
  engine.pending = null;
  engine.db?.close();
  engine.db = null;
}

export default function SqlPlayground({ initialQuery = "SELECT * FROM tasks;" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "failed">("idle");
  const [result, setResult] = useState<RunResult | null>(null);
  const [schemaOpen, setSchemaOpen] = useState(false);
  const engineRef = useRef<Engine>({ db: null, pending: null, gen: 0 });

  useEffect(() => {
    const engine = engineRef.current;
    return () => closeEngine(engine);
  }, []);

  const ensureDb = (): Promise<Database | null> => {
    const engine = engineRef.current;
    if (engine.db) return Promise.resolve(engine.db);
    // Klik tabel, Ctrl+Enter, dan Jalankan selama memuat memakai satu muatan yang sama.
    if (engine.pending) return engine.pending;
    const gen = engine.gen;
    const stale = () => gen !== engine.gen;
    setStatus("loading");
    const pending: Promise<Database | null> = (async () => {
      try {
        const SQL = await loadSql();
        // Reset atau unmount terjadi selama memuat: jangan buat DB yang tidak akan dipakai.
        if (stale()) return null;
        const db = new SQL.Database();
        try {
          db.exec("PRAGMA foreign_keys = ON;");
          db.exec(SQL_SEED);
        } catch (err) {
          db.close();
          throw err;
        }
        engine.db = db;
        setStatus("ready");
        return db;
      } catch (err) {
        if (stale()) return null;
        setStatus("failed");
        setResult({ kind: "error", message: `Gagal memuat engine SQL: ${(err as Error).message}` });
        return null;
      }
    })().finally(() => {
      if (engine.pending === pending) engine.pending = null;
    });
    engine.pending = pending;
    return pending;
  };

  const run = async (sql = query) => {
    const db = await ensureDb();
    if (!db) return;
    // getRowsModified() keeps the count of the last write even after a SELECT, so diff total_changes() instead.
    const totalChanges = () => Number(db.exec("SELECT total_changes()")[0]?.values[0]?.[0] ?? 0);
    const t0 = performance.now();
    try {
      const before = totalChanges();
      const results = db.exec(sql);
      const ms = Math.round(performance.now() - t0);
      setResult({ kind: "ok", results, changes: totalChanges() - before, ms });
    } catch (err) {
      setResult({ kind: "error", message: (err as Error).message });
    }
  };

  const reset = () => {
    closeEngine(engineRef.current);
    setResult(null);
    setStatus("idle");
  };

  return (
    <LabShell
      title="SQL Playground"
      subtitle="Database SQLite sungguhan yang jalan di browser. Ubah datanya sesukamu, bisa dikembalikan kapan saja."
      icon={<DbIcon aria-hidden />}
      actions={
        <button type="button" onClick={reset} className={labActionClass}>
          <RotateCcw aria-hidden /> Reset DB
        </button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-[200px_minmax(0,1fr)]">
        <aside className="min-w-0 border-b border-border-strong bg-surface/60 p-3 lg:border-r lg:border-b-0" aria-label="Skema database">
          <div className="flex min-h-11 items-center justify-between gap-2 lg:mb-2 lg:min-h-0">
            <p className={cn(labCaptionClass, "flex items-center gap-1.5")}>
              <TableProperties className="size-3.5" aria-hidden /> Skema
              <span className="normal-case tracking-normal text-subtle-foreground lg:hidden">· {SQL_TABLES.length} tabel</span>
            </p>
            <button
              type="button"
              onClick={() => setSchemaOpen((v) => !v)}
              aria-expanded={schemaOpen}
              aria-controls="sql-schema-list"
              className="-mr-1 inline-flex min-h-11 items-center gap-1 rounded-md px-2 text-sm font-semibold text-primary hover:bg-primary-soft lg:hidden"
            >
              {schemaOpen ? "Tutup kolom" : "Lihat kolom"}
              <ChevronDown
                className={cn("size-3.5 transition-transform motion-reduce:transition-none", schemaOpen && "rotate-180")}
                aria-hidden
              />
            </button>
          </div>
          <ul
            id="sql-schema-list"
            className={cn("mt-2 grid gap-2 lg:mt-0 lg:grid-cols-1", schemaOpen ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-3")}
          >
            {SQL_TABLES.map((t) => (
              <li key={t.name} className="min-w-0">
                <button
                  type="button"
                  onClick={() => {
                    const q = `SELECT * FROM ${t.name};`;
                    setQuery(q);
                    void run(q);
                  }}
                  title={`SELECT * FROM ${t.name};`}
                  className="group flex min-h-11 w-full min-w-0 flex-col items-start justify-center rounded-md border border-border-strong bg-card px-2 py-1.5 text-left transition-colors hover:bg-surface-2 motion-reduce:transition-none sm:px-2.5"
                >
                  <span className="max-w-full truncate font-mono text-sm font-bold text-primary group-hover:underline">{t.name}</span>
                  <span
                    className={cn(
                      "mt-0.5 font-mono text-xs leading-snug text-subtle-foreground [overflow-wrap:anywhere]",
                      schemaOpen ? "block" : "hidden lg:block",
                    )}
                  >
                    {t.columns.join(", ")}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <div className="min-w-0 p-3 sm:p-4">
          <p className={cn(labCaptionClass, "mb-2")}>Contoh query, klik untuk menyalin ke editor</p>
          <div
            className="mb-3 flex flex-wrap gap-2"
            aria-label="Contoh query"
          >
            {SQL_PRESETS.map((p) => (
              <button key={p.label} type="button" onClick={() => setQuery(p.sql)} className={labChipClass}>
                {p.label}
              </button>
            ))}
          </div>

          <label htmlFor="sql-editor" className="sr-only">
            Query SQL
          </label>
          <textarea
            id="sql-editor"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                void run();
              }
            }}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            rows={6}
            className="block max-h-[60dvh] min-h-32 w-full resize-y rounded-md border border-code-border bg-code-bg p-3 font-mono text-base leading-relaxed outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm"
          />
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
            <button
              type="button"
              onClick={() => void run()}
              disabled={status === "loading"}
              className={buttonClass("primary", "md", "px-5 disabled:opacity-70")}
            >
              {status === "loading" ? (
                <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden />
              ) : (
                <Play className="size-4" aria-hidden />
              )}
              {status === "loading" ? "Memuat SQLite…" : "Jalankan"}
            </button>
            <span className="hidden text-xs text-subtle-foreground sm:inline">
              atau <Kbd>Ctrl</Kbd> + <Kbd>Enter</Kbd>
            </span>
          </div>

          <div className="mt-4" aria-live="polite">
            {result?.kind === "error" ? (
              <div className="rounded-md border border-l-4 border-danger/40 border-l-danger bg-danger-soft p-3 font-mono text-[12.5px] break-words text-danger" role="alert">
                <p className="mb-1 font-sans text-sm font-bold">Query gagal</p>
                {result.message}
              </div>
            ) : result?.kind === "ok" ? (
              <div className="space-y-3">
                {result.results.length === 0 ? (
                  <p className="rounded-md border border-l-4 border-success/40 border-l-success bg-success-soft p-3 text-sm text-pretty text-success">
                    <strong>Query berhasil.</strong>{" "}
                    {result.changes > 0 ? `${result.changes} baris berubah` : "Tidak ada baris yang dikembalikan atau diubah"} ·{" "}
                    {result.ms} ms
                  </p>
                ) : (
                  result.results.map((r, idx) => (
                    <div key={idx} className="overflow-hidden rounded-md border border-border-strong">
                      <div className="max-h-[min(20rem,55dvh)] overflow-auto overscroll-x-contain scrollbar-thin">
                        <table className="w-full text-left text-[12.5px]">
                          <thead className="sticky top-0 border-b border-border-strong bg-surface">
                            <tr>
                              {r.columns.map((c) => (
                                <th key={c} className="px-3 py-2 font-mono font-semibold whitespace-nowrap text-muted-foreground">
                                  {c}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {r.values.map((row, i) => (
                              <tr key={i} className="border-t border-border">
                                {row.map((cell, j) => (
                                  <td
                                    key={j}
                                    className={cn(
                                      "max-w-[260px] truncate px-3 py-1.5 font-mono whitespace-nowrap",
                                      cell === null && "text-subtle-foreground italic",
                                    )}
                                  >
                                    {cell === null ? "NULL" : cell instanceof Uint8Array ? "[BLOB]" : String(cell)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <p className="border-t border-border-strong bg-surface px-3 py-1.5 font-mono text-xs text-muted-foreground">
                        <span className="font-sans font-semibold text-success">Query berhasil</span> · {r.values.length} baris · {result.ms} ms
                      </p>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <p className="rounded-md border border-dashed border-border-strong p-4 text-center text-sm text-pretty text-subtle-foreground sm:p-6">
                Hasil query muncul di sini. Pertama kali dijalankan, browser perlu mengunduh SQLite (sekitar 600 KB).
              </p>
            )}
          </div>
        </div>
      </div>
    </LabShell>
  );
}
