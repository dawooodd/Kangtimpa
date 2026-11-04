import React from 'react';
import { Trash2, Copy, Pipette, Square, Circle } from 'lucide-react';
import { PatchLayer } from '../types';

interface PatchPropertiesPanelProps {
  layer: PatchLayer;
  onChange: (updated: Partial<PatchLayer>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onTriggerEyedropper: (targetProp: 'fillColor' | 'borderColor') => void;
}

const PRESET_PATCH_COLORS = [
  '#ffffff',
  '#000000',
  '#f8fafc',
  '#0b141a', // WhatsApp Dark
  '#202c33', // WhatsApp Bubble Dark
  '#e9edef', // WhatsApp light text
  '#fef08a', // Warung yellow
  '#dc2626', // News red
  '#2563eb', // Blue
  '#005c4b', // WhatsApp outgoing bubble
];

export const PatchPropertiesPanel: React.FC<PatchPropertiesPanelProps> = ({
  layer,
  onChange,
  onDelete,
  onDuplicate,
  onBringForward,
  onSendBackward,
  onTriggerEyedropper,
}) => {
  return (
    <div className="w-80 bg-zinc-900 border-l border-zinc-800 p-4 overflow-y-auto max-h-screen text-xs flex flex-col gap-4 select-none shrink-0">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          <h2 className="font-bold text-zinc-100 text-sm">Pengaturan Kotak Timpa</h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onDuplicate}
            className="p-1.5 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            title="Duplikat Layer"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded hover:bg-red-500/20 text-zinc-400 hover:text-red-400"
            title="Hapus Layer (Del)"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Shape Selector */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-zinc-400">Bentuk Penutup</label>
        <div className="grid grid-cols-3 gap-1.5 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
          <button
            onClick={() => onChange({ shape: 'rect' })}
            className={`py-1.5 rounded flex items-center justify-center gap-1 text-[11px] ${
              layer.shape === 'rect' ? 'bg-zinc-800 text-amber-400 font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Square className="w-3.5 h-3.5" /> Persegi
          </button>
          <button
            onClick={() => onChange({ shape: 'rounded' })}
            className={`py-1.5 rounded flex items-center justify-center gap-1 text-[11px] ${
              layer.shape === 'rounded' ? 'bg-zinc-800 text-amber-400 font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Square className="w-3.5 h-3.5 rounded" /> Membulat
          </button>
          <button
            onClick={() => onChange({ shape: 'ellipse' })}
            className={`py-1.5 rounded flex items-center justify-center gap-1 text-[11px] ${
              layer.shape === 'ellipse' ? 'bg-zinc-800 text-amber-400 font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Circle className="w-3.5 h-3.5" /> Elips
          </button>
        </div>
      </div>

      {/* Dimensions: Width and Height */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-zinc-400">Lebar (Width)</span>
          <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded px-2 py-1">
            <input
              type="number"
              min={10}
              max={2500}
              value={layer.width}
              onChange={(e) => onChange({ width: Math.max(10, Number(e.target.value)) })}
              className="w-full bg-transparent text-zinc-100 text-xs focus:outline-none"
            />
            <span className="text-[10px] text-zinc-400">px</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-zinc-400">Tinggi (Height)</span>
          <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded px-2 py-1">
            <input
              type="number"
              min={10}
              max={2500}
              value={layer.height}
              onChange={(e) => onChange({ height: Math.max(10, Number(e.target.value)) })}
              className="w-full bg-transparent text-zinc-100 text-xs focus:outline-none"
            />
            <span className="text-[10px] text-zinc-400">px</span>
          </div>
        </div>
      </div>

      {/* Fill Color */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center text-[11px] font-semibold text-zinc-400">
          <span>Warna Penutup (Isian)</span>
          <button
            onClick={() => onTriggerEyedropper('fillColor')}
            className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold"
            title="Ambil warna background langsung dari gambar"
          >
            <Pipette className="w-3 h-3" /> Ambil Pipet
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={layer.fillColor}
            onChange={(e) => onChange({ fillColor: e.target.value })}
            className="w-9 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer"
          />
          <div className="flex items-center gap-1 flex-1 overflow-x-auto pb-0.5">
            {PRESET_PATCH_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => onChange({ fillColor: c })}
                className="w-5 h-5 rounded-full border border-zinc-600 shrink-0"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Border & Rounded Radius */}
      {layer.shape === 'rounded' && (
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[10px] text-zinc-400">
            <span>Radius Sudut</span>
            <span className="font-mono text-amber-400">{layer.borderRadius || 12}px</span>
          </div>
          <input
            type="range"
            min={0}
            max={80}
            value={layer.borderRadius || 12}
            onChange={(e) => onChange({ borderRadius: Number(e.target.value) })}
            className="accent-amber-500 w-full"
          />
        </div>
      )}

      {/* Border Width & Color */}
      <div className="flex flex-col gap-2 p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800">
        <div className="flex justify-between text-[11px] font-semibold text-zinc-300">
          <span>Garis Tepi (Border)</span>
          <span className="font-mono text-amber-400">{layer.borderWidth || 0}px</span>
        </div>
        <input
          type="range"
          min={0}
          max={16}
          value={layer.borderWidth || 0}
          onChange={(e) => onChange({ borderWidth: Number(e.target.value) })}
          className="accent-amber-500 w-full"
        />
        {layer.borderWidth > 0 && (
          <div className="flex items-center justify-between gap-2 pt-1">
            <span className="text-[10px] text-zinc-400">Warna Garis:</span>
            <input
              type="color"
              value={layer.borderColor || '#000000'}
              onChange={(e) => onChange({ borderColor: e.target.value })}
              className="w-7 h-6 rounded border border-zinc-700 bg-transparent cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Blur / Feather effect for blending with jpeg memes */}
      <div className="flex flex-col gap-1.5 p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800">
        <div className="flex justify-between text-[11px] font-semibold text-zinc-300">
          <span>Kelembutan Tepi (Blur Blend)</span>
          <span className="font-mono text-amber-400">{layer.blur || 0}px</span>
        </div>
        <p className="text-[10px] text-zinc-400">
          Gunakan blur 1-4px agar warna tambalan menyatu mulus dengan kompresi gambar asli.
        </p>
        <input
          type="range"
          min={0}
          max={12}
          value={layer.blur || 0}
          onChange={(e) => onChange({ blur: Number(e.target.value) })}
          className="accent-amber-500 w-full mt-1"
        />
      </div>

      {/* Opacity */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-[10px] text-zinc-400">
          <span>Transparansi (Opacity)</span>
          <span className="font-mono text-amber-400">{Math.round((layer.opacity ?? 1) * 100)}%</span>
        </div>
        <input
          type="range"
          min={10}
          max={100}
          value={Math.round((layer.opacity ?? 1) * 100)}
          onChange={(e) => onChange({ opacity: Number(e.target.value) / 100 })}
          className="accent-amber-500 w-full"
        />
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
