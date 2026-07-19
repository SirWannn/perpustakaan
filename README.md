# Perpustakaan Digital — SDN Cijambe 1

Aplikasi manajemen perpustakaan digital dibuat dengan **Next.js 14 (App Router)** dan **Tailwind CSS**, sesuai dengan desain pada mockup: halaman Login, Dashboard, Kelola Buku, dan Kelola Peminjaman.

## Fitur

- **Login** — form username/password dengan toggle show/hide password, checkbox "Ingat Saya", dan redirect ke Dashboard.
- **Dashboard** — kartu statistik (Total Buku, Total Peminjam, Buku Dipinjam), grafik tren peminjaman, dan daftar peminjaman terbaru.
- **Kelola Buku** — tabel koleksi buku dengan pencarian, filter kategori, tambah buku baru (modal), edit/hapus, dan pagination.
- **Kelola Peminjaman** — form catat peminjaman baru (nama siswa + pilih buku dengan pencarian), tabel peminjaman aktif dengan status (Terlambat/Dipinjam/Selesai) dan aksi "Kembalikan".

> Data pada aplikasi ini masih berupa **data contoh (mock data)** yang disimpan di memori (React state) dan `lib/data.js`. Untuk penggunaan produksi, hubungkan ke database (mis. PostgreSQL + Prisma, atau Supabase) dan tambahkan autentikasi sungguhan di halaman login.

## Menjalankan proyek

Pastikan Node.js 18.18+ atau 20+ sudah terpasang, lalu jalankan:

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) — Anda akan diarahkan otomatis ke halaman `/login`.

## Struktur folder

```
app/
  layout.js               # Root layout + import Tailwind
  page.js                 # Redirect ke /login
  login/page.js           # Halaman login
  dashboard/page.js       # Halaman dashboard
  kelola-buku/page.js     # Halaman kelola buku
  kelola-peminjaman/page.js  # Halaman kelola peminjaman
components/
  Sidebar.js              # Navigasi sisi kiri (dipakai di 3 halaman utama)
  Header.js               # Header dengan search bar + ikon notifikasi
  StatCard.js             # Kartu statistik di dashboard
  icons.js                # Kumpulan ikon SVG (tanpa dependency eksternal)
lib/
  data.js                 # Data contoh: daftar buku & daftar peminjaman
```

## Langkah lanjutan yang disarankan

1. Ganti `lib/data.js` dengan pemanggilan API/database sungguhan.
2. Tambahkan autentikasi nyata (NextAuth.js, atau backend custom) di `app/login/page.js`.
3. Simpan status login (session/cookie) agar halaman dashboard, kelola buku, dan kelola peminjaman terlindungi dari akses tanpa login (middleware Next.js).
4. Hubungkan tabel "Kelola Buku" dan "Kelola Peminjaman" ke sumber data yang sama agar stok buku otomatis berkurang saat dipinjam dan bertambah saat dikembalikan.
