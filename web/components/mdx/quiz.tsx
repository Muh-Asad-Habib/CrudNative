"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Check, RotateCcw, X } from "lucide-react";
import { quizVerdict, scoreQuiz, type QuizQuestion } from "@/lib/quiz";
import { useProgress } from "@/lib/progress-store";
import { cn } from "@/lib/utils";
import { ProgressBar } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InlineText } from "./inline-text";
import { useLessonId } from "./lesson-context";

const letters = ["A", "B", "C", "D", "E", "F"];
const pad = (n: number) => String(n).padStart(2, "0");

export function Quiz({
  id,
  title = "Cek pemahaman",
  questions,
}: {
  id?: string;
  title?: string;
  questions: QuizQuestion[];
}) {
  const lessonId = useLessonId();
  const quizId = id ?? lessonId ?? "kuis";
  const recordQuiz = useProgress((s) => s.recordQuiz);
  const best = useProgress((s) => s.quizzes[quizId]);
  const hydrated = useProgress((s) => s.hydrated);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [finished, setFinished] = useState(false);

  const current = questions[index];
  const picked = answers[index];
  const answered = picked !== null && picked !== undefined;
  const result = useMemo(() => scoreQuiz(questions, answers), [questions, answers]);
  const questionRef = useRef<HTMLParagraphElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  // Fokus hanya dipindah setelah aksi pengguna, bukan saat kuis pertama kali tampil.
  const moveFocus = useRef(false);

  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    (finished ? summaryRef : questionRef).current?.focus();
  }, [index, finished]);

  if (!questions.length) return null;

  const choose = (i: number) => {
    if (answered) return;
    setAnswers((a) => a.map((v, k) => (k === index ? i : v)));
  };

  const next = () => {
    moveFocus.current = true;
    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else {
      setFinished(true);
      recordQuiz(quizId, result.correct, result.total);
    }
  };

  const restart = () => {
    moveFocus.current = true;
    setAnswers(questions.map(() => null));
    setIndex(0);
    setFinished(false);
  };

  const isRight = answered && picked === current.answer;

  return (
    <section
      className="my-9 overflow-hidden rounded-md border border-border-strong bg-card shadow-notebook"
      aria-label={`Kuis: ${title}`}
    >
      <header className="flex items-end justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <p className="!my-0 font-mono text-[0.6875rem] leading-5 font-semibold tracking-[0.12em] text-primary uppercase">
            Kuis
          </p>
          <p className="!my-0 font-serif text-[1.0625rem] leading-snug font-semibold text-pretty text-foreground sm:text-lg">
            {title}
          </p>
        </div>
        {hydrated && best ? (
          <p className="!my-0 shrink-0 text-right font-mono text-[0.6875rem] leading-tight text-muted-foreground uppercase">
            Nilai terbaik
            <span className="mt-0.5 block text-sm font-semibold text-foreground normal-case tabular-nums">
              {best.best}/{best.total}
            </span>
          </p>
        ) : null}
      </header>

      {!finished ? (
        <div className="px-4 py-5 sm:px-5">
          <div className="mb-4 flex items-center gap-3">
            <span className="shrink-0 font-mono text-xs font-medium text-muted-foreground tabular-nums">
              Soal {pad(index + 1)}/{pad(questions.length)}
            </span>
            <ProgressBar
              value={((index + (answered ? 1 : 0)) / questions.length) * 100}
              tone="primary"
              label="Progres kuis"
            />
          </div>

          <p
            ref={questionRef}
            tabIndex={-1}
            className="!my-0 flex gap-2 text-[1.0625rem] leading-relaxed font-semibold text-foreground"
          >
            <span className="shrink-0 font-mono text-primary tabular-nums" aria-hidden>
              {index + 1}.
            </span>
            <span className="min-w-0">
              <InlineText text={current.q} />
            </span>
          </p>
          {current.code ? (
            <pre className="mt-3 overflow-x-auto rounded-md border border-code-border bg-code-bg p-3 font-mono text-[13px] leading-relaxed scrollbar-thin">
              <code>{current.code}</code>
            </pre>
          ) : null}

          <div role="group" aria-label="Pilihan jawaban" className="mt-4 grid gap-2">
            {current.options.map((opt, i) => {
              const isPicked = picked === i;
              const isCorrect = i === current.answer;
              const state = !answered ? "idle" : isCorrect ? "correct" : isPicked ? "wrong" : "dim";
              return (
                <button
                  key={i}
                  type="button"
                  aria-pressed={isPicked}
                  // aria-disabled (bukan disabled) supaya fokus keyboard tidak hilang setelah menjawab.
                  aria-disabled={answered || undefined}
                  onClick={() => choose(i)}
                  className={cn(
                    "group/opt flex min-h-12 w-full items-start gap-3 rounded-md border px-3 py-2.5 text-left text-[0.9375rem] leading-snug transition-colors aria-disabled:cursor-default",
                    state === "idle" && "border-border bg-card hover:border-border-strong hover:bg-surface",
                    state === "correct" && "border-success bg-success-soft",
                    state === "wrong" && "border-danger bg-danger-soft",
                    state === "dim" && "border-border bg-card text-muted-foreground",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full border-[1.5px] font-mono text-xs font-semibold",
                      state === "idle" &&
                        "border-border-strong text-muted-foreground group-hover/opt:border-foreground group-hover/opt:text-foreground",
                      state === "correct" && "border-success bg-success text-card",
                      state === "wrong" && "border-danger bg-danger text-card",
                      state === "dim" && "border-border text-muted-foreground",
                    )}
                    aria-hidden
                  >
                    {letters[i]}
                  </span>
                  <span className="min-w-0 flex-1 pt-0.5">
                    <InlineText text={opt} />
                  </span>
                  {state === "correct" || state === "wrong" ? (
                    <span
                      className={cn(
                        "flex shrink-0 items-center gap-1 pt-1 font-mono text-[0.6875rem] font-semibold uppercase",
                        state === "correct" ? "text-success" : "text-danger",
                      )}
                    >
                      {state === "correct" ? (
                        <Check className="size-3.5" aria-hidden />
                      ) : (
                        <X className="size-3.5" aria-hidden />
                      )}
                      <span className="hidden sm:inline">{state === "correct" ? "Jawaban benar" : "Pilihanmu"}</span>
                      <span className="sr-only sm:hidden">{state === "correct" ? "Jawaban benar" : "Pilihanmu"}</span>
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div aria-live="polite">
            {answered ? (
              <div
                className={cn(
                  "mt-4 rounded-r-md border-l-[3px] px-4 py-3 text-sm leading-relaxed animate-fade-in",
                  isRight ? "border-l-success bg-success-soft/70" : "border-l-danger bg-danger-soft/70",
                )}
              >
                <p
                  className={cn(
                    "!my-0 font-mono text-xs font-semibold tracking-[0.08em] uppercase",
                    isRight ? "text-success" : "text-danger",
                  )}
                >
                  {isRight ? "Benar" : `Belum tepat · jawaban yang benar: ${letters[current.answer]}`}
                </p>
                <p className="!mt-1 !mb-0 text-foreground">
                  <InlineText text={current.explain} />
                </p>
              </div>
            ) : null}
          </div>

          <div className="mt-5 flex flex-col sm:flex-row sm:justify-end">
            <Button onClick={next} disabled={!answered} variant="primary">
              {index < questions.length - 1 ? "Soal berikutnya" : "Lihat hasil"}
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </div>
        </div>
      ) : (
        <QuizResultView questions={questions} answers={answers} onRestart={restart} summaryRef={summaryRef} />
      )}
    </section>
  );
}

function QuizResultView({
  questions,
  answers,
  onRestart,
  summaryRef,
}: {
  questions: QuizQuestion[];
  answers: (number | null)[];
  onRestart: () => void;
  summaryRef?: React.Ref<HTMLDivElement>;
}) {
  const r = scoreQuiz(questions, answers);
  const verdict = quizVerdict(r.percent);
  return (
    <div className="px-4 py-6 sm:px-5 animate-fade-in" aria-live="polite">
      <div
        ref={summaryRef}
        tabIndex={-1}
        className="flex flex-wrap items-end gap-x-4 gap-y-1 border-b border-dashed border-border-strong pb-4"
      >
        <p className="!my-0 font-serif text-4xl leading-none font-semibold text-foreground tabular-nums sm:text-5xl">
          {r.correct}
          <span className="text-muted-foreground">/{r.total}</span>
        </p>
        <div className="min-w-0 pb-0.5">
          <p
            className={cn(
              "!my-0 font-mono text-xs font-semibold tracking-[0.1em] uppercase",
              r.passed ? "text-success" : "text-warning",
            )}
          >
            {r.passed ? "Lulus" : "Belum lulus"} · {r.percent}%
          </p>
          <p className="!my-0 font-serif text-xl font-semibold text-foreground">{verdict.title}</p>
        </div>
      </div>
      <p className="!mt-3 !mb-0 max-w-prose text-sm text-muted-foreground">{verdict.message}</p>

      <p className="!mt-5 !mb-2 font-mono text-[0.6875rem] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
        Rekap jawaban
      </p>
      <ol className="!my-0 grid !list-none gap-1.5 !pl-0 text-sm">
        {questions.map((q, i) => {
          const ok = answers[i] === q.answer;
          return (
            <li key={i} className="!my-0 flex items-start gap-2 !pl-0">
              <span className="w-6 shrink-0 pt-px font-mono text-xs text-muted-foreground tabular-nums">{pad(i + 1)}</span>
              {ok ? (
                <Check className="mt-0.5 size-4 shrink-0 text-success" aria-label="Benar" />
              ) : (
                <X className="mt-0.5 size-4 shrink-0 text-danger" aria-label="Salah" />
              )}
              <span className="line-clamp-2 text-muted-foreground">
                <InlineText text={q.q} />
              </span>
            </li>
          );
        })}
      </ol>

      <Button onClick={onRestart} variant="outline" className="mt-6">
        <RotateCcw className="size-4" aria-hidden /> Ulangi kuis
      </Button>
    </div>
  );
}
