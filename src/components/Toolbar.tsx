import React from 'react';
import { 
  MousePointer, 
  Type, 
  Square, 
  Stamp, 
  Paintbrush, 
  Pipette, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Wand2
} from 'lucide-react';
import { ToolMode } from '../types';

interface ToolbarProps {
  currentMode: ToolMode;
  onSetMode: (mode: ToolMode) => void;
  onAddText: () => void;
  onAddPatch: () => void;
  onAddSticker: () => void;
  currentFilter: 'none' | 'meme_boost' | 'deep_fried' | 'photocopy' | 'vintage';
  onSetFilter: (filter: 'none' | 'meme_boost' | 'deep_fried' | 'photocopy' | 'vintage') => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  currentMode,
  onSetMode,
  onAddText,
  onAddPatch,
  onAddSticker,
  currentFilter,
  onSetFilter,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
}) => {
  const [showFilterMenu, setShowFilterMenu] = React.useState(false);

  const filterNames: Record<string, string> = {
    none: 'Normal (Asli)',
    meme_boost: 'Meme Facebook HD',
    deep_fried: 'Deep Fried (Garing)',
    photocopy: 'Fotokopi BW',
    vintage: 'Vintage Nostalgia',
  };

  return (
    <aside className="w-16 bg-zinc-900 border-r border-zinc-800 flex flex-col items-center py-3 gap-2 z-20 select-none shrink-0">
      {/* Primary Tools */}
      <div className="flex flex-col gap-1.5 items-center w-full px-2">
        <button
          onClick={() => onSetMode('select')}
          className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center transition-all ${
            currentMode === 'select'
              ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/25'
              : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
          }`}
          title="Pilih & Pindah Objek (V)"
        >
          <MousePointer className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Pilih</span>
        </button>

        <button
          onClick={onAddText}
          className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center transition-all ${
            currentMode === 'text'
              ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/25'
              : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
          }`}
          title="Tambah Teks Timpaan (T)"
        >
          <Type className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Teks</span>
        </button>

        <button
          onClick={onAddPatch}
          className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center transition-all ${
            currentMode === 'patch'
              ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/25'
              : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
          }`}
          title="Tambah Kotak / Patch Timpa (P)"
        >
          <Square className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Kotak</span>
        </button>

        <button
          onClick={onAddSticker}
          className="w-11 h-11 rounded-xl flex flex-col items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all"
          title="Tambah Cap Stempel / Lencana / Stiker"
        >
          <Stamp className="w-5 h-5 text-red-400" />
          <span className="text-[9px] mt-0.5">Stempel</span>
        </button>

        <button
          onClick={() => onSetMode('brush')}
          className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center transition-all ${
            currentMode === 'brush'
              ? 'bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/25'
              : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
          }`}
          title="Kuas Penutup / Corengan (B)"
        >
          <Paintbrush className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Kuas</span>
        </button>

        <button
          onClick={() => onSetMode('eyedropper')}
          className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center transition-all ${
            currentMode === 'eyedropper'
              ? 'bg-cyan-500 text-zinc-950 font-bold shadow-md shadow-cyan-500/25 animate-pulse'
              : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
          }`}
          title="Pipet Warna (Ambil warna background langsung dari gambar)"
        >
          <Pipette className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Pipet</span>
        </button>
      </div>

      <div className="w-8 h-px bg-zinc-800 my-1" />

      {/* Meme Filters Toggle */}
      <div className="relative">
        <button
          onClick={() => setShowFilterMenu(!showFilterMenu)}
          className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center transition-all ${
            currentFilter !== 'none'
              ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
              : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
          }`}
          title="Efek / Filter Meme"
        >
          <Wand2 className="w-5 h-5" />
          <span className="text-[9px] mt-0.5">Filter</span>
        </button>

        {showFilterMenu && (
          <div className="absolute left-14 top-0 w-48 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl p-1.5 z-50 flex flex-col gap-1">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
              Karakter Meme
            </div>
            {(['none', 'meme_boost', 'deep_fried', 'photocopy', 'vintage'] as const).map(
              (fKey) => (
                <button
                  key={fKey}
                  onClick={() => {
                    onSetFilter(fKey);
                    setShowFilterMenu(false);
                  }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors flex items-center justify-between ${
                    currentFilter === fKey
                      ? 'bg-amber-500/20 text-amber-300 font-bold'
                      : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <span>{filterNames[fKey]}</span>
                  {currentFilter === fKey && <span className="text-amber-400">✓</span>}
                </button>
              )
            )}
          </div>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Zoom Controls */}
      <div className="flex flex-col gap-1 items-center">
        <button
          onClick={onZoomIn}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          title="Perbesar Canvas (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <span className="text-[10px] font-mono text-zinc-400">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={onZoomOut}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          title="Perkecil Canvas (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={onResetZoom}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          title="Sesuaikan ke Layar"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
