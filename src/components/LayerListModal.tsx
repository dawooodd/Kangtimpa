import React from 'react';
import { 
  X, 
  Layers, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Copy,
  Type,
  Square,
  Stamp,
  Paintbrush
} from 'lucide-react';
import { EditorLayer } from '../types';

interface LayerListModalProps {
  isOpen: boolean;
  onClose: () => void;
  layers: EditorLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string) => void;
  onToggleHide: (id: string) => void;
  onToggleLock: (id: string) => void;
  onDeleteLayer: (id: string) => void;
  onDuplicateLayer: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
}

export const LayerListModal: React.FC<LayerListModalProps> = ({
  isOpen,
  onClose,
  layers,
  selectedLayerId,
  onSelectLayer,
  onToggleHide,
  onToggleLock,
  onDeleteLayer,
  onDuplicateLayer,
  onMoveUp,
  onMoveDown,
}) => {
  if (!isOpen) return null;

  const getLayerIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <Type className="w-4 h-4 text-amber-400" />;
      case 'patch':
        return <Square className="w-4 h-4 text-orange-400" />;
      case 'sticker':
        return <Stamp className="w-4 h-4 text-red-400" />;
      case 'brush_stroke':
        return <Paintbrush className="w-4 h-4 text-purple-400" />;
      default:
        return <Layers className="w-4 h-4 text-zinc-400" />;
    }
  };

  const getLayerName = (layer: EditorLayer) => {
    if (layer.type === 'text') return `Teks: "${layer.text.slice(0, 20)}..."`;
    if (layer.type === 'patch') return `Kotak Penutup (${layer.shape})`;
    if (layer.type === 'sticker') return `Stempel: ${layer.content}`;
    if (layer.type === 'brush_stroke') return `Corengan Kuas (${layer.points.length} titik)`;
    return 'Layer';
  };

  // Reverse to show top layers at the top of the UI list
  const reversedLayers = [...layers].reverse();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-zinc-100 text-base">Kelola Layer ({layers.length})</h2>
              <p className="text-xs text-zinc-400">
                Atur urutan kedalaman, sembunyikan, atau kunci elemen
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Layers List */}
        <div className="p-4 overflow-y-auto flex flex-col gap-2">
          {reversedLayers.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-xs">
              Belum ada layer tambahan. Klik alat di toolbar untuk menambahkan teks atau penutup.
            </div>
          ) : (
            reversedLayers.map((layer) => {
              const isSelected = layer.id === selectedLayerId;
              return (
                <div
                  key={layer.id}
                  onClick={() => onSelectLayer(layer.id)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/60 shadow-sm'
                      : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    {getLayerIcon(layer.type)}
                    <span className="text-xs font-semibold text-zinc-200 truncate">
                      {getLayerName(layer)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onMoveUp(layer.id)}
                      className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
                      title="Pindah ke Atas"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onMoveDown(layer.id)}
                      className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
                      title="Pindah ke Bawah"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onToggleHide(layer.id)}
                      className={`p-1 rounded hover:bg-zinc-800 ${
                        layer.hidden ? 'text-amber-400' : 'text-zinc-400 hover:text-white'
                      }`}
                      title={layer.hidden ? 'Tampilkan' : 'Sembunyikan'}
                    >
                      {layer.hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => onToggleLock(layer.id)}
                      className={`p-1 rounded hover:bg-zinc-800 ${
                        layer.locked ? 'text-red-400' : 'text-zinc-400 hover:text-white'
                      }`}
                      title={layer.locked ? 'Buka Kunci' : 'Kunci Layer'}
                    >
                      {layer.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => onDuplicateLayer(layer.id)}
                      className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800"
                      title="Duplikat"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteLayer(layer.id)}
                      className="p-1 rounded text-zinc-400 hover:text-red-400 hover:bg-red-500/20"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
