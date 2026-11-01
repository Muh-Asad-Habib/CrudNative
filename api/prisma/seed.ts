// Seed data contoh untuk development. Aman dijalankan berulang kali:
// semua tabel dikosongkan dulu, lalu diisi ulang.
// Jalankan: npm run db:seed
import { hashPassword } from "../src/lib/password.ts";
import { prisma } from "../src/lib/prisma.ts";
import { removeUploadedFile } from "../src/lib/storage.ts";

const DAY = 24 * 60 * 60 * 1000;

// Deadline relatif terhadap hari ini (jam 23:59), supaya data selalu terlihat "segar".
function daysFromNow(days: number): Date {
  const date = new Date(Date.now() + days * DAY);
  date.setHours(23, 59, 0, 0);
  return date;
}

async function clearDatabase() {
  // File lampiran lama ikut dihapus dari folder uploads.
  const attachments = await prisma.attachment.findMany({ select: { url: true } });
  await Promise.all(attachments.map((attachment) => removeUploadedFile(attachment.url)));

  // Urutan dari tabel "anak" ke "induk" karena ada foreign key.
  await prisma.attachment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.course.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  await clearDatabase();

  const user = await prisma.user.create({
    data: {
      name: "Mahasiswa Demo",
      email: "demo@kampus.ac.id",
      passwordHash: await hashPassword("password123"),
    },
  });

  const basisData = await prisma.course.create({
    data: { userId: user.id, name: "Basis Data", code: "IF2240", lecturer: "Dr. Rina Kusuma", color: "#4F46E5" },
  });
  const mobile = await prisma.course.create({
    data: { userId: user.id, name: "Pemrograman Mobile", code: "IF3150", lecturer: "Budi Santoso, M.Kom.", color: "#EA580C" },
  });
  const jarkom = await prisma.course.create({
    data: { userId: user.id, name: "Jaringan Komputer", code: "IF3130", lecturer: "Ir. Agus Wijaya, M.T.", color: "#16A34A" },
  });

  const tasks = [
    {
      title: "Rancang ERD sistem perpustakaan",
      description: "Minimal 6 entitas, lengkap dengan kardinalitas relasi.",
      deadline: daysFromNow(-5),
      status: "DONE",
      priority: "HIGH",
      courseId: basisData.id,
    },
    {
      title: "Latihan query JOIN dan GROUP BY",
      description: "Kerjakan soal nomor 1-15 dari modul praktikum 4.",
      deadline: daysFromNow(2),
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      courseId: basisData.id,
    },
    {
      title: "Normalisasi tabel sampai 3NF",
      description: null,
      deadline: daysFromNow(9),
      status: "TODO",
      priority: "LOW",
      courseId: basisData.id,
    },
    {
      title: "Bikin layar login dengan React Native",
      description: "Pakai TextInput, validasi sederhana, dan tombol loading.",
      deadline: daysFromNow(-1),
      status: "IN_PROGRESS",
      priority: "HIGH",
      courseId: mobile.id,
    },
    {
      title: "Integrasi aplikasi dengan REST API",
      description: "Hubungkan daftar tugas ke endpoint GET /api/tasks.",
      deadline: daysFromNow(4),
      status: "TODO",
      priority: "HIGH",
      courseId: mobile.id,
    },
    {
      title: "Laporan praktikum navigasi Expo Router",
      description: "Sertakan screenshot stack dan tab navigation.",
      deadline: daysFromNow(-10),
      status: "DONE",
      priority: "MEDIUM",
      courseId: mobile.id,
    },
    {
      title: "Konfigurasi subnetting kelas C",
      description: "Bagi 192.168.10.0/24 menjadi 6 subnet.",
      deadline: daysFromNow(1),
      status: "TODO",
      priority: "MEDIUM",
      courseId: jarkom.id,
    },
    {
      title: "Simulasi routing statis di Packet Tracer",
      description: "Topologi 3 router, kumpulkan file .pkt.",
      deadline: daysFromNow(14),
      status: "TODO",
      priority: "LOW",
      courseId: jarkom.id,
    },
    {
      title: "Baca materi model OSI vs TCP/IP",
      description: "Persiapan kuis minggu depan.",
      deadline: null, // tugas tanpa deadline
      status: "TODO",
      priority: "LOW",
      courseId: jarkom.id,
    },
    {
      title: "Daftar ulang semester dan isi KRS",
      description: "Jangan lupa minta tanda tangan dosen wali.",
      deadline: daysFromNow(3),
      status: "TODO",
      priority: "HIGH",
      courseId: null, // tugas tanpa mata kuliah
    },
  ];

  for (const task of tasks) {
    await prisma.task.create({ data: { ...task, userId: user.id } });
  }

  console.log("Seed selesai:");
  console.log(`  User   : ${user.email} / password123`);
  console.log(`  Course : ${await prisma.course.count()} mata kuliah`);
  console.log(`  Task   : ${await prisma.task.count()} tugas`);
}

try {
  await main();
} catch (error) {
  console.error("Seed gagal:", error);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
