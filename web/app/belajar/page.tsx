import type { Metadata } from "next";
import { TOTAL_LESSONS, TOTAL_MINUTES, tracks } from "@/lib/curriculum";
import { pageMetadata } from "@/lib/site";
import { formatMinutes } from "@/lib/utils";
import { OverallProgress, TrackRoadmap } from "@/components/track/roadmap";

export const metadata: Metadata = pageMetadata({
  title: "Kurikulum",
  description:
    "Daftar isi lengkap: fondasi JavaScript, CRUD & backend, React Native, full-stack, dan topik lanjutan.",
  path: "/belajar/",
});

export default function CurriculumPage() {
  return (
    <div className="mx-auto w-full max-w-[960px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <header className="mb-6 border-b border-border pb-6">
        <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
          Daftar isi · {tracks.length} bab · {TOTAL_LESSONS} pelajaran
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          Isi <span className="marker">kurikulum</span>
        </h1>
        <p className="mt-3 max-w-2xl text-base text-pretty text-muted-foreground sm:text-[17px]">
          Total materinya kira-kira {formatMinutes(TOTAL_MINUTES)}. Kerjakan bab demi bab sesuai urutan, karena tiap bab
          memakai materi dari bab sebelumnya. Di bab 3 kamu menyambungkan aplikasi Expo ke API Express buatanmu sendiri,
          lalu bab 4 membahas TypeScript, testing, dan deploy.
        </p>
      </header>
      <div className="mb-8">
        <OverallProgress />
      </div>
      <TrackRoadmap />
    </div>
  );
}