import React, { useRef } from 'react';
import {
  Upload,
  RotateCcw,
  Download,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { AppLanguage, TemplateData } from '../types';

interface HeaderProps {
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  template: TemplateData | null;
  onOpenUploadModal: () => void;
  onResetDefaultTemplate: () => void;
  onExportBackup: () => void;
  onImportBackup: (file: File) => void;
}

export const Header: React.FC<HeaderProps> = ({
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
    <header className="bg-white border-b border-slate-200 text-slate-800 select-none z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-700 flex items-center justify-center text-white shadow-xs">
            <FileText className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-sm tracking-tight text-slate-900">SmartDoc Studio</h1>
              <span className="text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200/80 px-1.5 py-0.5 rounded">
                KDCC Passbook Editor
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Single-template passbook front-page &amp; certificate generator
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5">
          {/* Storage status badge */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span className="text-[11px] font-medium">Saved in Browser (IndexedDB)</span>
          </div>

          {/* Language Toggle (EN / GU) */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                language === 'en'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('gu')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                language === 'gu'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ગુજરાતી
            </button>
          </div>

          {/* Upload Custom Template */}
          <button
            onClick={onOpenUploadModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 transition"
            title="Upload custom blank PDF or Image template"
          >
            <Upload className="h-3.5 w-3.5 text-blue-600" />
            <span className="hidden sm:inline">Upload Template</span>
          </button>

          {/* Reset Template */}
          <button
            onClick={onResetDefaultTemplate}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
            title="Reset to default official KDCC template"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* Export / Import Workspace Backup */}
          <div className="flex items-center">
            <button
              onClick={onExportBackup}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Download backup file"
            >
              <Download className="h-4 w-4" />
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
