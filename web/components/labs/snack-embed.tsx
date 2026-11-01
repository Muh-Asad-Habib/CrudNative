"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ExternalLink, Play, Smartphone } from "lucide-react";
import { useResolvedTheme } from "@/lib/theme";
import { buttonClass } from "@/components/ui/button";
import { CodePeek, LabShell, labActionClass } from "./lab-shell";

const SNACK_ORIGIN = "https://snack.expo.dev";

const DEFAULT_CODE = `import { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Halo, React Native!</Text>
      <Pressable style={styles.button} onPress={() => setCount(count + 1)}>
        <Text style={styles.buttonText}>Ditekan {count} kali</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
  title: { fontSize: 22, fontWeight: '700' },
  button: { backgroundColor: '#4f46e5', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  buttonText: { color: 'white', fontWeight: '600' },
});
`;

export function snackUrl(code: string, name: string, dependencies?: string) {
  const params = new URLSearchParams({ code, name, platform: "web" });
  if (dependencies) params.set("dependencies", dependencies);
  return `${SNACK_ORIGIN}/?${params.toString()}`;
}

export default function SnackEmbed({
  code = DEFAULT_CODE,
  name = "Belajar React Native",
  dependencies,
  height = 520,
}: {
  code?: string;
  name?: string;
  dependencies?: string;
  height?: number;
}) {
  const [loaded, setLoaded] = useState(false);
  const theme = useResolvedTheme();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeId = "snack-" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const trimmed = code.trim() + "\n";

  useEffect(() => {
    if (!loaded) return;
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== SNACK_ORIGIN) return;
      const data = event.data as unknown;
      if (!Array.isArray(data) || data[0] !== "expoFrameLoaded" || data[1]?.iframeId !== iframeId) return;
      iframeRef.current?.contentWindow?.postMessage(
        [
          "expoDataEvent",
          { iframeId, name, code: trimmed, ...(dependencies ? { dependencies } : {}) },
        ],
        SNACK_ORIGIN,
      );
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [loaded, iframeId, name, dependencies, trimmed]);

  const src = `${SNACK_ORIGIN}/embedded?${new URLSearchParams({
    iframeId,
    preview: "true",
    platform: "web",
    supportedPlatforms: "web,android,ios",
    theme,
    waitForData: "true",
  }).toString()}`;

  return (
    <LabShell
      title={name}
      subtitle="Expo Snack menjalankan React Native di browser. Bisa juga dibuka di HP lewat aplikasi Expo Go."
      icon={<Smartphone aria-hidden />}
      actions={
        <a href={snackUrl(trimmed, name, dependencies)} target="_blank" rel="noreferrer" className={labActionClass}>
          Buka di Snack <ExternalLink aria-hidden />
        </a>
      }
    >
      {loaded ? (
        <div
          className="min-w-0 [--snack-cur:min(var(--snack-h),max(320px,70dvh))] md:[--snack-cur:var(--snack-h)]"
          style={{ "--snack-h": `${height}px` } as React.CSSProperties}
        >
          <iframe
            ref={iframeRef}
            key={theme}
            src={src}
            title={`Expo Snack: ${name}`}
            className="block h-(--snack-cur) w-full max-w-full border-0 bg-surface"
            allow="clipboard-write"
            sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
          />
          <p className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 border-t border-border-strong bg-surface px-3 py-1 text-xs text-pretty text-muted-foreground sm:px-4">
            <span>Snack tidak muncul atau terlalu sempit?</span>
            <a
              href={snackUrl(trimmed, name, dependencies)}
              target="_blank"
              rel="noreferrer"
              className="-mr-2 inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 font-semibold text-primary underline-offset-4 hover:underline"
            >
              Buka di tab baru <ExternalLink className="size-3.5" aria-hidden />
            </a>
          </p>
        </div>
      ) : (
        <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 bg-surface p-4 text-center sm:p-6">
          <CodePeek code={trimmed} className="max-w-lg" />
          <button type="button" onClick={() => setLoaded(true)} className={buttonClass("primary", "md", "px-5")}>
            <Play aria-hidden /> Jalankan di Expo Snack
          </button>
          <p className="text-xs text-pretty text-muted-foreground">Perlu internet. Snack dimuat dari snack.expo.dev.</p>
        </div>
      )}
    </LabShell>
  );
}
