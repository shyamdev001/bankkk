import React, { useRef } from 'react';
import {
  FileText,
  Sliders,
  Upload,
  RotateCcw,
  Download,
  Languages,
  Database,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import { AppLanguage, AppMode, TemplateData } from '../types';

interface HeaderProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  template: TemplateData | null;
  onOpenUploadModal: () => void;
  onResetDefaultTemplate: () => void;
  onExportBackup: () => void;
  onImportBackup: (file: File) => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onModeChange,
  language,
  onLanguageChange,
  template,
  onOpenUploadModal,
  onResetDefaultTemplate,
  onExportBackup,
  onImportBackup,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportBackup(file);
      e.target.value = '';
    }
  };

  return (
    <header className="bg-slate-950 border-b border-slate-800 text-white select-none z-20">
      <div className="max-w-full px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">SmartDoc Studio</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded">
                Fixed Template Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Single-template bank certificates &amp; document generator
            </p>
          </div>
        </div>

        {/* Center: Mode Switcher (Generate vs Design) */}
        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-inner">
          <button
            onClick={() => onModeChange('generate')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'generate'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCheck className="h-3.5 w-3.5" />
            <span>Generate Document</span>
          </button>
          <button
            onClick={() => onModeChange('design')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'design'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Configure Template &amp; Fields</span>
          </button>
        </div>

        {/* Right Controls: Template Badge, Language, Actions */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Active Template Status */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg">
            <Database className="h-3.5 w-3.5 text-emerald-400" />
            <span className="truncate max-w-[170px]" title={template?.name || 'No Template'}>
              {template ? template.originalFileName : 'No Template'}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
              <CheckCircle2 className="h-3 w-3" /> IndexedDB
            </span>
          </div>

          {/* Language Toggle (English vs Gujarati) */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                language === 'en'
                  ? 'bg-slate-800 text-blue-400 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="English interface & typography"
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('gu')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                language === 'gu'
                  ? 'bg-slate-800 text-blue-400 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="ગુજરાતી ઇન્ટરફેસ અને ફોન્ટ"
            >
              ગુજરાતી
            </button>
          </div>

          {/* Upload Template Button */}
          <button
            onClick={onOpenUploadModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            title="Upload custom blank PDF or Image template"
          >
            <Upload className="h-3.5 w-3.5 text-blue-400" />
            <span className="hidden sm:inline">Upload Template</span>
          </button>

          {/* Backup / Export Menu */}
          <div className="flex items-center gap-1">
            <button
              onClick={onExportBackup}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              title="Export Workspace JSON (Template & Field Positions)"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              title="Restore Workspace JSON Backup"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportFileChange}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
