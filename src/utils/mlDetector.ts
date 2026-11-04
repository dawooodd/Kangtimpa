export interface SuspectedRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  suspicionScore: number;
}

export interface MLAnalysisResult {
  isTampered: boolean;
  tamperScore: number; // 0 to 100
  confidence: number; // percentage
  label: 'HASIL TIMPAAN (TERDETEKSI KARYA KANG TIMPA)' | 'GAMBAR ASLI (BELUM DIJAMBAH / ORI)';
  suspectedRegions: SuspectedRegion[];
  heatmapDataUrl: string;
  elaDataUrl: string;
  engineerLog: string[];
  humorousVerdict: string;
  metrics: {
    entropyVariance: number;
    colorUniformitySpike: number;
    edgeInconsistency: number;
    jpegArtifactDelta: number;
  };
}

/**
 * Real client-side Computer Vision / ML Heuristic analyzer
 * Performs Error Level Analysis (ELA) and localized block variance detection
 */
export async function analyzeImageForTampering(
  sourceCanvas: HTMLCanvasElement
): Promise<MLAnalysisResult> {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;

  // 1. Create a working canvas scaled to standard analysis size for speed and normalized stats
  const workCanvas = document.createElement('canvas');
  const targetW = 400;
  const targetH = Math.round((height / width) * targetW);
  workCanvas.width = targetW;
  workCanvas.height = targetH;
  const workCtx = workCanvas.getContext('2d', { willReadFrequently: true });
  if (!workCtx) throw new Error('Could not get work canvas context');

  workCtx.drawImage(sourceCanvas, 0, 0, targetW, targetH);
  const origImageData = workCtx.getImageData(0, 0, targetW, targetH);
  const origData = origImageData.data;

  // 2. Perform Error Level Analysis (ELA)
  // Recompress as standard JPEG at 0.70 quality and compare pixel delta
  const jpegDataUrl = workCanvas.toDataURL('image/jpeg', 0.7);
  const recompressedImg = await loadImage(jpegDataUrl);

  const elaCanvas = document.createElement('canvas');
  elaCanvas.width = targetW;
  elaCanvas.height = targetH;
  const elaCtx = elaCanvas.getContext('2d');
  if (!elaCtx) throw new Error('Could not get ELA canvas context');

  elaCtx.drawImage(recompressedImg, 0, 0, targetW, targetH);
  const recompData = elaCtx.getImageData(0, 0, targetW, targetH).data;

  const diffImageData = elaCtx.createImageData(targetW, targetH);
  const diffData = diffImageData.data;

  let totalDiff = 0;
  let maxLocalDiff = 0;

  for (let i = 0; i < origData.length; i += 4) {
    const dr = Math.abs(origData[i] - recompData[i]);
    const dg = Math.abs(origData[i + 1] - recompData[i + 1]);
    const db = Math.abs(origData[i + 2] - recompData[i + 2]);
    const diff = (dr + dg + db) / 3;

    totalDiff += diff;

    // Amplify for visual forensic ELA view (scaled x10)
    diffData[i] = Math.min(255, dr * 12);
    diffData[i + 1] = Math.min(255, dg * 12);
    diffData[i + 2] = Math.min(255, db * 12);
    diffData[i + 3] = 255;
  }
  elaCtx.putImageData(diffImageData, 0, 0);

  // 3. Grid scan for unnaturally solid patches (low variance blocks) surrounded by text edges
  const gridSize = 20;
  const cols = Math.floor(targetW / gridSize);
  const rows = Math.floor(targetH / gridSize);
  const blockSuspicion: number[][] = [];

  let highestBlockScore = 0;
  const suspectedBoxes: SuspectedRegion[] = [];

  for (let r = 0; r < rows; r++) {
    blockSuspicion[r] = [];
    for (let c = 0; c < cols; c++) {
      const bx = c * gridSize;
      const by = r * gridSize;

      // Calculate variance and ELA energy in this block
      let sumLum = 0;
      let count = 0;
      const lums: number[] = [];

      for (let y = by; y < by + gridSize; y++) {
        for (let x = bx; x < bx + gridSize; x++) {
          const idx = (y * targetW + x) * 4;
          const lum = origData[idx] * 0.299 + origData[idx + 1] * 0.587 + origData[idx + 2] * 0.114;
          lums.push(lum);
          sumLum += lum;
          count++;
        }
      }

      const meanLum = sumLum / count;
      let variance = 0;
      for (const lum of lums) {
        variance += Math.pow(lum - meanLum, 2);
      }
      variance = variance / count;

      // An unnatural patch is characterized by low internal variance (solid color) or sudden sharp text edge
      let suspicion = 0;
      if (variance < 25) {
        // Very solid block (potential patch box)
        suspicion += 0.65;
      } else if (variance > 800) {
        // High contrast edge (potential impact meme text)
        suspicion += 0.45;
      }

      blockSuspicion[r][c] = suspicion;
      if (suspicion > highestBlockScore) highestBlockScore = suspicion;
    }
  }

  // 4. Group adjacent suspicious blocks into bounding boxes
  for (let r = 1; r < rows - 1; r++) {
    for (let c = 1; c < cols - 1; c++) {
      if (blockSuspicion[r][c] >= 0.6) {
        // Expand bounding box scale to original canvas
        const scaleX = width / targetW;
        const scaleY = height / targetH;
        suspectedBoxes.push({
          x: Math.round(c * gridSize * scaleX),
          y: Math.round(r * gridSize * scaleY),
          width: Math.round(gridSize * scaleX * 1.5),
          height: Math.round(gridSize * scaleY * 1.5),
          suspicionScore: Math.round(blockSuspicion[r][c] * 100),
        });
      }
    }
  }

  // 5. Generate Visual Forensic Heatmap
  const heatmapCanvas = document.createElement('canvas');
  heatmapCanvas.width = targetW;
  heatmapCanvas.height = targetH;
  const hmCtx = heatmapCanvas.getContext('2d');
  if (!hmCtx) throw new Error('Could not get heatmap ctx');

  // Draw dimmed original image
  hmCtx.drawImage(workCanvas, 0, 0);
  hmCtx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  hmCtx.fillRect(0, 0, targetW, targetH);

  // Overlay colored glowing anomaly blobs
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const score = blockSuspicion[r][c];
      if (score > 0.4) {
        const hx = c * gridSize;
        const hy = r * gridSize;
        const alpha = Math.min(0.85, score);
        hmCtx.fillStyle = score > 0.6 ? `rgba(239, 68, 68, ${alpha})` : `rgba(234, 179, 8, ${alpha})`;
        hmCtx.fillRect(hx, hy, gridSize, gridSize);
      }
    }
  }

  // 6. Overall Metrics and Confidence Calculation
  const avgDiff = totalDiff / (targetW * targetH);
  const numSuspicious = suspectedBoxes.length;

  let tamperScore = Math.min(99.4, Math.round((numSuspicious / (rows * cols * 0.25)) * 100 + avgDiff * 8));
  if (numSuspicious < 4) {
    tamperScore = Math.max(3.2, Math.round(avgDiff * 1.5));
  } else {
    tamperScore = Math.max(78.5, tamperScore);
  }

  const isTampered = tamperScore >= 60;
  const confidence = isTampered ? Math.min(99.8, tamperScore + 0.5) : Math.min(99.2, 100 - tamperScore);

  // Comedic Data Engineer Verdicts
  const funnyTamperedVerdicts = [
    '🚨 TERDETEKSI 100% KARYA KANG TIMPA! Model neural network mencium aroma kotak penutup dan font Impact yang sangat mencurigakan.',
    '🚨 ANOMALI PIKSEL DITEMUKAN! Ada tambalan warna solid yang menutupi kebenaran sejati. Jangan percaya postingan ini tanpa meterai!',
    '🚨 FIX EDITAN KANG TIMPA! Algoritma mendeteksi usaha menimpa teks asli dengan akurasi setara emak-emak memergoki anaknya bohong.',
  ];

  const funnyOriginalVerdicts = [
    '🛡️ SUCI DARI DOSA TIMPAAN! Gambar ini terverifikasi 100% original, belum pernah disenggol oleh kuas maupun kotak penutup.',
    '🛡️ POLOS TANPA REKAYASA! Tensor scan menunjukkan struktur piksel merata. Aman dikirim ke grup keluarga tanpa memicu debat kusir.',
    '🛡️ TINGKAT KEASLIAN SEMPURNA! Tidak ditemukan font Comic Sans maupun stempel palsu di setiap koordinat gambar.',
  ];

  const verdict = isTampered
    ? funnyTamperedVerdicts[Math.floor(Math.random() * funnyTamperedVerdicts.length)]
    : funnyOriginalVerdicts[Math.floor(Math.random() * funnyOriginalVerdicts.length)];

  const logs = [
    `[ETL-LOAD] Membaca tensor citra input ukuran ${width}x${height}px`,
    `[CV-ELA] Error Level Analysis selesai: delta rata-rata = ${avgDiff.toFixed(2)}`,
    `[ENTROPY-SCAN] Mendeteksi ${numSuspicious} blok piksel berkontras anomali`,
    `[MODEL-INFERENCE] Klasifikasi biner: score=${tamperScore.toFixed(1)}% -> ${isTampered ? 'TIMPAAN' : 'ASLI'}`,
    `[ENG-VERDICT] ${isTampered ? 'Disarankan segera membongkar timpaan' : 'Gambar siap ditimpa jika berminat'}`,
  ];

  return {
    isTampered,
    tamperScore,
    confidence,
    label: isTampered
      ? 'HASIL TIMPAAN (TERDETEKSI KARYA KANG TIMPA)'
      : 'GAMBAR ASLI (BELUM DIJAMBAH / ORI)',
    suspectedRegions: suspectedBoxes.slice(0, 12),
    heatmapDataUrl: heatmapCanvas.toDataURL('image/png'),
    elaDataUrl: elaCanvas.toDataURL('image/png'),
    engineerLog: logs,
    humorousVerdict: verdict,
    metrics: {
      entropyVariance: Number((avgDiff * 4.2).toFixed(2)),
      colorUniformitySpike: Math.min(100, Math.round(numSuspicious * 3.5)),
      edgeInconsistency: Math.round(highestBlockScore * 100),
      jpegArtifactDelta: Number(avgDiff.toFixed(2)),
    },
  };
}

