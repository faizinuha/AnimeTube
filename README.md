# Neon Verse TV

AnimeTube adalah sebuah proyek web fan-made untuk menonton video anime tanpa login, menggunakan YouTube Data API v3 sebagai sumber konten.

## 🧭 Tujuan Proyek

Proyek ini dibuat untuk memberikan pengalaman eksplorasi video anime yang bebas, modern, dan aman. Konten ditampilkan sebagai agregator; kami tidak meng-host video dan tidak memiliki kontrol terhadap apa yang diunggah oleh pengguna di platform ketiga.

## ✅ Fitur Utama

- Tampilan home seperti platform video modern dengan rekomendasi dan trending
- Sistem search yang menggunakan `safeSearch: strict` untuk menjaga hasil lebih bersih
- Filter family-friendly yang menyingkirkan konten dewasa, kekerasan ekstrem, atau lain yang tidak cocok untuk umum
- Kategori anime yang lengkap: genre, demografi, dan tema khusus
- Seksi musik populer di beranda untuk menonjolkan video musik anime
- Seksi Shorts di beranda, ditampilkan mirip dengan pengalaman YouTube
- Disclaimer legal dan moral yang jelas di About dan Footer

## 📁 Kategori yang Sudah Disiapkan

### Genre Standar
- Action
- Adventure
- Comedy
- Drama
- Fantasy
- Sci-Fi
- Mystery
- Romance

### Demografi Profesional
- Shonen
- Shojo
- Seinen
- Josei

### Tema Khusus
- Isekai
- Slice of Life
- Sports
- Supernatural
- Mecha
- Music

## 🛡️ Komitmen Keamanan dan Tanggung Jawab

AnimeTube adalah media agregasi. Kami mengutamakan:

- `safeSearch: strict` pada semua pencarian YouTube
- filter konten yang berbahaya atau tidak pantas
- disclaimer yang jelas bahwa user bertanggung jawab atas apa yang mereka cari
- transparansi bahwa proyek ini tidak mendukung atau bertanggung jawab atas konten pihak ketiga

> Dengan menggunakan aplikasi ini, pengguna dianggap telah memahami bahwa konten yang mereka akses adalah tanggung jawab pribadi mereka.

## 🚀 Cara Menjalankan di Lokal

1. Install dependency:
   ```bash
   npm install --legacy-peer-deps
   ```
2. Jalankan development server:
   ```bash
   npm run dev
   ```
3. Pastikan file `.env` memiliki API key:
   ```env
   YOUTUBE_API_KEY=YOUR_KEY_HERE
   ```

## 🧩 Struktur Penting

- `src/routes/index.tsx` — beranda utama
- `src/routes/shorts.tsx` — halaman Shorts
- `src/lib/youtube.functions.ts` — request YouTube API + filter konten
- `src/lib/content-filter.ts` — aturan family-friendly
- `src/lib/constants.ts` — daftar kategori
- `src/components/Footer.tsx` — disclaimer footer
- `src/routes/about.tsx` — halaman About dengan teks legal

## ⚠️ Disclaimer

Website ini hanya menampilkan konten pihak ketiga melalui YouTube API. Kami tidak mendukung atau bertanggung jawab atas konten yang diunggah oleh pengguna di platform asli. Proyek ini hadir sebagai alat eksplorasi dan eksperimen.

## 📌 Catatan Kode

- Semua pencarian kategori otomatis menambahkan kata kunci `anime`
- Konten short dan long diperlakukan secara konsisten di beranda
- Bagian `Popular Music` di beranda sekarang menjadi prioritas

## Kontak

Proyek ini bersifat non-komersial dan tidak afiliasi dengan YouTube atau studio anime mana pun.

---

_Dibuat dengan tanggung jawab oleh tim Neon Verse TV._
# AnimeTube
