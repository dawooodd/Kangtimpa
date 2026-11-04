export interface MemeDatasetItem {
  id: string;
  title: string;
  category: string;
  source: string;
  label: 'ASLI' | 'TIMPAAN';
  tamperConfidence: number; // ground truth
  jokeDescription: string;
  aspectRatio: string;
  drawBase: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}

export const MEME_DATASET: MemeDatasetItem[] = [
  {
    id: 'ds-1',
    title: 'Surat Panggilan RT 05 (Hasil Timpa)',
    category: 'Dokumen Warga',
    source: 'Grup WhatsApp Bapak-Bapak RT',
    label: 'TIMPAAN',
    tamperConfidence: 0.98,
    jokeDescription: 'Jelas editan! Teks aslinya denda ronda malam, ditimpa jadi traktiran seblak se-kelurahan.',
    aspectRatio: '4:3',
    drawBase: (ctx, width, height) => {
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(0, 0, width, height);
      // document lines
      ctx.fillStyle = '#78350f';
      ctx.font = 'bold 32px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PEMBERITAHUAN WARGA RT 05', width / 2, 80);
      
      // fake text lines
      ctx.fillStyle = '#a16207';
      ctx.fillRect(60, 130, width - 120, 8);
      ctx.fillRect(60, 160, width - 120, 8);
      ctx.fillRect(60, 190, width - 180, 8);

      // OBVIOUS TIMPA PATCH
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(80, 240, width - 160, 140);
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 3;
      ctx.strokeRect(80, 240, width - 160, 140);

      ctx.fillStyle = '#dc2626';
      ctx.font = '900 36px Impact, sans-serif';
      ctx.fillText('SEMUA WARGA DIWAJIBKAN', width / 2, 290);
      ctx.fillText('MAKAN BASO GRATIS', width / 2, 345);

      // bottom stamp
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(width - 150, height - 120, 50, 0, Math.PI * 2);
      ctx.stroke();
    },
  },
  {
    id: 'ds-2',
    title: 'Piagam Warga Teladan (Original Halal)',
    category: 'Sertifikat',
    source: 'Arsip Kelurahan Sumber Makmur',
    label: 'ASLI',
    tamperConfidence: 0.05,
    jokeDescription: 'Belum terjamah tangan jahil Kang Timpa. Masih suci, polos, dan penuh aura kejujuran.',
    aspectRatio: '4:3',
    drawBase: (ctx, width, height) => {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 8;
      ctx.strokeRect(30, 30, width - 60, height - 60);

      ctx.fillStyle = '#0369a1';
      ctx.font = 'bold 36px serif';
      ctx.textAlign = 'center';
      ctx.fillText('PIAGAM WARGA TELADAN', width / 2, 100);

      ctx.fillStyle = '#334155';
      ctx.font = '20px sans-serif';
      ctx.fillText('Diberikan kepada warga yang tidak pernah menimpa postingan orang.', width / 2, 160);

      ctx.fillStyle = '#64748b';
      for (let y = 220; y < height - 140; y += 30) {
        ctx.fillRect(100, y, width - 200, 4);
      }

      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(width / 2, height - 90, 35, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  {
    id: 'ds-3',
    title: 'Headline Berita Gosip Artis (Hasil Timpa)',
    category: 'Media Gosip',
    source: 'Portal Berita Heboh 24 Jam',
    label: 'TIMPAAN',
    tamperConfidence: 0.94,
    jokeDescription: 'Dicurigai 94% hasil timpaan: judul asli tentang harga telur, ditimpa jadi rumor alien pacaran.',
    aspectRatio: '16:9',
    drawBase: (ctx, width, height) => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      // Studio background circles
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(width * 0.7, height * 0.4, 200, 0, Math.PI * 2);
      ctx.fill();

      // Lower third
      ctx.fillStyle = '#18181b';
      ctx.fillRect(0, height - 160, width, 160);

      // Timpa Box on top of banner
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(40, height - 130, width - 80, 80);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 36px Impact, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('KANG TIMPA DITANGKAP KARENA TERLALU LUCU', width / 2, height - 80);
    },
  },
  {
    id: 'ds-4',
    title: 'Papan Tulis Pengumuman Posyandu (Original)',
    category: 'Fasilitas Umum',
    source: 'Dokumentasi Pos Ronda',
    label: 'ASLI',
    tamperConfidence: 0.08,
    jokeDescription: 'Tingkat kepalsuan nol. Ditulis pakai kapur asli, belum ada layer Photoshop yang menodai.',
    aspectRatio: '16:9',
    drawBase: (ctx, width, height) => {
      ctx.fillStyle = '#1e293b'; // blackboard
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = '#78350f'; // wooden frame
      ctx.lineWidth = 20;
      ctx.strokeRect(10, 10, width - 20, height - 20);

      ctx.fillStyle = '#f1f5f9';
      ctx.font = 'bold 36px "Comic Neue", cursive';
      ctx.textAlign = 'center';
      ctx.fillText('JADWAL TIMBANG BADAN POSYANDU', width / 2, 80);

      ctx.font = '24px "Comic Neue", cursive';
      ctx.fillText('Hari: Sabtu Pon • Jam 08.00 WIB', width / 2, 140);
      ctx.fillText('Harap bawa buku KIA masing-masing.', width / 2, 190);
      ctx.fillText('Balita dapat bubur kacang ijo gratis.', width / 2, 240);
    },
  },
  {
    id: 'ds-5',
    title: 'Chat Rahasia Bos & Karyawan (Hasil Timpa)',
    category: 'Screenshot Chat',
    source: 'Bocoran Menfess Twitter/X',
    label: 'TIMPAAN',
    tamperConfidence: 0.99,
    jokeDescription: 'Model mendeteksi anomali piksel solid hijau gelap menutupi chat gajian yang sebenarnya.',
    aspectRatio: '9:16',
    drawBase: (ctx, width, height) => {
      ctx.fillStyle = '#0b141a';
      ctx.fillRect(0, 0, width, height);

      // Chat bubble 1
      ctx.fillStyle = '#202c33';
      ctx.beginPath();
      ctx.roundRect(40, 100, width - 120, 100, 14);
      ctx.fill();
      ctx.fillStyle = '#e9edef';
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Pak, bonus akhir tahun cair kapan?', 70, 155);

      // Timpa bubble 2 (Suspicious mismatched patch)
      ctx.fillStyle = '#005c4b';
      ctx.beginPath();
      ctx.roundRect(80, 260, width - 120, 120, 14);
      ctx.fill();

      // Masked white patch inside
      ctx.fillStyle = '#022c22';
      ctx.fillRect(95, 275, width - 150, 90);

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 26px Impact, sans-serif';
      ctx.fillText('BONUS DICAIRKAN DALAM BENTUK', 110, 315);
      ctx.fillText('DOA & MOTIVASI PAGI', 110, 350);
    },
  },
  {
    id: 'ds-6',
    title: 'Spanduk Warung Soto Lamongan Asli',
    category: 'Kuliner',
    source: 'Foto Langsung Jalan Magelang',
    label: 'ASLI',
    tamperConfidence: 0.04,
    jokeDescription: '100% Halal dan asli tanpa rekayasa komputer. Paling cuma bumbunya yang direkayasa sedap.',
    aspectRatio: '16:9',
    drawBase: (ctx, width, height) => {
      ctx.fillStyle = '#fffbeb';
      ctx.fillRect(0, 0, width, height);

      // Red and yellow stripes
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(0, 0, width, 25);
      ctx.fillRect(0, height - 25, width, 25);

      ctx.fillStyle = '#b91c1c';
      ctx.font = '900 48px Impact, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SOTO AYAM KAMPUNG ASLI LAMONGAN', width / 2, 90);

      ctx.fillStyle = '#15803d';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText('Koya Gurih Melimpah • Es Teh Manis Jumbo', width / 2, 150);
      ctx.font = '22px sans-serif';
      ctx.fillText('Buka Pukul 06.00 Sampai Habis', width / 2, 200);
    },
  },
];

