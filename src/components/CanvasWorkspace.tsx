import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  EditorLayer, 
  ToolMode, 
  TextLayer, 
  PatchLayer, 
  StickerLayer, 
  BrushStrokeLayer,
  MemeTemplate 
} from '../types';
import { renderLayer, getLayerLocalBounds, applyCanvasFilter } from '../utils/canvasRenderer';
import { rgbToHex } from '../utils/colorUtils';

interface CanvasWorkspaceProps {
  currentTemplate: MemeTemplate | null;
  uploadedImage: HTMLImageElement | null;
  canvasWidth: number;
  canvasHeight: number;
  layers: EditorLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onUpdateLayer: (id: string, updated: Partial<EditorLayer>) => void;
  onAddBrushStroke: (stroke: BrushStrokeLayer) => void;
  toolMode: ToolMode;
  onSetToolMode: (mode: ToolMode) => void;
  eyedropperTarget: string | null;
  onColorPicked: (color: string) => void;
  currentFilter: 'none' | 'meme_boost' | 'deep_fried' | 'photocopy' | 'vintage';
  zoom: number;
  onPasteImage: (file: File) => void;
}

export const CanvasWorkspace: React.FC<CanvasWorkspaceProps> = ({
  currentTemplate,
  uploadedImage,
  canvasWidth,
  canvasHeight,
  layers,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer,
  onAddBrushStroke,
  toolMode,
  onSetToolMode,
  eyedropperTarget,
  onColorPicked,
  currentFilter,
  zoom,
  onPasteImage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Eyedropper hover preview
  const [loupeColor, setLoupeColor] = useState<string>('#ffffff');
  const [loupePos, setLoupePos] = useState<{ x: number; y: number } | null>(null);

  // Interaction drag states
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState<'move' | 'nw' | 'ne' | 'se' | 'sw' | 'rotate' | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; layerX: number; layerY: number; w?: number; h?: number; rot?: number }>({
    x: 0,
    y: 0,
    layerX: 0,
    layerY: 0,
  });

  // Brush drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStrokePoints, setCurrentStrokePoints] = useState<{ x: number; y: number }[]>([]);

  // Clipboard paste listener
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            onPasteImage(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [onPasteImage]);

  // Main Render Loop
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Base (Template or Uploaded Image)
    if (uploadedImage) {
      ctx.drawImage(uploadedImage, 0, 0, canvasWidth, canvasHeight);
    } else if (currentTemplate) {
      currentTemplate.generateBaseCanvas(ctx, canvasWidth, canvasHeight);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    // 2. Draw all layers
    layers.forEach((layer) => {
      renderLayer(ctx, layer, layer.id === selectedLayerId && toolMode === 'select');
    });

    // 3. Draw live brush stroke if actively drawing
    if (isDrawing && currentStrokePoints.length > 1) {
      ctx.save();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(currentStrokePoints[0].x, currentStrokePoints[0].y);
      for (let i = 1; i < currentStrokePoints.length; i++) {
        ctx.lineTo(currentStrokePoints[i].x, currentStrokePoints[i].y);
      }
      ctx.stroke();
      ctx.restore();
    }

    // 4. Apply filter if active
    if (currentFilter !== 'none') {
      applyCanvasFilter(ctx, canvasWidth, canvasHeight, currentFilter);
    }
  }, [
    uploadedImage,
    currentTemplate,
    canvasWidth,
    canvasHeight,
    layers,
    selectedLayerId,
    toolMode,
    isDrawing,
    currentStrokePoints,
    currentFilter,
  ]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  // Coordinate mapper from Mouse or Touch
  const getCanvasCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  // Hit test layers from top to bottom
  const hitTest = (x: number, y: number): { layer: EditorLayer; handle: 'move' | 'nw' | 'ne' | 'se' | 'sw' | 'rotate' } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    if (selectedLayerId) {
      const selectedLayer = layers.find((l) => l.id === selectedLayerId);
      if (selectedLayer && !selectedLayer.locked && !selectedLayer.hidden) {
        const rad = -((selectedLayer.rotation || 0) * Math.PI) / 180;
        const dx = x - selectedLayer.x;
        const dy = y - selectedLayer.y;
        const lx = dx * Math.cos(rad) - dy * Math.sin(rad);
        const ly = dx * Math.sin(rad) + dy * Math.cos(rad);

        const bounds = getLayerLocalBounds(ctx, selectedLayer);

        // Rotation handle
        const rotHandleX = bounds.x + bounds.w / 2;
        const rotHandleY = bounds.y - 24;
        if (Math.hypot(lx - rotHandleX, ly - rotHandleY) <= 18) {
          return { layer: selectedLayer, handle: 'rotate' };
        }

        // Resize handles for patch and sticker
        if (selectedLayer.type === 'patch' || selectedLayer.type === 'sticker') {
          const handles: { h: 'nw' | 'ne' | 'se' | 'sw'; px: number; py: number }[] = [
            { h: 'nw', px: bounds.x, py: bounds.y },
            { h: 'ne', px: bounds.x + bounds.w, py: bounds.y },
            { h: 'se', px: bounds.x + bounds.w, py: bounds.y + bounds.h },
            { h: 'sw', px: bounds.x, py: bounds.y + bounds.h },
          ];
          for (const hand of handles) {
            if (Math.hypot(lx - hand.px, ly - hand.py) <= 18) {
              return { layer: selectedLayer, handle: hand.h };
            }
          }
        }
      }
    }

    // Elements hit test
    for (let i = layers.length - 1; i >= 0; i--) {
      const layer = layers[i];
      if (layer.locked || layer.hidden) continue;

      const rad = -((layer.rotation || 0) * Math.PI) / 180;
      const dx = x - layer.x;
      const dy = y - layer.y;
      const lx = dx * Math.cos(rad) - dy * Math.sin(rad);
      const ly = dx * Math.sin(rad) + dy * Math.cos(rad);

      const bounds = getLayerLocalBounds(ctx, layer);
      const pad = 12;
      if (
        lx >= bounds.x - pad &&
        lx <= bounds.x + bounds.w + pad &&
        ly >= bounds.y - pad &&
        ly <= bounds.y + bounds.h + pad
      ) {
        return { layer, handle: 'move' };
      }
    }

    return null;
  };

  // Pointer Down (Mouse or Touch)
  const handlePointerDown = (clientX: number, clientY: number) => {
    const coords = getCanvasCoords(clientX, clientY);

    if (toolMode === 'eyedropper') {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const p = ctx.getImageData(Math.floor(coords.x), Math.floor(coords.y), 1, 1).data;
          const hex = rgbToHex(p[0], p[1], p[2]);
          onColorPicked(hex);
          onSetToolMode('select');
        }
      }
      return;
    }

    if (toolMode === 'brush') {
      setIsDrawing(true);
      setCurrentStrokePoints([coords]);
      return;
    }

    const hit = hitTest(coords.x, coords.y);
    if (hit) {
      onSelectLayer(hit.layer.id);
      setIsDragging(true);
      setDragHandle(hit.handle);

      const bounds = canvasRef.current
        ? getLayerLocalBounds(canvasRef.current.getContext('2d')!, hit.layer)
        : { w: 100, h: 100 };

      setDragStart({
        x: coords.x,
        y: coords.y,
        layerX: hit.layer.x,
        layerY: hit.layer.y,
        w: hit.layer.type === 'patch' ? (hit.layer as PatchLayer).width : (hit.layer as StickerLayer).width || bounds.w,
        h: hit.layer.type === 'patch' ? (hit.layer as PatchLayer).height : (hit.layer as StickerLayer).height || bounds.h,
        rot: hit.layer.rotation || 0,
      });
    } else {
      onSelectLayer(null);
    }
  };

  // Pointer Move (Mouse or Touch)
  const handlePointerMove = (clientX: number, clientY: number) => {
    const coords = getCanvasCoords(clientX, clientY);

    if (toolMode === 'eyedropper') {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const p = ctx.getImageData(
            Math.max(0, Math.min(canvas.width - 1, Math.floor(coords.x))),
            Math.max(0, Math.min(canvas.height - 1, Math.floor(coords.y))),
            1,
            1
          ).data;
          setLoupeColor(rgbToHex(p[0], p[1], p[2]));
          setLoupePos({ x: clientX, y: clientY });
        }
      }
      return;
    } else {
      if (loupePos) setLoupePos(null);
    }

    if (isDrawing && toolMode === 'brush') {
      setCurrentStrokePoints((prev) => [...prev, coords]);
      return;
    }

    if (isDragging && selectedLayerId && dragHandle) {
      const activeLayer = layers.find((l) => l.id === selectedLayerId);
      if (!activeLayer) return;

      const dx = coords.x - dragStart.x;
      const dy = coords.y - dragStart.y;

      if (dragHandle === 'move') {
        onUpdateLayer(selectedLayerId, {
          x: Math.round(dragStart.layerX + dx),
          y: Math.round(dragStart.layerY + dy),
        });
      } else if (dragHandle === 'rotate') {
        const angleRad = Math.atan2(coords.y - activeLayer.y, coords.x - activeLayer.x);
        let deg = Math.round((angleRad * 180) / Math.PI + 90);
        if (deg > 180) deg -= 360;
        if (deg < -180) deg += 360;
        onUpdateLayer(selectedLayerId, { rotation: deg });
      } else if (dragHandle === 'se' && (activeLayer.type === 'patch' || activeLayer.type === 'sticker')) {
        const newW = Math.max(20, Math.round((dragStart.w || 50) + dx));
        const newH = Math.max(20, Math.round((dragStart.h || 50) + dy));
        onUpdateLayer(selectedLayerId, { width: newW, height: newH });
      }
    }
  };

  const handlePointerUp = () => {
    if (isDrawing && toolMode === 'brush' && currentStrokePoints.length > 1) {
      const newStroke: BrushStrokeLayer = {
        id: `brush-${Date.now()}`,
        type: 'brush_stroke',
        points: currentStrokePoints,
        color: '#f59e0b',
        size: 14,
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
      };
      onAddBrushStroke(newStroke);
    }
    setIsDrawing(false);
    setCurrentStrokePoints([]);
    setIsDragging(false);
    setDragHandle(null);
  };

  // Drag and Drop Image files into Canvas
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onPasteImage(file);
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="flex-1 bg-zinc-950 canvas-checkerboard relative overflow-auto flex items-center justify-center p-3 md:p-6 pb-20 md:pb-6 select-none"
      style={{
        cursor:
          toolMode === 'eyedropper'
            ? 'crosshair'
            : toolMode === 'brush'
            ? 'crosshair'
            : isDragging
            ? 'grabbing'
            : 'default',
      }}
    >
      {/* Eyedropper Magnifier Preview */}
      {toolMode === 'eyedropper' && loupePos && (
        <div
          className="fixed pointer-events-none z-50 flex items-center gap-2 transform -translate-x-1/2 -translate-y-16"
          style={{ left: loupePos.x, top: loupePos.y }}
        >
          <div
            className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
            style={{ backgroundColor: loupeColor }}
          />
          <span className="bg-black text-white font-mono text-[11px] px-2 py-0.5 rounded shadow border border-zinc-700">
            {loupeColor}
          </span>
        </div>
      )}

      {/* Main Canvas with Zoom Scale */}
      <div
        className="transition-transform duration-75 shadow-2xl rounded-sm overflow-hidden"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          // Mouse events
          onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
          onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          // Touch events for mobile phones
          onTouchStart={(e) => {
            if (e.touches.length === 1) {
              handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          onTouchMove={(e) => {
            if (e.touches.length === 1) {
              handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
            }
          }}
          onTouchEnd={handlePointerUp}
          className="block bg-zinc-900 shadow-2xl touch-none"
        />
      </div>
    </div>
  );
};
