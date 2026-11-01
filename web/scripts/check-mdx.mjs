#!/usr/bin/env node
/**
 * Validasi konten MDX tanpa harus menjalankan `next build`.
 *
 *   npm run check:content                 # semua konten
 *   npm run check:content -- content/fondasi   # folder/file tertentu
 *   npm run check:content -- --min-words 600   # tandai file yang terlalu pendek sebagai error
 *
 * Yang dicek:
 *  - MDX bisa di-compile (sintaks JSX, kurung kurawal, dll.)
 *  - Hanya komponen yang terdaftar di mdx-components.tsx yang dipakai
 *  - Tidak ada import/export, tidak ada heading level 1 (#)
 *  - Bahasa code fence dikenali Shiki
 *  - Props komponen interaktif valid (Quiz, Tabs, Flow, Callout, dst.) dengan me-render MDX
 *  - Setiap pelajaran & cheatsheet di registry punya file MDX, dan sebaliknya
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { compile, run } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";
import * as runtime from "react/jsx-runtime";
import { createElement, Fragment, Children, isValidElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { bundledLanguagesInfo } from "shiki";

const ROOT = resolve(fileURLToPath(new URL("..", import.meta.url)));
const CONTENT = join(ROOT, "content");

const args = process.argv.slice(2);
const minWordsIdx = args.indexOf("--min-words");
const MIN_WORDS = minWordsIdx >= 0 ? Number(args[minWordsIdx + 1]) : 0;
const targets = args.filter((a, i) => !a.startsWith("--") && (minWordsIdx < 0 || i !== minWordsIdx + 1));

const COMPONENTS = new Set([
  "Callout", "Steps", "Step", "Tabs", "Tab", "FileTree", "Flow", "Exercise", "Solution", "Quiz",
  "Compare", "CompareItem", "Badge", "Kbd",
  "CrudSimulator", "HttpExplorer", "SqlPlayground", "FlexboxPlayground", "ReactPlayground", "SnackEmbed",
]);
const HTML_OK = new Set(["br", "sup", "sub", "abbr", "mark", "kbd", "details", "summary", "span", "strong", "em", "code", "small"]);
const LANGS = new Set(["plaintext", "text", "txt", "plain", "ansi", ""]);
for (const l of bundledLanguagesInfo) {
  LANGS.add(l.id);
  for (const a of l.aliases ?? []) LANGS.add(a);
}

const CALLOUT_TYPES = new Set(["info", "tip", "warning", "danger", "note", "capstone", "analogi"]);
const COMPARE_TONES = new Set(["good", "bad", "neutral"]);
const DIFFICULTY = new Set(["mudah", "sedang", "sulit"]);
const BADGE_TONES = new Set(["neutral", "primary", "accent", "success", "warning", "danger", "info"]);
const HTTP_METHODS = new Set(["GET", "POST", "PUT", "PATCH", "DELETE"]);

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (p.endsWith(".mdx")) out.push(p);
  }
  return out;
}

function collectFiles() {
  if (targets.length === 0) return walk(CONTENT);
  return targets.flatMap((t) => {
    const p = resolve(ROOT, t);
    if (!existsSync(p)) throw new Error(`Path tidak ditemukan: ${t}`);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

/** Plugin remark: cek struktur statis dan kumpulkan statistik. */
function lintPlugin(report, stats) {
  return () => (tree) => {
    visit(tree, (node) => {
      const line = node.position?.start?.line ?? "?";
      switch (node.type) {
        case "mdxjsEsm":
          report.push(`baris ${line}: import/export tidak diizinkan — semua komponen sudah tersedia global`);
          break;
        case "heading":
          if (node.depth === 1) report.push(`baris ${line}: jangan pakai "# " (h1) — judul halaman sudah dirender otomatis, mulai dari "##"`);
          if (node.depth === 2) stats.h2++;
          break;
        case "code":
          stats.code++;
          if (!LANGS.has((node.lang ?? "").toLowerCase())) report.push(`baris ${line}: bahasa code fence "${node.lang}" tidak dikenal Shiki`);
          break;
        case "mdxJsxFlowElement":
        case "mdxJsxTextElement": {
          const name = node.name;
          if (!name) break;
          if (/^[A-Z]/.test(name)) {
            if (!COMPONENTS.has(name)) {
              report.push(`baris ${line}: komponen <${name}> tidak terdaftar di mdx-components.tsx`);
              stats.unknown.add(name);
            } else stats.components[name] = (stats.components[name] ?? 0) + 1;
            if (name === "Quiz" && node.attributes?.some((a) => a.name === "id")) {
              report.push(`baris ${line}: <Quiz> di pelajaran jangan pakai prop id (skor disimpan per pelajaran)`);
            }
          } else if (!HTML_OK.has(name)) {
            report.push(`baris ${line}: elemen HTML <${name}> sebaiknya diganti markdown/komponen`);
          }
          break;
        }
        case "text":
          stats.words += node.value.split(/\s+/).filter(Boolean).length;
          break;
      }
    });
  };
}

