import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { CanvasWorkspace } from './components/CanvasWorkspace';
import { TextPropertiesPanel } from './components/TextPropertiesPanel';
import { PatchPropertiesPanel } from './components/PatchPropertiesPanel';
import { StickerPropertiesPanel } from './components/StickerPropertiesPanel';
import { TemplateModal } from './components/TemplateModal';
import { ExportModal } from './components/ExportModal';
import { LayerListModal } from './components/LayerListModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { DataEngineeringLab } from './components/DataEngineeringLab';
import { MEME_TEMPLATES } from './utils/templates';
import { 
  EditorLayer, 
  TextLayer, 
  PatchLayer, 
  StickerLayer, 
  BrushStrokeLayer, 
  ToolMode, 
  MemeTemplate 
} from './types';
import { renderLayer, applyCanvasFilter } from './utils/canvasRenderer';

export const App: React.FC = () => {
  // App Mode: 'studio' (Meme Editor) vs 'lab' (Data Engineering & ML Forensic Lab)
  const [appMode, setAppMode] = useState<'studio' | 'lab'>('studio');

  // Current Template or Uploaded Image
  const [currentTemplate, setCurrentTemplate] = useState<MemeTemplate>(MEME_TEMPLATES[0]);
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);

  // Canvas Dimensions
  const [canvasWidth, setCanvasWidth] = useState<number>(1280);
  const [canvasHeight, setCanvasHeight] = useState<number>(720);

  // Layers & Selection
  const [layers, setLayers] = useState<EditorLayer[]>(() => {
    return (MEME_TEMPLATES[0].initialLayers as EditorLayer[]) || [];
  });
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  // Undo / Redo History
  const [history, setHistory] = useState<EditorLayer[][]>([
    (MEME_TEMPLATES[0].initialLayers as EditorLayer[]) || [],
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Active Tool Mode
  const [toolMode, setToolMode] = useState<ToolMode>('select');
  const [currentFilter, setCurrentFilter] = useState<'none' | 'meme_boost' | 'deep_fried' | 'photocopy' | 'vintage'>('none');
  const [zoom, setZoom] = useState<number>(0.85);

  // Modals
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isLayersModalOpen, setIsLayersModalOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
  const [isQuickCopied, setIsQuickCopied] = useState(false);

  // Eyedropper target tracking
  const [eyedropperTarget, setEyedropperTarget] = useState<string | null>(null);

  // Save history snapshot
  const pushHistory = useCallback((newLayers: EditorLayer[]) => {
    setHistory((prev) => {
      const upToCurrent = prev.slice(0, historyIndex + 1);
      return [...upToCurrent, newLayers];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      setLayers(history[prevIdx]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setLayers(history[nextIdx]);
    }
  };

  // Add Layer Helpers
  const handleAddText = () => {
    const newText: TextLayer = {
      id: `text-${Date.now()}`,
      type: 'text',
      x: Math.round(canvasWidth / 2),
      y: Math.round(canvasHeight / 2),
      rotation: 0,
      opacity: 1,
      text: 'TEKS TIMPAAN DISINI',
      fontSize: 48,
      fontFamily: 'Impact',
      fillColor: '#ffffff',
      strokeColor: '#000000',
      strokeWidth: 4,
      backgroundColor: '',
      backgroundPadding: 6,
      backgroundBorderRadius: 4,
      align: 'center',
      bold: true,
      italic: false,
      uppercase: true,
      shadowColor: 'rgba(0,0,0,0.7)',
      shadowBlur: 6,
      shadowOffsetX: 2,
      shadowOffsetY: 2,
    };
    const updated = [...layers, newText];
    setLayers(updated);
    setSelectedLayerId(newText.id);
    setToolMode('select');
    pushHistory(updated);
  };

  const handleAddPatch = () => {
    const newPatch: PatchLayer = {
      id: `patch-${Date.now()}`,
      type: 'patch',
      x: Math.round(canvasWidth / 2 - 150),
      y: Math.round(canvasHeight / 2 - 50),
      rotation: 0,
      opacity: 1,
      width: 300,
      height: 100,
      shape: 'rect',
      fillColor: '#ffffff',
      borderColor: '#000000',
      borderWidth: 0,
      borderRadius: 8,
      blur: 0,
    };
    const updated = [...layers, newPatch];
    setLayers(updated);
    setSelectedLayerId(newPatch.id);
    setToolMode('select');
    pushHistory(updated);
  };

  const handleAddSticker = () => {
    const newSticker: StickerLayer = {
      id: `sticker-${Date.now()}`,
      type: 'sticker',
      stickerType: 'stamp',
      content: 'DISETUJUI KANG TIMPA',
      badgeColor: '#dc2626',
      x: Math.round(canvasWidth / 2 - 100),
      y: Math.round(canvasHeight / 2 - 40),
      rotation: -10,
      opacity: 0.95,
      width: 200,
      height: 80,
    };
    const updated = [...layers, newSticker];
    setLayers(updated);
    setSelectedLayerId(newSticker.id);
    setToolMode('select');
    pushHistory(updated);
  };

  const handleAddBrushStroke = (stroke: BrushStrokeLayer) => {
    const updated = [...layers, stroke];
    setLayers(updated);
    pushHistory(updated);
  };

  // Layer Modification
  const handleUpdateLayer = (id: string, updatedProps: Partial<EditorLayer>) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? ({ ...l, ...updatedProps } as EditorLayer) : l))
    );
  };

  const handleCommitLayerUpdate = () => {
    pushHistory(layers);
  };

  const handleDeleteLayer = (id: string) => {
    const updated = layers.filter((l) => l.id !== id);
    setLayers(updated);
    if (selectedLayerId === id) setSelectedLayerId(null);
    pushHistory(updated);
  };

  const handleDuplicateLayer = (id: string) => {
    const target = layers.find((l) => l.id === id);
    if (!target) return;
    const duplicated: EditorLayer = {
      ...JSON.parse(JSON.stringify(target)),
      id: `${target.type}-${Date.now()}`,
      x: target.x + 20,
      y: target.y + 20,
    };
    const updated = [...layers, duplicated];
    setLayers(updated);
    setSelectedLayerId(duplicated.id);
    pushHistory(updated);
  };

  const handleMoveLayerUp = (id: string) => {
    const idx = layers.findIndex((l) => l.id === id);
    if (idx === -1 || idx === layers.length - 1) return;
    const updated = [...layers];
    const temp = updated[idx];
    updated[idx] = updated[idx + 1];
    updated[idx + 1] = temp;
    setLayers(updated);
    pushHistory(updated);
  };

  const handleMoveLayerDown = (id: string) => {
    const idx = layers.findIndex((l) => l.id === id);
    if (idx <= 0) return;
    const updated = [...layers];
    const temp = updated[idx];
    updated[idx] = updated[idx - 1];
    updated[idx - 1] = temp;
    setLayers(updated);
    pushHistory(updated);
  };

  const handleToggleHide = (id: string) => {
    const updated = layers.map((l) => (l.id === id ? { ...l, hidden: !l.hidden } : l));
    setLayers(updated);
    pushHistory(updated);
  };

  const handleToggleLock = (id: string) => {
    const updated = layers.map((l) => (l.id === id ? { ...l, locked: !l.locked } : l));
    setLayers(updated);
    pushHistory(updated);
  };

  // Eyedropper Trigger from Properties Panel
  const handleTriggerEyedropper = (targetProp: string) => {
    setEyedropperTarget(targetProp);
    setToolMode('eyedropper');
  };

  const handleColorPicked = (color: string) => {
    if (selectedLayerId && eyedropperTarget) {
      handleUpdateLayer(selectedLayerId, { [eyedropperTarget]: color });
      handleCommitLayerUpdate();
    }
    setEyedropperTarget(null);
  };

  // Template switch
  const handleSelectTemplate = (template: MemeTemplate) => {
    setCurrentTemplate(template);
    setUploadedImage(null);

    // Aspect ratio canvas size
    let w = 1280;
    let h = 720;
    if (template.aspectRatio === '1:1') {
      w = 1000;
      h = 1000;
    } else if (template.aspectRatio === '9:16') {
      w = 720;
      h = 1280;
    } else if (template.aspectRatio === '4:3') {
      w = 1000;
      h = 750;
    }
    setCanvasWidth(w);
    setCanvasHeight(h);

    const initial = (template.initialLayers as EditorLayer[]) || [];
    setLayers(initial);
    setSelectedLayerId(null);
    setHistory([initial]);
    setHistoryIndex(0);
  };

  // Handle Image Upload
  const handleLoadImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setUploadedImage(img);
        setCanvasWidth(img.width);
        setCanvasHeight(img.height);
        const targetZoom = Math.min(1, Math.min(900 / img.width, 600 / img.height));
        setZoom(Math.max(0.2, targetZoom));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleLoadImageFile(e.target.files[0]);
    }
  };

  // Export & Copy Helpers
  const generateExportDataUrl = useCallback(
    (format: 'image/png' | 'image/jpeg', quality: number): string => {
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = canvasWidth;
      exportCanvas.height = canvasHeight;
      const ctx = exportCanvas.getContext('2d');
      if (!ctx) return '';

      // 1. Draw base
      if (uploadedImage) {
        ctx.drawImage(uploadedImage, 0, 0, canvasWidth, canvasHeight);
      } else if (currentTemplate) {
        currentTemplate.generateBaseCanvas(ctx, canvasWidth, canvasHeight);
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }

      // 2. Draw all layers without selection highlights
      layers.forEach((l) => renderLayer(ctx, l, false));

      // 3. Filter
      if (currentFilter !== 'none') {
        applyCanvasFilter(ctx, canvasWidth, canvasHeight, currentFilter);
      }

      return exportCanvas.toDataURL(format, quality);
    },
    [canvasWidth, canvasHeight, uploadedImage, currentTemplate, layers, currentFilter]
  );

  const getStudioRenderedCanvas = useCallback((): HTMLCanvasElement | null => {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvasWidth;
    exportCanvas.height = canvasHeight;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return null;

    if (uploadedImage) {
      ctx.drawImage(uploadedImage, 0, 0, canvasWidth, canvasHeight);
    } else if (currentTemplate) {
      currentTemplate.generateBaseCanvas(ctx, canvasWidth, canvasHeight);
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    layers.forEach((l) => renderLayer(ctx, l, false));

    if (currentFilter !== 'none') {
      applyCanvasFilter(ctx, canvasWidth, canvasHeight, currentFilter);
    }

    return exportCanvas;
  }, [canvasWidth, canvasHeight, uploadedImage, currentTemplate, layers, currentFilter]);

  const handleQuickCopy = async () => {
    const url = generateExportDataUrl('image/png', 1.0);
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      setIsQuickCopied(true);
      setTimeout(() => setIsQuickCopied(false), 2000);
    } catch {
      navigator.clipboard.writeText(url);
      setIsQuickCopied(true);
      setTimeout(() => setIsQuickCopied(false), 2000);
    }
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedLayerId) {
          e.preventDefault();
          handleDeleteLayer(selectedLayerId);
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }

      if (e.key === 'Escape') {
        setSelectedLayerId(null);
        setToolMode('select');
      }

      if (e.key.toLowerCase() === 'v') setToolMode('select');
      if (e.key.toLowerCase() === 't') handleAddText();
      if (e.key.toLowerCase() === 'p') handleAddPatch();
      if (e.key.toLowerCase() === 'b') setToolMode('brush');

      if (selectedLayerId && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        setLayers((prev) =>
          prev.map((l) => {
            if (l.id !== selectedLayerId) return l;
            let nx = l.x;
            let ny = l.y;
            if (e.key === 'ArrowUp') ny -= step;
            if (e.key === 'ArrowDown') ny += step;
            if (e.key === 'ArrowLeft') nx -= step;
            if (e.key === 'ArrowRight') nx += step;
            return { ...l, x: nx, y: ny };
          })
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLayerId, layers, historyIndex, history]);

  // Handle transfer from ML Lab to Studio
  const handleSendFromLabToStudio = (img: HTMLImageElement) => {
    setUploadedImage(img);
    setCanvasWidth(img.width);
    setCanvasHeight(img.height);
    // Clear old layers since user is now editing the inpainted/analyzed base
    setLayers([]);
    setSelectedLayerId(null);
    setHistory([[]]);
    setHistoryIndex(0);
    setAppMode('studio');
  };

  const activeLayer = layers.find((l) => l.id === selectedLayerId);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-zinc-950 text-zinc-100 font-sans">
      {/* Header */}
      <Header
        appMode={appMode}
        onSetAppMode={setAppMode}
        onOpenTemplates={() => setIsTemplateModalOpen(true)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
        onOpenLayers={() => setIsLayersModalOpen(true)}
        onUploadImage={handleUploadImage}
        onQuickCopy={handleQuickCopy}
        isCopied={isQuickCopied}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        layersCount={layers.length}
      />

      {/* Main Workspace Body */}
      {appMode === 'studio' ? (
        <div className="flex-1 flex overflow-hidden relative">
          {/* Left Toolbar */}
          <Toolbar
            currentMode={toolMode}
            onSetMode={setToolMode}
            onAddText={handleAddText}
            onAddPatch={handleAddPatch}
            onAddSticker={handleAddSticker}
            currentFilter={currentFilter}
            onSetFilter={setCurrentFilter}
            zoom={zoom}
            onZoomIn={() => setZoom((z) => Math.min(2.5, z + 0.15))}
            onZoomOut={() => setZoom((z) => Math.max(0.2, z - 0.15))}
            onResetZoom={() => setZoom(0.85)}
            onOpenLab={() => setAppMode('lab')}
          />

          {/* Central Canvas Workspace */}
          <CanvasWorkspace
            currentTemplate={currentTemplate}
            uploadedImage={uploadedImage}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            layers={layers}
            selectedLayerId={selectedLayerId}
            onSelectLayer={setSelectedLayerId}
            onUpdateLayer={handleUpdateLayer}
            onAddBrushStroke={handleAddBrushStroke}
            toolMode={toolMode}
            onSetToolMode={setToolMode}
            eyedropperTarget={eyedropperTarget}
            onColorPicked={handleColorPicked}
            currentFilter={currentFilter}
            zoom={zoom}
            onPasteImage={handleLoadImageFile}
          />

          {/* Right Properties Panel based on active layer */}
          {activeLayer && activeLayer.type === 'text' && (
            <TextPropertiesPanel
              layer={activeLayer as TextLayer}
              onChange={(upd) => handleUpdateLayer(activeLayer.id, upd)}
              onDelete={() => handleDeleteLayer(activeLayer.id)}
              onDuplicate={() => handleDuplicateLayer(activeLayer.id)}
              onBringForward={() => handleMoveLayerUp(activeLayer.id)}
              onSendBackward={() => handleMoveLayerDown(activeLayer.id)}
              onTriggerEyedropper={handleTriggerEyedropper}
            />
          )}

          {activeLayer && activeLayer.type === 'patch' && (
            <PatchPropertiesPanel
              layer={activeLayer as PatchLayer}
              onChange={(upd) => handleUpdateLayer(activeLayer.id, upd)}
              onDelete={() => handleDeleteLayer(activeLayer.id)}
              onDuplicate={() => handleDuplicateLayer(activeLayer.id)}
              onBringForward={() => handleMoveLayerUp(activeLayer.id)}
              onSendBackward={() => handleMoveLayerDown(activeLayer.id)}
              onTriggerEyedropper={handleTriggerEyedropper}
            />
          )}

          {activeLayer && activeLayer.type === 'sticker' && (
            <StickerPropertiesPanel
              layer={activeLayer as StickerLayer}
              onChange={(upd) => handleUpdateLayer(activeLayer.id, upd)}
              onDelete={() => handleDeleteLayer(activeLayer.id)}
              onDuplicate={() => handleDuplicateLayer(activeLayer.id)}
              onBringForward={() => handleMoveLayerUp(activeLayer.id)}
              onSendBackward={() => handleMoveLayerDown(activeLayer.id)}
            />
          )}
        </div>
      ) : (
        /* Data Engineering & ML Forensic Lab */
        <DataEngineeringLab
          currentStudioCanvas={getStudioRenderedCanvas()}
          onSendToStudio={handleSendFromLabToStudio}
          onClose={() => setAppMode('studio')}
        />
      )}

      {/* Modals */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
        currentTemplateId={currentTemplate.id}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        getExportDataUrl={generateExportDataUrl}
        width={canvasWidth}
        height={canvasHeight}
      />

      <LayerListModal
        isOpen={isLayersModalOpen}
        onClose={() => setIsLayersModalOpen(false)}
        layers={layers}
        selectedLayerId={selectedLayerId}
        onSelectLayer={setSelectedLayerId}
        onToggleHide={handleToggleHide}
        onToggleLock={handleToggleLock}
        onDeleteLayer={handleDeleteLayer}
        onDuplicateLayer={handleDuplicateLayer}
        onMoveUp={handleMoveLayerUp}
        onMoveDown={handleMoveLayerDown}
      />

      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />
    </div>
  );
};

export default App;
