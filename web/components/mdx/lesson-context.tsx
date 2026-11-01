"use client";

import { createContext, useContext } from "react";

const LessonContext = createContext<{ lessonId: string | null }>({ lessonId: null });

export function LessonProvider({ lessonId, children }: { lessonId: string; children: React.ReactNode }) {
  return <LessonContext.Provider value={{ lessonId }}>{children}</LessonContext.Provider>;
}

export function useLessonId() {
  return useContext(LessonContext).lessonId;
}
