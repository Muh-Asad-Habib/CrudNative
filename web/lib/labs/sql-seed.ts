/** Skema + data awal untuk SQL Playground (SQLite). Selaras dengan model capstone. */
export const SQL_SEED = `
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  lecturer TEXT,
  sks INTEGER NOT NULL DEFAULT 2
);

CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER REFERENCES courses(id) ON DELETE SET NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  done INTEGER NOT NULL DEFAULT 0,
  priority TEXT NOT NULL DEFAULT 'sedang',
  due_date TEXT
);

INSERT INTO users (name, email) VALUES
  ('Andi Pratama', 'andi@kampus.ac.id'),
  ('Sari Wulandari', 'sari@kampus.ac.id'),
  ('Budi Santoso', 'budi@kampus.ac.id');

INSERT INTO courses (user_id, name, lecturer, sks) VALUES
  (1, 'Basis Data', 'Dr. Rina', 3),
  (1, 'Pemrograman Mobile', 'Pak Hendra', 3),
  (1, 'Jaringan Komputer', 'Bu Maya', 2),
  (2, 'Basis Data', 'Dr. Rina', 3),
  (2, 'Rekayasa Perangkat Lunak', 'Pak Dimas', 3);

INSERT INTO tasks (course_id, user_id, title, done, priority, due_date) VALUES
  (1, 1, 'Desain ERD perpustakaan', 1, 'tinggi', '2025-03-01'),
  (1, 1, 'Normalisasi tabel sampai 3NF', 0, 'tinggi', '2025-03-08'),
  (2, 1, 'Install Expo & jalankan di HP', 1, 'sedang', '2025-03-02'),
  (2, 1, 'Buat layar daftar tugas', 0, 'sedang', '2025-03-10'),
  (3, 1, 'Laporan praktikum subnetting', 0, 'rendah', '2025-03-12'),
  (4, 2, 'Query JOIN tiga tabel', 0, 'tinggi', '2025-03-05'),
  (5, 2, 'Dokumen SRS bab 1', 1, 'sedang', '2025-02-28'),
  (NULL, 2, 'Beli buku catatan', 0, 'rendah', NULL);
`;

export const SQL_PRESETS: { label: string; sql: string }[] = [
  { label: "Semua tugas", sql: "SELECT * FROM tasks;" },
  { label: "Filter WHERE", sql: "SELECT id, title, priority\nFROM tasks\nWHERE done = 0 AND priority = 'tinggi';" },
  { label: "ORDER & LIMIT", sql: "SELECT title, due_date\nFROM tasks\nWHERE due_date IS NOT NULL\nORDER BY due_date ASC\nLIMIT 3;" },
  {
    label: "JOIN",
    sql: "SELECT t.title, c.name AS mata_kuliah, u.name AS pemilik\nFROM tasks t\nJOIN courses c ON c.id = t.course_id\nJOIN users u ON u.id = t.user_id;",
  },
  {
    label: "GROUP BY",
    sql: "SELECT u.name, COUNT(t.id) AS jumlah_tugas, SUM(t.done) AS selesai\nFROM users u\nLEFT JOIN tasks t ON t.user_id = u.id\nGROUP BY u.id;",
  },
  { label: "INSERT", sql: "INSERT INTO tasks (user_id, course_id, title, priority)\nVALUES (1, 2, 'Integrasi API ke aplikasi', 'tinggi');\n\nSELECT * FROM tasks ORDER BY id DESC LIMIT 1;" },
  { label: "UPDATE", sql: "UPDATE tasks SET done = 1 WHERE id = 2;\n\nSELECT id, title, done FROM tasks WHERE id = 2;" },
  { label: "DELETE", sql: "DELETE FROM tasks WHERE done = 1;\n\nSELECT COUNT(*) AS sisa FROM tasks;" },
];

export const SQL_TABLES = [
  { name: "users", columns: ["id", "name", "email", "created_at"] },
  { name: "courses", columns: ["id", "user_id", "name", "lecturer", "sks"] },
  { name: "tasks", columns: ["id", "course_id", "user_id", "title", "done", "priority", "due_date"] },
];