function isStr(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function makeStubs(report) {
  const pass = (tag) =>
    function Stub({ children }) {
      return createElement(tag, null, children);
    };
  const err = (comp, msg) => report.push(`<${comp}>: ${msg}`);

  return {
    Callout({ type = "info", title, children }) {
      if (!CALLOUT_TYPES.has(type)) err("Callout", `type="${type}" tidak valid (${[...CALLOUT_TYPES].join("/")})`);
      if (title !== undefined && typeof title !== "string") err("Callout", "title harus string");
      return createElement("aside", null, children);
    },
    Steps: pass("div"),
    Step({ title, children }) {
      if (!isStr(title)) err("Step", "title wajib diisi");
      return createElement("section", null, children);
    },
    Tabs({ items, children }) {
      const panels = Children.toArray(children).filter(isValidElement);
      if (!Array.isArray(items) || !items.every(isStr)) err("Tabs", "items harus array string");
      else if (items.length !== panels.length) err("Tabs", `jumlah items (${items.length}) ≠ jumlah <Tab> (${panels.length})`);
      if (new Set(items ?? []).size !== (items ?? []).length) err("Tabs", "label items harus unik");
      return createElement("div", null, children);
    },
    Tab: pass("div"),
    FileTree({ tree }) {
      if (!isStr(tree)) err("FileTree", "tree wajib string (pakai template literal {`...`})");
      return null;
    },
    Flow({ nodes, labels }) {
      if (!Array.isArray(nodes) || nodes.length < 2 || !nodes.every(isStr)) err("Flow", "nodes harus array string minimal 2");
      if (labels !== undefined && (!Array.isArray(labels) || labels.length > Math.max(0, (nodes?.length ?? 0) - 1)))
        err("Flow", "labels harus array dengan panjang ≤ nodes.length - 1");
      return null;
    },
    Exercise({ title, difficulty = "sedang", hints = [], children }) {
      if (!isStr(title)) err("Exercise", "title wajib diisi");
      if (!DIFFICULTY.has(difficulty)) err("Exercise", `difficulty="${difficulty}" tidak valid (mudah/sedang/sulit)`);
      if (!Array.isArray(hints) || !hints.every(isStr)) err("Exercise", "hints harus array string");
      return createElement("div", null, children);
    },
    Solution: pass("details"),
    Quiz({ id, questions }) {
      if (id !== undefined && !isStr(id)) err("Quiz", "id harus string");
      if (!Array.isArray(questions) || questions.length === 0) {
        err("Quiz", "questions harus array berisi minimal 1 soal");
        return null;
      }
      questions.forEach((q, i) => {
        const where = `soal #${i + 1}`;
        if (!q || typeof q !== "object") return err("Quiz", `${where} bukan object`);
        if (!isStr(q.q)) err("Quiz", `${where}: q wajib`);
        if (!Array.isArray(q.options) || q.options.length < 2 || !q.options.every(isStr)) err("Quiz", `${where}: options minimal 2 string`);
        else if (new Set(q.options).size !== q.options.length) err("Quiz", `${where}: options duplikat`);
        if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= (q.options?.length ?? 0)) err("Quiz", `${where}: answer harus indeks 0-based yang valid`);
        if (!isStr(q.explain)) err("Quiz", `${where}: explain wajib`);
        if (q.code !== undefined && typeof q.code !== "string") err("Quiz", `${where}: code harus string`);
      });
      return null;
    },
    Compare: pass("div"),
    CompareItem({ title, tone = "neutral", children }) {
      if (!isStr(title)) err("CompareItem", "title wajib");
      if (!COMPARE_TONES.has(tone)) err("CompareItem", `tone="${tone}" tidak valid (good/bad/neutral)`);
      return createElement("div", null, children);
    },
    Badge({ tone = "neutral", children }) {
      if (!BADGE_TONES.has(tone)) err("Badge", `tone="${tone}" tidak valid`);
      return createElement("span", null, children);
    },
    Kbd: pass("kbd"),
    CrudSimulator: () => null,
    FlexboxPlayground: () => null,
    HttpExplorer({ initialMethod = "GET", initialPath = "/api/tasks" }) {
      if (!HTTP_METHODS.has(initialMethod)) err("HttpExplorer", `initialMethod="${initialMethod}" tidak valid`);
      if (typeof initialPath !== "string" || !initialPath.startsWith("/api/")) err("HttpExplorer", "initialPath harus diawali /api/");
      return null;
    },
    SqlPlayground({ initialQuery }) {
      if (initialQuery !== undefined && !isStr(initialQuery)) err("SqlPlayground", "initialQuery harus string");
      return null;
    },
    ReactPlayground({ code, files }) {
      if (code !== undefined && !isStr(code)) err("ReactPlayground", "code harus string");
      if (files !== undefined) {
        if (typeof files !== "object" || !Object.values(files).every((v) => typeof v === "string")) err("ReactPlayground", "files harus Record<string, string>");
        else if (!Object.keys(files).some((k) => /^\/?App\.(js|jsx)$/.test(k))) err("ReactPlayground", 'files wajib punya "/App.js"');
      }
      return null;
    },
    SnackEmbed({ code, dependencies }) {
      if (code !== undefined && !isStr(code)) err("SnackEmbed", "code harus string");
      if (dependencies !== undefined && typeof dependencies !== "string") err("SnackEmbed", 'dependencies harus string, mis. "@tanstack/react-query"');
      if (typeof code === "string" && !/export default/.test(code)) err("SnackEmbed", "code harus punya `export default function App`");
      return null;
    },
    wrapper: ({ children }) => createElement(Fragment, null, children),
  };
}