/**
 * Reverse-Timpa (Inpainting / Reconstruction):
 * Blends surrounding boundary colors into suspected regions to erase the overlay patch and restore base background!
 */
export function inpaintRestoreCanvas(
  targetCanvas: HTMLCanvasElement,
  regions: SuspectedRegion[]
): HTMLCanvasElement {
  const restoredCanvas = document.createElement('canvas');
  restoredCanvas.width = targetCanvas.width;
  restoredCanvas.height = targetCanvas.height;
  const ctx = restoredCanvas.getContext('2d');
  if (!ctx) return targetCanvas;

  ctx.drawImage(targetCanvas, 0, 0);

  // Group nearby boxes into a combined bounding box to cover the patch
  if (regions.length > 0) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    regions.forEach((r) => {
      if (r.x < minX) minX = r.x;
      if (r.y < minY) minY = r.y;
      if (r.x + r.width > maxX) maxX = r.x + r.width;
      if (r.y + r.height > maxY) maxY = r.y + r.height;
    });

    const boxW = Math.max(40, maxX - minX);
    const boxH = Math.max(30, maxY - minY);

    // Sample border colors top, bottom, left, right to create seamless inpaint blend
    const sampleYTop = Math.max(0, minY - 5);
    const sampleYBot = Math.min(targetCanvas.height - 1, maxY + 5);
    const sampleXMid = Math.floor(minX + boxW / 2);

    const topPixel = ctx.getImageData(sampleXMid, sampleYTop, 1, 1).data;
    const botPixel = ctx.getImageData(sampleXMid, sampleYBot, 1, 1).data;

    const topColor = `rgb(${topPixel[0]}, ${topPixel[1]}, ${topPixel[2]})`;
    const botColor = `rgb(${botPixel[0]}, ${botPixel[1]}, ${botPixel[2]})`;

    // Linear inpainting gradient
    const grad = ctx.createLinearGradient(0, minY, 0, maxY);
    grad.addColorStop(0, topColor);
    grad.addColorStop(1, botColor);

    ctx.save();
    ctx.fillStyle = grad;
    ctx.filter = 'blur(6px)';
    ctx.fillRect(Math.max(0, minX - 10), Math.max(0, minY - 10), boxW + 20, boxH + 20);
    ctx.restore();

    // Subtle comedic watermark
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.font = 'italic 16px "Comic Neue", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('[ AREA INI SUDAH DIBONGKAR OLEH DATA ENGINEER AI ]', minX + boxW / 2, minY + boxH / 2);
  }

  return restoredCanvas;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
