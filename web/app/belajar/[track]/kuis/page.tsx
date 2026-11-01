import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import { getTrack, tracks } from "@/lib/curriculum";
import { trackQuizzes } from "@/content/quiz";
import { Quiz } from "@/components/mdx/quiz";
import { Callout } from "@/components/mdx/callout";
import { trackQuizId } from "@/lib/quiz";
import { buttonClass } from "@/components/ui/button";
import { trackTone } from "@/components/ui/track-icon";
import { cn } from "@/lib/utils";
import { pageMetadata } from "@/lib/site";

export const dynamicParams = false;

const pad = (n: number) => String(n).padStart(2, "0");

export function generateStaticParams() {
  return tracks.map((t) => ({ track: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ track: string }> }): Promise<Metadata> {
  const { track: slug } = await params;
  const track = getTrack(slug);
  if (!track) return {};
  return pageMetadata({
    title: `Kuis Akhir — ${track.title}`,
    description: `Uji pemahamanmu tentang ${track.title}.`,
    path: `/belajar/${track.slug}/kuis/`,
  });
}

export default async function TrackQuizPage({ params }: { params: Promise<{ track: string }> }) {
  const { track: slug } = await params;
  const track = getTrack(slug);
  if (!track) notFound();
  const questions = trackQuizzes[track.slug] ?? [];
  const idx = tracks.findIndex((t) => t.slug === track.slug);
  const next = tracks[idx + 1];
  const tone = trackTone[track.slug];

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 lg:py-10">
      <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-x-1 text-sm text-muted-foreground">
        <Link href="/belajar/" className="-my-1.5 inline-flex min-h-11 items-center rounded px-1 hover:text-foreground">
          Kurikulum
        </Link>
        <ChevronRight className="size-3.5 shrink-0 text-subtle-foreground" aria-hidden />
        <Link
          href={`/belajar/${track.slug}/`}
          className="-my-1.5 inline-flex min-h-11 items-center rounded px-1 hover:text-foreground"
        >
          Bab {track.number} · {track.shortTitle}
        </Link>
        <ChevronRight className="size-3.5 shrink-0 text-subtle-foreground" aria-hidden />
        <span className="-my-1.5 inline-flex min-h-11 items-center px-1 text-foreground" aria-current="page">
          Kuis
        </span>
      </nav>

      <header className="mb-8 sm:-ml-4 sm:pl-4 sm:margin-line sm:[--margin-x:0px] lg:-ml-6 lg:pl-6">
        <p className="flex items-center gap-2.5 font-mono text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">
          <span className={cn("h-3 w-1 rounded-[1px]", tone?.tab ?? "bg-accent")} aria-hidden />
          Bab {pad(track.number)} · Kuis akhir
        </p>
        <h1 className="mt-3 font-serif text-[1.875rem] leading-[1.15] font-semibold tracking-[-0.015em] text-balance sm:text-[2.5rem]">
          {track.title}
        </h1>
        <p className="mt-3 max-w-[60ch] text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
          {questions.length} soal pilihan ganda. Kamu lulus kalau 70% jawabanmu benar. Nilai terbaikmu disimpan
          otomatis di perangkat ini.
        </p>
      </header>

      {questions.length ? (
        <Quiz id={trackQuizId(track.slug)} title={`Kuis akhir Bab ${track.number}`} questions={questions} />
      ) : (
        <Callout type="info" title="Kuis sedang disusun">
          Soal untuk bab ini akan segera tersedia.
        </Callout>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href={`/belajar/${track.slug}/`} className={buttonClass("outline", "md", "sm:flex-1")}>
          Kembali ke Bab {track.number}
        </Link>
        {next ? (
          <Link href={`/belajar/${next.slug}/`} className={buttonClass("primary", "md", "sm:flex-1")}>
            Lanjut ke Bab {next.number} <ArrowRight aria-hidden />
          </Link>
        ) : (
          <Link href="/progres/" className={buttonClass("primary", "md", "sm:flex-1")}>
            Lihat progres <ArrowRight aria-hidden />
          </Link>
        )}
      </div>
    </div>
  );
}
