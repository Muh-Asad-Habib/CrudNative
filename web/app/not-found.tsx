import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonClass } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60dvh] w-full max-w-2xl items-center px-4 py-14 sm:px-6 sm:py-20">
      <div className="w-full rounded-md border border-border-strong bg-card shadow-notebook">
        <p className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b-2 border-danger/30 px-5 py-3 font-mono text-xs text-muted-foreground sm:px-7">
          <span className="tracking-wider uppercase">Halaman 404</span>
          <span>GET → 404 Not Found</span>
        </p>
        <div className="bg-ruled px-5 py-7 [--rule-gap:1.75rem] sm:px-7 sm:py-9">
          <h1 className="text-[1.75rem] leading-tight font-semibold tracking-tight text-balance sm:text-4xl">
            Halaman ini tidak ada di modul.
          </h1>
          <p className="mt-4 max-w-lg leading-relaxed text-pretty text-muted-foreground">
            Mungkin alamatnya salah ketik, atau halamannya sudah dipindah. Sama seperti API yang menjawab{" "}
            <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-sm text-foreground">404</code> saat data yang
            diminta tidak ditemukan.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/" className={buttonClass("primary", "md", "w-full sm:w-auto")}>
              <ArrowLeft aria-hidden /> Kembali ke halaman depan
            </Link>
            <Link href="/belajar/" className={buttonClass("outline", "md", "w-full sm:w-auto")}>
              Buka daftar isi
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
