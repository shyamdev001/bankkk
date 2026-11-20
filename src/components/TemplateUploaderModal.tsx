import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileCheck,
  FileText,
  AlertCircle,
  Loader2,
  Check,
  Layers,
} from 'lucide-react';
import { TemplateData } from '../types';
import { processImageFile, processPdfFile, renderPdfPageFromBuffer } from '../services/pdfService';

interface TemplateUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTemplate: (template: TemplateData) => Promise<void>;
  currentTemplate: TemplateData | null;
}

export const TemplateUploaderModal: React.FC<TemplateUploaderModalProps> = ({
  isOpen,
  onClose,
  onSaveTemplate,
  currentTemplate,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Staged template before confirming
  const [stagedTemplate, setStagedTemplate] = useState<TemplateData | null>(null);
  const [selectedPage, setSelectedPage] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = async (file: File) => {
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      const isImg = file.type.startsWith('image/') || /\.(png|jpe?g|webp)$/i.test(file.name);

      if (!isPdf && !isImg) {
        throw new Error('Please upload an authorized PDF or Image file (.pdf, .png, .jpg, .webp)');
      }

      if (isPdf) {
        const result = await processPdfFile(file);
        setStagedTemplate({
          id: 'primary_template',
          name: file.name.replace(/\.[^/.]+$/, ''),
          type: 'pdf',
          originalFileName: file.name,
          dataUrl: result.dataUrl,
          originalPdfBuffer: result.arrayBuffer,
          width: result.width,
          height: result.height,
          pageCount: result.pageCount,
          activePage: 1,
          updatedAt: Date.now(),
        });
        setSelectedPage(1);
      } else {
        const result = await processImageFile(file);
        setStagedTemplate({
          id: 'primary_template',
          name: file.name.replace(/\.[^/.]+$/, ''),
          type: 'image',
          originalFileName: file.name,
          dataUrl: result.dataUrl,
          width: result.width,
          height: result.height,
          pageCount: 1,
          activePage: 1,
          updatedAt: Date.now(),
        });
        setSelectedPage(1);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to process template file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePageChange = async (pageNum: number) => {
    if (!stagedTemplate || !stagedTemplate.originalPdfBuffer) return;
    setIsProcessing(true);
    try {
      const result = await renderPdfPageFromBuffer(stagedTemplate.originalPdfBuffer, pageNum, stagedTemplate.width);
      setStagedTemplate({
        ...stagedTemplate,
        dataUrl: result.dataUrl,
        activePage: pageNum,
      });
      setSelectedPage(pageNum);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirm = async () => {
    if (!stagedTemplate) return;
    setIsProcessing(true);
    try {
      const { originalPdfBuffer, ...cleanTemplate } = stagedTemplate;
      await onSaveTemplate(cleanTemplate as TemplateData);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to save template to IndexedDB');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-400" />
              Upload Authorized Document Template
            </h3>
            <p className="text-xs text-slate-400">
              Upload your blank bank certificate, verification letter, or mandate form (PDF or Image)
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              const file = e.dataTransfer.files?.[0];
              if (file) handleFile(file);
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition ${
              dragActive
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-slate-700 hover:border-slate-600 bg-slate-950/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />

            <div className="h-12 w-12 rounded-full bg-slate-800 flex items-center justify-center mb-3">
              {isProcessing ? (
                <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />
              ) : (
                <Upload className="h-6 w-6 text-blue-400" />
              )}
            </div>

            <p className="text-sm font-semibold text-white">
              Drag &amp; drop your blank template here, or <span className="text-blue-400">browse</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports PDF (.pdf) and Image files (.png, .jpg, .jpeg, .webp)
            </p>
            <span className="mt-2 text-[11px] text-slate-500 bg-slate-800/80 px-2 py-0.5 rounded">
              Processed 100% locally in your browser. Stored securely in IndexedDB.
            </span>
          </div>

          {/* Staged Template Preview */}
          {stagedTemplate && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-emerald-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white truncate max-w-sm">
                      {stagedTemplate.originalFileName}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {stagedTemplate.width} x {stagedTemplate.height} px | {stagedTemplate.type.toUpperCase()}
                    </p>
                  </div>
                </div>

                {stagedTemplate.pageCount > 1 && (
                  <div className="flex items-center gap-1.5 text-xs">
                    <Layers className="h-3.5 w-3.5 text-blue-400" />
                    <span className="text-slate-400">Page:</span>
                    <select
                      value={selectedPage}
                      onChange={(e) => handlePageChange(parseInt(e.target.value))}
                      className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                    >
                      {Array.from({ length: stagedTemplate.pageCount }, (_, i) => i + 1).map((p) => (
                        <option key={p} value={p}>
                          Page {p} of {stagedTemplate.pageCount}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Thumbnail Container */}
              <div className="max-h-56 overflow-hidden rounded-lg border border-slate-800 flex justify-center bg-slate-900 p-2">
                <img
                  src={stagedTemplate.dataUrl}
                  alt="Template Preview"
                  className="max-h-52 object-contain shadow-md rounded"
                />
              </div>
            </div>
          )}

          {/* Informational Notice */}
          <div className="text-xs text-slate-400 bg-slate-800/40 p-3 rounded-lg border border-slate-800">
            <p className="font-semibold text-slate-300 mb-1">How Fixed Templates Work:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>You only upload the blank template once.</li>
              <li>Position the 9 editable fields once in the "Configure Fields" tab.</li>
              <li>Every time you open SmartDoc Studio, your template is instantly reloaded from IndexedDB.</li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-end gap-3 bg-slate-950">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!stagedTemplate || isProcessing}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition disabled:opacity-50"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            <span>Set as Fixed Template</span>
          </button>
        </div>
      </div>
    </div>
  );
};
