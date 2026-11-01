import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { TOTAL_LESSONS, TOTAL_MINUTES, allLessons, tracks } from "@/lib/curriculum";
import { labs } from "@/lib/registry";
import { cn } from "@/lib/utils";
import { buttonClass } from "@/components/ui/button";
import { trackTone } from "@/components/ui/track-icon";
import { HeroVisual } from "@/components/home/hero-visual";
import { ContinueCard, HeroCta } from "@/components/home/continue";

const hours = Math.round(TOTAL_MINUTES / 60);
const avgMinutes = Math.round(TOTAL_MINUTES / TOTAL_LESSONS / 5) * 5;
const firstLesson = allLessons[0];

/** Satu kalimat "apa yang bisa dicoba" per lab; jatuh ke deskripsi registry bila slug baru. */
const labTry: Record<string, string> = {
  "crud-simulator": "Tambah satu tugas, lalu lihat request dan query SQL yang terjadi di belakangnya.",
  "http-explorer": "Kirim DELETE ke data yang tidak ada dan lihat kenapa jawabannya 404.",
  "sql-playground": "Tulis SELECT pertamamu ke database SQLite yang jalan di browser.",
  flexbox: "Ubah justifyContent dan alignItems sampai tombolnya pas di tengah layar.",
  "react-playground": "Bikin counter sederhana dan lihat layar ikut berubah saat state berubah.",
  "expo-snack": "Jalankan kode React Native di browser, atau langsung di HP lewat Expo Go.",
};

const howTo = [
  {
    title: "Baca satu pelajaran",
    text: `Satu pelajaran rata-rata ${avgMinutes} menit. Contoh kodenya bisa kamu salin dan jalankan sendiri.`,
  },
  {
    title: "Coba di lab",
    text: "Kalau ada lab yang cocok, buka dan ubah-ubah isinya. Salah ketik tidak apa-apa, tidak ada yang rusak.",
  },
  {
    title: "Kerjakan latihan dan kuis",
    text: "Di akhir pelajaran ada latihan dan kuis singkat. Tandai selesai supaya progresmu tercatat.",
  },
];

const capstoneTodo = [
  "Register dan login dengan token JWT",
  "Create, Read, Update, Delete tugas lewat REST API",
  "Menyaring dan mencari data dengan query parameter",
  "Upload gambar dari HP ke server dengan FormData",
  "Tetap bisa dibuka waktu sinyal hilang (offline-first)",
  "Menguji kode, lalu men-deploy aplikasi dan API-nya",
];

const faqs = [
  {
    q: "Harus sudah bisa coding?",
    a: "Tidak. Bab 0 dimulai dari memasang alat, cara kerja web, lalu JavaScript dasar. Cukup laptop dan waktu sekitar satu jam sehari.",
  },
  {
    q: "Perlu HP Android atau iPhone?",
    a: "Tidak wajib. Kamu bisa pakai Expo Go di HP, emulator di laptop, atau Expo Snack di browser.",
  },
  {
    q: "Gratis? Perlu bikin akun?",
    a: "Gratis dan tanpa akun. Progres disimpan di browser (localStorage). Kalau mau pindah perangkat, pakai fitur ekspor di halaman Progres.",
  },
  {
    q: "Berapa lama sampai bisa bikin aplikasi sendiri?",
    a: `Materinya sekitar ${hours} jam baca. Ditambah latihan, dengan satu jam sehari biasanya butuh satu sampai dua bulan sampai proyek akhir jalan.`,
  },
];

const container = "mx-auto w-full max-w-6xl px-4 sm:px-6 2xl:max-w-[1440px]";
const eyebrow = "font-mono text-xs tracking-wider text-muted-foreground uppercase";

