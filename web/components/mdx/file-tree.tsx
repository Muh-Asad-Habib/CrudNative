import { File, FileCode2, Folder } from "lucide-react";
import { cn } from "@/lib/utils";

interface Row {
  depth: number;
  name: string;
  comment?: string;
  folder: boolean;
  highlight: boolean;
}

export function parseTree(tree: string): Row[] {
  const lines = tree.replace(/\t/g, "  ").split("\n").filter((l) => l.trim().length > 0);
  const indents = lines.map((l) => l.match(/^ */)![0].length);
  const min = Math.min(...indents);
  const unit = indents.map((n) => n - min).filter((n) => n > 0).reduce((a, b) => Math.min(a, b), Infinity);
  const step = Number.isFinite(unit) ? unit : 2;
  return lines.map((line, i) => {
    let body = line.trim();
    let highlight = false;
    if (body.startsWith("* ")) {
      highlight = true;
      body = body.slice(2);
    }
    const hash = body.indexOf(" #");
    const comment = hash >= 0 ? body.slice(hash + 2).trim() : undefined;
    const name = (hash >= 0 ? body.slice(0, hash) : body).trim();
    return { depth: Math.round((indents[i] - min) / step), name, comment, folder: name.endsWith("/"), highlight };
  });
}

const codeExt = /\.(m?[jt]sx?|json|prisma|ya?ml|env.*|sql|css|html|md)$/;

export function FileTree({ tree, title }: { tree: string; title?: string }) {
  const rows = parseTree(tree);
  return (
    <figure className="not-prose my-7 overflow-hidden rounded-md border border-code-border bg-code-bg">
      {title ? (
        <figcaption className="border-b border-dashed border-code-border bg-surface px-4 py-2 font-mono text-xs text-muted-foreground [overflow-wrap:anywhere]">
          <span className="text-accent" aria-hidden>
            ▸{" "}
          </span>
          {title}
        </figcaption>
      ) : null}
      <div
        tabIndex={0}
        className="overflow-x-auto scrollbar-thin scroll-shadow-x [--scroll-shadow-bg:var(--code-bg)] focus-visible:outline-offset-[-2px]"
      >
        <ul className="w-max min-w-full py-3 font-mono text-[13px] leading-7" aria-label={title ?? "Struktur folder"}>
          {rows.map((row, i) => {
            const Icon = row.folder ? Folder : codeExt.test(row.name) ? FileCode2 : File;
            return (
              <li
                key={i}
                className={cn(
                  "flex items-center gap-2 pr-4 whitespace-nowrap",
                  row.highlight && "bg-[color-mix(in_srgb,var(--marker)_38%,transparent)] shadow-[inset_3px_0_0_var(--accent)]",
                )}
                style={{ paddingLeft: `${1 + row.depth * 1.25}rem` }}
              >
                <Icon
                  className={cn("size-4 shrink-0", row.folder ? "text-primary" : "text-subtle-foreground")}
                  aria-hidden
                />
                <span className={row.folder ? "font-semibold" : undefined}>{row.name}</span>
                {row.comment ? <span className="text-subtle-foreground">← {row.comment}</span> : null}
              </li>
            );
          })}
        </ul>
      </div>
    </figure>
  );
}
