import { labs } from "@/lib/registry";

/** Info "lembar kerja" per lab: hanya untuk tampilan halaman /lab. */
export interface LabSheetInfo {
  level: "Pemula" | "Menengah";
  minutes: number;
  /** Satu kalimat: apa yang dicoba di lab ini. */
  tryLine: string;
  part: "A" | "B";
}

export const labSheet: Record<string, LabSheetInfo> = {
  "crud-simulator": {
    level: "Pemula",
    minutes: 10,
    part: "A",
    tryLine: "Tambah, ubah, dan hapus tugas, lalu lihat request, query SQL, dan jawaban server dari setiap klik.",
  },
  "http-explorer": {
    level: "Pemula",
    minutes: 15,
    part: "A",
    tryLine: "Kirim GET, POST, PATCH, dan DELETE ke API tiruan, lalu baca status code yang kembali.",
  },
  "sql-playground": {
    level: "Menengah",
    minutes: 20,
    part: "A",
    tryLine: "Tulis SELECT, UPDATE, dan JOIN ke database SQLite yang hidup di tab ini.",
  },
  flexbox: {
    level: "Pemula",
    minutes: 10,
    part: "B",
    tryLine: "Ganti flexDirection, justifyContent, dan alignItems, lalu lihat kotak di layar HP ikut pindah.",
  },
  "react-playground": {
    level: "Menengah",
    minutes: 20,
    part: "B",
    tryLine: "Ubah kode App.js dan lihat hasilnya langsung, termasuk saat kamu menambah state.",
  },
  "expo-snack": {
    level: "Menengah",
    minutes: 15,
    part: "B",
    tryLine: "Jalankan kode React Native di browser, atau di HP-mu lewat aplikasi Expo Go.",
  },
};

export const labParts = [
  { key: "A", title: "Data dan server", note: "Yang terjadi setelah tombol diklik." },
  { key: "B", title: "Tampilan aplikasi", note: "Menyusun layar dan menulis komponen." },
] as const;

export function labNumber(slug: string) {
  const i = labs.findIndex((l) => l.slug === slug);
  return i < 0 ? undefined : i + 1;
}

export const pad2 = (n: number) => String(n).padStart(2, "0");