export default function HomePage() {
  return (
    <div className="overflow-x-clip">
      {/* Halaman pembuka */}
      <section className="bg-ruled border-b border-border [--rule-gap:2rem]">
        <div
          className={cn(
            container,
            "relative grid grid-cols-1 items-center gap-10 pt-10 pb-12 sm:gap-12 sm:pt-14 sm:pb-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-14 lg:pt-20 lg:pb-20",
          )}
        >
          <span className="margin-line pointer-events-none absolute inset-y-0 left-6 hidden w-6 [--margin-x:1.25rem] sm:block" aria-hidden />
          <div className="min-w-0 sm:pl-10">
            <p className={eyebrow}>Modul belajar · CRUD &amp; React Native</p>
            <h1 className="mt-4 text-[2rem] leading-[1.15] font-semibold tracking-tight text-balance min-[380px]:text-[2.2rem] sm:text-5xl sm:leading-[1.1] lg:text-[3.25rem] 2xl:text-6xl">
              Belajar bikin aplikasi <span className="marker">CRUD</span>, dari database sampai layar HP.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg 2xl:max-w-2xl">
              Situs belajar untuk pemula, dari JavaScript dasar, API dan database, sampai aplikasi React Native di HP. Tiap
              langkah Create, Read, Update, dan Delete dibahas satu per satu, lengkap dengan lab dan kuis.
            </p>
            <div className="mt-8">
              <HeroCta />
            </div>
            <p className="mt-5 max-w-xl text-sm text-muted-foreground">
              Gratis, tanpa akun. Isinya {tracks.length} bab dan {TOTAL_LESSONS} pelajaran; progresmu disimpan di browser ini.
            </p>
          </div>
          <div className="min-w-0 sm:pl-10 lg:pl-0">
            <HeroVisual />
          </div>
        </div>
      </section>

      <ContinueCard />

      {/* Daftar isi */}
      <section id="daftar-isi" className={cn(container, "scroll-mt-20 py-14 sm:py-20")} aria-labelledby="daftar-isi-judul">
        <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-14 2xl:grid-cols-[20rem_minmax(0,1fr)]">
          <div className="min-w-0">
            <h2 id="daftar-isi-judul" className="text-[1.75rem] leading-tight font-semibold tracking-tight sm:text-4xl">
              Daftar isi
            </h2>
            <p className="mt-3 max-w-md text-muted-foreground">
              Tiap bab memakai hasil bab sebelumnya, jadi paling enak dibaca berurutan.
            </p>
            <p className="mt-4 inline-block -rotate-1 font-hand text-[1.375rem] leading-tight text-primary sm:text-2xl" aria-hidden>
              mulai dari 0, sama kayak indeks array
            </p>
          </div>

          <div className="min-w-0">
            <ol className="border-t border-border-strong">
              {tracks.map((t) => {
                const count = `${t.lessons.length} pelajaran`;
                return (
                  <li key={t.slug} className="border-b border-border">
                    <Link
                      href={`/belajar/${t.slug}/`}
                      className="group relative block py-5 pl-5 transition-colors hover:bg-surface/70 sm:pr-2"
                    >
                      <span className={cn("absolute top-6 left-0 h-5 w-1 rounded-r-sm", trackTone[t.slug]?.tab)} aria-hidden />
                      <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1 sm:flex-nowrap">
                        <span className={cn(eyebrow, "w-full sm:w-14 sm:shrink-0")}>
                          Bab {t.number}
                          <span className="sm:hidden"> · {count}</span>
                        </span>
                        <span className="min-w-0 font-serif text-lg leading-snug font-semibold text-balance decoration-1 underline-offset-4 group-hover:text-primary group-hover:underline sm:text-xl">
                          {t.title}
                        </span>
                        <span className="hidden min-w-8 flex-1 border-b-2 border-dotted border-border-strong sm:block" aria-hidden />
                        <span className="hidden shrink-0 font-mono text-xs text-muted-foreground sm:inline">{count}</span>
                      </span>
                      <span className="mt-1.5 block max-w-2xl text-sm leading-relaxed text-pretty text-muted-foreground sm:pl-[4.25rem]">
                        {t.description}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
            <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              <span className={cn(eyebrow, "mr-2 text-foreground")}>Proyek latihan</span>
              Supaya tiap konsep langsung dipraktikkan, semua bab memakai satu contoh proyek: aplikasi{" "}
              <strong className="font-semibold text-foreground">Tugas &amp; Catatan Kuliah</strong>. Judul tiap pelajaran bisa
              dilihat di{" "}
              <Link href="/belajar/" className="font-semibold text-primary underline underline-offset-4 hover:no-underline">
                halaman kurikulum
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Cara pakai */}
      <section className="border-y border-border bg-surface" aria-labelledby="cara-pakai">
        <div className={cn(container, "py-12 sm:py-16")}>
          <h2 id="cara-pakai" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Cara pakai modul ini
          </h2>
          <ol className="mt-8 grid gap-7 md:grid-cols-3 md:gap-0 md:divide-x md:divide-dashed md:divide-border-strong">
            {howTo.map((s, i) => (
              <li key={s.title} className="flex gap-4 md:block md:px-8 md:first:pl-0 md:last:pr-0">
                <span className="w-6 shrink-0 font-serif text-2xl leading-none font-semibold text-primary md:w-auto">{i + 1}.</span>
                <div className="min-w-0">
                  <h3 className="font-semibold md:mt-3">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Lab */}
      <section id="lab" className={cn(container, "py-14 sm:py-20")} aria-labelledby="lab-judul">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div className="max-w-xl">
            <h2 id="lab-judul" className="text-[1.75rem] leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
              Lab: coba langsung di browser
            </h2>
            <p className="mt-3 text-muted-foreground">
              {labs.length} alat kecil untuk mengutak-atik hal yang baru kamu baca. Tidak perlu instal apa-apa.
            </p>
          </div>
          <Link
            href="/lab/"
            className="inline-flex min-h-11 shrink-0 items-center gap-1.5 self-start text-sm font-semibold text-primary underline-offset-4 hover:underline sm:self-auto"
          >
            Buka semua lab <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <ol className="mt-8 grid gap-x-12 sm:grid-cols-2">
          {labs.map((lab, i) => (
            <li key={lab.slug} className="border-t border-border last:border-b sm:[&:nth-last-child(2)]:border-b">
              <Link href={`/lab/${lab.slug}/`} className="group flex gap-4 py-4 transition-colors hover:bg-surface/70">
                <span className="w-12 shrink-0 pt-0.5 font-mono text-xs text-muted-foreground">Lab {i + 1}</span>
                <span className="min-w-0">
                  <span className="block font-semibold decoration-1 underline-offset-4 group-hover:text-primary group-hover:underline">
                    {lab.title}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{labTry[lab.slug] ?? lab.description}</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* Proyek akhir */}
      <section className="border-y border-border bg-surface" aria-labelledby="proyek-akhir">
        <div className={cn(container, "grid gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start lg:gap-14")}>
          <div className="min-w-0">
            <p className={eyebrow}>Proyek akhir · latihan</p>
            <h2 id="proyek-akhir" className="mt-3 text-[1.75rem] leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
              Praktik semua materi dalam satu aplikasi
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-muted-foreground">
              Contoh proyeknya aplikasi Tugas &amp; Catatan Kuliah, mulai dibangun di Bab 3 lalu dirapikan di Bab 4. Server-nya
              pakai Express dan Prisma, aplikasinya pakai Expo. Setelah selesai, kamu bisa memakai pola yang sama untuk membuat
              aplikasi CRUD apa pun.
            </p>
            <p className="mt-5 font-mono text-xs leading-relaxed text-muted-foreground">
              Expo · Express · Prisma · SQLite · TanStack Query
            </p>
          </div>

          <div className="min-w-0 rounded-md border border-border-strong bg-card">
            <p className={cn(eyebrow, "border-b-2 border-danger/30 px-5 py-3")}>Yang kamu praktikkan</p>
            <ul className="divide-y divide-border px-5">
              {capstoneTodo.map((item) => (
                <li key={item} className="flex gap-3 py-3 text-sm leading-relaxed">
                  <span className="mt-[0.2rem] size-4 shrink-0 rounded-[3px] border-2 border-border-strong" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Pertanyaan */}
      <section className={cn(container, "py-14 sm:py-20")} aria-labelledby="faq">
        <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-14 2xl:grid-cols-[20rem_minmax(0,1fr)]">
          <h2 id="faq" className="text-2xl leading-tight font-semibold tracking-tight sm:text-3xl">
            Yang sering ditanyakan
          </h2>
          <div className="max-w-3xl border-t border-border-strong">
            {faqs.map((f) => (
              <details key={f.q} className="group border-b border-border">
                <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-4 font-semibold transition-colors hover:text-primary [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <p className="-mt-1 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Halaman berikutnya */}
      {firstLesson ? (
        <section className={cn(container, "pb-16 sm:pb-20")} aria-labelledby="halaman-berikutnya">
          <div className="flex flex-col gap-5 rounded-md border border-border-strong bg-card p-5 shadow-notebook sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:p-7">
            <div className="min-w-0">
              <p className={eyebrow}>
                Bab {firstLesson.trackNumber} · Pelajaran 1 · ±{firstLesson.minutes} menit
              </p>
              <h2 id="halaman-berikutnya" className="mt-2 text-xl font-semibold text-balance sm:text-2xl">
                {firstLesson.title}
              </h2>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
                Halaman pertama modul. Isinya cara memakai situs ini dan gambaran proyek latihan yang akan kamu buat.
              </p>
            </div>
            <Link href={firstLesson.href} className={buttonClass("primary", "lg", "w-full sm:w-auto")}>
              Buka pelajaran <ArrowRight aria-hidden />
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  );
}
