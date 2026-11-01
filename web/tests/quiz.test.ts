import { describe, expect, it } from "vitest";
import { tracks } from "@/lib/curriculum";
import { isValidQuestion, quizVerdict, scoreQuiz, trackQuizId, type QuizQuestion } from "@/lib/quiz";
import { trackQuizzes } from "@/content/quiz";

const q = (answer: number, options = ["a", "b", "c", "d"]): QuizQuestion => ({
  q: "Pertanyaan?",
  options,
  answer,
  explain: "Penjelasan",
});

describe("isValidQuestion", () => {
  it("menerima soal yang valid", () => {
    expect(isValidQuestion(q(0))).toBe(true);
    expect(isValidQuestion(q(3))).toBe(true);
  });

  it("menolak jawaban di luar rentang, bukan integer, atau opsi terlalu sedikit", () => {
    expect(isValidQuestion(q(4))).toBe(false);
    expect(isValidQuestion(q(-1))).toBe(false);
    expect(isValidQuestion(q(1.5))).toBe(false);
    expect(isValidQuestion(q(0, ["satu"]))).toBe(false);
    expect(isValidQuestion({ ...q(0), q: "   " })).toBe(false);
  });
});

describe("scoreQuiz", () => {
  const questions = [q(0), q(1), q(2), q(3)];

  it("menghitung jawaban benar, persen, dan status lulus (≥ 70%)", () => {
    expect(scoreQuiz(questions, [0, 1, 2, 3])).toEqual({ correct: 4, total: 4, percent: 100, passed: true });
    expect(scoreQuiz(questions, [0, 1, 2, 0])).toEqual({ correct: 3, total: 4, percent: 75, passed: true });
    expect(scoreQuiz(questions, [0, 1, null, null])).toEqual({ correct: 2, total: 4, percent: 50, passed: false });
  });

  it("aman untuk kuis kosong dan jawaban yang kurang", () => {
    expect(scoreQuiz([], [])).toEqual({ correct: 0, total: 0, percent: 0, passed: false });
    expect(scoreQuiz(questions, []).correct).toBe(0);
  });

  it("membulatkan persen", () => {
    expect(scoreQuiz([q(0), q(0), q(0)], [0, 1, 1]).percent).toBe(33);
    expect(scoreQuiz([q(0), q(0), q(0)], [0, 0, 1]).percent).toBe(67);
  });
});

describe("quizVerdict", () => {
  it("memberi verdict sesuai ambang", () => {
    expect(quizVerdict(100).title).toBe("Sempurna!");
    expect(quizVerdict(70).title).toBe("Lulus!");
    expect(quizVerdict(99).title).toBe("Lulus!");
    expect(quizVerdict(40).title).toBe("Hampir!");
    expect(quizVerdict(39).title).toBe("Coba lagi");
    expect(quizVerdict(0).title).toBe("Coba lagi");
  });
});

describe("kuis akhir track", () => {
  it("setiap track punya kuis dengan ID yang konsisten", () => {
    expect(Object.keys(trackQuizzes).sort()).toEqual(tracks.map((t) => t.slug).sort());
    expect(trackQuizId("fondasi")).toBe("track:fondasi");
  });

  it.each(Object.entries(trackQuizzes))("kuis %s valid dan tidak ada soal ganda", (_slug, questions) => {
    expect(questions.length).toBeGreaterThanOrEqual(2);
    for (const question of questions) expect(isValidQuestion(question), question.q).toBe(true);
    const texts = questions.map((x) => x.q.trim());
    expect(new Set(texts).size).toBe(texts.length);
  });
});
