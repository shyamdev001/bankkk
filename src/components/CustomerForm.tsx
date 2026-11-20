import React, { useState } from 'react';
import {
  AppLanguage,
  CustomerData,
  DocumentFieldKey,
  FIELD_DEFINITIONS,
  SavedRecord,
} from '../types';
import {
  Download,
  Printer,
  Sparkles,
  Trash2,
  BookmarkPlus,
  History,
  FileCheck2,
  Image as ImageIcon,
  Loader2,
  User,
  CreditCard,
  Building2,
  MapPin,
} from 'lucide-react';
import { BankBranchSelector } from './BankBranchSelector';

interface CustomerFormProps {
  data: CustomerData;
  onChange: (key: DocumentFieldKey, value: string) => void;
  onClear: () => void;
  onFillSample: (lang: AppLanguage) => void;
  language: AppLanguage;
  onDownloadPdf: () => Promise<void>;
  onDownloadImage: (format: 'png' | 'jpeg') => Promise<void>;
  onPrint: () => Promise<void>;
  onSaveRecord: () => void;
  onOpenHistory: () => void;
  historyCount: number;
  isGeneratingPdf: boolean;
  isGeneratingImg: boolean;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  data,
  onChange,
  onClear,
  onFillSample,
  language,
  onDownloadPdf,
  onDownloadImage,
  onPrint,
  onSaveRecord,
  onOpenHistory,
  historyCount,
  isGeneratingPdf,
  isGeneratingImg,
}) => {
  const isGu = language === 'gu';

  // Group fields into logical banking sections
  const customerFields: DocumentFieldKey[] = ['customerName', 'accountHolderName', 'customerId'];
  const accountFields: DocumentFieldKey[] = ['accountNumber', 'ifscCode', 'micrCode', 'branchCode', 'branchName'];
  const addressField: DocumentFieldKey = 'address';

  const getDef = (key: DocumentFieldKey) => {
    return FIELD_DEFINITIONS.find((d) => d.key === key)!;
  };

  const handleApplyBranch = (updates: Partial<Record<DocumentFieldKey, string>>) => {
    for (const [key, val] of Object.entries(updates)) {
      if (val !== undefined) {
        onChange(key as DocumentFieldKey, val);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-100">
      {/* Form Action Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
              <FileCheck2 className="h-4 w-4 text-blue-400" />
              {isGu ? 'ગ્રાહક માહિતી ફોર્મ' : 'Customer Information Form'}
            </h2>
            <p className="text-xs text-slate-400">
              {isGu ? 'દસ્તાવેજ બનાવવા માટે માહિતી ભરો' : 'Fill details to populate the document'}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenHistory}
              className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="View recent generated records"
            >
              <History className="h-3.5 w-3.5 text-blue-400" />
              <span>{isGu ? 'ઇતિહાસ' : 'History'}</span>
              {historyCount > 0 && (
                <span className="ml-0.5 bg-blue-500/20 text-blue-400 px-1 py-0.2 text-[10px] rounded font-bold">
                  {historyCount}
                </span>
              )}
            </button>
            <button
              onClick={onClear}
              className="p-1.5 text-xs rounded-md text-slate-400 hover:text-red-400 hover:bg-slate-800 transition"
              title="Clear all fields"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Quick Sample Fill Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onFillSample('en')}
            className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 transition"
          >
            <Sparkles className="h-3 w-3 text-blue-400" />
            <span>Sample (English)</span>
          </button>
          <button
            onClick={() => onFillSample('gu')}
            className="flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition"
          >
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>નમૂનો (ગુજરાતી)</span>
          </button>
        </div>
      </div>

      {/* Scrollable Form Fields Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Section 1: Customer Identity */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 uppercase tracking-wider pb-1 border-b border-slate-800">
            <User className="h-3.5 w-3.5" />
            <span>{isGu ? 'ગ્રાહક ઓળખ' : 'Customer Identity'}</span>
          </div>

          {customerFields.map((key) => {
            const def = getDef(key);
            return (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor={key} className="font-medium text-slate-200">
                    {isGu ? def.labelGujarati : def.label}
                  </label>
                  <span className="text-[10px] text-slate-500">
                    {isGu ? def.label : def.labelGujarati}
                  </span>
                </div>
                <input
                  id={key}
                  type="text"
                  value={data[key] || ''}
                  onChange={(e) => onChange(key, e.target.value)}
                  placeholder={isGu ? def.placeholderGujarati : def.placeholder}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-lg text-slate-100 placeholder-slate-600 transition"
                />
              </div>
            );
          })}
        </div>

        {/* Section 2: Account & Banking Identifiers */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider pb-1 border-b border-slate-800">
            <CreditCard className="h-3.5 w-3.5" />
            <span>{isGu ? 'ખાતા અને બેંકિંગ વિગતો' : 'Account & Banking Identifiers'}</span>
          </div>

          {/* Quick Bank & 89 Branches Selector from KDCC Bank */}
          <BankBranchSelector
            language={language}
            onApplyBranch={handleApplyBranch}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {accountFields.map((key) => {
              const def = getDef(key);
              const isColSpan2 = key === 'accountNumber' || key === 'branchName';
              return (
                <div key={key} className={`space-y-1 ${isColSpan2 ? 'sm:col-span-2' : ''}`}>
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor={key} className="font-medium text-slate-200">
                      {isGu ? def.labelGujarati : def.label}
                    </label>
                    <span className="text-[10px] text-slate-500">
                      {isGu ? def.label : def.labelGujarati}
                    </span>
                  </div>
                  <input
                    id={key}
                    type="text"
                    value={data[key] || ''}
                    onChange={(e) => onChange(key, e.target.value)}
                    placeholder={isGu ? def.placeholderGujarati : def.placeholder}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg text-slate-100 placeholder-slate-600 font-mono transition"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Registered Address */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 uppercase tracking-wider pb-1 border-b border-slate-800">
            <MapPin className="h-3.5 w-3.5" />
            <span>{isGu ? 'નોંધાયેલ સરનામું' : 'Registered Address'}</span>
          </div>

          {(() => {
            const def = getDef(addressField);
            return (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor={addressField} className="font-medium text-slate-200">
                    {isGu ? def.labelGujarati : def.label}
                  </label>
                  <span className="text-[10px] text-slate-500">
                    {isGu ? def.label : def.labelGujarati}
                  </span>
                </div>
                <textarea
                  id={addressField}
                  rows={3}
                  value={data[addressField] || ''}
                  onChange={(e) => onChange(addressField, e.target.value)}
                  placeholder={isGu ? def.placeholderGujarati : def.placeholder}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-lg text-slate-100 placeholder-slate-600 resize-none transition"
                />
              </div>
            );
          })()}
        </div>

        {/* Save to History Button */}
        <button
          onClick={onSaveRecord}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
        >
          <BookmarkPlus className="h-4 w-4 text-emerald-400" />
          <span>{isGu ? 'ગ્રાહક રેકોર્ડ સાચવો (IndexedDB)' : 'Save Record to History'}</span>
        </button>
      </div>

      {/* Sticky Bottom Generation / Download Bar */}
      <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-2.5">
        {/* Main PDF Download Button */}
        <button
          onClick={onDownloadPdf}
          disabled={isGeneratingPdf}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/30 transition disabled:opacity-50"
        >
          {isGeneratingPdf ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <span>{isGu ? 'પીડીએફ બની રહી છે...' : 'Rendering 300 DPI PDF...'}</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>{isGu ? 'પીડીએફ ડાઉનલોડ કરો' : 'Download Official PDF'}</span>
            </>
          )}
        </button>

        {/* Secondary: Image Download & Print */}
        <div className="flex gap-2">
          <button
            onClick={() => onDownloadImage('png')}
            disabled={isGeneratingImg}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition disabled:opacity-50"
          >
            {isGeneratingImg ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ImageIcon className="h-3.5 w-3.5 text-blue-400" />
            )}
            <span>{isGu ? 'ઇમેજ (PNG)' : 'Download PNG'}</span>
          </button>

          <button
            onClick={onPrint}
            className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
            title="Direct Print"
          >
            <Printer className="h-3.5 w-3.5 text-emerald-400" />
            <span>{isGu ? 'પ્રિન્ટ' : 'Print'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
