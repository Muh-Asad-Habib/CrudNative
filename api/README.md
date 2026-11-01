# API Proyek Latihan: Tugas & Catatan Kuliah

REST API pendamping untuk materi belajar CRUD + React Native di situs CRUDNative. Ini **contoh proyek untuk latihan**, bukan aplikasi jadi: lewat API ini kamu mempraktikkan endpoint CRUD, relasi data, autentikasi JWT, validasi, dan upload file. Datanya berupa **mata kuliah**, **tugas**, dan **lampiran gambar**, dan setiap user hanya bisa melihat dan mengubah datanya sendiri.

Teknologi: **Express 5**, **Prisma 7** (SQLite lewat driver adapter `better-sqlite3`), **Zod 4**, JWT + refresh token berotasi, **Multer 2** untuk upload, serta **Vitest** + **Supertest** untuk test.

## Daftar isi

- [Kebutuhan](#kebutuhan)
- [Setup cepat](#setup-cepat)
- [Script npm](#script-npm)
- [Struktur folder](#struktur-folder)
- [Environment variable](#environment-variable)
- [Daftar endpoint](#daftar-endpoint)
- [Format respons & error](#format-respons--error)
- [Alur autentikasi](#alur-autentikasi)
- [Contoh request](#contoh-request)
- [Menghubungkan aplikasi mobile](#menghubungkan-aplikasi-mobile)
- [Troubleshooting](#troubleshooting)
- [Pindah ke PostgreSQL](#pindah-ke-postgresql)
- [Testing](#testing)
- [Build untuk production](#build-untuk-production)

## Kebutuhan

- **Node.js 22.18 atau lebih baru** (cek dengan `node -v`; versi minimum juga tercatat di `engines` pada `package.json`)
- npm (sudah ikut terpasang bersama Node.js)
- Tidak perlu server database. SQLite disimpan sebagai file `dev.db` di folder ini.
- Windows: biasanya tidak perlu Visual Studio Build Tools karena `better-sqlite3` mengunduh binary siap pakai. Kalau `npm install` gagal saat memasang `better-sqlite3`, pastikan memakai Node.js versi LTS (22 atau 24) 64-bit.

## Setup cepat

Semua perintah dijalankan dari folder `api/`.

### Windows (PowerShell)

```powershell
cd belajar-crud-rn\api
npm install                     # sekaligus menjalankan `prisma generate`
Copy-Item .env.example .env     # lalu ganti JWT_ACCESS_SECRET (lihat di bawah)
npm run db:migrate              # buat dev.db dan terapkan migrasi
npm run db:seed                 # isi data contoh + akun demo
npm run dev                     # server di http://localhost:3000/api
```

Windows PowerShell 5 tidak mengenal `&&`. Jalankan perintah satu per satu seperti di atas, atau pisahkan dengan `;`.

### macOS / Linux (bash/zsh)

```bash
cd belajar-crud-rn/api
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

Cek server dengan membuka `http://localhost:3000/api/health` di browser. Hasilnya harus `{"status":"ok"}`.

Data contoh bisa dikembalikan ke kondisi awal kapan saja dengan `npm run db:reset`. Perintah ini **menghapus semua data** di `dev.db`, menerapkan ulang migrasi, generate client, lalu menjalankan seed.

### Akun demo

Setelah di-seed, login dengan akun demo berikut:

| Email | Password |
| --- | --- |
| `demo@kampus.ac.id` | `password123` |

Akun demo sudah punya 3 mata kuliah (Basis Data, Pemrograman Mobile, Jaringan Komputer) dan 10 tugas dengan status, prioritas, dan deadline yang beragam.

> Sebelum dipakai serius, ganti `JWT_ACCESS_SECRET` di `.env` dengan string acak:
> `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`

## Script npm

| Script | Fungsi |
| --- | --- |
| `npm run dev` | Menjalankan server dengan `tsx watch` (restart otomatis saat file berubah) |
| `npm run build` | Compile TypeScript ke folder `dist/` (`tsc -p tsconfig.build.json`) |
| `npm start` | Menjalankan hasil build: `node dist/server.js` |
| `npm run typecheck` | Cek tipe seluruh project tanpa menghasilkan file |
| `npm test` | Menjalankan semua test (Vitest + Supertest) memakai database `test.db` terpisah |
| `npm run db:generate` | Generate ulang Prisma Client ke `src/generated/prisma` |
| `npm run db:migrate` | Membuat/menerapkan migrasi (`prisma migrate dev`) lalu generate client |
| `npm run db:seed` | Mengosongkan **semua** tabel (termasuk user yang mendaftar sendiri) dan file lampiran, lalu mengisi data contoh (`prisma/seed.ts`). Boleh dijalankan berulang kali |
| `npm run db:reset` | Hapus database, terapkan ulang migrasi, generate client, lalu seed |
| `npm run db:studio` | Membuka Prisma Studio untuk melihat isi database di browser |

## Struktur folder

```
api/
├── prisma/
│   ├── schema.prisma          # model User, Course, Task, Attachment, RefreshToken
│   ├── migrations/            # riwayat migrasi SQL
│   └── seed.ts                # data contoh: kosongkan semua tabel lalu isi ulang
├── prisma.config.ts           # konfigurasi Prisma CLI (schema, migrasi, seed, URL database)
├── src/
│   ├── server.ts              # menyalakan server (listen 0.0.0.0:PORT)
│   ├── app.ts                 # createApp(): susunan middleware & route (dipakai juga oleh test)
│   ├── config/env.ts          # validasi environment variable dengan Zod
│   ├── lib/
│   │   ├── prisma.ts          # PrismaClient + adapter better-sqlite3
│   │   ├── http-error.ts      # class HttpError(status, code, message, details?)
│   │   ├── tokens.ts          # access token (JWT) & refresh token
│   │   ├── password.ts        # hash & cek password (bcryptjs)
│   │   ├── pagination.ts      # skema page/limit + hitung meta
│   │   └── storage.ts         # lokasi folder upload & hapus file
│   ├── middleware/
│   │   ├── auth.ts            # requireAuth → req.userId
│   │   ├── validate.ts        # validate({ params, query, body }) dengan Zod
│   │   ├── upload.ts          # multer: jpeg/png/webp, maks 5 MB
│   │   ├── rate-limit.ts      # 20 request / 15 menit untuk route auth
│   │   ├── not-found.ts       # 404 untuk route yang tidak dikenal
│   │   └── error-handler.ts   # semua error → { error: { message, code, details? } }
│   ├── modules/
│   │   ├── auth/              # auth.routes.ts, auth.service.ts, auth.schemas.ts
│   │   ├── courses/           # courses.routes.ts, courses.service.ts, courses.schemas.ts
│   │   └── tasks/             # tasks.routes.ts, tasks.service.ts, tasks.schemas.ts
│   └── generated/prisma/      # hasil `prisma generate` (jangan diedit, tidak di-commit)
├── tests/                     # test Vitest + Supertest
├── uploads/                   # file lampiran (dilayani di /uploads)
├── tsconfig.json              # konfigurasi TypeScript (editor, typecheck, test)
├── tsconfig.build.json        # konfigurasi build ke dist/
└── vitest.config.ts
```

Setiap modul dibagi tiga lapis:

- **routes**: menerima HTTP request, memanggil `validate`, lalu meneruskan ke service.
- **service**: logika bisnis dan query Prisma. Tidak tahu apa-apa soal `req`/`res`.
- **schemas**: aturan validasi Zod sekaligus sumber tipe TypeScript untuk input.

## Environment variable

Semua variable divalidasi saat start (`src/config/env.ts`). Kalau ada yang salah, server langsung berhenti dengan pesan yang jelas. Contoh lengkapnya ada di `.env.example`.

| Nama | Default | Keterangan |
| --- | --- | --- |
| `NODE_ENV` | `development` | `development`, `test`, atau `production`. Log request (morgan) hanya aktif di `development` |
| `PORT` | `3000` | Port HTTP |
| `DATABASE_URL` | (wajib) | SQLite: `file:./dev.db` (relatif terhadap folder `api/`) |
| `JWT_ACCESS_SECRET` | (wajib) | Rahasia penandatangan JWT, minimal 32 karakter. Nilai contoh dari `.env.example` hanya boleh dipakai di development; dengan `NODE_ENV=production` server menolak start |
| `CORS_ORIGIN` | `*` | `*` atau daftar origin dipisah koma, contoh `https://a.com,https://b.com` |
| `UPLOAD_DIR` | `uploads` | Folder penyimpanan lampiran |

## Daftar endpoint

Semua route memakai prefix `/api`. Kolom **Auth** berarti wajib mengirim header `Authorization: Bearer <accessToken>`.

| Method | Path | Auth | Keterangan | Sukses |
| --- | --- | --- | --- | --- |
| GET | `/api/health` | – | Cek server hidup | `200 { status: "ok" }` |
| POST | `/api/auth/register` | – | Daftar: `{ name, email, password }` | `201 { data: { user, accessToken, refreshToken } }` |
| POST | `/api/auth/login` | – | Masuk: `{ email, password }` | `200 { data: { user, accessToken, refreshToken } }` |
| POST | `/api/auth/refresh` | – | Tukar refresh token: `{ refreshToken }` | `200 { data: { accessToken, refreshToken } }` |
| POST | `/api/auth/logout` | – | Cabut refresh token: `{ refreshToken }` | `204` |
| GET | `/api/auth/me` | ✔ | Profil user yang login | `200 { data: user }` |
| GET | `/api/courses` | ✔ | Daftar mata kuliah. Query: `q`, `page`, `limit` (default 20, maks 50), urut nama A–Z | `200 { data, meta }` |
| POST | `/api/courses` | ✔ | `{ name, code?, lecturer?, color? }` (`color` format `#RRGGBB`) | `201 { data }` |
| GET | `/api/courses/:id` | ✔ | Detail mata kuliah | `200 { data }` |
| PATCH | `/api/courses/:id` | ✔ | Ubah sebagian field | `200 { data }` |
| DELETE | `/api/courses/:id` | ✔ | Hapus. Tugas terkait tetap ada dengan `courseId = null` | `204` |
| GET | `/api/tasks` | ✔ | Daftar tugas (lihat query di bawah) | `200 { data, meta }` |
| POST | `/api/tasks` | ✔ | `{ title, description?, deadline?, status?, priority?, courseId? }` | `201 { data }` |
| GET | `/api/tasks/:id` | ✔ | Detail tugas | `200 { data }` |
| PATCH | `/api/tasks/:id` | ✔ | Ubah sebagian field | `200 { data }` |
| DELETE | `/api/tasks/:id` | ✔ | Hapus tugas beserta file lampirannya | `204` |
| POST | `/api/tasks/:id/attachments` | ✔ | Upload `multipart/form-data`, field `file` (jpeg/png/webp, maks 5 MB) | `201 { data: attachment }` |
| DELETE | `/api/tasks/:id/attachments/:attachmentId` | ✔ | Hapus lampiran beserta filenya | `204` |
| GET | `/uploads/<nama-file>` | – | File lampiran (static) | file gambar |

**Query `GET /api/tasks`:**

| Query | Nilai | Default |
| --- | --- | --- |
| `page` | angka ≥ 1 | `1` |
| `limit` | 1–50 | `10` |
| `status` | `TODO`, `IN_PROGRESS`, `DONE` | – |
| `priority` | `LOW`, `MEDIUM`, `HIGH` | – |
| `courseId` | id mata kuliah | – |
| `q` | cari di judul & deskripsi | – |
| `sort` | `createdAt`, `-createdAt`, `deadline`, `-deadline`, `priority`, `-priority`, `title`, `-title` | `-createdAt` |

Tanda `-` berarti urutan menurun. Tugas tanpa deadline selalu ditaruh di akhir saat diurutkan berdasarkan deadline. Urutan prioritas memakai arti, bukan abjad: `-priority` = HIGH → MEDIUM → LOW.

**Bentuk data:**

```jsonc
// Course
{ "id": 1, "name": "Basis Data", "code": "IF2240", "lecturer": "Dr. Rina Kusuma",
  "color": "#4F46E5", "createdAt": "...", "updatedAt": "...", "taskCount": 4 }

// Task
{ "id": 7, "title": "Laporan ERD", "description": null, "deadline": "2026-11-05T16:59:00.000Z",
  "status": "TODO", "priority": "HIGH", "courseId": 1,
  "course": { "id": 1, "name": "Basis Data", "color": "#4F46E5" },
  "attachments": [], "createdAt": "...", "updatedAt": "..." }

// Attachment
{ "id": 3, "taskId": 7, "url": "/uploads/1761836400000-a1b2c3d4.png", "filename": "papan-tulis.png",
  "mimeType": "image/png", "size": 48213, "createdAt": "..." }
```

Data milik user lain selalu dijawab **404**, bukan 403, supaya keberadaannya tidak bocor.

## Format respons & error

| Jenis | Bentuk |
| --- | --- |
| List | `200 { "data": [...], "meta": { "page": 1, "limit": 10, "total": 23, "totalPages": 3 } }` |
| Detail / buat / ubah | `200` atau `201 { "data": { ... } }` |
| Hapus | `204` tanpa body |
| Error | `{ "error": { "message": "...", "code": "...", "details": [{ "field": "...", "message": "..." }] } }` |

`details` hanya muncul pada error validasi. Contoh:

```json
{
  "error": {
    "message": "Data yang dikirim tidak valid",
    "code": "VALIDATION_ERROR",
    "details": [
      { "field": "title", "message": "Judul wajib diisi" },
      { "field": "priority", "message": "Prioritas harus LOW, MEDIUM, atau HIGH" }
    ]
  }
}
```

| Status | `code` | Kapan |
| --- | --- | --- |
| 400 | `VALIDATION_ERROR` | Input tidak lolos validasi Zod (lihat `details`) |
| 400 | `BAD_REQUEST` | Body JSON rusak, file dikirim lewat field selain `file`, lebih dari satu file, body multipart rusak, dan sejenisnya |
| 401 | `UNAUTHORIZED` | Token tidak ada atau tidak valid, login gagal, refresh token ditolak |
| 401 | `TOKEN_EXPIRED` | Access token kedaluwarsa. Panggil `/api/auth/refresh` |
| 404 | `NOT_FOUND` | Data tidak ada atau milik user lain |
| 404 | `ROUTE_NOT_FOUND` | URL/method tidak dikenal |
| 409 | `CONFLICT` | Email sudah terdaftar |
| 413 | `PAYLOAD_TOO_LARGE` | File lebih dari 5 MB |
| 415 | `UNSUPPORTED_MEDIA_TYPE` | File bukan jpeg/png/webp |
| 429 | `RATE_LIMITED` | Lebih dari 20 request auth dalam 15 menit |
| 500 | `INTERNAL_ERROR` | Kesalahan server. Detailnya hanya ditulis ke log |

## Alur autentikasi

```
register / login ──► { accessToken (JWT, 15 menit), refreshToken (30 hari) }
       │
       ▼
Request biasa: Authorization: Bearer <accessToken>
       │
       ▼ (401 TOKEN_EXPIRED)
POST /api/auth/refresh { refreshToken } ──► pasangan token BARU, token lama dicabut
       │
       ▼
logout: POST /api/auth/logout { refreshToken } ──► token dicabut (204)
```

- **Access token** adalah JWT HS256 dengan payload `{ sub: "<userId>" }`. Server tidak menyimpannya.
- **Refresh token** adalah string acak 96 karakter hex. Database hanya menyimpan **hash SHA-256**-nya, jadi kalau database bocor token aslinya tetap aman.
- **Rotasi**: setiap refresh mencabut token lama dan menerbitkan yang baru. Simpan selalu refresh token terbaru di client.
- **Deteksi pemakaian ulang**: kalau token yang sudah dicabut dipakai lagi (tanda token dicuri), **semua** sesi user itu dicabut dan user harus login ulang.
- Route `register`, `login`, `refresh`, dan `logout` dibatasi 20 request per 15 menit per IP. `GET /me` tidak dibatasi supaya aplikasi bisa memanggilnya setiap kali dibuka.

## Contoh request

### PowerShell (`Invoke-RestMethod`)

```powershell
$base = "http://localhost:3000/api"

# Login lalu simpan token
$login = Invoke-RestMethod -Method Post -Uri "$base/auth/login" -ContentType "application/json" `
  -Body (@{ email = "demo@kampus.ac.id"; password = "password123" } | ConvertTo-Json)
$headers = @{ Authorization = "Bearer $($login.data.accessToken)" }

# Daftar tugas: belum selesai, prioritas tinggi, urut deadline terdekat
Invoke-RestMethod -Uri "$base/tasks?status=TODO&priority=HIGH&sort=deadline" -Headers $headers

# Buat tugas
$body = @{ title = "Resume jurnal"; priority = "HIGH"; deadline = "2026-12-01T23:59:00+07:00" } | ConvertTo-Json
$task = (Invoke-RestMethod -Method Post -Uri "$base/tasks" -Headers $headers -ContentType "application/json" -Body $body).data

# Ubah status
Invoke-RestMethod -Method Patch -Uri "$base/tasks/$($task.id)" -Headers $headers `
  -ContentType "application/json" -Body (@{ status = "DONE" } | ConvertTo-Json)

# Upload gambar (PowerShell 7+; di Windows PowerShell 5 pakai curl.exe di bawah)
Invoke-RestMethod -Method Post -Uri "$base/tasks/$($task.id)/attachments" -Headers $headers `
  -Form @{ file = Get-Item ".\foto.png" }

# Hapus tugas
Invoke-RestMethod -Method Delete -Uri "$base/tasks/$($task.id)" -Headers $headers

# Refresh token
$tokens = (Invoke-RestMethod -Method Post -Uri "$base/auth/refresh" -ContentType "application/json" `
  -Body (@{ refreshToken = $login.data.refreshToken } | ConvertTo-Json)).data
```

Di PowerShell, respons error membuat `Invoke-RestMethod` melempar exception. Body error-nya bisa dibaca dari `$_.ErrorDetails.Message` di dalam `catch`.

### curl

Contoh di bawah ditulis untuk bash (Git Bash, macOS, Linux). Di PowerShell, tulis `curl.exe` (karena `curl` di PowerShell 5 adalah alias `Invoke-WebRequest`) dan lebih praktis memakai contoh `Invoke-RestMethod` di atas untuk body JSON.

```bash
BASE=http://localhost:3000/api

# Login
curl -s -X POST $BASE/auth/login -H "Content-Type: application/json" \
  -d '{"email":"demo@kampus.ac.id","password":"password123"}'

TOKEN="<accessToken dari respons login>"

# Daftar tugas mata kuliah tertentu, halaman 2, 5 per halaman
curl -s "$BASE/tasks?courseId=1&page=2&limit=5" -H "Authorization: Bearer $TOKEN"

# Buat, ubah, hapus tugas
curl -s -X POST $BASE/tasks -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"title":"Resume jurnal","priority":"HIGH","courseId":1}'
curl -s -X PATCH $BASE/tasks/11 -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"status":"IN_PROGRESS"}'
curl -s -X DELETE $BASE/tasks/11 -H "Authorization: Bearer $TOKEN" -i

# Upload lampiran (multipart, field "file")
curl -s -X POST $BASE/tasks/1/attachments -H "Authorization: Bearer $TOKEN" -F "file=@foto.png"

# Refresh token
curl -s -X POST $BASE/auth/refresh -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refreshToken>"}'
```

## Menghubungkan aplikasi mobile

Server mendengarkan di `0.0.0.0`, jadi bisa diakses dari perangkat lain di jaringan yang sama. Saat start, server menampilkan alamat yang bisa dipakai:

```
API berjalan di http://localhost:3000/api
  Dari HP di Wi-Fi yang sama: http://192.168.1.10:3000/api
  Dari emulator Android:      http://10.0.2.2:3000/api
```

### 1. Tentukan alamat server

| Aplikasi berjalan di | `EXPO_PUBLIC_API_URL` | Keterangan |
| --- | --- | --- |
| HP fisik (Expo Go / development build) | `http://<IP-LAN-laptop>:3000` | HP dan laptop harus satu jaringan |
| Emulator Android | `http://10.0.2.2:3000` | `10.0.2.2` adalah alias `localhost` milik laptop dari dalam emulator |
| Simulator iOS (macOS) | `http://localhost:3000` | Simulator berbagi jaringan dengan Mac |
| Browser (Expo web) di laptop yang sama | `http://localhost:3000` | – |

Cara mencari IP LAN laptop:

| OS | Perintah | Yang dicari |
| --- | --- | --- |
| Windows | `ipconfig` | "IPv4 Address" di adapter **Wi-Fi** (bukan vEthernet/VirtualBox) |
| macOS | `ipconfig getifaddr en0` | Langsung tercetak, contoh `192.168.1.10` |
| Linux | `ip -4 addr` atau `hostname -I` | Alamat `inet` di adapter Wi-Fi (mis. `wlan0`/`wlp2s0`) |

Alamat yang sama juga dicetak oleh server saat `npm run dev` ("Dari HP di Wi-Fi yang sama").

### 2. Isi `.env` aplikasi Expo milikmu

Di folder aplikasi Expo yang kamu bangun dari materi (mis. `kuliah-app/`), buat file `.env`, lalu isi base URL **tanpa** akhiran `/api` (aplikasi menambahkan `/api/...` sendiri di setiap request):

```env
EXPO_PUBLIC_API_URL=http://192.168.1.10:3000
```

Restart Expo dengan cache bersih setelah mengubah `.env`: `npx expo start -c`. URL lampiran dari API berbentuk relatif (`/uploads/...`), jadi aplikasi menggabungkannya dengan base URL yang sama.

### 3. Buka firewall (khusus HP fisik)

Emulator Android dan simulator iOS memakai jaringan laptop sendiri, jadi biasanya tidak terhalang firewall. HP fisik datang dari luar, sehingga port 3000 harus diizinkan.

- **Windows**: jalankan PowerShell **sebagai Administrator**:
  ```powershell
  New-NetFirewallRule -DisplayName "API Belajar CRUD (3000)" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow -Profile Private
  ```
  Pastikan profil jaringan Wi-Fi adalah **Private** (Settings → Network & Internet → Wi-Fi → properti jaringan). Hapus rule-nya kalau sudah tidak dipakai: `Remove-NetFirewallRule -DisplayName "API Belajar CRUD (3000)"`. Kalau muncul dialog "Windows Defender Firewall has blocked some features of Node.js" saat pertama kali `npm run dev`, centang **Private networks** lalu klik **Allow access**.
- **macOS**: kalau Firewall aktif (System Settings → Network → Firewall) dan muncul dialog "Do you want the application node to accept incoming network connections?", pilih **Allow**.
- **Linux (ufw)**: `sudo ufw allow 3000/tcp`, lalu hapus dengan `sudo ufw delete allow 3000/tcp` setelah selesai.

### 4. Uji koneksi

Dari browser **di HP**, buka `http://<IP-LAN>:3000/api/health`. Harus muncul `{"status":"ok"}`. Kalau di browser HP sudah berhasil tapi aplikasi masih gagal, periksa lagi `EXPO_PUBLIC_API_URL` lalu restart Expo dengan `-c`.

Kalau tetap tidak bisa terhubung:

- Pastikan HP dan laptop memakai **Wi-Fi yang sama**. Wi-Fi kampus/publik sering memblokir koneksi antar-perangkat (*client isolation*); coba hotspot dari HP lalu sambungkan laptop ke hotspot itu.
- Matikan VPN di laptop maupun HP.
- Aplikasi memakai `http://` (bukan `https://`). Expo Go dan development build bawaan Expo sudah mengizinkan HTTP untuk development.

## Troubleshooting

| Masalah | Solusi |
| --- | --- |
| `Konfigurasi environment tidak valid` saat start | Belum ada `.env` atau isinya salah. Salin dari `.env.example`, pastikan `DATABASE_URL` terisi dan `JWT_ACCESS_SECRET` minimal 32 karakter. Dengan `NODE_ENV=production`, `JWT_ACCESS_SECRET` juga harus diganti dari nilai contoh |
| `EADDRINUSE: address already in use :::3000` | Port 3000 sudah dipakai program lain. Ganti `PORT` di `.env`, atau cari prosesnya: Windows `Get-NetTCPConnection -LocalPort 3000 -State Listen` (kolom `OwningProcess`), macOS/Linux `lsof -i :3000` |
| `http://localhost:3000` menjawab tapi bukan API ini | Di Windows, `localhost` bisa mengarah ke IPv6 `::1` yang dipakai program lain di port yang sama. Coba `http://127.0.0.1:3000/api/health` atau ganti `PORT` |
| `The table ... does not exist` | Migrasi belum diterapkan. Jalankan `npm run db:migrate` (atau `npm run db:reset`) |
| Error tidak menemukan modul `src/generated/prisma/...` | Prisma Client belum digenerate. Jalankan `npm run db:generate` |
| Login demo gagal (401) | Data contoh belum diisi atau sudah terhapus. Jalankan `npm run db:seed` |
| `429 RATE_LIMITED` saat mencoba login berkali-kali | Batas 20 request auth per 15 menit per IP. Tunggu atau restart server (penghitung disimpan di memori) |

## Pindah ke PostgreSQL

Kode aplikasi tidak perlu diubah selain pembuatan `PrismaClient`.

1. Pasang adapter PostgreSQL:
   ```powershell
   npm install @prisma/adapter-pg
   npm uninstall @prisma/adapter-better-sqlite3 @types/better-sqlite3
   ```
2. Ubah provider di `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
   }
   ```
3. Ganti adapter di `src/lib/prisma.ts`:
   ```ts
   import { PrismaPg } from "@prisma/adapter-pg";
   import { env } from "../config/env.ts";
   import { PrismaClient } from "../generated/prisma/client.ts";

   const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
   export const prisma = new PrismaClient({ adapter });
   ```
4. Isi `DATABASE_URL` di `.env`, contoh `postgresql://postgres:postgres@localhost:5432/belajar_crud`.
5. Migrasi lama berisi SQL khusus SQLite, jadi hapus folder `prisma/migrations` lalu buat ulang:
   ```powershell
   npx prisma migrate dev --name init
   npx prisma generate
   npm run db:seed
   ```
6. (Opsional) Pencarian `contains` di PostgreSQL membedakan huruf besar/kecil. Tambahkan `mode: "insensitive"` di filter `q` pada `courses.service.ts` dan `tasks.service.ts`, contoh `{ title: { contains: query.q, mode: "insensitive" } }`.

Status dan prioritas tetap disimpan sebagai `String` agar schema bisa dipakai di SQLite. Di PostgreSQL kamu bisa menggantinya dengan `enum` Prisma.

## Testing

```powershell
npm test
```

- Test memakai **database terpisah** `test.db` dan folder upload `uploads-test/`, diatur di `vitest.config.ts` dan `tests/test-env.ts`. Database development tidak tersentuh.
- `tests/global-setup.ts` membuat `test.db` baru dan menjalankan `prisma migrate deploy` sekali sebelum semua test. Setelah selesai, `test.db` dan `uploads-test/` dihapus.
- Setiap file test mengosongkan tabel di awal (`resetDatabase()` di `tests/helpers.ts`). File test dijalankan berurutan (`fileParallelism: false`) karena memakai satu database.
- Rate limit dan log morgan dimatikan saat `NODE_ENV=test`.

| File | Isi |
| --- | --- |
| `tests/app.test.ts` | health, route tidak dikenal, JSON rusak, header helmet & CORS (termasuk preflight dan parsing `CORS_ORIGIN`), validasi env (`JWT_ACCESS_SECRET` contoh ditolak di production), error handler (500 generik, 400 untuk URL rusak), rate limit auth (429) |
| `tests/auth.test.ts` | register, login, me (termasuk user yang sudah dihapus), validasi, email ganda, password salah, token kedaluwarsa, rotasi refresh, deteksi pemakaian ulang, logout |
| `tests/courses.test.ts` | CRUD mata kuliah, `taskCount`, pencarian, pagination, mengosongkan warna, kepemilikan (404) |
| `tests/tasks.test.ts` | CRUD tugas, detail validasi per field, `courseId` milik user lain, pagination, filter, sort, isolasi antar user, upload/hapus lampiran (415, 413, field salah, lebih dari satu file, multipart rusak, file ikut terhapus, static `/uploads`) |

## Build untuk production

Development memakai `tsx` (menjalankan TypeScript langsung). Untuk production, kode di-compile dulu dengan `tsc`:

```powershell
npm run build    # tsc -p tsconfig.build.json → dist/
npm start        # node dist/server.js
```

Import di kode sumber memakai ekstensi `.ts` (`import { env } from "./config/env.ts"`). Opsi `rewriteRelativeImportExtensions` di `tsconfig.json` mengubahnya menjadi `.js` saat build, sehingga hasil di `dist/` bisa dijalankan langsung oleh Node.js. Di production, set `NODE_ENV=production`, ganti `JWT_ACCESS_SECRET` dengan string acak (nilai contoh dari `.env.example` ditolak), isi `CORS_ORIGIN` dengan origin yang diizinkan, dan pastikan folder `UPLOAD_DIR` tidak terhapus saat deploy ulang.
