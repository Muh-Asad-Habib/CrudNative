export const mainNav = [
  { href: "/belajar/", label: "Kurikulum", match: "/belajar" },
  { href: "/lab/", label: "Lab", match: "/lab" },
  { href: "/cheatsheet/", label: "Cheatsheet", match: "/cheatsheet" },
  { href: "/glosarium/", label: "Glosarium", match: "/glosarium" },
  { href: "/progres/", label: "Progres", match: "/progres" },
] as const;

export function isActivePath(pathname: string, match: string) {
  return pathname === match || pathname.startsWith(`${match}/`);
}
