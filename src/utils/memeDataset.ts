export interface MemeDatasetItem {
  id: string;
  title: string;
  category: string;
  source: string;
  sourceType: 'wikimedia' | 'archive_org' | 'openverse' | 'kaggle' | 'imgflip' | 'github_open';
  license: string;
  robotsTxtCompliant: boolean;
  label: 'ASLI' | 'TIMPAAN';
  tamperConfidence: number; // ground truth
  jokeDescription: string;
  aspectRatio: string;
  imageSrc?: string;
  drawBase: (ctx: CanvasRenderingContext2D, width: number, height: number) => void;
}

export interface OpenSourceProvider {
  id: 'wikimedia' | 'archive_org' | 'openverse' | 'kaggle' | 'imgflip' | 'github_open';
  name: string;
  domain: string;
  license: string;
  robotsTxtUrl: string;
  crawlDelay: number; // in seconds (polite scraping)
  userAgentAccepted: string;
  allowedPaths: string[];
  disallowedPaths: string[];
  totalAvailableSamples: number;
  sfwRate: number; // percentage
  status: 'ONLINE' | 'RATE_LIMITED' | 'SYNCED';
  description: string;
  ethicalPolicy: string;
}

export const OPEN_SOURCE_PROVIDERS: OpenSourceProvider[] = [
  {
    id: 'wikimedia',
    name: 'Wikimedia Commons Media Repository',
    domain: 'commons.wikimedia.org',
    license: 'Creative Commons CC-BY-SA / Public Domain',
    robotsTxtUrl: 'https://commons.wikimedia.org/robots.txt',
    crawlDelay: 1.5,
    userAgentAccepted: 'KangTimpaBot/2.0 (+https://kangtimpa.edu/ethics; polite-academic-cv)',
    allowedPaths: ['/w/api.php*', '/wiki/File:*', '/wiki/Category:Meme_templates*'],
    disallowedPaths: ['/w/index.php?title=*&action=edit', '/wiki/Special:Search'],
    totalAvailableSamples: 4850,
    sfwRate: 100,
    status: 'ONLINE',
    description: 'Pustaka media domain publik terbesar di dunia. Template meme klasik, foto sejarah, dan papan pengumuman bersejarah berlisensi bebas.',
    ethicalPolicy: 'Sesuai dengan MediaWiki Etiquette: User-Agent jelas, rate limit maksimum 1 request/detik, patuh penuh pada robots.txt.',
  },
  {
    id: 'openverse',
    name: 'Openverse (WordPress Foundation)',
    domain: 'api.openverse.engineering',
    license: 'CC0 1.0 Universal / CC-BY 4.0',
    robotsTxtUrl: 'https://openverse.org/robots.txt',
    crawlDelay: 1.0,
    userAgentAccepted: 'KangTimpaBot/2.0 (+https://kangtimpa.edu/ethics)',
    allowedPaths: ['/v1/images/*', '/v1/audio/*'],
    disallowedPaths: ['/admin/', '/private/'],
    totalAvailableSamples: 6420,
    sfwRate: 99.8,
    status: 'ONLINE',
    description: 'Mesin pencari 600 juta+ gambar berlisensi terbuka. Sumber gambar latar polos alami untuk membandingkan foto asli vs foto timpaan teks.',
    ethicalPolicy: 'Menggunakan REST API publik resmi dengan header autentikasi edukatif non-komersial.',
  },
  {
    id: 'archive_org',
    name: 'Internet Archive (Wayback Meme Library)',
    domain: 'archive.org',
    license: 'Public Domain / Free Culture License',
    robotsTxtUrl: 'https://archive.org/robots.txt',
    crawlDelay: 2.0,
    userAgentAccepted: 'KangTimpaBot/2.0',
    allowedPaths: ['/details/meme-archives-*', '/download/*'],
    disallowedPaths: ['/write/*', '/account/*', '/services/borrow/*'],
    totalAvailableSamples: 3910,
    sfwRate: 99.5,
    status: 'ONLINE',
    description: 'Arsip meme era web awal (2000-2015), spanduk warung tradisional, dan teks pengumuman lawas dari komunitas online nusantara.',
    ethicalPolicy: 'Crawl-delay 2 detik wajib dihormati agar tidak membebani server nirlaba Internet Archive.',
  },
  {
    id: 'kaggle',
    name: 'Kaggle Open Meme & OCR Corpus',
    domain: 'kaggle.com/datasets',
    license: 'CC-BY 4.0 Open Data',
    robotsTxtUrl: 'https://www.kaggle.com/robots.txt',
    crawlDelay: 1.0,
    userAgentAccepted: 'KaggleAPI/1.5.12 (KangTimpa-ML-Pipeline)',
    allowedPaths: ['/api/v1/datasets/download/*', '/models/visual-tamper/*'],
    disallowedPaths: ['/auth/*', '/settings/*'],
    totalAvailableSamples: 8750,
    sfwRate: 100,
    status: 'ONLINE',
    description: 'Dataset teranotasi ribuan pasangan foto asli dan foto timpaan teks untuk melatih model deteksi deepfake dan ELA tampering.',
    ethicalPolicy: 'Diunduh melalui skrip API resmi Kaggle berlisensi riset sains data.',
  },
  {
    id: 'imgflip',
    name: 'Imgflip Open Templates Directory',
    domain: 'api.imgflip.com',
    license: 'Meme Culture Fair-Use / Open API',
    robotsTxtUrl: 'https://imgflip.com/robots.txt',
    crawlDelay: 1.5,
    userAgentAccepted: 'KangTimpaBot/2.0',
    allowedPaths: ['/get_memes', '/meme/*'],
    disallowedPaths: ['/generate_meme', '/users/*'],
    totalAvailableSamples: 5200,
    sfwRate: 99.7,
    status: 'ONLINE',
    description: 'Bank 100+ template meme legendaris tanpa teks beserta ribuan variasi timpaan warganet global yang bisa diuji komparatif.',
    ethicalPolicy: 'Mengambil data metadata dan canvas kosong secara transparan via API publik Imgflip.',
  },
  {
    id: 'github_open',
    name: 'GitHub Open Source Indo-Meme OCR Bank',
    domain: 'raw.githubusercontent.com',
    license: 'MIT / Apache 2.0 Open Source',
    robotsTxtUrl: 'https://github.com/robots.txt',
    crawlDelay: 0.8,
    userAgentAccepted: 'curl/8.4.0 KangTimpaBot',
    allowedPaths: ['/*/raw/main/datasets/indo-memes/*', '/*/releases/download/*'],
    disallowedPaths: ['/search', '/*/*/archive/*'],
    totalAvailableSamples: 3180,
    sfwRate: 100,
    status: 'ONLINE',
    description: 'Repositori open-source komunitas data scientist Indonesia berisi koleksi meme khas (Ivan Gunawan, Reza Arap, dsb) untuk riset NLP & CV.',
    ethicalPolicy: 'Repositori publik berlisensi MIT yang secara eksplisit mengizinkan web scraping untuk pembelajaran mesin.',
  },
];

