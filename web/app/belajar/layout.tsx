import { CurriculumNav } from "@/components/layout/curriculum-nav";

export default function BelajarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-[1440px]">
      <aside className="sticky top-[var(--header-h)] hidden h-[calc(100dvh-var(--header-h))] w-[288px] shrink-0 overflow-y-auto overscroll-contain border-r border-border px-4 py-6 scrollbar-thin lg:block print:hidden">
        <CurriculumNav />
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
