export function Steps({ children }: { children: React.ReactNode }) {
  return <div className="steps my-8 [counter-reset:step]">{children}</div>;
}

export function Step({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <section className="relative pb-7 pl-11 [counter-increment:step] last:pb-0 before:absolute before:top-0 before:left-0 before:flex before:size-8 before:items-center before:justify-center before:rounded-full before:border-[1.5px] before:border-primary before:bg-card before:font-mono before:text-[0.8125rem] before:font-semibold before:text-primary before:content-[counter(step)] after:absolute after:top-10 after:bottom-2 after:left-[15.5px] after:border-l after:border-dashed after:border-border-strong last:after:hidden sm:pl-12">
      <h3 className="!mt-0 !mb-2 pt-[0.1875rem] font-serif text-[1.0625rem] leading-snug font-semibold sm:text-[1.125rem]">{title}</h3>
      <div className="[&>:first-child]:mt-0 [&>:last-child]:mb-0">{children}</div>
    </section>
  );
}
