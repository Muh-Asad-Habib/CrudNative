# CRUDNative: Belajar CRUD & React Native

Situs belajar berbahasa Indonesia untuk pemula yang ingin bisa membuat aplikasi **CRUD** (Create, Read, Update, Delete) dan aplikasi HP dengan **React Native**. Kamu mulai dari JavaScript dasar, lanjut membuat API dan database, lalu membangun aplikasi React Native (Expo) yang tersambung ke API buatanmu sendiri. Materi, kuis, dan lab interaktifnya jalan langsung di browser, nyaman dibuka di HP maupun laptop.

**Isi:** 5 bab, 46 pelajaran (sekitar 28 jam), 6 lab interaktif, 8 cheatsheet, dan glosarium 137 istilah. Progres belajar disimpan di browser, tanpa akun.

Supaya teorinya langsung dipraktikkan, sepanjang materi kamu membangun satu **proyek latihan**: aplikasi "Tugas & Catatan Kuliah". Proyek ini hanya contoh; polanya bisa kamu pakai untuk aplikasi CRUD apa pun.

| Folder | Isi | Teknologi |
| --- | --- | --- |
| [`web/`](web/README.md) | Situs belajar: materi, kuis, lab, cheatsheet, glosarium, halaman progres | Next.js 16 (static export), Tailwind CSS v4, MDX |
| [`api/`](api/README.md) | API pendamping (opsional): contoh REST API proyek latihan | Express 5, Prisma 7, SQLite, TypeScript, Zod, JWT |

Aplikasi Expo proyek latihan (`kuliah-app`) **tidak** disertakan di repo. Kamu membangunnya sendiri langkah demi langkah di Bab 2 dan Bab 3.

## Daftar bab

| Bab | Judul | Isi singkat |
| --- | --- | --- |
| 0 | Fondasi Web & JavaScript | Terminal, Node.js, JavaScript modern, async/await, Git, JSON |
| 1 | CRUD & Backend dengan Express | Konsep CRUD, HTTP & REST, SQL, relasi, Express, Prisma + SQLite, validasi, pagination |
| 2 | React & React Native dengan Expo | React dasar, state & effect, komponen inti, flexbox, FlatList, Expo Router, form, state global |
| 3 | Full-stack: CRUD Mobile + API | Menyambungkan Expo ke API, create/read/update/delete, TanStack Query, upload gambar, login, capstone |
| 4 | Expert: Aplikasi Siap Dipakai Banyak Orang | TypeScript end-to-end, arsitektur, keamanan API, performa, testing, offline-first, real-time, deploy & CI/CD |

## Menjalankan di komputer sendiri

Butuh **Node.js 22.18+**.

```powershell
# 1) Situs belajar
cd web
npm install
npm run dev -- -p 3001   # buka http://localhost:3001

# 2) API pendamping (terminal lain, opsional)
cd api
npm install
Copy-Item .env.example .env   # di macOS/Linux: cp .env.example .env
npm run db:migrate
npm run db:seed
npm run dev                   # http://localhost:3000/api
```

## Deploy ke Netlify

Pengaturan build sudah ada di [`netlify.toml`](netlify.toml), jadi kamu tidak perlu mengisi apa pun secara manual.

1. Push repo ini ke GitHub.
2. Di Netlify pilih **Add new project → Import an existing project**, lalu pilih repo ini.
3. Netlify membaca `netlify.toml` dan otomatis memakai:

   | Pengaturan | Nilai |
   | --- | --- |
   | Base directory | `web` |
   | Build command | `npm run build` |
   | Publish directory | `web/out` |
   | Node.js | 22 |

4. Tekan **Deploy**. Setelah selesai, situs bisa dibuka di `https://nama-situs.netlify.app`.

Yang di-deploy hanya folder `web/` (situs statis). API di folder `api/` butuh server Node.js sungguhan, jadi tidak ikut ke Netlify. Cara deploy API dibahas di Bab 4.

Kalau memakai domain sendiri, tambahkan environment variable `SITE_URL` (contoh `https://belajar.domainmu.com`) di Netlify supaya canonical, `sitemap.xml`, dan `robots.txt` memakai domain itu.

Hasil `npm run build` ada di `web/out/` dan juga bisa di-hosting di layanan statis lain. Untuk GitHub Pages, lihat catatan `BASE_PATH` di [`web/README.md`](web/README.md).

## Perintah pengecekan

| Folder | Perintah |
| --- | --- |
| `web` | `npm run typecheck`, `npm run lint`, `npm test`, `npm run check:content`, `npm run build` |
| `api` | `npm run typecheck`, `npm test` |

## Lisensi

- Kode program: [MIT](LICENSE).
- Materi belajar di `web/content/`: [CC BY 4.0](LICENSE-CONTENT.md). Boleh dipakai ulang asal menyebut sumbernya.
