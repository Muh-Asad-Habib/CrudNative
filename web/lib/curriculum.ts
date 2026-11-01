/**
 * Registry kurikulum — SATU-SATUNYA sumber kebenaran untuk urutan, judul,
 * dan metadata pelajaran. Konten tiap pelajaran ada di
 * `content/<trackSlug>/<lessonSlug>.mdx`.
 */

export type Level = "pemula" | "menengah" | "mahir" | "expert";
export type CodeLang = "js" | "ts";
export type TrackIconKey = "foundation" | "database" | "smartphone" | "workflow" | "rocket";

export interface LessonMeta {
  slug: string;
  title: string;
  description: string;
  minutes: number;
  level: Level;
  lang: CodeLang;
  objectives: string[];
  keywords: string[];
}

export interface Track {
  slug: string;
  number: number;
  title: string;
  shortTitle: string;
  description: string;
  outcome: string;
  icon: TrackIconKey;
  lessons: LessonMeta[];
}

export interface Lesson extends LessonMeta {
  id: string; // "<track>/<lesson>"
  href: string;
  trackSlug: string;
  trackTitle: string;
  trackNumber: number;
  index: number; // posisi dalam track (0-based)
  globalIndex: number; // posisi dalam seluruh kurikulum (0-based)
}

export const LEVEL_LABEL: Record<Level, string> = {
  pemula: "Pemula",
  menengah: "Menengah",
  mahir: "Mahir",
  expert: "Expert",
};

