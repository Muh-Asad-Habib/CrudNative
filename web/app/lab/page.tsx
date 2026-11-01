import type { Metadata } from "next";
import Link from "next/link";
import { labs } from "@/lib/registry";
import { pageMetadata } from "@/lib/site";
import { labNumber, labParts, labSheet, pad2 } from "@/components/labs/lab-sheet";

export const metadata: Metadata = pageMetadata({
  title: "Lab Interaktif",
  description: "Simulator CRUD, HTTP Explorer, SQL Playground, Flexbox, React Playground, dan Expo Snack langsung di browser.",
  path: "/lab/",
});

export default function LabIndexPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <header className="max-w-2xl">
        <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">Buku praktikum</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Lab interaktif</h1>
        <p className="mt-3 text-base text-pretty text-muted-foreground sm:text-lg">
          Enam latihan yang jalan langsung di browser, tanpa instal apa pun. Data yang kamu ubah hanya tersimpan di tab
          ini, jadi kalau berantakan tinggal tekan Reset.
        </p>
      </header>

      <div className="mt-8 grid grid-cols-1 gap-8 sm:mt-10 lg:gap-10">
        {labParts.map((part) => {
          const items = labs.filter((l) => labSheet[l.slug]?.part === part.key);
          if (items.length === 0) return null;
          return (
            <section
              key={part.key}
              aria-labelledby={`bagian-${part.key}`}
              className="min-w-0 rounded-md border border-border-strong bg-card shadow-notebook"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border-strong px-4 py-3 sm:px-6">
                <h2 id={`bagian-${part.key}`} className="text-xl font-semibold tracking-tight sm:text-2xl">
                  <span className="mr-2 font-mono text-sm font-normal text-muted-foreground">Bagian {part.key}</span>
                  {part.title}
                </h2>
                <p className="text-sm text-muted-foreground">{part.note}</p>
              </div>
              <ol className="divide-y divide-border">
                {items.map((lab) => {
                  const n = labNumber(lab.slug) ?? 0;
                  const info = labSheet[lab.slug];
                  return (
                    <li
                      key={lab.slug}
                      className="group relative grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-3 px-4 py-4 transition-colors hover:bg-surface/70 sm:grid-cols-[4.5rem_minmax(0,1fr)_auto] sm:gap-x-5 sm:px-6 sm:py-5"
                    >
                      <span className="pt-1 font-mono text-xs leading-5 text-muted-foreground sm:text-sm">
                        Lab {pad2(n)}
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-serif text-lg font-semibold tracking-tight sm:text-xl">
                          <Link
                            href={`/lab/${lab.slug}/`}
                            className="underline decoration-border-strong decoration-1 underline-offset-4 group-hover:decoration-foreground after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
                          >
                            {lab.title}
                          </Link>
                          {n === 1 ? (
                            <span className="ml-3 align-middle font-hand text-xl font-normal text-accent">
                              mulai dari sini
                            </span>
                          ) : null}
                        </h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
                          {info?.tryLine ?? lab.description}
                        </p>
                        <p className="mt-2 font-mono text-xs text-muted-foreground sm:hidden">
                          {info ? `${info.level} · ±${info.minutes} menit` : null}
                        </p>
                      </div>
                      <p className="hidden pt-1.5 text-right font-mono text-xs leading-5 whitespace-nowrap text-muted-foreground sm:block">
                        {info ? (
                          <>
                            {info.level}
                            <br />±{info.minutes} menit
                          </>
                        ) : null}
                      </p>
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-0 hidden ring-2 ring-primary ring-inset group-has-[a:focus-visible]:block"
                      />
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>

      <p className="mt-8 max-w-2xl text-sm text-muted-foreground">
        Belum tahu mulai dari mana? Kerjakan Lab 01 dulu. Setiap lab juga muncul di dalam bab yang membahasnya, jadi kamu
        bisa mencobanya sambil membaca.
      </p>
    </div>
  );
}
