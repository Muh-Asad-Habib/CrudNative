import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { allLessons, getAdjacentLessons, tracks, TOTAL_LESSONS } from "@/lib/curriculum";
import { glossary, type GlossaryCategory } from "@/lib/glossary";
import { cheatsheets, labs } from "@/lib/registry";
import { searchIndex } from "@/lib/search-index";
import { trackQuizzes } from "@/content/quiz";

const CONTENT = join(process.cwd(), "content");
const lessonIds = new Set(allLessons.map((l) => l.id));
const mdxIn = (dir: string) =>
  existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith(".mdx")).map((f) => f.slice(0, -4)) : [];
const dupes = (values: string[]) => values.filter((v, i) => values.indexOf(v) !== i);

describe("kurikulum", () => {
  it("slug track & pelajaran unik dan berformat kebab-case", () => {
    expect(dupes(tracks.map((t) => t.slug))).toEqual([]);
    expect(dupes(allLessons.map((l) => l.id))).toEqual([]);
    for (const l of allLessons) expect(l.id).toMatch(/^[a-z0-9-]+\/[a-z0-9-]+$/);
  });

  it("TOTAL_LESSONS sesuai dan indeks global berurutan", () => {
    expect(allLessons).toHaveLength(TOTAL_LESSONS);
    allLessons.forEach((l, i) => expect(l.globalIndex).toBe(i));
  });

  it("navigasi prev/next menyambung antar track", () => {
    expect(getAdjacentLessons(allLessons[0].id).prev).toBeFalsy();
    expect(getAdjacentLessons(allLessons.at(-1)!.id).next).toBeFalsy();
    for (let i = 1; i < allLessons.length; i++) {
      expect(getAdjacentLessons(allLessons[i].id).prev?.id).toBe(allLessons[i - 1].id);
    }
  });

  it("setiap pelajaran punya metadata lengkap", () => {
    for (const t of tracks) {
      for (const l of t.lessons) {
        expect(l.title.length, l.slug).toBeGreaterThan(3);
        expect(l.description.length, l.slug).toBeGreaterThan(10);
        expect(l.minutes, l.slug).toBeGreaterThan(0);
        expect(l.objectives.length, l.slug).toBeGreaterThanOrEqual(2);
      }
    }
  });
});

describe("file konten", () => {
  it("setiap pelajaran punya file MDX dan tidak ada MDX yatim", () => {
    for (const t of tracks) {
      const files = mdxIn(join(CONTENT, t.slug)).sort();
      expect(files, t.slug).toEqual(t.lessons.map((l) => l.slug).sort());
    }
  });

  it("registry cheatsheet cocok dengan file MDX", () => {
    expect(mdxIn(join(CONTENT, "cheatsheet")).sort()).toEqual(cheatsheets.map((c) => c.slug).sort());
  });
});

describe("registry & glosarium", () => {
  it("lab & cheatsheet punya slug unik, relatedLessons valid", () => {
    expect(dupes(labs.map((l) => l.slug))).toEqual([]);
    expect(dupes(cheatsheets.map((c) => c.slug))).toEqual([]);
    for (const lab of labs) {
      expect(lab.relatedLessons.length, lab.slug).toBeGreaterThan(0);
      for (const id of lab.relatedLessons) expect(lessonIds.has(id), `${lab.slug} → ${id}`).toBe(true);
    }
  });

  it("glosarium: slug unik, kategori valid, referensi pelajaran valid", () => {
    const categories: GlossaryCategory[] = [
      "Web & HTTP",
      "JavaScript",
      "Database",
      "Backend",
      "React",
      "React Native",
      "Keamanan",
      "DevOps",
    ];
    expect(dupes(glossary.map((g) => g.slug))).toEqual([]);
    for (const g of glossary) {
      expect(g.slug).toMatch(/^[a-z0-9-]+$/);
      expect(categories, g.slug).toContain(g.category);
      expect(g.definition.length, g.slug).toBeGreaterThan(20);
      if (g.lesson) expect(lessonIds.has(g.lesson), `${g.slug} → ${g.lesson}`).toBe(true);
    }
  });

  it("indeks pencarian tidak punya ID ganda dan semua href internal", () => {
    expect(dupes(searchIndex.map((s) => s.id))).toEqual([]);
    for (const item of searchIndex) expect(item.href.startsWith("/"), item.id).toBe(true);
    expect(searchIndex.filter((s) => s.kind === "lesson")).toHaveLength(TOTAL_LESSONS);
  });

  it("kuis akhir tersedia untuk setiap track", () => {
    for (const t of tracks) expect(trackQuizzes[t.slug]?.length, t.slug).toBeGreaterThan(0);
  });
});
