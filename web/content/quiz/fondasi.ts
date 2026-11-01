import type { QuizQuestion } from "@/lib/quiz";

const quiz: QuizQuestion[] = [
  {
    q: "Kamu membuka aplikasi GoFood lalu menekan tombol **Pesan**. Dalam bahasa web, siapa **client** dan siapa **server**?",
    options: [
      "HP kamu adalah client yang mengirim request, komputer GoFood adalah server yang memproses lalu mengirim response",
      "Komputer GoFood adalah client, HP kamu adalah server",
      "Driver adalah client, restoran adalah server",
      "Client dan server sama saja, hanya beda nama",
    ],
    answer: 0,
    explain:
      "Client adalah pihak yang meminta. Server adalah pihak yang melayani. HP kamu mengirim request (pesanan) lewat internet, lalu server GoFood memprosesnya dan membalas dengan response, misalnya \"Pesanan diterima\". Mirip di warung: kamu pembeli (client), pelayan dan dapur adalah server.",
  },
  {
    q: "Apa hasil `typeof []` di JavaScript?",
    options: ['"array"', '"object"', '"list"', '"undefined"'],
    answer: 1,
    explain:
      "Di JavaScript, array dianggap sejenis objek, jadi `typeof []` menghasilkan `\"object\"`. Untuk memastikan sesuatu itu array, pakai `Array.isArray()`. Mirip petugas yang melihat SIM lalu hanya bilang \"ini kartu\". Tidak salah, tapi kurang spesifik.",
  },
  {
    q: "Di URL `https://api.kampus.id/tasks?page=2`, bagian mana yang disebut query string?",
    options: ["`https://`", "`api.kampus.id`", "`/tasks`", "`?page=2`"],
    answer: 3,
    explain:
      "Query string dimulai dari tanda `?` dan berisi pasangan `key=value`. Biasanya dipakai untuk filter atau memilih halaman. Mirip catatan tambahan saat memesan: alamatnya tetap `/tasks`, dan `?page=2` artinya \"tolong kirim halaman 2\".",
  },
  {
    q: "Di kursus ini, **Node.js** dipakai untuk apa?",
    options: [
      "Menjalankan JavaScript di luar browser, misalnya untuk server API dan npm",
      "Database untuk menyimpan data tugas",
      "Aplikasi di HP untuk membuka proyek Expo",
      "Editor kode pengganti VS Code",
    ],
    answer: 0,
    explain:
      "Node.js membuat JavaScript bisa jalan di laptop atau server, tidak hanya di browser. Kita memakainya untuk menjalankan server Express, perintah seperti `npx create-expo-app`, dan npm. Ibaratnya, JavaScript adalah resep dan browser adalah dapur pertama. Node.js adalah kompor kedua, jadi resep yang sama bisa dimasak di tempat lain. Database (SQLite/PostgreSQL) dan Expo Go adalah alat yang berbeda.",
  },
  {
    q: "Apa isi `hasil` setelah kode ini dijalankan?",
    code: `const tasks = [
  { id: 1, title: "Belajar JS", done: true, priority: "tinggi" },
  { id: 2, title: "Belajar SQL", done: false, priority: "sedang" },
  { id: 3, title: "Belajar RN", done: false, priority: "tinggi" },
];

const hasil = tasks.filter((t) => !t.done).map((t) => t.title);`,
    options: [
      '`["Belajar JS"]`',
      "`[2, 3]`",
      '`["Belajar SQL", "Belajar RN"]`',
      "`[{ id: 2, ... }, { id: 3, ... }]`",
    ],
    answer: 2,
    explain:
      "`filter` menyaring dulu: hanya tugas yang `done`-nya `false` yang tersisa (id 2 dan 3). Lalu `map` mengambil `title` dari tiap tugas itu. Hasilnya array berisi judul, bukan objek atau id. Seperti memilah tumpukan tugas yang belum dikerjakan, lalu menyalin judulnya saja ke buku catatan.",
  },
  {
    q: "Apa yang dicetak kode ini?",
    code: `const task = { id: 1, title: "Belajar JS", done: false, priority: "sedang" };
const selesai = { ...task, done: true };

console.log(task.done, selesai.done);`,
    options: ["`true true`", "`false false`", "`true false`", "`false true`"],
    answer: 3,
    explain:
      "`{ ...task }` membuat objek **baru** yang isinya salinan `task`. Lalu `done: true` hanya mengubah salinan itu. Objek aslinya tetap `done: false`, jadi hasilnya `false true`. Seperti memfotokopi formulir lalu mencoret fotokopinya: formulir asli tetap bersih.",
  },
  {
    q: "Berapa nilai `nama` setelah baris terakhir dijalankan?",
    code: `const user = { profile: null };
const nama = user.profile?.name ?? "Tamu";`,
    options: ['`"Tamu"`', "`null`", "`undefined`", "Error: Cannot read properties of null"],
    answer: 0,
    explain:
      "`user.profile` bernilai `null`. Tanda `?.` melihat itu lalu berhenti dengan aman: hasilnya `undefined`, tanpa error. Setelah itu `??` memakai nilai cadangan `\"Tamu\"` karena sisi kirinya kosong (`null` atau `undefined`). Mirip buku tamu: kalau tamu tidak menyebut nama, petugas menulis \"Tamu\" saja.",
  },
  {
    q: "Huruf-huruf ini dicetak dengan urutan apa?",
    code: `console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");`,
    options: ["`A B C D`", "`A C D B`", "`A D C B`", "`A D B C`"],
    answer: 2,
    explain:
      "Kode biasa (sinkron) jalan duluan, jadi `A` lalu `D`. Setelah itu JavaScript mengerjakan antrean Promise (`C`), baru antrean timer seperti `setTimeout` (`B`), walaupun delay-nya 0. Bayangkan teller bank: orang yang sudah di depan loket dilayani dulu, lalu antrean prioritas (Promise), baru antrean biasa (`setTimeout`).",
  },
  {
    q: "Fungsi ini sudah memakai `try/catch`. Kenapa masih perlu mengecek `res.ok`?",
    code: `async function getTasks() {
  try {
    const res = await fetch("http://localhost:3000/tasks");
    if (!res.ok) throw new Error("HTTP " + res.status);
    return await res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}`,
    options: [
      "Karena `fetch` selalu melempar error untuk status 4xx dan 5xx",
      "Karena `fetch` hanya gagal (reject) saat jaringan bermasalah; respons 404 atau 500 tetap dianggap berhasil, jadi harus dicek sendiri",
      "Karena `res.json()` tidak bisa dipanggil sebelum `res.ok` dibaca",
      "Supaya request otomatis dikirim ulang kalau gagal",
    ],
    answer: 1,
    explain:
      "`fetch` hanya gagal (reject) kalau jaringannya bermasalah, misalnya server mati atau sinyal hilang. Kalau server menjawab 404 atau 500, `fetch` tetap menganggapnya berhasil (resolve). Jadi kita cek `res.ok` (bernilai true untuk status 200 sampai 299), lalu melempar error sendiri supaya masuk ke `catch`. Mirip kurir: ia hanya lapor gagal kalau tidak bisa sampai. Kalau sampai tapi penerima bilang \"salah alamat\", kurir tetap mencatat \"terkirim\". Kamu yang harus membaca jawabannya.",
  },
  {
    q: "File `tasks.js` berisi `export default function listTasks() {}` dan `export const MAX = 10;`. Bagaimana cara mengimpor keduanya dengan ESM?",
    options: [
      '`import listTasks, { MAX } from "./tasks.js";`',
      '`import { listTasks, MAX } from "./tasks.js";`',
      '`const { listTasks, MAX } = require("./tasks.js");`',
      '`import * as listTasks, MAX from "./tasks.js";`',
    ],
    answer: 0,
    explain:
      "Default export diimpor tanpa kurung kurawal, dan namanya boleh kamu tentukan sendiri. Named export ditulis di dalam `{ }` dengan nama yang persis sama. `require` adalah cara lama (CommonJS), bukan ESM. Mirip membuka kardus paket: barang utama (default) langsung kamu ambil dan beri nama sesukamu, barang lain (named) diambil sesuai label yang tertempel.",
  },
  {
    q: "Mana yang merupakan **JSON valid**?",
    options: [
      '`{ title: "Belajar", done: false }`',
      "`{ 'title': 'Belajar', 'done': false }`",
      '`{ "title": "Belajar", "done": false }`',
      '`{ "title": "Belajar", "done": false, }`',
    ],
    answer: 2,
    explain:
      "JSON lebih ketat daripada objek JavaScript. Key wajib pakai kutip ganda. String juga wajib kutip ganda, bukan kutip tunggal. Koma di akhir (trailing comma) juga tidak boleh. Seperti formulir resmi di bagian akademik: format salah sedikit saja, formulir langsung ditolak.",
  },
];

export default quiz;