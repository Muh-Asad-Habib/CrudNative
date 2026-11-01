"use client";

import { createContext, useContext } from "react";
import { cn } from "@/lib/utils";

const tokenRe = /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g;

/** Pretty JSON dengan pewarnaan sintaks ringan (tanpa dependensi). */
export function JsonView({ value, className }: { value: unknown; className?: string }) {
  if (value === null || value === undefined) {
    return <p className={cn("font-mono text-xs text-subtle-foreground italic", className)}>(tidak ada body)</p>;
  }
  const text = typeof value === "string" ? value : JSON.stringify(value, null, 2);
  const parts: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(tokenRe)) {
    const start = m.index ?? 0;
    if (start > last) parts.push(text.slice(last, start));
    const tok = m[0];
    let cls = "text-amber-700 dark:text-amber-300";
    if (tok.startsWith('"')) cls = m[2] ? "text-indigo-700 dark:text-indigo-300" : "text-emerald-700 dark:text-emerald-300";
    else if (tok === "true" || tok === "false") cls = "text-rose-700 dark:text-rose-300";
    else if (tok === "null") cls = "text-subtle-foreground";
    parts.push(
      <span key={key++} className={cls}>
        {tok}
      </span>,
    );
    last = start + tok.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return (
    <pre className={cn("overflow-x-auto font-mono text-[12.5px] leading-relaxed whitespace-pre scrollbar-thin", className)}>
      <code>{parts}</code>
    </pre>
  );
}

export function methodTone(method: string) {
  switch (method) {
    case "GET":
      return "bg-sky-500/15 text-sky-700 dark:text-sky-300";
    case "POST":
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300";
    case "PUT":
    case "PATCH":
      return "bg-amber-500/15 text-amber-700 dark:text-amber-300";
    case "DELETE":
      return "bg-rose-500/15 text-rose-700 dark:text-rose-300";
    default:
      return "bg-surface-2 text-muted-foreground";
  }
}

export function statusTone(status: number) {
  if (status >= 500) return "bg-danger-soft text-danger border-danger/30";
  if (status >= 400) return "bg-warning-soft text-warning border-warning/30";
  if (status >= 200 && status < 300) return "bg-success-soft text-success border-success/30";
  return "bg-surface-2 text-muted-foreground border-border";
}

/** Kata polos untuk status code, supaya warna tidak jadi satu-satunya penanda. */
export function statusWord(status: number) {
  if (status >= 500) return "server error";
  if (status >= 400) return "ditolak";
  if (status >= 200 && status < 300) return "berhasil";
  return "info";
}

/** Lencana status: kode + teks + kata polos (berhasil/ditolak). */
export function StatusChip({ status, text, className }: { status: number; text?: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex flex-wrap items-center gap-x-1.5 rounded-sm border px-1.5 py-0.5 font-mono text-xs font-bold",
        statusTone(status),
        className,
      )}
    >
      {status}
      {text ? ` ${text}` : null}
      <span className="font-sans font-semibold">· {statusWord(status)}</span>
    </span>
  );
}

/** Tombol sekunder di kepala lab (Reset, Buka di Snack): tinggi 44px, garis tipis. */
export const labActionClass =
  "inline-flex min-h-11 items-center gap-1.5 rounded-md border border-border-strong bg-card px-3 text-sm font-semibold text-foreground transition-colors hover:bg-surface-2 [&_svg]:size-4 [&_svg]:shrink-0";

/** Tombol pilihan kecil (preset/opsi) setinggi 44px. */
export const labChipClass =
  "inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-md border border-border-strong bg-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-2";

/** Label bagian di dalam lab, gaya catatan mesin ketik. */
export const labCaptionClass = "font-mono text-xs font-medium tracking-wider text-muted-foreground uppercase";

/** Cuplikan beberapa baris kode pertama (tanpa efek pudar), dipakai sebelum editor dimuat. */
export function CodePeek({ code, lines = 8, className }: { code: string; lines?: number; className?: string }) {
  const all = code.replace(/\n+$/, "").split("\n");
  const rest = all.length - lines;
  return (
    <pre
      className={cn(
        "w-full overflow-x-auto rounded-md border border-code-border bg-code-bg p-3 text-left font-mono text-xs leading-relaxed text-muted-foreground scrollbar-thin",
        className,
      )}
    >
      {all.slice(0, lines).join("\n")}
      {rest > 0 ? <span className="block text-subtle-foreground">{`// … ${rest} baris lagi`}</span> : null}
    </pre>
  );
}

const LabFrameContext = createContext<{ number: number } | null>(null);

/** Dipakai halaman /lab/[slug]: memberi nomor lab ke LabShell dan menyembunyikan judul ganda. */
export function LabFrameProvider({ number, children }: { number: number; children: React.ReactNode }) {
  return <LabFrameContext.Provider value={{ number }}>{children}</LabFrameContext.Provider>;
}

export function LabShell({
  title,
  subtitle,
  icon,
  actions,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const frame = useContext(LabFrameContext);
  return (
    <section
      className={cn(
        "not-prose my-6 min-w-0 overflow-hidden rounded-md border border-border-strong bg-card shadow-notebook sm:my-8",
        className,
      )}
      aria-label={title}
    >
      <header className="flex flex-wrap items-center gap-x-4 gap-y-3 border-b border-border-strong bg-surface px-3 py-3 sm:px-4">
        <div className="min-w-0 flex-1 basis-60">
          <p className="flex items-center gap-1.5 text-subtle-foreground [&_svg]:size-3.5 [&_svg]:shrink-0">
            {icon}
            <span className={labCaptionClass}>
              {frame ? `Lab ${String(frame.number).padStart(2, "0")} · area kerja` : "Latihan langsung"}
            </span>
          </p>
          {frame ? null : (
            <p className="mt-1 font-serif text-lg leading-snug font-semibold text-balance text-foreground [overflow-wrap:anywhere]">
              {title}
            </p>
          )}
          {subtitle ? <p className="mt-1 text-sm leading-relaxed text-pretty text-muted-foreground">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </header>
      {children}
    </section>
  );
}

export function LabSkeleton({ label = "Memuat lab…", height = 420 }: { label?: string; height?: number }) {
  return (
    <div
      className="not-prose my-6 flex items-center justify-center rounded-md border border-dashed border-border-strong bg-surface px-4 text-center font-mono text-sm text-muted-foreground sm:my-8"
      style={{ minHeight: `min(${height}px, 70dvh)` }}
      role="status"
    >
      <span className="animate-pulse motion-reduce:animate-none">{label}</span>
    </div>
  );
}
