import type { QuizQuestion } from "@/lib/quiz";

const quiz: QuizQuestion[] = [
  {
    q: "Di React Native, nilai default `flexDirection` adalah apa?",
    options: [
      "`row` (berjajar ke samping)",
      "`column` (bertumpuk ke bawah)",
      "`row-reverse` (ke samping, urutan terbalik)",
      "Tidak ada nilai default",
    ],
    answer: 1,
    explain:
      "Di CSS web, default-nya `row` (berjajar ke samping). React Native memakai `column`, jadi elemen bertumpuk dari atas ke bawah. Ini cocok untuk layar HP yang tinggi dan sempit, seperti daftar chat WhatsApp yang tersusun ke bawah.",
  },
  {
    q: "Komponen mana yang paling tepat untuk menampilkan daftar yang sangat panjang tanpa membuat HP berat?",
    options: ["`ScrollView`", "`View` + `map()`", "`FlatList`", "`Text`"],
    answer: 2,
    explain:
      "`FlatList` hanya menggambar item yang sedang terlihat di layar (virtualisasi), jadi hemat memori. `ScrollView` atau `map()` menggambar semua item sekaligus, termasuk yang belum terlihat. Mirip pelayan restoran yang hanya melayani meja yang sedang terisi, bukan menyiapkan makanan untuk semua meja sekaligus.",
  },
  {
    q: "Apa yang tampil di layar dari kode ini?",
    code: `function TaskItem({ title, priority }) {
  return (
    <Text>
      {title} ({priority})
    </Text>
  );
}

<TaskItem title="Belajar RN" priority="tinggi" />`,
    options: [
      "`Belajar RN (tinggi)`",
      "`{title} ({priority})`",
      "`TaskItem`",
      "Error, karena props harus dikirim sebagai satu objek",
    ],
    answer: 0,
    explain:
      "Atribut JSX seperti `title=\"Belajar RN\"` dikumpulkan jadi satu objek props, lalu dibongkar (destructure) menjadi `title` dan `priority`. Tulisan di dalam `{ }` dihitung nilainya, jadi yang tampil adalah isinya. Mirip pesanan ke tukang jahit: kamu menyebut model dan warna (props), lalu bajunya jadi sesuai pesanan itu.",
  },
  {
    q: "Di aplikasi daftar belanja, kamu mencentang \"Beli telur\" dan tanda centangnya langsung muncul. Konsep React apa yang membuat layar ikut berubah?",
    options: ["State", "Props", "`StyleSheet`", "`import`"],
    answer: 0,
    explain:
      "State adalah data yang bisa berubah selama aplikasi dipakai. Saat state diganti lewat fungsi set-nya, React menggambar ulang layar dengan data baru. Props adalah data kiriman dari komponen induk, dan komponen penerima tidak mengubahnya sendiri. Mirip papan skor pertandingan: begitu angkanya diganti, semua penonton langsung melihat skor baru.",
  },
  {
    q: "Cara `toggle` mana yang **benar** untuk membalik status `done` sebuah task?",
    code: `const [tasks, setTasks] = useState([
  { id: 1, title: "Belajar RN", done: false, priority: "sedang" },
]);

function toggle(id) {
  // ...
}`,
    options: [
      "`const t = tasks.find((t) => t.id === id); t.done = !t.done; setTasks(tasks);`",
      "`tasks[0].done = !tasks[0].done;`",
      "`setTasks(tasks.filter((t) => t.id !== id));`",
      "`setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));`",
    ],
    answer: 3,
    explain:
      "State harus diganti dengan data **baru**, bukan diubah langsung. `map` dan spread membuat array dan objek baru, jadi React tahu ada perubahan lalu menggambar ulang layar. Kalau kamu mengubah objek lama lalu memanggil `setTasks` dengan array yang sama, React menganggap tidak ada yang berubah. `filter` malah menghapus task. Mirip mengumpulkan revisi tugas: kalau kamu menyerahkan kertas yang sama, dosen mengira belum ada revisi. Serahkan lembar baru supaya dicek ulang.",
  },
  {
    q: "Kapan efek ini dijalankan?",
    code: `useEffect(() => {
  fetchTasks().then(setTasks);
}, []);`,
    options: [
      "Sekali, setelah komponen pertama kali tampil di layar (mount)",
      "Setiap kali komponen digambar ulang (re-render)",
      "Sebelum komponen tampil untuk pertama kali",
      "Hanya ketika komponen dihapus dari layar",
    ],
    answer: 0,
    explain:
      "`useEffect` berjalan **setelah** komponen tampil. Array kosong `[]` artinya tidak ada nilai yang dipantau, jadi efek tidak diulang. Tanpa array, efek jalan setiap kali render. Kode yang jalan saat komponen dihapus ditaruh di fungsi cleanup. Mirip alarm yang hanya berbunyi sekali saat kamu pertama masuk kelas: \"ambil daftar tugas\".",
  },
  {
    q: "Di React Native, teks seperti `\"Halo\"` wajib dibungkus komponen apa?",
    options: ["`<View>`", "`<p>`", "`<Text>`", "`<span>`"],
    answer: 2,
    explain:
      "React Native tidak memakai HTML. Komponennya diubah menjadi tampilan asli Android/iOS, dan semua teks wajib ada di dalam `<Text>`. Tag `<p>` dan `<span>` tidak ada. Teks yang ditaruh langsung di dalam `<View>` akan memicu error. Mirip papan pengumuman: tulisan harus ditulis di kertas (`<Text>`) dulu, baru ditempel di papan (`<View>`).",
  },
  {
    q: "Kamu membuka layar Daftar Tugas, lalu Detail Tugas, lalu Edit Tugas. Kalau kamu menekan tombol **Back** sekali, kamu kembali ke layar mana?",
    options: ["Daftar Tugas", "Detail Tugas", "Edit Tugas", "Aplikasi langsung tertutup"],
    answer: 1,
    explain:
      "Navigasi stack bekerja seperti tumpukan piring. Setiap layar baru ditaruh di atas tumpukan. Tombol Back mengambil piring paling atas (Edit Tugas), jadi yang terlihat sekarang piring di bawahnya, yaitu Detail Tugas. Tekan Back sekali lagi, baru kamu kembali ke Daftar Tugas.",
  },
  {
    q: "Dengan Expo Router, file mana yang menangani alamat `/tasks/42`?",
    options: ["`app/tasks.tsx`", "`app/tasks/id.tsx`", "`app/(tasks)/42.tsx`", "`app/tasks/[id].tsx`"],
    answer: 3,
    explain:
      "Kurung siku `[id]` artinya bagian alamat itu bisa berganti-ganti (dynamic route). Di dalam layar, nilainya dibaca dengan `const { id } = useLocalSearchParams()`, dan hasilnya string `\"42\"`. Folder dalam kurung biasa seperti `(tasks)` hanya pengelompokan dan tidak muncul di alamat. Mirip satu template surat untuk semua kamar kos: `[id]` adalah titik-titik tempat nomor kamar ditulis.",
  },
  {
    q: "Di iOS, keyboard menutupi tombol **Simpan** di form tambah tugas. Solusi apa yang paling tepat?",
    options: [
      "Memberi tombol `position: \"absolute\"` dan `top: 0`",
      "Membungkus form dengan `KeyboardAvoidingView` dan `behavior=\"padding\"` di iOS",
      "Mengganti `TextInput` dengan `Text`",
      "Cukup menambahkan `returnKeyType=\"done\"`",
    ],
    answer: 1,
    explain:
      "`KeyboardAvoidingView` menggeser atau mengecilkan isi layar saat keyboard muncul, jadi tombol tetap terlihat. Di iOS biasanya pakai `behavior=\"padding\"`. `returnKeyType` hanya mengganti label tombol Enter di keyboard, tidak mengubah tata letak. Mirip penumpang angkot yang bergeser saat ada orang baru naik, supaya semua tetap kebagian tempat.",
  },
  {
    q: "Data mana yang **seharusnya** disimpan di `expo-secure-store`, bukan di `AsyncStorage`?",
    options: [
      "Token login pengguna",
      "Preferensi mode gelap",
      "Cache daftar tugas",
      "Filter prioritas terakhir yang dipilih",
    ],
    answer: 0,
    explain:
      "SecureStore menyimpan data dalam bentuk terenkripsi di Keychain (iOS) atau Keystore (Android). Cocok untuk data rahasia yang kecil seperti token login. `AsyncStorage` tidak terenkripsi, jadi pakai untuk data biasa seperti mode gelap atau cache. Bayangkan laci meja (AsyncStorage) dan brankas (SecureStore). Token login itu seperti kunci kamar kos, jadi taruh di brankas.",
  },
  {
    q: "Judul layar tertutup notch dan status bar di iPhone. Cara mana yang paling tepat?",
    options: [
      "Membungkus layar dengan `<ScrollView>`",
      "Menyembunyikan status bar dengan `<StatusBar hidden />`",
      "Menambahkan `marginTop: 20` secara hardcode",
      "Memakai `SafeAreaView` atau hook `useSafeAreaInsets()` dari `react-native-safe-area-context`",
    ],
    answer: 3,
    explain:
      "Ukuran notch, status bar, dan garis home berbeda di tiap HP. `react-native-safe-area-context` memberi jarak aman (inset) yang pas secara otomatis. Angka tetap seperti `marginTop: 20` akan meleset di HP lain. Mirip memasang casing HP: lubang kamera tiap model beda posisinya, jadi kamu tidak bisa memakai satu ukuran untuk semua HP.",
  },
];

export default quiz;