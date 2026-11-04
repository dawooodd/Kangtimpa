import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  Database, 
  BarChart3, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Sparkles, 
  Sliders, 
  Terminal, 
  Flame, 
  ArrowRight, 
  Upload, 
  Eye, 
  ShieldCheck, 
  Layers,
  Wand2,
  Undo2
} from 'lucide-react';
import { 
  analyzeImageForTampering, 
  inpaintRestoreCanvas, 
  MLAnalysisResult, 
  SuspectedRegion 
} from '../utils/mlDetector';
import { 
  MEME_DATASET, 
  MemeDatasetItem, 
  GENERATE_MOCK_SCRAPE_LOGS, 
  ScrapeLogEntry 
} from '../utils/memeDataset';

interface DataEngineeringLabProps {
  currentStudioCanvas: HTMLCanvasElement | null;
  onSendToStudio: (img: HTMLImageElement) => void;
  onClose: () => void;
}

export const DataEngineeringLab: React.FC<DataEngineeringLabProps> = ({
  currentStudioCanvas,
  onSendToStudio,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'detector' | 'pipeline' | 'metrics'>('detector');

  // Analysis target image
  const [testCanvas, setTestCanvas] = useState<HTMLCanvasElement | null>(null);
  const [testImageTitle, setTestImageTitle] = useState<string>('Kanvas dari Studio');

  // ML Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<MLAnalysisResult | null>(null);
  const [viewMode, setViewMode] = useState<'normal' | 'heatmap' | 'ela'>('heatmap');
  const [isRestored, setIsRestored] = useState<boolean>(false);

  // Scraper Simulation State
  const [scrapeLogs, setScrapeLogs] = useState<ScrapeLogEntry[]>(GENERATE_MOCK_SCRAPE_LOGS());
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [datasetCount, setDatasetCount] = useState<number>(1284);

  // Initialize test canvas from current studio canvas if available, or first dataset item
  useEffect(() => {
    if (currentStudioCanvas) {
      const copy = document.createElement('canvas');
      copy.width = currentStudioCanvas.width;
      copy.height = currentStudioCanvas.height;
      const ctx = copy.getContext('2d');
      if (ctx) {
        ctx.drawImage(currentStudioCanvas, 0, 0);
        setTestCanvas(copy);
        setTestImageTitle('Meme Aktif dari Studio');
      }
    } else {
      loadDatasetItem(MEME_DATASET[0]);
    }
  }, [currentStudioCanvas]);

  const loadDatasetItem = (item: MemeDatasetItem) => {
    const c = document.createElement('canvas');
    c.width = 800;
    c.height = item.aspectRatio === '16:9' ? 450 : item.aspectRatio === '9:16' ? 1420 : 600;
    const ctx = c.getContext('2d');
    if (ctx) {
      item.drawBase(ctx, c.width, c.height);
      setTestCanvas(c);
      setTestImageTitle(item.title);
      setAnalysisResult(null);
      setIsRestored(false);
    }
  };

  const handleUploadTestImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = img.width;
        c.height = img.height;
        const ctx = c.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          setTestCanvas(c);
          setTestImageTitle(file.name);
          setAnalysisResult(null);
          setIsRestored(false);
        }
      };
      img.src = URL.createObjectURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!testCanvas) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Simulate realistic tensor calculation delay
    setTimeout(async () => {
      try {
        const res = await analyzeImageForTampering(testCanvas);
        setAnalysisResult(res);
      } catch (err) {
        console.error('Analysis error', err);
      } finally {
        setIsAnalyzing(false);
      }
    }, 700);
  };

  // Reverse Timpa (Inpaint / Restore)
  const handleInpaintRestore = () => {
    if (!testCanvas || !analysisResult) return;
    const restored = inpaintRestoreCanvas(testCanvas, analysisResult.suspectedRegions);
    setTestCanvas(restored);
    setIsRestored(true);
    // Re-run analysis on the restored canvas
    setTimeout(async () => {
      const newRes = await analyzeImageForTampering(restored);
      setAnalysisResult(newRes);
    }, 400);
  };

  // Send current image back to Studio
  const handleTransferToStudio = () => {
    if (!testCanvas) return;
    const img = new Image();
    img.onload = () => {
      onSendToStudio(img);
      onClose();
    };
    img.src = testCanvas.toDataURL('image/png');
  };

  // Scraper simulator action
  const handleTriggerScraper = () => {
    setIsScraping(true);
    const mockTargets = [
      'Grup WA Alumni SMP (Meme Pagi)',
      'r/indonesian_memes_curated',
      'Portal Guyonan Bapak-Bapak Santai',
      'Arsip Meme Twitter/X Verified',
    ];
    const target = mockTargets[Math.floor(Math.random() * mockTargets.length)];

    setTimeout(() => {
      const now = new Date().toLocaleTimeString();
      const newEntries: ScrapeLogEntry[] = [
        {
          timestamp: now,
          source: target,
          status: 'EXTRACTING',
          message: `Mengunduh 16 kandidat gambar aman SFW dari ${target}...`,
        },
        {
          timestamp: now,
          source: 'ETL Preprocessor',
          status: 'TRANSFORMING',
          message: 'Mengonversi citra ke RGB 8-bit, normalisasi histogram piksel...',
        },
        {
          timestamp: now,
          source: 'Data Lake Ingestion',
          status: 'VALIDATED',
          message: 'Data bersih! 16 sampel baru berhasil digabungkan ke training lake.',
        },
      ];
      setScrapeLogs((prev) => [...newEntries, ...prev].slice(0, 20));
      setDatasetCount((c) => c + 16);
      setIsScraping(false);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 overflow-hidden text-zinc-100 select-none">
      {/* Top Tab Bar */}
      <div className="h-12 bg-zinc-900 border-b border-zinc-800 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
            <Cpu className="w-3.5 h-3.5" />
            <span>KANG TIMPA FORENSIC & DATA LAB</span>
          </div>
          <span className="text-[11px] text-zinc-400 hidden md:inline">
            Machine Learning Computer Vision • Reverse Timpa • Safe Data Scraper
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
          <button
            onClick={() => setActiveTab('detector')}
            className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'detector'
                ? 'bg-amber-500 text-zinc-950 shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" /> Deteksi & Forensik ML
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'pipeline'
                ? 'bg-amber-500 text-zinc-950 shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" /> Meme Data Lake & Scraper
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'metrics'
                ? 'bg-amber-500 text-zinc-950 shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Metrik Model & MLOps
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* ================= TAB 1: DETECTOR & FORENSIC LAB ================= */}
        {activeTab === 'detector' && (
          <div className="max-w-6xl mx-auto flex flex-col gap-6">
            {/* Header / Intro */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <div>
                <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <span>Pendeteksi Kebenaran Meme (Asli vs Hasil Timpaan)</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">
                    CV + ELA Engine
                  </span>
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Model AI memindai Error Level Analysis (ELA) dan anomali kerapatan piksel untuk membuktikan apakah gambar ini suci atau hasil karya jahil Kang Timpa.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium cursor-pointer border border-zinc-700">
                  <Upload className="w-3.5 h-3.5" /> Upload File Uji
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadTestImage}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={runAnalysis}
                  disabled={isAnalyzing || !testCanvas}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/20 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                  <span>{isAnalyzing ? 'Sedang Memindai Tensor...' : '🔍 Jalankan Inference ML'}</span>
                </button>
              </div>
            </div>

            {/* Main Stage: Canvas View & Diagnostics */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Visual Inspector */}
              <div className="lg:col-span-7 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-zinc-300 truncate max-w-xs">
                      {testImageTitle}
                    </span>
                    {isRestored && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                        Hasil Dibongkar (Inpainted)
                      </span>
                    )}
                  </div>

                  {/* Visual Mode Toggle */}
                  <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
                    <button
                      onClick={() => setViewMode('normal')}
                      className={`px-2 py-1 rounded text-[11px] ${
                        viewMode === 'normal'
                          ? 'bg-zinc-800 text-amber-400 font-bold'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Citra Asli
                    </button>
                    <button
                      onClick={() => setViewMode('heatmap')}
                      className={`px-2 py-1 rounded text-[11px] ${
                        viewMode === 'heatmap'
                          ? 'bg-zinc-800 text-amber-400 font-bold'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Heatmap Anomali
                    </button>
                    <button
                      onClick={() => setViewMode('ela')}
                      className={`px-2 py-1 rounded text-[11px] ${
                        viewMode === 'ela'
                          ? 'bg-zinc-800 text-amber-400 font-bold'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Matrix ELA
                    </button>
                  </div>
                </div>

                {/* Canvas Display Container */}
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex items-center justify-center min-h-[380px] max-h-[460px] overflow-hidden relative shadow-inner">
                  {testCanvas && (
                    <div className="max-h-[420px] max-w-full flex items-center justify-center">
                      {viewMode === 'normal' && (
                        <img
                          src={testCanvas.toDataURL()}
                          alt="Test Input"
                          className="max-h-[400px] object-contain rounded-lg border border-zinc-800"
                        />
                      )}
                      {viewMode === 'heatmap' && analysisResult && (
                        <img
                          src={analysisResult.heatmapDataUrl}
                          alt="Heatmap"
                          className="max-h-[400px] object-contain rounded-lg border border-amber-500/40 shadow-lg shadow-amber-500/10"
                        />
                      )}
                      {viewMode === 'heatmap' && !analysisResult && (
                        <div className="flex flex-col items-center justify-center text-zinc-500 text-xs gap-2">
                          <Eye className="w-8 h-8 text-zinc-600 animate-pulse" />
                          <span>Klik "Jalankan Inference ML" untuk melihat visualisasi Heatmap</span>
                        </div>
                      )}
                      {viewMode === 'ela' && analysisResult && (
                        <img
                          src={analysisResult.elaDataUrl}
                          alt="Error Level Analysis"
                          className="max-h-[400px] object-contain rounded-lg border border-cyan-500/40"
                        />
                      )}
                    </div>
                  )}
                </div>

                {/* Reverse Timpa & Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleInpaintRestore}
                      disabled={!analysisResult || !analysisResult.isTampered}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-40"
                      title="Hapus kotak penutup dan rekonstruksi latar belakang asli menggunakan inpainting AI"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>Bongkar Timpaan (Reverse Inpaint)</span>
                    </button>
                  </div>

                  <button
                    onClick={handleTransferToStudio}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-semibold border border-zinc-700 transition-all"
                  >
                    <span>Kirim ke Studio untuk Ditimpa Lagi</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>
              </div>

              {/* Right Column: Diagnostic & Comedic Report */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {/* Result Status Banner */}
                {analysisResult ? (
                  <div
                    className={`p-4 rounded-xl border flex flex-col gap-3 ${
                      analysisResult.isTampered
                        ? 'bg-red-500/10 border-red-500/50 text-red-200'
                        : 'bg-emerald-500/10 border-emerald-500/50 text-emerald-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {analysisResult.isTampered ? (
                        <AlertTriangle className="w-6 h-6 text-red-400 shrink-0" />
                      ) : (
                        <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                      )}
                      <div>
                        <div className="text-[10px] uppercase font-bold tracking-wider opacity-75">
                          Hasil Klasifikasi Model ML
                        </div>
                        <h3 className="font-black text-sm text-white">
                          {analysisResult.label}
                        </h3>
                      </div>
                    </div>

                    {/* Confidence Meter */}
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span>Tingkat Kepalsuan / Kecurigaan:</span>
                        <span className="font-mono">{analysisResult.tamperScore}%</span>
                      </div>
                      <div className="w-full bg-zinc-950 h-2.5 rounded-full overflow-hidden border border-zinc-800">
                        <div
                          className={`h-full transition-all duration-500 ${
                            analysisResult.isTampered
                              ? 'bg-gradient-to-r from-orange-500 to-red-500'
                              : 'bg-gradient-to-r from-teal-500 to-emerald-500'
                          }`}
                          style={{ width: `${analysisResult.tamperScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Humorous Verdict */}
                    <div className="p-3 bg-zinc-950/70 rounded-lg border border-zinc-800/80 text-xs italic text-zinc-300">
                      "{analysisResult.humorousVerdict}"
                    </div>
                  </div>
                ) : (
                  <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 text-center flex flex-col items-center justify-center gap-2 text-zinc-400">
                    <Sparkles className="w-8 h-8 text-amber-500/40" />
                    <h3 className="text-sm font-bold text-zinc-200">Menunggu Eksekusi Model</h3>
                    <p className="text-xs text-zinc-500 max-w-xs">
                      Pilih sampel dari dataset di bawah atau gunakan gambar studio, lalu klik "Jalankan Inference ML".
                    </p>
                  </div>
                )}

                {/* Feature Metrics Table */}
                {analysisResult && (
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col gap-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                      Ekstraksi Fitur Citra Forensik
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 flex flex-col">
                        <span className="text-[10px] text-zinc-500">Lonjakan Kotak Seragam</span>
                        <span className="font-mono text-amber-400 font-bold mt-0.5">
                          {analysisResult.metrics.colorUniformitySpike}%
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 flex flex-col">
                        <span className="text-[10px] text-zinc-500">Inkonsistensi Tepi Huruf</span>
                        <span className="font-mono text-amber-400 font-bold mt-0.5">
                          {analysisResult.metrics.edgeInconsistency}%
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 flex flex-col">
                        <span className="text-[10px] text-zinc-500">Delta Artefak JPEG (ELA)</span>
                        <span className="font-mono text-amber-400 font-bold mt-0.5">
                          {analysisResult.metrics.jpegArtifactDelta} px
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 flex flex-col">
                        <span className="text-[10px] text-zinc-500">Varians Entropi Lokal</span>
                        <span className="font-mono text-amber-400 font-bold mt-0.5">
                          {analysisResult.metrics.entropyVariance}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Data Engineer Terminal Log */}
                {analysisResult && (
                  <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 font-mono text-[10px] text-emerald-400 flex flex-col gap-1 overflow-hidden">
                    <div className="flex items-center gap-1.5 text-zinc-500 pb-1 border-b border-zinc-800 text-[9px] uppercase">
                      <Terminal className="w-3 h-3" /> Console Log Data Engineer
                    </div>
                    {analysisResult.engineerLog.map((log, idx) => (
                      <div key={idx} className="truncate">
                        {log}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Dataset Selector at Bottom of Forensic Lab */}
            <div className="flex flex-col gap-3 pt-4 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Uji dengan Sampel Meme Terkurasi (Safe & Halal Dataset):
                </h3>
                <span className="text-[11px] text-zinc-500">Klik untuk langsung menguji</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {MEME_DATASET.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => loadDatasetItem(item)}
                    className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/60 hover:bg-zinc-800/50 text-left transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          item.label === 'TIMPAAN'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {item.label}
                      </span>
                      <h4 className="font-bold text-xs text-zinc-200 group-hover:text-amber-400 transition-colors mt-1.5 line-clamp-2">
                        {item.title}
                      </h4>
                    </div>
                    <span className="text-[10px] text-zinc-500 mt-2 truncate">
                      {item.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: DATA LAKE & SCRAPER PIPELINE ================= */}
        {activeTab === 'pipeline' && (
          <div className="max-w-5xl mx-auto flex flex-col gap-6">
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <Database className="w-5 h-5 text-amber-400" />
                  <span>Pipeline Data Harvesting & Ingestion Meme</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Arsitektur data engineering untuk mengais gambar meme publik yang aman, menyaring konten pantas (SFW), dan menyimpan fitur ke data lake Parquet.
                </p>
              </div>

              <button
                onClick={handleTriggerScraper}
                disabled={isScraping}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScraping ? 'animate-spin' : ''}`} />
                <span>{isScraping ? 'Mengais Meme...' : 'Scrape Meme Baru Sekarang'}</span>
              </button>
            </div>

            {/* Pipeline Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">Total Sample Lake</span>
                <h3 className="text-2xl font-black text-amber-400 mt-1">{datasetCount.toLocaleString()}</h3>
                <span className="text-[11px] text-emerald-400 font-medium">+42 sampel hari ini</span>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">Distribusi Kelas</span>
                <h3 className="text-2xl font-black text-zinc-200 mt-1">62% / 38%</h3>
                <span className="text-[11px] text-zinc-400">Timpaan vs Asli</span>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">Quality & SFW Filter</span>
                <h3 className="text-2xl font-black text-emerald-400 mt-1">100% Halal</h3>
                <span className="text-[11px] text-zinc-400">Lulus sensor UU ITE</span>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">Latency ETL Ingest</span>
                <h3 className="text-2xl font-black text-cyan-400 mt-1">48 ms</h3>
                <span className="text-[11px] text-zinc-400">Batch processing cepat</span>
              </div>
            </div>

            {/* Live Terminal Scraper Logs */}
            <div className="flex flex-col gap-2 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs">
                <div className="flex items-center gap-2 text-zinc-400 font-mono">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Stream Log: /var/log/kangtimpa_scraper.log</span>
                </div>
                <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> PIPELINE ONLINE
                </span>
              </div>

              <div className="font-mono text-xs flex flex-col gap-2 max-h-64 overflow-y-auto py-2">
                {scrapeLogs.map((log, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-zinc-300">
                    <span className="text-zinc-600 shrink-0">[{log.timestamp}]</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                        log.status === 'EXTRACTING'
                          ? 'bg-blue-500/20 text-blue-400'
                          : log.status === 'TRANSFORMING'
                          ? 'bg-amber-500/20 text-amber-400'
                          : log.status === 'MEME_DETECTED'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {log.status}
                    </span>
                    <span className="text-zinc-400 shrink-0 font-semibold">{log.source}:</span>
                    <span className="text-zinc-200">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: MODEL METRICS & MLOps ================= */}
        {activeTab === 'metrics' && (
          <div className="max-w-5xl mx-auto flex flex-col gap-6">
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-400" />
                  <span>Evaluasi Performa & Matrix Model Kang Timpa</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Arsitektur Convolutional Heuristic + Error Level Analysis. Dilatih menggunakan ribuan sampel meme nusantara.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs border border-amber-500/30">
                Accuracy: 98.7%
              </span>
            </div>

            {/* Confusion Matrix Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col gap-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Confusion Matrix (Matriks Kebingungan Kang Timpa)
                </h3>
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">True Positive (98.4%)</span>
                    <span className="text-lg font-black text-white mt-1">Kang Timpa Terciduk</span>
                    <p className="text-[10px] text-zinc-400 mt-1">Editan berhasil terdeteksi dengan tepat</p>
                  </div>
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex flex-col">
                    <span className="text-[10px] text-red-400 font-bold uppercase">False Alarm (1.2%)</span>
                    <span className="text-lg font-black text-white mt-1">Warga Difitnah</span>
                    <p className="text-[10px] text-zinc-400 mt-1">Gambar asli dituduh hasil editan</p>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col">
                    <span className="text-[10px] text-amber-400 font-bold uppercase">False Negative (1.6%)</span>
                    <span className="text-lg font-black text-white mt-1">Kang Timpa Lolos</span>
                    <p className="text-[10px] text-zinc-400 mt-1">Editannya terlalu jago & rapi</p>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 flex flex-col">
                    <span className="text-[10px] text-blue-400 font-bold uppercase">True Negative (98.8%)</span>
                    <span className="text-lg font-black text-white mt-1">Asli Bersertifikat</span>
                    <p className="text-[10px] text-zinc-400 mt-1">Memang asli murni tanpa rekayasa</p>
                  </div>
                </div>
              </div>

              {/* Data Engineer Catatan Hyperparameters */}
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col gap-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Catatan Hyperparameter Data Engineer
                </h3>
                <div className="flex flex-col gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 flex justify-between">
                    <span className="text-zinc-400">Arsitektur Model</span>
                    <span className="font-mono text-amber-400 font-semibold">KangTimpa-CV-ResNet v2.4</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 flex justify-between">
                    <span className="text-zinc-400">Learning Rate</span>
                    <span className="font-mono text-amber-400 font-semibold">0.001 (disetel sambil ngopi)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 flex justify-between">
                    <span className="text-zinc-400">Batch Size</span>
                    <span className="font-mono text-amber-400 font-semibold">32 bungkus gorengan</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-800 flex justify-between">
                    <span className="text-zinc-400">Loss Function</span>
                    <span className="font-mono text-amber-400 font-semibold">Cross-Entropy + Anti-Hoaks Penalty</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 text-[11px] text-zinc-400 italic">
                  💡 Catatan Insinyur: "Satu-satunya kelemahan model ini adalah jika Kang Timpa memakai kuas dengan tingkat kesabaran di atas rata-rata warganet biasa."
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
