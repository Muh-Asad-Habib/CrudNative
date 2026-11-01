"use client";

import { useMemo, useState } from "react";
import { LayoutGrid, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { LabShell, labActionClass, labCaptionClass } from "./lab-shell";

type Direction = "column" | "row" | "column-reverse" | "row-reverse";
type Justify = "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";
type Align = "stretch" | "flex-start" | "center" | "flex-end";
type Wrap = "nowrap" | "wrap";

interface FlexState {
  flexDirection: Direction;
  justifyContent: Justify;
  alignItems: Align;
  flexWrap: Wrap;
  gap: number;
  count: number;
  growFirst: boolean;
}

const DEFAULTS: FlexState = {
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "stretch",
  flexWrap: "nowrap",
  gap: 8,
  count: 3,
  growFirst: false,
};

const OPTIONS = {
  flexDirection: ["column", "row", "column-reverse", "row-reverse"] as Direction[],
  justifyContent: ["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"] as Justify[],
  alignItems: ["stretch", "flex-start", "center", "flex-end"] as Align[],
  flexWrap: ["nowrap", "wrap"] as Wrap[],
};

const COLORS = ["bg-sky-700", "bg-amber-600", "bg-emerald-700", "bg-rose-700", "bg-indigo-700", "bg-teal-700", "bg-orange-700", "bg-slate-600"];

export function buildStyleCode(s: FlexState) {
  const lines = [
    "container: {",
    "    flex: 1,",
    `    flexDirection: '${s.flexDirection}',`,
    `    justifyContent: '${s.justifyContent}',`,
    `    alignItems: '${s.alignItems}',`,
  ];
  if (s.flexWrap !== "nowrap") lines.push(`    flexWrap: '${s.flexWrap}',`);
  if (s.gap) lines.push(`    gap: ${s.gap},`);
  lines.push("  },");
  const isRow = s.flexDirection.startsWith("row");
  const box = ["box: {", isRow ? "    width: 56," : "    height: 56,"];
  if (s.alignItems !== "stretch") box.push(isRow ? "    height: 56," : "    width: 56,");
  box.push("    borderRadius: 12,", "  },");
  const code = [
    "import { StyleSheet } from 'react-native';",
    "",
    "const styles = StyleSheet.create({",
    "  " + lines.join("\n"),
    "  " + box.join("\n"),
  ];
  if (s.growFirst) code.push("  first: { flex: 1 },");
  code.push("});");
  return code.join("\n");
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-1.5 font-mono text-xs font-semibold text-muted-foreground">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={value === o}
            onClick={() => onChange(o)}
            className={cn(
              "min-h-11 rounded-md border px-2.5 font-mono text-xs font-semibold transition-colors motion-reduce:transition-none",
              value === o
                ? "border-foreground bg-foreground text-background"
                : "border-border-strong bg-card text-muted-foreground hover:bg-surface-2 hover:text-foreground",
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function FlexboxPlayground() {
  const [s, setS] = useState<FlexState>(DEFAULTS);
  const set = <K extends keyof FlexState>(k: K, v: FlexState[K]) => setS((prev) => ({ ...prev, [k]: v }));
  const isRow = s.flexDirection.startsWith("row");
  const code = useMemo(() => buildStyleCode(s), [s]);

  return (
    <LabShell
      title="Flexbox Playground"
      subtitle="Di React Native, flexDirection bawaannya column (di web: row). Klik pilihan di bawah dan lihat kotaknya bergeser."
      icon={<LayoutGrid aria-hidden />}
      actions={
        <button type="button" onClick={() => setS(DEFAULTS)} className={labActionClass}>
          <RotateCcw aria-hidden /> Reset
        </button>
      }
    >
      <div className="grid grid-cols-1 gap-5 p-3 sm:p-4 md:grid-cols-[minmax(0,1fr)_240px] lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
            <Segmented label="flexDirection" value={s.flexDirection} options={OPTIONS.flexDirection} onChange={(v) => set("flexDirection", v)} />
            <Segmented label="justifyContent" value={s.justifyContent} options={OPTIONS.justifyContent} onChange={(v) => set("justifyContent", v)} />
            <Segmented label="alignItems" value={s.alignItems} options={OPTIONS.alignItems} onChange={(v) => set("alignItems", v)} />
            <Segmented label="flexWrap" value={s.flexWrap} options={OPTIONS.flexWrap} onChange={(v) => set("flexWrap", v)} />
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
            <label className="block">
              <span className="flex justify-between font-mono text-xs font-semibold text-muted-foreground">
                gap <span className="text-foreground">{s.gap}</span>
              </span>
              <input
                type="range"
                min={0}
                max={24}
                step={2}
                value={s.gap}
                onChange={(e) => set("gap", Number(e.target.value))}
                className="block h-11 w-full cursor-pointer accent-[var(--primary)]"
              />
            </label>
            <label className="block">
              <span className="flex justify-between font-mono text-xs font-semibold text-muted-foreground">
                jumlah kotak <span className="text-foreground">{s.count}</span>
              </span>
              <input
                type="range"
                min={1}
                max={8}
                value={s.count}
                onChange={(e) => set("count", Number(e.target.value))}
                className="block h-11 w-full cursor-pointer accent-[var(--primary)]"
              />
            </label>
          </div>
          <label className="flex min-h-11 cursor-pointer items-center gap-2.5 text-sm">
            <input
              type="checkbox"
              checked={s.growFirst}
              onChange={(e) => set("growFirst", e.target.checked)}
              className="size-5 shrink-0 accent-[var(--primary)]"
            />
            <span>
              Kotak pertama <code className="rounded-sm bg-surface-2 px-1 font-mono text-xs">flex: 1</code> (mengisi sisa ruang)
            </span>
          </label>
        </div>

        <div className="order-first mx-auto w-full max-w-[220px] sm:max-w-[240px] md:order-none md:row-span-2">
          <p className={cn(labCaptionClass, "mb-2 text-center")}>Pratinjau layar</p>
          <div className="rounded-[1.25rem] border-2 border-foreground/70 bg-card p-1.5">
            <div className="relative overflow-hidden rounded-[0.9rem] border border-border-strong bg-background">
              <div className="flex h-6 items-center justify-between px-3.5 font-mono text-[9px] font-semibold text-muted-foreground" aria-hidden>
                <span>9:41</span>
                <span className="h-2.5 w-10 rounded-full border border-foreground/50" />
                <span>100%</span>
              </div>
              <div
                className="h-[min(260px,40dvh)] min-h-[200px] border-t border-border bg-surface p-2 transition-all motion-reduce:transition-none sm:h-[300px] md:h-[360px]"
                style={{
                  display: "flex",
                  flexDirection: s.flexDirection,
                  justifyContent: s.justifyContent,
                  alignItems: s.alignItems,
                  flexWrap: s.flexWrap,
                  alignContent: "flex-start",
                  gap: s.gap,
                }}
              >
                {Array.from({ length: s.count }, (_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex shrink-0 items-center justify-center rounded-md font-mono text-sm font-bold text-white transition-all duration-300 motion-reduce:transition-none",
                      COLORS[i % COLORS.length],
                    )}
                    style={{
                      [isRow ? "width" : "height"]: 56,
                      ...(s.alignItems !== "stretch" ? { [isRow ? "height" : "width"]: 56 } : {}),
                      ...(s.growFirst && i === 0 ? { flexGrow: 1 } : {}),
                    }}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Sumbu utama: <strong>{isRow ? "horizontal ↔" : "vertikal ↕"}</strong>
          </p>
        </div>

        <div className="min-w-0">
          <p className={cn(labCaptionClass, "mb-1.5")}>Kode StyleSheet</p>
          <pre className="max-h-[min(18rem,50dvh)] overflow-auto rounded-md border border-code-border bg-code-bg p-3 font-mono text-xs leading-relaxed scrollbar-thin">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </LabShell>
  );
}