async function checkFile(file) {
  const src = readFileSync(file, "utf8");
  const report = [];
  const stats = { words: 0, h2: 0, code: 0, components: {}, unknown: new Set() };
  let compiled;
  try {
    compiled = await compile(src, {
      outputFormat: "function-body",
      development: false,
      remarkPlugins: [remarkGfm, lintPlugin(report, stats)],
    });
  } catch (e) {
    const where = e.line ? `baris ${e.line}:${e.column ?? ""} ` : "";
    report.push(`${where}gagal compile: ${e.reason ?? e.message}`);
    return { report, stats };
  }
  try {
    const { default: Content } = await run(String(compiled), { ...runtime, baseUrl: pathToFileURL(file).href });
    const components = makeStubs(report);
    for (const name of stats.unknown) components[name] = () => null;
    renderToStaticMarkup(createElement(Content, { components }));
  } catch (e) {
    report.push(`gagal render: ${e.message}`);
  }
  if (src.trimStart().startsWith("---")) report.push("frontmatter tidak didukung — metadata ada di lib/curriculum.ts");
  return { report, stats };
}

async function checkRegistry() {
  const problems = [];
  const { tracks } = await import(pathToFileURL(join(ROOT, "lib", "curriculum.ts")).href);
  const { cheatsheets } = await import(pathToFileURL(join(ROOT, "lib", "registry.ts")).href);
  const { glossary } = await import(pathToFileURL(join(ROOT, "lib", "glossary.ts")).href);
  const expected = new Set();
  const lessonIds = new Set();
  for (const t of tracks) {
    for (const l of t.lessons) {
      const rel = join(t.slug, `${l.slug}.mdx`);
      expected.add(rel);
      lessonIds.add(`${t.slug}/${l.slug}`);
      if (!existsSync(join(CONTENT, rel))) problems.push(`pelajaran ${t.slug}/${l.slug} tidak punya file content/${rel.split(sep).join("/")}`);
    }
  }
  for (const c of cheatsheets) {
    const rel = join("cheatsheet", `${c.slug}.mdx`);
    expected.add(rel);
    if (!existsSync(join(CONTENT, rel))) problems.push(`cheatsheet ${c.slug} tidak punya file content/cheatsheet/${c.slug}.mdx`);
  }
  for (const f of walk(CONTENT)) {
    const rel = relative(CONTENT, f);
    if (!expected.has(rel)) problems.push(`file yatim (tidak terdaftar di registry): content/${rel.split(sep).join("/")}`);
  }
  const slugs = new Set();
  for (const g of glossary) {
    if (slugs.has(g.slug)) problems.push(`glosarium: slug duplikat "${g.slug}"`);
    slugs.add(g.slug);
    if (g.lesson && !lessonIds.has(g.lesson)) problems.push(`glosarium "${g.slug}": lesson "${g.lesson}" tidak ada di kurikulum`);
  }
  return problems;
}

const files = collectFiles();
let errorCount = 0;
const short = [];
for (const file of files) {
  const { report, stats } = await checkFile(file);
  const rel = relative(ROOT, file).split(sep).join("/");
  if (MIN_WORDS && stats.words < MIN_WORDS) report.push(`terlalu pendek: ${stats.words} kata (< ${MIN_WORDS})`);
  else if (stats.words < 250) short.push(`${rel} (${stats.words} kata)`);
  if ((stats.components.Quiz ?? 0) > 1) report.push(`hanya boleh satu <Quiz> per file (ditemukan ${stats.components.Quiz})`);
  if (report.length) {
    errorCount += report.length;
    console.log(`\n✗ ${rel}`);
    for (const r of report) console.log(`   - ${r}`);
  } else {
    const comps = Object.entries(stats.components).map(([k, v]) => `${k}×${v}`).join(", ");
    console.log(`✓ ${rel}  · ${stats.words} kata · ${stats.h2} bagian · ${stats.code} kode${comps ? ` · ${comps}` : ""}`);
  }
}

if (targets.length === 0) {
  const problems = await checkRegistry();
  if (problems.length) {
    console.log("\n✗ Integritas registry");
    for (const p of problems) console.log(`   - ${p}`);
    errorCount += problems.length;
  }
}

if (short.length) console.log(`\n⚠ ${short.length} file masih pendek/placeholder:\n   ${short.join("\n   ")}`);
console.log(`\n${files.length} file dicek, ${errorCount} masalah.`);
process.exit(errorCount ? 1 : 0);