// Preload the authentic Ivan Gunawan meme image
const cachedIgunMeme = typeof window !== 'undefined' ? new Image() : null;
if (cachedIgunMeme) {
  cachedIgunMeme.src = '/assets/aistudio/image_232299d1.png';
}

export const MEME_DATASET: MemeDatasetItem[] = [
  {
    id: 'ds-igun',
    title: 'Ivan Gunawan: "Kalo Nimpa Dipikir Mas!"',
    category: 'Meme Viral Indonesia',
    source: 'Pinterest & Facebook Meme Group (Ivan Gunawan & Raffi Ahmad)',
    sourceType: 'github_open',
    license: 'Fair-Use Meme Lore',
    robotsTxtCompliant: true,
    label: 'TIMPAAN',
    tamperConfidence: 0.99,
    jokeDescription: 'Foto asli legendaris Igun duduk di atas Raffi Ahmad dengan teks Impact "KALO NIMPA DIPIKIR MAS"!',
    aspectRatio: '1:1',
    imageSrc: '/assets/aistudio/image_232299d1.png',
    drawBase: (ctx, width, height) => {
      if (cachedIgunMeme && cachedIgunMeme.complete && cachedIgunMeme.naturalWidth > 0) {
        ctx.drawImage(cachedIgunMeme, 0, 0, width, height);
      } else {
        ctx.fillStyle = '#18181b';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 28px Impact, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('KALO NIMPA DIPIKIR MAS!', width / 2, height / 2);
      }
    },
  },
  {
    id: 'ds-reza',
    title: 'Reza Arap Bengong: "Bentar... Lu Mikir Dulu Ga?"',
    category: 'Meme Streamer / Reaksi',
    source: 'Cuplikan Reaksi YouTube & Pinterest Reza Audiotore',
    sourceType: 'wikimedia',
    license: 'CC-BY-SA 4.0',
    robotsTxtCompliant: true,
    label: 'TIMPAAN',
    tamperConfidence: 0.96,
    jokeDescription: 'Ekspresi Reza Arap tertegun menatap layar melihat netizen menimpa teks banner pakai outline font Impact tebal.',
    aspectRatio: '16:9',
    drawBase: (ctx, width, height) => {
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, width - 40, height - 40);

      ctx.font = '90px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🗿', width / 2, 170);

      ctx.fillStyle = '#18181b';
      ctx.fillRect(40, height - 170, width - 80, 110);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.strokeRect(40, height - 170, width - 80, 110);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 34px Impact, sans-serif';
      ctx.fillText('BENTAR... LU MIKIR DULU GA SIH?', width / 2, height - 110);
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'italic 18px "Comic Neue", sans-serif';
      ctx.fillText('*Reza Arap diam membeku menatap layar selama 10 detik*', width / 2, height - 70);
    },
  },
  {
    id: 'ds-distracted',
    title: 'Wikimedia: Distracted Boyfriend (Timpa Teks Klasik)',
    category: 'Open Source Meme Template',
    source: 'Wikimedia Commons (Meme Templates Collection)',
    sourceType: 'wikimedia',
    license: 'Creative Commons CC-BY 2.0',
    robotsTxtCompliant: true,
    label: 'TIMPAAN',
    tamperConfidence: 0.98,
    jokeDescription: 'Template cowok menoleh ke cewek lain, ditimpa teks label netizen tentang distraksi kehidupan sehari-hari.',
    aspectRatio: '16:9',
    drawBase: (ctx, width, height) => {
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, width, height);

      // Simple graphical illustration of the meme
      ctx.fillStyle = '#334155';
      ctx.fillRect(40, 60, width - 80, height - 120);

      ctx.font = '80px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('👀 🚶‍♂️ 🏃‍♀️', width / 2, height / 2 - 20);

      // Timpa text 1: Pacar setia
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px Impact, sans-serif';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.strokeText('BELAJAR MACHINE LEARNING', width * 0.28, height * 0.72);
      ctx.fillText('BELAJAR MACHINE LEARNING', width * 0.28, height * 0.72);

      // Timpa text 2: Distraksi
      ctx.strokeText('SCROLL MEME TIMPAAN SAMPE SUBUH', width * 0.72, height * 0.72);
      ctx.fillText('SCROLL MEME TIMPAAN SAMPE SUBUH', width * 0.72, height * 0.72);
    },
  },
  {
    id: 'ds-pecellele',
    title: 'Internet Archive: Spanduk Pecel Lele (Timpa Nomor Telp)',
    category: 'Arsip Budaya Visual Nusantara',
    source: 'Internet Archive WayBack (Arsip Spanduk Kuliner Lamongan)',
    sourceType: 'archive_org',
    license: 'Public Domain Dedication',
    robotsTxtCompliant: true,
    label: 'TIMPAAN',
    tamperConfidence: 0.97,
    jokeDescription: 'Spanduk legendaris kain lukis khas Lamongan, nomor telepon lama ditimpa lakban hitam lalu ditulis pulpen tebal.',
    aspectRatio: '16:9',
    drawBase: (ctx, width, height) => {
      // Cream canvas cloth texture
      ctx.fillStyle = '#fffbeb';
      ctx.fillRect(0, 0, width, height);

      // Border oranye-hijau khas spanduk pecel lele
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 12;
      ctx.strokeRect(15, 15, width - 30, height - 30);
      ctx.strokeStyle = '#16a34a';
      ctx.lineWidth = 4;
      ctx.strokeRect(25, 25, width - 50, height - 50);

      ctx.fillStyle = '#b91c1c';
      ctx.font = '900 48px Impact, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PECEL LELE & AYAM GORENG', width / 2, 90);

      ctx.font = 'bold 24px sans-serif';
      ctx.fillStyle = '#15803d';
      ctx.fillText('SAMBEL PEDES NAMPOL KHAS LAMONGAN ASLI', width / 2, 140);

      // Timpaan lakban pada nomor telepon
      ctx.fillStyle = '#18181b';
      ctx.fillRect(width / 2 - 220, 200, 440, 60);

      ctx.fillStyle = '#facc15';
      ctx.font = '900 32px monospace';
      ctx.fillText('WA: 0812-TIMPA-KANG', width / 2, 242);
    },
  },
  {
    id: 'ds-suratsakit',
    title: 'Kaggle Corpus: Surat Izin Dokter Palsu WhatsApp',
    category: 'Dokumen Digital Manipulasi',
    source: 'Kaggle SFW Document Tamper Benchmark',
    sourceType: 'kaggle',
    license: 'CC-BY 4.0 Open Data',
    robotsTxtCompliant: true,
    label: 'TIMPAAN',
    tamperConfidence: 0.99,
    jokeDescription: 'Surat dokter RS Sehat Sentosa yang nama dan tanggal istirahatnya ditimpa kotak putih kasar untuk izin bolos kerja.',
    aspectRatio: '4:3',
    drawBase: (ctx, width, height) => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 6;
      ctx.strokeRect(20, 20, width - 40, height - 40);

      ctx.fillStyle = '#0369a1';
      ctx.font = 'bold 28px serif';
      ctx.textAlign = 'center';
      ctx.fillText('KLINIK DOKTER SEHAT SENTOSA', width / 2, 70);

      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('Jl. Pegangsaan Timur No. 45 • Izin Praktek: 503/SIP/2024', width / 2, 105);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Surat Keterangan Sakit:', 60, 160);

      // Garis form
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(60, 210, width - 120, 3);
      ctx.fillRect(60, 270, width - 120, 3);

      // Kotak timpaan tebal putih (Patch Tamper)
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(180, 175, 340, 42);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(180, 175, 340, 42);

      // Teks timpaan
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 22px "Comic Neue", cursive';
      ctx.fillText('Nama: Kang Timpa Al-Meme', 190, 204);

      ctx.font = 'italic 16px sans-serif';
      ctx.fillStyle = '#dc2626';
      ctx.fillText('*Diagnosa: Sakit kepala akibat memikirkan meme netizen*', 60, 320);
    },
  },
  {
    id: 'ds-rollsafe',
    title: 'Imgflip API: Roll Safe "Mikir Pake Kepala"',
    category: 'Meme Template Global',
    source: 'Imgflip Public Templates API (/get_memes)',
    sourceType: 'imgflip',
    license: 'Open Meme Public Domain',
    robotsTxtCompliant: true,
    label: 'TIMPAAN',
    tamperConfidence: 0.95,
    jokeDescription: 'Pria mengetuk pelipis kepala dengan jari telunjuk. Teks timpaan: "Ga bakal kena timpa kalau dari awal ga posting apa-apa".',
    aspectRatio: '1:1',
    drawBase: (ctx, width, height) => {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      ctx.font = '100px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🧠 👈 👨🏿', width / 2, height / 2 - 20);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 36px Impact, sans-serif';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 5;

      ctx.strokeText('GA BAKAL KENA TIMPA', width / 2, 70);
      ctx.fillText('GA BAKAL KENA TIMPA', width / 2, 70);

      ctx.strokeText('KALO DARI AWAL GA POSTING', width / 2, height - 50);
      ctx.fillText('KALO DARI AWAL GA POSTING', width / 2, height - 50);
    },
  },
  {
    id: 'ds-kucing',
    title: 'Openverse: Kucing Oren Melamun (Foto Asli Suci)',
    category: 'Foto Asli Domain Publik',
    source: 'Openverse WordPress Foundation (CC0 Photography)',
    sourceType: 'openverse',
    license: 'Creative Commons CC0 1.0 (Public Domain)',
    robotsTxtCompliant: true,
    label: 'ASLI',
    tamperConfidence: 0.03,
    jokeDescription: 'Foto asli murni seekor kucing oren sedang melamun di atas pagar kayu. Sama sekali belum pernah disentuh Kang Timpa.',
    aspectRatio: '4:3',
    drawBase: (ctx, width, height) => {
      // Natural sky & garden background
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#7dd3fc');
      grad.addColorStop(0.6, '#bae6fd');
      grad.addColorStop(1, '#86efac');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Pagar kayu natural
      ctx.fillStyle = '#b45309';
      ctx.fillRect(0, height - 120, width, 120);

      // Kucing emoji natural
      ctx.font = '120px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🐱', width / 2, height / 2 + 50);

      ctx.font = 'bold 20px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText('NATURAL CC0 PHOTOGRAPHY • ZERO TAMPERING DETECTED', width / 2, 50);
    },
  },
  {
    id: 'ds-piagam',
    title: 'Piagam Warga Teladan (Original Halal)',
    category: 'Sertifikat Resmi Kelurahan',
    source: 'GitHub Komunitas Desain Grafis Nusantara',
    sourceType: 'github_open',
    license: 'MIT License',
    robotsTxtCompliant: true,
    label: 'ASLI',
    tamperConfidence: 0.04,
    jokeDescription: 'Sertifikat resmi kelurahan bebas rekayasa. Belum terjamah tangan jahil Kang Timpa. Masih suci, polos, dan penuh aura kejujuran.',
    aspectRatio: '4:3',
    drawBase: (ctx, width, height) => {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 8;
      ctx.strokeRect(30, 30, width - 60, height - 60);

      ctx.fillStyle = '#09090b';
      ctx.font = 'bold 34px serif';
      ctx.textAlign = 'center';
      ctx.fillText('PIAGAM WARGA TELADAN', width / 2, 100);

      ctx.fillStyle = '#334155';
      ctx.font = '18px sans-serif';
      ctx.fillText('Diberikan kepada warga yang tidak pernah menimpa postingan orang.', width / 2, 150);

      ctx.fillStyle = '#64748b';
      for (let y = 200; y < height - 120; y += 28) {
        ctx.fillRect(100, y, width - 200, 3);
      }
    },
  },
];

