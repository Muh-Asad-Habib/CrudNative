import type { QuizQuestion } from "@/lib/quiz";
import fondasi from "./fondasi";
import crudBackend from "./crud-backend";
import reactNative from "./react-native";
import fullstack from "./fullstack";
import expert from "./expert";

/** Kuis akhir per track (kunci = slug track). */
export const trackQuizzes: Record<string, QuizQuestion[]> = {
  fondasi,
  "crud-backend": crudBackend,
  "react-native": reactNative,
  fullstack,
  expert,
};