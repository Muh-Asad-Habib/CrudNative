export type GlossaryCategory = "Web & HTTP" | "JavaScript" | "Database" | "Backend" | "React" | "React Native" | "Keamanan" | "DevOps";

export interface GlossaryEntry {
  slug: string;
  term: string;
  aliases?: string[];
  category: GlossaryCategory;
  definition: string;
  analogy?: string; // perbandingan dengan kehidupan sehari-hari
  example?: string;
  lesson?: string; // lesson id terkait, mis. "crud-backend/konsep-crud"
}

export const glossary: GlossaryEntry[] = [
  {
    slug: "api",
    term: "API",
    aliases: ["Application Programming Interface"],
    category: "Web & HTTP",
    definition:
      "Pintu resmi yang dipakai satu program untuk meminta data atau layanan ke program lain. Di kursus ini, aplikasi Expo memanggil API Express untuk membaca dan mengubah data tugas.",
    analogy:
      "Seperti pelayan warung: kamu (client) memesan lewat pelayan (API), pelayan meneruskan ke dapur (server dan database), lalu membawakan makanannya.",
    example: "GET https://api.contoh.com/tasks",
    lesson: "crud-backend/rest-api-http",
  },
  {
    slug: "crud",
    term: "CRUD",
    aliases: ["Create Read Update Delete"],
    category: "Database",
    definition:
      "Empat hal dasar yang bisa dilakukan pada data: Create (tambah), Read (lihat), Update (ubah), dan Delete (hapus). Hampir semua aplikasi, dari to-do list sampai media sosial, dibangun dari empat operasi ini.",
    analogy:
      "Seperti mengelola kontak di HP: menambah nomor baru, melihat daftar kontak, mengganti nama kontak, dan menghapus kontak lama.",
    example: "INSERT, SELECT, UPDATE, DELETE",
    lesson: "crud-backend/konsep-crud",
  },
  {
    slug: "endpoint",
    term: "Endpoint",
    category: "Web & HTTP",
    definition:
      "Satu alamat di API untuk satu jenis permintaan, yaitu gabungan method HTTP (jenis aksi, misalnya GET atau POST) dan path URL. GET /api/tasks dan POST /api/tasks adalah dua endpoint berbeda walaupun path-nya sama.",
    analogy:
      "Seperti nomor loket di kantor pos: gedungnya sama, tapi loket kirim paket dan loket ambil paket melayani urusan yang berbeda.",
    example: "POST /api/tasks",
    lesson: "crud-backend/rest-api-http",
  },
  {
    slug: "json",
    term: "JSON",
    aliases: ["JavaScript Object Notation"],
    category: "Web & HTTP",
    definition:
      "Format teks untuk menulis dan mengirim data, berisi pasangan nama kolom (key) dan nilai, mirip object JavaScript. Key wajib memakai kutip ganda. Di JavaScript, object diubah ke JSON dengan JSON.stringify() dan sebaliknya dengan JSON.parse().",
    analogy:
      "Seperti nota belanja dengan kolom tetap (nama barang, jumlah, harga), sehingga siapa pun yang membacanya tahu arti tiap kolom.",
    example: '{ "id": 1, "title": "Belajar CRUD" }',
    lesson: "fondasi/cara-kerja-web",
  },
  {
    slug: "status-code",
    term: "Status Code",
    aliases: ["kode status HTTP"],
    category: "Web & HTTP",
    definition:
      "Angka tiga digit di balasan server yang memberi tahu hasil request. 2xx berarti berhasil, 3xx dialihkan ke alamat lain, 4xx kesalahan dari pihak peminta (client), dan 5xx kesalahan di server.",
    analogy:
      "Seperti status resi paket JNE: “Terkirim”, “Alamat tidak ditemukan”, atau “Gangguan di gudang” langsung memberi tahu nasib kirimanmu.",
    example: "201 Created, 404 Not Found",
    lesson: "crud-backend/rest-api-http",
  },
  {
    slug: "expo",
    term: "Expo",
    category: "React Native",
    definition:
      "Kumpulan alat tambahan untuk React Native yang memudahkan membuat aplikasi mobile, dari menulis kode, mencoba di HP, sampai rilis ke toko aplikasi. Expo menyediakan library siap pakai, Expo Router, Expo Go, dan layanan EAS.",
    analogy:
      "Seperti menyewa dapur yang kompor, panci, dan kulkasnya sudah lengkap: kamu tinggal memasak tanpa merakit peralatan sendiri.",
    example: "npx create-expo-app@latest tugas-kuliah",
    lesson: "react-native/intro-react-native-expo",
  },

  // ===== Web & HTTP =====
  {
    slug: "http",
    term: "HTTP",
    aliases: ["HyperText Transfer Protocol", "HTTPS"],
    category: "Web & HTTP",
    definition:
      "Aturan komunikasi yang dipakai client dan server untuk saling kirim pesan di web: client mengirim request, server membalas response. HTTPS adalah versi yang pesannya dienkripsi (diacak supaya tidak bisa diintip) dan wajib dipakai saat aplikasi sudah dipakai orang sungguhan (production).",
    analogy:
      "Seperti tata cara berkirim surat (amplop, alamat, isi); HTTPS ibarat surat bersegel yang tidak bisa dibaca kurir di tengah jalan.",
    example: "GET /api/tasks HTTP/1.1",
    lesson: "fondasi/cara-kerja-web",
  },
  {
    slug: "client-server",
    term: "Client & Server",
    aliases: ["client", "server"],
    category: "Web & HTTP",
    definition:
      "Client adalah pihak yang meminta data, misalnya browser atau aplikasi di HP. Server adalah program yang menerima permintaan itu, mengolahnya (sering sambil mengambil data dari database), lalu mengirim balasan.",
    analogy:
      "Seperti di warung: pembeli (client) memesan, pelayan dan dapur (server) menyiapkan pesanan, lalu mengantarkannya ke meja pembeli.",
    lesson: "fondasi/cara-kerja-web",
  },
  {
    slug: "request-response",
    term: "Request & Response",
    category: "Web & HTTP",
    definition:
      "Request adalah pesan dari client ke server: mau apa (method), ke alamat mana (URL), keterangan tambahan (header), dan isi data jika perlu (body). Response adalah balasan server berisi status code, header, dan body. Setiap request dijawab tepat satu response.",
    analogy:
      "Seperti pesan GoFood: kamu mengirim pesanan (request), lalu driver datang membawa makanan dan notanya (response); satu pesanan, satu antaran.",
    lesson: "fondasi/cara-kerja-web",
  },
  {
    slug: "url",
    term: "URL",
    aliases: ["Uniform Resource Locator", "path"],
    category: "Web & HTTP",
    definition:
      "Alamat lengkap sebuah halaman atau data di internet. Isinya protokol (https), host (nama server), port (nomor pintu, boleh tidak ditulis), path (lokasi di server), dan query string (keterangan tambahan setelah tanda ?).",
    analogy:
      "Seperti alamat kirim paket lengkap: nama kota (host), jalan dan nomor rumah (path), plus catatan untuk kurir (query string).",
    example: "https://api.kampus.id:443/tasks?page=2",
    lesson: "fondasi/cara-kerja-web",
  },
  {
    slug: "http-method",
    term: "HTTP Method",
    aliases: ["verb", "GET", "POST", "PUT", "PATCH", "DELETE"],
    category: "Web & HTTP",
    definition:
      "Kata kerja di request yang memberi tahu server apa yang ingin kamu lakukan. GET untuk membaca, POST membuat, PUT mengganti seluruh data, PATCH mengubah sebagian, dan DELETE menghapus.",
    analogy:
      "Seperti memilih urusan di teller bank: cek saldo (GET), buka rekening (POST), ubah alamat nasabah (PATCH), atau tutup rekening (DELETE).",
    example: "PATCH /api/tasks/7",
    lesson: "crud-backend/rest-api-http",
  },
  {
    slug: "header",
    term: "Header HTTP",
    aliases: ["header", "Content-Type", "Authorization"],
    category: "Web & HTTP",
    definition:
      "Keterangan tambahan berbentuk pasangan nama dan nilai yang ikut di request atau response, misalnya jenis isi pesan, token login, atau aturan cache. Header terpisah dari isi pesan utama (body).",
    analogy:
      "Seperti tulisan di luar kardus paket (“Pecah belah”, nama pengirim): kurir bisa membacanya tanpa membuka isi paket.",
    example: "Content-Type: application/json",
    lesson: "fondasi/cara-kerja-web",
  },
  {
    slug: "request-body",
    term: "Request Body",
    aliases: ["body", "payload"],
    category: "Web & HTTP",
    definition:
      "Isi data yang dikirim bersama request, biasanya berformat JSON pada POST, PUT, dan PATCH. Di Express, body JSON baru bisa dibaca lewat req.body setelah express.json() (middleware pembaca JSON) dipasang.",
    analogy:
      "Seperti isi kardus paket: label di luar kardus adalah header, sedangkan barang di dalamnya adalah body.",
    example: '{ "title": "Laporan praktikum", "priority": "tinggi" }',
    lesson: "crud-backend/express-dasar",
  },
  {
    slug: "query-string",
    term: "Query String",
    aliases: ["query params", "parameter query", "req.query"],
    category: "Web & HTTP",
    definition:
      "Bagian URL setelah tanda tanya, berisi pasangan key=value yang dipisah tanda &. Dipakai untuk menyaring, mencari, mengurutkan, dan membagi data per halaman. Di Express dibaca lewat req.query.",
    analogy:
      "Seperti filter di aplikasi belanja online: halaman produknya sama, tapi kamu menambah syarat “termurah, lokasi Bandung, halaman 2”.",
    example: "/api/tasks?status=DONE&page=2&limit=10",
    lesson: "crud-backend/express-dasar",
  },
  {
    slug: "rest",
    term: "REST",
    aliases: ["RESTful", "REST API"],
    category: "Web & HTTP",
    definition:
      "Gaya merancang API supaya rapi dan mudah ditebak. Data diperlakukan sebagai resource (benda) dengan URL kata benda jamak, misalnya /tasks, sedangkan aksinya ditentukan oleh method HTTP. API yang mengikuti gaya ini disebut RESTful.",
    analogy:
      "Seperti perpustakaan dengan rak berlabel jelas: rak menunjukkan bendanya, dan permintaanmu ke petugas menentukan aksinya, yaitu pinjam, kembalikan, atau perpanjang.",
    example: "GET /tasks, POST /tasks, PATCH /tasks/3, DELETE /tasks/3",
    lesson: "crud-backend/rest-api-http",
  },
  {
    slug: "idempotent",
    term: "Idempoten",
    aliases: ["idempotent"],
    category: "Web & HTTP",
    definition:
      "Sifat request yang hasil akhirnya di server tetap sama walaupun dikirim berkali-kali. GET, PUT, dan DELETE idempoten. POST tidak, karena setiap kiriman bisa membuat data baru.",
    analogy:
      "Seperti menekan tombol lift ke lantai 5 berkali-kali (tetap ke lantai 5), beda dengan transfer uang yang memotong saldo setiap kali dikirim.",
    lesson: "crud-backend/rest-api-http",
  },
  {
    slug: "cors",
    term: "CORS",
    aliases: ["Cross-Origin Resource Sharing"],
    category: "Web & HTTP",
    definition:
      "Aturan keamanan browser: halaman web dilarang memanggil API dari origin lain (domain atau port berbeda), kecuali server mengizinkan lewat header Access-Control-Allow-Origin. Aplikasi di HP tidak terkena CORS, tetapi versi web-nya terkena.",
    analogy:
      "Seperti satpam kampus (browser) yang menahan tamu dari kampus lain sampai fakultas tujuan (server) memberi surat izin.",
    example: "app.use(cors({ origin: process.env.CORS_ORIGIN }))",
    lesson: "crud-backend/struktur-proyek-backend",
  },
  {
    slug: "localhost",
    term: "localhost",
    aliases: ["127.0.0.1", "IP LAN", "10.0.2.2"],
    category: "Web & HTTP",
    definition:
      "Alamat yang selalu menunjuk ke perangkat itu sendiri. Kalau dibuka dari HP, localhost berarti HP itu, bukan laptopmu. Untuk memanggil API di laptop, pakai IP LAN laptop (alamatnya di Wi-Fi yang sama); emulator Android memakai alamat khusus 10.0.2.2.",
    analogy:
      "Seperti kata “rumahku”: kalau kamu yang mengucapkan, artinya rumahmu; kalau temanmu yang mengucapkan, artinya rumah temanmu.",
    example: "EXPO_PUBLIC_API_URL=http://192.168.1.10:3000",
    lesson: "fullstack/menghubungkan-expo-api",
  },
  {
    slug: "multipart-form-data",
    term: "multipart/form-data",
    aliases: ["FormData", "multipart", "upload file"],
    category: "Web & HTTP",
    definition:
      "Format isi request untuk mengirim file (misalnya foto) bersama data teks, dibagi menjadi beberapa bagian (part). Di aplikasi dibuat dengan objek FormData, dan di Express dibaca oleh middleware multer.",
    analogy:
      "Seperti satu kardus kiriman berisi beberapa barang yang masing-masing diberi label: foto, judul, dan keterangan dikirim bersamaan.",
    example: "form.append('file', { uri, name: 'foto.jpg', type: 'image/jpeg' })",
    lesson: "fullstack/upload-gambar",
  },
  {
    slug: "websocket",
    term: "WebSocket",
    aliases: ["Socket.IO", "real-time"],
    category: "Web & HTTP",
    definition:
      "Sambungan dua arah antara client dan server yang terus terbuka, jadi server bisa mengirim data kapan saja tanpa ditanya dulu. Cocok untuk fitur real-time (data langsung muncul saat itu juga). Socket.IO adalah library populer yang memakainya.",
    analogy:
      "Seperti telepon yang tetap tersambung, beda dengan polling yang ibarat terus mengirim SMS “sudah sampai belum?” tiap beberapa detik.",
    example: "socket.on('task:updated', (task) => { /* ... */ })",
    lesson: "expert/real-time",
  },

  // ===== JavaScript =====
  {
    slug: "node-js",
    term: "Node.js",
    aliases: ["Node", "runtime"],
    category: "JavaScript",
    definition:
      "Program yang membuat JavaScript bisa jalan di luar browser, misalnya di laptop atau server. Node.js dipakai untuk menjalankan API Express dan alat seperti Expo CLI.",
    analogy:
      "Seperti kompor portabel: kamu bisa memasak (menjalankan JavaScript) di luar dapur rumah (browser), misalnya di laptop atau server.",
    example: "node index.js",
    lesson: "fondasi/setup-tools",
  },
  {
    slug: "npm",
    term: "npm",
    aliases: ["npx", "package manager", "package.json"],
    category: "JavaScript",
    definition:
      "Alat bawaan Node.js untuk memasang library (kode siap pakai buatan orang lain) dan menjalankan perintah yang dicatat di package.json. Perintah npx menjalankan sebuah paket tanpa memasangnya permanen di laptop.",
    analogy:
      "Seperti aplikasi belanja bahan dapur: kamu tinggal pesan bahan (library) yang dibutuhkan, dan daftar belanjaannya tercatat di package.json.",
    example: "npm install express",
    lesson: "fondasi/setup-tools",
  },
  {
    slug: "arrow-function",
    term: "Arrow Function",
    aliases: ["fungsi panah", "=>"],
    category: "JavaScript",
    definition:
      "Cara singkat menulis fungsi dengan tanda =>. Kalau isinya hanya satu ekspresi, hasilnya otomatis dikembalikan tanpa perlu menulis return.",
    analogy:
      "Seperti menulis “ojek ke kampus” di chat, bukan “saya mau memesan ojek menuju kampus”: maksudnya sama, tulisannya lebih pendek.",
    example: "const kali2 = (n) => n * 2;",
    lesson: "fondasi/javascript-modern-1",
  },
  {
    slug: "closure",
    term: "Closure",
    category: "JavaScript",
    definition:
      "Fungsi yang tetap ingat variabel di sekitar tempat ia dibuat, walaupun bagian kode itu sudah selesai dijalankan. Event handler (fungsi yang jalan saat tombol ditekan) dan hook React sangat bergantung pada closure.",
    analogy:
      "Seperti kotak bekal dari rumah: kamu sudah di kampus, tapi masih bisa menikmati masakan dari dapur rumah.",
    example: "const buatCounter = () => { let n = 0; return () => ++n; };",
    lesson: "fondasi/javascript-modern-1",
  },
  {
    slug: "array-method",
    term: "map, filter, find, reduce",
    aliases: ["array method", "map", "filter", "find", "reduce"],
    category: "JavaScript",
    definition:
      "Cara mengolah isi daftar (array) tanpa menulis perulangan sendiri. map mengubah setiap item, filter menyaring, find mengambil item pertama yang cocok, dan reduce meringkas semuanya jadi satu nilai.",
    analogy:
      "Seperti mengolah daftar hadir: map menulis ulang tiap nama, filter memilih yang hadir, find mencari satu NIM, reduce menghitung total hadir.",
    example: "tasks.filter((t) => !t.done).map((t) => t.title)",
    lesson: "fondasi/javascript-modern-1",
  },
  {
    slug: "destructuring",
    term: "Destructuring",
    aliases: ["destrukturisasi"],
    category: "JavaScript",
    definition:
      "Cara singkat mengambil beberapa nilai dari object atau array ke variabel terpisah dalam satu baris. Sering dipakai untuk membaca props dan hasil hook seperti useState.",
    analogy:
      "Seperti membongkar paket dan langsung menaruh tiap barang ke tempatnya (baju ke lemari, buku ke rak) dalam sekali bongkar.",
    example: "const { title, done } = task; const [count, setCount] = useState(0);",
    lesson: "fondasi/javascript-modern-2",
  },
  {
    slug: "spread-operator",
    term: "Spread & Rest",
    aliases: ["spread operator", "rest parameter", "..."],
    category: "JavaScript",
    definition:
      "Tanda tiga titik (...) untuk menyalin isi array atau object ke tempat baru (spread) atau mengumpulkan sisa nilai (rest). Spread memudahkan membuat salinan baru tanpa mengubah data asli.",
    analogy:
      "Seperti memfotokopi formulir lalu mengganti satu kolom di fotokopiannya, sementara formulir aslinya tetap utuh.",
    example: "const updated = { ...task, done: true };",
    lesson: "fondasi/javascript-modern-2",
  },
  {
    slug: "optional-chaining",
    term: "Optional Chaining & Nullish Coalescing",
    aliases: ["?.", "??"],
    category: "JavaScript",
    definition:
      "Dua tanda pengaman di JavaScript. ?. membaca properti tanpa error walaupun datanya kosong (null atau undefined). ?? memberi nilai cadangan hanya jika nilai di kirinya null atau undefined, bukan 0 atau teks kosong.",
    analogy:
      "Seperti mengecek dulu apakah paketnya ada sebelum membukanya (?.), lalu memakai bekal cadangan kalau paketnya ternyata tidak datang (??).",
    example: "task.course?.name ?? 'Tanpa mata kuliah'",
    lesson: "fondasi/javascript-modern-2",
  },
  {
    slug: "immutability",
    term: "Immutable",
    aliases: ["immutability", "tidak diubah langsung"],
    category: "JavaScript",
    definition:
      "Kebiasaan tidak mengubah data lama secara langsung, tetapi membuat salinan baru yang berisi perubahan. React memakai cara ini untuk tahu bahwa state (data yang sedang ditampilkan) sudah berubah.",
    analogy:
      "Seperti merevisi skripsi: kamu menyimpan file baru “revisi-2” daripada menimpa file lama, jadi dosen langsung tahu ada versi baru.",
    example: "setTasks((prev) => prev.filter((t) => t.id !== id))",
    lesson: "fondasi/javascript-modern-2",
  },
  {
    slug: "esm",
    term: "ES Modules",
    aliases: ["ESM", "import", "export", "modul"],
    category: "JavaScript",
    definition:
      "Cara standar JavaScript untuk membagi kode ke banyak file: satu file memberi (export), file lain mengambil (import). Di Node.js diaktifkan dengan menulis \"type\": \"module\" di package.json.",
    analogy:
      "Seperti bab di buku catatan yang saling merujuk: bab 3 boleh memakai rumus dari bab 1 asal menyebut nama rumusnya.",
    example: "import { createApp } from './app.js';",
    lesson: "fondasi/javascript-modern-2",
  },
  {
    slug: "event-loop",
    term: "Event Loop",
    category: "JavaScript",
    definition:
      "Cara JavaScript mengatur pekerjaan: ia mengerjakan satu tugas dalam satu waktu, lalu mengambil tugas berikutnya yang sudah siap (misalnya hasil timer atau fetch) dari antrean. Karena itu, menunggu proses yang lambat tidak membuat program macet.",
    analogy:
      "Seperti satu kasir minimarket: sambil menunggu mesin kartu memproses, kasir melayani pembeli lain, lalu kembali saat pembayaran siap.",
    lesson: "fondasi/async-javascript",
  },
  {
    slug: "promise",
    term: "Promise",
    aliases: ["janji", "then", "catch"],
    category: "JavaScript",
    definition:
      "Janji dari JavaScript bahwa hasil sebuah proses akan datang nanti. Keadaannya ada tiga: pending (masih ditunggu), fulfilled (berhasil), atau rejected (gagal). Hasilnya diambil dengan .then() dan .catch() atau dengan await.",
    analogy:
      "Seperti nomor antrean di warung: makananmu belum jadi, tapi nomor itu menjamin kamu nanti dipanggil, entah pesanan siap atau ternyata habis.",
    example: "fetch(url).then((res) => res.json())",
    lesson: "fondasi/async-javascript",
  },
  {
    slug: "async-await",
    term: "async/await",
    aliases: ["async", "await"],
    category: "JavaScript",
    definition:
      "Cara menulis kode yang menunggu Promise supaya terbaca berurutan dari atas ke bawah. await menunggu proses selesai di dalam fungsi async, dan error-nya ditangkap dengan try/catch.",
    analogy:
      "Seperti resep mi instan: “tunggu air mendidih, baru masukkan mi”; langkah berikutnya jalan setelah langkah sebelumnya selesai.",
    example: "const res = await fetch(url); const data = await res.json();",
    lesson: "fondasi/async-javascript",
  },
  {
    slug: "fetch",
    term: "fetch()",
    aliases: ["Fetch API"],
    category: "JavaScript",
    definition:
      "Fungsi bawaan untuk mengirim request HTTP dari kode JavaScript, hasilnya berupa Promise berisi Response. fetch tidak menganggap status 4xx atau 5xx sebagai error, jadi periksa res.ok sendiri.",
    analogy:
      "Seperti kurir titipan: ia tetap pulang membawa jawaban walaupun isinya “barang habis”, jadi kamu sendiri yang harus membaca jawabannya.",
    example: "const res = await fetch('/api/tasks'); if (!res.ok) throw new Error('Gagal');",
    lesson: "fondasi/async-javascript",
  },
  {
    slug: "typescript",
    term: "TypeScript",
    aliases: ["TS"],
    category: "JavaScript",
    definition:
      "JavaScript yang ditambah aturan tipe data (misalnya teks, angka, atau daftar). Kesalahan seperti salah nama properti atau salah jenis isi jadi ketahuan sebelum kode dijalankan.",
    analogy:
      "Seperti label di toples bumbu: kalau toples “gula” mau diisi garam, kamu langsung sadar ada yang salah sebelum mulai memasak.",
    example: "type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';",
    lesson: "expert/typescript-end-to-end",
  },
  {
    slug: "generic",
    term: "Generic",
    aliases: ["generics", "<T>"],
    category: "JavaScript",
    definition:
      "Fitur TypeScript untuk membuat fungsi atau tipe yang bisa dipakai untuk berbagai jenis data tanpa kehilangan pengecekan tipe. Jenis datanya ditulis sebagai parameter, misalnya T.",
    analogy:
      "Seperti kotak bekal yang bentuknya sama tapi diberi label isi, “kotak nasi” atau “kotak buah”, sehingga isinya tetap jelas.",
    example: "type ApiList<T> = { data: T[]; meta: PageMeta };",
    lesson: "expert/typescript-end-to-end",
  },

  // ===== Database =====
  {
    slug: "sql",
    term: "SQL",
    aliases: ["Structured Query Language", "query"],
    category: "Database",
    definition:
      "Bahasa untuk memberi perintah ke database relasional (database berbentuk tabel): membuat, membaca, mengubah, dan menghapus data. Perintah utamanya INSERT, SELECT, UPDATE, dan DELETE, yang sama dengan CRUD.",
    analogy:
      "Seperti formulir permintaan ke petugas arsip: “ambilkan semua map mahasiswa angkatan 2024, urutkan dari NIM terbesar”.",
    example: "SELECT * FROM tasks WHERE done = 0 ORDER BY id DESC;",
    lesson: "crud-backend/dasar-sql",
  },
  {
    slug: "table",
    term: "Tabel, Baris & Kolom",
    aliases: ["table", "row", "column", "record"],
    category: "Database",
    definition:
      "Cara database relasional menyimpan data, mirip sheet Excel. Setiap kolom berisi satu jenis keterangan (misalnya title), dan setiap baris berisi satu data utuh (misalnya satu tugas).",
    analogy:
      "Seperti daftar hadir kelas: kolomnya NIM, nama, dan tanda tangan, sedangkan setiap baris adalah satu mahasiswa.",
    lesson: "crud-backend/dasar-sql",
  },
  {
    slug: "primary-key",
    term: "Primary Key",
    aliases: ["PK", "kunci utama"],
    category: "Database",
    definition:
      "Kolom yang isinya unik dan wajib diisi di setiap baris, sehingga satu baris bisa ditemukan dengan pasti. Biasanya berupa id yang bertambah otomatis.",
    analogy:
      "Seperti NIM: dua mahasiswa boleh punya nama sama, tapi NIM mereka pasti berbeda.",
    example: "id INTEGER PRIMARY KEY AUTOINCREMENT",
    lesson: "crud-backend/dasar-sql",
  },
  {
    slug: "foreign-key",
    term: "Foreign Key",
    aliases: ["FK", "kunci tamu"],
    category: "Database",
    definition:
      "Kolom yang menyimpan primary key (id unik) milik tabel lain untuk menghubungkan dua tabel. Database menolak nilai yang pasangannya tidak ada, jadi hubungan antardata tetap benar.",
    analogy:
      "Seperti NIM yang tertulis di lembar KRS: NIM itu menunjuk ke satu mahasiswa yang benar-benar terdaftar di kampus.",
    example: "tasks.courseId → courses.id",
    lesson: "crud-backend/relasi-join",
  },
  {
    slug: "relasi",
    term: "Relasi (One-to-Many & Many-to-Many)",
    aliases: ["relation", "one-to-many", "many-to-many"],
    category: "Database",
    definition:
      "Hubungan antartabel. One-to-many: satu mata kuliah punya banyak tugas. Many-to-many: satu tugas bisa punya banyak label dan satu label dipakai banyak tugas, dicatat lewat tabel penghubung.",
    analogy:
      "Seperti di kampus: satu dosen wali membimbing banyak mahasiswa (one-to-many), sedangkan mahasiswa dan mata kuliah dihubungkan lewat KRS (many-to-many).",
    lesson: "crud-backend/relasi-join",
  },
  {
    slug: "join",
    term: "JOIN",
    aliases: ["INNER JOIN", "LEFT JOIN"],
    category: "Database",
    definition:
      "Perintah SQL untuk menggabungkan baris dari dua tabel lewat kolom yang berhubungan. INNER JOIN hanya mengambil baris yang punya pasangan. LEFT JOIN tetap mengambil semua baris tabel kiri walaupun tidak punya pasangan.",
    analogy:
      "Seperti mencocokkan daftar nilai dengan daftar mahasiswa lewat NIM, supaya di satu lembar terlihat nama sekaligus nilainya.",
    example: "SELECT t.title, c.name FROM tasks t LEFT JOIN courses c ON c.id = t.courseId;",
    lesson: "crud-backend/relasi-join",
  },
  {
    slug: "orm",
    term: "ORM",
    aliases: ["Object-Relational Mapping", "Prisma"],
    category: "Database",
    definition:
      "Library penerjemah antara kode dan database: tabel dijadikan objek dan method di kode, jadi kamu bisa mengambil atau menyimpan data tanpa menulis SQL sendiri. Prisma adalah ORM yang dipakai di kursus ini.",
    analogy:
      "Seperti penerjemah: kamu bicara dalam JavaScript, ORM menyampaikannya ke database dalam SQL, lalu menerjemahkan jawabannya kembali untukmu.",
    example: "await prisma.task.findMany({ where: { done: false } })",
    lesson: "crud-backend/prisma-sqlite",
  },
  {
    slug: "schema",
    term: "Schema",
    aliases: ["skema", "schema.prisma"],
    category: "Database",
    definition:
      "Gambaran bentuk data: ada tabel apa saja, kolom dan jenis isinya, serta hubungannya. Di Prisma ditulis di schema.prisma dan menjadi dasar migrasi serta Prisma Client. Istilah yang sama juga dipakai untuk aturan validasi di Zod.",
    analogy:
      "Seperti denah rumah: menunjukkan ada berapa kamar, ukurannya, dan pintu mana yang menghubungkan satu kamar dengan kamar lain.",
    example: "model Task { id Int @id @default(autoincrement()) title String }",
    lesson: "crud-backend/prisma-sqlite",
  },
  {
    slug: "migration",
    term: "Migrasi",
    aliases: ["migration", "prisma migrate"],
    category: "Database",
    definition:
      "File catatan perubahan bentuk database (misalnya menambah tabel atau kolom) yang disusun berurutan, sehingga bisa diulang di komputer lain. Prisma membuatnya otomatis setiap kali schema berubah.",
    analogy:
      "Seperti catatan renovasi rumah (“Maret tambah kamar, Juni pasang kanopi”) yang membuat tukang lain bisa mengulang langkahnya persis sama.",
    example: "npx prisma migrate dev --name add-priority",
    lesson: "crud-backend/prisma-sqlite",
  },
  {
    slug: "seed",
    term: "Seed",
    aliases: ["seeding", "data awal"],
    category: "Database",
    definition:
      "Script yang mengisi database dengan data awal atau data contoh, misalnya akun demo dan beberapa tugas, supaya aplikasi langsung bisa dicoba.",
    analogy:
      "Seperti etalase toko baru yang diisi barang contoh sebelum dibuka, supaya pengunjung langsung melihat seperti apa tokonya.",
    example: "npx prisma db seed",
    lesson: "crud-backend/prisma-sqlite",
  },
  {
    slug: "sqlite",
    term: "SQLite",
    category: "Database",
    definition:
      "Database ringan yang menyimpan semua data dalam satu file, tanpa perlu menjalankan server database terpisah. Cocok untuk belajar dan development, dan banyak dipakai langsung di HP.",
    analogy:
      "Seperti buku catatan pribadi di tas: praktis dibawa ke mana-mana, tanpa perlu pergi ke ruang arsip kampus.",
    example: "DATABASE_URL=\"file:./dev.db\"",
    lesson: "crud-backend/prisma-sqlite",
  },
  {
    slug: "postgresql",
    term: "PostgreSQL",
    aliases: ["Postgres"],
    category: "Database",
    definition:
      "Database relasional gratis (open-source) yang kuat dan umum dipakai saat aplikasi sudah dipakai banyak orang (production). Saat deploy, API biasanya pindah dari SQLite ke PostgreSQL dengan mengubah konfigurasi Prisma dan DATABASE_URL.",
    analogy:
      "Kalau SQLite buku catatan pribadi, PostgreSQL adalah ruang arsip kampus dengan petugas yang sanggup melayani banyak orang sekaligus.",
    lesson: "expert/deploy-ci",
  },
  {
    slug: "index",
    term: "Index",
    aliases: ["indeks database"],
    category: "Database",
    definition:
      "Daftar bantu pada kolom tabel yang membuat pencarian dan pengurutan data jauh lebih cepat. Gantinya, menyimpan atau mengubah data jadi sedikit lebih lambat dan butuh ruang penyimpanan tambahan.",
    analogy:
      "Seperti indeks di belakang buku: kamu langsung tahu halaman yang dicari tanpa membalik buku dari awal.",
    example: "@@index([userId, status])",
    lesson: "expert/performa-backend",
  },
  {
    slug: "transaction",
    term: "Transaction",
    aliases: ["transaksi", "$transaction", "rollback"],
    category: "Database",
    definition:
      "Beberapa operasi database yang diperlakukan sebagai satu paket: semuanya berhasil, atau semuanya dibatalkan (rollback) kalau salah satu gagal. Ini mencegah data tersimpan setengah jadi.",
    analogy:
      "Seperti transfer bank: saldo pengirim berkurang dan saldo penerima bertambah harus terjadi bersamaan; kalau satu gagal, semuanya dibatalkan.",
    example: "await prisma.$transaction([hapusLampiran, hapusTask])",
  },
  {
    slug: "n-plus-one",
    term: "N+1 Query",
    aliases: ["N+1"],
    category: "Database",
    definition:
      "Masalah lambat yang muncul saat kode menjalankan 1 query (permintaan data ke database) untuk mengambil daftar, lalu N query tambahan untuk data terkait tiap item. Solusinya, ambil data terkait sekaligus, misalnya dengan include di Prisma atau JOIN.",
    analogy:
      "Seperti bolak-balik ke warung untuk tiap barang belanjaan, padahal semuanya bisa dibeli dalam sekali jalan.",
    example: "prisma.task.findMany({ include: { course: true } })",
    lesson: "expert/performa-backend",
  },

  // ===== Backend =====
  {
    slug: "express",
    term: "Express",
    aliases: ["Express.js"],
    category: "Backend",
    definition:
      "Framework (kerangka kerja siap pakai) untuk Node.js yang memudahkan membuat server API: menentukan route, membaca request, dan mengirim response. Express 5 otomatis meneruskan error dari fungsi async ke error handler.",
    analogy:
      "Seperti gerobak warung yang sudah lengkap rak dan kompornya: kamu tinggal menentukan menu dan cara melayani pembeli.",
    example: "app.get('/api/tasks', (req, res) => res.json(tasks))",
    lesson: "crud-backend/express-dasar",
  },
  {
    slug: "route",
    term: "Route",
    aliases: ["routing", "route parameter", "req.params"],
    category: "Backend",
    definition:
      "Aturan yang menentukan fungsi mana yang menangani method dan path tertentu. Bagian path yang diawali titik dua, seperti :id, adalah parameter yang dibaca lewat req.params, dan isinya selalu berupa teks (string).",
    analogy:
      "Seperti papan petunjuk loket (“Pembayaran ke loket 3, ambil paket ke loket 5”); :id ibarat nomor resi yang kamu sebutkan.",
    example: "app.get('/api/tasks/:id', getTask)",
    lesson: "crud-backend/express-dasar",
  },
  {
    slug: "middleware",
    term: "Middleware",
    category: "Backend",
    definition:
      "Fungsi yang berjalan di tengah jalan, setelah request datang dan sebelum response dikirim. Ia bisa membaca req dan res, lalu memanggil next() untuk lanjut. Dipakai untuk membaca JSON, mencatat log, cek login, validasi, dan menangani error.",
    analogy:
      "Seperti satpam di gerbang kampus: memeriksa setiap tamu dulu, lalu mempersilakan masuk (next) atau menolaknya.",
    example: "app.use(express.json())",
    lesson: "crud-backend/express-dasar",
  },
  {
    slug: "controller",
    term: "Controller",
    aliases: ["handler", "route handler"],
    category: "Backend",
    definition:
      "Bagian kode yang menerima request dari route, memanggil service, lalu menyusun response dan status code. Controller sebaiknya tipis dan tidak berisi aturan bisnis.",
    analogy:
      "Seperti pelayan restoran: mencatat pesanan, meneruskannya ke dapur (service), lalu mengantar hasilnya, tanpa ikut memasak.",
    lesson: "crud-backend/struktur-proyek-backend",
  },
  {
    slug: "service-layer",
    term: "Service",
    aliases: ["service layer", "logika bisnis"],
    category: "Backend",
    definition:
      "Bagian kode yang berisi aturan bisnis aplikasi, misalnya aturan membuat atau mengubah tugas, sekaligus yang berbicara dengan database. Karena tidak bergantung pada req dan res, service mudah diuji dengan unit test.",
    analogy:
      "Seperti juru masak di dapur: ia hafal resep dan aturannya, tanpa perlu tahu siapa yang memesan atau duduk di meja mana.",
    lesson: "crud-backend/struktur-proyek-backend",
  },
  {
    slug: "validation",
    term: "Validasi",
    aliases: ["validation", "validasi input"],
    category: "Backend",
    definition:
      "Pengecekan apakah data yang masuk sudah sesuai aturan (jenis, panjang, format) sebelum diproses. Validasi di server wajib karena request bisa datang dari mana saja. Data yang tidak valid dijawab dengan status 400.",
    analogy:
      "Seperti petugas yang mengecek formulir pendaftaran: kolom kosong atau NIM yang salah format dikembalikan sebelum diproses.",
    lesson: "crud-backend/validasi-error-handling",
  },
  {
    slug: "zod",
    term: "Zod",
    aliases: ["z.object", "safeParse", "z.infer"],
    category: "Backend",
    definition:
      "Library untuk menulis aturan bentuk data (schema) lalu mengeceknya saat aplikasi berjalan. Zod juga membuat tipe TypeScript otomatis lewat z.infer. safeParse mengembalikan hasil berhasil atau gagal tanpa melempar error.",
    analogy:
      "Seperti contoh formulir resmi yang sekaligus dipakai petugas sebagai daftar cek: satu aturan untuk mencetak formulir dan memeriksa isiannya.",
    example: "const TaskInput = z.object({ title: z.string().min(1) });",
    lesson: "crud-backend/validasi-error-handling",
  },
  {
    slug: "error-handler",
    term: "Error Handler",
    aliases: ["error middleware", "penanganan error"],
    category: "Backend",
    definition:
      "Middleware khusus dengan empat parameter (err, req, res, next) yang menampung semua error di satu tempat, lalu mengirim pesan error dengan format seragam. Harus dipasang paling akhir.",
    analogy:
      "Seperti meja customer service: semua keluhan diarahkan ke satu meja dan dijawab dengan format yang sama.",
    example: "app.use((err, req, res, next) => res.status(500).json({ error: { message: 'Terjadi kesalahan' } }))",
    lesson: "crud-backend/validasi-error-handling",
  },
  {
    slug: "pagination",
    term: "Pagination",
    aliases: ["paginasi", "page", "limit", "offset"],
    category: "Backend",
    definition:
      "Cara membagi data yang banyak menjadi halaman-halaman kecil. Versi offset memakai page dan limit, lalu API mengirim info tambahan seperti total dan totalPages supaya client tahu masih ada halaman berikutnya.",
    analogy:
      "Seperti katalog belanja yang dibagi per halaman: kamu membuka halaman 2 tanpa harus melihat seluruh isi gudang sekaligus.",
    example: "GET /api/tasks?page=2&limit=10",
    lesson: "crud-backend/pagination-filter-search",
  },
  {
    slug: "cursor-pagination",
    term: "Cursor Pagination",
    aliases: ["keyset pagination"],
    category: "Backend",
    definition:
      "Pagination yang memakai penanda posisi terakhir (cursor, misalnya id item terakhir), bukan nomor halaman. Lebih cepat untuk data besar, dan tidak ada item yang terlewat atau muncul dua kali saat ada data baru.",
    analogy:
      "Seperti pembatas buku: kamu lanjut membaca dari halaman yang ditandai, bukan menghitung ulang dari halaman pertama.",
    example: "prisma.task.findMany({ take: 10, skip: 1, cursor: { id: lastId } })",
    lesson: "expert/performa-backend",
  },
  {
    slug: "logging",
    term: "Logging",
    aliases: ["log", "logger"],
    category: "Backend",
    definition:
      "Mencatat kejadian penting di server, seperti request yang masuk, lama prosesnya, dan error, supaya masalah bisa dilacak. Jangan pernah mencatat password atau token.",
    analogy:
      "Seperti buku tamu di pos satpam: siapa datang, jam berapa, ada kejadian apa, tapi PIN atau kata sandi tamu tidak ikut ditulis.",
    example: "GET /api/tasks 200 12ms",
    lesson: "crud-backend/struktur-proyek-backend",
  },
  {
    slug: "api-contract",
    term: "Kontrak API",
    aliases: ["API contract"],
    category: "Backend",
    definition:
      "Kesepakatan tertulis antara frontend (aplikasi) dan backend (server) tentang endpoint, bentuk request, bentuk response, dan format error. Selama kesepakatan itu dipatuhi, kedua sisi bisa dikerjakan terpisah.",
    analogy:
      "Seperti format pesanan yang disepakati warung dan aplikasi GoFood: selama formatnya sama, dapur dan aplikasi bisa berbenah sendiri-sendiri.",
    example: "200 { data: Task[], meta: { page, limit, total, totalPages } }",
    lesson: "fullstack/arsitektur-fullstack",
  },
  {
    slug: "multer",
    term: "Multer",
    category: "Backend",
    definition:
      "Middleware Express untuk menerima file yang di-upload lewat multipart/form-data. Multer bisa membatasi ukuran dan jenis file, lalu menyimpannya ke disk atau memori.",
    analogy:
      "Seperti penjaga kos yang menerima paket: membuka kardus kiriman, menolak barang yang terlalu besar, lalu menyimpannya di rak.",
    example: "router.post('/:id/attachments', upload.single('file'), handler)",
    lesson: "fullstack/upload-gambar",
  },
  {
    slug: "repository-pattern",
    term: "Repository Pattern",
    aliases: ["repository"],
    category: "Backend",
    definition:
      "Cara menyusun kode yang mengumpulkan semua akses data di satu tempat, misalnya taskRepository.findById(). Service tidak perlu tahu data diambil dari mana, jadi sumbernya mudah diganti atau dipalsukan (mock) saat testing.",
    analogy:
      "Seperti petugas gudang: kamu cukup minta “ambilkan barang A” tanpa perlu tahu barang itu disimpan di rak mana.",
    lesson: "expert/clean-architecture",
  },
  {
    slug: "dependency-injection",
    term: "Dependency Injection",
    aliases: ["DI"],
    category: "Backend",
    definition:
      "Cara memberikan kebutuhan sebuah fungsi (misalnya repository atau koneksi database) dari luar, bukan dibuat di dalam fungsi itu. Kode jadi tidak saling mengikat dan mudah diuji dengan versi palsu.",
    analogy:
      "Seperti koki yang menerima bahan dari pemilik warung, bukan belanja sendiri: bahannya bisa diganti bahan latihan tanpa mengubah cara memasak.",
    example: "const service = createTaskService({ repo: fakeRepo });",
    lesson: "expert/clean-architecture",
  },
  {
    slug: "caching",
    term: "Caching",
    aliases: ["cache"],
    category: "Backend",
    definition:
      "Menyimpan hasil yang lama atau berat untuk didapat, supaya permintaan berikutnya lebih cepat. Tantangannya, menentukan kapan simpanan itu sudah basi dan harus diperbarui.",
    analogy:
      "Seperti menulis jawaban yang sering ditanya di papan tulis: tidak perlu menghitung ulang, tapi harus dihapus kalau datanya berubah.",
    lesson: "expert/performa-backend",
  },

  // ===== React =====
  {
    slug: "react",
    term: "React",
    category: "React",
    definition:
      "Library JavaScript untuk membangun tampilan aplikasi dari potongan-potongan kecil (komponen). Kamu menulis tampilan berdasarkan data, lalu React memperbarui layar setiap kali data berubah.",
    analogy:
      "Seperti memberi tahu tukang cat warna akhir yang kamu mau, bukan langkah demi langkahnya: kamu menulis tampilan berdasarkan data, lalu React yang mengurus cara mengubah layarnya.",
    lesson: "react-native/dasar-react",
  },
  {
    slug: "component",
    term: "Komponen",
    aliases: ["component", "function component"],
    category: "React",
    definition:
      "Potongan tampilan yang bisa dipakai ulang, misalnya TaskCard. Bentuknya fungsi yang mengembalikan JSX, dan namanya diawali huruf kapital.",
    analogy:
      "Seperti balok LEGO: satu bentuk balok bisa dipasang berkali-kali dan digabung menjadi bangunan yang lebih besar.",
    example: "function TaskCard({ task }) { return <Text>{task.title}</Text>; }",
    lesson: "react-native/dasar-react",
  },
  {
    slug: "jsx",
    term: "JSX",
    aliases: ["JavaScript XML"],
    category: "React",
    definition:
      "Cara menulis tampilan dengan tulisan mirip HTML di dalam JavaScript. Kode JavaScript disisipkan di dalam kurung kurawal, dan JSX diubah menjadi pemanggilan fungsi biasa sebelum dijalankan.",
    analogy:
      "Seperti template undangan nikah: teksnya tetap, tapi bagian nama tamu diisi otomatis dengan nama yang sebenarnya.",
    example: "<Text>{task.done ? 'Selesai' : 'Belum'}</Text>",
    lesson: "react-native/dasar-react",
  },
  {
    slug: "props",
    term: "Props",
    aliases: ["properties", "children"],
    category: "React",
    definition:
      "Data yang dikirim dari komponen induk ke komponen anak, mirip isian pada fungsi. Komponen anak hanya memakai props, tidak boleh mengubahnya (read-only).",
    analogy:
      "Seperti pesanan ke tukang jahit: kamu memberi ukuran dan warna kain, tukang jahit memakainya tanpa mengganti pesananmu.",
    example: "<TaskCard task={task} onToggle={handleToggle} />",
    lesson: "react-native/dasar-react",
  },
  {
    slug: "state",
    term: "State",
    aliases: ["useState"],
    category: "React",
    definition:
      "Data milik komponen yang bisa berubah, misalnya isi kolom ketik atau daftar tugas. Setiap kali state diubah lewat fungsi setter, tampilan digambar ulang (re-render) dengan data baru.",
    analogy:
      "Seperti papan skor futsal: begitu petugas mengganti angka, semua penonton langsung melihat skor terbaru.",
    example: "const [title, setTitle] = useState('');",
    lesson: "react-native/state-event",
  },
  {
    slug: "event-handler",
    term: "Event Handler",
    aliases: ["onPress", "onChangeText", "onClick"],
    category: "React",
    definition:
      "Fungsi yang dijalankan saat pengguna melakukan sesuatu, misalnya menekan tombol atau mengetik. Yang diberikan ke prop adalah fungsinya, bukan hasil memanggil fungsi itu.",
    analogy:
      "Seperti bel di meja resepsionis: petugas baru datang ketika bel ditekan, bukan sebelumnya.",
    example: "<Pressable onPress={() => toggle(task.id)} />",
    lesson: "react-native/state-event",
  },
  {
    slug: "hook",
    term: "Hook",
    aliases: ["React Hooks", "aturan hook"],
    category: "React",
    definition:
      "Fungsi khusus React yang namanya diawali use, seperti useState dan useEffect. Hook membuat komponen fungsi bisa memakai fitur React, misalnya menyimpan state. Aturannya, panggil hook di bagian paling atas komponen atau custom hook, jangan di dalam if atau perulangan (loop).",
    analogy:
      "Seperti absen kelas yang dipanggil sesuai urutan nomor: React mengenali tiap hook dari urutan pemanggilannya. Kalau satu hook kadang dilewati karena if, urutannya bergeser dan datanya tertukar.",
    lesson: "react-native/state-event",
  },
  {
    slug: "effect",
    term: "useEffect",
    aliases: ["effect", "side effect", "dependency array", "cleanup"],
    category: "React",
    definition:
      "Hook untuk menjalankan kode setelah tampilan selesai digambar (render), biasanya untuk urusan di luar React seperti mengambil data dari API atau memasang timer. Dependency array (daftar di argumen kedua) menentukan kapan kode itu dijalankan ulang. Fungsi cleanup (fungsi yang di-return) membereskannya sebelum efek berikutnya jalan atau saat komponen hilang dari layar.",
    analogy:
      "Seperti pengingat di HP yang berbunyi setiap kali jadwal kuliah berubah: dependency array adalah hal yang dipantau, dan cleanup ibarat mematikan pengingat lama sebelum memasang yang baru.",
    example: "useEffect(() => { load(); }, [page]);",
    lesson: "react-native/effect-list-custom-hook",
  },
  {
    slug: "key-prop",
    term: "key",
    aliases: ["key prop"],
    category: "React",
    definition:
      "Prop khusus berisi nilai unik yang tidak berubah-ubah (biasanya id) untuk setiap item di list. Dengan key, React tahu item mana yang ditambah, dihapus, atau dipindah. Jangan memakai index array (nomor urut) sebagai key kalau urutan datanya bisa berubah.",
    analogy:
      "Seperti NIM di daftar hadir: walaupun mahasiswa pindah tempat duduk, dosen tetap mengenali tiap orang dari NIM-nya, bukan dari nomor kursinya.",
    example: "tasks.map((t) => <TaskCard key={t.id} task={t} />)",
    lesson: "react-native/effect-list-custom-hook",
  },
  {
    slug: "custom-hook",
    term: "Custom Hook",
    category: "React",
    definition:
      "Hook buatanmu sendiri, yaitu fungsi yang namanya diawali use dan di dalamnya memanggil hook lain. Gunanya membungkus logika yang dipakai di banyak komponen, misalnya useFetch atau useTasks, supaya tidak ditulis ulang.",
    analogy:
      "Seperti resep andalan yang kamu tulis sekali lalu dipakai berkali-kali: setiap komponen yang memakainya memasak porsinya sendiri dari resep yang sama.",
    example: "const { data, loading, error } = useFetch('/api/tasks');",
    lesson: "react-native/effect-list-custom-hook",
  },
  {
    slug: "controlled-input",
    term: "Controlled Input",
    aliases: ["form terkontrol", "controlled component"],
    category: "React",
    definition:
      "Kolom input yang isinya disimpan di state dan diperbarui lewat event handler setiap kali pengguna mengetik. Jadi state adalah satu-satunya sumber nilai input. Cara ini memudahkan validasi dan mengosongkan form.",
    analogy:
      "Seperti formulir yang diisi lewat petugas: kamu menyebut isinya, petugas mencatat di bukunya (state), lalu menyalinnya ke formulir. Isi formulir selalu sama dengan catatan petugas, jadi mudah dicek atau dihapus.",
    example: "<TextInput value={title} onChangeText={setTitle} />",
    lesson: "react-native/form-keyboard",
  },
  {
    slug: "context",
    term: "Context",
    aliases: ["React Context", "useContext", "Provider", "prop drilling"],
    category: "React",
    definition:
      "Fitur React untuk membagikan data ke banyak komponen sekaligus tanpa mengoper props lapis demi lapis (prop drilling). Cocok untuk data yang dipakai di banyak tempat dan jarang berubah, seperti tema atau user yang sedang login.",
    analogy:
      "Seperti pengumuman di grup WA kelas: ketua kelas cukup mengirim sekali dan semua anggota langsung tahu, tanpa pesan berantai dari satu orang ke orang berikutnya.",
    example: "const { user } = useContext(AuthContext);",
    lesson: "react-native/state-global-storage",
  },
  {
    slug: "zustand",
    term: "Zustand",
    aliases: ["store", "state global"],
    category: "React",
    definition:
      "Library ringan untuk state global (data yang dipakai banyak layar). Kamu membuat satu store berisi data dan fungsi pengubahnya. Setiap komponen hanya mengambil bagian yang ia butuhkan, jadi komponen lain tidak ikut digambar ulang tanpa perlu.",
    analogy:
      "Seperti papan pengumuman di lobi kos: semua penghuni bisa membaca dan menempel info, dan tiap orang cukup melirik bagian yang menyangkut dirinya.",
    example: "const tasks = useTaskStore((s) => s.tasks);",
    lesson: "react-native/state-global-storage",
  },
  {
    slug: "reconciliation",
    term: "Reconciliation",
    aliases: ["rekonsiliasi", "re-render", "render ulang"],
    category: "React",
    definition:
      "Proses React membandingkan hasil render baru dengan hasil sebelumnya, lalu hanya mengubah bagian layar yang berbeda. Render ulang (re-render) terjadi saat state, props, atau context sebuah komponen berubah, atau saat komponen induknya di-render ulang.",
    analogy:
      "Seperti merevisi slide presentasi: kamu membandingkan versi baru dengan versi lama, lalu hanya mengganti slide yang berubah, bukan mencetak ulang semuanya.",
    lesson: "expert/performa-mobile",
  },
  {
    slug: "memoization",
    term: "Memoization",
    aliases: ["memo", "React.memo", "useMemo", "useCallback"],
    category: "React",
    definition:
      "Teknik menyimpan hasil supaya tidak dihitung ulang kalau bahannya sama. React.memo melewati render ulang jika props tidak berubah. useMemo menyimpan hasil hitungan, dan useCallback menyimpan fungsi yang sama di antara render.",
    analogy:
      "Seperti mencatat hasil hitungan di pinggir kertas ujian: kalau soal yang sama muncul lagi, kamu tinggal menyalin jawabannya tanpa menghitung ulang.",
    example: "const TaskCard = memo(function TaskCard({ task }) { /* ... */ });",
    lesson: "expert/performa-mobile",
  },
  {
    slug: "server-state",
    term: "Server State",
    aliases: ["client state"],
    category: "React",
    definition:
      "Data yang aslinya tersimpan di server, misalnya daftar tugas. Aplikasi hanya memegang salinannya, dan salinan itu bisa basi (ketinggalan) kalau data di server berubah. Karena itu server state butuh cache dan pengambilan ulang, berbeda dengan client state seperti isi form yang hanya ada di HP.",
    analogy:
      "Seperti jadwal kuliah yang kamu foto dari papan pengumuman: fotonya praktis, tapi bisa ketinggalan kalau bagian akademik mengubah jadwal. Catatan pribadimu di buku (client state) tidak punya masalah itu.",
    lesson: "fullstack/tanstack-query",
  },
  {
    slug: "tanstack-query",
    term: "TanStack Query",
    aliases: ["React Query", "useQuery", "useMutation"],
    category: "React",
    definition:
      "Library untuk mengurus server state: mengambil data dari API, menyimpannya di cache (simpanan sementara), mengambil ulang saat perlu, dan mengirim perubahan. useQuery dipakai untuk membaca data, sedangkan useMutation untuk menambah, mengubah, dan menghapus.",
    analogy:
      "Seperti asisten dosen yang mencatat jawaban di papan tulis: teman yang menanyakan hal sama tinggal melihat papan, dan asisten memperbarui catatannya kalau jawabannya berubah.",
    example: "const { data, isPending, error } = useQuery({ queryKey: ['tasks'], queryFn: fetchTasks });",
    lesson: "fullstack/tanstack-query",
  },
  {
    slug: "query-key",
    term: "Query Key",
    aliases: ["queryKey"],
    category: "React",
    definition:
      "Array yang menjadi nama atau label sebuah data di cache TanStack Query. Masukkan semua hal yang memengaruhi hasil, seperti filter atau id. Dengan begitu, setiap kombinasi filter punya simpanan cache sendiri.",
    analogy:
      "Seperti label di map arsip (“Tugas, selesai, halaman 1”): setiap kombinasi label punya map sendiri, jadi isinya tidak tertukar.",
    example: "['tasks', { status: 'DONE', page: 1 }]",
    lesson: "fullstack/tanstack-query",
  },
  {
    slug: "cache-invalidation",
    term: "Cache Invalidation",
    aliases: ["invalidateQueries", "invalidasi cache"],
    category: "React",
    definition:
      "Menandai data di cache sebagai basi supaya diambil ulang dari server. Biasanya dilakukan setelah mutation (perubahan data lewat API) berhasil, sehingga daftar langsung menampilkan data terbaru.",
    analogy:
      "Seperti menghapus jawaban lama di papan tulis setelah dosen meralat soal, supaya orang berikutnya bertanya lagi dan mendapat jawaban terbaru.",
    example: "queryClient.invalidateQueries({ queryKey: ['tasks'] })",
    lesson: "fullstack/tanstack-query",
  },
  {
    slug: "stale-time",
    term: "staleTime & gcTime",
    aliases: ["staleTime", "gcTime"],
    category: "React",
    definition:
      "Dua pengaturan waktu di TanStack Query. staleTime adalah lama data dianggap masih segar, jadi tidak diambil ulang dari server (bawaannya 0, artinya data langsung dianggap basi). gcTime adalah lama data yang sudah tidak dipakai layar mana pun tetap disimpan sebelum dibuang (bawaannya 5 menit).",
    analogy:
      "Seperti nasi di rice cooker: staleTime adalah berapa lama nasi dianggap masih hangat sehingga tidak perlu dimasak lagi, sedangkan gcTime adalah berapa lama sisa nasi yang tidak dimakan siapa pun disimpan sebelum dibuang.",
    example: "useQuery({ queryKey: ['tasks'], queryFn, staleTime: 30_000 })",
    lesson: "fullstack/tanstack-query",
  },
  {
    slug: "optimistic-update",
    term: "Optimistic Update",
    aliases: ["update optimis", "rollback"],
    category: "React",
    definition:
      "Teknik mengubah tampilan seolah request sudah berhasil, sebelum server menjawab. Kalau ternyata gagal, tampilan dikembalikan ke keadaan semula (rollback). Hasilnya, aplikasi terasa langsung merespons.",
    analogy:
      "Seperti langsung mencoret barang di daftar belanja begitu kamu mengambilnya, lalu menulisnya lagi kalau ternyata kasir bilang barang itu tidak bisa dibeli.",
    example: "onMutate: simpan snapshot lalu ubah cache; onError: kembalikan snapshot",
    lesson: "fullstack/delete-optimistic",
  },

  // ===== React Native =====
  {
    slug: "react-native",
    term: "React Native",
    aliases: ["RN"],
    category: "React Native",
    definition:
      "Framework (kerangka kerja) untuk membuat aplikasi Android dan iOS memakai React dan JavaScript. Komponen seperti View dan Text diubah menjadi tampilan native (tampilan asli bawaan HP), bukan elemen HTML seperti di web.",
    analogy:
      "Seperti satu resep yang dimasak di dua dapur berbeda: kamu menulis satu kode, lalu HP Android dan iPhone menyajikannya dengan peralatan asli masing-masing.",
    lesson: "react-native/intro-react-native-expo",
  },
  {
    slug: "expo-go",
    term: "Expo Go",
    category: "React Native",
    definition:
      "Aplikasi gratis di Play Store dan App Store untuk mencoba proyek Expo langsung di HP. Kamu cukup memindai QR code, tanpa perlu membuat build (merakit file aplikasi) sendiri. Kekurangannya, Expo Go hanya mendukung library native yang sudah ada di dalamnya.",
    analogy:
      "Seperti tester parfum di toko: kamu bisa langsung mencoba tanpa membeli botol sendiri, tapi pilihan aromanya terbatas pada yang tersedia di etalase.",
    lesson: "react-native/intro-react-native-expo",
  },
  {
    slug: "development-build",
    term: "Development Build",
    aliases: ["dev client", "expo-dev-client"],
    category: "React Native",
    definition:
      "Versi uji coba dari aplikasimu sendiri yang dipasang di HP dan berisi expo-dev-client. Kamu butuh ini saat memakai library native yang tidak ada di Expo Go. Perubahan kode tetap langsung terlihat (fast refresh) lewat Metro.",
    analogy:
      "Kalau Expo Go itu tester parfum di toko, development build adalah parfum racikan pribadimu: bahannya bebas kamu pilih, dan masih bisa diubah sambil dicoba.",
    example: "eas build --profile development --platform android",
    lesson: "expert/deploy-ci",
  },
  {
    slug: "metro",
    term: "Metro",
    aliases: ["Metro bundler", "bundler"],
    category: "React Native",
    definition:
      "Bundler (alat penggabung kode) untuk React Native. Metro mengumpulkan semua file JavaScript-mu menjadi satu paket (bundle), lalu mengirimkannya ke aplikasi di HP selama development. Metro berjalan saat kamu menjalankan npx expo start.",
    analogy:
      "Seperti kurir yang mengambil barang pesananmu dari banyak rak, mengemasnya jadi satu paket, lalu mengantarkannya ke HP setiap kali ada perubahan.",
    example: "npx expo start --clear",
    lesson: "react-native/intro-react-native-expo",
  },
  {
    slug: "core-components",
    term: "Komponen Inti",
    aliases: ["core components", "View", "Text", "Image", "ScrollView", "TextInput"],
    category: "React Native",
    definition:
      "Komponen bawaan React Native untuk menyusun tampilan. View adalah wadah, Text untuk semua tulisan, Image untuk gambar, ScrollView untuk isi yang bisa digulir, dan TextInput untuk kolom ketik.",
    analogy:
      "Seperti balok LEGO dasar yang ada di setiap kotak: semua tampilan, serumit apa pun, disusun dari balok-balok ini.",
    example: "<View><Text>Halo, mahasiswa!</Text></View>",
    lesson: "react-native/core-components",
  },
  {
    slug: "pressable",
    term: "Pressable",
    aliases: ["tombol", "onPress", "onLongPress"],
    category: "React Native",
    definition:
      "Komponen untuk membuat bagian layar yang bisa ditekan. Pressable punya onPress (saat ditekan) dan onLongPress (saat ditekan lama), dan tahu kapan sedang ditekan (pressed) sehingga gayanya bisa berubah. Lebih fleksibel daripada Button bawaan kalau kamu ingin tombol dengan gaya sendiri.",
    analogy:
      "Seperti bel pintu kos yang lampunya menyala saat ditekan: kamu tahu bel sedang ditekan, dan penghuni bisa bereaksi berbeda untuk tekan sebentar atau tekan lama.",
    example: "<Pressable onPress={save} style={({ pressed }) => [styles.btn, pressed && styles.pressed]} />",
    lesson: "react-native/core-components",
  },
  {
    slug: "stylesheet",
    term: "StyleSheet",
    aliases: ["style"],
    category: "React Native",
    definition:
      "Cara menulis gaya tampilan (warna, jarak, ukuran) di React Native memakai object JavaScript. Nama properti ditulis camelCase (misalnya backgroundColor), dan angka ditulis tanpa satuan seperti px. Gaya tidak menurun otomatis dari wadah ke isinya seperti CSS di web, jadi setiap komponen diberi gaya langsung lewat prop style.",
    analogy:
      "Seperti kartu ukuran jahit untuk tiap baju: satu kartu (style) dipasang ke satu baju (komponen), dan baju lain tidak otomatis ikut ukuran itu.",
    example: "const styles = StyleSheet.create({ card: { padding: 16, borderRadius: 12 } });",
    lesson: "react-native/styling-flexbox",
  },
  {
    slug: "flexbox",
    term: "Flexbox",
    aliases: ["flexDirection", "justifyContent", "alignItems", "gap"],
    category: "React Native",
    definition:
      "Cara mengatur posisi elemen yang berbaris dalam satu arah, ke bawah atau ke samping. Di React Native, arah bawaannya ke bawah (flexDirection: column). justifyContent mengatur posisi di arah utama, alignItems mengatur posisi di arah sebaliknya (sumbu silang), dan gap memberi jarak antar-elemen.",
    analogy:
      "Seperti mengatur antrean: kamu menentukan antre ke samping atau ke belakang (flexDirection), cara membagi jarak sepanjang antrean (justifyContent), dan posisi rata kiri, tengah, atau kanan (alignItems).",
    example: "{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }",
    lesson: "react-native/styling-flexbox",
  },
  {
    slug: "flatlist",
    term: "FlatList",
    aliases: ["keyExtractor", "renderItem", "onEndReached", "virtualisasi"],
    category: "React Native",
    definition:
      "Komponen untuk menampilkan daftar panjang. FlatList hanya menggambar item yang sedang terlihat di layar (virtualisasi), jadi hemat memori. Fitur bawaannya antara lain tarik untuk refresh, tampilan saat daftar kosong, dan memuat data berikutnya saat digulir sampai bawah lewat onEndReached.",
    analogy:
      "Seperti pelayan di restoran besar yang hanya melayani meja di depan matanya: meja lain baru dilayani saat ia berjalan ke sana, jadi tenaganya tidak terbuang.",
    example: "<FlatList data={tasks} keyExtractor={(t) => String(t.id)} renderItem={({ item }) => <TaskCard task={item} />} />",
    lesson: "react-native/flatlist",
  },
  {
    slug: "flashlist",
    term: "FlashList",
    category: "React Native",
    definition:
      "Komponen list buatan Shopify. FlashList memakai ulang tampilan item yang sudah keluar dari layar untuk item baru, daripada membuatnya dari nol. Hasilnya, daftar yang sangat panjang terasa lebih mulus daripada FlatList.",
    analogy:
      "Seperti papan nama menu di meja prasmanan: saat menu diganti, papannya tidak dibuang, cukup diganti tulisannya, jadi lebih cepat daripada membuat papan baru.",
    lesson: "expert/performa-mobile",
  },
  {
    slug: "expo-router",
    term: "Expo Router",
    aliases: ["file-based routing", "_layout"],
    category: "React Native",
    definition:
      "Library navigasi (perpindahan antar-layar) berbasis file. Setiap file di folder app/ otomatis menjadi satu layar dengan alamat (URL) sendiri. File _layout.tsx menentukan cara layar-layar di folder itu ditampilkan, misalnya bertumpuk (Stack) atau memakai tab (Tabs).",
    analogy:
      "Seperti denah gedung kampus: setiap ruangan (file) otomatis punya nomor ruang (URL), dan aturan di tiap lantai (_layout) menentukan cara berpindah antar-ruangan.",
    example: "app/tasks/[id].tsx → /tasks/42",
    lesson: "react-native/expo-router",
  },
  {
    slug: "stack-tabs",
    term: "Stack & Tabs",
    aliases: ["stack navigator", "tab navigator"],
    category: "React Native",
    definition:
      "Dua cara navigasi yang paling umum. Stack menumpuk layar baru di atas layar lama, dan tombol kembali membuang layar paling atas. Tabs menampilkan bar menu (biasanya di bawah layar) untuk berpindah antar-bagian utama aplikasi.",
    analogy:
      "Stack seperti tumpukan piring: yang terakhir ditaruh, diambil duluan. Tabs seperti deretan pintu ruangan di satu lorong yang bisa kamu masuki kapan saja.",
    lesson: "react-native/expo-router",
  },
  {
    slug: "dynamic-route",
    term: "Route Dinamis",
    aliases: ["dynamic route", "[id]", "useLocalSearchParams"],
    category: "React Native",
    definition:
      "Layar Expo Router yang nama filenya memakai kurung siku, misalnya [id].tsx. Satu file ini melayani banyak alamat, seperti /tasks/1 dan /tasks/42. Nilai di dalam kurung dibaca dengan useLocalSearchParams, dan isinya selalu teks (string), bukan angka.",
    analogy:
      "Seperti satu formulir cetak “Kartu Mahasiswa, NIM: ____”: formulirnya sama, hanya NIM yang diisi berbeda untuk tiap orang.",
    example: "const { id } = useLocalSearchParams<{ id: string }>();",
    lesson: "react-native/expo-router",
  },
  {
    slug: "keyboard-avoiding-view",
    term: "KeyboardAvoidingView",
    aliases: ["keyboard"],
    category: "React Native",
    definition:
      "Komponen yang menggeser atau mengecilkan isi layar saat keyboard muncul, supaya kolom ketik tidak tertutup keyboard. Di iOS biasanya diatur dengan behavior 'padding'.",
    analogy:
      "Seperti menggeser buku catatanmu ke atas meja saat teman menaruh tas di depanmu, supaya tulisanmu tetap terlihat.",
    example: "<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>",
    lesson: "react-native/form-keyboard",
  },
  {
    slug: "async-storage",
    term: "AsyncStorage",
    aliases: ["@react-native-async-storage/async-storage"],
    category: "React Native",
    definition:
      "Tempat menyimpan data sederhana di HP dalam bentuk pasangan nama dan nilai (key-value), dan nilainya berupa teks. Datanya tidak dienkripsi (tidak diacak), jadi cocok untuk pengaturan seperti tema atau cache ringan, tapi jangan dipakai untuk token atau data rahasia.",
    analogy:
      "Seperti laci meja biasa di kamar kos: praktis untuk menyimpan barang sehari-hari, tapi siapa pun yang masuk kamar bisa membukanya.",
    example: "await AsyncStorage.setItem('tema', 'gelap');",
    lesson: "react-native/state-global-storage",
  },
  {
    slug: "secure-store",
    term: "SecureStore",
    aliases: ["expo-secure-store", "Keychain", "Keystore"],
    category: "React Native",
    definition:
      "Library Expo untuk menyimpan data kecil secara terenkripsi (diacak dan dikunci). Di iOS memakai Keychain dan di Android memakai Keystore, yaitu tempat penyimpanan aman bawaan sistem HP. Di sinilah access token dan refresh token sebaiknya disimpan.",
    analogy:
      "Kalau AsyncStorage itu laci biasa, SecureStore adalah brankas berkunci: muatannya kecil, tapi isinya aman dari orang lain.",
    example: "await SecureStore.setItemAsync('refreshToken', token);",
    lesson: "react-native/state-global-storage",
  },
  {
    slug: "safe-area",
    term: "Safe Area",
    aliases: ["SafeAreaView", "useSafeAreaInsets", "notch"],
    category: "React Native",
    definition:
      "Bagian layar yang tidak tertutup poni kamera (notch), status bar (baris jam dan baterai), dan garis navigasi di bawah layar. Pakai library react-native-safe-area-context supaya isi aplikasimu tidak tertutup bagian-bagian itu.",
    analogy:
      "Seperti margin di kertas ujian: kamu menulis di area tengah yang aman supaya tulisan tidak terpotong steples atau lubang map.",
    example: "const insets = useSafeAreaInsets();",
    lesson: "react-native/ui-native",
  },
  {
    slug: "dark-mode",
    term: "Dark Mode",
    aliases: ["useColorScheme", "mode gelap", "tema"],
    category: "React Native",
    definition:
      "Tema warna gelap yang mengikuti pengaturan HP pengguna. Hook useColorScheme memberi tahu pengaturan itu, 'light' (terang) atau 'dark' (gelap), sehingga aplikasi bisa memilih warna yang cocok.",
    analogy:
      "Seperti meredupkan lampu kamar saat malam: aplikasi membaca pengaturan HP, lalu menyesuaikan warnanya supaya nyaman di mata.",
    example: "const scheme = useColorScheme();",
    lesson: "react-native/ui-native",
  },
  {
    slug: "expo-public-env",
    term: "EXPO_PUBLIC_",
    aliases: ["EXPO_PUBLIC_API_URL"],
    category: "React Native",
    definition:
      "Awalan nama yang wajib dipakai supaya environment variable (pengaturan dari luar kode) bisa dibaca di aplikasi Expo. Nilainya ikut dimasukkan ke dalam aplikasi dan bisa dilihat siapa saja yang membongkarnya. Karena itu, jangan pernah menaruh password atau secret di sana.",
    analogy:
      "Seperti tulisan di papan nama depan kos: semua orang yang lewat bisa membacanya. Cocok untuk alamat, tidak cocok untuk kode kunci pintu.",
    example: "const BASE_URL = process.env.EXPO_PUBLIC_API_URL;",
    lesson: "fullstack/menghubungkan-expo-api",
  },
  {
    slug: "protected-route",
    term: "Protected Route",
    aliases: ["Stack.Protected", "rute terlindungi", "guard"],
    category: "React Native",
    definition:
      "Layar yang hanya boleh dibuka pengguna yang sudah login. Pengguna yang belum login diarahkan ke layar login. Di Expo Router dibuat dengan Stack.Protected dan prop guard (syarat yang harus bernilai benar).",
    analogy:
      "Seperti ruang dosen yang dijaga satpam: hanya yang menunjukkan kartu identitas boleh masuk, yang lain diarahkan ke meja resepsionis dulu.",
    example: "<Stack.Protected guard={!!user}><Stack.Screen name=\"(tabs)\" /></Stack.Protected>",
    lesson: "fullstack/autentikasi",
  },
  {
    slug: "image-picker",
    term: "expo-image-picker",
    aliases: ["image picker", "galeri", "kamera"],
    category: "React Native",
    definition:
      "Library Expo untuk memilih foto dari galeri atau memotret langsung dengan kamera. Hasilnya berupa URI, yaitu alamat file foto di HP, yang lalu bisa di-upload ke server memakai FormData.",
    analogy:
      "Seperti di studio foto: kamu bisa memilih foto lama dari album atau difoto di tempat, lalu menerima file-nya untuk dikirim ke tempat lain.",
    example: "const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });",
    lesson: "fullstack/upload-gambar",
  },
  {
    slug: "offline-first",
    term: "Offline-first",
    aliases: ["offline", "sinkronisasi", "NetInfo"],
    category: "React Native",
    definition:
      "Cara merancang aplikasi supaya tetap bisa dipakai tanpa internet. Data dibaca dari simpanan di HP, perubahan dicatat dalam antrean, lalu dikirim ke server (sinkronisasi) begitu koneksi kembali.",
    analogy:
      "Seperti kasir warung yang mencatat pesanan di buku saat sinyal hilang, lalu memasukkannya ke aplikasi kasir begitu sinyal kembali.",
    lesson: "expert/offline-first",
  },
  {
    slug: "local-notification",
    term: "Notifikasi Lokal",
    aliases: ["expo-notifications", "push notification"],
    category: "React Native",
    definition:
      "Notifikasi yang dijadwalkan oleh aplikasi itu sendiri di HP, misalnya pengingat satu jam sebelum deadline. Tidak perlu server. Kebalikannya, push notification dikirim dari server lewat internet.",
    analogy:
      "Seperti alarm yang kamu pasang sendiri di HP, sedangkan push notification mirip pesan yang dikirim admin grup WA dari tempat lain.",
    lesson: "expert/real-time",
  },

  // ===== Keamanan =====
  {
    slug: "autentikasi",
    term: "Autentikasi",
    aliases: ["authentication", "authn", "login"],
    category: "Keamanan",
    definition:
      "Proses memastikan siapa kamu, misalnya lewat email dan password. Kalau berhasil, server memberi token sebagai bukti identitas untuk request berikutnya. Kalau gagal, server menjawab dengan status 401 (Unauthorized).",
    analogy:
      "Seperti satpam kampus yang memeriksa KTM di gerbang: setelah cocok, kamu diberi kartu masuk sehingga tidak perlu diperiksa dari awal setiap kali lewat.",
    lesson: "fullstack/autentikasi",
  },
  {
    slug: "otorisasi",
    term: "Otorisasi",
    aliases: ["authorization", "authz", "hak akses"],
    category: "Keamanan",
    definition:
      "Proses memeriksa apakah pengguna yang sudah dikenali boleh melakukan aksi tertentu atau membuka data tertentu. Kalau tidak boleh, server menjawab 403 (Forbidden). Bisa juga 404 kalau keberadaan data milik orang lain pun tidak boleh diketahui.",
    analogy:
      "Lolos gerbang kampus (autentikasi) belum tentu membuat KTM-mu bisa membuka ruang dosen atau ruang server. Pengecekan boleh atau tidaknya itulah otorisasi.",
    lesson: "expert/keamanan-api",
  },
  {
    slug: "jwt",
    term: "JWT",
    aliases: ["JSON Web Token", "Bearer token"],
    category: "Keamanan",
    definition:
      "Token login yang terdiri dari tiga bagian: header.payload.signature. Server membubuhkan tanda tangan digital (signature) memakai secret, jadi isinya tidak bisa diubah tanpa ketahuan. Payload hanya disandikan dengan Base64, bukan diacak, jadi siapa pun bisa membacanya. Jangan simpan data rahasia di dalamnya.",
    analogy:
      "Seperti gelang tiket konser: panitia bisa langsung mengecek keasliannya, dan gelang palsu ketahuan. Tapi tulisan di gelang bisa dibaca semua orang.",
    example: "Authorization: Bearer eyJhbGciOiJIUzI1NiIs...",
    lesson: "fullstack/autentikasi",
  },
  {
    slug: "access-token",
    term: "Access Token",
    category: "Keamanan",
    definition:
      "Token berumur pendek (di kursus ini 15 menit) yang dikirim di header Authorization setiap kali aplikasi memanggil endpoint yang dilindungi. Karena cepat kedaluwarsa, kerugiannya kecil kalau sampai bocor.",
    analogy:
      "Seperti gelang tiket konser harian: harus ditunjukkan setiap kali masuk area, dan besok sudah tidak berlaku.",
    example: "Authorization: Bearer <accessToken>",
    lesson: "fullstack/autentikasi",
  },
  {
    slug: "refresh-token",
    term: "Refresh Token",
    aliases: ["token rotation", "rotasi token"],
    category: "Keamanan",
    definition:
      "Token berumur panjang (30 hari) yang hanya dipakai untuk meminta access token baru saat yang lama kedaluwarsa. Dengan rotasi, setiap kali refresh token dipakai, server memberi yang baru dan membatalkan yang lama.",
    analogy:
      "Seperti kartu perpanjangan di loket tiket: kartu ini tidak dipakai untuk masuk, hanya untuk menukar gelang baru. Setiap kali ditukar, kartu lama diambil dan kamu menerima kartu baru.",
    example: "POST /api/auth/refresh { refreshToken }",
    lesson: "fullstack/autentikasi",
  },
  {
    slug: "hashing",
    term: "Hashing",
    aliases: ["hash", "salt"],
    category: "Keamanan",
    definition:
      "Mengubah data menjadi deretan karakter dengan panjang tetap secara satu arah, jadi nilai aslinya tidak bisa dikembalikan. Password disimpan dalam bentuk hash. Saat login, password yang diketik ikut di-hash, lalu hasilnya dibandingkan dengan hash yang tersimpan.",
    analogy:
      "Seperti blender: buah bisa dijadikan jus, tapi jus tidak bisa dikembalikan menjadi buah. Karena bahan yang sama selalu menghasilkan jus yang sama, kamu tetap bisa mencocokkannya.",
    lesson: "fullstack/autentikasi",
  },
  {
    slug: "bcrypt",
    term: "bcrypt",
    aliases: ["bcryptjs"],
    category: "Keamanan",
    definition:
      "Cara hashing khusus password yang sengaja dibuat lambat dan otomatis menambahkan salt (tambahan acak) ke setiap password. Akibatnya, penyerang butuh waktu sangat lama untuk menebak banyak password. Di Node.js tersedia lewat paket bcrypt atau bcryptjs.",
    analogy:
      "Seperti blender yang sengaja diputar lama dan diberi bumbu acak di setiap gelas: jus dari buah yang sama tetap terlihat berbeda, dan pencuri yang mencoba-coba butuh waktu sangat lama.",
    example: "const ok = await bcrypt.compare(password, user.passwordHash);",
    lesson: "fullstack/autentikasi",
  },
  {
    slug: "rate-limiting",
    term: "Rate Limiting",
    aliases: ["rate limit", "429", "brute force"],
    category: "Keamanan",
    definition:
      "Membatasi jumlah request dari satu sumber (misalnya satu alamat IP) dalam waktu tertentu. Gunanya mencegah brute force (menebak password berkali-kali) dan penyalahgunaan lain. Request yang melewati batas dijawab dengan status 429 Too Many Requests.",
    analogy:
      "Seperti batas nomor antrean di bank: satu orang hanya boleh mengambil beberapa nomor per jam, sisanya disuruh kembali nanti.",
    example: "20 request per 15 menit untuk /api/auth",
    lesson: "expert/keamanan-api",
  },
  {
    slug: "idor",
    term: "IDOR / BOLA",
    aliases: ["Broken Object Level Authorization", "Insecure Direct Object Reference"],
    category: "Keamanan",
    definition:
      "Celah keamanan saat API membaca atau mengubah data hanya berdasarkan id di URL, tanpa mengecek siapa pemiliknya. Akibatnya, pengguna bisa melihat atau mengubah data orang lain cukup dengan mengganti angka id. Cegah dengan selalu menyertakan userId pemilik di query.",
    analogy:
      "Seperti loket ambil paket yang menyerahkan paket hanya karena kamu menyebut nomor resi, tanpa mengecek KTP: siapa pun bisa mengambil paket orang lain.",
    example: "prisma.task.findFirst({ where: { id, userId: req.userId } })",
    lesson: "expert/keamanan-api",
  },
  {
    slug: "owasp",
    term: "OWASP API Top 10",
    aliases: ["OWASP"],
    category: "Keamanan",
    definition:
      "Daftar sepuluh risiko keamanan API yang paling sering terjadi, disusun oleh komunitas keamanan OWASP. Contohnya otorisasi yang rusak, autentikasi lemah, dan pemakaian sumber daya tanpa batas. Daftar ini berguna sebagai checklist saat memeriksa keamanan API.",
    analogy:
      "Seperti daftar cek keselamatan kos dari petugas pemadam kebakaran: sepuluh sumber masalah yang paling sering terjadi, tinggal dicentang satu per satu.",
    lesson: "expert/keamanan-api",
  },
  {
    slug: "helmet",
    term: "Helmet",
    category: "Keamanan",
    definition:
      "Middleware Express yang memasang banyak header keamanan HTTP sekaligus. Header ini menyuruh browser lebih berhati-hati, misalnya menolak halamanmu ditampilkan diam-diam di dalam situs lain (clickjacking) dan tidak menebak-nebak jenis isi file.",
    analogy:
      "Seperti memasang satu paket pengaman di kos sekaligus (gembok, teralis, CCTV), daripada membeli dan memasangnya satu per satu.",
    example: "app.use(helmet())",
    lesson: "expert/keamanan-api",
  },
  {
    slug: "secret",
    term: "Secret",
    aliases: ["rahasia", "API key", "JWT_ACCESS_SECRET"],
    category: "Keamanan",
    definition:
      "Nilai rahasia seperti secret JWT, password database, atau API key. Simpan di environment variable atau secret manager (layanan penyimpan rahasia). Jangan pernah di-commit ke Git atau dimasukkan ke dalam aplikasi mobile.",
    analogy:
      "Seperti PIN ATM: hanya kamu yang tahu, tidak ditulis di kartunya, dan tidak pernah dikirim ke grup WA.",
    lesson: "expert/keamanan-api",
  },
  {
    slug: "sql-injection",
    term: "SQL Injection",
    category: "Keamanan",
    definition:
      "Serangan dengan menyelipkan potongan perintah SQL lewat kolom input, sehingga arti query berubah. Akibatnya bisa parah, misalnya seluruh tabel bocor atau terhapus. Cara mencegahnya adalah parameterized query (input dikirim terpisah dari perintah), dan Prisma sudah melakukannya otomatis.",
    analogy:
      "Seperti menulis “dan serahkan semua uang di brankas” di kolom nama pada slip setoran bank, lalu teller yang ceroboh membacanya sebagai perintah.",
    example: "email = '' OR '1'='1'",
    lesson: "expert/keamanan-api",
  },

  // ===== DevOps =====
  {
    slug: "git",
    term: "Git",
    aliases: ["version control", "commit", "GitHub"],
    category: "DevOps",
    definition:
      "Alat version control, yaitu pencatat riwayat perubahan kode. Setiap catatan perubahan disebut commit. Dengan Git kamu bisa kembali ke versi lama dan bekerja bersama teman lewat layanan seperti GitHub.",
    analogy:
      "Seperti riwayat revisi skripsi yang rapi (“revisi 1: tambah bab 2”): kamu bisa membuka versi mana pun dan tahu siapa mengubah apa.",
    example: "git commit -m \"feat: tambah endpoint tasks\"",
    lesson: "fondasi/setup-tools",
  },
  {
    slug: "env-variable",
    term: "Environment Variable",
    aliases: ["env", ".env", "process.env", "dotenv"],
    category: "DevOps",
    definition:
      "Pengaturan yang dibaca dari lingkungan tempat aplikasi berjalan, bukan ditulis langsung di kode, misalnya PORT, DATABASE_URL, atau secret. Kode yang sama bisa jalan di laptop dan di server hanya dengan mengganti nilainya. File .env yang berisi nilai-nilai ini tidak boleh di-commit ke Git.",
    analogy:
      "Seperti kunci kamar kos yang tidak ditempel di pintu: bentuk kamarnya (kode) sama untuk semua penghuni, tapi tiap penghuni memegang kuncinya sendiri.",
    example: "const port = Number(process.env.PORT ?? 3000);",
    lesson: "crud-backend/struktur-proyek-backend",
  },
  {
    slug: "linter",
    term: "Linter",
    aliases: ["ESLint", "lint"],
    category: "DevOps",
    definition:
      "Alat yang membaca kodemu tanpa menjalankannya untuk menemukan kesalahan umum dan gaya penulisan yang tidak seragam. Biasanya berjalan otomatis di editor dan di pipeline CI. Contoh yang paling populer adalah ESLint.",
    analogy:
      "Seperti fitur cek ejaan di Word: kata yang salah langsung digarisbawahi merah sebelum dokumennya kamu kirim.",
    example: "npx eslint .",
  },
  {
    slug: "unit-test",
    term: "Unit Test",
    aliases: ["test unit"],
    category: "DevOps",
    definition:
      "Test yang memeriksa satu bagian kecil kode, misalnya satu fungsi atau satu service, secara terpisah dari bagian lain. Hal yang dibutuhkannya, seperti database, diganti versi palsu (mock). Unit test cepat dijalankan dan langsung menunjukkan letak bug.",
    analogy:
      "Seperti mencicipi sambalnya saja sebelum disajikan: kalau rasanya salah, kamu langsung tahu masalahnya ada di sambal, bukan di lauk lain.",
    example: "expect(hitungProgres(tasks)).toBe(50);",
    lesson: "expert/testing-backend",
  },
  {
    slug: "integration-test",
    term: "Integration Test",
    aliases: ["test integrasi", "Supertest"],
    category: "DevOps",
    definition:
      "Test yang memeriksa beberapa bagian bekerja bersama, misalnya route, validasi, service, dan database khusus test. Di backend sering memakai Supertest untuk mengirim request ke app Express tanpa menyalakan server sungguhan.",
    analogy:
      "Seperti mencicipi satu piring nasi goreng lengkap: nasi, bumbu, dan telurnya dicoba sekaligus untuk memastikan semuanya cocok.",
    example: "await request(app).post('/api/tasks').send({ title: 'A' }).expect(201);",
    lesson: "expert/testing-backend",
  },
  {
    slug: "e2e-test",
    term: "E2E Test",
    aliases: ["end-to-end test", "Maestro"],
    category: "DevOps",
    definition:
      "Test yang meniru pengguna sungguhan dari awal sampai akhir di aplikasi yang sedang berjalan, misalnya login, membuat tugas, lalu melihatnya di daftar. Untuk aplikasi mobile bisa memakai alat seperti Maestro. Hasilnya paling mirip pemakaian nyata, tapi paling lambat dijalankan.",
    analogy:
      "Seperti pelanggan uji coba yang datang, memesan, makan, lalu membayar di warungmu: seluruh alur dicoba seperti hari buka sungguhan.",
    example: "- tapOn: \"Masuk\"",
    lesson: "expert/testing-mobile",
  },
  {
    slug: "mock",
    term: "Mock",
    aliases: ["mocking", "test double", "fake"],
    category: "DevOps",
    definition:
      "Versi palsu dari sesuatu yang dibutuhkan kode, misalnya API atau database, yang dipakai saat testing. Hasilnya bisa kamu atur sendiri, jadi test tidak bergantung pada internet.",
    analogy:
      "Seperti latihan sidang skripsi dengan teman yang berpura-pura jadi dosen penguji: pertanyaannya bisa diatur, dan kamu tidak perlu menunggu dosen asli.",
    example: "const getTasks = vi.fn().mockResolvedValue({ data: [] });",
    lesson: "expert/testing-mobile",
  },
  {
    slug: "vitest",
    term: "Vitest",
    aliases: ["test runner", "Jest"],
    category: "DevOps",
    definition:
      "Test runner (alat untuk menjalankan test) modern untuk JavaScript dan TypeScript. Test ditulis memakai describe, it, dan expect, mirip Jest. Di kursus ini Vitest dipakai untuk menguji API.",
    analogy:
      "Seperti juri lomba masak yang mencicipi setiap hidangan sesuai daftar, lalu mengumumkan mana yang lolos dan mana yang gagal.",
    example: "npx vitest run",
    lesson: "expert/testing-backend",
  },
  {
    slug: "ci-cd",
    term: "CI/CD",
    aliases: ["Continuous Integration", "Continuous Delivery", "pipeline"],
    category: "DevOps",
    definition:
      "CI (Continuous Integration) menjalankan lint, cek tipe, dan test secara otomatis setiap kali ada push atau pull request. CD (Continuous Delivery) mengirim hasil yang lolos ke server atau toko aplikasi secara otomatis. Dengan begitu, bug ketahuan lebih awal dan rilis bisa lebih sering.",
    analogy:
      "Seperti QC otomatis di pabrik: setiap produk dicek mesin sebelum dikemas, dan produk yang lolos langsung dikirim ke toko.",
    lesson: "expert/deploy-ci",
  },
  {
    slug: "github-actions",
    term: "GitHub Actions",
    aliases: ["workflow"],
    category: "DevOps",
    definition:
      "Layanan CI/CD bawaan GitHub. Langkah-langkahnya (workflow) ditulis di file YAML dalam folder .github/workflows, lalu berjalan otomatis saat ada kejadian seperti push atau pull request.",
    analogy:
      "Seperti jalur QC yang sudah disediakan pengelola pabrik (GitHub): kamu cukup menulis daftar langkahnya, dan mesin menjalankannya setiap ada barang baru masuk.",
    example: "on: [push, pull_request]",
    lesson: "expert/deploy-ci",
  },
  {
    slug: "deploy",
    term: "Deploy",
    aliases: ["deployment", "production"],
    category: "DevOps",
    definition:
      "Proses memasang aplikasi ke server atau platform supaya bisa dipakai pengguna sungguhan (production). Untuk API, ini termasuk menyiapkan database production, mengisi environment variable, dan menjalankan migrasi.",
    analogy:
      "Seperti memindahkan warung dari dapur rumah ke ruko: peralatan dipasang, stok bahan disiapkan, lalu pintunya dibuka untuk pembeli.",
    example: "npx prisma migrate deploy",
    lesson: "expert/deploy-ci",
  },
  {
    slug: "eas",
    term: "EAS",
    aliases: ["Expo Application Services", "EAS Build", "EAS Submit", "eas.json"],
    category: "DevOps",
    definition:
      "Layanan cloud dari Expo untuk tiga hal: membuat file aplikasi Android dan iOS (EAS Build), mengirimnya ke Play Store dan App Store (EAS Submit), dan mengirim update (EAS Update). Pengaturannya ditulis di file eas.json.",
    analogy:
      "Seperti jasa percetakan sekaligus ekspedisi: kamu mengirim naskah, mereka mencetak bukunya lalu mengantarkannya ke toko buku.",
    example: "eas build --platform android --profile production",
    lesson: "expert/deploy-ci",
  },
  {
    slug: "ota-update",
    term: "OTA Update",
    aliases: ["Over-the-Air update", "EAS Update"],
    category: "DevOps",
    definition:
      "Cara mengirim perubahan kode JavaScript dan aset (gambar, font) langsung ke aplikasi yang sudah terpasang di HP pengguna, tanpa menunggu review toko aplikasi. Kalau yang berubah adalah kode native, kamu tetap harus membuat build baru.",
    analogy:
      "Seperti menempel lembar ralat di buku yang sudah terjual: isinya bisa diperbaiki tanpa mencetak ulang. Tapi kalau sampul atau jilidnya (kode native) yang salah, bukunya harus dicetak ulang.",
    example: "eas update --channel production --message \"Perbaiki typo\"",
    lesson: "expert/deploy-ci",
  },
];
