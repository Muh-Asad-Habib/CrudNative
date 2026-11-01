"use client";

import dynamic from "next/dynamic";
import { LabSkeleton } from "./lab-shell";

export const CrudSimulator = dynamic(() => import("./crud-simulator"), {
  ssr: false,
  loading: () => <LabSkeleton label="Menyiapkan Simulator CRUD…"   height={560} />,
});

export const HttpExplorer = dynamic(() => import("./http-explorer"), {
  ssr: false,
  loading: () => <LabSkeleton label="Memuat HTTP Explorer…" height={480} />,
});

export const SqlPlayground = dynamic(() => import("./sql-playground"), {
  ssr: false,
  loading: () => <LabSkeleton label="Memuat SQL Playground…" height={460} />,
});

export const FlexboxPlayground = dynamic(() => import("./flexbox-playground"), {
  ssr: false,
  loading: () => <LabSkeleton label="Memuat Flexbox Playground…" height={560} />,
});

export const ReactPlayground = dynamic(() => import("./react-playground"), {
  ssr: false,
  loading: () => <LabSkeleton label="Memuat React Playground…" height={300} />,
});

export const SnackEmbed = dynamic(() => import("./snack-embed"), {
  ssr: false,
  loading: () => <LabSkeleton label="Memuat Expo Snack…" height={300} />,
});
