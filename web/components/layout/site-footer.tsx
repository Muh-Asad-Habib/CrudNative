import Link from "next/link";
import { tracks } from "@/lib/curriculum";
import { LogoMark } from "./logo";

const resources = [
  ["/lab/", "Lab"],
  ["/cheatsheet/", "Cheatsheet"],
  ["/glosarium/", "Glosarium"],
  ["/progres/", "Progres belajar"],
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background print:hidden">
      <div className="mx-auto grid max-w-[1440px] gap-x-10 gap-y-8 px-4 py-10 sm:grid-cols-2 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div className="max-w-sm sm:col-span-2 md:col-span-1">
          <p className="flex items-center gap-2 font-serif text-lg font-bold tracking-tight">
            <LogoMark className="size-5" />
            CRUDNative
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Situs belajar CRUD dan React Native berbahasa Indonesia, gratis untuk pemula. Progresmu disimpan di browser ini,
            tanpa akun.
          </p>
        </div>
        <div>
          <p className="font-mono text-xs tracking-wider text-subtle-foreground uppercase">Daftar bab</p>
          <ul className="mt-2 text-sm md:space-y-0.5">
            {tracks.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/belajar/${t.slug}/`}
                  className="inline-flex min-h-11 items-baseline gap-2 py-2.5 text-muted-foreground hover:text-foreground hover:underline md:min-h-0 md:py-1"
                >
                  <span className="font-mono text-xs text-subtle-foreground">{String(t.number).padStart(2, "0")}</span>
                  {t.shortTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-mono text-xs tracking-wider text-subtle-foreground uppercase">Lainnya</p>
          <ul className="mt-2 text-sm md:space-y-0.5">
            {resources.map(([href, label]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="inline-flex min-h-11 items-center py-2.5 text-muted-foreground hover:text-foreground hover:underline md:min-h-0 md:py-1"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-[1440px] px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-xs text-subtle-foreground sm:px-6">
          Kode contoh boleh kamu salin dan pakai untuk proyekmu sendiri.
        </p>
      </div>
    </footer>
  );
}