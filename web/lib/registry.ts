export type LabIconKey = "table" | "send" | "database" | "layout" | "code" | "smartphone";

export interface LabMeta {
  slug: string;
  title: string;
  description: string;
  icon: LabIconKey;
  tags: string[];
  relatedLessons: string[]; // lesson id
}

export const labs: LabMeta[] = [
  {
    slug: "crud-simulator",
    title: "Simulator CRUD",
    description: "Tambah, ubah, dan hapus data lalu lihat request HTTP, query SQL, dan respons JSON yang terjadi di balik layar.",
    icon: "table",
    tags: ["CRUD", "HTTP", "SQL"],
    relatedLessons: ["crud-backend/konsep-crud", "crud-backend/rest-api-http"],
  },
  {
    slug: "http-explorer",
    title: "HTTP Explorer",
    description: "Kirim request GET/POST/PATCH/DELETE ke API tiruan di browser dan pelajari status code serta format error.",
    icon: "send",
    tags: ["REST", "Status Code", "JSON"],
    relatedLessons: ["crud-backend/rest-api-http", "crud-backend/crud-in-memory", "crud-backend/pagination-filter-search"],
  },
  {
    slug: "sql-playground",
    title: "SQL Playground",
    description: "Database SQLite sungguhan yang berjalan di browser. Tulis query dan lihat hasilnya seketika.",
    icon: "database",
    tags: ["SQL", "SQLite", "JOIN"],
    relatedLessons: ["crud-backend/dasar-sql", "crud-backend/relasi-join"],
  },
  {
    slug: "flexbox",
    title: "Flexbox Playground",
    description: "Atur flexDirection, justifyContent, alignItems, dan gap ala React Native, lalu salin StyleSheet-nya.",
    icon: "layout",
    tags: ["React Native", "Flexbox", "Layout"],
    relatedLessons: ["react-native/styling-flexbox"],
  },
  {
    slug: "react-playground",
    title: "React Playground",
    description: "Editor + preview React langsung di browser. Bereksperimen dengan komponen, state, dan hooks.",
    icon: "code",
    tags: ["React", "Hooks", "Sandpack"],
    relatedLessons: ["react-native/dasar-react", "react-native/state-event", "react-native/effect-list-custom-hook"],
  },
  {
    slug: "expo-snack",
    title: "Expo Snack Playground",
    description: "Tulis kode React Native dan jalankan di browser atau langsung di HP-mu lewat Expo Go.",
    icon: "smartphone",
    tags: ["React Native", "Expo", "Snack"],
    relatedLessons: ["react-native/intro-react-native-expo", "react-native/core-components"],
  },
];

export function getLab(slug: string) {
  return labs.find((l) => l.slug === slug);
}

export interface CheatsheetMeta {
  slug: string;
  title: string;
  description: string;
  tags: string[];
}

export const cheatsheets: CheatsheetMeta[] = [
  { slug: "javascript", title: "JavaScript Modern", description: "Sintaks ES6+ yang paling sering dipakai di React & Node.", tags: ["JS", "ES6"] },
  { slug: "http", title: "HTTP & REST", description: "Method, status code, header penting, dan konvensi URL REST.", tags: ["HTTP", "REST"] },
  { slug: "sql", title: "SQL", description: "Query CRUD, filter, JOIN, agregasi, dan index.", tags: ["SQL", "Database"] },
  { slug: "express", title: "Express.js", description: "Routing, middleware, request/response, dan error handling.", tags: ["Node", "Express"] },
  { slug: "prisma", title: "Prisma ORM", description: "Schema, relasi, migrasi, dan query CRUD Prisma Client.", tags: ["Prisma", "ORM"] },
  { slug: "react-native", title: "Komponen React Native", description: "Komponen inti, props penting, dan pola styling.", tags: ["React Native", "UI"] },
  { slug: "expo-router", title: "Expo Router", description: "Struktur folder, layout, navigasi, dan parameter route.", tags: ["Expo", "Navigasi"] },
  { slug: "tanstack-query", title: "TanStack Query", description: "useQuery, useMutation, invalidasi, dan opsi cache.", tags: ["Data", "Cache"] },
];

export function getCheatsheet(slug: string) {
  return cheatsheets.find((c) => c.slug === slug);
}
