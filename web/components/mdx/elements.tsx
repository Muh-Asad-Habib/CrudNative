import Link from "next/link";
import { ExternalLink, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

type HeadingProps = React.HTMLAttributes<HTMLHeadingElement>;

function makeHeading(Tag: "h2" | "h3" | "h4") {
  function Heading({ id, children, className, ...props }: HeadingProps) {
    return (
      <Tag id={id} className={cn("group/h relative scroll-mt-24", className)} {...props}>
        {children}
        {id ? (
          <a
            href={`#${id}`}
            className="ml-1 inline-flex size-6 translate-y-[-1px] items-center justify-center rounded-md align-middle text-subtle-foreground no-underline opacity-0 transition-opacity group-hover/h:opacity-100 focus-visible:opacity-100"
            aria-label="Tautan ke bagian ini"
          >
            <Link2 className="size-4" aria-hidden />
          </a>
        ) : null}
      </Tag>
    );
  }
  Heading.displayName = `Mdx${Tag.toUpperCase()}`;
  return Heading;
}

export const H2 = makeHeading("h2");
export const H3 = makeHeading("h3");
export const H4 = makeHeading("h4");

export function MdxLink({ href = "", children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }
  if (href.startsWith("#")) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }
  return (
    <a href={href} target="_blank" rel="noreferrer noopener" {...props}>
      {children}
      <ExternalLink className="ml-0.5 inline size-3.5 -translate-y-px align-middle opacity-60" aria-hidden />
    </a>
  );
}

export function MdxTable(props: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div
      role="region"
      aria-label="Tabel (geser ke samping bila terpotong)"
      tabIndex={0}
      className="my-7 overflow-x-auto rounded-md border border-border scrollbar-thin scroll-shadow-x"
    >
      <table {...props} />
    </div>
  );
}
