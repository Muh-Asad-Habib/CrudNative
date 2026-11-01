import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allLessons, getLesson } from "@/lib/curriculum";
import { pageMetadata } from "@/lib/site";
import { LessonProvider } from "@/components/mdx/lesson-context";
import { LessonHeader, LessonPager } from "@/components/lesson/lesson-header";
import { LessonToc, LessonTocMobile } from "@/components/lesson/lesson-toc";
import { LessonBottomBar, LessonFinishCard, LessonTracker } from "@/components/lesson/lesson-actions";

type Params = { track: string; lesson: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return allLessons.map((l) => ({ track: l.trackSlug, lesson: l.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { track, lesson: slug } = await params;
  const lesson = getLesson(track, slug);
  if (!lesson) return {};
  return pageMetadata({
    title: lesson.title,
    description: lesson.description,
    keywords: lesson.keywords,
    path: lesson.href,
    type: "article",
  });
}

export default async function LessonPage({ params }: { params: Promise<Params> }) {
  const { track, lesson: slug } = await params;
  const lesson = getLesson(track, slug);
  if (!lesson) notFound();

  const { default: Content } = await import(`@/content/${track}/${slug}.mdx`);

  return (
    <div className="mx-auto flex w-full max-w-[1120px] gap-10 px-4 pt-6 pb-28 sm:px-6 sm:pt-10 lg:px-10 lg:pb-16">
      <div className="min-w-0 flex-1 xl:max-w-[44.5rem]">
        <LessonTracker lessonId={lesson.id} />
        <LessonHeader lesson={lesson} />
        <LessonTocMobile />
        <LessonProvider lessonId={lesson.id}>
          <article id="lesson-article" className="prose-lesson">
            <Content />
          </article>
        </LessonProvider>
        <LessonFinishCard lessonId={lesson.id} />
        <LessonPager lessonId={lesson.id} />
      </div>
      <aside className="hidden w-56 shrink-0 xl:block print:hidden">
        <div className="sticky top-[calc(var(--header-h)+2rem)] max-h-[calc(100dvh-var(--header-h)-4rem)] overflow-y-auto scrollbar-thin">
          <LessonToc />
        </div>
      </aside>
      <LessonBottomBar lessonId={lesson.id} />
    </div>
  );
}
