"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dialog } from "radix-ui";
import { Menu, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUI } from "@/lib/ui-store";
import { Kbd } from "@/components/ui/card";
import { Logo } from "./logo";
import { ThemeSegmented, ThemeToggle } from "./theme-toggle";
import { CurriculumNav } from "./curriculum-nav";
import { isActivePath, mainNav } from "./nav-config";

export function SiteHeader() {
  const pathname = usePathname() || "/";
  const setSearchOpen = useUI((s) => s.setSearchOpen);
  const [navOpen, setNavOpen] = useState(false);
  const close = () => setNavOpen(false);

  // Tutup drawer saat rute berubah (termasuk tombol back/forward), tanpa setState di effect.
  const [navPath, setNavPath] = useState(pathname);
  if (navPath !== pathname) {
    setNavPath(pathname);
    if (navOpen) setNavOpen(false);
  }

  // Drawer disembunyikan di ≥ lg; tutup agar scroll-lock body tidak tertinggal saat jendela dilebarkan.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 64rem)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setNavOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="sticky top-0 z-40 h-[var(--header-h)] border-b border-border bg-background print:hidden">
      <div className="mx-auto flex h-full max-w-[1440px] items-center gap-1.5 px-2 min-[360px]:gap-2 min-[360px]:px-3 sm:px-6">
        <Dialog.Root open={navOpen} onOpenChange={setNavOpen}>
          <Dialog.Trigger
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-2 hover:text-foreground lg:hidden"
            aria-label="Buka menu navigasi"
          >
            <Menu className="size-5" />
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-fade-in lg:hidden" />
            <Dialog.Content
              aria-describedby={undefined}
              className="fixed top-0 left-0 z-50 flex h-dvh w-[88%] max-w-sm flex-col border-r border-border-strong bg-background pt-[env(safe-area-inset-top)] pl-[env(safe-area-inset-left)] data-[state=open]:animate-slide-in-left lg:hidden"
            >
              <Dialog.Title className="sr-only">Menu navigasi</Dialog.Title>
              <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between gap-2 border-b border-border pr-2 pl-4">
                <Logo onClick={close} />
                <Dialog.Close
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-2 hover:text-foreground"
                  aria-label="Tutup menu"
                >
                  <X className="size-5" />
                </Dialog.Close>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] scrollbar-thin">
                <nav aria-label="Menu utama" className="mb-5">
                  <ul className="border-t border-border">
                    {mainNav.map((item) => {
                      const active = isActivePath(pathname, item.match);
                      return (
                        <li key={item.href} className="border-b border-border">
                          <Link
                            href={item.href}
                            onClick={close}
                            aria-current={active ? "page" : undefined}
                            className={cn(
                              "flex min-h-11 items-center border-l-2 px-3 text-[15px] transition-colors",
                              active
                                ? "border-primary bg-surface font-semibold text-foreground"
                                : "border-transparent text-muted-foreground hover:bg-surface hover:text-foreground",
                            )}
                          >
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
                <div className="mb-6">
                  <p className="mb-2 font-mono text-xs tracking-wider text-subtle-foreground uppercase">Tema</p>
                  <ThemeSegmented />
                </div>
                <CurriculumNav onNavigate={close} />
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <Logo className="mr-1 shrink-0 min-[360px]:mr-2 lg:mr-6" />

        <nav aria-label="Menu utama" className="hidden h-full items-stretch gap-1 lg:flex">
          {mainNav.map((item) => {
            const active = isActivePath(pathname, item.match);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex items-center px-3 text-sm transition-colors",
                  "after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:content-['']",
                  active
                    ? "font-semibold text-foreground after:bg-primary"
                    : "font-medium text-muted-foreground hover:text-foreground hover:after:bg-border-strong",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="hidden h-10 w-56 items-center gap-2 rounded-md border border-border-strong bg-card px-3 text-sm text-subtle-foreground transition-colors hover:border-foreground/40 hover:text-muted-foreground md:flex xl:w-64"
            aria-label="Cari materi"
          >
            <Search className="size-4 shrink-0" aria-hidden />
            <span className="flex-1 truncate text-left">Cari pelajaran…</span>
            <Kbd className="hidden pointer-fine:inline-flex">Ctrl K</Kbd>
          </button>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="inline-flex size-11 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-2 hover:text-foreground md:hidden"
            aria-label="Cari materi"
          >
            <Search className="size-5" />
          </button>
          <ThemeToggle className="size-11" />
        </div>
      </div>
    </header>
  );
}