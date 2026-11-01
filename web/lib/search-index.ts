import { allLessons, tracks } from "./curriculum";
import { glossary } from "./glossary";
import { cheatsheets, labs } from "./registry";

export type SearchKind = "lesson" | "track" | "lab" | "cheatsheet" | "glossary" | "page";

export interface SearchItem {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle: string;
  href: string;
  keywords: string[];
}

const pages: SearchItem[] = [
  { id: "page-home", kind: "page", title: "Beranda", subtitle: "Halaman utama", href: "/", keywords: ["home", "beranda"] },
  { id: "page-kurikulum", kind: "page", title: "Daftar Isi", subtitle: "Semua bab dan pelajaran", href: "/belajar/", keywords: ["roadmap", "kurikulum", "silabus", "daftar isi", "track"] },
  { id: "page-lab", kind: "page", title: "Lab Interaktif", subtitle: "Playground & simulator", href: "/lab/", keywords: ["lab", "playground", "simulator"] },
  { id: "page-cheatsheet", kind: "page", title: "Cheatsheet", subtitle: "Ringkasan sintaks", href: "/cheatsheet/", keywords: ["cheatsheet", "contekan", "ringkasan"] },
  { id: "page-glosarium", kind: "page", title: "Glosarium", subtitle: "Kamus istilah", href: "/glosarium/", keywords: ["glosarium", "istilah", "kamus"] },
  { id: "page-progres", kind: "page", title: "Progres Belajar", subtitle: "Statistik, lencana, ekspor data", href: "/progres/", keywords: ["progres", "statistik", "badge", "lencana", "streak"] },
];

export const searchIndex: SearchItem[] = [
  ...pages,
  ...tracks.map<SearchItem>((t) => ({
    id: `track-${t.slug}`,
    kind: "track",
    title: `Bab ${t.number}: ${t.title}`,
    subtitle: `${t.lessons.length} pelajaran`,
    href: `/belajar/${t.slug}/`,
    keywords: [t.shortTitle, t.description],
  })),
  ...allLessons.map<SearchItem>((l) => ({
    id: `lesson-${l.id}`,
    kind: "lesson",
    title: l.title,
    subtitle: `Bab ${l.trackNumber} · ${l.trackTitle}`,
    href: l.href,
    keywords: [...l.keywords, l.description],
  })),
  ...labs.map<SearchItem>((l) => ({
    id: `lab-${l.slug}`,
    kind: "lab",
    title: l.title,
    subtitle: "Lab interaktif",
    href: `/lab/${l.slug}/`,
    keywords: [...l.tags, l.description],
  })),
  ...cheatsheets.map<SearchItem>((c) => ({
    id: `cheatsheet-${c.slug}`,
    kind: "cheatsheet",
    title: `Cheatsheet ${c.title}`,
    subtitle: c.description,
    href: `/cheatsheet/${c.slug}/`,
    keywords: c.tags,
  })),
  ...glossary.map<SearchItem>((g) => ({
    id: `glossary-${g.slug}`,
    kind: "glossary",
    title: g.term,
    subtitle: g.definition.length > 80 ? `${g.definition.slice(0, 80)}…` : g.definition,
    href: `/glosarium/#${g.slug}`,
    keywords: [g.category, ...(g.aliases ?? [])],
  })),
];

export const searchKindLabel: Record<SearchKind, string> = {
  page: "Halaman",
  track: "Track",
  lesson: "Pelajaran",
  lab: "Lab",
  cheatsheet: "Cheatsheet",
  glossary: "Glosarium",
};
