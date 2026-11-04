import React from 'react';
import { Trash2, Copy, X } from 'lucide-react';
import { StickerLayer } from '../types';

interface StickerPropertiesPanelProps {
  layer: StickerLayer;
  onChange: (updated: Partial<StickerLayer>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onClose?: () => void;
}

const STAMP_PRESETS = [
  'DISETUJUI KANG TIMPA',
  '100% ASLI TIMPA',
  'MEME HALAL',
  'TIDAK HOAKS (NYATA)',
  'LULUS SENSOR',
];

export const StickerPropertiesPanel: React.FC<StickerPropertiesPanelProps> = ({
  layer,
  onChange,
  onDelete,
  onDuplicate,
  onBringForward,
  onSendBackward,
  onClose,
}) => {
  return (
    <div className="fixed bottom-14 left-0 right-0 max-h-[58vh] z-20 md:static md:w-80 md:max-h-screen bg-zinc-900 border-t md:border-t-0 md:border-l border-zinc-800 p-4 overflow-y-auto text-xs flex flex-col gap-3.5 select-none shrink-0 shadow-2xl md:shadow-none">
      {/* Mobile Drawer Grab Bar */}
      <div className="md:hidden flex justify-center -mt-2 pb-1">
        <div className="w-12 h-1 rounded-full bg-zinc-700" />
      </div>

      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <h2 className="font-bold text-zinc-100 text-sm">Stempel & Lencana</h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onDuplicate}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            title="Duplikat"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
            title="Hapus"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white md:hidden"
              title="Tutup"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Type Selector */}
      <div className="grid grid-cols-2 gap-1.5 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
        <button
          onClick={() =>
            onChange({
              stickerType: 'stamp',
              content: 'DISETUJUI KANG TIMPA',
              badgeColor: '#09090b',
              width: 210,
              height: 75,
            })
          }
          className={`py-1.5 px-2 rounded text-[11px] font-medium text-left ${
            layer.stickerType === 'stamp' ? 'bg-zinc-800 text-amber-400 font-bold' : 'text-zinc-400'
          }`}
        >
          🏷️ Stempel Cap
        </button>
        <button
          onClick={() =>
            onChange({
              stickerType: 'redaction',
              content: '[SENSOR]',
              badgeColor: '#09090b',
              width: 200,
              height: 50,
            })
          }
          className={`py-1.5 px-2 rounded text-[11px] font-medium text-left ${
            layer.stickerType === 'redaction' ? 'bg-zinc-800 text-amber-400 font-bold' : 'text-zinc-400'
          }`}
        >
          ⬛ Sensor Bar
        </button>
      </div>

      {/* Content Editor */}
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-semibold text-zinc-400">Teks Cap</label>
        <input
          type="text"
          value={layer.content}
          onChange={(e) => onChange({ content: e.target.value })}
          className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-zinc-100 font-bold text-xs"
        />
      </div>

      {/* Preset Pills */}
      {layer.stickerType === 'stamp' && (
        <div className="flex flex-wrap gap-1">
          {STAMP_PRESETS.map((txt) => (
            <button
              key={txt}
              onClick={() => onChange({ content: txt })}
              className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-300 hover:text-amber-400 transition-colors"
            >
              {txt}
            </button>
          ))}
        </div>
      )}

      {/* Scale & Rotation */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[10px] text-zinc-400">
            <span>Ukuran</span>
            <span className="font-mono text-amber-400">{layer.width}px</span>
          </div>
          <input
            type="range"
            min={60}
            max={500}
            value={layer.width}
            onChange={(e) => {
              const newW = Number(e.target.value);
              const ratio = layer.height / layer.width;
              onChange({ width: newW, height: Math.round(newW * ratio) });
            }}
            className="accent-amber-500 w-full mt-1.5"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[10px] text-zinc-400">
            <span>Rotasi</span>
            <span className="font-mono text-amber-400">{layer.rotation || 0}°</span>
          </div>
          <input
            type="range"
            min={-45}
            max={45}
            value={layer.rotation || 0}
            onChange={(e) => onChange({ rotation: Number(e.target.value) })}
            className="accent-amber-500 w-full mt-1.5"
          />
        </div>
      </div>

      {/* Layer Position / Ordering */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[10px] font-semibold text-zinc-400">Urutan Layer</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={onSendBackward}
            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px]"
          >
            Ke Bawah
          </button>
          <button
            onClick={onBringForward}
            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px]"
          >
            Ke Atas
          </button>
        </div>
      </div>
    </div>
  );
};
