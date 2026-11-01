import { ArrowDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Breakpoint = "md" | "lg" | "xl" | "2xl";

/** Kelas horizontal per lebar container (string utuh agar terbaca Tailwind). */
const horizontal: Record<Breakpoint, Record<"ol" | "node" | "arrow" | "down" | "right" | "label", string>> = {
  md: {
    ol: "@md:max-w-none @md:flex-row @md:items-center",
    node: "@md:flex-1",
    arrow: "@md:flex @md:flex-col @md:gap-0.5 @md:px-1 @md:py-0",
    down: "@md:hidden",
    right: "@md:block",
    label: "@md:max-w-32 @md:text-center",
  },
  lg: {
    ol: "@lg:max-w-none @lg:flex-row @lg:items-center",
    node: "@lg:flex-1",
    arrow: "@lg:flex @lg:flex-col @lg:gap-0.5 @lg:px-1 @lg:py-0",
    down: "@lg:hidden",
    right: "@lg:block",
    label: "@lg:max-w-32 @lg:text-center",
  },
  xl: {
    ol: "@xl:max-w-none @xl:flex-row @xl:items-center",
    node: "@xl:flex-1",
    arrow: "@xl:flex @xl:flex-col @xl:gap-0.5 @xl:px-1 @xl:py-0",
    down: "@xl:hidden",
    right: "@xl:block",
    label: "@xl:max-w-32 @xl:text-center",
  },
  "2xl": {
    ol: "@2xl:max-w-none @2xl:flex-row @2xl:items-center",
    node: "@2xl:flex-1",
    arrow: "@2xl:flex @2xl:flex-col @2xl:gap-0.5 @2xl:px-1 @2xl:py-0",
    down: "@2xl:hidden",
    right: "@2xl:block",
    label: "@2xl:max-w-32 @2xl:text-center",
  },
};

const containerWidths: [number, Breakpoint][] = [
  [448, "md"],
  [512, "lg"],
  [576, "xl"],
  [672, "2xl"],
];

/** Perkiraan lebar (px) yang dibutuhkan alur horizontal supaya node tidak terjepit. */
function horizontalWidth(nodes: string[], labels: string[]) {
  const longestWord = (s: string) => Math.max(0, ...s.split(/\s+/).map((w) => w.length));
  const nodeWidth = nodes.reduce((sum, n) => sum + Math.max(104, longestWord(n) * 8.5 + 28), 0);
  const arrowWidth = nodes
    .slice(1)
    .reduce((sum, _, i) => sum + (labels[i] ? Math.min(128, labels[i].length * 7.3) + 8 : 24), 0);
  return nodeWidth + arrowWidth + (nodes.length - 1) * 8;
}

/** Diagram alur: vertikal di layar sempit, horizontal bila lebar kolom cukup untuk semua node. */
export function Flow({ nodes, labels = [], caption }: { nodes: string[]; labels?: string[]; caption?: string }) {
  const needed = horizontalWidth(nodes, labels);
  const bp = containerWidths.find(([width]) => needed <= width)?.[1];
  const h = bp ? horizontal[bp] : null;

  return (
    <figure className="not-prose @container my-7 rounded-md border border-dashed border-border-strong bg-surface/60 p-4 sm:p-5">
      <ol className={cn("mx-auto flex max-w-md flex-col items-stretch gap-1 overflow-x-auto scrollbar-thin", h?.ol)}>
        {nodes.map((node, i) => (
          <li key={i} className="contents">
            <div
              className={cn(
                "rounded-md border border-border-strong bg-card px-3 py-3 text-center text-sm font-semibold break-words text-foreground",
                h?.node,
              )}
            >
              {node}
            </div>
            {i < nodes.length - 1 ? (
              <div
                className={cn(
                  "grid grid-cols-[1fr_auto_1fr] items-center justify-center gap-2 py-1 text-xs text-muted-foreground",
                  h?.arrow,
                )}
              >
                <ArrowDown className={cn("col-start-2 size-4 shrink-0", h?.down)} aria-hidden />
                {h ? <ArrowRight className={cn("hidden size-4", h.right)} aria-hidden /> : null}
                {labels[i] ? (
                  <span className={cn("col-start-3 max-w-56 justify-self-start font-mono text-xs leading-tight break-words", h?.label)}>
                    {labels[i]}
                  </span>
                ) : null}
              </div>
            ) : null}
          </li>
        ))}
      </ol>
      {caption ? <figcaption className="mt-3 text-center font-serif text-sm text-muted-foreground italic">{caption}</figcaption> : null}
    </figure>
  );
}
