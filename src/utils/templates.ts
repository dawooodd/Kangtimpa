import { MemeTemplate } from '../types';

export const MEME_TEMPLATES: MemeTemplate[] = [
  {
    id: 'breaking-news',
    title: 'Breaking News TV',
    subtitle: 'Siaran berita darurat siap ditimpa headline-nya',
    category: 'News / Chat',
    aspectRatio: '16:9',
    previewColor: '#b91c1c',
    initialLayers: [
      {
        id: 'patch-news-1',
        type: 'patch',
        x: 40,
        y: 530,
        width: 1200,
        height: 110,
        shape: 'rect',
        fillColor: '#b91c1c',
        borderColor: '#facc15',
        borderWidth: 4,
        borderRadius: 0,
        blur: 0,
        rotation: 0,
        opacity: 1,
      },
      {
        id: 'text-news-1',
        type: 'text',
        x: 640,
        y: 550,
        rotation: 0,
        opacity: 1,
        text: 'BREAKING: KANG TIMPA KEMBALI BERAKSI',
        fontSize: 48,
        fontFamily: 'Impact',
        fillColor: '#ffffff',
        strokeColor: '#000000',
        strokeWidth: 4,
        backgroundColor: '',
        backgroundPadding: 0,
        backgroundBorderRadius: 0,
        align: 'center',
        bold: true,
        italic: false,
        uppercase: true,
        shadowColor: 'rgba(0,0,0,0.8)',
        shadowBlur: 8,
        shadowOffsetX: 2,
        shadowOffsetY: 2,
      },
      {
        id: 'text-news-sub',
        type: 'text',
        x: 640,
        y: 655,
        rotation: 0,
        opacity: 1,
        text: 'Warga dimohon tetap santai dan jangan mudah terpancing',
        fontSize: 28,
        fontFamily: 'Inter',
        fillColor: '#ffffff',
        strokeColor: '#000000',
        strokeWidth: 2,
        backgroundColor: '#18181b',
        backgroundPadding: 8,
        backgroundBorderRadius: 4,
        align: 'center',
        bold: true,
        italic: false,
        uppercase: false,
        shadowColor: '',
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      },
    ],
    generateBaseCanvas: (ctx, width, height) => {
      // Dark studio background
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(0.5, '#1e293b');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Studio grid lights
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 60) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let j = 0; j < height; j += 60) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(width, j);
        ctx.stroke();
      }

      // World map circle silhouette
      ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
      ctx.beginPath();
      ctx.arc(width * 0.75, height * 0.45, 260, 0, Math.PI * 2);
      ctx.fill();

      // TV Channel bug top right
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.beginPath();
      ctx.roundRect(width - 200, 40, 160, 50, 8);
      ctx.fill();
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(width - 175, 65, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('LIVE 24 JAM', width - 155, 72);

      // Bottom News Bar background
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, height - 190, width, 190);

      // Ticker tape
      ctx.fillStyle = '#eab308';
      ctx.fillRect(0, height - 50, width, 50);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 20px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('🔴 RUNNING TEXT: SIAPKAN MENTAL SEBELUM MEMBACA BERITA INI • TIMPA DAN TERTAWALAH BERSAMA KANG TIMPA •', 30, height - 18);

      // Red Breaking News tab
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.roundRect(40, height - 230, 260, 55, [8, 8, 0, 0]);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 26px Impact, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('BREAKING NEWS', 170, height - 192);
    },
  },
  {
    id: 'whatsapp-chat',
    title: 'Chat WhatsApp Bocor',
    subtitle: 'Bikin tangkapan layar chat kocak dengan teks timpaan',
    category: 'News / Chat',
    aspectRatio: '9:16',
    previewColor: '#075e54',
    initialLayers: [
      {
        id: 'patch-wa-1',
        type: 'patch',
        x: 80,
        y: 420,
        width: 680,
        height: 120,
        shape: 'rounded',
        fillColor: '#005c4b',
        borderColor: '#005c4b',
        borderWidth: 0,
        borderRadius: 16,
        blur: 0,
        rotation: 0,
        opacity: 1,
      },
      {
        id: 'text-wa-1',
        type: 'text',
        x: 110,
        y: 450,
        rotation: 0,
        opacity: 1,
        text: 'Bro, lu udah tau belum rahasia Kang Timpa?',
        fontSize: 32,
        fontFamily: 'Comic Neue',
        fillColor: '#e9edef',
        strokeColor: '',
        strokeWidth: 0,
        backgroundColor: '',
        backgroundPadding: 0,
        backgroundBorderRadius: 0,
        align: 'left',
        bold: true,
        italic: false,
        uppercase: false,
        shadowColor: '',
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      },
      {
        id: 'patch-wa-2',
        type: 'patch',
        x: 80,
        y: 600,
        width: 700,
        height: 160,
        shape: 'rounded',
        fillColor: '#202c33',
        borderColor: '#202c33',
        borderWidth: 0,
        borderRadius: 16,
        blur: 0,
        rotation: 0,
        opacity: 1,
      },
      {
        id: 'text-wa-2',
        type: 'text',
        x: 110,
        y: 635,
        rotation: 0,
        opacity: 1,
        text: 'Rahasia apa bro? Jangan bikin kepo...',
        fontSize: 32,
        fontFamily: 'Inter',
        fillColor: '#e9edef',
        strokeColor: '',
        strokeWidth: 0,
        backgroundColor: '',
        backgroundPadding: 0,
        backgroundBorderRadius: 0,
        align: 'left',
        bold: false,
        italic: false,
        uppercase: false,
        shadowColor: '',
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      },
    ],
    generateBaseCanvas: (ctx, width, height) => {
      // Dark WhatsApp background
      ctx.fillStyle = '#0b141a';
      ctx.fillRect(0, 0, width, height);

      // WhatsApp Doodle pattern subtle lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 2;
      for (let i = 0; i < width + height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(i, 0);
        ctx.stroke();
      }

      // WhatsApp Top Header bar
      ctx.fillStyle = '#202c33';
      ctx.fillRect(0, 0, width, 140);

      // Avatar circle
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.arc(80, 70, 36, 0, Math.PI * 2);
      ctx.fill();

      // Avatar icon
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('👤', 80, 82);

      // Contact name
      ctx.fillStyle = '#e9edef';
      ctx.font = 'bold 32px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('Kang Bakso (Langganan)', 140, 65);

      ctx.fillStyle = '#8696a0';
      ctx.font = '22px Inter, sans-serif';
      ctx.fillText('online sekarang', 140, 100);

      // Call icons placeholder
      ctx.font = '28px Inter, sans-serif';
      ctx.fillText('📹  📞  ⋮', width - 160, 80);

      // Bottom chat input bar
      ctx.fillStyle = '#202c33';
      ctx.fillRect(0, height - 120, width, 120);

      ctx.fillStyle = '#2a3942';
      ctx.beginPath();
      ctx.roundRect(20, height - 100, width - 140, 80, 40);
      ctx.fill();

      ctx.fillStyle = '#8696a0';
      ctx.font = '26px Inter, sans-serif';
      ctx.fillText('Ketik pesan...', 60, height - 50);

      // Send button
      ctx.fillStyle = '#00a884';
      ctx.beginPath();
      ctx.arc(width - 60, height - 60, 38, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '28px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('➤', width - 60, height - 50);
    },
  },
  {
    id: 'piagam-kang-timpa',
    title: 'Piagam Resmi Kang Timpa',
    subtitle: 'Sertifikat kelayakan dan pengakuan sebagai Master Timpa',
    category: 'Indo Meme',
    aspectRatio: '4:3',
    previewColor: '#d97706',
    initialLayers: [
      {
        id: 'text-cert-title',
        type: 'text',
        x: 500,
        y: 180,
        rotation: 0,
        opacity: 1,
        text: 'PIAGAM PENGHARGAAN',
        fontSize: 54,
        fontFamily: 'Anton',
        fillColor: '#92400e',
        strokeColor: '',
        strokeWidth: 0,
        backgroundColor: '',
        backgroundPadding: 0,
        backgroundBorderRadius: 0,
        align: 'center',
        bold: true,
        italic: false,
        uppercase: true,
        shadowColor: '',
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      },
      {
        id: 'text-cert-subtitle',
        type: 'text',
        x: 500,
        y: 250,
        rotation: 0,
        opacity: 1,
        text: 'Diberikan kepada sosok luar biasa:',
        fontSize: 26,
        fontFamily: 'Inter',
        fillColor: '#78350f',
        strokeColor: '',
        strokeWidth: 0,
        backgroundColor: '',
        backgroundPadding: 0,
        backgroundBorderRadius: 0,
        align: 'center',
        bold: false,
        italic: true,
        uppercase: false,
        shadowColor: '',
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      },
      {
        id: 'patch-cert-name',
        type: 'patch',
        x: 160,
        y: 290,
        width: 680,
        height: 75,
        shape: 'rounded',
        fillColor: '#fef3c7',
        borderColor: '#d97706',
        borderWidth: 2,
        borderRadius: 8,
        blur: 0,
        rotation: 0,
        opacity: 1,
      },
      {
        id: 'text-cert-name',
        type: 'text',
        x: 500,
        y: 310,
        rotation: 0,
        opacity: 1,
        text: '[ TULIS NAMA KORBAN TIMPA DI SINI ]',
        fontSize: 34,
        fontFamily: 'Permanent Marker',
        fillColor: '#b45309',
        strokeColor: '',
        strokeWidth: 0,
        backgroundColor: '',
        backgroundPadding: 0,
        backgroundBorderRadius: 0,
        align: 'center',
        bold: true,
        italic: false,
        uppercase: true,
        shadowColor: '',
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      },
      {
        id: 'text-cert-desc',
        type: 'text',
        x: 500,
        y: 410,
        rotation: 0,
        opacity: 1,
        text: 'Atas dedikasi tak henti menimpa postingan orang lain demi tawa warganet.',
        fontSize: 24,
        fontFamily: 'Inter',
        fillColor: '#451a03',
        strokeColor: '',
        strokeWidth: 0,
        backgroundColor: '',
        backgroundPadding: 0,
        backgroundBorderRadius: 0,
        align: 'center',
        bold: false,
        italic: false,
        uppercase: false,
        shadowColor: '',
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      },
      {
        id: 'sticker-stamp-1',
        type: 'sticker',
        stickerType: 'stamp',
        content: 'DISETUJUI KANG TIMPA',
        badgeColor: '#dc2626',
        x: 740,
        y: 540,
        rotation: -12,
        opacity: 0.95,
        width: 180,
        height: 90,
      },
    ],
    generateBaseCanvas: (ctx, width, height) => {
      // Vintage cream parchment background
      ctx.fillStyle = '#fffbeb';
      ctx.fillRect(0, 0, width, height);

      // Double Ornate Gold/Bronze Border
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 14;
      ctx.strokeRect(30, 30, width - 60, height - 60);

      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 3;
      ctx.strokeRect(48, 48, width - 96, height - 96);

      // Corner ornaments
      const corners = [
        [60, 60],
        [width - 60, 60],
        [60, height - 60],
        [width - 60, height - 60],
      ];
      ctx.fillStyle = '#b45309';
      corners.forEach(([cx, cy]) => {
        ctx.beginPath();
        ctx.arc(cx, cy, 14, 0, Math.PI * 2);
        ctx.fill();
      });

      // Gold Seal background bottom left
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(200, height - 160, 70, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(200, height - 160, 60, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#78350f';
      ctx.font = 'bold 18px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SEAL OF', 200, height - 175);
      ctx.font = '900 22px Impact, sans-serif';
      ctx.fillText('AUTHENTICITY', 200, height - 150);
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.fillText('★ ★ ★', 200, height - 128);

      // Signature line bottom right
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width - 360, height - 130);
      ctx.lineTo(width - 120, height - 130);
      ctx.stroke();

      ctx.font = 'italic 20px Caveat, cursive';
      ctx.fillStyle = '#78350f';
      ctx.fillText('Ketua Umum Kang Timpa Indonesia', width - 240, height - 100);
    },
  },
  {
    id: 'spanduk-warung',
    title: 'Spanduk Warung Pinggir Jalan',
    subtitle: 'Spanduk khas kain pecel lele / spanduk pengumuman heboh',
    category: 'Indo Meme',
    aspectRatio: '16:9',
    previewColor: '#dc2626',
    initialLayers: [
      {
        id: 'patch-banner-1',
        type: 'patch',
        x: 100,
        y: 220,
        width: 1080,
        height: 180,
        shape: 'rounded',
        fillColor: '#facc15',
        borderColor: '#dc2626',
        borderWidth: 6,
        borderRadius: 16,
        blur: 0,
        rotation: 0,
        opacity: 1,
      },
      {
        id: 'text-banner-main',
        type: 'text',
        x: 640,
        y: 260,
        rotation: 0,
        opacity: 1,
        text: 'SEDIA MEME SEGAR DAN TIMPAAN MURNI',
        fontSize: 54,
        fontFamily: 'Bangers',
        fillColor: '#dc2626',
        strokeColor: '#000000',
        strokeWidth: 4,
        backgroundColor: '',
        backgroundPadding: 0,
        backgroundBorderRadius: 0,
        align: 'center',
        bold: true,
        italic: false,
        uppercase: true,
        shadowColor: '',
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      },
      {
        id: 'text-banner-sub',
        type: 'text',
        x: 640,
        y: 470,
        rotation: 0,
        opacity: 1,
        text: 'BUKA 24 JAM TANPA LIBUR KECUALI KETIDURAN',
        fontSize: 38,
        fontFamily: 'Impact',
        fillColor: '#ffffff',
        strokeColor: '#000000',
        strokeWidth: 5,
        backgroundColor: '#16a34a',
        backgroundPadding: 12,
        backgroundBorderRadius: 10,
        align: 'center',
        bold: true,
        italic: false,
        uppercase: true,
        shadowColor: '',
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
      },
    ],
    generateBaseCanvas: (ctx, width, height) => {
      // White canvas cloth texture
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, width, height);

      // Top and bottom striped edge typical of Indonesian warung banners
      const stripeHeight = 35;
      const stripeWidth = 50;

      for (let x = 0; x < width; x += stripeWidth) {
        ctx.fillStyle = (x / stripeWidth) % 2 === 0 ? '#dc2626' : '#facc15';
        ctx.fillRect(x, 0, stripeWidth, stripeHeight);
        ctx.fillRect(x, height - stripeHeight, stripeWidth, stripeHeight);
      }

      // Title header
      ctx.fillStyle = '#1e3a8a';
      ctx.font = '900 48px Impact, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('WARUNG TIMPA POSTING INDONESIA', width / 2, 110);

      // Little mascot catfish / fish art on sides
      ctx.font = '60px serif';
      ctx.fillText('🐟', 120, 120);
      ctx.fillText('🍗', width - 120, 120);
    },
  },
  {
    id: 'blank-square',
    title: 'Kanvas Kosong (1:1 Persegi)',
    subtitle: 'Mulai dari awal dengan gambar upload atau paste sendiri',
    category: 'Classic',
    aspectRatio: '1:1',
    previewColor: '#27272a',
    initialLayers: [],
    generateBaseCanvas: (ctx, width, height) => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
    },
  },
  {
    id: 'blank-story',
    title: 'Kanvas Story / Reels (9:16)',
    subtitle: 'Ukuran ideal untuk WhatsApp Status, Instagram Story, TikTok',
    category: 'Classic',
    aspectRatio: '9:16',
    previewColor: '#18181b',
    initialLayers: [],
    generateBaseCanvas: (ctx, width, height) => {
      ctx.fillStyle = '#18181b';
      ctx.fillRect(0, 0, width, height);
    },
  },
];
