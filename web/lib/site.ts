import type { Metadata } from "next";

/**
 * Identitas situs untuk metadata, sitemap, dan robots.
 *
 * Alamat situs dibaca saat build:
 * - SITE_URL: isi manual kalau memakai domain sendiri atau sub-folder (sertakan base path-nya).
 * - URL: diisi otomatis oleh Netlify dengan alamat utama situs.
 */

export const SITE_NAME = "CRUDNative";

export const SITE_TITLE = "CRUDNative · Belajar bikin aplikasi CRUD dan React Native";

export const SITE_DESCRIPTION =
  "Modul belajar berbahasa Indonesia untuk pemula: dari JavaScript dasar, membuat API dan database, sampai aplikasi HP dengan React Native yang tersambung ke server.";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const origin = (process.env.SITE_URL || process.env.URL || "http://localhost:3001").replace(/\/+$/, "");

/** Alamat lengkap situs tanpa garis miring di akhir, termasuk base path. */
export const SITE_URL = basePath && !origin.endsWith(basePath) ? origin + basePath : origin;

/** Ubah path internal ("/belajar/") jadi URL lengkap. */
export function absoluteUrl(path = "/") {
  return SITE_URL + (path.startsWith("/") ? path : `/${path}`);
}

export const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "CRUDNative: belajar bikin aplikasi CRUD dan React Native dalam bahasa Indonesia",
};

/** Metadata halaman beserta canonical, Open Graph, dan kartu Twitter/X. */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  keywords?: string[];
}): Metadata {
  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: path },
    openGraph: {
      type,
      siteName: SITE_NAME,
      locale: "id_ID",
      title,
      description,
      url: path,
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
  };
}
