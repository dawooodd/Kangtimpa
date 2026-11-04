import React from 'react';
import { X, Sparkles, LayoutTemplate, Check } from 'lucide-react';
import { MEME_TEMPLATES } from '../utils/templates';
import { MemeTemplate } from '../types';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: MemeTemplate) => void;
  currentTemplateId: string;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  currentTemplateId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-zinc-100 text-base">Pilih Template Meme</h2>
              <p className="text-xs text-zinc-400">
                Pilih template khas Indonesia atau kanvas kosong untuk langsung berkreasi
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

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MEME_TEMPLATES.map((tmpl) => {
            const isSelected = tmpl.id === currentTemplateId;
            return (
              <div
                key={tmpl.id}
                onClick={() => {
                  onSelectTemplate(tmpl);
                  onClose();
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between group relative overflow-hidden ${
                  isSelected
                    ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                    : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                      {tmpl.category} • {tmpl.aspectRatio}
                    </span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                        <Check className="w-3.5 h-3.5" /> Aktif
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-zinc-100 text-sm group-hover:text-amber-400 transition-colors">
                    {tmpl.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{tmpl.subtitle}</p>
                </div>

                {/* Visual card color bar */}
                <div className="mt-4 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: tmpl.previewColor }}
                    />
                    <span>{tmpl.initialLayers.length} Layer Bawaan</span>
                  </div>
                  <span className="text-amber-400/90 font-medium group-hover:translate-x-0.5 transition-transform">
                    Gunakan →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
