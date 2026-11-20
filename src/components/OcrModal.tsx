import React, { useState } from 'react';
import {
  X,
  ScanText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { DocumentFieldKey, FIELD_DEFINITIONS, FieldConfig } from '../types';
import { OcrDetectionResult, OcrScanProgress, scanTemplateForLabels } from '../services/ocrService';

interface OcrModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateDataUrl: string;
  onApplySuggestions: (suggestions: Partial<Record<DocumentFieldKey, Partial<FieldConfig>>>) => void;
}

export const OcrModal: React.FC<OcrModalProps> = ({
  isOpen,
  onClose,
  templateDataUrl,
  onApplySuggestions,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState<OcrScanProgress | null>(null);
  const [results, setResults] = useState<{
    detections: OcrDetectionResult[];
    matchedSuggestions: Partial<Record<DocumentFieldKey, Partial<FieldConfig>>>;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartScan = async () => {
    setIsScanning(true);
    setErrorMsg(null);
    setResults(null);

    try {
      const scanResults = await scanTemplateForLabels(templateDataUrl, (progress) => {
        setScanProgress(progress);
      });
      setResults(scanResults);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'OCR processing failed');
    } finally {
      setIsScanning(false);
    }
  };

  const handleApply = () => {
    if (results && results.matchedSuggestions) {
      onApplySuggestions(results.matchedSuggestions);
      onClose();
    }
  };

  const matchedCount = results ? Object.keys(results.matchedSuggestions).length : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ScanText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Tesseract.js OCR Label Scanner</h3>
              <p className="text-xs text-slate-400">
                Automatically detect printed form labels on your blank template
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!results && !isScanning && (
            <div className="text-center py-6 space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <Sparkles className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-semibold text-white">
                Scan Template for Bank Labels
              </h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Tesseract.js will scan your blank document for keywords like "Customer Name", "Account Number", "IFSC", "Branch", "MICR", and "Address", and automatically position input fields.
              </p>
              <button
                onClick={handleStartScan}
                className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition"
              >
                <ScanText className="h-4 w-4" />
                <span>Start OCR Analysis</span>
              </button>
            </div>
          )}

          {/* Scanning Progress */}
          {isScanning && (
            <div className="py-8 px-4 text-center space-y-4">
              <Loader2 className="h-8 w-8 text-indigo-400 animate-spin mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">
                  {scanProgress?.status || 'Analyzing document...'}
                </p>
                <p className="text-xs text-slate-400">
                  Running client-side OCR in a Web Worker (no data leaves your computer)
                </p>
              </div>

              {scanProgress && (
                <div className="w-full bg-slate-950 rounded-full h-2 border border-slate-800 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full transition-all duration-300"
                    style={{ width: `${Math.round(scanProgress.progress * 100)}%` }}
                  />
                </div>
              )}
            </div>
          )}

          {/* Results Summary */}
          {results && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="font-semibold">
                    OCR Scan Complete: {matchedCount} of 9 labels recognized
                  </span>
                </div>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {FIELD_DEFINITIONS.map((def) => {
                  const match = results.matchedSuggestions[def.key];
                  return (
                    <div
                      key={def.key}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        {match ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        ) : (
                          <AlertCircle className="h-3.5 w-3.5 text-slate-600" />
                        )}
                        <span className={match ? 'text-white font-medium' : 'text-slate-500'}>
                          {def.label}
                        </span>
                      </div>

                      {match ? (
                        <span className="font-mono text-[11px] text-indigo-400">
                          X: {match.x}px | Y: {match.y}px
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-600">Manual position</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-end gap-3 bg-slate-950">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            Cancel
          </button>
          {results && (
            <button
              onClick={handleApply}
              disabled={matchedCount === 0}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition disabled:opacity-50"
            >
              <span>Apply {matchedCount} Detected Field Positions</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
