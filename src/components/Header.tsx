import React from 'react';
import { 
  Download, 
  Copy, 
  RotateCcw, 
  RotateCw, 
  LayoutTemplate, 
  Upload, 
  HelpCircle, 
  Sparkles,
  Layers,
  Check
} from 'lucide-react';

interface HeaderProps {
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
    <header className="h-14 bg-zinc-900/90 border-b border-zinc-800 px-4 flex items-center justify-between select-none z-30 sticky top-0 backdrop-blur-md">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 text-zinc-950 shadow-md shadow-amber-500/20 font-black">
          <span className="text-xl">🖌️</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-black text-lg tracking-tight bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
              Kangtimpa
            </h1>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
              STUDIO
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 -mt-0.5 hidden sm:block">
            Meme Text Replacement & Image Overlay Editor
          </p>
        </div>
      </div>

      {/* Center Actions: Undo / Redo & Template Picker */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Urungkan (Undo) [Ctrl+Z]"
          className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
            canUndo
              ? 'text-zinc-300 hover:text-white hover:bg-zinc-800'
              : 'text-zinc-600 cursor-not-allowed'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Ulangi (Redo) [Ctrl+Y]"
          className={`p-2 rounded-lg transition-colors flex items-center justify-center ${
            canRedo
              ? 'text-zinc-300 hover:text-white hover:bg-zinc-800'
              : 'text-zinc-600 cursor-not-allowed'
          }`}
        >
          <RotateCw className="w-4 h-4" />
        </button>

        <div className="h-5 w-px bg-zinc-800 mx-1 hidden sm:block" />

        <button
          onClick={onOpenTemplates}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/90 hover:bg-zinc-700/90 text-zinc-200 hover:text-white text-xs font-semibold border border-zinc-700/70 transition-all shadow-sm"
        >
          <LayoutTemplate className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">Pilih</span> Template
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
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/90 hover:bg-zinc-700/90 text-zinc-200 hover:text-white text-xs font-semibold border border-zinc-700/70 transition-all shadow-sm"
          title="Upload gambar dari komputer"
        >
          <Upload className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">Ganti</span> Gambar
        </button>

        <button
          onClick={onOpenLayers}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-800/90 hover:bg-zinc-700/90 text-zinc-300 hover:text-white text-xs font-medium border border-zinc-700/70 transition-all relative"
          title="Daftar Layer"
        >
          <Layers className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-[11px] font-bold px-1.5 py-0.2 bg-zinc-700 rounded-full text-zinc-200">
            {layersCount}
          </span>
        </button>
      </div>

      {/* Right Actions: Quick Copy, Export & Shortcuts */}
      <div className="flex items-center gap-2">
        <button
          onClick={onQuickCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-medium border border-zinc-700 transition-all"
          title="Salin hasil langsung ke Clipboard (Ctrl+C)"
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold hidden sm:inline">Disalin!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Salin</span>
            </>
          )}
        </button>

        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Unduh</span>
        </button>

        <button
          onClick={onOpenShortcuts}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors ml-1"
          title="Panduan & Shortcut Keyboard"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
