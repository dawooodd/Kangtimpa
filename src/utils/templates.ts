import { MemeTemplate } from '../types';

// Preload the authentic Ivan Gunawan meme image
const cachedIgunImg = typeof window !== 'undefined' ? new Image() : null;
if (cachedIgunImg) {
  cachedIgunImg.src = '/assets/aistudio/image_232299d1.png';
}

export const MEME_TEMPLATES: MemeTemplate[] = [
  {
    id: 'ivan-gunawan-timpa',
    title: 'Ivan Gunawan: Kalo Nimpa Dipikir Mas',
    subtitle: 'Foto asli viral Ivan Gunawan duduk di atas Raffi Ahmad tanpa editan tambahan',
    category: 'Indo Meme',
    aspectRatio: '1:1',
    previewColor: '#f59e0b',
    imageSrc: '/assets/aistudio/image_232299d1.png',
    initialLayers: [], // Foto asli murni tanpa ditimpa lagi!
    generateBaseCanvas: (ctx, width, height) => {
      if (cachedIgunImg && cachedIgunImg.complete && cachedIgunImg.naturalWidth > 0) {
        ctx.drawImage(cachedIgunImg, 0, 0, width, height);
      } else {
        ctx.fillStyle = '#18181b';
        ctx.fillRect(0, 0, width, height);
      }
    },
  },
  {
    id: 'reza-arap-audiotore',
    title: 'Reza Arap Bengong (Audiotore)',
    subtitle: 'Reaksi muka kaget Reza Arap saat melihat hasil editan netizen',
    category: 'Indo Meme',
    aspectRatio: '16:9',
    previewColor: '#f59e0b',
    initialLayers: [],
    generateBaseCanvas: (ctx, width, height) => {
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 4;
      ctx.strokeRect(20, 20, width - 40, height - 40);

      ctx.fillStyle = '#f59e0b';
      ctx.font = '100px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🗿', width / 2, height / 2 + 20);

      ctx.font = 'bold 20px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#a1a1aa';
      ctx.fillText('REZA ARAP MEME REACTION EDITION', width / 2, height / 2 + 90);
    },
  },
  {
    id: 'breaking-news',
    title: 'Breaking News TV',
    subtitle: 'Siaran berita darurat siap ditimpa headline-nya',
    category: 'News / Chat',
    aspectRatio: '16:9',
    previewColor: '#f59e0b',
    initialLayers: [],
    generateBaseCanvas: (ctx, width, height) => {
      ctx.fillStyle = '#18181b';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, height - 180, width, 180);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(0, height - 45, width, 45);
      ctx.fillStyle = '#09090b';
      ctx.font = 'bold 18px Inter, sans-serif';
      ctx.fillText('🔴 RUNNING TEXT: SIAPKAN MENTAL SEBELUM MEMBACA BERITA KANG TIMPA •', 30, height - 16);
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
];
