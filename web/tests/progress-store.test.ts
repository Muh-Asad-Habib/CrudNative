// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  emptyProgress,
  exportProgress,
  PROGRESS_STORAGE_KEY,
  sanitizeProgress,
  useProgress,
} from "@/lib/progress-store";
import { todayKey } from "@/lib/utils";

const store = () => useProgress.getState();

beforeEach(() => {
  localStorage.clear();
  useProgress.setState({ ...emptyProgress });
});

describe("sanitizeProgress", () => {
  it("menolak input yang bukan objek", () => {
    expect(sanitizeProgress(null)).toBeNull();
    expect(sanitizeProgress(undefined)).toBeNull();
    expect(sanitizeProgress("halo")).toBeNull();
    expect(sanitizeProgress(42)).toBeNull();
  });

  it("objek kosong menjadi progress kosong", () => {
    expect(sanitizeProgress({})).toEqual(emptyProgress);
  });

  it("membuang nilai yang tidak valid dan melengkapi default kuis", () => {
    vi.spyOn(Date, "now").mockReturnValue(123);
    const result = sanitizeProgress({
      completed: { "fondasi/setup-tools": 1000, "fondasi/x": "kemarin" },
      quizzes: {
        "fondasi/setup-tools": { score: 2, total: 3 },
        rusak: { score: "dua" },
      },
      bookmarks: ["fondasi/setup-tools", 7, null],
      lastVisited: { id: "fondasi/setup-tools" },
      activeDays: ["2025-01-02", "2025-01-01", "2025-01-02", "bukan-tanggal", 5],
    });
    expect(result).toEqual({
      completed: { "fondasi/setup-tools": 1000 },
      quizzes: { "fondasi/setup-tools": { score: 2, total: 3, best: 2, attempts: 1, at: 123 } },
      bookmarks: ["fondasi/setup-tools"],
      lastVisited: null,
      activeDays: ["2025-01-01", "2025-01-02"],
    });
  });

  it("menerima format persist zustand ({ state, version })", () => {
    const result = sanitizeProgress({ state: { completed: { a: 1 } }, version: 1 });
    expect(result?.completed).toEqual({ a: 1 });
  });

  it("exportProgress dapat diimpor kembali tanpa kehilangan data", () => {
    const original = {
      completed: { "fondasi/selamat-datang": 1 },
      quizzes: { "track:fondasi": { score: 8, total: 10, best: 9, attempts: 3, at: 5 } },
      bookmarks: ["crud-backend/dasar-sql"],
      lastVisited: { id: "crud-backend/dasar-sql", at: 9 },
      activeDays: ["2025-02-01"],
    };
    const json = JSON.parse(exportProgress(original));
    expect(json).toMatchObject({ app: "crudnative", version: 1 });
    expect(sanitizeProgress(json)).toEqual(original);
  });
});

describe("useProgress actions", () => {
  it("markComplete mencatat waktu & hari aktif, dan idempoten", () => {
    store().markComplete("fondasi/setup-tools");
    const first = store().completed["fondasi/setup-tools"];
    expect(first).toBeTypeOf("number");
    expect(store().activeDays).toEqual([todayKey()]);
    store().markComplete("fondasi/setup-tools");
    expect(store().completed["fondasi/setup-tools"]).toBe(first);
  });

  it("toggleComplete & markIncomplete", () => {
    store().toggleComplete("a/b");
    expect(store().completed["a/b"]).toBeDefined();
    store().toggleComplete("a/b");
    expect(store().completed["a/b"]).toBeUndefined();
    store().markIncomplete("tidak/ada");
    expect(store().completed).toEqual({});
  });

  it("recordQuiz menyimpan nilai terbaik dan jumlah percobaan", () => {
    store().recordQuiz("track:fondasi", 6, 10);
    store().recordQuiz("track:fondasi", 9, 10);
    store().recordQuiz("track:fondasi", 7, 10);
    expect(store().quizzes["track:fondasi"]).toMatchObject({ score: 7, total: 10, best: 9, attempts: 3 });
  });

  it("toggleBookmark menambah lalu menghapus", () => {
    store().toggleBookmark("x/y");
    expect(store().bookmarks).toEqual(["x/y"]);
    store().toggleBookmark("x/y");
    expect(store().bookmarks).toEqual([]);
  });

  it("visit menyimpan pelajaran terakhir", () => {
    store().visit("react-native/flatlist");
    expect(store().lastVisited?.id).toBe("react-native/flatlist");
    expect(store().activeDays).toContain(todayKey());
  });

  it("importData menolak data rusak dan menerima data valid", () => {
    expect(store().importData("bukan json")).toBe(false);
    expect(store().importData({ completed: { "a/b": 5 } })).toBe(true);
    expect(store().completed).toEqual({ "a/b": 5 });
  });

  it("reset mengosongkan semua progress", () => {
    store().markComplete("a/b");
    store().toggleBookmark("a/b");
    store().reset();
    expect(store()).toMatchObject(emptyProgress);
  });

  it("menyimpan ke localStorage dan memuat ulang (rehydrate)", async () => {
    store().markComplete("fondasi/cara-kerja-web");
    const saved = JSON.parse(localStorage.getItem(PROGRESS_STORAGE_KEY) ?? "{}");
    expect(saved.state.completed).toHaveProperty("fondasi/cara-kerja-web");
    expect(saved.state).not.toHaveProperty("hydrated");

    useProgress.setState({ ...emptyProgress });
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(saved));
    await useProgress.persist.rehydrate();
    expect(store().completed).toHaveProperty("fondasi/cara-kerja-web");
    expect(store().hydrated).toBe(true);
  });

  it("data localStorage yang rusak tidak membuat aplikasi crash", async () => {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify({ state: { completed: "rusak", bookmarks: 1 } }));
    await useProgress.persist.rehydrate();
    expect(store().completed).toEqual({});
    expect(store().bookmarks).toEqual([]);
  });
});
