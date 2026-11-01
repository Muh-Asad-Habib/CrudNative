import type { MetadataRoute } from "next";
import { allLessons, tracks } from "@/lib/curriculum";
import { cheatsheets, labs } from "@/lib/registry";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/belajar/",
    ...tracks.flatMap((t) => [`/belajar/${t.slug}/`, `/belajar/${t.slug}/kuis/`]),
    ...allLessons.map((l) => l.href),
    "/lab/",
    ...labs.map((l) => `/lab/${l.slug}/`),
    "/cheatsheet/",
    ...cheatsheets.map((c) => `/cheatsheet/${c.slug}/`),
    "/glosarium/",
  ];
  return paths.map((path) => ({ url: absoluteUrl(path) }));
}
