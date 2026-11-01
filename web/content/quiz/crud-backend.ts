import type { QuizQuestion } from "@/lib/quiz";

const quiz: QuizQuestion[] = [
  {
    q: "Di aplikasi KRS, kamu menambahkan mata kuliah Basis Data ke daftar rencana studimu. Ini termasuk operasi CRUD yang mana?",
    options: ["Create", "Read", "Update", "Delete"],
    answer: 0,
    explain:
      "Menambah data yang sebelumnya belum ada adalah **Create**. Di database, tiap mata kuliah di KRS biasanya disimpan sebagai satu baris baru. Melihat daftar KRS adalah Read, pindah dari kelas A ke kelas B adalah Update, dan membatalkan mata kuliah adalah Delete. Sama seperti kontak di HP: menyimpan nomor teman baru itu Create.",
  },
  {
    q: "Kamu hanya ingin mengubah **sebagian** data, misalnya status tugas saja. HTTP method apa yang paling tepat?",
    options: ["GET", "POST", "PATCH", "DELETE"],
    answer: 2,
    explain:
      "`PATCH` dipakai untuk mengubah sebagian field saja. `PUT` biasanya mengganti seluruh data sekaligus. Mirip mengganti nomor HP di profil kampus: kamu cukup mengubah satu kolom itu (PATCH), tidak perlu mengisi ulang seluruh formulir (PUT).",
  },
  {
    q: "Server berhasil menyimpan data baru. Status code apa yang paling tepat?",
    options: ["200 OK", "201 Created", "204 No Content", "400 Bad Request"],
    answer: 1,
    explain:
      "`201 Created` artinya data baru berhasil dibuat. Biasanya respons juga berisi data yang baru disimpan, lengkap dengan id-nya. Mirip resi paket yang baru dicetak: tanda kirimanmu sudah resmi tercatat dan punya nomor sendiri.",
  },
  {
    q: "Apa hasil query SQL ini?",
    code: `SELECT title FROM tasks
WHERE done = 0
ORDER BY id DESC;`,
    options: [
      "Judul tugas yang belum selesai, urut dari id terbesar ke terkecil",
      "Semua kolom tugas yang sudah selesai, urut dari id terkecil",
      "Judul semua tugas, lalu tugas dengan `done = 0` dihapus",
      "Jumlah tugas yang belum selesai",
    ],
    answer: 0,
    explain:
      "Baca per baris. `SELECT title` artinya ambil kolom judul saja. `WHERE done = 0` artinya pilih tugas yang belum selesai (SQLite menyimpan benar/salah sebagai 1/0). `ORDER BY id DESC` artinya urutkan dari id terbesar. `SELECT` hanya membaca dan tidak pernah menghapus data. Mirip meminta petugas perpustakaan: \"Tolong carikan judul buku yang belum dikembalikan, mulai dari yang terbaru.\"",
  },
  {
    q: "Kamu ingin menampilkan **semua user**, termasuk yang belum punya tugas sama sekali. Kata apa yang tepat untuk mengisi `____`?",
    code: `SELECT users.name, tasks.title
FROM users
____ JOIN tasks ON tasks.user_id = users.id;`,
    options: ["`INNER`", "`CROSS`", "`RIGHT`", "`LEFT`"],
    answer: 3,
    explain:
      "`LEFT JOIN` menyimpan semua baris dari tabel kiri (`users`). Kalau seorang user belum punya tugas, kolom `tasks.title`-nya berisi `NULL`. `INNER JOIN` hanya menampilkan user yang punya pasangan di `tasks`. Mirip mencocokkan daftar hadir dengan daftar nilai lewat NIM: dengan LEFT JOIN, mahasiswa yang belum punya nilai tetap muncul, hanya kolom nilainya kosong.",
  },
  {
    q: "Backend kita dibagi menjadi **routes → controllers → services**. Di mana sebaiknya logika bisnis, seperti query Prisma, ditaruh?",
    options: [
      "Di file routes, langsung di dalam `router.get(...)`",
      "Di services, jadi controller cukup membaca request dan mengirim response",
      "Di middleware CORS",
      "Di file `.env`",
    ],
    answer: 1,
    explain:
      "Bayangkan warung. Routes itu papan petunjuk: URL ini ditangani controller yang mana. Controller itu pelayan: menerima `req` dan mengantar `res`. Service itu dapur: tempat logika bisnis dan akses database. Kalau dipisah begini, tiap bagian lebih mudah diuji dan diubah. File `.env` hanya untuk pengaturan seperti `PORT` dan `DATABASE_URL`.",
  },
  {
    q: "Client mengirim `POST /tasks` dengan body JSON, tapi `req.body` tercetak `undefined`. Apa penyebabnya?",
    code: `import express from "express";

const app = express();

app.post("/tasks", (req, res) => {
  console.log(req.body);
  res.status(201).json(req.body);
});

app.listen(3000);`,
    options: [
      "Belum memasang `app.use(express.json())` sebelum route",
      "Route untuk membuat data harus memakai `app.get`",
      "Port 3000 tidak mendukung JSON",
      "Harus memakai `res.send()`, bukan `res.json()`",
    ],
    answer: 0,
    explain:
      "Express tidak otomatis membaca isi body. Middleware `express.json()` yang membuka body ber-`Content-Type: application/json`, lalu menaruh isinya di `req.body`. Pasang middleware ini **sebelum** route yang membutuhkannya. Mirip resepsionis kantor: amplop harus dibuka dulu di meja depan, baru isinya diantar ke bagian yang dituju.",
  },
  {
    q: "Ada route `app.get(\"/tasks/:id\", handler)`. Untuk request `GET /tasks/7?include=user`, apa isi `req`?",
    options: [
      "`req.params.id` = `7` (number) dan `req.query.include` = `\"user\"`",
      "`req.query.id` = `\"7\"` dan `req.params.include` = `\"user\"`",
      "`req.body.id` = `\"7\"` dan `req.query.include` = `\"user\"`",
      "`req.params.id` = `\"7\"` (string) dan `req.query.include` = `\"user\"`",
    ],
    answer: 3,
    explain:
      "Bagian `:id` di alamat masuk ke `req.params`. Pasangan setelah `?` masuk ke `req.query`. Keduanya selalu berupa **string**, jadi ubah dulu dengan `Number(req.params.id)` kalau kamu butuh angka. Mirip nomor kamar yang ditulis di amplop: isinya memang 7, tapi itu tulisan, bukan angka yang siap dihitung.",
  },
  {
    q: "Task dengan id 99 tidak ada. Apa nilai `task`, dan respons apa yang sebaiknya dikirim API?",
    code: `const task = await prisma.task.findUnique({
  where: { id: 99 },
});`,
    options: [
      "Prisma melempar error, jadi kirim 500",
      "`{}` (objek kosong), jadi kirim 200",
      "`null`, jadi kirim 404 Not Found",
      "`[]`, jadi kirim 204 No Content",
    ],
    answer: 2,
    explain:
      "`findUnique` mengembalikan `null` kalau datanya tidak ada. Yang melempar error adalah `findUniqueOrThrow`. Controller lalu membalas `404 Not Found` dengan format error yang seragam. Status 500 artinya ada bug di server, jadi tidak cocok di sini. Seperti cek resi paket: 404 artinya nomor yang kamu cari memang tidak terdaftar.",
  },
  {
    q: "Apa hasil `safeParse` di bawah ini?",
    code: `import { z } from "zod";

const CreateTask = z.object({
  title: z.string().min(1),
  priority: z.enum(["rendah", "sedang", "tinggi"]).default("sedang"),
});

const result = CreateTask.safeParse({ title: "", priority: "darurat" });`,
    options: [
      "`result.success` bernilai `false`, error berisi masalah di `title` dan `priority`, lalu API membalas 400",
      "Zod melempar exception sehingga server crash",
      "`result.success` bernilai `true` karena `priority` punya nilai default",
      "Hanya error `title` yang dilaporkan karena Zod berhenti di error pertama",
    ],
    answer: 0,
    explain:
      "`safeParse` tidak melempar error. Ia mengembalikan objek `{ success: false, error }`. Zod juga mencatat **semua** masalah sekaligus: `title` kosong gagal `min(1)`, dan `\"darurat\"` tidak ada di daftar enum. `default` hanya dipakai kalau field itu tidak dikirim sama sekali (`undefined`). Mirip petugas yang mengecek formulir: semua kolom yang salah dilingkari sekaligus, bukan hanya yang pertama.",
  },
  {
    q: "Untuk request `GET /tasks?page=3&limit=10`, berapa nilai `skip` yang dikirim ke Prisma?",
    code: `const page = Number(req.query.page ?? 1);
const limit = Number(req.query.limit ?? 10);

const tasks = await prisma.task.findMany({
  skip: (page - 1) * limit,
  take: limit,
});`,
    options: ["`30`", "`3`", "`10`", "`20`"],
    answer: 3,
    explain:
      "Halaman 3 berarti melewati 2 halaman pertama. Hitungannya `(3 - 1) * 10 = 20` data dilewati, lalu ambil 10 berikutnya (data ke-21 sampai 30). Mirip katalog yang tiap halamannya berisi 10 barang: untuk sampai ke halaman 3, kamu melewati 20 barang dulu. Respons sebaiknya juga menyertakan info seperti `total` dan `totalPages`.",
  },
];

export default quiz;