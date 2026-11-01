import { allLessons, tracks, TOTAL_LESSONS } from "./curriculum";
import type { ProgressData } from "./progress-store";
import { todayKey } from "./utils";

export function countCompleted(completed: Record<string, number>, lessonIds?: string[]) {
  const ids = lessonIds ?? allLessons.map((l) => l.id);
  return ids.filter((id) => Boolean(completed[id])).length;
}

export function percent(done: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((done / total) * 100);
}

export function trackStats(completed: Record<string, number>) {
  return tracks.map((t) => {
    const ids = t.lessons.map((l) => `${t.slug}/${l.slug}`);
    const done = countCompleted(completed, ids);
    return { slug: t.slug, title: t.title, shortTitle: t.shortTitle, done, total: ids.length, percent: percent(done, ids.length) };
  });
}

export function overallStats(completed: Record<string, number>) {
  const done = countCompleted(completed);
  return { done, total: TOTAL_LESSONS, percent: percent(done, TOTAL_LESSONS) };
}

function shiftDay(key: string, delta: number) {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + delta);
  return todayKey(date);
}

/** Streak = jumlah hari berturut-turut aktif yang berakhir hari ini atau kemarin. */
export function computeStreak(activeDays: string[], today = todayKey()) {
  const set = new Set(activeDays);
  let cursor = set.has(today) ? today : shiftDay(today, -1);
  if (!set.has(cursor)) return 0;
  let streak = 0;
  while (set.has(cursor)) {
    streak++;
    cursor = shiftDay(cursor, -1);
  }
  return streak;
}

export function longestStreak(activeDays: string[]) {
  const sorted = [...new Set(activeDays)].sort();
  let best = 0;
  let run = 0;
  let prev: string | null = null;
  for (const day of sorted) {
    run = prev && shiftDay(prev, 1) === day ? run + 1 : 1;
    best = Math.max(best, run);
    prev = day;
  }
  return best;
}

/** Lesson pertama yang belum selesai (untuk tombol "Lanjutkan belajar"). */
export function nextLessonToStudy(completed: Record<string, number>) {
  return allLessons.find((l) => !completed[l.id]) ?? null;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: "sparkles" | "flame" | "trophy" | "brain" | "target" | "medal" | "rocket" | "star";
  earned: boolean;
}

export function computeBadges(data: ProgressData, today = todayKey()): Badge[] {
  const stats = trackStats(data.completed);
  const overall = overallStats(data.completed);
  const quizList = Object.values(data.quizzes);
  const perfectQuizzes = quizList.filter((q) => q.total > 0 && q.best === q.total).length;
  const streakBest = Math.max(longestStreak(data.activeDays), computeStreak(data.activeDays, today));
  const trackDone = (slug: string) => stats.find((s) => s.slug === slug)?.percent === 100;

  return [
    { id: "first-step", title: "Langkah Pertama", description: "Selesaikan 1 pelajaran", icon: "sparkles", earned: overall.done >= 1 },
    { id: "streak-3", title: "Rajin", description: "Belajar 3 hari berturut-turut", icon: "flame", earned: streakBest >= 3 },
    { id: "streak-7", title: "Seminggu Penuh", description: "Belajar 7 hari berturut-turut", icon: "flame", earned: streakBest >= 7 },
    { id: "quiz-master", title: "Jago Kuis", description: "Dapat nilai 100 di 5 kuis", icon: "brain", earned: perfectQuizzes >= 5 },
    { id: "fondasi", title: "Dasarnya Kuat", description: "Selesaikan Bab 0: Fondasi", icon: "target", earned: trackDone("fondasi") },
    { id: "crud-backend", title: "Bisa Bikin API", description: "Selesaikan Bab 1: CRUD & Backend", icon: "medal", earned: trackDone("crud-backend") },
    { id: "react-native", title: "Bisa Bikin Aplikasi HP", description: "Selesaikan Bab 2: React & React Native", icon: "medal", earned: trackDone("react-native") },
    { id: "fullstack", title: "Aplikasi Utuh", description: "Selesaikan Bab 3: Full-stack (proyek akhir)", icon: "trophy", earned: trackDone("fullstack") },
    { id: "expert", title: "Siap Dipakai Orang", description: "Selesaikan Bab 4: Expert", icon: "rocket", earned: trackDone("expert") },
    { id: "graduate", title: "Tamat Semua Bab", description: "Selesaikan seluruh kurikulum", icon: "star", earned: overall.percent === 100 },
  ];
}
