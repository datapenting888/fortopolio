# Portfolio Dashboard — Struktur Folder

```
portfolio-dashboard/
│
├── index.html              ← Halaman utama (landing page)
├── welcome.js              ← Script sambutan & interaksi umum
│
├── assets/
│   ├── css/
│   │   ├── style.css       ← Gaya utama (variabel, reset, layout)
│   │   ├── navbar.css      ← Gaya navigasi
│   │   ├── gallery.css     ← Gaya galeri & kartu
│   │   └── dashboard.css   ← Gaya khusus dashboard
│   │
│   ├── js/
│   │   ├── welcome.js      ← Tombol & modal sambutan
│   │   ├── gallery.js      ← Filter & animasi galeri
│   │   └── chart.js        ← Grafik & visualisasi data
│   │
│   ├── images/
│   │   ├── hero/           ← Gambar utama hero section
│   │   ├── projects/       ← Thumbnail proyek portofolio
│   │   └── icons/          ← Ikon & logo
│   │
│   └── fonts/              ← Font lokal (jika tidak pakai CDN)
│
├── pages/
│   ├── about.html          ← Halaman tentang saya
│   ├── projects.html       ← Daftar lengkap proyek
│   ├── contact.html        ← Formulir kontak
│   └── dashboard.html      ← Halaman admin/dashboard analitik
│
├── components/
│   ├── navbar.html         ← Komponen navigasi (reusable)
│   ├── footer.html         ← Komponen footer
│   ├── card.html           ← Template kartu proyek
│   └── modal.html          ← Template modal/popup
│
└── data/
    ├── projects.json       ← Data proyek dalam format JSON
    └── stats.json          ← Data statistik untuk dashboard
```

## Cara Menggunakan

1. Buka `index.html` di browser untuk melihat landing page
2. Klik tombol **Mulai** atau **Mulai Sekarang** → akan muncul pesan Selamat Datang
3. Semua logika interaksi ada di `welcome.js`
4. Gaya visual ada di `assets/css/style.css`

## File Utama

| File | Fungsi |
|------|--------|
| `index.html` | Struktur halaman & konten |
| `welcome.js` | Fungsi `tampilkanSambutan()` & `tutupModal()` |
| `assets/css/style.css` | Semua styling CSS |
