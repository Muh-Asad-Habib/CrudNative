import type { Metadata } from "next";
import { pageMetadata } from "@/lib/site";
import { ProgressDashboard } from "@/components/progress/progress-dashboard";

// Isi halaman ini berasal dari localStorage pembaca, jadi tidak perlu diindeks mesin pencari.
export const metadata: Metadata = {
  ...pageMetadata({
    title: "Progres Belajar",
    description: "Lihat pelajaran yang sudah selesai, hari belajar, nilai kuis, dan pelajaran yang kamu tandai.",
    path: "/progres/",
  }),
  robots: { index: false, follow: true },
};

export default function ProgressPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <header className="mb-8 max-w-2xl border-b border-border pb-6">
        <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">Progres belajar</p>
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-balance sm:text-4xl">
          Progres <span className="marker">belajarmu</span>
        </h1>
        <p className="mt-3 text-base text-pretty text-muted-foreground sm:text-lg">
          Pelajaran yang sudah selesai, hari belajar, nilai kuis, dan pelajaran yang kamu tandai. Semuanya tersimpan di browser ini.
        </p>
      </header>
      <ProgressDashboard />
    </div>
  );
}