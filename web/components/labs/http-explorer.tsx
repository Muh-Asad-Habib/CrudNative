"use client";

import { useEffect, useRef, useState } from "react";
import { History, RotateCcw, Send } from "lucide-react";
import {
  createMockDb,
  handleMockRequest,
  STATUS_EXPLAIN,
  type HttpMethod,
  type MockDb,
  type MockResponse,
} from "@/lib/labs/mock-api";
import { cn } from "@/lib/utils";
import { InlineText } from "@/components/mdx/inline-text";
import { buttonClass } from "@/components/ui/button";
import { JsonView, LabShell, StatusChip, labActionClass, labCaptionClass, labChipClass, methodTone, statusTone } from "./lab-shell";

const METHODS: HttpMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];

const PRESETS: { label: string; method: HttpMethod; path: string; body?: string }[] = [
  { label: "Daftar tugas", method: "GET", path: "/api/tasks?page=1&limit=3" },
  { label: "Detail #2", method: "GET", path: "/api/tasks/2" },
  { label: "Filter selesai", method: "GET", path: "/api/tasks?done=true" },
  { label: "Tambah tugas", method: "POST", path: "/api/tasks", body: '{\n  "title": "Belajar REST API",\n  "priority": "tinggi"\n}' },
  { label: "Tandai selesai", method: "PATCH", path: "/api/tasks/2", body: '{\n  "done": true\n}' },
  { label: "Hapus #3", method: "DELETE", path: "/api/tasks/3" },
  { label: "404", method: "GET", path: "/api/tasks/999" },
  { label: "400 validasi", method: "POST", path: "/api/tasks", body: '{\n  "title": "",\n  "done": "ya"\n}' },
];

const hasBody = (m: HttpMethod) => m === "POST" || m === "PUT" || m === "PATCH";

interface HistoryItem {
  id: number;
  method: HttpMethod;
  path: string;
  status: number;
}

