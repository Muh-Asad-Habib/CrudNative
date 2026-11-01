import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { getTrack, LEVEL_LABEL, trackMinutes, tracks } from "@/lib/curriculum";
import { formatMinutes, cn } from "@/lib/utils";
import { pageMetadata } from "@/lib/site";
import { TrackIcon, trackTone } from "@/components/ui/track-icon";
import { TrackLessonList, TrackProgressCard } from "@/components/track/track-progress";

export const dynamicParams = false;

export function generateStaticParams() {
  return tracks.map((t) => ({ track: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ track: string }> }): Promise<Metadata> {
  const { track: slug } = await params;
  const track = getTrack(slug);
  if (!track) return {};
  return pageMetadata({
    title: `Bab ${track.number}: ${track.title}`,
    description: track.description,
    path: `/belajar/${track.slug}/`,
  });
}

const babLabel = (n: number) => `Bab ${String(n).padStart(2, "0")}`;

export default async function TrackPage({ params }: { params: Promise<{ track: string }> }) {
  const { track: slug } = await params;
  const track = getTrack(slug);
  if (!track) notFound();

  const tone = trackTone[track.slug];
  const levels = [...new Set(track.lessons.map((l) => l.level))];
  const idx = tracks.findIndex((t) => t.slug === track.slug);
  const prev = tracks[idx - 1];
  const next = tracks[idx + 1];

  return (
    <div className="mx-auto w-full max-w-[1120px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <nav aria-label="Breadcrumb" className="-mt-2 mb-3 flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Link href="/belajar/" className="inline-flex min-h-11 items-center rounded-md px-1 hover:text-foreground hover:underline">
          Daftar isi
        </Link>
        <ChevronRight className="size-3.5 shrink-0 text-subtle-foreground" aria-hidden />
        <span className="inline-flex min-h-11 items-center px-1 text-foreground" aria-current="page">
          {babLabel(track.number)}
        </span>
      </nav>

      <header className="relative border-b border-border pb-6 pl-5 sm:pl-6">
        <span className={cn("absolute top-0 bottom-6 left-0 w-1 rounded-[1px]", tone?.tab)} aria-hidden />
        <p className="flex items-center gap-2 font-mono text-xs tracking-wider text-muted-foreground uppercase">
          <TrackIcon icon={track.icon} className={cn("size-4", tone?.text)} />
          {babLabel(track.number)}
        </p>
        <h1 className="mt-2 text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl">{track.title}</h1>
        <p className="mt-3 max-w-2xl text-base text-pretty text-muted-foreground sm:text-[17px]">{track.description}</p>
        <p className="mt-4 font-mono text-xs text-subtle-foreground">
          {track.lessons.length} pelajaran · ± {formatMinutes(trackMinutes(track))} ·{" "}
          {levels.map((lv) => LEVEL_LABEL[lv]).join(", ")}
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <h2 className="mb-3 text-xl font-semibold">Isi bab ini</h2>
          <TrackLessonList trackSlug={track.slug} trackNumber={track.number} />
        </div>

        <aside className="order-first lg:order-none">
          <div className="space-y-4 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
            <TrackProgressCard trackSlug={track.slug} />
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">Setelah bab ini</p>
              <p className="bg-ruled mt-2 text-sm leading-6 text-foreground [--rule-gap:1.5rem]">{track.outcome}</p>
            </div>
            <p className="hidden -rotate-1 px-2 font-hand text-xl leading-snug text-primary lg:block">
              Ketik ulang contohnya, jangan cuma dibaca. Coba latihannya dulu sebelum buka solusi.
            </p>
          </div>
        </aside>
      </div>

      <nav aria-label="Bab lain" className="mt-10 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row">
        {prev ? (
          <Link
            href={`/belajar/${prev.slug}/`}
            className="flex flex-1 flex-col rounded-lg border border-border bg-card p-4 transition-colors hover:border-border-strong hover:bg-surface"
          >
            <span className="flex items-center gap-1.5 font-mono text-xs tracking-wider text-muted-foreground uppercase">
              <ArrowLeft className="size-3.5" aria-hidden /> {babLabel(prev.number)}
            </span>
            <span className="mt-1 font-serif font-semibold">{prev.title}</span>
          </Link>
        ) : (
          <span className="hidden flex-1 sm:block" />
        )}
        {next ? (
          <Link
            href={`/belajar/${next.slug}/`}
            className="flex flex-1 flex-col rounded-lg border border-border bg-card p-4 transition-colors hover:border-border-strong hover:bg-surface sm:items-end sm:text-right"
          >
            <span className="flex items-center gap-1.5 font-mono text-xs tracking-wider text-muted-foreground uppercase">
              {babLabel(next.number)} <ArrowRight className="size-3.5" aria-hidden />
            </span>
            <span className="mt-1 font-serif font-semibold">{next.title}</span>
          </Link>
        ) : null}
      </nav>
    </div>
  );
}