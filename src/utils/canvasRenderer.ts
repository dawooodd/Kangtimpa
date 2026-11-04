import { EditorLayer, PatchLayer, TextLayer, StickerLayer, BrushStrokeLayer } from '../types';

export function renderLayer(
  ctx: CanvasRenderingContext2D,
  layer: EditorLayer,
  isSelected: boolean = false
) {
  if (layer.hidden) return;

  ctx.save();
  ctx.globalAlpha = layer.opacity ?? 1;

  // Apply layer transform (translation and rotation)
  ctx.translate(layer.x, layer.y);
  if (layer.rotation) {
    ctx.rotate((layer.rotation * Math.PI) / 180);
  }

  switch (layer.type) {
    case 'patch':
      renderPatch(ctx, layer as PatchLayer);
      break;
    case 'text':
      renderText(ctx, layer as TextLayer);
      break;
    case 'sticker':
      renderSticker(ctx, layer as StickerLayer);
      break;
    case 'brush_stroke':
      renderBrushStroke(ctx, layer as BrushStrokeLayer);
      break;
  }

  // Draw selection bounding outline and resize/rotate handles if selected
  if (isSelected) {
    drawSelectionBox(ctx, layer);
  }

  ctx.restore();
}

function renderPatch(ctx: CanvasRenderingContext2D, patch: PatchLayer) {
  ctx.save();
  if (patch.blur > 0) {
    ctx.filter = `blur(${patch.blur}px)`;
  }

  ctx.fillStyle = patch.fillColor;
  ctx.strokeStyle = patch.borderColor;
  ctx.lineWidth = patch.borderWidth;

  const w = patch.width;
  const h = patch.height;

  if (patch.shape === 'ellipse') {
    ctx.beginPath();
    ctx.ellipse(w / 2, h / 2, Math.max(1, w / 2), Math.max(1, h / 2), 0, 0, Math.PI * 2);
    ctx.fill();
    if (patch.borderWidth > 0) ctx.stroke();
  } else if (patch.shape === 'rounded' || patch.borderRadius > 0) {
    const r = Math.min(patch.borderRadius || 12, w / 2, h / 2);
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, r);
    ctx.fill();
    if (patch.borderWidth > 0) ctx.stroke();
  } else {
    ctx.fillRect(0, 0, w, h);
    if (patch.borderWidth > 0) {
      ctx.strokeRect(0, 0, w, h);
    }
  }

  ctx.restore();
}

function renderText(ctx: CanvasRenderingContext2D, textLayer: TextLayer) {
  const text = textLayer.uppercase ? textLayer.text.toUpperCase() : textLayer.text;
  const lines = text.split('\n');
  const fontSize = textLayer.fontSize;
  const lineHeight = fontSize * 1.18;

  const fontStyle = `${textLayer.bold ? 'bold ' : ''}${textLayer.italic ? 'italic ' : ''}`;
  ctx.font = `${fontStyle}${fontSize}px "${textLayer.fontFamily}", sans-serif`;

  // Compute text bounds
  let maxWidth = 0;
  lines.forEach((line) => {
    const metrics = ctx.measureText(line);
    if (metrics.width > maxWidth) maxWidth = metrics.width;
  });

  const totalHeight = lines.length * lineHeight;

  // Background box if set
  if (textLayer.backgroundColor && textLayer.backgroundColor !== 'transparent') {
    const pad = textLayer.backgroundPadding || 6;
    const rad = textLayer.backgroundBorderRadius || 4;
    ctx.fillStyle = textLayer.backgroundColor;

    let bgX = 0;
    if (textLayer.align === 'center') bgX = -maxWidth / 2 - pad;
    else if (textLayer.align === 'right') bgX = -maxWidth - pad;
    else bgX = -pad;

    const bgY = -fontSize * 0.85 - pad;
    const bgW = maxWidth + pad * 2;
    const bgH = totalHeight + pad * 2;

    ctx.beginPath();
    ctx.roundRect(bgX, bgY, bgW, bgH, rad);
    ctx.fill();
  }

  // Text Shadow
  if (textLayer.shadowColor && textLayer.shadowBlur > 0) {
    ctx.shadowColor = textLayer.shadowColor;
    ctx.shadowBlur = textLayer.shadowBlur;
    ctx.shadowOffsetX = textLayer.shadowOffsetX || 0;
    ctx.shadowOffsetY = textLayer.shadowOffsetY || 0;
  }

  ctx.textAlign = textLayer.align;
  ctx.textBaseline = 'alphabetic';

  lines.forEach((line, index) => {
    const yOffset = index * lineHeight;

    // Stroke (Outline)
    if (textLayer.strokeWidth > 0 && textLayer.strokeColor) {
      ctx.lineWidth = textLayer.strokeWidth * 2; // double since stroke is centered
      ctx.strokeStyle = textLayer.strokeColor;
      ctx.lineJoin = 'miter';
      ctx.miterLimit = 2;
      ctx.strokeText(line, 0, yOffset);
    }

    // Fill
    ctx.fillStyle = textLayer.fillColor;
    ctx.fillText(line, 0, yOffset);
  });
}

