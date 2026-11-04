import React from 'react';
import { X, Keyboard, Command } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: 'V', desc: 'Pilih alat seleksi / pemindah objek' },
  { key: 'T', desc: 'Tambah Teks Timpa baru' },
  { key: 'P', desc: 'Tambah Kotak / Patch penutup baru' },
  { key: 'B', desc: 'Gunakan Kuas Penutup' },
  { key: 'Delete / Backspace', desc: 'Hapus layer yang sedang dipilih' },
  { key: 'Ctrl + Z / ⌘Z', desc: 'Batalkan aksi terakhir (Undo)' },
  { key: 'Ctrl + Y / ⌘⇧Z', desc: 'Ulangi aksi (Redo)' },
  { key: 'Ctrl + C / ⌘C', desc: 'Salin hasil langsung ke Clipboard' },
  { key: 'Ctrl + V / ⌘V', desc: 'Tempel (Paste) gambar langsung dari clipboard' },
  { key: 'Tombol Panah ↑ ↓ ← →', desc: 'Geser posisi objek 1 piksel' },
  { key: 'Shift + Tombol Panah', desc: 'Geser posisi objek 10 piksel' },
  { key: 'Esc', desc: 'Batalkan pemilihan layer aktif' },
];

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-zinc-100 text-base">Pintasan Keyboard (Shortcuts)</h2>
              <p className="text-xs text-zinc-400">Kerja cepat seperti Master Kang Timpa sejati</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="p-4 overflow-y-auto max-h-[60vh] flex flex-col gap-2">
          {SHORTCUTS.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80 text-xs"
            >
              <span className="text-zinc-300 font-medium">{s.desc}</span>
              <kbd className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 font-mono text-[11px] text-amber-300 font-bold shrink-0">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
