"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { todayKey } from "./utils";

export const PROGRESS_STORAGE_KEY = "bcrn-progress-v1";

export interface QuizResult {
  score: number;
  total: number;
  best: number;
  attempts: number;
  at: number;
}

export interface ProgressData {
  completed: Record<string, number>; // lessonId -> timestamp selesai
  quizzes: Record<string, QuizResult>; // quizId -> hasil
  bookmarks: string[]; // lessonId
  lastVisited: { id: string; at: number } | null;
  activeDays: string[]; // "YYYY-MM-DD", terurut naik, unik
}

interface ProgressActions {
  markComplete: (lessonId: string) => void;
  markIncomplete: (lessonId: string) => void;
  toggleComplete: (lessonId: string) => void;
  recordQuiz: (quizId: string, score: number, total: number) => void;
  toggleBookmark: (lessonId: string) => void;
  visit: (lessonId: string) => void;
  reset: () => void;
  importData: (raw: unknown) => boolean;
}

export type ProgressState = ProgressData & ProgressActions & { hydrated: boolean };

export const emptyProgress: ProgressData = {
  completed: {},
  quizzes: {},
  bookmarks: [],
  lastVisited: null,
  activeDays: [],
};

function addActiveDay(days: string[], day = todayKey()) {
  if (days.includes(day)) return days;
  return [...days, day].sort().slice(-400);
}

export function sanitizeProgress(raw: unknown): ProgressData | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const data = (r.state && typeof r.state === "object" ? r.state : r) as Record<string, unknown>;

  const completed: Record<string, number> = {};
  if (data.completed && typeof data.completed === "object") {
    for (const [k, v] of Object.entries(data.completed as Record<string, unknown>)) {
      if (typeof v === "number") completed[k] = v;
    }
  }

  const quizzes: Record<string, QuizResult> = {};
  if (data.quizzes && typeof data.quizzes === "object") {
    for (const [k, v] of Object.entries(data.quizzes as Record<string, unknown>)) {
      const q = v as Partial<QuizResult>;
      if (q && typeof q.score === "number" && typeof q.total === "number") {
        quizzes[k] = {
          score: q.score,
          total: q.total,
          best: typeof q.best === "number" ? q.best : q.score,
          attempts: typeof q.attempts === "number" ? q.attempts : 1,
          at: typeof q.at === "number" ? q.at : Date.now(),
        };
      }
    }
  }

  const bookmarks = Array.isArray(data.bookmarks)
    ? (data.bookmarks.filter((b) => typeof b === "string") as string[])
    : [];

  const lv = data.lastVisited as { id?: unknown; at?: unknown } | null | undefined;
  const lastVisited =
    lv && typeof lv.id === "string" && typeof lv.at === "number" ? { id: lv.id, at: lv.at } : null;

  const activeDays = Array.isArray(data.activeDays)
    ? [...new Set(data.activeDays.filter((d) => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)) as string[])].sort()
    : [];

  return { completed, quizzes, bookmarks, lastVisited, activeDays };
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...emptyProgress,
      hydrated: false,
      markComplete: (id) =>
        set((s) =>
          s.completed[id]
            ? s
            : { completed: { ...s.completed, [id]: Date.now() }, activeDays: addActiveDay(s.activeDays) },
        ),
      markIncomplete: (id) =>
        set((s) => {
          if (!s.completed[id]) return s;
          const completed = { ...s.completed };
          delete completed[id];
          return { completed };
        }),
      toggleComplete: (id) => (get().completed[id] ? get().markIncomplete(id) : get().markComplete(id)),
      recordQuiz: (quizId, score, total) =>
        set((s) => {
          const prev = s.quizzes[quizId];
          return {
            quizzes: {
              ...s.quizzes,
              [quizId]: {
                score,
                total,
                best: Math.max(score, prev?.best ?? 0),
                attempts: (prev?.attempts ?? 0) + 1,
                at: Date.now(),
              },
            },
            activeDays: addActiveDay(s.activeDays),
          };
        }),
      toggleBookmark: (id) =>
        set((s) => ({
          bookmarks: s.bookmarks.includes(id) ? s.bookmarks.filter((b) => b !== id) : [...s.bookmarks, id],
        })),
      visit: (id) => set((s) => ({ lastVisited: { id, at: Date.now() }, activeDays: addActiveDay(s.activeDays) })),
      reset: () => set({ ...emptyProgress }),
      importData: (raw) => {
        const data = sanitizeProgress(raw);
        if (!data) return false;
        set({ ...data });
        return true;
      },
    }),
    {
      name: PROGRESS_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s): ProgressData => ({
        completed: s.completed,
        quizzes: s.quizzes,
        bookmarks: s.bookmarks,
        lastVisited: s.lastVisited,
        activeDays: s.activeDays,
      }),
      merge: (persisted, current) => ({ ...current, ...(sanitizeProgress(persisted) ?? {}) }),
      onRehydrateStorage: () => () => {
        useProgress.setState({ hydrated: true });
      },
    },
  ),
);

export function exportProgress(state: ProgressData) {
  const data: ProgressData = {
    completed: state.completed,
    quizzes: state.quizzes,
    bookmarks: state.bookmarks,
    lastVisited: state.lastVisited,
    activeDays: state.activeDays,
  };
  return JSON.stringify({ app: "crudnative", version: 1, exportedAt: new Date().toISOString(), state: data }, null, 2);
}
