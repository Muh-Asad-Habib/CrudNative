import { describe, expect, it } from "vitest";
import { allLessons, tracks, TOTAL_LESSONS } from "@/lib/curriculum";
import {
  computeBadges,
  computeStreak,
  countCompleted,
  longestStreak,
  nextLessonToStudy,
  overallStats,
  percent,
  trackStats,
} from "@/lib/progress-stats";
import { emptyProgress, type ProgressData } from "@/lib/progress-store";

const completedFor = (ids: string[]) => Object.fromEntries(ids.map((id, i) => [id, 1_700_000_000_000 + i]));
const data = (patch: Partial<ProgressData>): ProgressData => ({ ...emptyProgress, ...patch });
const badge = (badges: ReturnType<typeof computeBadges>, id: string) => badges.find((b) => b.id === id)!;

describe("percent & countCompleted", () => {
  it("membulatkan dan aman untuk total 0", () => {
    expect(percent(1, 3)).toBe(33);
    expect(percent(2, 3)).toBe(67);
    expect(percent(5, 0)).toBe(0);
  });

  it("hanya menghitung ID pelajaran yang ada", () => {
    const completed = completedFor([allLessons[0].id, allLessons[1].id, "track-palsu/tidak-ada"]);
    expect(countCompleted(completed)).toBe(2);
    expect(countCompleted(completed, [allLessons[1].id])).toBe(1);
  });
});

describe("trackStats & overallStats", () => {
  it("total per track sama dengan kurikulum", () => {
    const stats = trackStats({});
    expect(stats.map((s) => s.slug)).toEqual(tracks.map((t) => t.slug));
    stats.forEach((s, i) => {
      expect(s.total).toBe(tracks[i].lessons.length);
      expect(s.done).toBe(0);
      expect(s.percent).toBe(0);
    });
    expect(stats.reduce((sum, s) => sum + s.total, 0)).toBe(TOTAL_LESSONS);
  });

  it("track selesai bernilai 100%", () => {
    const fondasiIds = allLessons.filter((l) => l.trackSlug === "fondasi").map((l) => l.id);
    const stats = trackStats(completedFor(fondasiIds));
    expect(stats.find((s) => s.slug === "fondasi")).toMatchObject({ done: fondasiIds.length, percent: 100 });
    expect(overallStats(completedFor(fondasiIds))).toEqual({
      done: fondasiIds.length,
      total: TOTAL_LESSONS,
      percent: Math.round((fondasiIds.length / TOTAL_LESSONS) * 100),
    });
  });
});

describe("streak", () => {
  it("menghitung hari berturut-turut yang berakhir hari ini", () => {
    expect(computeStreak(["2025-03-08", "2025-03-09", "2025-03-10"], "2025-03-10")).toBe(3);
  });

  it("tetap dihitung bila hari terakhir adalah kemarin", () => {
    expect(computeStreak(["2025-03-08", "2025-03-09"], "2025-03-10")).toBe(2);
  });

  it("putus bila bolong lebih dari sehari", () => {
    expect(computeStreak(["2025-03-07", "2025-03-08"], "2025-03-10")).toBe(0);
    expect(computeStreak([], "2025-03-10")).toBe(0);
    expect(computeStreak(["2025-03-05", "2025-03-07", "2025-03-08", "2025-03-09", "2025-03-10"], "2025-03-10")).toBe(4);
  });

  it("melewati batas bulan dan tahun", () => {
    expect(computeStreak(["2024-12-30", "2024-12-31", "2025-01-01"], "2025-01-01")).toBe(3);
    expect(computeStreak(["2024-02-28", "2024-02-29", "2024-03-01"], "2024-03-01")).toBe(3);
  });

  it("longestStreak mencari rangkaian terpanjang tanpa peduli urutan & duplikat", () => {
    expect(longestStreak([])).toBe(0);
    expect(longestStreak(["2025-01-05"])).toBe(1);
    expect(
      longestStreak(["2025-01-10", "2025-01-01", "2025-01-02", "2025-01-02", "2025-01-03", "2025-01-09"]),
    ).toBe(3);
    expect(longestStreak(["2025-01-31", "2025-02-01", "2025-02-02", "2025-02-03"])).toBe(4);
  });
});

describe("nextLessonToStudy", () => {
  it("mengembalikan pelajaran pertama yang belum selesai", () => {
    expect(nextLessonToStudy({})?.id).toBe(allLessons[0].id);
    expect(nextLessonToStudy(completedFor([allLessons[0].id]))?.id).toBe(allLessons[1].id);
    expect(nextLessonToStudy(completedFor(allLessons.map((l) => l.id)))).toBeNull();
  });
});

describe("computeBadges", () => {
  it("tidak ada lencana untuk pengguna baru", () => {
    const badges = computeBadges(emptyProgress, "2025-03-10");
    expect(badges.length).toBe(10);
    expect(new Set(badges.map((b) => b.id)).size).toBe(badges.length);
    expect(badges.every((b) => !b.earned)).toBe(true);
  });

  it("lencana pelajaran pertama, streak, dan track", () => {
    const fondasiIds = allLessons.filter((l) => l.trackSlug === "fondasi").map((l) => l.id);
    const badges = computeBadges(
      data({ completed: completedFor(fondasiIds), activeDays: ["2025-03-08", "2025-03-09", "2025-03-10"] }),
      "2025-03-10",
    );
    expect(badge(badges, "first-step").earned).toBe(true);
    expect(badge(badges, "streak-3").earned).toBe(true);
    expect(badge(badges, "streak-7").earned).toBe(false);
    expect(badge(badges, "fondasi").earned).toBe(true);
    expect(badge(badges, "crud-backend").earned).toBe(false);
    expect(badge(badges, "graduate").earned).toBe(false);
  });

  it("streak lama yang sudah putus tetap memberi lencana streak", () => {
    const days = Array.from({ length: 7 }, (_, i) => `2025-01-0${i + 1}`);
    const badges = computeBadges(data({ activeDays: days }), "2025-03-10");
    expect(badge(badges, "streak-7").earned).toBe(true);
  });

  it("jago kuis butuh 5 kuis sempurna (berdasarkan nilai terbaik)", () => {
    const quiz = (best: number) => ({ score: 1, total: 4, best, attempts: 2, at: 0 });
    const four = Object.fromEntries(["a", "b", "c", "d"].map((k) => [k, quiz(4)]));
    expect(badge(computeBadges(data({ quizzes: { ...four, e: quiz(3) } })), "quiz-master").earned).toBe(false);
    expect(badge(computeBadges(data({ quizzes: { ...four, e: quiz(4) } })), "quiz-master").earned).toBe(true);
  });

  it("lulus 100% saat semua pelajaran selesai", () => {
    const badges = computeBadges(data({ completed: completedFor(allLessons.map((l) => l.id)) }));
    for (const id of ["first-step", "fondasi", "crud-backend", "react-native", "fullstack", "expert", "graduate"]) {
      expect(badge(badges, id).earned, id).toBe(true);
    }
  });
});
