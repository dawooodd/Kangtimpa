import React from 'react';
import { 
  Download, 
  Copy, 
  RotateCcw, 
  RotateCw, 
  LayoutTemplate, 
  Upload, 
  HelpCircle, 
  Layers,
  Check,
  Cpu,
  Palette
} from 'lucide-react';

interface HeaderProps {
  appMode: 'studio' | 'lab';
  onSetAppMode: (mode: 'studio' | 'lab') => void;
  onOpenTemplates: () => void;
  onOpenExport: () => void;
  onOpenShortcuts: () => void;
  onOpenLayers: () => void;
  onUploadImage: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onQuickCopy: () => void;
  isCopied: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  layersCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  appMode,
  onSetAppMode,
  onOpenTemplates,
  onOpenExport,
  onOpenShortcuts,
  onOpenLayers,
  onUploadImage,
  onQuickCopy,
  isCopied,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  layersCount,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <header className="h-14 bg-zinc-900 border-b border-zinc-800 px-3 md:px-5 flex items-center justify-between select-none z-30 sticky top-0 shrink-0">
      {/* Brand & Identity */}
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500 text-zinc-950 font-black shadow-sm">
          <span className="text-base">🖌️</span>
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <h1 className="font-extrabold text-base tracking-tight text-white">
              Kangtimpa
            </h1>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
              {appMode === 'studio' ? 'STUDIO' : 'LAB ML'}
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 -mt-0.5 hidden sm:block">
            Meme Overlay & ML Detektor
          </span>
        </div>
      </div>

      {/* Mode Switcher Pill */}
      <div className="flex items-center bg-zinc-950 p-0.5 rounded-lg border border-zinc-800">
        <button
          onClick={() => onSetAppMode('studio')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
            appMode === 'studio'
              ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Studio</span>
        </button>

        <button
          onClick={() => onSetAppMode('lab')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
            appMode === 'lab'
              ? 'bg-amber-500 text-zinc-950 font-bold shadow-sm'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Lab ML</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {appMode === 'studio' && (
          <>
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={onUndo}
                disabled={!canUndo}
                title="Undo (Ctrl+Z)"
                className={`p-1.5 rounded-md transition-colors ${
                  canUndo ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-600 cursor-not-allowed'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onRedo}
                disabled={!canRedo}
                title="Redo (Ctrl+Y)"
                className={`p-1.5 rounded-md transition-colors ${
                  canRedo ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-600 cursor-not-allowed'
                }`}
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>

              <div className="h-4 w-px bg-zinc-800 mx-0.5" />
            </div>

            <button
              onClick={onOpenTemplates}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700/80 transition-all flex items-center gap-1.5"
              title="Pilih Template Meme"
            >
              <LayoutTemplate className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Template</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onUploadImage}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700/80 transition-all flex items-center gap-1.5"
              title="Upload Gambar"
            >
              <Upload className="w-3.5 h-3.5 text-zinc-300" />
              <span className="hidden md:inline">Foto</span>
            </button>

            <button
              onClick={onOpenLayers}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700/80 transition-all flex items-center gap-1"
              title="Layer"
            >
              <Layers className="w-3.5 h-3.5 text-zinc-300" />
              <span className="text-[10px] font-bold bg-zinc-700 px-1.5 py-0.2 rounded-full text-zinc-200">
                {layersCount}
              </span>
            </button>

            <button
              onClick={onQuickCopy}
              className="hidden sm:flex p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition-all items-center gap-1"
              title="Salin ke Clipboard"
            >
              {isCopied ? (
                <Check className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-zinc-300" />
              )}
              <span className="hidden lg:inline">{isCopied ? 'Tersalin' : 'Salin'}</span>
            </button>

            <button
              onClick={onOpenExport}
              className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-all flex items-center gap-1 shadow-sm"
              title="Unduh Hasil Meme"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Unduh</span>
            </button>
          </>
        )}

        <button
          onClick={onOpenShortcuts}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          title="Bantuan / Pintasan"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
