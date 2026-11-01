import { networkInterfaces } from "node:os";
import { createApp } from "./app.ts";
import { env } from "./config/env.ts";
import { prisma } from "./lib/prisma.ts";

// Alamat IPv4 di jaringan lokal, dipakai HP/emulator untuk mengakses API dari laptop.
function lanAddresses(): string[] {
  return Object.values(networkInterfaces())
    .flatMap((nets) => nets ?? [])
    .filter((net) => net.family === "IPv4" && !net.internal)
    .map((net) => net.address);
}

const app = createApp();

// 0.0.0.0 = menerima koneksi dari semua network interface, bukan hanya localhost.
const server = app.listen(env.PORT, "0.0.0.0", (error) => {
  if (error) {
    console.error(`Gagal menjalankan server di port ${env.PORT}:`, error.message);
    process.exit(1);
  }

  console.log(`API berjalan di http://localhost:${env.PORT}/api`);
  for (const address of lanAddresses()) {
    console.log(`  Dari HP di Wi-Fi yang sama: http://${address}:${env.PORT}/api`);
  }
  console.log(`  Dari emulator Android:      http://10.0.2.2:${env.PORT}/api`);
});

// Tutup server & koneksi database dengan rapi saat proses dihentikan (Ctrl+C).
function shutdown() {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
