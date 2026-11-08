# Panduan Pengisian Konten Web Ulang Tahun (`hbd-web`)

Semua teks, foto polaroid, video, tanggal ulang tahun, dan musik latar diatur cukup dari satu file: **[`config.js`](file:///home/iben/hbd-web/config.js)**.

---

## 1. Struktur Folder Aset
Taruh file foto, video, dan lagu MP3 kamu di dalam folder berikut:
```text
/home/iben/hbd-web/
├── index.html          (Struktur 8 Scene)
├── style.css           (Desain & Responsif Mobile/Desktop)
├── config.js           (FILE YANG KAMU EDIT UNTUK ISI SURAT/FOTO/VIDEO)
├── app.js              (Mesin interaktif, typewriter, player, partikel)
└── assets/
    ├── photos/         (Taruh foto-foto polaroid di sini)
    ├── video/          (Taruh file video MP4 portrait di sini)
    └── music/          (Taruh file lagu MP3 latar di sini)
```

---

## 2. Cara Mengatur Mode Testing vs Mode Tanggal 9 November
Buka [`config.js`](file:///home/iben/hbd-web/config.js) di bagian paling atas:
- Saat ini `previewMode: true` (Countdown hanya 5 detik supaya kamu bisa langsung mengetes semua halaman).
- Kalau semua foto, surat, dan video sudah siap untuk dikirim ke cewekmu, ubah menjadi:
  ```js
  targetDate: "2026-11-09T00:00:00+07:00",
  previewMode: false,
  ```

---

## 3. Cara Mengganti Foto, Video, dan Lagu
1. **Foto Polaroid Melayang (Scene 3):**
   - Simpan 6 foto dengan nama `hero-1.jpg` sampai `hero-6.jpg` di folder `assets/photos/` (atau ubah nama filenya di `scene3.floatingPolaroids` pada `config.js`).
2. **Foto Galeri Kenangan (Scene 5):**
   - Simpan 11 foto (bisa ditambah atau dikurangi bebas) dengan nama `mem-1.jpg` sampai `mem-11.jpg` di folder `assets/photos/`.
3. **Video Portrait (Scene 6):**
   - Simpan video rekamanmu dengan nama `moment.mp4` di dalam folder `assets/video/`.
   - Saat video diputar di Scene 6, musik latar akan **otomatis berhenti sementara (auto-pause)** dan lanjut berputar lagi saat video selesai atau pindah ke halaman berikutnya.
4. **Musik Latar (BGM):**
   - Simpan lagu MP3 (misal *Shane Filan - Beautiful In White*) dengan nama `bgm.mp3` di folder `assets/music/`.
   - *(Jika `bgm.mp3` belum dimasukkan, web otomatis menggunakan nada musik lembut bawaan supaya tetap ada suaranya saat dites).*
