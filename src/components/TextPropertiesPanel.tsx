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
  X
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
  onClose?: () => void;
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
  '#f59e0b',
  '#d97706',
  '#71717a',
  '#27272a',
];

export const TextPropertiesPanel: React.FC<TextPropertiesPanelProps> = ({
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
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <h2 className="font-bold text-zinc-100 text-sm">Pengaturan Teks</h2>
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

      {/* Text Area */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-semibold text-zinc-400">Isi Kalimat</label>
        <textarea
          rows={2}
          value={layer.text}
          onChange={(e) => onChange({ text: e.target.value })}
          className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-2 text-zinc-100 focus:outline-none focus:border-amber-500 font-medium resize-y"
          placeholder="Tulis kalimat..."
        />
      </div>

      {/* Font Family & Size */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-semibold text-zinc-400">Gaya Font</label>
          <select
            value={layer.fontFamily}
            onChange={(e) => onChange({ fontFamily: e.target.value })}
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-1.5 text-zinc-200 focus:outline-none focus:border-amber-500 text-xs"
          >
            {FONTS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[10px] text-zinc-400">
            <span>Ukuran</span>
            <span className="font-mono text-amber-400">{layer.fontSize}px</span>
          </div>
          <input
            type="range"
            min={14}
            max={120}
            value={layer.fontSize}
            onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
            className="accent-amber-500 w-full mt-1.5"
          />
        </div>
      </div>

      {/* Formatting & Alignment */}
      <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
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
          title="Tebal"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onChange({ italic: !layer.italic })}
          className={`p-1.5 rounded flex-1 flex justify-center ${
            layer.italic ? 'bg-zinc-800 text-amber-400 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
          title="Miring"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => onChange({ uppercase: !layer.uppercase })}
          className={`p-1.5 rounded flex-1 flex justify-center ${
            layer.uppercase ? 'bg-zinc-800 text-amber-400 font-bold' : 'text-zinc-400 hover:text-white'
          }`}
          title="Kapital"
        >
          <CaseUpper className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Text Color */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center text-[10px] text-zinc-400">
          <span>Warna Teks</span>
          <button
            onClick={() => onTriggerEyedropper('fillColor')}
            className="flex items-center gap-1 text-[10px] text-amber-400 hover:underline"
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
            {PRESET_COLORS.map((c) => (
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

      {/* Stroke / Outline */}
      <div className="flex flex-col gap-1.5 p-2 rounded-lg bg-zinc-950 border border-zinc-800">
        <div className="flex justify-between items-center text-[10px] text-zinc-300 font-medium">
          <span>Garis Outline (Garis Luar)</span>
          <span className="font-mono text-amber-400">{layer.strokeWidth}px</span>
        </div>
        <input
          type="range"
          min={0}
          max={14}
          value={layer.strokeWidth}
          onChange={(e) => onChange({ strokeWidth: Number(e.target.value) })}
          className="accent-amber-500 w-full"
        />
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <span className="text-[10px] text-zinc-400">Warna Outline:</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onChange({ strokeColor: '#000000' })}
              className={`px-2 py-0.5 rounded text-[10px] ${
                layer.strokeColor === '#000000' ? 'bg-amber-500 text-zinc-950 font-bold' : 'bg-zinc-800 text-zinc-300'
              }`}
            >
              Hitam
            </button>
            <button
              onClick={() => onChange({ strokeColor: '#ffffff' })}
              className={`px-2 py-0.5 rounded text-[10px] ${
                layer.strokeColor === '#ffffff' ? 'bg-amber-500 text-zinc-950 font-bold' : 'bg-zinc-800 text-zinc-300'
              }`}
            >
              Putih
            </button>
          </div>
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
