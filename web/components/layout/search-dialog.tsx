"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Dialog } from "radix-ui";
import {
  BookOpen,
  BookText,
  CornerDownLeft,
  FileCode2,
  FlaskConical,
  Layers,
  LayoutGrid,
  Search,
  Check,
} from "lucide-react";
import { searchIndex, searchKindLabel, type SearchKind } from "@/lib/search-index";
import { useUI } from "@/lib/ui-store";
import { useProgress } from "@/lib/progress-store";
import { Kbd } from "@/components/ui/card";

const kindIcon: Record<SearchKind, React.ComponentType<{ className?: string }>> = {
  page: LayoutGrid,
  track: Layers,
  lesson: BookOpen,
  lab: FlaskConical,
  cheatsheet: FileCode2,
  glossary: BookText,
};

const groupOrder: SearchKind[] = ["lesson", "lab", "track", "cheatsheet", "glossary", "page"];

export function SearchDialog() {
  const open = useUI((s) => s.searchOpen);
  const setOpen = useUI((s) => s.setSearchOpen);
  const completed = useProgress((s) => s.completed);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  // cmdk kadang menyisakan posisi scroll lama setelah hasil difilter; kembalikan ke atas.
  useEffect(() => {
    const id = requestAnimationFrame(() => listRef.current?.scrollTo({ top: 0 }));
    return () => cancelAnimationFrame(id);
  }, [query]);

  const groups = useMemo(
    () => groupOrder.map((kind) => ({ kind, items: searchIndex.filter((i) => i.kind === kind) })),
    [],
  );

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-fade-in" />
        <Dialog.Content
          className="fixed inset-x-0 top-0 z-50 mx-auto flex h-dvh w-full max-w-2xl flex-col overflow-hidden border-border bg-card pt-[env(safe-area-inset-top)] data-[state=open]:animate-pop-in sm:top-[min(10dvh,6rem)] sm:h-auto sm:max-h-[min(44rem,100dvh_-_2*min(10dvh,6rem))] sm:w-[calc(100%-2rem)] sm:rounded-lg sm:border sm:border-border-strong sm:pt-0 sm:shadow-notebook"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">Cari materi</Dialog.Title>
          <Command loop label="Cari materi" className="flex min-h-0 flex-1 flex-col">
            <div className="flex shrink-0 items-center gap-2 border-b border-border pr-2 pl-4 sm:gap-3 sm:pr-4">
              <Search className="size-5 shrink-0 text-subtle-foreground" aria-hidden />
              <Command.Input
                value={query}
                onValueChange={setQuery}
                placeholder="Ketik judul pelajaran, lab, atau istilah…"
                className="h-14 w-full min-w-0 bg-transparent text-base outline-none placeholder:text-subtle-foreground"
              />
              <Dialog.Close className="inline-flex h-11 shrink-0 items-center rounded-md px-3 text-sm font-semibold text-muted-foreground hover:bg-surface-2 hover:text-foreground sm:pointer-fine:hidden">
                Tutup
              </Dialog.Close>
              <Kbd className="hidden sm:pointer-fine:inline-flex">Esc</Kbd>
            </div>
            <Command.List
              ref={listRef}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] scrollbar-thin sm:pb-2"
            >
              <Command.Empty className="px-4 py-12 text-center text-sm text-muted-foreground">
                Tidak ada hasil untuk “{query}”.
              </Command.Empty>
              {groups.map(({ kind, items }) => (
                <Command.Group
                  key={kind}
                  heading={searchKindLabel[kind]}
                  className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-subtle-foreground [&_[cmdk-group-heading]]:uppercase"
                >
                  {items.map((item) => {
                    const Icon = kindIcon[item.kind];
                    const done = item.kind === "lesson" && completed[item.id.replace(/^lesson-/, "")];
                    return (
                      <Command.Item
                        key={item.id}
                        value={item.id}
                        keywords={[item.title, item.subtitle, ...item.keywords]}
                        onSelect={() => go(item.href)}
                        className="group flex min-h-12 cursor-pointer items-center gap-3 rounded-[4px] px-3 py-2 text-sm data-[selected=true]:bg-surface-2 data-[selected=true]:shadow-[inset_2px_0_0_var(--primary)]"
                      >
                        <span className="flex w-5 shrink-0 justify-center text-subtle-foreground group-data-[selected=true]:text-foreground">
                          <Icon className="size-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold text-foreground">{item.title}</span>
                          <span className="block truncate text-xs text-muted-foreground">{item.subtitle}</span>
                        </span>
                        {done ? (
                          <span className="shrink-0 text-success">
                            <Check className="size-4" strokeWidth={2.5} aria-hidden />
                            <span className="sr-only">(selesai)</span>
                          </span>
                        ) : null}
                        <CornerDownLeft className="hidden size-4 shrink-0 text-subtle-foreground pointer-fine:group-data-[selected=true]:block" aria-hidden />
                      </Command.Item>
                    );
                  })}
                </Command.Group>
              ))}
            </Command.List>
            <div className="hidden shrink-0 items-center gap-4 border-t border-border px-4 py-2.5 text-xs text-muted-foreground sm:pointer-fine:flex">
              <span className="flex items-center gap-1.5">
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd> navigasi
              </span>
              <span className="flex items-center gap-1.5">
                <Kbd>Enter</Kbd> buka
              </span>
              <span className="flex items-center gap-1.5">
                <Kbd>Esc</Kbd> tutup
              </span>
            </div>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
