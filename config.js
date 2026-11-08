/**
 * ============================================================================
 * KONFIGURASI WEB ULANG TAHUN (EDIT FILE INI SESUAI KEBUTUHANMU)
 * ============================================================================
 * Semua teks, nama momen, urutan foto, video, dan surat diatur dari file ini.
 */

window.HBD_CONFIG = {
  // --------------------------------------------------------------------------
  // 1. PENGATURAN COUNTDOWN (SCENE 1)
  // --------------------------------------------------------------------------
  // Target waktu ulang tahun: 9 November 2026 pukul 00:00:00 WIB (+07:00)
  targetDate: "2026-11-09T00:00:00+07:00",

  // MODE TESTING / PREVIEW:
  // - `true`  = Hitung mundur 5 detik (buat kamu ngetes sekarang).
  // - `false` = Mengikuti jam asli 9 November 2026 jam 00:00:00 WIB.
  previewMode: true,
  previewSeconds: 5,

  // --------------------------------------------------------------------------
  // 2. MUSIK LATAR / BGM (GLOBAL)
  // --------------------------------------------------------------------------
  music: {
    src: "assets/music/until-i-found-you.mp3",
    title: "Stephen Sanchez - Until I Found You",
    volume: 0.65
  },

  // --------------------------------------------------------------------------
  // 3. SCENE 1: TEKS COUNTDOWN
  // --------------------------------------------------------------------------
  scene1: {
    eyebrow: "MENGHITUNG HARI",
    titleItalic: "Her Special Day",
    titleRegular: "is Coming",
    subtitle: "Sesuatu yang indah sedang menunggu untukmu",
    waitingStatus: "Beberapa detik lagi...",
    waitingButton: "TUNGGU SAMPAI WAKTUNYA",
    waitingHint: "Sabar ya, belum waktunya...",
    readyStatus: "Hari ini adalah hari spesialmu!",
    readyButton: "OPEN HER GIFT"
  },

  // --------------------------------------------------------------------------
  // 4. SCENE 2: KOTAK KADO
  // --------------------------------------------------------------------------
  scene2: {
    eyebrow: "ADA SESUATU UNTUKMU",
    instruction: "Klik untuk membuka hadiahmu"
  },

  // --------------------------------------------------------------------------
  // 5. SCENE 3: HERO & 6 POLAROID MELAYANG
  // --------------------------------------------------------------------------
  scene3: {
    eyebrow: "A LOVE LETTER FOR YOU",
    titleLine1: "Your",
    titleLine2: "Special Day",
    subtitle: "Created with love, just for you",
    buttonText: "READ MY LETTER",
    floatingPolaroids: [
      { src: "assets/moments/momen-01/foto-01.jpeg", caption: "Momen 1" },
      { src: "assets/moments/momen-02/foto-01.jpeg", caption: "Momen 2" },
      { src: "assets/moments/momen-03/foto-01.jpeg", caption: "Momen 3" },
      { src: "assets/moments/momen-05/foto-01.jpeg", caption: "Momen 5" },
      { src: "assets/moments/momen-11/foto-01.jpeg", caption: "Momen 11" },
      { src: "assets/moments/momen-12/foto-01.jpeg", caption: "Momen 12" }
    ]
  },

  // --------------------------------------------------------------------------
  // 6. SCENE 4: SURAT ULANG TAHUN (EFEK KETIK OTOMATIS)
  // --------------------------------------------------------------------------
  scene4: {
    title: "Happy Birthday",
    greeting: "HAPPY BIRTHDAY SAYANGGGKUUU CINTAKUUU",
    paragraphs: [
      "Selamat ulang tahun yaaa sayangggkuuuu, cintakuuu, cantikkuuuu. Akhirnya hari yang kamu tunggu-tunggu datang juga. Hari ini hari spesial kamu, hari di mana seseorang yang begitu berarti buat aku bertambah usia.",
      "Aku mau bilang terima kasih karena selama ini kamu udah hadir di hidup aku. Terima kasih udah jadi bagian dari banyak cerita aku, dari hal-hal kecil yang sederhana sampai momen-momen yang bakal selalu aku inget. Aku bersyukur bisa kenal kamu dan punya kesempatan buat jalan bareng kamu sampai sejauh ini.",
      "Di umur kamu yang sekarang, aku berdoa semoga kamu selalu diberikan kesehatan, kebahagiaan, umur yang berkah, dan segala hal baik yang kamu impikan bisa satu per satu terwujud. Semoga urusan kamu selalu dimudahkan, langkah kamu selalu dilancarkan, dan kamu selalu punya alasan buat tersenyum.",
      "Kalau nanti ada hari yang berat, aku harap kamu nggak lupa kalau kamu itu berharga. Kamu nggak harus selalu kuat, nggak harus selalu sempurna, dan nggak harus selalu menyimpan semuanya sendiri. Aku juga masih belajar buat jadi seseorang yang lebih baik buat kamu, sama-sama belajar yaa sayanggg.",
      "Aku nggak tahu ke depannya bakal ada cerita seperti apa, tapi aku berharap kita bisa terus tumbuh, saling memahami, saling mendukung, dan menikmati banyak hal baik bersama. Aku pengen lihat kamu meraih banyak hal yang selama ini kamu perjuangkan.",
      "Sekali lagi happy birthday yaaa cintakuuu, sayangggkuuuu, cantikkk. Semoga tahun ini jadi salah satu tahun terbaik dalam hidup kamu. Jangan lupa bahagia, jangan lupa jaga diri, dan jangan pernah berhenti jadi diri kamu sendiri. I love youuuu."
    ],
    typeSpeedMs: 26,
    buttonText: "OUR MEMORIES"
  },

  // --------------------------------------------------------------------------
  // 7. SCENE 5: GALERI 13 FOLDER MOMEN ("OUR MEMORIES")
  // --------------------------------------------------------------------------
  // Kamu tinggal ubah `title` ("Momen 01", dst) dengan nama momen yang kamu mau!
  // Saat kartu polaroid diklik, semua foto di dalam folder momen tersebut akan terbuka.
  scene5: {
    title: "Our Memories",
    subtitle: "every moment captured in love (klik kartu untuk buka album)",
    buttonText: "WATCH VIDEOS",
    moments: [
      {
        id: "momen-01",
        title: "Momen 01", // <-- Ganti nama momen ini sesukamu
        folder: "assets/moments/momen-01",
        cover: "assets/moments/momen-01/foto-01.jpeg",
        photos: [
          "assets/moments/momen-01/foto-01.jpeg",
          "assets/moments/momen-01/foto-02.jpeg",
          "assets/moments/momen-01/foto-03.jpeg",
          "assets/moments/momen-01/foto-04.jpeg",
          "assets/moments/momen-01/foto-05.jpeg",
          "assets/moments/momen-01/foto-06.jpeg"
        ]
      },
      {
        id: "momen-02",
        title: "Momen 02", // <-- Ganti nama momen ini sesukamu
        folder: "assets/moments/momen-02",
        cover: "assets/moments/momen-02/foto-01.jpeg",
        photos: [
          "assets/moments/momen-02/foto-01.jpeg",
          "assets/moments/momen-02/foto-02.jpeg",
          "assets/moments/momen-02/foto-03.jpeg"
        ]
      },
      {
        id: "momen-03",
        title: "Momen 03", // <-- Ganti nama momen ini sesukamu
        folder: "assets/moments/momen-03",
        cover: "assets/moments/momen-03/foto-01.jpeg",
        photos: [
          "assets/moments/momen-03/foto-01.jpeg",
          "assets/moments/momen-03/foto-02.jpeg",
          "assets/moments/momen-03/foto-03.jpeg",
          "assets/moments/momen-03/foto-04.jpeg",
          "assets/moments/momen-03/foto-05.jpeg",
          "assets/moments/momen-03/foto-06.jpeg"
        ]
      },
      {
        id: "momen-04",
        title: "Momen 04", // <-- Ganti nama momen ini sesukamu
        folder: "assets/moments/momen-04",
        cover: "assets/moments/momen-04/foto-01.jpeg",
        photos: [
          "assets/moments/momen-04/foto-01.jpeg"
        ]
      },
      {
        id: "momen-05",
        title: "Momen 05", // <-- Ganti nama momen ini sesukamu
        folder: "assets/moments/momen-05",
        cover: "assets/moments/momen-05/foto-01.jpeg",
        photos: [
          "assets/moments/momen-05/foto-01.jpeg",
          "assets/moments/momen-05/foto-02.jpeg",
          "assets/moments/momen-05/foto-03.jpeg",
          "assets/moments/momen-05/foto-04.jpeg"
        ]
      },
      {
        id: "momen-06",
        title: "Momen 06", // <-- Ganti nama momen ini sesukamu
        folder: "assets/moments/momen-06",
        cover: "assets/moments/momen-06/foto-01.jpeg",
        photos: [
          "assets/moments/momen-06/foto-01.jpeg",
          "assets/moments/momen-06/foto-02.jpeg"
        ]
      },
      {
        id: "momen-07",
        title: "Momen 07", // <-- Ganti nama momen ini sesukamu
        folder: "assets/moments/momen-07",
        cover: "assets/moments/momen-07/foto-01.jpeg",
        photos: [
          "assets/moments/momen-07/foto-01.jpeg",
          "assets/moments/momen-07/foto-02.jpeg"
        ]
      },
      {
        id: "momen-08",
        title: "Momen 08", // <-- Ganti nama momen ini sesukamu
        folder: "assets/moments/momen-08",
        cover: "assets/moments/momen-08/foto-01.jpeg",
        photos: [
          "assets/moments/momen-08/foto-01.jpeg",
          "assets/moments/momen-08/foto-02.jpeg",
          "assets/moments/momen-08/foto-03.jpeg"
        ]
      },
      {
        id: "momen-09",
        title: "Momen 09", // <-- Ganti nama momen ini sesukamu
        folder: "assets/moments/momen-09",
        cover: "assets/moments/momen-09/foto-01.jpeg",
        photos: [
          "assets/moments/momen-09/foto-01.jpeg"
        ]
      },
      {
        id: "momen-10",
        title: "Momen 10", // <-- Ganti nama momen ini sesukamu
        folder: "assets/moments/momen-10",
        cover: "assets/moments/momen-10/foto-01.jpeg",
        photos: [
          "assets/moments/momen-10/foto-01.jpeg",
          "assets/moments/momen-10/foto-02.jpeg"
        ]
      },
      {
        id: "momen-11",
        title: "Momen 11", // <-- Ganti nama momen ini sesukamu
        folder: "assets/moments/momen-11",
        cover: "assets/moments/momen-11/foto-01.jpeg",
        photos: [
          "assets/moments/momen-11/foto-01.jpeg",
          "assets/moments/momen-11/foto-02.jpeg",
          "assets/moments/momen-11/foto-03.jpeg",
          "assets/moments/momen-11/foto-04.jpeg",
          "assets/moments/momen-11/foto-05.jpeg",
          "assets/moments/momen-11/foto-06.jpeg"
        ]
      },
      {
        id: "momen-12",
        title: "Momen 12", // <-- Ganti nama momen ini sesukamu
        folder: "assets/moments/momen-12",
        cover: "assets/moments/momen-12/foto-01.jpeg",
        photos: [
          "assets/moments/momen-12/foto-01.jpeg",
          "assets/moments/momen-12/foto-02.jpeg",
          "assets/moments/momen-12/foto-03.jpeg",
          "assets/moments/momen-12/foto-04.jpeg",
          "assets/moments/momen-12/foto-05.jpeg",
          "assets/moments/momen-12/foto-06.jpeg",
          "assets/moments/momen-12/foto-07.jpeg",
          "assets/moments/momen-12/foto-08.jpeg",
          "assets/moments/momen-12/foto-09.jpeg",
          "assets/moments/momen-12/foto-10.jpeg",
          "assets/moments/momen-12/foto-11.jpeg",
          "assets/moments/momen-12/foto-12.jpeg"
        ]
      },
      {
        id: "momen-13",
        title: "Momen 13", // <-- Ganti nama momen ini sesukamu
        folder: "assets/moments/momen-13",
        cover: "assets/moments/momen-13/foto-01.jpeg",
        photos: [
          "assets/moments/momen-13/foto-01.jpeg",
          "assets/moments/momen-13/foto-02.jpeg",
          "assets/moments/momen-13/foto-03.jpeg",
          "assets/moments/momen-13/foto-04.jpeg",
          "assets/moments/momen-13/foto-05.jpeg",
          "assets/moments/momen-13/foto-06.jpeg",
          "assets/moments/momen-13/foto-07.jpeg",
          "assets/moments/momen-13/foto-08.jpeg",
          "assets/moments/momen-13/foto-09.jpeg",
          "assets/moments/momen-13/foto-10.jpeg",
          "assets/moments/momen-13/foto-11.jpeg"
        ]
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 8. SCENE 6: BAGIAN KHUSUS VIDEO ("A MOMENT FOR YOU")
  // --------------------------------------------------------------------------
  // Ke-4 video hasil ekstrak dari zip sudah dipisah ke sini.
  // Kamu bisa ganti `title` masing-masing video di bawah ini.
  scene6: {
    title: "A Moment For You",
    subtitle: "special video memories",
    orientation: "portrait",
    buttonText: "BIRTHDAY WISHES",
    videos: [
      {
        title: "Video Momen 1", // <-- Ganti judul tab video 1
        src: "assets/video/video-01-momen-01.mp4"
      },
      {
        title: "Video Momen 2", // <-- Ganti judul tab video 2
        src: "assets/video/video-02-momen-04.mp4"
      },
      {
        title: "Video Momen 3", // <-- Ganti judul tab video 3
        src: "assets/video/video-03-momen-13.mp4"
      },
      {
        title: "Video Momen 4", // <-- Ganti judul tab video 4
        src: "assets/video/video-04-momen-13.mp4"
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 9. SCENE 7: BIRTHDAY WISHES CARD
  // --------------------------------------------------------------------------
  scene7: {
    title: "Birthday Wishes",
    subtitle: "For My Favorite Girl",
    message:
      "Ya Allah, tolong jaga perempuan yang aku sayangi ini. Berikan dia kesehatan, umur yang berkah, hati yang tenang, dan kebahagiaan yang nggak ada habisnya. Mudahkan setiap urusannya, lancarkan pendidikannya, kabulkan doa-doa baiknya, dan dekatkan dia dengan segala hal yang membawa kebaikan. Ketika dia lelah, berikan dia kekuatan. Ketika dia bingung, berikan dia petunjuk. Dan ketika dia merasa sendirian, ingatkan dia bahwa dia selalu berharga dan layak mendapatkan hal-hal baik. Semoga semua impian dan harapannya bisa tercapai satu per satu. Dan jika memang kami ditakdirkan untuk terus bersama, semoga hubungan ini selalu dijaga, diberikan kesabaran, kejujuran, dan kasih sayang. Aamiin.",
    buttonText: "ONE MORE THING"
  },

  // --------------------------------------------------------------------------
  // 10. SCENE 8: PENUTUP ("CLOSING")
  // --------------------------------------------------------------------------
  scene8: {
    rotatingTitles: [
      "Happy Birthday",
      "My Sayangggkuuuu",
      "Always With Love"
    ],
    line1: "Terima kasih yaaa udah hadir di hidup aku, cantikkk.",
    line2: "Semoga masih banyak ulang tahun, cerita, dan kebahagiaan yang bisa kita rayakan bersama.",
    signoff: "I love youuuu, cintakuuu.",
    replayButtonText: "REPLAY FROM START"
  }
};
