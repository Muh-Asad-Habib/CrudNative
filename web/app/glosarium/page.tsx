import type { Metadata } from "next";
import { glossary, type GlossaryCategory } from "@/lib/glossary";
import { pageMetadata } from "@/lib/site";
import { GlossaryExplorer } from "@/components/glossary/glossary-explorer";

export const metadata: Metadata = pageMetadata({
  title: "Glosarium",
  description: "Kamus istilah web, JavaScript, database, backend, React, dan React Native dalam bahasa Indonesia yang mudah dipahami.",
  path: "/glosarium/",
});

const CATEGORY_ORDER: GlossaryCategory[] = ["Web & HTTP", "JavaScript", "Database", "Backend", "React", "React Native", "Keamanan", "DevOps"];

export default function GlossaryPage() {
  const present = new Set(glossary.map((g) => g.category));
  const categories = CATEGORY_ORDER.filter((c) => present.has(c));
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <header className="mb-6 max-w-2xl">
        <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">Indeks istilah</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">Glosarium</h1>
        <p className="mt-3 text-base text-pretty text-muted-foreground sm:text-lg">
          Daftar istilah teknis yang muncul di materi, diurutkan A sampai Z seperti indeks di belakang buku. Setiap
          istilah dijelaskan singkat dan ditautkan ke pelajaran yang membahasnya.
        </p>
      </header>
      <GlossaryExplorer entries={glossary} categories={categories} />
    </div>
  );
}