function renderSticker(ctx: CanvasRenderingContext2D, sticker: StickerLayer) {
  const w = sticker.width;
  const h = sticker.height;

  if (sticker.stickerType === 'stamp') {
    // Red or custom color vintage stamp
    const stampColor = sticker.badgeColor || '#dc2626';
    ctx.strokeStyle = stampColor;
    ctx.fillStyle = stampColor;
    ctx.lineWidth = 4;

    // Distressed rounded box
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 10);
    ctx.stroke();

    ctx.lineWidth = 1.5;
    ctx.strokeRect(5, 5, w - 10, h - 10);

    ctx.font = `bold ${Math.round(h * 0.32)}px "Anton", "Impact", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sticker.content || 'DISETUJUI KANG TIMPA', w / 2, h / 2);
  } else if (sticker.stickerType === 'redaction') {
    // Censored black bar
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);

    // Hazard stripes edge
    ctx.fillStyle = '#ffffff';
    ctx.font = `900 ${Math.round(h * 0.55)}px "Impact", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sticker.content || '[SENSOR]', w / 2, h / 2);
  } else if (sticker.stickerType === 'badge') {
    // Official Badge with shield/ribbon look
    const col = sticker.badgeColor || '#2563eb';
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 8);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(3, 3, w - 6, h - 6);

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.round(h * 0.36)}px "Inter", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sticker.content || '★ KANG TIMPA VERIFIED ★', w / 2, h / 2);
  } else if (sticker.stickerType === 'speech_bubble') {
    // Comic speech balloon
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.roundRect(0, 0, w, h - 18, 16);
    ctx.fill();
    ctx.stroke();

    // Tail
    ctx.beginPath();
    ctx.moveTo(w * 0.3, h - 18);
    ctx.lineTo(w * 0.2, h);
    ctx.lineTo(w * 0.45, h - 18);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.stroke();

    // Overlay to erase overlap line
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(w * 0.3 + 1, h - 21, w * 0.15 - 2, 6);

    // Bubble Text
    ctx.fillStyle = '#000000';
    ctx.font = `bold ${Math.round((h - 18) * 0.32)}px "Comic Neue", cursive`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sticker.content || '...', w / 2, (h - 18) / 2);
  } else {
    // Emoji
    ctx.font = `${Math.min(w, h) * 0.85}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sticker.content, w / 2, h / 2);
  }
}

function renderBrushStroke(ctx: CanvasRenderingContext2D, stroke: BrushStrokeLayer) {
  if (stroke.points.length < 2) return;
  ctx.save();
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.size;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

  for (let i = 1; i < stroke.points.length; i++) {
    ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
  }
  ctx.stroke();
  ctx.restore();
}

function drawSelectionBox(ctx: CanvasRenderingContext2D, layer: EditorLayer) {
  const bounds = getLayerLocalBounds(ctx, layer);

  // Outer dashed outline
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);
  ctx.strokeRect(bounds.x - 4, bounds.y - 4, bounds.w + 8, bounds.h + 8);
  ctx.setLineDash([]);

  // Handles
  const handleSize = 8;
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 2;

  const points = [
    [bounds.x - 4, bounds.y - 4], // top-left
    [bounds.x + bounds.w + 4, bounds.y - 4], // top-right
    [bounds.x + bounds.w + 4, bounds.y + bounds.h + 4], // bottom-right
    [bounds.x - 4, bounds.y + bounds.h + 4], // bottom-left
  ];

  points.forEach(([px, py]) => {
    ctx.fillRect(px - handleSize / 2, py - handleSize / 2, handleSize, handleSize);
    ctx.strokeRect(px - handleSize / 2, py - handleSize / 2, handleSize, handleSize);
  });

  // Rotation stick handle
  ctx.beginPath();
  ctx.moveTo(bounds.x + bounds.w / 2, bounds.y - 4);
  ctx.lineTo(bounds.x + bounds.w / 2, bounds.y - 24);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(bounds.x + bounds.w / 2, bounds.y - 24, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#38bdf8';
  ctx.fill();
  ctx.stroke();
}

export function getLayerLocalBounds(
  ctx: CanvasRenderingContext2D,
  layer: EditorLayer
): { x: number; y: number; w: number; h: number } {
  if (layer.type === 'patch') {
    const patch = layer as PatchLayer;
    return { x: 0, y: 0, w: patch.width, h: patch.height };
  } else if (layer.type === 'sticker') {
    const sticker = layer as StickerLayer;
    return { x: 0, y: 0, w: sticker.width, h: sticker.height };
  } else if (layer.type === 'brush_stroke') {
    const stroke = layer as BrushStrokeLayer;
    if (stroke.points.length === 0) return { x: 0, y: 0, w: 20, h: 20 };
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    stroke.points.forEach(p => {
      if (p.x < minX) minX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.x > maxX) maxX = p.x;
      if (p.y > maxY) maxY = p.y;
    });
    const pad = stroke.size / 2;
    return { x: minX - pad, y: minY - pad, w: (maxX - minX) + pad * 2, h: (maxY - minY) + pad * 2 };
  } else {
    const textLayer = layer as TextLayer;
    const text = textLayer.uppercase ? textLayer.text.toUpperCase() : textLayer.text;
    const lines = text.split('\n');
    const fontSize = textLayer.fontSize;
    const lineHeight = fontSize * 1.18;

    const fontStyle = `${textLayer.bold ? 'bold ' : ''}${textLayer.italic ? 'italic ' : ''}`;
    ctx.font = `${fontStyle}${fontSize}px "${textLayer.fontFamily}", sans-serif`;

    let maxWidth = 0;
    lines.forEach((line) => {
      const metrics = ctx.measureText(line);
      if (metrics.width > maxWidth) maxWidth = metrics.width;
    });

    const totalHeight = lines.length * lineHeight;
    let localX = 0;
    if (textLayer.align === 'center') localX = -maxWidth / 2;
    else if (textLayer.align === 'right') localX = -maxWidth;

    const localY = -fontSize * 0.85;
    return { x: localX, y: localY, w: maxWidth, h: totalHeight };
  }
}

/**
 * Apply meme visual filters directly on canvas pixel data
 */
export function applyCanvasFilter(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  filter: 'none' | 'meme_boost' | 'deep_fried' | 'photocopy' | 'vintage'
) {
  if (filter === 'none') return;

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  if (filter === 'meme_boost') {
    // Slightly oversaturate and contrast boost like Facebook reposts
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // Contrast
      r = (r - 128) * 1.25 + 128;
      g = (g - 128) * 1.25 + 128;
      b = (b - 128) * 1.25 + 128;

      data[i] = Math.min(255, Math.max(0, r));
      data[i + 1] = Math.min(255, Math.max(0, g));
      data[i + 2] = Math.min(255, Math.max(0, b));
    }
  } else if (filter === 'deep_fried') {
    // Extreme saturation, blown out highlights, classic deep fry meme
    for (let i = 0; i < data.length; i += 4) {
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];

      // Exaggerate reds and yellows
      r = (r - 128) * 2.2 + 150;
      g = (g - 128) * 1.8 + 120;
      b = (b - 128) * 0.8 + 70;

      data[i] = Math.min(255, Math.max(0, r));
      data[i + 1] = Math.min(255, Math.max(0, g));
      data[i + 2] = Math.min(255, Math.max(0, b));
    }
  } else if (filter === 'photocopy') {
    // Black and white photocopy look
    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      const threshold = gray > 135 ? 255 : (gray < 75 ? 0 : 120);
      data[i] = threshold;
      data[i + 1] = threshold;
      data[i + 2] = threshold;
    }
  } else if (filter === 'vintage') {
    // Warm sepia nostalgia
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
      data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
      data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
    }
  }

  ctx.putImageData(imgData, 0, 0);
}
