# Panduan Menulis Konten

Panduan ini wajib diikuti saat menulis/menyunting materi di `content/`. Tujuannya: semua pelajaran terasa
ditulis oleh satu mentor yang sama, konsisten, akurat, dan lolos `npm run check:content`.

## 1. Pembaca & gaya bahasa

- **Pembaca**: mahasiswa/pemula Indonesia. Fondasi mengasumsikan nol pengalaman; tiap track berikutnya
  boleh mengandalkan track sebelumnya (sebut & tautkan pelajaran prasyarat bila perlu).
- **Bahasa**: Bahasa Indonesia baku-santai, sapaan **"kamu"**, kalimat aktif & pendek. Istilah teknis tetap
  dalam bahasa Inggris (endpoint, state, props, middleware), dijelaskan saat pertama muncul.
- **Nada**: mentor yang sabar & antusias, bukan buku teks kaku. Jelaskan **kenapa** sebelum **bagaimana**.
- **Mudah dipahami dulu, lengkap kemudian**: satu kalimat = satu ide; hindari kalimat bertingkat dan istilah
  bertumpuk. Tiap konsep baru dibuka dengan **contoh kehidupan sehari-hari** (warung, ojek online, perpustakaan
  kampus, antre di bank, buku catatan, grup WhatsApp) memakai `<Callout type="analogi">`, lalu baru istilah
  teknisnya. Sebut juga di mana analoginya tidak cocok bila bisa menyesatkan.
- Jangan pakai emoji di judul. Emoji di teks boleh, sangat hemat.
- **Akurat & mutakhir**: Node 22+, Express 5, Prisma 7 (driver adapter + `prisma.config.ts`), Zod 4,
  Expo SDK 58 + Expo Router, React 19, TanStack Query 5. Jika ragu soal API, cek dokumentasi resmi versi
  tersebut (Expo: `https://docs.expo.dev/versions/v58.0.0/...`). Jangan mengarang API.

## 2. Struktur file pelajaran

Lokasi: `content/<trackSlug>/<lessonSlug>.mdx` (slug dari `lib/curriculum.ts`, jangan ubah registry).

Judul, deskripsi, level, durasi, dan **tujuan belajar sudah dirender otomatis** oleh `LessonHeader` dari
`lib/curriculum.ts`. Jadi **jangan** menulis ulang judul (h1) atau daftar tujuan di MDX.

Kerangka standar (sesuaikan, tapi urutan ini dianjurkan):

```mdx
## Pengantar
Hook singkat: masalah nyata yang diselesaikan materi ini + kaitannya dengan capstone.

## <Konsep 1>
Penjelasan → contoh kode kecil → (opsional) diagram <Flow> / <Compare> / lab interaktif.

### <Sub-bagian bila perlu>

## <Konsep 2 / Praktik langkah demi langkah>
<Steps> … </Steps>

## Kesalahan umum
<Callout type="warning"> … </Callout>

## Latihan
<Exercise …> … <Solution> … </Solution></Exercise>   (1–3 latihan)

## Uji pemahaman
<Quiz questions={[…]} />   (tepat SATU Quiz per pelajaran, 3–5 soal)

## Ringkasan
Poin-poin inti (4–7 bullet).

<Callout type="capstone" title="Langkah capstone"> … </Callout>   (jika relevan)
```

Panjang: pelajaran 10 menit ±500 kata prosa; 20–35 menit **900–1.800 kata**; 40–55 menit **1.400–2.400 kata**;
capstone ≥ 2.000 kata. (Kode tidak dihitung sebagai kata.) Minimal 4 bagian `##`.

## 3. Aturan wajib MDX (dicek otomatis)

