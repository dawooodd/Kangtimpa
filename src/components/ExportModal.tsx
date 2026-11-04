import React, { useState } from 'react';
import { X, Download, Copy, Check, Image as ImageIcon, Flame } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  getExportDataUrl: (format: 'image/png' | 'image/jpeg', quality: number) => string;
  width: number;
  height: number;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  getExportDataUrl,
  width,
  height,
}) => {
  const [format, setFormat] = useState<'image/png' | 'image/jpeg'>('image/png');
  const [quality, setQuality] = useState<number>(0.92);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const dataUrl = getExportDataUrl(format, quality);

  const handleDownload = () => {
    setIsDownloading(true);
    const link = document.createElement('a');
    link.download = `kangtimpa-meme-${Date.now()}.${format === 'image/png' ? 'png' : 'jpg'}`;
    link.href = dataUrl;
    link.click();
    setTimeout(() => setIsDownloading(false), 800);
  };

  const handleCopyToClipboard = async () => {
    try {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.warn('Clipboard write failed, fallback copy url', err);
      // Fallback
      navigator.clipboard.writeText(dataUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-zinc-100 text-base">Unduh Meme Timpaan</h2>
              <p className="text-xs text-zinc-400">
                Simpan ke galeri atau langsung salin untuk ditempel di media sosial
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

        {/* Content */}
        <div className="p-6 flex flex-col md:flex-row gap-6 max-h-[70vh] overflow-y-auto">
          {/* Image Preview */}
          <div className="flex-1 flex flex-col items-center justify-center bg-zinc-950 rounded-xl p-3 border border-zinc-800">
            <div className="max-h-64 max-w-full overflow-hidden rounded-lg shadow-md border border-zinc-700/50">
              <img
                src={dataUrl}
                alt="Kangtimpa Preview"
                className="max-h-64 object-contain mx-auto"
              />
            </div>
            <div className="mt-2 text-[11px] font-mono text-zinc-400 flex items-center gap-2">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>
                {width} x {height} px
              </span>
            </div>
          </div>

          {/* Options */}
          <div className="w-full md:w-64 flex flex-col gap-4 text-xs">
            {/* Format Picker */}
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-zinc-300">Format File</label>
              <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                <button
                  onClick={() => setFormat('image/png')}
                  className={`py-2 rounded text-center font-medium transition-colors ${
                    format === 'image/png'
                      ? 'bg-zinc-800 text-amber-400 font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  PNG (Jernih)
                </button>
                <button
                  onClick={() => setFormat('image/jpeg')}
                  className={`py-2 rounded text-center font-medium transition-colors ${
                    format === 'image/jpeg'
                      ? 'bg-zinc-800 text-amber-400 font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  JPG (Ringan)
                </button>
              </div>
            </div>

            {/* Quality Slider (JPG) */}
            {format === 'image/jpeg' && (
              <div className="flex flex-col gap-2 p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                <div className="flex justify-between items-center text-zinc-300 font-medium">
                  <span>Kualitas JPG</span>
                  <span className="font-mono text-amber-400">{Math.round(quality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="accent-amber-500 w-full"
                />
                <button
                  onClick={() => setQuality(0.25)}
                  className="flex items-center gap-1.5 text-[10px] text-amber-400 hover:text-amber-300 font-semibold pt-1"
                >
                  <Flame className="w-3 h-3" /> Pasang Efek Kompresi Rusak (25%)
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="mt-auto flex flex-col gap-2 pt-2">
              <button
                onClick={handleCopyToClipboard}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold flex items-center justify-center gap-2 transition-all border border-zinc-700"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Tersalin ke Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-zinc-400" />
                    <span>Salin ke Clipboard</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownload}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{isDownloading ? 'Menyimpan...' : 'Unduh Gambar Sekarang'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
