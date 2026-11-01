"use client";

import { useState } from "react";
import { Check, Database, Pencil, Plus, RefreshCw, RotateCcw, Server, Smartphone, Table2, Trash2, X } from "lucide-react";
import { createMockDb } from "@/lib/labs/mock-api";
import { OP_INFO, simCreate, simDelete, simList, simUpdate, type CrudOp, type SimState } from "@/lib/labs/crud-sim";
import { cn } from "@/lib/utils";
import { buttonClass } from "@/components/ui/button";
import { JsonView, LabShell, StatusChip, labActionClass, labCaptionClass, methodTone, statusTone } from "./lab-shell";

const opTone: Record<CrudOp, string> = {
  CREATE: "border-t-emerald-600 bg-emerald-500/10 text-emerald-800 dark:border-t-emerald-400 dark:text-emerald-300",
  READ: "border-t-sky-600 bg-sky-500/10 text-sky-800 dark:border-t-sky-400 dark:text-sky-300",
  UPDATE: "border-t-amber-600 bg-amber-500/10 text-amber-800 dark:border-t-amber-400 dark:text-amber-300",
  DELETE: "border-t-rose-600 bg-rose-500/10 text-rose-800 dark:border-t-rose-400 dark:text-rose-300",
};

function initial(): SimState {
  return simList({ db: createMockDb(), log: [], seq: 0 });
}

