import type { QuizQuestion } from "@/lib/quiz";

const quiz: QuizQuestion[] = [
  {
    q: "Apa keuntungan utama memakai `z.infer` pada schema bersama ini?",
    code: `import { z } from "zod";

export const TaskInputSchema = z.object({
  title: z.string().min(1).max(200),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
});

export type TaskInput = z.infer<typeof TaskInputSchema>;`,
    options: [
      "Validasi saat aplikasi berjalan jadi lebih cepat",
      "Server tidak perlu lagi menjalankan validasi",
      "Tipe TypeScript dibuat dari schema yang sama, jadi aturan validasi dan tipe di API maupun app selalu cocok",
      "Schema otomatis berubah menjadi tabel database",
    ],
    answer: 2,
    explain:
      "Dengan satu sumber aturan, mengubah schema (misalnya menambah status baru) langsung mengubah tipe di semua tempat. TypeScript lalu menandai kode yang belum disesuaikan. Mirip label toples bumbu yang dicetak dari satu daftar: ganti daftarnya, semua label ikut berganti. Validasi di server tetap wajib, karena tipe TypeScript hilang saat kode dijalankan.",
  },
  {
    q: "Apa manfaatnya `TaskService` menerima `TaskRepository` lewat constructor?",
    code: `class TaskService {
  constructor(private repo: TaskRepository) {}

  async complete(userId: number, id: number) {
    const task = await this.repo.findById(userId, id);
    if (!task) throw new HttpError(404, "NOT_FOUND", "Task tidak ditemukan");
    return this.repo.update(userId, id, { status: "DONE" });
  }
}`,
    options: [
      "Service bisa diuji dengan repository palsu tanpa database, dan Prisma bisa diganti tanpa mengubah logika bisnis",
      "Query Prisma jadi lebih cepat",
      "Service bisa langsung membaca `req` dan `res` dari Express",
      "TypeScript tidak mengizinkan `import` di dalam class",
    ],
    answer: 0,
    explain:
      "Ini disebut dependency injection: kebutuhan service diberikan dari luar. Service hanya tahu bentuk (**interface**) repository, tidak peduli isinya Prisma atau bukan. Saat unit test, kamu cukup mengirim repository palsu yang menyimpan data di memori. Mirip koki yang hanya butuh \"bahan sudah dipotong\": ia tidak peduli bahannya dari pasar atau supermarket. Urusan HTTP (`req`/`res`) tetap di controller.",
  },
  {
    q: "Untuk 50 task, berapa query database yang dijalankan kode ini, dan bagaimana memperbaikinya?",
    code: `const tasks = await prisma.task.findMany({ where: { userId }, take: 50 });

for (const task of tasks) {
  task.attachments = await prisma.attachment.findMany({
    where: { taskId: task.id },
  });
}`,
    options: [
      "1 query; kode ini sudah optimal",
      "2 query; cukup tambahkan index",
      "50 query; ganti dengan cursor pagination",
      "51 query (masalah N+1); ambil relasinya sekaligus dengan `include: { attachments: true }`",
    ],
    answer: 3,
    explain:
      "Ada 1 query untuk daftar task, lalu 1 query lagi untuk tiap task (N). Totalnya N+1 = 51 query. Dengan `include`, Prisma mengambil relasinya dalam jumlah query yang tetap, berapa pun jumlah task-nya. Mirip belanja 50 barang dengan bolak-balik ke warung untuk tiap barang, padahal bisa sekali jalan membawa daftar belanja. Index tetap berguna untuk kolom yang sering difilter, seperti `userId`.",
  },
  {
    q: "`TaskRow` sudah dibungkus `memo`, tapi tetap digambar ulang setiap kali `TaskList` digambar ulang. Apa penyebabnya?",
    code: `const TaskRow = memo(function TaskRow({ task, onToggle }: Props) {
  return <Pressable onPress={() => onToggle(task.id)}>...</Pressable>;
});

function TaskList({ tasks }: { tasks: Task[] }) {
  const onToggle = (id: number) => toggle.mutate(id);

  return (
    <FlashList
      data={tasks}
      renderItem={({ item }) => <TaskRow task={item} onToggle={onToggle} />}
    />
  );
}`,
    options: [
      "`memo` hanya bekerja pada class component",
      "`onToggle` adalah fungsi baru di setiap render, jadi prop-nya selalu dianggap berbeda; stabilkan dengan `useCallback`",
      "`FlashList` tidak mendukung komponen yang di-memo",
      "`task.id` bertipe number, bukan string",
    ],
    answer: 1,
    explain:
      "`memo` hanya melewati render kalau semua props sama persis dengan sebelumnya, dan yang dibandingkan adalah referensinya. Fungsi yang dibuat ulang setiap render selalu punya referensi baru, jadi `memo` tidak pernah melewati render. `useCallback` menjaga fungsi itu tetap sama (kecuali React Compiler sudah melakukannya otomatis). Mirip satpam yang mengecek nomor seri kartu, bukan tulisannya: kartu baru dengan tulisan sama tetap dianggap kartu lain. Ukur dulu dengan Profiler sebelum mengoptimasi.",
  },
  {
    q: "Route ini sudah dilindungi middleware auth. Celah apa yang masih ada?",
    code: `router.get("/tasks/:id", async (req, res) => {
  const task = await prisma.task.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (!task) throw new HttpError(404, "NOT_FOUND", "Task tidak ditemukan");
  res.json({ data: task });
});`,
    options: [
      "SQL injection, karena `req.params.id` tidak di-escape",
      "XSS, karena respons berformat JSON",
      "BOLA/IDOR: user yang login bisa membaca task milik user lain hanya dengan mengganti id; query harus ikut memfilter `userId: req.userId`",
      "Tidak ada celah, karena route sudah memakai autentikasi",
    ],
    answer: 2,
    explain:
      "Autentikasi hanya memastikan **siapa** yang meminta, bukan apakah ia **berhak** atas data itu. Pakai `findFirst({ where: { id, userId: req.userId } })`, lalu balas 404 supaya orang lain tidak tahu data itu ada. Mirip kos-kosan: satpam memastikan kamu penghuni, tapi kuncimu hanya boleh membuka kamarmu sendiri, bukan kamar sebelah. Prisma sudah memakai parameterized query, jadi aman dari SQL injection.",
  },
  {
    q: "Seseorang mencoba menebak password akun temanmu dengan ribuan kombinasi dalam beberapa menit. Pengaman API mana yang paling langsung menghentikan ini?",
    options: [
      "Rate limit di route login, yang membalas 429 setelah terlalu banyak percobaan",
      "Mengizinkan CORS untuk semua domain",
      "Menambah index di kolom `email`",
      "Menyimpan password di variabel `EXPO_PUBLIC_`",
    ],
    answer: 0,
    explain:
      "Rate limit membatasi jumlah request dari satu sumber dalam waktu tertentu, misalnya 20 percobaan per 15 menit. Setelah batas habis, server membalas `429 Too Many Requests`, jadi menebak ribuan password butuh waktu sangat lama. Mirip batas nomor antrean di loket: kalau kuota hari ini habis, kamu diminta datang lagi nanti. CORS hanya mengatur web mana yang boleh memanggil API dari browser, dan index hanya mempercepat pencarian.",
  },
  {
    q: "Test ini termasuk jenis apa, dan kenapa `app` diekspor terpisah dari `app.listen()`?",
    code: `import request from "supertest";
import { app } from "../src/app";

it("menolak task tanpa judul", async () => {
  const res = await request(app)
    .post("/api/tasks")
    .set("Authorization", "Bearer " + token)
    .send({ title: "" });

  expect(res.status).toBe(400);
  expect(res.body.error.code).toBe("VALIDATION_ERROR");
});`,
    options: [
      "Integration test; Supertest mengirim request langsung ke app Express tanpa membuka port, jadi `app` harus bisa diimpor tanpa memanggil `listen`",
      "Unit test, karena hanya menguji satu fungsi Zod",
      "E2E test, karena menjalankan aplikasi mobile di emulator",
      "Load test, untuk mengukur berapa request per detik yang sanggup dilayani API",
    ],
    answer: 0,
    explain:
      "Test ini melewati router, middleware auth, validasi, dan error handler sekaligus, jadi termasuk integration test. Pisahkan `app.ts` (membuat app) dari `server.ts` (memanggil `listen`), lalu pakai database khusus test supaya hasilnya konsisten. Mirip mencicipi satu porsi utuh sebelum disajikan, bukan hanya mencicipi sambalnya saja (itu unit test).",
  },
  {
    q: "Apa yang diuji kode React Native Testing Library ini?",
    code: `const onSubmit = jest.fn();
render(<TaskForm onSubmit={onSubmit} />);

fireEvent.press(screen.getByText("Simpan"));

expect(await screen.findByText("Judul wajib diisi")).toBeTruthy();
expect(onSubmit).not.toHaveBeenCalled();`,
    options: [
      "Warna dan ukuran piksel tombol Simpan",
      "Bahwa API mengembalikan status 400",
      "Kecepatan render form dalam milidetik",
      "Saat form kosong dikirim, pesan validasi muncul dan `onSubmit` tidak dipanggil, diuji dari sudut pandang pengguna",
    ],
    answer: 3,
    explain:
      "RNTL menguji seperti pengguna sungguhan: mencari elemen lewat teks yang terlihat, lalu menekan tombol. `onSubmit` adalah fungsi tiruan (mock), jadi kita bisa memastikan form tidak mengirim data yang salah. Mirip tester yang mencoba aplikasi sambil melihat layar, bukan membongkar mesinnya. Alur lintas layar sungguhan diuji dengan E2E seperti Maestro.",
  },
  {
    q: "Pengguna mengubah status tugas menjadi `DONE` saat sedang offline. Pendekatan offline-first mana yang tepat?",
    options: [
      "Menonaktifkan semua tombol sampai HP online kembali",
      "Perbarui layar langsung (optimistic), simpan perubahan di antrean yang tetap ada walau aplikasi ditutup, kirim saat NetInfo mendeteksi online, lalu tangani konflik (misalnya dengan `updatedAt`)",
      "Menyimpan perubahan hanya di state React, yang hilang saat aplikasi ditutup",
      "Menulis langsung ke database server melalui SQLite di HP",
    ],
    answer: 1,
    explain:
      "Offline-first artinya data di HP menjadi sumber tampilan. TanStack Query bisa menahan mutation saat offline (`onlineManager`), menyimpan cache dan antreannya, lalu melanjutkan saat online. Kalau data yang sama diubah di dua tempat, perlu aturan, misalnya perubahan terakhir yang menang berdasarkan `updatedAt`. Mirip mencatat di buku saat sinyal hilang, lalu menyalinnya ke grup begitu sinyal kembali.",
  },
  {
    q: "Kenapa fungsi cleanup `socket.off(...)` di efek ini penting?",
    code: `useEffect(() => {
  const onChanged = () =>
    queryClient.invalidateQueries({ queryKey: ["tasks"] });

  socket.on("task:updated", onChanged);
  return () => {
    socket.off("task:updated", onChanged);
  };
}, [queryClient]);`,
    options: [
      "Tanpa cleanup, setiap kali komponen dipasang ulang, listener baru bertambah, jadi handler jalan berkali-kali dan memori bocor",
      "Agar socket terhubung lebih cepat",
      "Karena `socket.on` hanya boleh dipanggil sekali seumur aplikasi",
      "Agar server berhenti mengirim event ke semua pengguna",
    ],
    answer: 0,
    explain:
      "Listener Socket.IO hidup di luar siklus React. Cleanup melepas listener saat komponen hilang dari layar atau dependency berubah. Tanpa cleanup, listener terus menumpuk. Mirip memasang alarm baru setiap pagi tanpa mematikan yang lama: lama-lama satu jam berbunyi lima kali. Pola ini juga menunjukkan sinkronisasi real-time: event dari server cukup meng-invalidate cache, lalu TanStack Query mengambil data terbaru.",
  },
  {
    q: "Kamu (1) memperbaiki typo pada teks layar, dan (2) menambahkan library yang punya kode native baru. Pernyataan mana yang benar?",
    options: [
      "Keduanya cukup dikirim dengan `eas update`",
      "Keduanya wajib build baru dan melewati review toko aplikasi",
      "Typo cukup lewat `eas update` (OTA), sedangkan library native butuh `eas build` baru",
      "Typo butuh `eas build`, sedangkan library native cukup lewat `eas update`",
    ],
    answer: 2,
    explain:
      "EAS Update hanya mengirim kode JavaScript dan aset ke aplikasi yang `runtimeVersion`-nya cocok. Kode native ikut dirakit ke dalam file aplikasi, jadi perubahannya butuh EAS Build baru. Mirip warung: mengganti tulisan di papan menu cukup dihapus lalu ditulis ulang (update), tapi menambah kompor baru berarti renovasi dapur (build). GitHub Actions bisa menjalankan lint, test, lalu update atau build secara otomatis.",
  },
];

export default quiz;