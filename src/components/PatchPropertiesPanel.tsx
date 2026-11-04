import React from 'react';
import { Trash2, Copy, Pipette, Square, Circle, X } from 'lucide-react';
import { PatchLayer } from '../types';

interface PatchPropertiesPanelProps {
  layer: PatchLayer;
  onChange: (updated: Partial<PatchLayer>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onTriggerEyedropper: (targetProp: 'fillColor' | 'borderColor') => void;
  onClose?: () => void;
}

const PRESET_PATCH_COLORS = [
  '#facc15', // Gold / Yellow
  '#ffffff', // White
  '#09090b', // Deep Dark
  '#18181b', // Charcoal
  '#dc2626', // News Red
  '#005c4b', // WhatsApp Dark Green
];

export const PatchPropertiesPanel: React.FC<PatchPropertiesPanelProps> = ({
  layer,
  onChange,
  onDelete,
  onDuplicate,
  onBringForward,
  onSendBackward,
  onTriggerEyedropper,
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
          <h2 className="font-bold text-zinc-100 text-sm">Kotak Penutup (Patch)</h2>
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

      {/* Shape Selector */}
      <div className="grid grid-cols-3 gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
        <button
          onClick={() => onChange({ shape: 'rect' })}
          className={`py-1.5 rounded flex items-center justify-center gap-1 text-[11px] ${
            layer.shape === 'rect' ? 'bg-zinc-800 text-amber-400 font-bold' : 'text-zinc-400'
          }`}
        >
          <Square className="w-3.5 h-3.5" /> Persegi
        </button>
        <button
          onClick={() => onChange({ shape: 'rounded' })}
          className={`py-1.5 rounded flex items-center justify-center gap-1 text-[11px] ${
            layer.shape === 'rounded' ? 'bg-zinc-800 text-amber-400 font-bold' : 'text-zinc-400'
          }`}
        >
          <Square className="w-3.5 h-3.5 rounded" /> Membulat
        </button>
        <button
          onClick={() => onChange({ shape: 'ellipse' })}
          className={`py-1.5 rounded flex items-center justify-center gap-1 text-[11px] ${
            layer.shape === 'ellipse' ? 'bg-zinc-800 text-amber-400 font-bold' : 'text-zinc-400'
          }`}
        >
          <Circle className="w-3.5 h-3.5" /> Elips
        </button>
      </div>

      {/* Dimensions: Width and Height */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-zinc-400">Lebar (px)</span>
          <input
            type="number"
            min={10}
            max={2500}
            value={layer.width}
            onChange={(e) => onChange({ width: Math.max(10, Number(e.target.value)) })}
            className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-100 text-xs focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-[10px] text-zinc-400">Tinggi (px)</span>
          <input
            type="number"
            min={10}
            max={2500}
            value={layer.height}
            onChange={(e) => onChange({ height: Math.max(10, Number(e.target.value)) })}
            className="w-full bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-zinc-100 text-xs focus:outline-none"
          />
        </div>
      </div>

      {/* Fill Color */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center text-[10px] text-zinc-400">
          <span>Warna Isian Penutup</span>
          <button
            onClick={() => onTriggerEyedropper('fillColor')}
            className="flex items-center gap-1 text-[10px] text-amber-400 hover:underline font-semibold"
          >
            <Pipette className="w-3 h-3" /> Ambil Pipet
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={layer.fillColor}
            onChange={(e) => onChange({ fillColor: e.target.value })}
            className="w-7 h-7 rounded border border-zinc-700 bg-transparent cursor-pointer shrink-0"
          />
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {PRESET_PATCH_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => onChange({ fillColor: c })}
                className="w-5 h-5 rounded-full border border-zinc-700 shrink-0"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Blur Feathering for seamless blending with meme image */}
      <div className="flex flex-col gap-1 p-2 rounded-lg bg-zinc-950 border border-zinc-800">
        <div className="flex justify-between text-[10px] text-zinc-300 font-medium">
          <span>Kehalusan Tepi (Blur Blend)</span>
          <span className="font-mono text-amber-400">{layer.blur || 0}px</span>
        </div>
        <input
          type="range"
          min={0}
          max={10}
          value={layer.blur || 0}
          onChange={(e) => onChange({ blur: Number(e.target.value) })}
          className="accent-amber-500 w-full"
        />
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
