"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

function useHeadings(containerId: string) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const root = document.getElementById(containerId);
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>("h2[id], h3[id]")).filter(
      (el) => !el.closest(".not-prose"),
    );
    const frame = requestAnimationFrame(() =>
      setHeadings(
        els.map((el) => ({
          id: el.id,
          text: (el.textContent ?? "").replace(/#$/, "").trim(),
          level: el.tagName === "H2" ? 2 : 3,
        })),
      ),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px", threshold: [0, 1] },
    );
    els.forEach((el) => observer.observe(el));
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [containerId]);

  return { headings, active };
}

/** Nomor ala daftar isi buku: 1, 2, 3 untuk h2 dan 2.1, 2.2 untuk h3. Judul yang sudah bernomor ("1. Git") dipakai apa adanya. */
function numberHeadings(headings: Heading[]) {
  let major = 0;
  let minor = 0;
  return headings.map((h) => {
    if (h.level === 2) {
      major += 1;
      minor = 0;
    } else {
      minor += 1;
    }
    const own = /^(\d+)\.\s+(.+)$/.exec(h.text);
    const num = own ? own[1] : h.level === 2 ? String(major) : major > 0 ? `${major}.${minor}` : String(minor);
    return { ...h, num, label: own ? own[2] : h.text };
  });
}

function TocList({ headings, active, onNavigate }: { headings: Heading[]; active: string | null; onNavigate?: () => void }) {
  return (
    <ol className="border-l border-border text-sm">
      {numberHeadings(headings).map((h) => {
        const isActive = active === h.id;
        return (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={onNavigate}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "-ml-px flex gap-2 border-l-2 py-1.5 pr-1 leading-snug transition-colors pointer-coarse:min-h-11 pointer-coarse:py-3",
                h.level === 3 ? "pl-7 text-[0.8125rem]" : "pl-3",
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:border-border-strong hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "shrink-0 pt-px font-mono text-xs tabular-nums",
                  h.level === 3 ? "min-w-7" : "min-w-4",
                  isActive ? "text-primary" : "text-subtle-foreground",
                )}
              >
                {h.num}
              </span>
              <span className="min-w-0 [overflow-wrap:anywhere]">
                <span className={cn(isActive && "marker font-medium")}>{h.label}</span>
              </span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}

export function LessonToc({ containerId = "lesson-article" }: { containerId?: string }) {
  const { headings, active } = useHeadings(containerId);
  if (headings.length === 0) return null;
  return (
    <nav aria-label="Daftar isi" className="print:hidden">
      <p className="mb-3 font-mono text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">Daftar isi</p>
      <TocList headings={headings} active={active} />
    </nav>
  );
}

export function LessonTocMobile({ containerId = "lesson-article" }: { containerId?: string }) {
  const { headings, active } = useHeadings(containerId);
  const [open, setOpen] = useState(false);
  if (headings.length === 0) return null;
  return (
    <nav aria-label="Daftar isi" className="mb-10 rounded-md border border-border bg-card xl:hidden print:hidden">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-12 w-full items-center gap-2.5 px-4 text-left"
      >
        <span className="font-mono text-xs font-medium tracking-[0.12em] text-foreground uppercase">Daftar isi</span>
        <span className="text-xs text-muted-foreground">{headings.length} bagian</span>
        <ChevronDown className={cn("ml-auto size-4 text-muted-foreground transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      {open ? (
        <div className="max-h-[min(60dvh,32rem)] overflow-y-auto overscroll-contain border-t border-border px-4 pt-3 pb-4 scrollbar-thin">
          <TocList headings={headings} active={active} onNavigate={() => setOpen(false)} />
        </div>
      ) : null}
    </nav>
  );
}
