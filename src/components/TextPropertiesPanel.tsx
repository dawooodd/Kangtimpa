import React from 'react';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Bold, 
  Italic, 
  CaseUpper, 
  Trash2, 
  Copy, 
  Pipette,
  Layers,
  Sparkles
} from 'lucide-react';
import { TextLayer } from '../types';

interface TextPropertiesPanelProps {
  layer: TextLayer;
  onChange: (updated: Partial<TextLayer>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onTriggerEyedropper: (targetProp: 'fillColor' | 'backgroundColor' | 'strokeColor') => void;
}

const FONTS = [
  { id: 'Impact', label: 'Impact (Klasik Meme)' },
  { id: 'Comic Neue', label: 'Comic Sans / Neue' },
  { id: 'Bangers', label: 'Bangers (Komik Heboh)' },
  { id: 'Anton', label: 'Anton (Tegas & Tebal)' },
  { id: 'Caveat', label: 'Caveat (Tulisan Tangan)' },
  { id: 'Permanent Marker', label: 'Permanent Marker' },
  { id: 'Inter', label: 'Inter (Modern Bersih)' },
  { id: 'Courier New', label: 'Monospace Mesin Tik' },
];

const PRESET_COLORS = [
  '#ffffff',
  '#000000',
  '#facc15',
  '#ef4444',
  '#22c55e',
  '#3b82f6',
  '#ec4899',
  '#f97316',
];

export const TextPropertiesPanel: React.FC<TextPropertiesPanelProps> = ({
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
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <h2 className="font-bold text-zinc-100 text-sm">Pengaturan Teks Timpa</h2>
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

      {/* Text Area */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-zinc-400">Konten Teks</label>
        <textarea
          rows={3}
          value={layer.text}
          onChange={(e) => onChange({ text: e.target.value })}
          className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg p-2.5 text-zinc-100 focus:outline-none focus:border-amber-500 font-medium resize-y"
          placeholder="Tulis kalimat timpaan..."
        />
      </div>

      {/* Typography: Font family & Size */}
      <div className="grid grid-cols-1 gap-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-zinc-400">Gaya Font</label>
          <select
            value={layer.fontFamily}
            onChange={(e) => onChange({ fontFamily: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-700/80 rounded-lg p-2 text-zinc-200 focus:outline-none focus:border-amber-500 text-xs"
          >
            {FONTS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-[11px] font-semibold text-zinc-400">
            <span>Ukuran Huruf</span>
            <span className="font-mono text-amber-400">{layer.fontSize}px</span>
          </div>
          <input
            type="range"
            min={14}
            max={140}
            value={layer.fontSize}
            onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
            className="accent-amber-500 w-full"
          />
        </div>
      </div>

      {/* Formatting & Alignment */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-zinc-400">Format & Perataan</label>
        <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
          <button
            onClick={() => onChange({ align: 'left' })}
            className={`p-1.5 rounded flex-1 flex justify-center ${
              layer.align === 'left' ? 'bg-zinc-800 text-amber-400 font-bold' : 'text-zinc-400 hover:text-white'
            }`}
            title="Rata Kiri"
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onChange({ align: 'center' })}
            className={`p-1.5 rounded flex-1 flex justify-center ${
              layer.align === 'center' ? 'bg-zinc-800 text-amber-400 font-bold' : 'text-zinc-400 hover:text-white'
            }`}
            title="Rata Tengah"
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onChange({ align: 'right' })}
            className={`p-1.5 rounded flex-1 flex justify-center ${
              layer.align === 'right' ? 'bg-zinc-800 text-amber-400 font-bold' : 'text-zinc-400 hover:text-white'
            }`}
            title="Rata Kanan"
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-zinc-800" />

          <button
            onClick={() => onChange({ bold: !layer.bold })}
            className={`p-1.5 rounded flex-1 flex justify-center ${
              layer.bold ? 'bg-zinc-800 text-amber-400 font-bold' : 'text-zinc-400 hover:text-white'
            }`}
            title="Tebal (Bold)"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onChange({ italic: !layer.italic })}
            className={`p-1.5 rounded flex-1 flex justify-center ${
              layer.italic ? 'bg-zinc-800 text-amber-400 font-bold' : 'text-zinc-400 hover:text-white'
            }`}
            title="Miring (Italic)"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onChange({ uppercase: !layer.uppercase })}
            className={`p-1.5 rounded flex-1 flex justify-center ${
              layer.uppercase ? 'bg-zinc-800 text-amber-400 font-bold' : 'text-zinc-400 hover:text-white'
            }`}
            title="Huruf Kapital (ALL CAPS)"
          >
            <CaseUpper className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Text Color */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center text-[11px] font-semibold text-zinc-400">
          <span>Warna Teks</span>
          <button
            onClick={() => onTriggerEyedropper('fillColor')}
            className="flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300"
            title="Ambil warna dari gambar"
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
            {PRESET_COLORS.map((c) => (
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

      {/* Stroke / Outline - Crucial for Meme Readability */}
      <div className="flex flex-col gap-2 p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800">
        <div className="flex justify-between items-center text-[11px] font-semibold text-zinc-300">
          <span>Garis Luar / Outline</span>
          <span className="font-mono text-amber-400">{layer.strokeWidth}px</span>
        </div>
        <input
          type="range"
          min={0}
          max={16}
          value={layer.strokeWidth}
          onChange={(e) => onChange({ strokeWidth: Number(e.target.value) })}
          className="accent-amber-500 w-full"
        />
        <div className="flex items-center justify-between gap-2 mt-1">
          <span className="text-[10px] text-zinc-400">Warna Outline:</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={layer.strokeColor || '#000000'}
              onChange={(e) => onChange({ strokeColor: e.target.value })}
              className="w-7 h-6 rounded border border-zinc-700 bg-transparent cursor-pointer"
            />
            <button
              onClick={() => onChange({ strokeColor: '#000000' })}
              className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-300 hover:text-white"
            >
              Hitam
            </button>
            <button
              onClick={() => onChange({ strokeColor: '#ffffff' })}
              className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-300 hover:text-white"
            >
              Putih
            </button>
          </div>
        </div>
      </div>

      {/* Text Highlight Box (Background Fill) */}
      <div className="flex flex-col gap-2 p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800">
        <div className="flex justify-between items-center text-[11px] font-semibold text-zinc-300">
          <span>Kotak Latar Teks (Blokir)</span>
          {layer.backgroundColor && layer.backgroundColor !== 'transparent' && (
            <button
              onClick={() => onChange({ backgroundColor: '' })}
              className="text-[10px] text-red-400 hover:underline"
            >
              Hapus Blok
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={layer.backgroundColor && layer.backgroundColor !== 'transparent' ? layer.backgroundColor : '#ffffff'}
            onChange={(e) => onChange({ backgroundColor: e.target.value })}
            className="w-8 h-7 rounded border border-zinc-700 bg-transparent cursor-pointer"
          />
          <button
            onClick={() => onTriggerEyedropper('backgroundColor')}
            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-cyan-300 flex items-center gap-1"
          >
            <Pipette className="w-3 h-3" /> Ambil Warna
          </button>
          <button
            onClick={() => onChange({ backgroundColor: '#ffffff', fillColor: '#000000' })}
            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-200"
          >
            Blok Putih
          </button>
          <button
            onClick={() => onChange({ backgroundColor: '#000000', fillColor: '#ffffff' })}
            className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-200"
          >
            Blok Hitam
          </button>
        </div>
        {layer.backgroundColor && layer.backgroundColor !== 'transparent' && (
          <div className="flex justify-between items-center gap-2 pt-1">
            <span className="text-[10px] text-zinc-400">Padding:</span>
            <input
              type="range"
              min={0}
              max={30}
              value={layer.backgroundPadding || 6}
              onChange={(e) => onChange({ backgroundPadding: Number(e.target.value) })}
              className="accent-amber-500 w-28"
            />
          </div>
        )}
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
