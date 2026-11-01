import { Database, Layers, Rocket, Smartphone, Workflow, type LucideProps } from "lucide-react";
import type { TrackIconKey } from "@/lib/curriculum";

const map = {
  foundation: Layers,
  database: Database,
  smartphone: Smartphone,
  workflow: Workflow,
  rocket: Rocket,
} satisfies Record<TrackIconKey, React.ComponentType<LucideProps>>;

export function TrackIcon({ icon, ...props }: { icon: TrackIconKey } & LucideProps) {
  const Icon = map[icon];
  return <Icon aria-hidden {...props} />;
}

/**
 * Warna per track bergaya "pembatas buku": tinta kalem, bukan gradien.
 * - bg/text/ring: latar lembut, teks, dan cincin fokus.
 * - tab: warna solid untuk strip/tab pembatas di tepi kartu.
 * Kelas Tailwind ditulis statis supaya tidak ter-purge.
 */
export const trackTone: Record<string, { bg: string; text: string; ring: string; tab: string }> = {
  fondasi: {
    bg: "bg-sky-700/8 dark:bg-sky-400/10",
    text: "text-sky-800 dark:text-sky-300",
    ring: "ring-sky-700/25",
    tab: "bg-sky-700 dark:bg-sky-400",
  },
  "crud-backend": {
    bg: "bg-emerald-700/8 dark:bg-emerald-400/10",
    text: "text-emerald-800 dark:text-emerald-300",
    ring: "ring-emerald-700/25",
    tab: "bg-emerald-700 dark:bg-emerald-400",
  },
  "react-native": {
    bg: "bg-indigo-700/8 dark:bg-indigo-400/10",
    text: "text-indigo-800 dark:text-indigo-300",
    ring: "ring-indigo-700/25",
    tab: "bg-indigo-700 dark:bg-indigo-400",
  },
  fullstack: {
    bg: "bg-amber-700/8 dark:bg-amber-400/10",
    text: "text-amber-800 dark:text-amber-300",
    ring: "ring-amber-700/25",
    tab: "bg-amber-600 dark:bg-amber-400",
  },
  expert: {
    bg: "bg-rose-700/8 dark:bg-rose-400/10",
    text: "text-rose-800 dark:text-rose-300",
    ring: "ring-rose-700/25",
    tab: "bg-rose-700 dark:bg-rose-400",
  },
};