export interface ScrapeLogEntry {
  timestamp: string;
  source: string;
  domain: string;
  status: 'ROBOTS_TXT_CHECK' | 'EXTRACTING' | 'TRANSFORMING' | 'SFW_VERIFIED' | 'DATA_LAKE_SAVED';
  message: string;
}

export const GENERATE_INITIAL_SCRAPE_LOGS = (): ScrapeLogEntry[] => [
  {
    timestamp: '19:30:01',
    source: 'Wikimedia Commons',
    domain: 'commons.wikimedia.org',
    status: 'ROBOTS_TXT_CHECK',
    message: 'GET /robots.txt -> HTTP 200 OK. User-Agent "KangTimpaBot/2.0" diizinkan crawl kategori Meme Templates.',
  },
  {
    timestamp: '19:30:03',
    source: 'Wikimedia Commons',
    domain: 'commons.wikimedia.org',
    status: 'EXTRACTING',
    message: 'Mengais 48 sampel template meme CC-BY-SA dengan Crawl-delay sopan 1.5 detik (Polite Scraper).',
  },
  {
    timestamp: '19:30:06',
    source: 'Openverse API',
    domain: 'api.openverse.engineering',
    status: 'SFW_VERIFIED',
    message: 'Penyaringan SFW (Safe-for-Work) 100% lulus. Tidak ada konten sensitif atau terlarang.',
  },
  {
    timestamp: '19:30:08',
    source: 'Internet Archive',
    domain: 'archive.org',
    status: 'ROBOTS_TXT_CHECK',
    message: 'GET /robots.txt -> Patuh aturan crawl-delay 2.0 detik. Menghindari direktori privat /account/.',
  },
  {
    timestamp: '19:30:11',
    source: 'Kaggle Open Corpus',
    domain: 'kaggle.com/datasets',
    status: 'TRANSFORMING',
    message: 'Mengekstrak fitur tensor: ELA delta, anomali outline font Impact, dan bounding box patch kotak.',
  },
  {
    timestamp: '19:30:14',
    source: 'Data Lake Engine',
    domain: 'lake.internal/parquet',
    status: 'DATA_LAKE_SAVED',
    message: 'Menyimpan 12,650 sampel ke /lake/memes/v2_dataset.parquet. Siap untuk melatih model Machine Learning!',
  },
];

/**
 * Validates a simulated robots.txt compliance check for a given provider
 */
export function verifyRobotsTxtCompliance(provider: OpenSourceProvider): {
  isCompliant: boolean;
  userAgentHeader: string;
  crawlDelaySeconds: number;
  simulatedRobotsTxtContent: string;
} {
  const robotsContent = `# robots.txt for ${provider.domain}
# Crawl ethics policy enforced by KangTimpa Data Engineering

User-agent: ${provider.userAgentAccepted}
Crawl-delay: ${provider.crawlDelay}
${provider.allowedPaths.map((p) => `Allow: ${p}`).join('\n')}
${provider.disallowedPaths.map((p) => `Disallow: ${p}`).join('\n')}

# SFW & Research Exemption: Educational / Non-Commercial
Sitemap: https://${provider.domain}/sitemap-memes.xml`;

  return {
    isCompliant: true,
    userAgentHeader: provider.userAgentAccepted,
    crawlDelaySeconds: provider.crawlDelay,
    simulatedRobotsTxtContent: robotsContent,
  };
}
