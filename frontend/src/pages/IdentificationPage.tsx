import React, { useState, useEffect } from 'react';
import {
  UploadCloud,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkles,
  RefreshCw,
  FileText,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { api } from '../services/api';
import { WasteItem, WasteIdentifyResponse } from '../types';
import { CategoryBadge } from '../components/CategoryBadge';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const IdentificationPage: React.FC = () => {
  const [catalogItems, setCatalogItems] = useState<WasteItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [manualSelection, setManualSelection] = useState<string>('');
  const [result, setResult] = useState<WasteIdentifyResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load catalog items for manual fallback selection
    api.getWasteItems()
      .then((items) => {
        setCatalogItems(items);
        if (items.length > 0) {
          setManualSelection(items[0].name);
        }
      })
      .catch((err) => setError('Could not load catalog items for manual selection'))
      .finally(() => setCatalogLoading(false));
  }, []);

  const handleFileChange = (file: File) => {
    setError(null);
    setResult(null);

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError(`Unsupported file type '${file.type}'. Please upload a JPG, PNG, or WebP photo.`);
      return;
    }

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError(`File size is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum allowed upload size is 5MB.`);
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleIdentify = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await api.identifyWaste(selectedFile, manualSelection);
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'Identification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Heading */}
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold border border-forest-200">
          <Camera className="w-3.5 h-3.5 text-forest-600" />
          <span>Waste Identification Module</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Identify Your Waste Item</h1>
        <p className="text-slate-600 text-sm">
          Upload an image of an item or select it directly from our verified catalog to inspect disposal rules, recyclability, and safety protocols.
        </p>
      </div>

      {/* Mode Transparency Banner */}
      <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start space-x-3">
        <Info className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <p className="font-semibold">Identification Transparency Guarantee</p>
          <p className="text-emerald-900 leading-relaxed">
            In accordance with project integrity standards, this academic prototype operates in an honest, verified <strong>Demo / Manual Catalog Identification Mode</strong>. We do not claim external AI vision ran or fabricate artificial confidence scores when no paid computer vision API key is configured.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Interactive Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-forest-400 transition bg-slate-50/50"
        >
          {previewUrl ? (
            <div className="space-y-4">
              <img
                src={previewUrl}
                alt="Upload preview"
                className="max-h-60 mx-auto rounded-xl object-contain border border-slate-200 shadow-sm"
              />
              <div className="flex items-center justify-center gap-3">
                <span className="text-xs text-slate-500 font-medium">
                  {selectedFile?.name} ({(selectedFile ? selectedFile.size / 1024 : 0).toFixed(0)} KB)
                </span>
                <button
                  onClick={handleReset}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-800"
                >
                  Remove Photo
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-full bg-forest-100 text-forest-700 flex items-center justify-center mx-auto">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <label className="cursor-pointer text-sm font-semibold text-forest-700 hover:text-forest-800 underline underline-offset-4">
                  <span>Click to upload a photo</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileChange(e.target.files[0]);
                      }
                    }}
                  />
                </label>
                <span className="text-xs text-slate-500 block mt-1">or drag and drop your image here</span>
              </div>
              <p className="text-[11px] text-slate-400">Supported formats: JPG, PNG, WebP (Max 5MB)</p>
            </div>
          )}
        </div>

        {/* Manual Catalog Selection Dropdown */}
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Manual / Fallback Catalog Item Selection:
          </label>
          <p className="text-xs text-slate-500">
            Select an item from the database catalog to verify disposal instructions even if not uploading an image:
          </p>
          <select
            value={manualSelection}
            onChange={(e) => setManualSelection(e.target.value)}
            disabled={catalogLoading}
            className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-forest-500"
          >
            {catalogItems.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name} — ({item.category})
              </option>
            ))}
          </select>
        </div>

        {/* Identify Button */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
          >
            Clear
          </button>
          <button
            onClick={handleIdentify}
            disabled={loading || catalogLoading}
            className="px-6 py-3 bg-forest-700 hover:bg-forest-800 disabled:opacity-50 text-white text-sm font-semibold rounded-xl shadow-md transition flex items-center space-x-2"
          >
            {loading ? (
              <span>Retrieving Instructions...</span>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                <span>Identify & Retrieve Guidance</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result Card */}
      {result && (
        <div className="bg-white border-2 border-forest-500/80 rounded-3xl p-6 sm:p-8 shadow-md space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-forest-100 text-forest-800 border border-forest-200">
                  Identification Mode: {result.identification_mode === 'demo_manual' ? 'Demo / Catalog Manual' : 'Model Vision'}
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">{result.item_name}</h2>
            </div>
            <CategoryBadge category={result.category} />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-start space-x-2">
            <Info className="w-4 h-4 text-forest-600 mt-0.5 flex-shrink-0" />
            <p>{result.notice}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-forest-50/70 border border-forest-100 p-4 rounded-xl space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-forest-800 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest-600" />
                <span>Disposal Direction</span>
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">{result.disposal_instructions}</p>
            </div>

            <div className="bg-blue-50/70 border border-blue-100 p-4 rounded-xl space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-800 flex items-center space-x-1">
                <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
                <span>Recycling & Recovery</span>
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">{result.recycling_information}</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Preparation Instructions</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{result.preparation_instructions}</p>
          </div>

          {result.safety_warning && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="block text-amber-900">Safety Caution:</strong>
                <span>{result.safety_warning}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
