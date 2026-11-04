import React from 'react';
import { Trash2, Copy, Stamp } from 'lucide-react';
import { StickerLayer } from '../types';

interface StickerPropertiesPanelProps {
  layer: StickerLayer;
  onChange: (updated: Partial<StickerLayer>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
}

const STAMP_PRESETS = [
  'DISETUJUI KANG TIMPA',
  '100% ASLI TIMPA',
  'MEME HALAL',
  'TIDAK HOAKS (NYATA)',
  'KORBAN TIMPAAN',
  'LULUS SENSOR',
];

const EMOJI_PRESETS = ['🗿', '💀', '🤡', '🧢', '📢', '🔥', '😭', '🤌', '👁️👄👁️', '☕', '👍', '🤫', '🤣'];

export const StickerPropertiesPanel: React.FC<StickerPropertiesPanelProps> = ({
  layer,
  onChange,
  onDelete,
  onDuplicate,
  onBringForward,
  onSendBackward,
}) => {
  return (
    <div className="w-80 bg-zinc-900 border-l border-zinc-800 p-4 overflow-y-auto max-h-screen text-xs flex flex-col gap-4 select-none shrink-0">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <h2 className="font-bold text-zinc-100 text-sm">Pengaturan Stempel / Stiker</h2>
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
            className="p-1.5 rounded hover:bg-red-500/20 text-zinc-400 hover:text-red-400"
            title="Hapus"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Type Selector */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-zinc-400">Tipe Stiker</label>
        <div className="grid grid-cols-2 gap-1.5 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
          <button
            onClick={() =>
              onChange({
                stickerType: 'stamp',
                content: 'DISETUJUI KANG TIMPA',
                badgeColor: '#dc2626',
                width: 220,
                height: 80,
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
                badgeColor: '#000000',
                width: 200,
                height: 50,
              })
            }
            className={`py-1.5 px-2 rounded text-[11px] font-medium text-left ${
              layer.stickerType === 'redaction' ? 'bg-zinc-800 text-amber-400 font-bold' : 'text-zinc-400'
            }`}
          >
            ⬛ Balok Sensor
          </button>
          <button
            onClick={() =>
              onChange({
                stickerType: 'badge',
                content: '★ VERIFIED TIMPA ★',
                badgeColor: '#2563eb',
                width: 220,
                height: 60,
              })
            }
            className={`py-1.5 px-2 rounded text-[11px] font-medium text-left ${
              layer.stickerType === 'badge' ? 'bg-zinc-800 text-amber-400 font-bold' : 'text-zinc-400'
            }`}
          >
            🛡️ Lencana
          </button>
          <button
            onClick={() =>
              onChange({
                stickerType: 'emoji',
                content: '🗿',
                width: 100,
                height: 100,
              })
            }
            className={`py-1.5 px-2 rounded text-[11px] font-medium text-left ${
              layer.stickerType === 'emoji' ? 'bg-zinc-800 text-amber-400 font-bold' : 'text-zinc-400'
            }`}
          >
            🗿 Reaksi Emoji
          </button>
        </div>
      </div>

      {/* Content Editor */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-zinc-400">Teks / Tulisan Stempel</label>
        <input
          type="text"
          value={layer.content}
          onChange={(e) => onChange({ content: e.target.value })}
          className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg p-2 text-zinc-100 font-bold text-xs"
        />
      </div>

      {/* Preset Pills */}
      {layer.stickerType === 'stamp' && (
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-zinc-400">Pilihan Cepat Stempel:</label>
          <div className="flex flex-wrap gap-1">
            {STAMP_PRESETS.map((txt) => (
              <button
                key={txt}
                onClick={() => onChange({ content: txt })}
                className="px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-300 hover:border-amber-500 hover:text-amber-400 transition-colors"
              >
                {txt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Emoji Palette */}
      {layer.stickerType === 'emoji' && (
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] text-zinc-400">Pilih Emoji:</label>
          <div className="grid grid-cols-7 gap-1 bg-zinc-950 p-2 rounded-lg border border-zinc-800">
            {EMOJI_PRESETS.map((em) => (
              <button
                key={em}
                onClick={() => onChange({ content: em })}
                className="text-xl hover:scale-125 transition-transform flex items-center justify-center p-1"
              >
                {em}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Badge/Stamp Color */}
      {layer.stickerType !== 'emoji' && layer.stickerType !== 'redaction' && (
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-zinc-400">Warna Cap</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={layer.badgeColor || '#dc2626'}
              onChange={(e) => onChange({ badgeColor: e.target.value })}
              className="w-8 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer"
            />
            <div className="flex items-center gap-1.5">
              {['#dc2626', '#16a34a', '#2563eb', '#9333ea', '#ea580c', '#000000'].map((col) => (
                <button
                  key={col}
                  onClick={() => onChange({ badgeColor: col })}
                  className="w-5 h-5 rounded-full border border-zinc-600"
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Scale / Dimensions */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-[10px] text-zinc-400">
          <span>Skala / Lebar</span>
          <span className="font-mono text-amber-400">{layer.width}px</span>
        </div>
        <input
          type="range"
          min={40}
          max={600}
          value={layer.width}
          onChange={(e) => {
            const newW = Number(e.target.value);
            const ratio = layer.height / layer.width;
            onChange({ width: newW, height: Math.round(newW * ratio) });
          }}
          className="accent-amber-500 w-full"
        />
      </div>

      {/* Rotation */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-[10px] text-zinc-400">
          <span>Kemiringan (Rotasi)</span>
          <span className="font-mono text-amber-400">{layer.rotation || 0}°</span>
        </div>
        <input
          type="range"
          min={-180}
          max={180}
          value={layer.rotation || 0}
          onChange={(e) => onChange({ rotation: Number(e.target.value) })}
          className="accent-amber-500 w-full"
        />
        <div className="flex justify-between text-[10px] text-zinc-500 px-1">
          <button onClick={() => onChange({ rotation: -15 })} className="hover:text-zinc-300">-15° (Cap)</button>
          <button onClick={() => onChange({ rotation: 0 })} className="hover:text-zinc-300">0° Lurus</button>
          <button onClick={() => onChange({ rotation: 15 })} className="hover:text-zinc-300">+15°</button>
        </div>
      </div>

      {/* Layer Position / Ordering */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-[11px] font-semibold text-zinc-400">Urutan Layer</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={onSendBackward}
            className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px]"
          >
            Ke Bawah
          </button>
          <button
            onClick={onBringForward}
            className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px]"
          >
            Ke Atas
          </button>
        </div>
      </div>
    </div>
  );
};
