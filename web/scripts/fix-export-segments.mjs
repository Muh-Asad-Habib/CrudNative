#!/usr/bin/env node
/**
 * Merapikan file prefetch segmen hasil `next build` (output: "export") di Windows.
 *
 * Next.js 16 menulis file segmen dengan nama datar, misalnya
 *   out/belajar/fondasi/x/__next.belajar.$d$track.$d$lesson.__PAGE__.txt
 * Di Windows, path segmennya memakai backslash sehingga file tersebut malah jadi
 * folder bertingkat (__next.belajar\$d$track\$d$lesson\__PAGE__.txt) dan browser
 * mendapat 404 saat prefetch link. Skrip ini meratakan kembali folder itu.
 * Di Linux/macOS tidak ada folder `__next.*`, jadi skrip ini tidak mengubah apa pun.
 */
import { existsSync, readdirSync, renameSync, rmSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = resolve(fileURLToPath(new URL("..", import.meta.url)), "out");

function filesIn(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? filesIn(join(dir, e.name)) : [join(dir, e.name)],
  );
}

let moved = 0;
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = join(dir, entry.name);
    if (!entry.name.startsWith("__next.")) {
      walk(full);
      continue;
    }
    for (const file of filesIn(full)) {
      const flatName = `${entry.name}.${relative(full, file).split(sep).join(".")}`;
      renameSync(file, join(dir, flatName));
      moved++;
    }
    rmSync(full, { recursive: true, force: true });
  }
}

if (existsSync(outDir)) {
  walk(outDir);
  console.log(`fix-export-segments: ${moved} file segmen dirapikan`);
}