export default function HttpExplorer({
  initialMethod = "GET",
  initialPath = "/api/tasks",
}: {
  initialMethod?: HttpMethod;
  initialPath?: string;
}) {
  const [db, setDb] = useState<MockDb>(createMockDb);
  const [method, setMethod] = useState<HttpMethod>(initialMethod);
  const [path, setPath] = useState(initialPath);
  const [body, setBody] = useState('{\n  "title": "Tugas baru"\n}');
  const [bodyError, setBodyError] = useState<string | null>(null);
  const [response, setResponse] = useState<MockResponse | null>(null);
  const [tab, setTab] = useState<"body" | "headers">("body");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [sending, setSending] = useState(false);
  const sendTimer = useRef<number | null>(null);

  const clearSendTimer = () => {
    if (sendTimer.current !== null) window.clearTimeout(sendTimer.current);
    sendTimer.current = null;
  };

  useEffect(
    () => () => {
      if (sendTimer.current !== null) window.clearTimeout(sendTimer.current);
    },
    [],
  );

  const send = (e?: React.FormEvent) => {
    e?.preventDefault();
    let parsed: unknown = undefined;
    if (hasBody(method)) {
      try {
        parsed = body.trim() ? JSON.parse(body) : undefined;
        setBodyError(null);
      } catch (err) {
        setBodyError(`JSON tidak valid: ${(err as Error).message}`);
        return;
      }
    }
    const p = path.startsWith("/") ? path : `/${path}`;
    setSending(true);
    const result = handleMockRequest(db, { method, path: p, body: parsed });
    clearSendTimer();
    sendTimer.current = window.setTimeout(() => {
      sendTimer.current = null;
      setDb(result.db);
      setResponse(result.response);
      setHistory((h) => [{ id: Date.now(), method, path: p, status: result.response.status }, ...h].slice(0, 12));
      setSending(false);
    }, 180);
  };

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    setMethod(preset.method);
    setPath(preset.path);
    if (preset.body) setBody(preset.body);
    setBodyError(null);
  };

  return (
    <LabShell
      title="HTTP Explorer"
      subtitle="Kirim request ke API tugas tiruan dan baca jawabannya. Mirip Postman, tapi cukup di browser."
      icon={<Send aria-hidden />}
      actions={
        <button
          type="button"
          onClick={() => {
            // Batalkan request yang belum selesai supaya hasil lama tidak menimpa data yang baru di-reset.
            clearSendTimer();
            setSending(false);
            setDb(createMockDb());
            setResponse(null);
            setHistory([]);
          }}
          className={labActionClass}
        >
          <RotateCcw aria-hidden /> Reset data
        </button>
      }
    >
      <div className="p-3 sm:p-4">
        <p className={cn(labCaptionClass, "mb-2")}>Contoh request, tinggal klik</p>
        <div
          className="mb-4 flex flex-wrap gap-2"
          aria-label="Contoh request"
        >
          {PRESETS.map((p) => (
            <button key={p.label} type="button" onClick={() => applyPreset(p)} className={labChipClass}>
              <span className={cn("rounded-sm px-1 font-mono text-xs font-bold", methodTone(p.method))}>{p.method}</span>
              {p.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:items-start">
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <form onSubmit={send} className="flex flex-col gap-2 sm:flex-row">
              <div className="flex min-w-0 flex-1 overflow-hidden rounded-md border border-border-strong bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                <label htmlFor="http-method" className="sr-only">
                  Method
                </label>
                <select
                  id="http-method"
                  value={method}
                  onChange={(e) => setMethod(e.target.value as HttpMethod)}
                  className={cn(
                    "h-11 shrink-0 border-r border-border-strong px-2 font-mono text-base font-bold outline-none sm:text-sm",
                    methodTone(method),
                  )}
                >
                  {METHODS.map((m) => (
                    <option key={m} value={m} className="bg-card text-foreground">
                      {m}
                    </option>
                  ))}
                </select>
                <span className="hidden items-center pl-3 font-mono text-sm text-subtle-foreground md:flex lg:hidden xl:flex">
                  localhost:3000
                </span>
                <label htmlFor="http-path" className="sr-only">
                  Path
                </label>
                <input
                  id="http-path"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoCorrect="off"
                  inputMode="url"
                  className="h-11 min-w-0 flex-1 bg-transparent px-2 font-mono text-base outline-none sm:text-sm md:pl-0.5 lg:pl-2 xl:pl-0.5"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className={buttonClass("primary", "md", "px-5 disabled:opacity-70")}
              >
                <Send className={cn("size-4", sending && "animate-pulse motion-reduce:animate-none")} aria-hidden />{" "}
                {sending ? "Mengirim…" : "Kirim"}
              </button>
            </form>

            {hasBody(method) ? (
              <div className="mt-3">
                <label htmlFor="http-body" className="mb-1 block text-xs text-muted-foreground">
                  <span className={labCaptionClass}>Body (JSON)</span> ·{" "}
                  <span className="font-mono break-all">Content-Type: application/json</span>
                </label>
                <textarea
                  id="http-body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoCorrect="off"
                  rows={5}
                  className={cn(
                    "block max-h-[60dvh] min-h-28 w-full resize-y rounded-md border bg-code-bg p-3 font-mono text-base leading-relaxed outline-none focus:ring-2 sm:text-sm",
                    bodyError ? "border-danger focus:ring-danger/20" : "border-code-border focus:border-primary focus:ring-primary/20",
                  )}
                />
                {bodyError ? (
                  <p className="mt-1 border-l-4 border-danger bg-danger-soft px-2 py-1 text-xs font-medium text-danger" role="alert">
                    {bodyError}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="min-w-0 overflow-hidden rounded-md border border-border-strong lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <div className="flex flex-wrap items-center gap-2 border-b border-border-strong bg-surface px-3 py-1.5">
              {/* Live region cukup ringkasan status, bukan seluruh JSON. */}
              <span className="flex flex-wrap items-center gap-2" aria-live="polite" aria-atomic="true">
                <span className={labCaptionClass}>Response</span>
                {response ? (
                  <>
                    <StatusChip status={response.status} text={response.statusText} />
                    <span className="font-mono text-xs text-subtle-foreground">{response.durationMs} ms</span>
                  </>
                ) : null}
              </span>
              {response ? (
                <div className="ml-auto flex" role="group" aria-label="Bagian response">
                  {(["body", "headers"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      aria-pressed={tab === t}
                      onClick={() => setTab(t)}
                      className={cn(
                        "min-h-11 border-b-2 px-3 font-mono text-xs font-semibold",
                        tab === t ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="min-h-[140px] bg-code-bg p-3">
              {response ? (
                tab === "body" ? (
                  <JsonView value={response.body} className="max-h-[min(24rem,60dvh)]" />
                ) : (
                  <div className="max-h-[min(24rem,60dvh)] overflow-auto scrollbar-thin">
                    <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1 font-mono text-[12.5px]">
                      {Object.entries(response.headers).map(([k, v]) => (
                        <div key={k} className="contents">
                          <dt className="text-indigo-700 dark:text-indigo-300">{k}</dt>
                          <dd className="break-all">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )
              ) : (
                <p className="px-2 py-8 text-center text-sm text-pretty text-subtle-foreground">
                  Belum ada jawaban. Klik salah satu contoh atau tulis alamat sendiri, lalu tekan <strong>Kirim</strong>.
                </p>
              )}
            </div>
            {response && STATUS_EXPLAIN[response.status] ? (
              <p className="border-t border-border-strong bg-card px-3 py-2 text-sm leading-relaxed text-pretty text-muted-foreground">
                <span className="font-semibold text-foreground">Artinya: </span>
                <InlineText text={STATUS_EXPLAIN[response.status]} />
              </p>
            ) : null}
          </div>

          {history.length > 0 ? (
            <details className="min-w-0 lg:col-start-1 lg:row-start-2">
              <summary className="flex min-h-11 cursor-pointer items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
                <History className="size-4" aria-hidden /> Riwayat ({history.length}) · klik untuk ulangi
              </summary>
              <ol className="mt-1 max-h-[min(16rem,45dvh)] divide-y divide-border overflow-y-auto rounded-md border border-border scrollbar-thin">
                {history.map((h) => (
                  <li key={h.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setMethod(h.method);
                        setPath(h.path);
                      }}
                      className="flex min-h-11 w-full items-center gap-2 px-2 text-left font-mono text-xs hover:bg-surface-2"
                    >
                      <span className={cn("w-14 shrink-0 rounded-sm px-1 text-center font-bold", methodTone(h.method))}>{h.method}</span>
                      <span className="min-w-0 flex-1 truncate">{h.path}</span>
                      <span className={cn("shrink-0 rounded-sm border px-1 font-bold", statusTone(h.status))}>{h.status}</span>
                    </button>
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