export const tracks: Track[] = [
  {
    slug: "fondasi",
    number: 0,
    title: "Fondasi Web & JavaScript",
    shortTitle: "Fondasi",
    description:
      "Kamu menyiapkan laptop dan HP, memahami cara aplikasi meminta data ke server, lalu belajar JavaScript, bahasa yang dipakai di seluruh kursus.",
    outcome: "Kamu bisa menulis program JavaScript sederhana dan menjelaskan apa yang terjadi saat aplikasi meminta data ke server.",
    icon: "foundation",
    lessons: [
      {
        slug: "selamat-datang",
        title: "Selamat Datang & Cara Belajar",
        description: "Kamu melihat urutan materi, cara memakai situs ini, dan proyek latihan yang akan kamu buat di akhir kursus.",
        minutes: 10,
        level: "pemula",
        lang: "js",
        objectives: [
          "Mengenal proyek latihan yang akan kamu buat: aplikasi Tugas & Catatan Kuliah",
          "Mencoba fitur situs: playground kode, kuis, latihan, dan halaman progres",
          "Menyusun jadwal belajar rutin yang realistis",
        ],
        keywords: ["pengantar", "roadmap", "capstone", "cara belajar", "peta belajar", "mulai dari mana"],
      },
      {
        slug: "setup-tools",
        title: "Menyiapkan Tools",
        description: "Kamu memasang program yang dibutuhkan di laptop dan HP, lalu menjalankan kode JavaScript pertamamu.",
        minutes: 25,
        level: "pemula",
        lang: "js",
        objectives: [
          "Memasang Node.js (penjalan JavaScript), VS Code (editor kode), dan Git (pencatat perubahan)",
          "Mengetik perintah dasar di terminal (jendela perintah berbasis teks)",
          "Memasang Expo Go di HP untuk mencoba aplikasi buatanmu",
        ],
        keywords: ["node", "npm", "vscode", "git", "terminal", "expo go", "instalasi", "pasang aplikasi", "persiapan laptop"],
      },
      {
        slug: "cara-kerja-web",
        title: "Cara Kerja Web: Client, Server, HTTP",
        description: "Kamu memahami apa yang terjadi saat aplikasi meminta data ke server, mirip memesan makanan lewat pelayan warung.",
        minutes: 20,
        level: "pemula",
        lang: "js",
        objectives: [
          "Menjelaskan peran client, server, dan database dengan contoh warung makan",
          "Membaca bagian-bagian alamat URL dan isi sebuah request HTTP",
          "Membaca data JSON, format teks berisi pasangan nama dan nilai",
        ],
        keywords: ["client", "server", "http", "url", "json", "request", "response", "cara kerja internet", "alamat web"],
      },
      {
        slug: "javascript-modern-1",
        title: "JavaScript Modern 1: Variabel, Fungsi, Array & Object",
        description: "Kamu belajar menyimpan nilai di variabel, menulis fungsi, dan mengolah daftar data dengan map dan filter.",
        minutes: 35,
        level: "pemula",
        lang: "js",
        objectives: [
          "Menyimpan nilai dengan let dan const, serta mengenal tipe data dasar",
          "Menulis fungsi biasa dan arrow function (fungsi versi singkat)",
          "Mengolah array (daftar data) dengan map, filter, find, dan reduce",
          "Membuat object untuk menyimpan data berlabel, lalu membaca isinya",
        ],
        keywords: ["variabel", "let", "const", "arrow function", "array", "map", "filter", "reduce", "object", "fungsi", "daftar data"],
      },
      {
        slug: "javascript-modern-2",
        title: "JavaScript Modern 2: Destructuring, Spread & Modules",
        description: "Kamu belajar cara singkat mengambil, menyalin, dan menggabungkan data, serta membagi kode ke beberapa file.",
        minutes: 30,
        level: "pemula",
        lang: "js",
        objectives: [
          "Mengambil isi object dan array sekaligus dengan destructuring",
          "Menyalin dan menggabungkan data dengan spread tanpa mengubah data asli",
          "Membaca data yang mungkin kosong tanpa error memakai ?. dan ??",
          "Membagi kode ke beberapa file dengan import dan export",
        ],
        keywords: ["destructuring", "spread", "rest", "optional chaining", "module", "import", "export", "immutable", "salin data", "bagi file"],
      },
      {
        slug: "async-javascript",
        title: "Asynchronous JavaScript: Promise, async/await & fetch",
        description: "Kamu belajar menulis kode yang menunggu data tanpa membuat aplikasi macet, lalu mengambil data dari API sungguhan.",
        minutes: 35,
        level: "pemula",
        lang: "js",
        objectives: [
          "Menjelaskan secara sederhana cara JavaScript mengatur antrean tugas (event loop)",
          "Membuat dan memakai Promise, janji bahwa hasil akan datang nanti",
          "Menulis async/await dan menangkap error dengan try/catch",
          "Mengambil data JSON dari internet dengan fetch",
        ],
        keywords: ["async", "await", "promise", "fetch", "event loop", "try catch", "asinkron", "menunggu data"],
      },
    ],
  },
  {
    slug: "crud-backend",
    number: 1,
    title: "CRUD & Backend dengan Express",
    shortTitle: "CRUD & Backend",
    description:
      "Kamu belajar empat operasi data (tambah, lihat, ubah, hapus), dasar database, lalu membuat server API sendiri dengan Express dan Prisma.",
    outcome: "Kamu bisa membuat API yang menyimpan data ke database, menolak input yang salah, dan mengirim data per halaman.",
    icon: "database",
    lessons: [
      {
        slug: "konsep-crud",
        title: "Konsep CRUD",
        description: "Kamu mengenal CRUD, empat operasi data (tambah, lihat, ubah, hapus), lewat contoh kontak di HP.",
        minutes: 15,
        level: "pemula",
        lang: "js",
        objectives: [
          "Menjelaskan arti Create, Read, Update, Delete dengan bahasa sendiri",
          "Menemukan CRUD di aplikasi sehari-hari, misalnya kontak HP atau catatan",
          "Mencoba keempat operasi CRUD di simulator interaktif",
        ],
        keywords: ["crud", "create", "read", "update", "delete", "simulator", "tambah data", "ubah data", "hapus data"],
      },
      {
        slug: "rest-api-http",
        title: "REST API, Method & Status Code",
        description: "Kamu belajar memilih method HTTP yang tepat, menyusun alamat API yang rapi, dan membaca kode status.",
        minutes: 30,
        level: "pemula",
        lang: "js",
        objectives: [
          "Mencocokkan operasi CRUD dengan method HTTP seperti GET, POST, dan DELETE",
          "Menyusun endpoint (alamat tujuan request) yang rapi dan mudah ditebak",
          "Memilih status code (kode hasil request) yang tepat: 200, 201, 204, 400, 404, 500",
        ],
        keywords: ["rest", "api", "endpoint", "get", "post", "put", "patch", "delete", "status code", "http", "alamat api", "kode status"],
      },
      {
        slug: "dasar-sql",
        title: "Dasar SQL & Database",
        description: "Kamu belajar menyimpan dan mencari data di tabel database dengan perintah SQL, langsung di browser.",
        minutes: 35,
        level: "pemula",
        lang: "js",
        objectives: [
          "Memahami tabel, baris, kolom, dan primary key (nomor unik seperti NIM)",
          "Menambah, membaca, mengubah, dan menghapus data dengan INSERT, SELECT, UPDATE, DELETE",
          "Menyaring dan mengurutkan data dengan WHERE dan ORDER BY",
        ],
        keywords: ["sql", "database", "tabel", "select", "insert", "update", "delete", "where", "sqlite", "tabel data", "perintah sql"],
      },
      {
        slug: "relasi-join",
        title: "Relasi Tabel & JOIN",
        description: "Kamu belajar menghubungkan dua tabel, misalnya mata kuliah dan tugasnya, lalu menggabungkan isinya dengan JOIN.",
        minutes: 35,
        level: "menengah",
        lang: "js",
        objectives: [
          "Merancang relasi one-to-many (satu ke banyak) dan many-to-many (banyak ke banyak)",
          "Memakai foreign key (rujukan ke baris di tabel lain) agar data tetap konsisten",
          "Menggabungkan dua tabel dengan INNER JOIN dan LEFT JOIN",
        ],
        keywords: ["relasi", "foreign key", "join", "one to many", "many to many", "erd", "hubungan tabel", "gabung tabel"],
      },
      {
        slug: "express-dasar",
        title: "Dasar Express.js",
        description: "Kamu membuat server pertamamu dengan Express yang bisa menerima permintaan dan mengirim balasan.",
        minutes: 30,
        level: "pemula",
        lang: "js",
        objectives: [
          "Membuat server Express dan menjalankannya di laptop",
          "Membuat route (alamat yang dilayani server), termasuk parameter dan query string",
          "Memakai middleware (pemeriksa request, mirip satpam gerbang) seperti express.json()",
        ],
        keywords: ["express", "server", "route", "middleware", "req", "res", "node", "membuat server", "rute"],
      },
      {
        slug: "crud-in-memory",
        title: "CRUD API dengan Data In-Memory",
        description: "Kamu membuat API yang bisa menambah, melihat, mengubah, dan menghapus data yang disimpan sementara di array, lalu mengujinya.",
        minutes: 40,
        level: "menengah",
        lang: "js",
        objectives: [
          "Membuat 5 endpoint CRUD: daftar, detail, tambah, ubah, hapus",
          "Mengirim status code yang sesuai dengan hasil tiap request",
          "Menguji API dengan Thunder Client atau curl (alat pengirim request)",
        ],
        keywords: ["crud", "express", "api", "in memory", "array", "thunder client", "curl", "data sementara", "uji api"],
      },
      {
        slug: "prisma-sqlite",
        title: "Database Sungguhan dengan Prisma + SQLite",
        description: "Kamu memindahkan data dari array ke database SQLite memakai Prisma, jadi data tidak hilang saat server mati.",
        minutes: 45,
        level: "menengah",
        lang: "js",
        objectives: [
          "Menulis schema Prisma (rancangan tabel) dan menjalankan migrasi (perubahan struktur database)",
          "Menambah, membaca, mengubah, dan menghapus data dengan Prisma Client",
          "Membuat relasi antar tabel dan mengisi data contoh (seed)",
        ],
        keywords: ["prisma", "orm", "sqlite", "migrasi", "schema", "seed", "database", "simpan permanen", "data contoh"],
      },
      {
        slug: "validasi-error-handling",
        title: "Validasi dengan Zod & Error Handling",
        description: "Kamu memakai Zod untuk menolak data yang salah, lalu membalas setiap error dengan pesan yang jelas.",
        minutes: 35,
        level: "menengah",
        lang: "js",
        objectives: [
          "Memeriksa isi request (body dan params) dengan Zod sebelum dipakai",
          "Membuat satu middleware penanganan error untuk seluruh API",
          "Membuat format pesan error yang sama di semua endpoint",
        ],
        keywords: ["zod", "validasi", "error handling", "middleware", "400", "422", "cek input", "pesan error"],
      },
      {
        slug: "pagination-filter-search",
        title: "Pagination, Filter, Search & Sort",
        description: "Kamu belajar mengirim data per halaman, mirip halaman buku, dan membiarkan pengguna mencari, menyaring, serta mengurutkan data.",
        minutes: 35,
        level: "menengah",
        lang: "js",
        objectives: [
          "Membagi data per halaman dengan page dan limit (pagination offset)",
          "Menambah filter, pencarian, dan urutan lewat query string di URL",
          "Mengirim info halaman: halaman sekarang, total data, dan jumlah halaman (meta)",
        ],
        keywords: ["pagination", "filter", "search", "sort", "query string", "limit", "offset", "per halaman", "cari data", "urutkan"],
      },
      {
        slug: "struktur-proyek-backend",
        title: "Struktur Proyek, Env, CORS & Logging",
        description: "Kamu merapikan kode API ke beberapa folder, menyimpan rahasia di file .env, dan mencatat setiap request yang masuk.",
        minutes: 35,
        level: "menengah",
        lang: "js",
        objectives: [
          "Membagi kode ke routes, controllers, dan services, seperti dapur dibagi per stasiun",
          "Menyimpan pengaturan dan rahasia di environment variable, bukan di dalam kode",
          "Mengaktifkan CORS (izin bagi situs lain memanggil API) dan mencatat setiap request",
        ],
        keywords: ["struktur", "folder", "controller", "service", "env", "dotenv", "cors", "logging", "rapikan folder", "rahasia", "pengaturan"],
      },
    ],
  },
  {
    slug: "react-native",
    number: 2,
    title: "React & React Native dengan Expo",
    shortTitle: "React & RN",
    description:
      "Kamu belajar React untuk menyusun tampilan dari potongan kecil, lalu membuat aplikasi HP dengan banyak layar, form, dan daftar data.",
    outcome: "Kamu bisa membuat aplikasi HP dengan beberapa layar yang terasa seperti aplikasi bawaan Android atau iPhone.",
    icon: "smartphone",
    lessons: [
      {
        slug: "dasar-react",
        title: "Dasar React: Komponen, JSX & Props",
        description: "Kamu belajar menyusun tampilan dari komponen kecil, seperti merakit LEGO, lalu mengirim data ke komponen lewat props.",
        minutes: 30,
        level: "pemula",
        lang: "js",
        objectives: [
          "Menulis komponen fungsi dengan JSX (tulisan mirip HTML di dalam JavaScript)",
          "Mengirim data ke komponen lewat props (masukan untuk komponen)",
          "Menyusun tampilan dari komponen kecil yang bisa dipakai ulang",
        ],
        keywords: ["react", "komponen", "jsx", "props", "children", "tampilan", "pakai ulang"],
      },
      {
        slug: "state-event",
        title: "State & Event",
        description: "Kamu membuat tampilan yang berubah saat diklik atau diketik, memakai useState untuk mengingat nilai.",
        minutes: 35,
        level: "pemula",
        lang: "js",
        objectives: [
          "Menyimpan nilai yang bisa berubah dengan useState, seperti papan skor",
          "Menangani klik tombol dan ketikan di kolom input",
          "Mengubah array atau object di state dengan membuat salinan baru (immutable)",
        ],
        keywords: ["state", "usestate", "event", "onclick", "onchange", "immutable", "klik", "interaktif"],
      },
      {
        slug: "effect-list-custom-hook",
        title: "useEffect, List & Custom Hook",
        description: "Kamu memakai useEffect untuk mengambil data saat layar muncul, menampilkan daftar, dan membuat hook buatan sendiri.",
        minutes: 35,
        level: "menengah",
        lang: "js",
        objectives: [
          "Menentukan kapan perlu useEffect, kode yang jalan setelah tampilan muncul",
          "Menampilkan daftar dengan key, tanda pengenal unik tiap item",
          "Membuat custom hook seperti useFetch, resep yang bisa dipakai ulang",
        ],
        keywords: ["useeffect", "list", "key", "custom hook", "fetch", "loading", "ambil data", "daftar"],
      },
      {
        slug: "intro-react-native-expo",
        title: "Pengenalan React Native & Expo",
        description: "Kamu mengenal beda React Native dengan web, lalu membuat proyek Expo pertama dan menjalankannya di HP.",
        minutes: 30,
        level: "pemula",
        lang: "js",
        objectives: [
          "Menjelaskan cara React Native mengubah kode JavaScript jadi tampilan asli HP",
          "Membuat proyek baru dengan perintah create-expo-app",
          "Menjalankan aplikasi di HP lewat Expo Go",
        ],
        keywords: ["react native", "expo", "expo go", "create-expo-app", "metro", "aplikasi hp", "proyek pertama"],
      },
      {
        slug: "core-components",
        title: "Komponen Inti React Native",
        description: "Kamu mengenal komponen dasar untuk membuat layar HP: kotak, teks, gambar, tombol, kolom input, dan area gulir.",
        minutes: 35,
        level: "pemula",
        lang: "js",
        objectives: [
          "Memakai View (kotak), Text, Image, dan ScrollView (area yang bisa digulir)",
          "Membuat tombol yang bisa ditekan dengan Pressable",
          "Menerima ketikan pengguna dengan TextInput",
        ],
        keywords: ["view", "text", "image", "pressable", "textinput", "scrollview", "komponen", "tombol", "gambar", "teks"],
      },
      {
        slug: "styling-flexbox",
        title: "Styling & Flexbox",
        description: "Kamu belajar mengatur warna, ukuran, dan posisi elemen dengan StyleSheet dan Flexbox, supaya rapi di HP kecil maupun besar.",
        minutes: 35,
        level: "pemula",
        lang: "js",
        objectives: [
          "Menulis style (warna, ukuran, jarak) dengan StyleSheet",
          "Mengatur arah dan posisi elemen dengan flexDirection, justifyContent, alignItems, gap",
          "Membuat tampilan yang tetap rapi di berbagai ukuran layar",
        ],
        keywords: ["stylesheet", "flexbox", "layout", "flexdirection", "justifycontent", "alignitems", "responsif", "tata letak", "warna", "ukuran layar"],
      },
      {
        slug: "flatlist",
        title: "List Performan dengan FlatList",
        description: "Kamu menampilkan ratusan data tanpa membuat HP lambat, lengkap dengan tarik-untuk-refresh dan data yang dimuat saat menggulir.",
        minutes: 35,
        level: "menengah",
        lang: "js",
        objectives: [
          "Menampilkan data dengan FlatList dan keyExtractor (penentu id tiap item)",
          "Menambahkan tarik-untuk-refresh dan pesan saat daftar masih kosong",
          "Memuat data berikutnya otomatis saat sampai di bawah (onEndReached)",
        ],
        keywords: ["flatlist", "list", "refresh", "infinite scroll", "sectionlist", "performa", "daftar panjang", "gulir", "tarik refresh"],
      },
      {
        slug: "expo-router",
        title: "Navigasi dengan Expo Router",
        description: "Kamu membuat aplikasi multi-layar dengan Expo Router: setiap file di folder app/ otomatis menjadi satu layar.",
        minutes: 40,
        level: "menengah",
        lang: "js",
        objectives: [
          "Memahami cara satu file di folder app/ menjadi satu layar",
          "Membuat Stack (layar bertumpuk), Tabs, dan route dinamis [id] untuk detail data",
          "Berpindah layar dengan Link dan router, sambil membawa data",
        ],
        keywords: ["expo router", "navigasi", "stack", "tabs", "link", "route dinamis", "modal", "pindah layar", "tab"],
      },
      {
        slug: "form-keyboard",
        title: "Form, Input & Keyboard",
        description: "Kamu membuat form yang nyaman diisi di HP: isian dicek, keyboard tidak menutupi kolom, dan Enter pindah ke kolom berikutnya.",
        minutes: 35,
        level: "menengah",
        lang: "js",
        objectives: [
          "Membuat form yang nilainya disimpan di state, lengkap dengan cek isian (validasi)",
          "Menjaga agar keyboard tidak menutupi kolom input (KeyboardAvoidingView)",
          "Membuat tombol Enter langsung pindah ke kolom berikutnya (returnKeyType)",
        ],
        keywords: ["form", "input", "keyboard", "keyboardavoidingview", "validasi", "textinput", "isi form", "keyboard menutupi"],
      },
      {
        slug: "state-global-storage",
        title: "State Global & Penyimpanan Lokal",
        description: "Kamu belajar berbagi data ke banyak layar dan menyimpan data di HP, termasuk menyimpan token login dengan aman.",
        minutes: 40,
        level: "menengah",
        lang: "js",
        objectives: [
          "Berbagi data ke banyak layar dengan Context dan Zustand",
          "Menyimpan data biasa di HP dengan AsyncStorage (seperti laci tanpa kunci)",
          "Menyimpan token login dengan aman di HP (SecureStore)",
        ],
        keywords: ["context", "zustand", "asyncstorage", "securestore", "state global", "persist", "simpan di hp", "token login"],
      },
      {
        slug: "ui-native",
        title: "UI yang Terasa Native",
        description: "Kamu merapikan aplikasi agar tidak tertutup poni layar (notch), mendukung mode gelap, dan bergetar halus saat tombol ditekan.",
        minutes: 35,
        level: "mahir",
        lang: "js",
        objectives: [
          "Menjaga konten tidak tertutup poni layar dan status bar (safe area)",
          "Mendukung mode gelap dengan useColorScheme",
          "Menambahkan ikon, getaran halus (haptic), dan tanda visual saat disentuh",
        ],
        keywords: ["safe area", "dark mode", "ikon", "haptics", "ux", "native", "aksesibilitas", "mode gelap", "getaran", "poni layar"],
      },
    ],
  },
  {
    slug: "fullstack",
    number: 3,
    title: "Full-stack: CRUD Mobile + API",
    shortTitle: "Full-stack",
    description:
      "Kamu menyambungkan aplikasi Expo ke API Express buatanmu, supaya bisa tambah, lihat, ubah, dan hapus data, lengkap dengan login dan upload gambar.",
    outcome: "Kamu menyelesaikan proyek akhir (capstone): aplikasi Tugas & Catatan Kuliah yang lengkap, dari layar HP sampai database.",
    icon: "workflow",
    lessons: [
      {
        slug: "arsitektur-fullstack",
        title: "Arsitektur Aplikasi Full-stack",
        description: "Kamu melihat gambaran besar perjalanan data dari layar HP, ke API Express, sampai database, dan kembali lagi.",
        minutes: 20,
        level: "menengah",
        lang: "js",
        objectives: [
          "Menggambar alur data dari layar HP sampai database",
          "Memahami kontrak API, kesepakatan format data antara aplikasi dan server",
          "Mengenal folder proyek: api/ untuk server dan kuliah-app untuk aplikasi HP",
        ],
        keywords: ["arsitektur", "fullstack", "kontrak api", "alur data", "monorepo", "gambaran besar", "perjalanan data"],
      },
      {
        slug: "menghubungkan-expo-api",
        title: "Menghubungkan Expo ke API Lokal",
        description: "Kamu menyambungkan aplikasi di HP ke API yang berjalan di laptopmu, lalu membuat satu fungsi pemanggil API untuk semua layar.",
        minutes: 30,
        level: "menengah",
        lang: "js",
        objectives: [
          "Memilih alamat API yang benar untuk HP asli, emulator Android, dan simulator iOS",
          "Menyimpan alamat API di satu tempat dengan EXPO_PUBLIC_API_URL",
          "Membuat API client, fungsi fetch yang dipakai ulang di semua layar",
        ],
        keywords: ["localhost", "ip lan", "10.0.2.2", "env", "api client", "fetch", "network", "sambung ke laptop", "alamat api"],
      },
      {
        slug: "read-data",
        title: "READ: Menampilkan Data dari API",
        description: "Kamu mengambil daftar tugas dari API dan menampilkannya, lengkap dengan tampilan saat memuat, saat error, dan saat kosong.",
        minutes: 35,
        level: "menengah",
        lang: "js",
        objectives: [
          "Menampilkan daftar dari API dengan FlatList",
          "Menyiapkan tampilan untuk tiga keadaan: sedang memuat, gagal, dan kosong",
          "Membuat layar detail yang mengambil data berdasarkan id",
        ],
        keywords: ["read", "get", "list", "detail", "loading", "error", "empty state", "tampilkan data", "ambil data"],
      },
      {
        slug: "create-update",
        title: "CREATE & UPDATE: Form ke API",
        description: "Kamu mengirim isi form ke API untuk menambah atau mengubah data, lalu menampilkan pesan error dari server di form.",
        minutes: 40,
        level: "menengah",
        lang: "js",
        objectives: [
          "Menambah data baru dengan request POST",
          "Mengubah data dengan PATCH lewat form yang sudah terisi data lama",
          "Menampilkan pesan error validasi dari server di kolom form",
        ],
        keywords: ["create", "update", "post", "patch", "form", "validasi server", "tambah data", "ubah data", "kirim form"],
      },
      {
        slug: "delete-optimistic",
        title: "DELETE & Optimistic Update",
        description: "Kamu menghapus data dengan konfirmasi atau gestur geser, dan membuat daftar langsung berubah tanpa menunggu server.",
        minutes: 30,
        level: "mahir",
        lang: "js",
        objectives: [
          "Menghapus data setelah pengguna menekan tombol konfirmasi",
          "Mengubah tampilan duluan (optimistic update) dan mengembalikannya kalau server gagal",
          "Memberi tombol Urungkan (undo) setelah data dihapus",
        ],
        keywords: ["delete", "optimistic update", "rollback", "konfirmasi", "swipe", "hapus data", "geser hapus", "urungkan"],
      },
      {
        slug: "tanstack-query",
        title: "Mengelola Data Server dengan TanStack Query",
        description: "Kamu memakai TanStack Query untuk menyimpan sementara data dari server, jadi layar cepat tampil dan data diperbarui otomatis.",
        minutes: 45,
        level: "mahir",
        lang: "js",
        objectives: [
          "Mengganti useEffect + fetch dengan useQuery yang lebih ringkas",
          "Mengubah data dengan useMutation, lalu menyegarkan daftar (invalidateQueries)",
          "Mengatur cache, staleTime (kapan data dianggap basi), dan daftar bertahap",
        ],
        keywords: ["tanstack query", "react query", "usequery", "usemutation", "cache", "invalidate", "data server", "simpan sementara", "server state"],
      },
      {
        slug: "autentikasi",
        title: "Autentikasi End-to-End",
        description: "Kamu membuat fitur daftar akun dan login, menyimpan password dengan aman, dan menutup layar tertentu bagi yang belum login.",
        minutes: 55,
        level: "mahir",
        lang: "js",
        objectives: [
          "Membuat register dan login dengan bcrypt (pengacak password) dan JWT (tiket login)",
          "Melindungi route API dengan middleware yang memeriksa token login",
          "Menyimpan token di SecureStore dan mengunci layar yang butuh login",
          "Memperpanjang sesi login otomatis dengan refresh token",
        ],
        keywords: ["auth", "login", "register", "jwt", "bcrypt", "refresh token", "securestore", "protected route", "daftar akun", "masuk akun", "password"],
      },
      {
        slug: "upload-gambar",
        title: "Upload Gambar",
        description: "Kamu membuat fitur pilih foto dari galeri atau kamera, lalu mengirimnya ke API untuk disimpan.",
        minutes: 40,
        level: "mahir",
        lang: "js",
        objectives: [
          "Memilih gambar dari galeri atau kamera dengan expo-image-picker",
          "Mengirim file ke API dengan FormData (paket berisi file dan teks)",
          "Menerima dan memeriksa file di Express dengan multer",
        ],
        keywords: ["upload", "gambar", "image picker", "formdata", "multipart", "multer", "file", "kirim foto", "galeri", "kamera"],
      },
      {
        slug: "capstone",
        title: "Capstone: Aplikasi Tugas & Catatan Kuliah",
        description: "Kamu merangkai semua materi jadi satu aplikasi utuh: mata kuliah, tugas dengan deadline, lampiran, dan akun pengguna.",
        minutes: 90,
        level: "mahir",
        lang: "js",
        objectives: [
          "Menyelesaikan semua fitur aplikasi Tugas & Catatan Kuliah",
          "Mencoba seluruh alur dari login sampai upload lampiran",
          "Menilai hasil kerjamu dengan daftar cek kualitas",
        ],
        keywords: ["capstone", "proyek akhir", "tugas kuliah", "fullstack", "portofolio", "aplikasi utuh", "daftar cek"],
      },
    ],
  },
  {
    slug: "expert",
    number: 4,
    title: "Expert: Aplikasi Siap Dipakai Banyak Orang",
    shortTitle: "Expert",
    description:
      "Kamu menambahkan TypeScript, membuat aplikasi lebih aman, cepat, dan teruji, lalu memasangnya di server agar bisa dipakai orang lain.",
    outcome: "Kamu punya aplikasi yang aman, cepat, sudah dites, dan sudah online sehingga orang lain bisa memakainya.",
    icon: "rocket",
    lessons: [
      {
        slug: "typescript-end-to-end",
        title: "TypeScript End-to-End",
        description: "Kamu memakai TypeScript untuk memberi label tipe pada data, dari database sampai layar, supaya kesalahan ketahuan sebelum aplikasi jalan.",
        minutes: 45,
        level: "mahir",
        lang: "ts",
        objectives: [
          "Menulis tipe dasar, union (salah satu dari beberapa), generic, dan utility types",
          "Mengubah kode API dan aplikasi Expo dari JavaScript ke TypeScript",
          "Memakai satu schema Zod sebagai sumber tipe untuk API dan aplikasi",
        ],
        keywords: ["typescript", "type", "interface", "generic", "zod", "infer", "type safety", "tipe data", "cegah salah ketik"],
      },
      {
        slug: "clean-architecture",
        title: "Arsitektur Bersih & Pola Desain",
        description: "Kamu membagi kode ke beberapa lapisan dengan tugas masing-masing, seperti dapur yang dibagi jadi stasiun potong, masak, dan saji.",
        minutes: 40,
        level: "expert",
        lang: "ts",
        objectives: [
          "Memisahkan aturan bisnis, akses data, dan tampilan ke lapisan yang berbeda",
          "Memakai repository (pengurus akses data) dan service (pengurus aturan bisnis)",
          "Menyusun kode aplikasi HP per fitur, satu folder untuk satu fitur",
        ],
        keywords: ["clean architecture", "repository", "service", "dependency injection", "solid", "feature folder", "rapikan kode", "lapisan", "struktur folder"],
      },
      {
        slug: "performa-backend",
        title: "Performa Backend",
        description: "Kamu mempercepat API dengan memberi indeks pada database, mengurangi bolak-balik query, dan menyimpan hasil yang sering diminta.",
        minutes: 40,
        level: "expert",
        lang: "ts",
        objectives: [
          "Menemukan dan memperbaiki N+1 query (query berulang untuk tiap item)",
          "Menambahkan index yang tepat, seperti indeks di belakang buku",
          "Memakai cursor pagination (lanjut dari item terakhir) dan cache hasil query",
        ],
        keywords: ["performa", "index", "n+1", "cursor pagination", "cache", "query", "api lambat", "percepat api"],
      },
      {
        slug: "performa-mobile",
        title: "Performa Mobile",
        description: "Kamu membuat aplikasi HP lebih lancar: mengurangi render ulang, mempercepat daftar panjang dan gambar, serta mencari bagian yang lambat.",
        minutes: 40,
        level: "expert",
        lang: "ts",
        objectives: [
          "Mencegah komponen digambar ulang (re-render) padahal tidak ada yang berubah",
          "Mempercepat daftar besar dan pemuatan gambar",
          "Mencari bagian yang lambat dengan React DevTools Profiler",
        ],
        keywords: ["performa", "memo", "usememo", "usecallback", "flashlist", "expo-image", "profiler", "aplikasi lambat", "patah-patah"],
      },
      {
        slug: "keamanan-api",
        title: "Keamanan API",
        description: "Kamu menutup celah keamanan API yang umum menurut daftar OWASP, misalnya pengguna yang bisa membuka data milik orang lain.",
        minutes: 45,
        level: "expert",
        lang: "ts",
        objectives: [
          "Mencegah pengguna membuka data milik pengguna lain (BOLA/IDOR)",
          "Membatasi jumlah request (rate limit), memasang helmet (header keamanan), dan CORS ketat",
          "Menyimpan secret (kunci rahasia) dengan aman dan mencegah data bocor",
        ],
        keywords: ["keamanan", "owasp", "idor", "rate limit", "helmet", "cors", "secret", "otorisasi", "celah keamanan", "data bocor"],
      },
      {
        slug: "testing-backend",
        title: "Testing Backend",
        description: "Kamu menulis tes otomatis dengan Vitest dan Supertest untuk memastikan API-mu berjalan benar sebelum dipakai orang.",
        minutes: 40,
        level: "expert",
        lang: "ts",
        objectives: [
          "Menulis unit test, tes untuk satu fungsi service secara terpisah",
          "Menguji endpoint lewat request sungguhan dengan Supertest",
          "Menyiapkan database khusus tes yang tidak mengganggu data asli",
        ],
        keywords: ["testing", "vitest", "supertest", "unit test", "integration test", "tdd", "tes otomatis", "cek api"],
      },
      {
        slug: "testing-mobile",
        title: "Testing Mobile",
        description: "Kamu menulis tes otomatis untuk komponen aplikasi HP, lalu menguji alur lengkap seperti pengguna sungguhan dengan Maestro.",
        minutes: 40,
        level: "expert",
        lang: "ts",
        objectives: [
          "Menguji komponen dengan React Native Testing Library",
          "Mengganti API asli dengan API palsu (mock) saat tes",
          "Menulis alur E2E (dari buka aplikasi sampai selesai) dengan Maestro",
        ],
        keywords: ["testing", "jest", "rntl", "testing library", "maestro", "e2e", "mock", "tes otomatis", "tes aplikasi hp"],
      },
      {
        slug: "offline-first",
        title: "Offline-first",
        description: "Kamu membuat aplikasi tetap bisa dipakai tanpa sinyal: perubahan dicatat dulu di HP, lalu dikirim saat internet kembali.",
        minutes: 45,
        level: "expert",
        lang: "ts",
        objectives: [
          "Mengetahui apakah HP sedang online atau offline",
          "Menyimpan cache TanStack Query di HP agar tetap ada setelah aplikasi ditutup",
          "Mengantrekan perubahan saat offline dan menangani data yang bentrok",
        ],
        keywords: ["offline", "sinkronisasi", "netinfo", "persist", "queue", "konflik", "sqlite", "tanpa internet", "tanpa sinyal"],
      },
      {
        slug: "real-time",
        title: "Real-time & Notifikasi",
        description: "Kamu memakai Socket.IO agar data langsung berubah di semua HP tanpa refresh, lalu mengirim pengingat sebelum deadline tugas.",
        minutes: 40,
        level: "expert",
        lang: "ts",
        objectives: [
          "Mengirim kabar perubahan secara langsung (real-time) dengan Socket.IO",
          "Memperbarui cache dan layar saat kabar perubahan masuk",
          "Menjadwalkan notifikasi lokal (dari HP sendiri) untuk mengingatkan deadline",
        ],
        keywords: ["real-time", "websocket", "socket.io", "notifikasi", "push notification", "expo-notifications", "pengingat", "update langsung"],
      },
      {
        slug: "deploy-ci",
        title: "Deploy & CI/CD",
        description: "Kamu memindahkan API ke server online, membuat file aplikasi untuk Android dan iOS, dan mengotomatiskan pengecekan kode tiap ada perubahan.",
        minutes: 50,
        level: "expert",
        lang: "ts",
        objectives: [
          "Memasang API dan database PostgreSQL di server online (deploy)",
          "Membuat file aplikasi Android/iOS dengan EAS Build",
          "Mengirim update JavaScript ke HP pengguna tanpa build ulang (EAS Update)",
          "Menjalankan tes otomatis setiap kode dikirim ke GitHub (CI dengan GitHub Actions)",
        ],
        keywords: ["deploy", "postgresql", "eas build", "eas update", "ci", "github actions", "production", "online", "rilis aplikasi"],
      },
    ],
  },
];