export interface ScrapeLogEntry {
  timestamp: string;
  source: string;
  status: 'EXTRACTING' | 'TRANSFORMING' | 'VALIDATED' | 'MEME_DETECTED';
  message: string;
}

export const GENERATE_MOCK_SCRAPE_LOGS = (): ScrapeLogEntry[] => [
  {
    timestamp: '18:42:01',
    source: 'r/indonesia_memes (Safe Filter)',
    status: 'EXTRACTING',
    message: 'Mengambil 24 gambar dengan upvote > 500, menyaring konten aman...',
  },
  {
    timestamp: '18:42:03',
    source: 'Grup FB: Komunitas Timpa Teks Nusantara',
    status: 'TRANSFORMING',
    message: 'Mendeteksi 18 gambar berpola kotak penutup font Impact, mengompresi ke 256x256 tensor...',
  },
  {
    timestamp: '18:42:05',
    source: 'Pipeline ETL Kang Timpa v2.4',
    status: 'MEME_DETECTED',
    message: 'Ditemukan 1 meme viral diduga kuat hasil editan Photoshop tingkat pemula.',
  },
  {
    timestamp: '18:42:08',
    source: 'Data Lake: /lake/memes/safe_store.parquet',
    status: 'VALIDATED',
    message: 'Batch scraping selesai: 42 sampel berhasil masuk feature store. Status: 100% Halal!',
  },
];
