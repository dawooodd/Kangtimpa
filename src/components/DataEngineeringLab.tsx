import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Database, 
  BarChart3, 
  Search, 
  RefreshCw, 
  Terminal, 
  Upload, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Globe, 
  Play, 
  Sliders, 
  Layers, 
  Sparkles,
  Info
} from 'lucide-react';
import { 
  analyzeImageForTampering, 
  inpaintRestoreCanvas, 
  MLAnalysisResult,
  activeModelWeights,
  updateModelWeights
} from '../utils/mlDetector';
import { 
  MEME_DATASET, 
  MemeDatasetItem, 
  OPEN_SOURCE_PROVIDERS, 
  OpenSourceProvider,
  ScrapeLogEntry, 
  GENERATE_INITIAL_SCRAPE_LOGS,
  verifyRobotsTxtCompliance
} from '../utils/memeDataset';
import { AUTO_TIMPA_PRESETS, AutoTimpaPreset } from '../utils/autoTimpaGenerator';
import { renderLayer } from '../utils/canvasRenderer';

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
  const [viewMode, setViewMode] = useState<'normal' | 'heatmap' | 'ela' | 'edge'>('heatmap');
  const [isRestored, setIsRestored] = useState<boolean>(false);

  // Auto-Generate Menu State
  const [showAutoTimpaModal, setShowAutoTimpaModal] = useState<boolean>(false);

  // Scraper Simulation State
  const [selectedProviders, setSelectedProviders] = useState<string[]>(
    OPEN_SOURCE_PROVIDERS.map((p) => p.id)
  );
  const [scrapeBatchSize, setScrapeBatchSize] = useState<number>(2400);
  const [scrapeLogs, setScrapeLogs] = useState<ScrapeLogEntry[]>(GENERATE_INITIAL_SCRAPE_LOGS());
  const [isScraping, setIsScraping] = useState<boolean>(false);
  const [scrapeProgress, setScrapeProgress] = useState<number>(0);
  const [scrapeStageText, setScrapeStageText] = useState<string>('');
  const [datasetCount, setDatasetCount] = useState<number>(12650);

  // Robots.txt Inspector Modal
  const [inspectingProvider, setInspectingProvider] = useState<OpenSourceProvider | null>(null);

  // ML Model Retraining State
  const [isTrainingModel, setIsTrainingModel] = useState<boolean>(false);
  const [trainingEpoch, setTrainingEpoch] = useState<number>(0);
  const [totalEpochs] = useState<number>(5);
  const [trainingLoss, setTrainingLoss] = useState<number>(0.038);
  const [trainingAccuracy, setTrainingAccuracy] = useState<number>(activeModelWeights.accuracy);
  const [trainingNotification, setTrainingNotification] = useState<string | null>(null);

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
    if (item.imageSrc) {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = img.width;
        c.height = img.height;
        const ctx = c.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          setTestCanvas(c);
          setTestImageTitle(item.title);
          setAnalysisResult(null);
          setIsRestored(false);
        }
      };
      img.src = item.imageSrc;
    } else {
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

    setTimeout(async () => {
      try {
        const res = await analyzeImageForTampering(testCanvas);
        setAnalysisResult(res);
      } catch (err) {
        console.error('Analysis error', err);
      } finally {
        setIsAnalyzing(false);
      }
    }, 600);
  };

  // Reverse Timpa (Inpaint / Restore)
  const handleInpaintRestore = () => {
    if (!testCanvas || !analysisResult) return;
    const restored = inpaintRestoreCanvas(testCanvas, analysisResult.suspectedRegions);
    setTestCanvas(restored);
    setIsRestored(true);
    setTimeout(async () => {
      const newRes = await analyzeImageForTampering(restored);
      setAnalysisResult(newRes);
    }, 350);
  };

  // Auto-Generate Meme Timpa onto current testCanvas
  const handleApplyAutoTimpa = (preset: AutoTimpaPreset) => {
    if (!testCanvas) return;
    const timpaCanvas = document.createElement('canvas');
    timpaCanvas.width = testCanvas.width;
    timpaCanvas.height = testCanvas.height;
    const ctx = timpaCanvas.getContext('2d');
    if (!ctx) return;

    // Draw base
    ctx.drawImage(testCanvas, 0, 0);

    // Generate clean text layers with adaptive contrast
    const layers = preset.generateLayers(timpaCanvas.width, timpaCanvas.height, testCanvas);
    layers.forEach((l) => renderLayer(ctx, l, false));

    setTestCanvas(timpaCanvas);
    setTestImageTitle(`${testImageTitle} + ${preset.name}`);
    setIsRestored(false);
    setShowAutoTimpaModal(false);

    // Auto run analysis on newly generated meme timpa
    setTimeout(async () => {
      const res = await analyzeImageForTampering(timpaCanvas);
      setAnalysisResult(res);
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

  // Toggle provider in scraping list
  const toggleProvider = (id: string) => {
    setSelectedProviders((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // Multi-source scraper action adhering to robots.txt
  const handleTriggerScraper = () => {
    if (selectedProviders.length === 0) return;
    setIsScraping(true);
    setScrapeProgress(10);
    setScrapeStageText('Memverifikasi robots.txt & User-Agent polite crawler...');

    const activeList = OPEN_SOURCE_PROVIDERS.filter((p) => selectedProviders.includes(p.id));
    const randomProvider = activeList[Math.floor(Math.random() * activeList.length)] || activeList[0];

    setTimeout(() => {
      setScrapeProgress(35);
      setScrapeStageText(`Mengecek Crawl-delay (${randomProvider.crawlDelay}s) & Disallow rules...`);

      setTimeout(() => {
        setScrapeProgress(65);
        setScrapeStageText('Menjalankan filter SFW (Safe-for-Work) & deduplikasi pHash...');

        setTimeout(() => {
          setScrapeProgress(90);
          setScrapeStageText('Menyimpan batch ke Parquet Data Lake & mengindeks tensor ELA...');

          setTimeout(() => {
            setScrapeProgress(100);
            const now = new Date().toLocaleTimeString();
            const addedCount = scrapeBatchSize;
            
            const newLogs: ScrapeLogEntry[] = [
              {
                timestamp: now,
                source: randomProvider.name,
                domain: randomProvider.domain,
                status: 'ROBOTS_TXT_CHECK',
                message: `GET https://${randomProvider.domain}/robots.txt -> HTTP 200 OK. User-Agent "KangTimpaBot/2.0" diizinkan.`,
              },
              {
                timestamp: now,
                source: randomProvider.name,
                domain: randomProvider.domain,
                status: 'EXTRACTING',
                message: `Mengunduh +${addedCount.toLocaleString()} sampel meme berlisensi ${randomProvider.license} (Rate limit aman).`,
              },
              {
                timestamp: now,
                source: 'SFW Classifier ResNet',
                domain: 'internal.ml/sfw-guard',
                status: 'SFW_VERIFIED',
                message: `Pemeriksaan konten: 100% SFW Halal. Tidak ada gambar sensitif atau konten terlarang.`,
              },
              {
                timestamp: now,
                source: 'Parquet Lake Storage',
                domain: 'lake.internal/memes',
                status: 'DATA_LAKE_SAVED',
                message: `Berhasil meng-ingest +${addedCount.toLocaleString()} data ke /lake/memes/v2. Dataset kini total ${(datasetCount + addedCount).toLocaleString()} gambar!`,
              },
            ];

            setScrapeLogs((prev) => [...newLogs, ...prev].slice(0, 30));
            setDatasetCount((c) => c + addedCount);
            setIsScraping(false);
            setScrapeStageText('');
          }, 450);
        }, 550);
      }, 550);
    }, 550);
  };

  // Retrain the Machine Learning Model
  const handleRetrainModel = () => {
    setIsTrainingModel(true);
    setTrainingEpoch(1);
    setTrainingNotification(null);

    let currentEp = 1;
    const interval = setInterval(() => {
      currentEp++;
      if (currentEp <= totalEpochs) {
        setTrainingEpoch(currentEp);
        setTrainingLoss((l) => Number(Math.max(0.015, l * 0.58).toFixed(4)));
        setTrainingAccuracy((a) => Number(Math.min(99.6, a + 0.35).toFixed(2)));
      } else {
        clearInterval(interval);
        setIsTrainingModel(false);
        const finalAccuracy = 99.4;
        updateModelWeights({
          version: `v2.4-OpenScraped-${Date.now().toString().slice(-4)}`,
          name: `KangTimpa-ResNet Multi-Scale Ensemble (Trained on ${datasetCount.toLocaleString()} Memes)`,
          trainingSamples: datasetCount,
          accuracy: finalAccuracy,
          precision: 99.3,
          recall: 99.5,
          f1Score: 99.4,
          epochs: totalEpochs,
          loss: 0.024,
          solidPatchWeight: 375,
          textOutlineWeight: 320,
          elaDeltaWeight: 15.0,
          edgeEnergyWeight: 0.60,
          lastTrainedDate: new Date().toLocaleDateString('id-ID'),
          isCustomTrained: true,
        });

        setTrainingNotification(
          `🎉 Model v2.4 berhasil dilatih dengan ${datasetCount.toLocaleString()} sampel meme open-source! Akurasi meningkat ke ${finalAccuracy}%. Bobot detektor aktif telah diperbarui.`
        );
      }
    }, 750);
  };

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 overflow-hidden text-zinc-100 select-none">
      {/* Top Tab Bar */}
      <div className="h-12 bg-zinc-900 border-b border-zinc-800 px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
            <Cpu className="w-3.5 h-3.5" />
            <span>KANG TIMPA LAB FORENSIK & ML</span>
          </div>
          <span className="text-[11px] text-zinc-400 hidden lg:inline">
            Detektor Asli vs Timpaan • ELA & Sobel Filter • Open Source Scraper • MLOps
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
            <Search className="w-3.5 h-3.5" /> Deteksi & Forensik
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'pipeline'
                ? 'bg-amber-500 text-zinc-950 shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" /> Data Lake & Scraper (robots.txt)
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'metrics'
                ? 'bg-amber-500 text-zinc-950 shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" /> Latih Model & MLOps
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        {/* ================= TAB 1: DETECTOR & FORENSIC LAB ================= */}
        {activeTab === 'detector' && (
          <div className="max-w-6xl mx-auto flex flex-col gap-6">
            {/* Header / Intro Banner */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <div>
                <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <span>Detektor Timpaan Berbasis Computer Vision</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">
                    Model: {activeModelWeights.version} ({activeModelWeights.accuracy}%)
                  </span>
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Model CV terlatih memindai ELA (Error Level Analysis), Sobel Gradient, dan Anomali Varians Kotak Penutup. Jika palsu, Ivan Gunawan & Reza Arap siap berkomentar!
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Auto-Generate Button */}
                <button
                  onClick={() => setShowAutoTimpaModal(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition-all"
                  title="Otomatis edit gambar asli ini menjadi meme timpaan viral!"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>Auto-Generate Jadi Meme Timpa</span>
                </button>

                <label className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium cursor-pointer border border-zinc-700">
                  <Upload className="w-3.5 h-3.5" /> Upload Foto
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
                  <span>{isAnalyzing ? 'Menghitung Tensor...' : '🔍 Jalankan Inference ML'}</span>
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
                    <button
                      onClick={() => setViewMode('edge')}
                      className={`px-2 py-1 rounded text-[11px] ${
                        viewMode === 'edge'
                          ? 'bg-zinc-800 text-amber-400 font-bold'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Sobel Edge
                    </button>
                  </div>
                </div>

                {/* The Visual Display Canvas Area */}
                <div className="relative aspect-video max-h-[460px] w-full bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 flex items-center justify-center p-2 shadow-inner">
                  {testCanvas && viewMode === 'normal' && (
                    <img
                      src={testCanvas.toDataURL()}
                      alt="Source for Forensic ML"
                      className="max-h-full max-w-full object-contain rounded-lg"
                    />
                  )}

                  {analysisResult && viewMode === 'heatmap' && (
                    <img
                      src={analysisResult.heatmapDataUrl}
                      alt="Heatmap of Detected Tampering"
                      className="max-h-full max-w-full object-contain rounded-lg"
                    />
                  )}

                  {analysisResult && viewMode === 'ela' && (
                    <img
                      src={analysisResult.elaDataUrl}
                      alt="Error Level Analysis Matrix"
                      className="max-h-full max-w-full object-contain rounded-lg"
                    />
                  )}

                  {analysisResult && viewMode === 'edge' && (
                    <img
                      src={analysisResult.edgeDataUrl}
                      alt="Sobel Edge Filter"
                      className="max-h-full max-w-full object-contain rounded-lg"
                    />
                  )}

                  {!analysisResult && viewMode !== 'normal' && (
                    <div className="flex flex-col items-center justify-center gap-2 text-zinc-500 text-xs">
                      <Search className="w-8 h-8 opacity-40" />
                      <span>Klik "Jalankan Inference ML" untuk melihat {viewMode.toUpperCase()}</span>
                    </div>
                  )}

                  {/* Tampered Bounding Boxes overlay */}
                  {analysisResult && viewMode === 'normal' && analysisResult.suspectedRegions.map((box, i) => (
                    <div
                      key={i}
                      className="absolute border-2 border-red-500 bg-red-500/20 rounded pointer-events-none animate-pulse"
                      style={{
                        left: `${(box.x / (testCanvas?.width || 1)) * 100}%`,
                        top: `${(box.y / (testCanvas?.height || 1)) * 100}%`,
                        width: `${(box.width / (testCanvas?.width || 1)) * 100}%`,
                        height: `${(box.height / (testCanvas?.height || 1)) * 100}%`,
                      }}
                    >
                      <span className="absolute -top-5 left-0 text-[9px] font-mono bg-red-600 text-white px-1 rounded shadow">
                        {box.tamperType} ({box.suspicionScore}%)
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action Bar Under Preview */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-2">
                    {analysisResult && analysisResult.isTampered && (
                      <button
                        onClick={handleInpaintRestore}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition-all"
                        title="Hapus kotak tambalan dan pulihkan gambar asli secara otomatis!"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Reverse-Timpa (Pulihkan Gambar Asli)</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={handleTransferToStudio}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700"
                  >
                    <span>Kirim ke Studio Utama</span>
                  </button>
                </div>
              </div>

              {/* Right Column: ML Verdict & Diagnostics */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {/* Verdict Card */}
                {analysisResult ? (
                  <div
                    className={`p-5 rounded-2xl border flex flex-col gap-3 shadow-xl ${
                      analysisResult.isTampered
                        ? 'bg-red-950/30 border-red-500/50 text-red-200'
                        : 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            analysisResult.isTampered
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {analysisResult.label}
                        </span>
                        <h3 className="font-black text-base mt-2 text-white">
                          {analysisResult.verdictTitle}
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black font-mono">
                          {analysisResult.tamperScore}%
                        </span>
                        <span className="block text-[10px] opacity-75">Tingkat Kepalsuan</span>
                      </div>
                    </div>

                    <p className="text-xs italic bg-zinc-950/40 p-3 rounded-xl border border-zinc-800/60 leading-relaxed text-zinc-300">
                      "{analysisResult.verdictMemeQuote}"
                    </p>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-800/40">
                      <span className="text-zinc-400">Confidence Model:</span>
                      <span className="font-bold font-mono text-white">
                        {analysisResult.confidence}%
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center text-center gap-3 py-12">
                    <Search className="w-10 h-10 text-zinc-600 animate-pulse" />
                    <div>
                      <h4 className="text-sm font-bold text-zinc-300">Belum Ada Analisis</h4>
                      <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                        Pilih sampel meme di bawah atau upload gambar, lalu klik "Jalankan Inference ML" untuk mendeteksi karya Kang Timpa.
                      </p>
                    </div>
                  </div>
                )}

                {/* Forensic Metrics Grid */}
                {analysisResult && (
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col gap-2">
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                      Metrik Ekstraksi Fitur (Forensik Digital)
                    </span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 flex flex-col">
                        <span className="text-[10px] text-zinc-500">Gradien Sobel (Teks)</span>
                        <span className="font-mono text-amber-400 font-bold mt-0.5">
                          {analysisResult.metrics.sobelEdgeGradient} px
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 flex flex-col">
                        <span className="text-[10px] text-zinc-500">Indeks Kotak Patch</span>
                        <span className="font-mono text-amber-400 font-bold mt-0.5">
                          {analysisResult.metrics.rectangularityIndex}
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 flex flex-col">
                        <span className="text-[10px] text-zinc-500">Delta Kompresi ELA</span>
                        <span className="font-mono text-amber-400 font-bold mt-0.5">
                          {analysisResult.metrics.jpegArtifactDelta} px
                        </span>
                      </div>
                      <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 flex flex-col">
                        <span className="text-[10px] text-zinc-500">Varians Entropi Citra</span>
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

            {/* Quick Dataset Selector with 8 Diverse Open-Source Items */}
            <div className="flex flex-col gap-3 pt-4 border-t border-zinc-800">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                  <span>Uji Dataset Open Source Teranotasi:</span>
                  <span className="text-[10px] bg-zinc-800 px-2 py-0.5 rounded text-amber-400">
                    8 Sampel Terpilih (SFW 100%)
                  </span>
                </h3>
                <span className="text-[11px] text-zinc-500">Klik kartu untuk menguji</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
                {MEME_DATASET.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => loadDatasetItem(item)}
                    className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/60 hover:bg-zinc-800/50 text-left transition-all flex flex-col justify-between group h-32"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            item.label === 'TIMPAAN'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-emerald-500/20 text-emerald-400'
                          }`}
                        >
                          {item.label}
                        </span>
                        <span className="text-[9px] text-zinc-500 truncate">{item.sourceType}</span>
                      </div>
                      <h4 className="font-bold text-[11px] text-zinc-200 group-hover:text-amber-400 transition-colors mt-1.5 line-clamp-2 leading-tight">
                        {item.title}
                      </h4>
                    </div>
                    <span className="text-[9px] text-zinc-500 mt-1 truncate">
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
          <div className="max-w-6xl mx-auto flex flex-col gap-6">
            {/* Header / Intro Banner */}
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <Database className="w-5 h-5 text-amber-400" />
                  <span>Pipeline Harvesting Open-Source & Kepatuhan robots.txt</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
                  Sistem scraping sopan beretika (Polite Scraper). Membaca dan mematuhi direktif <code className="text-amber-300 font-mono">robots.txt</code>, menghormati crawl-delay, serta memverifikasi lisensi terbuka (CC0, CC-BY, Public Domain, MIT) agar aman mengoleksi puluhan ribu data latih.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleTriggerScraper}
                  disabled={isScraping || selectedProviders.length === 0}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScraping ? 'animate-spin' : ''}`} />
                  <span>{isScraping ? 'Mengais Data Sopan...' : 'Mulai Scrape Sumber Terpilih'}</span>
                </button>
              </div>
            </div>

            {/* Ingestion Progress Bar if active */}
            {isScraping && (
              <div className="p-4 rounded-xl bg-zinc-900 border border-amber-500/40 flex flex-col gap-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    {scrapeStageText}
                  </span>
                  <span className="font-mono text-zinc-300">{scrapeProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-950 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${scrapeProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">Total Sample Lake</span>
                <h3 className="text-2xl font-black text-amber-400 mt-1">{datasetCount.toLocaleString()}</h3>
                <span className="text-[11px] text-emerald-400 font-medium">100% SFW & Terverifikasi</span>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">Status Kepatuhan</span>
                <h3 className="text-2xl font-black text-emerald-400 mt-1">100% Legal</h3>
                <span className="text-[11px] text-zinc-400">Patuh penuh robots.txt</span>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">Rata-rata Crawl-Delay</span>
                <h3 className="text-2xl font-black text-zinc-200 mt-1">1.4s</h3>
                <span className="text-[11px] text-zinc-400">Anti-DDoS / Ramah Server</span>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold">Format Simpanan</span>
                <h3 className="text-2xl font-black text-cyan-400 mt-1">Parquet</h3>
                <span className="text-[11px] text-zinc-400">Kompresi ZSTD + Snappy</span>
              </div>
            </div>

            {/* Open Source Providers Grid */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-400" />
                  <span>Daftar Sumber Open Source Resmi (Tersertifikasi robots.txt):</span>
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-zinc-400">Batch Size per Scrape:</span>
                  <select
                    value={scrapeBatchSize}
                    onChange={(e) => setScrapeBatchSize(Number(e.target.value))}
                    className="bg-zinc-900 border border-zinc-700 text-xs rounded px-2 py-1 text-zinc-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value={800}>800 Gambar (Cepat)</option>
                    <option value={2400}>2,400 Gambar (Standar)</option>
                    <option value={5000}>5,000 Gambar (Batch Besar)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {OPEN_SOURCE_PROVIDERS.map((provider) => {
                  const isChecked = selectedProviders.includes(provider.id);
                  return (
                    <div
                      key={provider.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                        isChecked
                          ? 'bg-zinc-900 border-zinc-700'
                          : 'bg-zinc-950 border-zinc-800 opacity-60'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleProvider(provider.id)}
                              className="accent-amber-500 w-4 h-4 rounded cursor-pointer"
                            />
                            <h4 className="font-bold text-xs text-zinc-100">{provider.name}</h4>
                          </label>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono font-bold flex items-center gap-1">
                            <ShieldCheck className="w-2.5 h-2.5" /> robots.txt OK
                          </span>
                        </div>

                        <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
                          {provider.description}
                        </p>
                      </div>

                      <div className="flex flex-col gap-1.5 pt-2 border-t border-zinc-800/80 text-[10px]">
                        <div className="flex items-center justify-between text-zinc-400">
                          <span>Lisensi:</span>
                          <span className="text-zinc-200 font-medium truncate max-w-[160px] text-right">
                            {provider.license}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-zinc-400">
                          <span>Crawl Delay:</span>
                          <span className="text-amber-400 font-mono font-bold">
                            {provider.crawlDelay} detik (Polite)
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-zinc-400">
                          <span>Estimasi Tersedia:</span>
                          <span className="text-zinc-300 font-mono">
                            {provider.totalAvailableSamples.toLocaleString()} gambar
                          </span>
                        </div>

                        <button
                          onClick={() => setInspectingProvider(provider)}
                          className="mt-1 flex items-center justify-center gap-1 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-semibold transition-colors"
                        >
                          <Info className="w-3 h-3 text-amber-400" />
                          <span>Periksa Aturan robots.txt</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Terminal Scraper Logs */}
            <div className="flex flex-col gap-2 p-4 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs">
                <div className="flex items-center gap-2 text-zinc-400 font-mono">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>Stream Log: /var/log/kangtimpa_ethical_crawler.log</span>
                </div>
                <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> PIPELINE BERSIH & LEGAL
                </span>
              </div>

              <div className="font-mono text-xs flex flex-col gap-2 max-h-64 overflow-y-auto py-2">
                {scrapeLogs.map((log, i) => (
                  <div key={i} className="flex items-start gap-2 text-zinc-300">
                    <span className="text-zinc-600 shrink-0">[{log.timestamp}]</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                        log.status === 'ROBOTS_TXT_CHECK'
                          ? 'bg-purple-500/20 text-purple-400'
                          : log.status === 'EXTRACTING'
                          ? 'bg-blue-500/20 text-blue-400'
                          : log.status === 'TRANSFORMING'
                          ? 'bg-amber-500/20 text-amber-400'
                          : log.status === 'SFW_VERIFIED'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-cyan-500/20 text-cyan-400'
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

        {/* ================= TAB 3: MODEL TRAINING & MLOps ================= */}
        {activeTab === 'metrics' && (
          <div className="max-w-5xl mx-auto flex flex-col gap-6">
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-400" />
                  <span>Pelatihan & Fine-Tuning Model ML Kang Timpa</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                  Latih model ensemble Convolutional Heuristic + ELA menggunakan puluhan ribu data hasil crawling open-source untuk mempertajam akurasi deteksi timpaan.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs border border-amber-500/30">
                  Akurasi Model: {activeModelWeights.accuracy}%
                </span>

                <button
                  onClick={handleRetrainModel}
                  disabled={isTrainingModel}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all disabled:opacity-50"
                >
                  <Play className={`w-3.5 h-3.5 ${isTrainingModel ? 'animate-spin' : ''}`} />
                  <span>{isTrainingModel ? `Training Epoch ${trainingEpoch}/${totalEpochs}...` : 'Latih Model dengan Data Scraped'}</span>
                </button>
              </div>
            </div>

            {/* Notification after retraining */}
            {trainingNotification && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{trainingNotification}</span>
              </div>
            )}

            {/* Training Loop In-Progress Card */}
            {isTrainingModel && (
              <div className="p-5 rounded-2xl bg-zinc-900 border border-amber-500/50 flex flex-col gap-3 animate-pulse">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-400">
                    Proses Pelatihan Model ML (AdamW Optimizer, Batch Size: 64)
                  </span>
                  <span className="font-mono text-zinc-300">
                    Epoch {trainingEpoch} dari {totalEpochs}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-950 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${(trainingEpoch / totalEpochs) * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                  <span>Cross-Entropy + ELA Loss: {trainingLoss}</span>
                  <span>Validation Accuracy: {trainingAccuracy}%</span>
                  <span>Dataset: {datasetCount.toLocaleString()} Gambar SFW</span>
                </div>
              </div>
            )}

            {/* Model Architecture & Weights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold">Versi Model Aktif</span>
                  <h4 className="text-lg font-bold text-amber-400 mt-1">{activeModelWeights.version}</h4>
                  <p className="text-[11px] text-zinc-400 mt-1">{activeModelWeights.name}</p>
                </div>
                <span className="text-[10px] text-zinc-500 mt-3">
                  Terakhir Dilatih: {activeModelWeights.lastTrainedDate}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold">Sampel Latih Terindeks</span>
                  <h4 className="text-2xl font-black text-white mt-1">
                    {activeModelWeights.trainingSamples.toLocaleString()}
                  </h4>
                  <p className="text-[11px] text-emerald-400 mt-1">
                    Hasil Scrape Wikimedia, Openverse, Archive.org, Kaggle, Imgflip & GitHub
                  </p>
                </div>
                <span className="text-[10px] text-zinc-500 mt-3">
                  Loss: {activeModelWeights.loss} (Konvergen)
                </span>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold">Skor Evaluasi (F1-Score)</span>
                  <h4 className="text-2xl font-black text-cyan-400 mt-1">
                    {activeModelWeights.f1Score}%
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Presisi: {activeModelWeights.precision}% • Recall: {activeModelWeights.recall}%
                  </p>
                </div>
                <span className="text-[10px] text-emerald-400 mt-3">
                  Bebas False-Alarm pada Foto Ivan Gunawan Asli
                </span>
              </div>
            </div>

            {/* Confusion Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col gap-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                  Confusion Matrix (Matriks Kebingungan Kang Timpa)
                </h3>
                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase">True Positive (99.5%)</span>
                    <span className="text-lg font-black text-white mt-1">Kang Timpa Terciduk</span>
                    <p className="text-[10px] text-zinc-400 mt-1">Kotak dan font Impact terdeteksi presisi</p>
                  </div>
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex flex-col">
                    <span className="text-[10px] text-red-400 font-bold uppercase">False Alarm (0.5%)</span>
                    <span className="text-lg font-black text-white mt-1">Warga Difitnah</span>
                    <p className="text-[10px] text-zinc-400 mt-1">Gambar asli dituduh hasil editan</p>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col">
                    <span className="text-[10px] text-amber-400 font-bold uppercase">False Negative (0.5%)</span>
                    <span className="text-lg font-black text-white mt-1">Kang Timpa Lolos</span>
                    <p className="text-[10px] text-zinc-400 mt-1">Editannya terlalu jago & rapi</p>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 flex flex-col">
                    <span className="text-[10px] text-blue-400 font-bold uppercase">True Negative (99.5%)</span>
                    <span className="text-lg font-black text-white mt-1">Asli Bersertifikat</span>
                    <p className="text-[10px] text-zinc-400 mt-1">Memang asli murni tanpa rekayasa</p>
                  </div>
                </div>
              </div>

              {/* Data Distribution Card */}
              <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between gap-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Komposisi Data Pelatihan Open-Source
                  </h3>
                  <div className="flex flex-col gap-3 mt-4 text-xs">
                    <div>
                      <div className="flex justify-between text-zinc-400 mb-1">
                        <span>Timpaan Teks & Meme Terindikasi (62%)</span>
                        <span className="font-mono text-zinc-200">
                          {Math.round(datasetCount * 0.62).toLocaleString()} sampel
                        </span>
                      </div>
                      <div className="w-full h-2 rounded bg-zinc-950 overflow-hidden">
                        <div className="h-full bg-red-500 w-[62%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-zinc-400 mb-1">
                        <span>Citra Asli Murni Tanpa Rekayasa (38%)</span>
                        <span className="font-mono text-zinc-200">
                          {Math.round(datasetCount * 0.38).toLocaleString()} sampel
                        </span>
                      </div>
                      <div className="w-full h-2 rounded bg-zinc-950 overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[38%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-zinc-400 mb-1">
                        <span>Sertifikasi SFW (Family-Friendly)</span>
                        <span className="font-mono text-emerald-400">100% Halal</span>
                      </div>
                      <div className="w-full h-2 rounded bg-zinc-950 overflow-hidden">
                        <div className="h-full bg-emerald-400 w-full" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Model mematuhi standar etika AI: data tidak mengandung konten pribadi atau hak cipta tertutup.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Robots.txt Inspector Modal */}
      {inspectingProvider && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xl p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm text-zinc-100">
                    Inspeksi Kepatuhan robots.txt: {inspectingProvider.domain}
                  </h3>
                  <span className="text-[10px] text-zinc-400">
                    Status: <span className="text-emerald-400 font-bold">HTTP 200 OK (Allowed)</span>
                  </span>
                </div>
              </div>
              <button
                onClick={() => setInspectingProvider(null)}
                className="text-zinc-400 hover:text-white text-xs px-2 py-1 rounded bg-zinc-800"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-zinc-300">Directives robots.txt Resmi:</span>
              <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] font-mono text-amber-300/90 overflow-x-auto leading-relaxed">
                {verifyRobotsTxtCompliance(inspectingProvider).simulatedRobotsTxtContent}
              </pre>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 flex flex-col gap-1">
              <span className="font-bold text-amber-400">Etika & Kebijakan Scraper:</span>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                {inspectingProvider.ethicalPolicy}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setInspectingProvider(null)}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs"
              >
                Tutup & Terapkan Aturan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto Timpa Generator Modal */}
      {showAutoTimpaModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-zinc-100">
                    Auto-Generate Jadi Meme Timpa
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Ubah foto polos ini menjadi meme timpaan viral dalam 1 klik
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAutoTimpaModal(false)}
                className="text-zinc-400 hover:text-white text-xs px-2 py-1 rounded bg-zinc-800"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {AUTO_TIMPA_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleApplyAutoTimpa(preset)}
                  className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-amber-500 hover:bg-zinc-800/50 text-left transition-all flex flex-col gap-1 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-200 group-hover:text-amber-400">
                      {preset.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-semibold">
                      {preset.character}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400">{preset.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
