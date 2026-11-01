"use client";

import { CrudSimulator, FlexboxPlayground, HttpExplorer, ReactPlayground, SnackEmbed, SqlPlayground } from "./lazy";
import { LabFrameProvider } from "./lab-shell";
import { labNumber } from "./lab-sheet";

function pick(slug: string) {
  switch (slug) {
    case "crud-simulator":
      return <CrudSimulator />;
    case "http-explorer":
      return <HttpExplorer />;
    case "sql-playground":
      return <SqlPlayground />;
    case "flexbox":
      return <FlexboxPlayground />;
    case "react-playground":
      return <ReactPlayground autoLoad height={480} />;
    case "expo-snack":
      return <SnackEmbed height={600} />;
    default:
      return null;
  }
}

/** Render lab berdasarkan slug registry (dipakai halaman /lab/[slug]). */
export function LabRenderer({ slug }: { slug: string }) {
  const lab = pick(slug);
  const n = labNumber(slug);
  if (!lab || !n) return lab;
  return <LabFrameProvider number={n}>{lab}</LabFrameProvider>;
}