- **Tanpa frontmatter**, **tanpa `# ` (h1)** — mulai dari `##`. Hierarki: `##` → `###` → `####`.
- **Tanpa `import`/`export`**. Semua komponen sudah tersedia global (lihat §4).
- Hanya komponen yang terdaftar di §4. Elemen HTML mentah dihindari (pakai markdown).
- Bahasa code fence harus dikenali Shiki: `js`, `jsx`, `ts`, `tsx`, `json`, `bash`, `sql`, `prisma`,
  `http`, `dotenv`, `yaml`, `txt`, `diff`, `powershell`, `html`, `css`.
- **Jebakan sintaks MDX**:
  - `{` dan `}` di teks biasa dianggap ekspresi JS → tulis di dalam `inline code` atau escape `\{`.
  - `<` diikuti huruf di teks dianggap tag JSX → tulis `` `<View>` `` atau "lebih kecil dari".
  - Komentar HTML `<!-- -->` tidak boleh; pakai `{/* komentar */}`.
  - Isi markdown di dalam komponen (Tab, Step, Solution, Callout, Exercise, CompareItem) **harus dipisah
    baris kosong** dari tag pembuka/penutup dan **tidak diindentasi**.
  - Prop string panjang berisi kode → template literal: `` code={`...`} ``. Di dalamnya escape backtick
    menjadi `` \` `` dan `${` menjadi `\${`. Tulis kode rata kiri (tanpa indentasi tambahan).

## 4. Referensi komponen

### Callout
```mdx
<Callout type="tip" title="Opsional">

Isi **markdown** biasa.

</Callout>
```
`type`: `info` | `tip` | `warning` | `danger` | `note` | `capstone` | `analogi`. Gunakan `capstone` untuk langkah
proyek akhir "Aplikasi Tugas & Catatan Kuliah". Gunakan `analogi` (label otomatis "Contoh sehari-hari") untuk
perumpamaan dari kehidupan sehari-hari sebelum/ sesudah konsep teknis dijelaskan.

### Steps / Step
````mdx
<Steps>
<Step title="Buat folder proyek">

```bash
mkdir belajar-api
```

</Step>
<Step title="Instal Express">

…

</Step>
</Steps>
````

### Tabs / Tab
Jumlah `items` **harus sama** dengan jumlah `<Tab>`.
```mdx
<Tabs items={["npm", "Windows (PowerShell)"]}>
<Tab>

…

</Tab>
<Tab>

…

</Tab>
</Tabs>
```

### FileTree
String berindentasi; akhiran `/` = folder; awalan `* ` = disorot; ` # ...` = komentar.
```mdx
<FileTree title="belajar-api" tree={`
src/
  * app.js # titik masuk Express
  routes/
    tasks.js
package.json
`} />
```

### Flow (diagram alur horizontal/vertikal responsif)
```mdx
<Flow nodes={["Aplikasi HP", "Express API", "Prisma", "SQLite"]} labels={["HTTP + JSON", "method JS", "SQL"]} caption="Alur satu request" />
```
`labels.length` harus `nodes.length - 1` (opsional).

### Compare / CompareItem
```mdx
<Compare>
<CompareItem title="Hindari" tone="bad">

…

</CompareItem>
<CompareItem title="Lebih baik" tone="good">

…

</CompareItem>
</Compare>
```
`tone`: `good` | `bad` | `neutral`.

### Exercise / Solution
````mdx
<Exercise title="Filter tugas yang belum selesai" difficulty="mudah" hints={["Gunakan `filter`.", "Cek properti `done`."]}>

Instruksi latihan + kode awal.

<Solution>

```js
const belum = tasks.filter((t) => !t.done);
```

Penjelasan singkat solusi.

</Solution>
</Exercise>
````
`difficulty`: `mudah` | `sedang` | `sulit`. `hints` (opsional) mendukung `inline code` dengan backtick.

### Quiz
Tepat **satu** per pelajaran, **tanpa** prop `id` (skor otomatis disimpan per pelajaran).
```mdx
<Quiz questions={[
  {
    q: "Method HTTP untuk membuat data baru adalah…",
    options: ["GET", "POST", "PUT", "DELETE"],
    answer: 1,
    explain: "POST dipakai untuk membuat resource baru dan biasanya dibalas 201 Created.",
  },
  {
    q: "Apa output kode berikut?",
    code: "console.log([1, 2, 3].map((n) => n * 2));",
    options: ["`[1, 2, 3]`", "`[2, 4, 6]`", "`6`", "Error"],
    answer: 1,
    explain: "`map` membuat array baru dari hasil fungsi untuk tiap elemen.",
  },
]} />
```
`answer` = indeks 0-based. `options` ≥ 2 & unik. `explain` wajib (jelaskan kenapa benar & kenapa pengecoh salah).
Variasikan posisi jawaban benar. Teks mendukung `inline code`.

### Badge & Kbd
`<Badge tone="success">Baru</Badge>` (tone: neutral/primary/accent/success/warning/danger/info),
`<Kbd>Ctrl</Kbd> + <Kbd>C</Kbd>`.

### Lab interaktif (dimuat malas, aman disisipkan)
| Komponen | Props | Kapan dipakai |
| --- | --- | --- |
| `<CrudSimulator />` | – | Konsep CRUD ↔ HTTP ↔ SQL |
| `<HttpExplorer initialMethod="POST" initialPath="/api/tasks" />` | method: GET/POST/PUT/PATCH/DELETE | REST, status code, pagination |
| `<SqlPlayground initialQuery="SELECT * FROM tasks;" />` | `initialQuery?` | SQL, JOIN |
| `<FlexboxPlayground />` | – | Styling & Flexbox RN |
| `<ReactPlayground code={`...`} title="..." />` | `code?`, `files?` (kunci wajib ada `"/App.js"`), `title?`, `height?` | React **web** (div, button). Bukan RN! |
| `<SnackEmbed code={`...`} name="..." dependencies="expo-haptics" />` | `code` wajib berisi `export default`; `dependencies?` dipisah koma | Kode **React Native** satu file `App.js` |

**Data lab yang tersedia** (pakai nilai ini di instruksi agar cocok):
- *HttpExplorer* (API tiruan in-memory): `GET /api/health`, `GET|POST /api/tasks`,
  `GET|PUT|PATCH|DELETE /api/tasks/:id`. Query list: `page`, `limit` (≤ 50), `done=true|false`, `q`.
  Task: `{ id, title, done, priority: "rendah"|"sedang"|"tinggi", createdAt, updatedAt }`.
  Respons list `{ data, meta: { page, limit, total, totalPages } }`, detail `{ data }`,
  error `{ error: { message, code, details? } }` (`VALIDATION_ERROR` 400, `NOT_FOUND` 404,
  `ROUTE_NOT_FOUND` 404, `METHOD_NOT_ALLOWED` 405). PUT wajib menyertakan `title` dan `done`.
- *SqlPlayground* (SQLite): tabel `users(id, name, email, created_at)`,
  `courses(id, user_id, name, lecturer, sks)`, `tasks(id, course_id, user_id, title, done 0/1,
  priority 'rendah'|'sedang'|'tinggi', due_date)`. Isi: 3 user (Andi, Sari, Budi), 5 courses
  (Basis Data, Pemrograman Mobile, …), 8 tasks (satu tanpa course, satu tanpa due_date).

### Code block
Fence dengan meta rehype-pretty-code:
````mdx
```js title="src/app.js" {3,5-6} showLineNumbers
// kode
```
````
- `title="..."` = nama file (sangat dianjurkan untuk kode proyek).
- `{1,3-4}` = sorot baris. Tombol salin otomatis.
- Untuk perubahan kode, pakai fence `diff` atau sorot baris yang baru.

### Tautan
Antarpelajaran: `[Express Dasar](/belajar/crud-backend/express-dasar)`. Lab: `/lab/<slug>`
(`crud-simulator`, `http-explorer`, `sql-playground`, `flexbox`, `react-playground`, `expo-snack`).
Cheatsheet: `/cheatsheet/<slug>`. Glosarium: `/glosarium#<slug>`. Tautan eksternal hanya ke dokumentasi resmi.

## 5. Konsistensi teknis antar-track

**Proyek akhir**: *Aplikasi Tugas & Catatan Kuliah* — user punya mata kuliah (Course) dan tugas (Task)
dengan lampiran gambar.

- **Track 0 Fondasi** — JavaScript murni (Node 22, ESM `import`), contoh data tugas kuliah.
- **Track 1 CRUD & Backend** — pembaca membangun proyek sendiri **`belajar-api`** (JavaScript, ESM,
  `"type": "module"`, Express 5) secara bertahap:
  - in-memory → Prisma 7 + SQLite → Zod 4 → pagination → struktur folder.
  - Model versi belajar: `Task { id, title, done:boolean, priority:"rendah"|"sedang"|"tinggi",
    courseId?, createdAt, updatedAt }` dan `Course { id, name, lecturer, ... }` (relasi mulai di prisma-sqlite).
  - Format respons **sama** dengan API pendamping: `{ data, meta }` / `{ data }` /
    `{ error: { message, code, details? } }`. Port `3000`, prefix `/api`.
  - Express 5: error async otomatis diteruskan ke error handler (tidak perlu try/catch di tiap route).
- **Track 2 React & RN** — JavaScript. React dasar di `ReactPlayground` (web), RN di `SnackEmbed` dan
  proyek lokal `npx create-expo-app@latest`. Navigasi dengan Expo Router (`app/` file-based).
- **Track 3 Full-stack** — JavaScript di sisi aplikasi; backend memakai **API pendamping `api/`**
  (lebih lengkap: auth JWT, status `TODO|IN_PROGRESS|DONE`, priority `LOW|MEDIUM|HIGH`, deadline,
  lampiran). Jelaskan transisi dari `belajar-api` ke API pendamping di pelajaran awal track ini.
  `EXPO_PUBLIC_API_URL` (IP LAN laptop, `10.0.2.2` untuk emulator Android).
- **Track 4 Expert** — **TypeScript**, mengutip kode nyata dari `api/` (sebut path file-nya). Contoh
  sisi aplikasi ditulis untuk `kuliah-app` versi TypeScript (path `kuliah-app/src/...`). Repo **tidak**
  berisi folder aplikasi mobile; jangan menulis seolah ada "kunci jawaban" aplikasi di repo.

Contoh data: gunakan nama & konteks Indonesia (Andi, Sari, "Basis Data", "Pemrograman Mobile",
`demo@kampus.ac.id`). Jangan memakai data pribadi nyata.

## 6. Kualitas

- Setiap kode harus **benar & bisa dijalankan** sesuai konteksnya (perhatikan import, nama file, versi).
- Tunjukkan output yang diharapkan (komentar `// → ...` atau blok `txt`).
- Setiap pelajaran setidaknya punya: 1 visual (Flow/FileTree/Compare/tabel/lab), 1 Callout, 1 Exercise
  dengan Solution, 1 Quiz, Ringkasan.
- Tangani perbedaan OS bila relevan (Windows PowerShell vs macOS/Linux) dengan `<Tabs>`.
- Sebut kesalahan umum & cara debug-nya (pesan error asli + artinya).
- Aksesibilitas: teks tautan deskriptif, jangan "klik di sini".

## 7. Validasi

```bash
npm run check:content                              # semua file + integritas registry
npm run check:content -- content/fondasi           # satu folder
npm run check:content -- content/fondasi/setup-tools.mdx --min-words 900
```

Script mengompilasi MDX, merender dengan stub yang memvalidasi props (Quiz, Tabs, Callout, Flow, Exercise,
lab), mengecek bahasa code fence, dan memastikan registry ↔ file sinkron. Harus **0 masalah** sebelum selesai.
Jangan menjalankan `next build` saat beberapa penulis bekerja paralel.
