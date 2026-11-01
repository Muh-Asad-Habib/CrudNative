import { Fragment } from "react";

/** Render teks sederhana dengan dukungan `kode inline` dan **tebal** (untuk props string seperti kuis & hint). */
export function InlineText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`") && part.length > 1) {
          return (
            <code
              key={i}
              className="rounded bg-surface-2 px-[0.35em] py-[0.1em] font-mono text-[length:max(0.875em,0.75rem)] [overflow-wrap:anywhere] [box-decoration-break:clone] [-webkit-box-decoration-break:clone]"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
          return (
            <strong key={i} className="font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
