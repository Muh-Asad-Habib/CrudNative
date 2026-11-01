export interface QuizQuestion {
  /** Pertanyaan; mendukung `kode inline` dan **tebal**. */
  q: string;
  /** Potongan kode opsional yang ditampilkan di bawah pertanyaan. */
  code?: string;
  options: string[];
  /** Indeks (0-based) jawaban benar. */
  answer: number;
  /** Penjelasan yang muncul setelah menjawab. */
  explain: string;
}

/** ID kuis akhir track yang disimpan di progress store. */
export const trackQuizId = (trackSlug: string) => `track:${trackSlug}`;

export function isValidQuestion(q: QuizQuestion) {
  return (
    typeof q.q === "string" &&
    q.q.trim().length > 0 &&
    Array.isArray(q.options) &&
    q.options.length >= 2 &&
    Number.isInteger(q.answer) &&
    q.answer >= 0 &&
    q.answer < q.options.length &&
    typeof q.explain === "string"
  );
}

/** Hitung skor dari array jawaban (null = belum dijawab). */
export function scoreQuiz(questions: QuizQuestion[], answers: (number | null)[]) {
  const correct = questions.reduce((sum, q, i) => sum + (answers[i] === q.answer ? 1 : 0), 0);
  const total = questions.length;
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100);
  return { correct, total, percent, passed: percent >= 70 };
}

export function quizVerdict(percent: number) {
  if (percent === 100) return { title: "Sempurna!", message: "Semua jawaban benar. Kamu benar-benar paham materi ini." };
  if (percent >= 70) return { title: "Lulus!", message: "Pemahamanmu sudah bagus. Tinjau penjelasan soal yang salah, lalu lanjut." };
  if (percent >= 40)
    return { title: "Hampir!", message: "Baca ulang bagian yang terkait soal yang salah, lalu coba lagi." };
  return { title: "Coba lagi", message: "Tidak apa-apa — ulangi materi pelan-pelan, lalu kerjakan kuis lagi." };
}
