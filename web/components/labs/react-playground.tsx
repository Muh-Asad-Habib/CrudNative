"use client";

import { useState } from "react";
import { Code2, Play } from "lucide-react";
import { SandpackCodeEditor, SandpackLayout, SandpackPreview, SandpackProvider } from "@codesandbox/sandpack-react";
import { useResolvedTheme } from "@/lib/theme";
import { buttonClass } from "@/components/ui/button";
import { CodePeek, LabShell } from "./lab-shell";

const DEFAULT_CODE = `import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div style={{ fontFamily: "system-ui", padding: 24 }}>
      <h1>Halo, React!</h1>
      <button onClick={() => setCount(count + 1)}>Diklik {count} kali</button>
    </div>
  );
}
`;

export default function ReactPlayground({
  code,
  files,
  title = "React Playground",
  height = 420,
  autoLoad = false,
}: {
  code?: string;
  files?: Record<string, string>;
  title?: string;
  height?: number;
  autoLoad?: boolean;
}) {
  const [loaded, setLoaded] = useState(autoLoad);
  const resolved = useResolvedTheme();
  const sandpackFiles = files ?? { "/App.js": (code ?? DEFAULT_CODE).trim() + "\n" };

  return (
    <LabShell
      title={title}
      subtitle="Ubah kodenya di editor, hasilnya langsung tampil di pratinjau. Kalau rusak, muat ulang halaman saja."
      icon={<Code2 aria-hidden />}
    >
      {loaded ? (
        <div
          className="sandpack-wrap min-w-0 [--pg-cur:min(var(--pg-h),max(260px,45dvh))] min-[769px]:[--pg-cur:var(--pg-h)]"
          style={{ "--pg-h": `${height}px` } as React.CSSProperties}
        >
          <SandpackProvider template="react" files={sandpackFiles} theme={resolved === "dark" ? "dark" : "light"}>
            {/* Sandpack stacks editor/preview at <=768px; 16px code on phones avoids iOS zoom-on-focus. */}
            <SandpackLayout className="[--sp-font-lineHeight:24px] [--sp-font-size:16px] [font-size:var(--sp-font-size)] sm:[--sp-font-lineHeight:22px] sm:[--sp-font-size:14px] [&_.cm-gutter.cm-lineNumbers]:text-[12px]!">
              <SandpackCodeEditor
                showLineNumbers
                showTabs={Object.keys(sandpackFiles).length > 1}
                style={{ height: "var(--pg-cur)" }}
                wrapContent
              />
              <SandpackPreview style={{ height: "var(--pg-cur)" }} showOpenInCodeSandbox={false} />
            </SandpackLayout>
          </SandpackProvider>
        </div>
      ) : (
        <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 bg-surface p-4 text-center sm:p-6">
          <CodePeek code={Object.values(sandpackFiles)[0] ?? ""} className="max-w-lg" />
          <button type="button" onClick={() => setLoaded(true)} className={buttonClass("primary", "md", "px-5")}>
            <Play aria-hidden /> Buka editor interaktif
          </button>
          <p className="text-xs text-pretty text-muted-foreground">Editor baru dimuat setelah diklik, supaya halaman tetap ringan.</p>
        </div>
      )}
    </LabShell>
  );
}
