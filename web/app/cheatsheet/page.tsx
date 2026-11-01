import type { Metadata } from "next";
import Link from "next/link";
import { cheatsheets } from "@/lib/registry";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Cheatsheet",
  description: "Ringkasan cepat JavaScript, HTTP, SQL, Express, Prisma, React Native, Expo Router, dan TanStack Query.",
  path: "/cheatsheet/",
});

const pad2 = (n: number) => String(n).padStart(2, "0");

export default function CheatsheetIndexPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <header className="max-w-2xl">
        <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">Kartu contekan</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Cheatsheet</h1>
        <p className="mt-3 text-base text-pretty text-muted-foreground sm:text-lg">
          Satu kartu untuk satu topik: sintaks, perintah, dan pola yang sering kamu lupa saat ngoding. Setiap kartu bisa
          dicetak atau disimpan sebagai PDF.
        </p>
      </header>

      <ul className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6">
        {cheatsheets.map((c, i) => (
          <li key={c.slug} className="min-w-0">
            <article className="group relative flex h-full flex-col rounded-md border border-border-strong bg-card shadow-notebook transition-colors hover:bg-surface/60 has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-primary">
              <div className="flex items-baseline justify-between gap-3 border-b-2 border-(--margin) px-4 pt-3 pb-2 sm:px-5">
                <span className="font-mono text-xs text-muted-foreground">No. {pad2(i + 1)}</span>
                <span className="min-w-0 truncate font-mono text-xs text-muted-foreground">{c.tags.join(" · ")}</span>
              </div>
              <div className="flex flex-1 flex-col px-4 pt-3 pb-4 sm:px-5 sm:pb-5">
                <h2 className="text-xl font-semibold tracking-tight wrap-break-word sm:text-2xl">
                  <Link
                    href={`/cheatsheet/${c.slug}/`}
                    className="underline decoration-border-strong decoration-1 underline-offset-4 group-hover:decoration-foreground after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
                  >
                    {c.title}
                  </Link>
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-pretty text-muted-foreground sm:text-base">
                  {c.description}
                </p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
