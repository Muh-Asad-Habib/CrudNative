"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function CodeBlock({ className, children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    const text = ref.current?.innerText ?? "";
    try {
      await navigator.clipboard.writeText(text.replace(/\n$/, ""));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="group/code relative">
      <pre ref={ref} className={cn("scrollbar-thin", className)} {...props}>
        {children}
      </pre>
      <button
        type="button"
        onClick={copy}
        className={cn(
          "absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 inline-flex size-10 items-center justify-center rounded-md border border-border-strong bg-card text-muted-foreground transition-opacity hover:text-foreground pointer-coarse:size-11",
          "opacity-100 sm:opacity-0 sm:group-hover/code:opacity-100 sm:focus-visible:opacity-100",
          copied && "sm:opacity-100",
        )}
        aria-label={copied ? "Kode tersalin" : "Salin kode"}
      >
        {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Kode tersalin ke clipboard" : ""}
      </span>
    </div>
  );
}
