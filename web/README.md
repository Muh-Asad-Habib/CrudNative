# web: Situs Belajar CRUD & React Native

Situs statis (Next.js 16 `output: "export"`) berisi materi MDX, kuis, lab interaktif, cheatsheet, glosarium, dan pelacak progres (disimpan di `localStorage`). Tampilan responsif untuk HP dan laptop, mendukung mode gelap.

## Menjalankan

```powershell
npm install
npm run dev        # http://localhost:3000 (pakai `npm run dev -- -p 3001` jika API pendamping memakai 3000)
npm run build      # hasil statis di folder out/
npm start          # menyajikan out/ dengan `serve`
```

Deploy ke Netlify sudah diatur lewat [`netlify.toml`](../netlify.toml) di root repo. Deploy ke sub-folder (mis. GitHub Pages): set `BASE_PATH=/nama-repo` dan `SITE_URL=https://akun.github.io/nama-repo` sebelum `npm run build`.

Alamat situs untuk canonical, Open Graph, `sitemap.xml`, dan `robots.txt` diambil dari `SITE_URL`. Di Netlify variabel `URL` terisi otomatis, jadi `SITE_URL` cukup diisi kalau kamu memakai domain sendiri.

## Struktur

| Path | Isi |
| --- | --- |
| `app/` | Halaman: beranda, `/belajar/[track]/[lesson]`, `/belajar/[track]/kuis`, `/lab/[slug]`, `/cheatsheet/[slug]`, `/glosarium`, `/progres`, plus `sitemap.ts`, `robots.ts`, `manifest.ts`, dan ikon |
| `lib/site.ts` | Nama, deskripsi, dan alamat situs; helper `pageMetadata()` untuk canonical dan Open Graph |
| `content/<track>/*.mdx` | Materi pelajaran per jalur (`fondasi`, `crud-backend`, `react-native`, `fullstack`, `expert`) |
| `content/cheatsheet/*.mdx` | Cheatsheet |
| `content/quiz/*.ts` | Bank soal kuis per jalur |
| `lib/curriculum.ts` | Sumber kebenaran urutan jalur, pelajaran, durasi, dan tujuan belajar |
| `lib/glossary.ts` | Daftar istilah glosarium |
| `components/labs/` | Lab interaktif: SQL Playground (sql.js), HTTP Explorer, CRUD Simulator, Flexbox Playground, React Playground (Sandpack), Snack Embed |
| `mdx-components.tsx` | Komponen yang bisa dipakai di MDX (Callout, Steps, Tabs, Quiz, Exercise, FileTree, dll.) |
| `scripts/check-mdx.mjs` | Validator konten MDX |
| `scripts/fix-export-segments.mjs` | Dijalankan otomatis setelah `npm run build` (`postbuild`): merapikan file prefetch `__next.*.txt` yang jadi folder bertingkat saat build di Windows |
| `tests/` | Tes Vitest (komponen, store progres, integritas konten) |

Aturan menulis materi ada di [`CONTENT_GUIDE.md`](CONTENT_GUIDE.md).

## Pengecekan

```powershell
npm run typecheck
npm run lint
npm test
npm run check:content -- content\fondasi\selamat-datang.mdx   # validasi satu file
npm run build
```
