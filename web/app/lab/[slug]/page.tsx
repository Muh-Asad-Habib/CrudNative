import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { getLessonById } from "@/lib/curriculum";
import { getLab, labs } from "@/lib/registry";
import { pageMetadata } from "@/lib/site";
import { LabRenderer } from "@/components/labs/lab-renderer";
import { labNumber, labSheet, pad2 } from "@/components/labs/lab-sheet";

export const dynamicParams = false;

export function generateStaticParams() {
  return labs.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lab = getLab(slug);
  if (!lab) return {};
  return pageMetadata({ title: lab.title, description: lab.description, path: `/lab/${lab.slug}/` });
}

const steps: Record<string, string[]> = {
  "crud-simulator": [
    "Tulis tugas baru, tekan Tambah, lalu buka tab 1 · Request dan 2 · SQL di panel Di balik layar.",
    "Centang tugas atau ubah judulnya. Perhatikan PATCH dan UPDATE yang muncul.",
    "Hapus satu tugas. Status yang kembali 204, bukan 200 atau 201.",
  ],
  "http-explorer": [
    "Klik salah satu contoh request. Method, path, dan body terisi sendiri, tinggal tekan Kirim.",
    "Kirim POST tanpa judul. Server menjawab 400 dan memberi tahu kolom mana yang salah.",
    "Tambahkan ?done=false&page=1&limit=2 di path untuk mencoba filter dan halaman.",
  ],
  "sql-playground": [
    "Klik nama tabel di panel Skema untuk melihat isinya.",
    "Ubah query di editor, lalu tekan Jalankan atau Ctrl + Enter.",
    "Silakan coba UPDATE dan DELETE. Kalau datanya rusak, tekan Reset DB.",
  ],
  flexbox: [
    "Ganti flexDirection dan lihat arah sumbu utama ikut berubah.",
    "justifyContent mengatur sumbu utama, alignItems mengatur sumbu silang. Coba keduanya bergantian.",
    "Salin isi Kode StyleSheet ke proyek Expo-mu.",
  ],
  "react-playground": [
    "Ubah teks di App.js. Pratinjau langsung ikut berubah.",
    "Tambahkan state baru dengan useState, misalnya untuk kolom input.",
    "Kalau muncul error, baca pesannya. Biasanya ia menunjuk baris yang salah.",
  ],
  "expo-snack": [
    "Tekan Jalankan di Expo Snack. Pratinjau web akan muncul di bawahnya.",
    "Pindai kode QR di Snack dengan aplikasi Expo Go untuk mencobanya di HP.",
    "Tekan Buka di Snack kalau ingin menyimpan atau membagikan hasil eksperimenmu.",
  ],
};

export default async function LabPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lab = getLab(slug);
  if (!lab) notFound();
  const related = lab.relatedLessons.map(getLessonById).filter((l) => l !== undefined);
  const n = labNumber(lab.slug) ?? 0;
  const info = labSheet[lab.slug];
  const prev = n > 1 ? labs[n - 2] : undefined;
  const next = n < labs.length ? labs[n] : undefined;
  const todo = steps[lab.slug] ?? [];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
      <nav aria-label="Breadcrumb" className="mb-4 flex min-w-0 items-center gap-1 text-sm text-muted-foreground">
        <Link href="/lab/" className="-ml-2 inline-flex min-h-11 shrink-0 items-center rounded-md px-2 hover:text-foreground">
          Lab
        </Link>
        <ChevronRight className="size-3.5 shrink-0 text-subtle-foreground" aria-hidden />
        <span className="min-w-0 truncate px-1 text-foreground" aria-current="page">
          {lab.title}
        </span>
      </nav>

      <header className="max-w-3xl">
        <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
          Lab {pad2(n)} dari {pad2(labs.length)} · Lembar kerja
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{lab.title}</h1>
        <p className="mt-3 text-base text-pretty text-muted-foreground sm:text-lg">{lab.description}</p>
        <p className="mt-3 font-mono text-xs text-muted-foreground">
          {[info?.level, info ? `±${info.minutes} menit` : null, ...lab.tags].filter(Boolean).join(" · ")}
        </p>
      </header>

      {todo.length ? (
        <section aria-labelledby="langkah-kerja" className="mt-6 sm:mt-8">
          <h2 id="langkah-kerja" className="font-mono text-xs font-normal tracking-wider text-muted-foreground uppercase">
            Langkah kerja
          </h2>
          <ol className="mt-2 grid grid-cols-1 border-y border-border-strong md:grid-cols-3 md:divide-x md:divide-border">
            {todo.map((t, i) => (
              <li
                key={t}
                className="flex gap-3 border-b border-border py-3 text-sm leading-relaxed text-pretty last:border-b-0 md:border-b-0 md:px-4 md:first:pl-0 md:last:pr-0 [overflow-wrap:anywhere]"
              >
                <span className="shrink-0 font-mono text-sm font-semibold text-foreground tabular-nums">{i + 1}.</span>
                <span className="min-w-0">{t}</span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <LabRenderer slug={lab.slug} />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-10">
        {related.length ? (
          <section aria-labelledby="baca-teori" className="min-w-0">
            <h2 id="baca-teori" className="text-xl font-semibold tracking-tight">
              Baca dulu teorinya
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">Lab ini dipakai di pelajaran berikut.</p>
            <ul className="mt-3 border-t border-border">
              {related.map((l) => (
                <li key={l.id} className="border-b border-border">
                  <Link
                    href={l.href}
                    className="group flex min-h-11 items-baseline gap-2 py-2.5 text-sm hover:text-primary sm:text-base"
                  >
                    <span className="min-w-0 font-medium underline-offset-4 group-hover:underline">{l.title}</span>
                    <span
                      aria-hidden
                      className="hidden min-w-6 flex-1 translate-y-[-0.2em] border-b border-dotted border-border-strong sm:block"
                    />
                    <span className="ml-auto shrink-0 font-mono text-xs text-muted-foreground sm:ml-0">
                      Pelajaran {l.trackNumber}.{l.index + 1}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : (
          <div />
        )}

        <nav aria-label="Lab lain" className="min-w-0">
          <h2 className="text-xl font-semibold tracking-tight">Lab lain</h2>
          <ul className="mt-3 grid grid-cols-1 gap-3">
            {prev ? (
              <li>
                <Link
                  href={`/lab/${prev.slug}/`}
                  className="group flex min-h-11 items-center gap-3 rounded-md border border-border-strong bg-card px-3 py-2.5 hover:bg-surface"
                >
                  <ArrowLeft className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <span className="min-w-0">
                    <span className="block font-mono text-xs text-muted-foreground">
                      Sebelumnya · Lab {pad2(n - 1)}
                    </span>
                    <span className="block font-semibold group-hover:underline">{prev.title}</span>
                  </span>
                </Link>
              </li>
            ) : null}
            {next ? (
              <li>
                <Link
                  href={`/lab/${next.slug}/`}
                  className="group flex min-h-11 items-center justify-between gap-3 rounded-md border border-border-strong bg-card px-3 py-2.5 text-right hover:bg-surface"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-xs text-muted-foreground">
                      Berikutnya · Lab {pad2(n + 1)}
                    </span>
                    <span className="block font-semibold group-hover:underline">{next.title}</span>
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                </Link>
              </li>
            ) : (
              <li>
                <Link
                  href="/lab/"
                  className="flex min-h-11 items-center rounded-md border border-dashed border-border-strong px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground"
                >
                  Ini lab terakhir. Kembali ke daftar lab.
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
}