export default function CrudSimulator() {
  const [state, setState] = useState<SimState>(initial);
  const [title, setTitle] = useState("");
  const [editing, setEditing] = useState<{ id: number; title: string } | null>(null);
  const [view, setView] = useState<"request" | "sql" | "response">("request");
  const [showTable, setShowTable] = useState(false);
  const latest = state.log[0];
  const tasks = [...state.db.tasks].sort((a, b) => b.id - a.id);

  const create = (e: React.FormEvent) => {
    e.preventDefault();
    setState((s) => simCreate(s, title));
    if (title.trim()) setTitle("");
  };

  const saveEdit = () => {
    if (!editing) return;
    setState((s) => simUpdate(s, editing.id, { title: editing.title }));
    setEditing(null);
  };

  return (
    <LabShell
      title="Simulator CRUD"
      subtitle="Klik tombol di layar aplikasi, lalu lihat request, query SQL, dan jawaban server di panel Di balik layar."
      icon={<Table2 aria-hidden />}
      actions={
        <button
          type="button"
          onClick={() => {
            setState(initial());
            setEditing(null);
          }}
          className={labActionClass}
        >
          <RotateCcw aria-hidden /> Reset
        </button>
      }
    >
      <ol className="grid grid-cols-2 gap-px border-b border-border-strong bg-border sm:grid-cols-4" aria-label="Empat operasi CRUD">
        {(Object.keys(OP_INFO) as CrudOp[]).map((op) => {
          const active = latest?.op === op;
          return (
            <li
              key={op}
              aria-current={active ? "step" : undefined}
              className={cn(
                "min-w-0 border-t-[3px] px-3 py-2.5 text-xs transition-colors duration-200 motion-reduce:transition-none",
                active ? opTone[op] : "border-t-transparent bg-card text-muted-foreground",
              )}
            >
              <p className="flex items-baseline justify-between gap-2">
                <span className="font-mono font-bold tracking-wider">{op}</span>
                {active ? <span className="font-semibold">terakhir</span> : null}
              </p>
              <p className="mt-0.5 leading-snug text-pretty">{OP_INFO[op].label}</p>
              <p className="mt-0.5 font-mono leading-snug opacity-90">
                {OP_INFO[op].method} · {OP_INFO[op].sql}
              </p>
            </li>
          );
        })}
      </ol>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        {/* Aplikasi */}
        <div className="min-w-0 border-b border-border-strong p-3 sm:p-4 lg:border-r lg:border-b-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <p className={cn(labCaptionClass, "flex items-center gap-1.5")}>
              <Smartphone className="size-4 shrink-0" aria-hidden /> Aplikasi (client)
            </p>
            <button type="button" onClick={() => setState((s) => simList(s))} className={cn(labActionClass, "ml-auto")}>
              <RefreshCw aria-hidden /> Muat ulang
            </button>
          </div>
          <form onSubmit={create} className="flex gap-2">
            <label htmlFor="crud-sim-title" className="sr-only">
              Judul tugas baru
            </label>
            <input
              id="crud-sim-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tugas baru…"
              className="h-11 min-w-0 flex-1 rounded-md border border-border-strong bg-background px-3 text-base outline-none placeholder:text-subtle-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm"
            />
            <button type="submit" className={buttonClass("primary", "md", "px-3.5 sm:px-4")}>
              <Plus aria-hidden /> Tambah
            </button>
          </form>
          <p className="mt-1.5 text-xs text-subtle-foreground">Coba juga tekan Tambah dengan kolom kosong.</p>

          <ul
            className="mt-3 max-h-[min(28rem,60dvh)] divide-y divide-border overflow-y-auto overscroll-contain rounded-md border border-border-strong bg-background scrollbar-thin"
            aria-label="Daftar tugas"
          >
            {tasks.length === 0 ? (
              <li className="p-6 text-center text-sm text-muted-foreground">Daftar masih kosong. Tulis tugas di atas, lalu tekan Tambah.</li>
            ) : null}
            {tasks.map((t) => (
              <li key={t.id} className="flex items-center gap-1 px-1 py-0.5 animate-slide-up motion-reduce:animate-none sm:gap-2 sm:px-1.5">
                <button
                  type="button"
                  onClick={() => setState((s) => simUpdate(s, t.id, { done: !t.done }))}
                  className="flex size-11 shrink-0 items-center justify-center rounded-md hover:bg-surface-2"
                  aria-label={t.done ? `Tandai "${t.title}" belum selesai` : `Tandai "${t.title}" selesai`}
                  aria-pressed={t.done}
                >
                  <span
                    className={cn(
                      "flex size-5 items-center justify-center rounded-sm border-2 transition-colors",
                      t.done ? "border-success bg-success text-white dark:text-slate-950" : "border-border-strong bg-card",
                    )}
                  >
                    {t.done ? <Check className="size-3.5" strokeWidth={3} /> : null}
                  </span>
                </button>
                {editing?.id === t.id ? (
                  <form
                    className="flex min-w-0 flex-1 items-center gap-1"
                    onSubmit={(e) => {
                      e.preventDefault();
                      saveEdit();
                    }}
                  >
                    <input
                      autoFocus
                      aria-label="Ubah judul tugas"
                      value={editing.title}
                      onChange={(e) => setEditing({ id: t.id, title: e.target.value })}
                      onKeyDown={(e) => e.key === "Escape" && setEditing(null)}
                      className="h-11 min-w-0 flex-1 rounded-md border border-primary bg-background px-2 text-base outline-none ring-2 ring-primary/20 sm:text-sm"
                    />
                    <button
                      type="submit"
                      className="flex size-11 shrink-0 items-center justify-center rounded-md text-success hover:bg-success-soft"
                      aria-label="Simpan"
                    >
                      <Check className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(null)}
                      className="flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-2"
                      aria-label="Batal"
                    >
                      <X className="size-4" />
                    </button>
                  </form>
                ) : (
                  <>
                    <span
                      className={cn(
                        "line-clamp-2 min-w-0 flex-1 text-sm [overflow-wrap:anywhere]",
                        t.done && "text-subtle-foreground line-through",
                      )}
                    >
                      <span className="mr-1.5 font-mono text-xs text-subtle-foreground">#{t.id}</span>
                      {t.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditing({ id: t.id, title: t.title })}
                      className="flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                      aria-label={`Ubah "${t.title}"`}
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setState((s) => simDelete(s, t.id))}
                      className="flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-danger-soft hover:text-danger"
                      aria-label={`Hapus "${t.title}"`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Di balik layar */}
        <div className="min-w-0 p-3 sm:p-4">
          <div className="mb-3 flex min-h-11 flex-wrap items-center gap-2">
            <p className={cn(labCaptionClass, "flex items-center gap-1.5")}>
              <Server className="size-4 shrink-0" aria-hidden /> Di balik layar
            </p>
            {latest ? (
              <span className="ml-auto flex flex-wrap items-center gap-1.5">
                <span className={cn("rounded-sm px-1.5 py-0.5 font-mono text-xs font-bold", methodTone(latest.request.method))}>
                  {latest.request.method}
                </span>
                <StatusChip status={latest.response.status} text={latest.response.statusText} />
              </span>
            ) : null}
          </div>

          <div role="group" aria-label="Detail operasi" className="grid grid-cols-3 border-b border-border-strong">
            {(
              [
                ["request", "1 · Request"],
                ["sql", "2 · SQL"],
                ["response", "3 · Response"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                type="button"
                aria-pressed={view === key}
                onClick={() => setView(key)}
                className={cn(
                  "-mb-px min-h-11 min-w-0 border-b-2 px-1 text-xs font-semibold transition-colors sm:text-sm",
                  view === key
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="mt-3 min-h-[180px] min-w-0 rounded-md border border-code-border bg-code-bg p-3">
            {latest ? (
              view === "request" ? (
                <div>
                  <p className="mb-2 font-mono text-[12.5px] font-semibold break-all">
                    <span className={cn("mr-2 rounded-sm px-1.5 py-0.5", methodTone(latest.request.method))}>
                      {latest.request.method}
                    </span>
                    http://localhost:3000{latest.request.url}
                  </p>
                  {latest.request.body !== undefined ? (
                    <>
                      <p className={cn(labCaptionClass, "mb-1")}>Body (JSON)</p>
                      <JsonView value={latest.request.body} className="max-h-[min(16rem,50dvh)]" />
                    </>
                  ) : (
                    <p className="text-xs text-subtle-foreground">Request {latest.request.method} ini tidak membawa body.</p>
                  )}
                </div>
              ) : view === "sql" ? (
                <pre className="max-h-[min(16rem,50dvh)] overflow-auto font-mono text-[12.5px] leading-relaxed text-foreground scrollbar-thin">
                  {latest.sql}
                </pre>
              ) : (
                <div>
                  <p className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[12.5px]">
                    <StatusChip status={latest.response.status} text={latest.response.statusText} />
                    <span className="text-subtle-foreground">{latest.response.durationMs} ms</span>
                  </p>
                  <JsonView value={latest.response.body} className="max-h-[min(16rem,50dvh)]" />
                </div>
              )
            ) : null}
          </div>

          <div className="mt-3">
            <button
              type="button"
              onClick={() => setShowTable((v) => !v)}
              aria-expanded={showTable}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              <Database className="size-4" aria-hidden /> {showTable ? "Tutup" : "Lihat"} isi tabel{" "}
              <code className="font-mono">tasks</code>
            </button>
            {showTable ? (
              <div className="mt-2 overflow-x-auto rounded-md border border-border-strong scrollbar-thin">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="border-b border-border-strong bg-surface text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 font-semibold">id</th>
                      <th className="px-3 py-2 font-semibold">title</th>
                      <th className="px-3 py-2 font-semibold">done</th>
                      <th className="px-3 py-2 font-semibold">priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...state.db.tasks].map((t) => (
                      <tr key={t.id} className="border-t border-border">
                        <td className="px-3 py-1.5">{t.id}</td>
                        <td className="max-w-[min(220px,45vw)] truncate px-3 py-1.5">{t.title}</td>
                        <td className="px-3 py-1.5">{t.done ? 1 : 0}</td>
                        <td className="px-3 py-1.5">{t.priority}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>

          {state.log.length > 1 ? (
            <details className="mt-1">
              <summary className="flex min-h-11 cursor-pointer items-center text-sm font-semibold text-muted-foreground hover:text-foreground">
                Riwayat ({state.log.length} operasi)
              </summary>
              <ol className="mt-1 max-h-[min(12rem,40dvh)] divide-y divide-border overflow-y-auto overscroll-contain rounded-md border border-border scrollbar-thin">
                {state.log.map((entry) => (
                  <li key={entry.id} className="flex items-center gap-2 px-2 py-1.5 font-mono text-xs">
                    <span className={cn("w-14 shrink-0 rounded-sm px-1 text-center font-bold", methodTone(entry.request.method))}>
                      {entry.request.method}
                    </span>
                    <span className="min-w-0 flex-1 truncate">{entry.request.url}</span>
                    <span className={cn("rounded-sm border px-1 font-bold", statusTone(entry.response.status))}>
                      {entry.response.status}
                    </span>
                  </li>
                ))}
              </ol>
            </details>
          ) : null}
        </div>
      </div>
    </LabShell>
  );
}
