import type { QuizQuestion } from "@/lib/quiz";

const quiz: QuizQuestion[] = [
  {
    q: "Aplikasi Expo di HP memanggil API di laptop lewat `http://localhost:3000`, tapi gagal. Kenapa?",
    options: [
      "Port 3000 diblokir Android",
      "`localhost` di HP artinya HP itu sendiri, bukan laptop",
      "Expo tidak mendukung HTTP",
      "API harus memakai HTTPS",
    ],
    answer: 1,
    explain:
      "`localhost` artinya \"perangkat ini sendiri\". Jadi saat HP memanggil `localhost`, HP mencari server di dalam dirinya, bukan di laptop. Pakai IP LAN laptop (misalnya `http://192.168.1.10:3000`) atau tunnel supaya HP bisa menjangkau server. Mirip bilang \"ambil di rumah\" ke kurir: yang ia datangi rumahnya sendiri, bukan rumahmu.",
  },
  {
    q: "Di TanStack Query, apa yang sebaiknya dilakukan setelah mutation tambah tugas berhasil?",
    options: [
      "Reload aplikasi",
      "Invalidate query daftar tugas (tandai datanya sudah basi)",
      "Hapus seluruh cache",
      "Tidak perlu apa-apa",
    ],
    answer: 1,
    explain:
      "`queryClient.invalidateQueries({ queryKey: ['tasks'] })` menandai data daftar tugas sebagai basi, lalu TanStack Query mengambilnya ulang dari server. Daftar pun langsung memuat tugas baru. Mirip catatan di papan tulis: saat ada pengumuman baru, cukup bagian itu yang dihapus dan ditulis ulang, tidak perlu membersihkan seluruh papan.",
  },
  {
    q: "Kenapa variabel URL API di aplikasi Expo harus diberi awalan `EXPO_PUBLIC_`?",
    code: `// kuliah-app/.env
EXPO_PUBLIC_API_URL=http://192.168.1.10:3000

// kuliah-app/src/lib/api.js
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;`,
    options: [
      "Hanya variabel berawalan `EXPO_PUBLIC_` yang dimasukkan ke bundle JavaScript aplikasi, jadi jangan taruh rahasia di sana",
      "Supaya nilainya otomatis dienkripsi di HP",
      "Supaya nilainya bisa diubah dari server tanpa build atau restart",
      "Awalan itu hanya kebiasaan penamaan dan tidak berpengaruh apa-apa",
    ],
    answer: 0,
    explain:
      "Saat aplikasi dibundel, Expo mengganti `process.env.EXPO_PUBLIC_*` dengan nilai aslinya. Karena nilainya ikut masuk ke aplikasi, siapa pun bisa membacanya. Jadi awalan ini hanya untuk pengaturan publik seperti URL API, bukan password atau kunci rahasia. Ibaratnya tulisan di papan nama toko, bukan isi brankas. Untuk emulator Android pakai `10.0.2.2`, untuk HP fisik pakai IP LAN laptop.",
  },
  {
    q: "Apa yang terjadi saat nilai `status` berubah dari `\"TODO\"` menjadi `\"DONE\"`?",
    code: `const { data, isPending, isError, refetch } = useQuery({
  queryKey: ["tasks", { status }],
  queryFn: () => getTasks({ status }),
});`,
    options: [
      "Tidak terjadi apa-apa sampai `refetch()` dipanggil manual",
      "Seluruh cache tugas dihapus",
      "Key berubah sehingga dianggap query baru: data `DONE` diambil otomatis, dan cache `TODO` tetap disimpan",
      "Error, karena query key wajib berupa satu string",
    ],
    answer: 2,
    explain:
      "Query key adalah label laci untuk cache. Setiap kombinasi key punya laci sendiri. Saat filter berganti, TanStack Query membuka laci baru dan mengambil datanya otomatis. Kalau kamu kembali ke `TODO`, datanya langsung muncul dari laci lama. Mirip lemari arsip dengan label per kategori. Pola ini menggantikan cara manual dengan `useEffect` + `useState`.",
  },
  {
    q: "Aplikasi mengirim `POST /api/tasks` dengan judul kosong, lalu menerima respons ini. Bagaimana sebaiknya aplikasi menanganinya?",
    code: `HTTP/1.1 400 Bad Request

{
  "error": {
    "message": "Data tidak valid",
    "code": "VALIDATION_ERROR",
    "details": [{ "field": "title", "message": "Judul wajib diisi" }]
  }
}`,
    options: [
      "Menampilkan layar error penuh dan menutup aplikasi",
      "Mengirim ulang request yang sama sampai berhasil",
      "Menutup form dan menganggap tugas sudah tersimpan",
      "Membiarkan form tetap terbuka dan menampilkan pesan dari `details` di bawah field `title`",
    ],
    answer: 3,
    explain:
      "Status 400 dengan `VALIDATION_ERROR` artinya input pengguna yang salah, bukan servernya. Tampilkan tiap pesan di `details` di bawah field yang sesuai, supaya pengguna tahu apa yang harus diperbaiki. Mengirim ulang data yang sama pasti gagal lagi. Mirip petugas akademik yang mengembalikan formulir dengan catatan \"kolom judul belum diisi\". Kamu cukup melengkapi kolom itu, tidak perlu antre dari awal.",
  },
  {
    q: "Saat kamu mengirim chat di WhatsApp, pesannya langsung muncul dengan ikon jam, lalu berubah jadi centang. Kalau gagal, muncul tanda seru. Pola apa yang mirip dengan ini?",
    options: ["Optimistic update", "Pagination", "Hashing password", "Query string"],
    answer: 0,
    explain:
      "Optimistic update artinya layar langsung diperbarui seolah-olah request pasti berhasil, tanpa menunggu jawaban server. Ikon jam berarti masih menunggu. Kalau server menolak, aplikasi membatalkan perubahan atau memberi tanda gagal. Hasilnya aplikasi terasa cepat walaupun internet lambat.",
  },
  {
    q: "Apa fungsi `onError` pada mutation hapus tugas ini?",
    code: `const deleteTask = useMutation({
  mutationFn: (id: number) => api.delete("/api/tasks/" + id),
  onMutate: async (id) => {
    await queryClient.cancelQueries({ queryKey: ["tasks"] });
    const previous = queryClient.getQueryData(["tasks"]);
    queryClient.setQueryData(["tasks"], (old) => removeTask(old, id));
    return { previous };
  },
  onError: (_err, _id, context) => {
    queryClient.setQueryData(["tasks"], context?.previous);
  },
  onSettled: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
});`,
    options: [
      "Mengembalikan (rollback) cache ke kondisi sebelum dihapus kalau request gagal",
      "Mengirim ulang request `DELETE` secara otomatis",
      "Menghapus tugas dari cache sebelum request dikirim",
      "Menampilkan dialog konfirmasi sebelum menghapus",
    ],
    answer: 0,
    explain:
      "Ini pola optimistic update. `onMutate` langsung menghapus item dari cache dan menyimpan salinan lama (`previous`). Kalau server gagal, `onError` mengembalikan salinan itu. `onSettled` lalu mencocokkan ulang dengan server, apa pun hasilnya. Mirip mencoret barang di daftar belanja sebelum sampai kasir. Kalau ternyata gagal dibeli, kamu tulis lagi barang itu.",
  },
  {
    q: "Di konser, tiketmu ditukar dengan gelang di pintu masuk. Selama acara, kamu cukup menunjukkan gelang itu. Di aplikasi, gelang ini paling mirip apa?",
    options: [
      "Access token (JWT) yang dikirim di header `Authorization`",
      "Password yang dikirim di setiap request",
      "Isi tabel `users` di database",
      "File `.env` di server",
    ],
    answer: 0,
    explain:
      "Setelah login berhasil, server memberi access token (JWT). Aplikasi lalu mengirim token itu di header `Authorization` setiap kali meminta data, jadi password tidak perlu dikirim berulang-ulang. Seperti gelang konser, token punya masa berlaku. Setelah habis, kamu menukarnya lagi lewat refresh token.",
  },
  {
    q: "Access token berlaku 15 menit. Apa yang dilakukan `lib/api.ts` saat sebuah request mendapat `401` karena token sudah kedaluwarsa?",
    options: [
      "Langsung logout dan menghapus semua data lokal",
      "Mengirim ulang request yang sama dengan access token lama",
      "Memanggil `POST /api/auth/refresh` dengan refresh token, menyimpan pasangan token baru, lalu mengulang request sekali",
      "Meminta pengguna mengetik ulang password setiap 15 menit",
    ],
    answer: 2,
    explain:
      "Refresh token (berlaku 30 hari) ditukar dengan access token **dan** refresh token baru (rotasi). Setelah itu request awal diulang **sekali**. Kalau refresh juga gagal, misalnya token sudah dicabut, barulah pengguna di-logout dan diarahkan ke halaman login. Mirip gelang konser yang habis masa berlakunya: kamu tunjukkan kartu perpanjangan di loket, dapat gelang baru, lalu masuk lagi tanpa membeli tiket ulang.",
  },
  {
    q: "Apa yang tepat untuk mengganti `???` saat login?",
    code: `// saat register
const passwordHash = await bcrypt.hash(password, 10);
await prisma.user.create({ data: { name, email, passwordHash } });

// saat login
const user = await prisma.user.findUnique({ where: { email } });
const ok = ???;`,
    options: [
      "`user.passwordHash === password`",
      "`user.passwordHash === (await bcrypt.hash(password, 10))`",
      "`jwt.verify(password, user.passwordHash)`",
      "`await bcrypt.compare(password, user.passwordHash)`",
    ],
    answer: 3,
    explain:
      "bcrypt mencampur password dengan salt acak, jadi meng-hash password yang sama dua kali menghasilkan teks yang berbeda. Karena itu `===` tidak bisa dipakai. `bcrypt.compare` membaca salt dari hash yang tersimpan, lalu mencocokkan dengan cara yang benar. Database tidak pernah menyimpan password asli. Mirip blender: buah jadi jus dan tidak bisa dikembalikan. Untuk mengecek, bcrypt memblender password yang diketik dengan resep (salt) yang sama, lalu membandingkan jusnya.",
  },
  {
    q: "Pada upload foto ini, kenapa header `Content-Type` sengaja **tidak** ditulis manual?",
    code: `const form = new FormData();
form.append("file", {
  uri: asset.uri,
  name: "foto.jpg",
  type: "image/jpeg",
} as any);

await fetch(BASE_URL + "/api/tasks/1/attachments", {
  method: "POST",
  headers: { Authorization: "Bearer " + accessToken },
  body: form,
});`,
    options: [
      "`fetch` otomatis mengisi `multipart/form-data` beserta `boundary`; kalau ditulis manual tanpa boundary, server (multer) gagal membaca file",
      "Upload file memang tidak butuh `Content-Type`",
      "`Content-Type` hanya berlaku untuk request `GET`",
      "Server selalu menganggap semua body sebagai JSON",
    ],
    answer: 0,
    explain:
      "Body multipart berisi beberapa bagian yang dipisahkan teks penanda bernama `boundary`. `fetch` membuat penanda ini sendiri dan menuliskannya di header `Content-Type`. Kalau kamu menulis header itu manual, penandanya hilang dan server tidak tahu di mana file dimulai. Mirip kardus berisi beberapa barang: tanpa sekat dan label, petugas gudang bingung memisahkannya. Server juga membalas 413 kalau file lebih dari 5 MB, dan 415 kalau tipenya bukan jpeg/png/webp.",
  },
  {
    q: "Saat pengguna menekan **Simpan** di form tambah tugas, urutan alur data mana yang benar?",
    options: [
      "App → database → API → app",
      "App menulis langsung ke PostgreSQL memakai Prisma dari HP",
      "App (`useMutation`) → `POST /api/tasks` → validasi Zod → Prisma menyimpan ke database → respons 201 → cache di-invalidate dan daftar diperbarui",
      "API mengirim data ke app, lalu app meneruskannya ke database",
    ],
    answer: 2,
    explain:
      "Aplikasi di HP tidak pernah mengakses database langsung, karena kunci akses databasenya bisa bocor. Semua lewat API: API memvalidasi, mengecek hak akses, lalu menyimpan. Setelah itu aplikasi menyegarkan cache. Mirip di warung: pembeli memesan ke pelayan (API), bukan masuk sendiri ke dapur (database).",
  },
];

export default quiz;