// ================= Helper =================

export const allLessons: Lesson[] = (() => {
  let globalIndex = 0;
  return tracks.flatMap((track) =>
    track.lessons.map((lesson, index) => ({
      ...lesson,
      id: `${track.slug}/${lesson.slug}`,
      href: `/belajar/${track.slug}/${lesson.slug}/`,
      trackSlug: track.slug,
      trackTitle: track.title,
      trackNumber: track.number,
      index,
      globalIndex: globalIndex++,
    })),
  );
})();

export const TOTAL_LESSONS = allLessons.length;
export const TOTAL_MINUTES = allLessons.reduce((sum, l) => sum + l.minutes, 0);

export function getTrack(slug: string) {
  return tracks.find((t) => t.slug === slug);
}

export function getLesson(trackSlug: string, lessonSlug: string) {
  return allLessons.find((l) => l.trackSlug === trackSlug && l.slug === lessonSlug);
}

export function getLessonById(id: string) {
  return allLessons.find((l) => l.id === id);
}

export function getTrackLessons(trackSlug: string) {
  return allLessons.filter((l) => l.trackSlug === trackSlug);
}

export function getAdjacentLessons(id: string) {
  const i = allLessons.findIndex((l) => l.id === id);
  return {
    prev: i > 0 ? allLessons[i - 1] : undefined,
    next: i >= 0 && i < allLessons.length - 1 ? allLessons[i + 1] : undefined,
  };
}

export function trackMinutes(track: Track) {
  return track.lessons.reduce((sum, l) => sum + l.minutes, 0);
}
