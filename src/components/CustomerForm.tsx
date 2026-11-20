import React, { useState } from 'react';
import {
  AppLanguage,
  CustomerData,
  DocumentFieldKey,
  FIELD_DEFINITIONS,
  FieldConfig,
} from '../types';
import {
  Download,
  Printer,
  Sparkles,
  Trash2,
  History,
  Image as ImageIcon,
  Loader2,
  Sliders,
  ChevronDown,
  ChevronUp,
  User,
  CreditCard,
  Move,
  Type,
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

  // Fine-tuning props
  fields: Record<DocumentFieldKey, FieldConfig>;
  selectedFieldKey: DocumentFieldKey;
  onSelectFieldKey: (key: DocumentFieldKey) => void;
  onUpdateFieldConfig: (key: DocumentFieldKey, updates: Partial<FieldConfig>) => void;
  onResetFieldPosition: (key: DocumentFieldKey) => void;
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
  fields,
  selectedFieldKey,
  onSelectFieldKey,
  onUpdateFieldConfig,
  onResetFieldPosition,
}) => {
  const isGu = language === 'gu';
  const [showAdditional, setShowAdditional] = useState(false);
  const [showPositionTuner, setShowPositionTuner] = useState(false);

  const handleApplyBranch = (updates: Partial<Record<DocumentFieldKey, string>>) => {
    for (const [key, val] of Object.entries(updates)) {
      if (val !== undefined) {
        onChange(key as DocumentFieldKey, val);
      }
    }
  };

  const currentConfig = fields[selectedFieldKey];
  const activeDef = FIELD_DEFINITIONS.find((d) => d.key === selectedFieldKey);

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 text-slate-800">
      {/* Top Bar with History & Quick Sample */}
      <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onFillSample('en')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition shadow-2xs"
            title="Load sample passbook data in English"
          >
            <Sparkles className="h-3 w-3 text-blue-600" />
            <span>Sample (EN)</span>
          </button>
          <button
            onClick={() => onFillSample('gu')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition shadow-2xs"
            title="નમૂનાની માહિતી (ગુજરાતી)"
          >
            <Sparkles className="h-3 w-3 text-amber-600" />
            <span>નમૂનો (GU)</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition shadow-2xs"
            title="View saved records"
          >
            <History className="h-3.5 w-3.5 text-blue-600" />
            <span>{isGu ? 'ઇતિહાસ' : 'History'}</span>
            {historyCount > 0 && (
              <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1 rounded">
                {historyCount}
              </span>
            )}
          </button>
          <button
            onClick={onClear}
            className="p-1.5 text-xs rounded-md text-slate-500 hover:text-red-600 hover:bg-slate-100 transition"
            title="Clear all fields"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Form Fields Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 1. Branch Selector */}
        <BankBranchSelector
          language={language}
          onApplyBranch={handleApplyBranch}
        />

        {/* 2. Primary Customer Details */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 border-b border-slate-200 pb-1.5">
            <User className="h-3.5 w-3.5 text-blue-600" />
            <span>{isGu ? 'ગ્રાહક વિગતો' : 'Customer Details'}</span>
          </div>

          {/* Customer Name */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="customerName" className="font-semibold text-slate-800">
                {isGu ? 'ગ્રાહકનું નામ (Name)' : 'Customer Name (Name)'}
              </label>
              <span className="text-[10px] text-slate-500 font-sans">Mr. BHAVIN...</span>
            </div>
            <input
              id="customerName"
              type="text"
              value={data.customerName || ''}
              onChange={(e) => onChange('customerName', e.target.value.toUpperCase())}
              placeholder="e.g. Mr. BHAVIN BHASKARBHAI PATEL"
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-md font-sans text-slate-900 font-bold tracking-wide transition uppercase"
            />
          </div>

          {/* Account Number & Customer No */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label htmlFor="accountNumber" className="text-xs font-semibold text-slate-800 block">
                {isGu ? 'ખાતા નંબર (A/C No)' : 'Account No'}
              </label>
              <input
                id="accountNumber"
                type="text"
                value={data.accountNumber || ''}
                onChange={(e) => onChange('accountNumber', e.target.value)}
                placeholder="306050055336"
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-md font-sans text-slate-900 font-bold transition"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="customerId" className="text-xs font-semibold text-slate-800 block">
                {isGu ? 'ગ્રાહક નંબર (Cust No)' : 'Customer No'}
              </label>
              <input
                id="customerId"
                type="text"
                value={data.customerId || ''}
                onChange={(e) => onChange('customerId', e.target.value)}
                placeholder="350003624381"
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-md font-sans text-slate-900 font-bold transition"
              />
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1">
            <label htmlFor="address" className="text-xs font-semibold text-slate-800 block">
              {isGu ? 'રહેઠાણનું સરનામું (Address)' : 'Customer Address'}
            </label>
            <textarea
              id="address"
              rows={2}
              value={data.address || ''}
              onChange={(e) => onChange('address', e.target.value.toUpperCase())}
              placeholder="CHORAWALI KHADKI, SALUN TALPAD,&#10;387001, GUJARAT"
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-md font-sans text-slate-900 font-semibold resize-none transition uppercase"
            />
          </div>
        </div>

        {/* 3. Collapsible Passbook Line Items */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setShowAdditional(!showAdditional)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition"
          >
            <span className="flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-slate-500" />
              <span>{isGu ? 'વધારાની પાસબુક વિગતો' : 'Passbook Line Items (IFSC, MICR, Product, Date)'}</span>
            </span>
            {showAdditional ? (
              <ChevronUp className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-500" />
            )}
          </button>

          {showAdditional && (
            <div className="p-3.5 space-y-3 bg-white border-t border-slate-200 text-xs">
              {/* Branch Name & Code + IFSC */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-0.5">
                    Branch Name &amp; Code
                  </label>
                  <input
                    type="text"
                    value={data.branchName || ''}
                    onChange={(e) => onChange('branchName', e.target.value)}
                    className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-300 rounded font-sans text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-0.5">
                    IFSC CODE
                  </label>
                  <input
                    type="text"
                    value={data.ifscCode || ''}
                    onChange={(e) => onChange('ifscCode', e.target.value)}
                    className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-300 rounded font-sans text-slate-800"
                  />
                </div>
              </div>

              {/* Branch Address */}
              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-0.5">
                  Branch Address
                </label>
                <input
                  type="text"
                  value={data.branchAddress || ''}
                  onChange={(e) => onChange('branchAddress', e.target.value)}
                  className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-300 rounded font-sans text-slate-800"
                />
              </div>

              {/* Product & MICR */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-0.5">
                    Product Description
                  </label>
                  <input
                    type="text"
                    value={data.productDescription || ''}
                    onChange={(e) => onChange('productDescription', e.target.value)}
                    className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-300 rounded font-sans text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-0.5">
                    MICR CODE
                  </label>
                  <input
                    type="text"
                    value={data.micrCode || ''}
                    onChange={(e) => onChange('micrCode', e.target.value)}
                    className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-300 rounded font-sans text-slate-800"
                  />
                </div>
              </div>

              {/* Date of Issue & CKYC */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-0.5">
                    Date of Issue
                  </label>
                  <input
                    type="text"
                    value={data.dateOfIssue || ''}
                    onChange={(e) => onChange('dateOfIssue', e.target.value)}
                    className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-300 rounded font-sans text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-0.5">
                    CKYC No
                  </label>
                  <input
                    type="text"
                    value={data.ckycNo || ''}
                    onChange={(e) => onChange('ckycNo', e.target.value)}
                    className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-300 rounded font-sans text-slate-800"
                  />
                </div>
              </div>

              {/* Nominee & Mode of Operation */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-0.5">
                    Nominee (Y/N)
                  </label>
                  <input
                    type="text"
                    value={data.nominee || ''}
                    onChange={(e) => onChange('nominee', e.target.value)}
                    className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-300 rounded font-sans text-slate-800"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] font-medium text-slate-600 block mb-0.5">
                    Nominee Name
                  </label>
                  <input
                    type="text"
                    value={data.nomineeName || ''}
                    onChange={(e) => onChange('nomineeName', e.target.value)}
                    className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-300 rounded font-sans text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-600 block mb-0.5">
                  Mode of Operation
                </label>
                <input
                  type="text"
                  value={data.modeOfOperation || ''}
                  onChange={(e) => onChange('modeOfOperation', e.target.value)}
                  className="w-full px-2.5 py-1 text-xs bg-slate-50 border border-slate-300 rounded font-sans text-slate-800"
                />
              </div>
            </div>
          )}
        </div>

        {/* 4. Fine-Tune Position & Font Size (Minimal & Optional) */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setShowPositionTuner(!showPositionTuner)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition"
          >
            <span className="flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-slate-500" />
              <span>Fine-Tune Text Offsets &amp; Font Sizes</span>
            </span>
            {showPositionTuner ? (
              <ChevronUp className="h-4 w-4 text-slate-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-slate-500" />
            )}
          </button>

          {showPositionTuner && currentConfig && (
            <div className="p-3.5 space-y-3 bg-white border-t border-slate-200 text-xs">
              {/* Field Select */}
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                  Select Field to Adjust:
                </label>
                <select
                  value={selectedFieldKey}
                  onChange={(e) => onSelectFieldKey(e.target.value as DocumentFieldKey)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-800 font-medium"
                >
                  {FIELD_DEFINITIONS.map((def) => (
                    <option key={def.key} value={def.key}>
                      {def.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Nudge pad: X, Y, Size */}
              <div className="grid grid-cols-3 gap-2 text-center pt-1">
                {/* Horizontal X Nudge */}
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-600 block mb-1">
                    X Position ({currentConfig.x}px)
                  </span>
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onUpdateFieldConfig(selectedFieldKey, { x: currentConfig.x - 2 })}
                      className="px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 font-bold"
                    >
                      ◀
                    </button>
                    <button
                      onClick={() => onUpdateFieldConfig(selectedFieldKey, { x: currentConfig.x + 2 })}
                      className="px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 font-bold"
                    >
                      ▶
                    </button>
                  </div>
                </div>

                {/* Vertical Y Nudge */}
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-600 block mb-1">
                    Y Position ({currentConfig.y}px)
                  </span>
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onUpdateFieldConfig(selectedFieldKey, { y: currentConfig.y - 2 })}
                      className="px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 font-bold"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => onUpdateFieldConfig(selectedFieldKey, { y: currentConfig.y + 2 })}
                      className="px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 font-bold"
                    >
                      ▼
                    </button>
                  </div>
                </div>

                {/* Font Size Nudge */}
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-semibold text-slate-600 block mb-1">
                    Font Size ({currentConfig.fontSize}px)
                  </span>
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() =>
                        onUpdateFieldConfig(selectedFieldKey, {
                          fontSize: Math.max(9, currentConfig.fontSize - 1),
                        })
                      }
                      className="px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 font-bold"
                    >
                      -
                    </button>
                    <button
                      onClick={() =>
                        onUpdateFieldConfig(selectedFieldKey, {
                          fontSize: Math.min(32, currentConfig.fontSize + 1),
                        })
                      }
                      className="px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Actions Bar */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-2">
        {/* Main PDF Download Button */}
        <button
          onClick={onDownloadPdf}
          disabled={isGeneratingPdf}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold bg-blue-700 hover:bg-blue-800 text-white shadow-xs transition disabled:opacity-50"
        >
          {isGeneratingPdf ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>Download Official Passbook PDF</span>
            </>
          )}
        </button>

        {/* Secondary: PNG and Print */}
        <div className="flex gap-2">
          <button
            onClick={() => onDownloadImage('png')}
            disabled={isGeneratingImg}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition shadow-2xs disabled:opacity-50"
          >
            {isGeneratingImg ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ImageIcon className="h-3.5 w-3.5 text-blue-600" />
            )}
            <span>Download Image (PNG)</span>
          </button>

          <button
            onClick={onPrint}
            className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition shadow-2xs"
            title="Direct Print"
          >
            <Printer className="h-3.5 w-3.5 text-emerald-600" />
            <span>Print</span>
          </button>
        </div>
      </div>
    </div>
  );
};
