import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Printer } from "lucide-react";
import { cheatsheets, getCheatsheet } from "@/lib/registry";
import { pageMetadata } from "@/lib/site";
import { LessonToc, LessonTocMobile } from "@/components/lesson/lesson-toc";
import { PrintButton } from "@/components/cheatsheet/print-button";

export const dynamicParams = false;

export function generateStaticParams() {
  return cheatsheets.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const sheet = getCheatsheet(slug);
  if (!sheet) return {};
  return pageMetadata({
    title: `Cheatsheet ${sheet.title}`,
    description: sheet.description,
    path: `/cheatsheet/${sheet.slug}/`,
  });
}

const pad2 = (n: number) => String(n).padStart(2, "0");

export default async function CheatsheetPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sheet = getCheatsheet(slug);
  if (!sheet) notFound();
  const { default: Content } = await import(`@/content/cheatsheet/${slug}.mdx`);
  const idx = cheatsheets.findIndex((c) => c.slug === slug);

  return (
    <div className="mx-auto flex w-full max-w-6xl gap-8 px-4 py-6 sm:px-6 lg:py-10 xl:gap-10 print:block print:max-w-none print:p-0">
      <div className="min-w-0 flex-1 xl:max-w-[820px] print:max-w-none">
        <nav aria-label="Breadcrumb" className="mb-4 flex min-w-0 items-center gap-1 text-sm text-muted-foreground print:hidden">
          <Link href="/cheatsheet/" className="-ml-2 inline-flex min-h-11 shrink-0 items-center rounded-md px-2 hover:text-foreground">
            Cheatsheet
          </Link>
          <ChevronRight className="size-3.5 shrink-0 text-subtle-foreground" aria-hidden />
          <span className="min-w-0 truncate px-1 text-foreground" aria-current="page">
            {sheet.title}
          </span>
        </nav>
        <header className="mb-8 border-b-2 border-(--margin) pb-6 print:mb-4 print:pb-3">
          <p className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs tracking-wider text-muted-foreground uppercase">
            <span>
              Contekan {pad2(idx + 1)} dari {pad2(cheatsheets.length)}
            </span>
            <span aria-hidden>·</span>
            <span className="normal-case">{sheet.tags.join(" · ")}</span>
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{sheet.title}</h1>
          <p className="mt-3 text-base text-pretty text-muted-foreground sm:text-lg">{sheet.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 print:hidden">
            <PrintButton icon={<Printer aria-hidden />} />
            <span className="text-sm text-muted-foreground">Menu navigasi tidak ikut tercetak.</span>
          </div>
        </header>
        <div className="lg:hidden print:hidden">
          <LessonTocMobile />
        </div>
        <article id="lesson-article" className="prose-lesson">
          <Content />
        </article>

        <section className="mt-12 print:hidden" aria-labelledby="cheatsheet-lain">
          <h2 id="cheatsheet-lain" className="text-xl font-semibold tracking-tight">
            Contekan lainnya
          </h2>
          <ol className="mt-3 grid grid-cols-1 border-t border-border sm:grid-cols-2 sm:gap-x-8">
            {cheatsheets.map((c, i) =>
              c.slug === slug ? null : (
                <li key={c.slug} className="border-b border-border">
                  <Link
                    href={`/cheatsheet/${c.slug}/`}
                    className="group flex min-h-11 items-baseline gap-3 py-2.5 hover:text-primary"
                  >
                    <span className="w-12 shrink-0 font-mono text-xs text-muted-foreground">No. {pad2(i + 1)}</span>
                    <span className="min-w-0 font-medium underline-offset-4 group-hover:underline">{c.title}</span>
                  </Link>
                </li>
              ),
            )}
          </ol>
        </section>
      </div>
      <aside className="hidden w-52 shrink-0 lg:block xl:w-56 print:hidden">
        <div className="sticky top-[calc(var(--header-h)+2rem)] max-h-[calc(100dvh-var(--header-h)-4rem)] overflow-y-auto scrollbar-thin">
          <LessonToc />
        </div>
      </aside>
    </div>
  );
}
