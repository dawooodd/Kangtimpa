import { EditorLayer, TextLayer } from '../types';

export interface AutoTimpaPreset {
  id: string;
  name: string;
  character: string;
  description: string;
  generateLayers: (
    canvasWidth: number, 
    canvasHeight: number, 
    sourceCanvas?: HTMLCanvasElement
  ) => EditorLayer[];
}

/**
 * Calculates average luminance of a horizontal band on the canvas
 * Returns 'dark' or 'light' to choose best text contrast
 */
function getBandLuminance(canvas: HTMLCanvasElement | undefined, yStartRatio: number, yEndRatio: number): 'light' | 'dark' {
  if (!canvas) return 'dark';
  try {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return 'dark';
    const yStart = Math.floor(canvas.height * yStartRatio);
    const h = Math.max(10, Math.floor(canvas.height * (yEndRatio - yStartRatio)));
    const imgData = ctx.getImageData(0, yStart, canvas.width, h);
    const d = imgData.data;

    let totalLum = 0;
    const sampleStep = 8; // sample every 8th pixel for speed
    let samples = 0;

    for (let i = 0; i < d.length; i += 4 * sampleStep) {
      const lum = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
      totalLum += lum;
      samples++;
    }

    const avg = samples > 0 ? totalLum / samples : 100;
    return avg > 145 ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export const AUTO_TIMPA_PRESETS: AutoTimpaPreset[] = [
  {
    id: 'igun-dipikir',
    name: 'Ivan Gunawan: "Kalo Nimpa Dipikir Mas!"',
    character: 'Ivan Gunawan',
    description: 'Timpa teks murni langsung pada foto tanpa kotak background',
    generateLayers: (w, h, canvas) => {
      const topLum = getBandLuminance(canvas, 0.05, 0.22);
      const botLum = getBandLuminance(canvas, 0.75, 0.95);

      const topTextColor = topLum === 'light' ? '#000000' : '#ffffff';
      const topStrokeColor = topLum === 'light' ? '#ffffff' : '#000000';

      const botTextColor = botLum === 'light' ? '#000000' : '#ffffff';
      const botStrokeColor = botLum === 'light' ? '#ffffff' : '#000000';

      const textTop: TextLayer = {
        id: `auto-text-${Date.now()}-1`,
        type: 'text',
        x: Math.round(w / 2),
        y: Math.round(h * 0.15),
        rotation: 0,
        opacity: 1,
        text: 'KALO NIMPA',
        fontSize: Math.min(68, Math.round(w * 0.08)),
        fontFamily: 'Impact',
        fillColor: topTextColor,
        strokeColor: topStrokeColor,
        strokeWidth: 5,
        backgroundColor: '', // Pure transparent, no box!
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
      };

      const textBot: TextLayer = {
        id: `auto-text-${Date.now()}-2`,
        type: 'text',
        x: Math.round(w / 2),
        y: Math.round(h * 0.88),
        rotation: 0,
        opacity: 1,
        text: 'DIPIKIR MAS',
        fontSize: Math.min(68, Math.round(w * 0.08)),
        fontFamily: 'Impact',
        fillColor: botTextColor,
        strokeColor: botStrokeColor,
        strokeWidth: 5,
        backgroundColor: '', // Pure transparent, no box!
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
      };

      return [textTop, textBot];
    },
  },
  {
    id: 'reza-audiotore',
    name: 'Reza Arap: "Lu Mikir Dulu Ga?"',
    character: 'Reza Arap (Audiotore)',
    description: 'Teks reaksi netizen murni pada foto tanpa kotak background',
    generateLayers: (w, h, canvas) => {
      const topLum = getBandLuminance(canvas, 0.05, 0.22);
      const botLum = getBandLuminance(canvas, 0.75, 0.95);

      const topTextColor = topLum === 'light' ? '#000000' : '#ffffff';
      const topStrokeColor = topLum === 'light' ? '#ffffff' : '#000000';

      const botTextColor = botLum === 'light' ? '#000000' : '#ffffff';
      const botStrokeColor = botLum === 'light' ? '#ffffff' : '#000000';

      const textTop: TextLayer = {
        id: `reza-text-${Date.now()}-top`,
        type: 'text',
        x: Math.round(w / 2),
        y: Math.round(h * 0.14),
        rotation: 0,
        opacity: 1,
        text: 'BENTAR... LU MIKIR DULU GA?',
        fontSize: Math.min(54, Math.round(w * 0.065)),
        fontFamily: 'Impact',
        fillColor: topTextColor,
        strokeColor: topStrokeColor,
        strokeWidth: 5,
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
      };

      const textBot: TextLayer = {
        id: `reza-text-${Date.now()}-bot`,
        type: 'text',
        x: Math.round(w / 2),
        y: Math.round(h * 0.88),
        rotation: 0,
        opacity: 1,
        text: 'SEBELUM NIMPA FOTO INI? 🗿',
        fontSize: Math.min(48, Math.round(w * 0.058)),
        fontFamily: 'Impact',
        fillColor: botTextColor,
        strokeColor: botStrokeColor,
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
      };

      return [textTop, textBot];
    },
  },
  {
    id: 'gak-bahaya-ta',
    name: 'Teks Heboh: "Gak Bahaya Ta?"',
    character: 'Warganet Santuy',
    description: 'Format meme 2 baris atas-bawah tanpa kotak background',
    generateLayers: (w, h, canvas) => {
      const topLum = getBandLuminance(canvas, 0.05, 0.22);
      const botLum = getBandLuminance(canvas, 0.75, 0.95);

      const topTextColor = topLum === 'light' ? '#000000' : '#ffffff';
      const topStrokeColor = topLum === 'light' ? '#ffffff' : '#000000';

      const botTextColor = botLum === 'light' ? '#000000' : '#ffffff';
      const botStrokeColor = botLum === 'light' ? '#ffffff' : '#000000';

      const textTop: TextLayer = {
        id: `gb-text-${Date.now()}-1`,
        type: 'text',
        x: Math.round(w / 2),
        y: Math.round(h * 0.15),
        rotation: 0,
        opacity: 1,
        text: 'INFO MASSEH',
        fontSize: Math.min(64, Math.round(w * 0.08)),
        fontFamily: 'Impact',
        fillColor: topTextColor,
        strokeColor: topStrokeColor,
        strokeWidth: 5,
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
      };

      const textBot: TextLayer = {
        id: `gb-text-${Date.now()}-2`,
        type: 'text',
        x: Math.round(w / 2),
        y: Math.round(h * 0.88),
        rotation: 0,
        opacity: 1,
        text: 'GAK BAHAYA TA?',
        fontSize: Math.min(64, Math.round(w * 0.08)),
        fontFamily: 'Impact',
        fillColor: botTextColor,
        strokeColor: botStrokeColor,
        strokeWidth: 5,
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
      };

      return [textTop, textBot];
    },
  },
];
