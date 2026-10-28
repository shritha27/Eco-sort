import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  QrCode,
  Printer,
  Copy,
  ExternalLink,
  Info,
  CheckCircle2,
  Trash2,
  Sparkles,
} from 'lucide-react';

interface BinPreset {
  id: string;
  name: string;
  colorName: string;
  badgeBg: string;
  textColor: string;
  borderColor: string;
  category: string;
  binColor: string;
  shortInstruction: string;
  acceptedSummary: string;
}

const BIN_PRESETS: BinPreset[] = [
  {
    id: 'wet',
    name: 'Organic Wet Waste Bin',
    category: 'Wet / Biodegradable',
    binColor: 'Green Bin',
    colorName: 'Emerald',
    badgeBg: 'bg-emerald-50',
    textColor: 'text-emerald-900',
    borderColor: 'border-emerald-500',
    shortInstruction: 'Food scraps, fruit peels, tea leaves. No plastic bags or wrappers!',
    acceptedSummary: 'Compostable organic matter for campus vermicomposting.'
  },
  {
    id: 'dry',
    name: 'Dry Recyclables Bin',
    category: 'Dry Recyclable',
    binColor: 'Blue Bin',
    colorName: 'Blue',
    badgeBg: 'bg-blue-50',
    textColor: 'text-blue-900',
    borderColor: 'border-blue-500',
    shortInstruction: 'Clean paper, flattened cardboard, empty plastic bottles, aluminum cans.',
    acceptedSummary: 'Empty and rinse clean before dropping.'
  },
  {
    id: 'ewaste',
    name: 'Campus E-Waste Station',
    category: 'Electronic Waste',
    binColor: 'Purple Bin',
    colorName: 'Purple',
    badgeBg: 'bg-purple-50',
    textColor: 'text-purple-900',
    borderColor: 'border-purple-500',
    shortInstruction: 'Broken chargers, old earphones, phones, cables, circuit boards.',
    acceptedSummary: 'Authorized recovery of precious and hazardous metals.'
  },
  {
    id: 'hazardous',
    name: 'Domestic Hazardous Box',
    category: 'Domestic Hazardous',
    binColor: 'Amber Bin',
    colorName: 'Amber',
    badgeBg: 'bg-amber-50',
    textColor: 'text-amber-900',
    borderColor: 'border-amber-500',
    shortInstruction: 'Tape battery terminals. Handle CFL bulbs with care.',
    acceptedSummary: 'Toxic metals; keep out of landfills.'
  },
  {
    id: 'residual',
    name: 'Residual / Non-Recyclable Bin',
    category: 'Residual / Non-Recyclable',
    binColor: 'Black / Grey Bin',
    colorName: 'Zinc',
    badgeBg: 'bg-zinc-100',
    textColor: 'text-zinc-900',
    borderColor: 'border-zinc-500',
    shortInstruction: 'Soiled packaging, multi-layer chip wrappers, sanitary waste.',
    acceptedSummary: 'Destined for sanitary landfill or waste-to-energy.'
  }
];

export const QRCodeGeneratorPage: React.FC = () => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('dry');
  const [copied, setCopied] = useState(false);

  // Determine actual frontend application base URL
  const appBaseUrl = (import.meta.env.VITE_APP_URL || window.location.origin).replace(/\/$/, '');
  const isLocalhost = appBaseUrl.includes('localhost') || appBaseUrl.includes('127.0.0.1');

  const preset = BIN_PRESETS.find((p) => p.id === selectedPresetId) || BIN_PRESETS[0];

  // Full QR destination URL
  const qrTargetUrl = `${appBaseUrl}/guide?category=${encodeURIComponent(preset.category)}`;

  const handlePrint = () => {
    window.print();
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(qrTargetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header (Hidden when printing) */}
      <div className="space-y-2 text-center max-w-2xl mx-auto no-print">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold border border-forest-200">
          <QrCode className="w-3.5 h-3.5 text-forest-600" />
          <span>Interactive Physical-to-Digital Labels</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Campus Bin QR Code Generator</h1>
        <p className="text-slate-600 text-sm">
          Print durable labels for campus bins. When users scan the QR code, their phone immediately opens the verified segregation guidelines for that bin.
        </p>
      </div>

      {/* Target URL Transparency Note */}
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start space-x-3 no-print">
        <Info className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <p className="font-semibold">QR Code Production Resolution</p>
          <p className="leading-relaxed">
            Target URL: <code className="bg-white/80 px-1.5 py-0.5 rounded border border-emerald-200">{qrTargetUrl}</code>
            {isLocalhost ? (
              <span className="block text-amber-800 font-semibold mt-1">
                [Localhost Detected] Currently generating local development QR code. On Vercel, set <code>VITE_APP_URL</code> to generate production URLs.
              </span>
            ) : (
              <span className="block text-emerald-800 font-semibold mt-1">
                [Production Mode] QR code resolves to your deployed public EcoSort domain.
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Controls (Hidden when printing) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 no-print">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Select Waste Bin Category:</h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {BIN_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedPresetId(p.id)}
              className={`p-3 rounded-xl text-xs font-bold text-left transition border ${
                selectedPresetId === p.id
                  ? 'border-forest-600 bg-forest-50 text-forest-900 shadow-sm'
                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="text-[10px] text-slate-400 uppercase font-semibold">{p.binColor}</div>
              <div className="mt-1 truncate">{p.name.replace(' Bin', '')}</div>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-100 gap-3">
          <button
            onClick={copyUrl}
            className="text-xs font-semibold text-slate-600 hover:text-slate-800 flex items-center space-x-1"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Link Copied!' : 'Copy Target Link'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center space-x-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Bin Label</span>
          </button>
        </div>
      </div>

      {/* Printable Bin Label Sheet */}
      <div className="space-y-4">
        <div className="flex items-center justify-between no-print">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Print Preview</span>
          <span className="text-xs text-slate-400">Optimized for standard A4 / label printing</span>
        </div>

        <div className="bg-white border-4 border-dashed border-slate-300 rounded-3xl p-8 sm:p-12 shadow-sm text-center max-w-lg mx-auto print:border-solid print:border-4 print:border-black print:max-w-none print:shadow-none">
          {/* Label Header */}
          <div className="pb-4 border-b-2 border-slate-800 space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500 block">
              ECOSORT SMART BIN LABEL • {preset.binColor.toUpperCase()}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
              {preset.name}
            </h2>
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
              Category: {preset.category}
            </div>
          </div>

          {/* QR Code Container */}
          <div className="py-6 flex flex-col items-center justify-center space-y-3">
            <div className="p-4 bg-white border-2 border-slate-800 rounded-2xl shadow-inner inline-block">
              <QRCodeSVG
                value={qrTargetUrl}
                size={180}
                level="H"
                includeMargin={false}
              />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-900 block">
              Scan with your phone camera
            </span>
            <span className="text-[11px] text-slate-500">
              Instantly view segregation instructions for this bin
            </span>
          </div>

          {/* Instructions Block */}
          <div className="pt-4 border-t-2 border-slate-800 text-left space-y-2">
            <div className="p-3 bg-slate-100 rounded-xl border border-slate-300">
              <span className="text-[11px] font-black uppercase text-slate-800 block">Disposal Rule:</span>
              <p className="text-xs font-bold text-slate-900 leading-snug">{preset.shortInstruction}</p>
            </div>
            <div className="text-[10px] text-slate-500 text-center font-medium">
              Powered by EcoSort • Smart Campus Waste Segregation Initiative
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
