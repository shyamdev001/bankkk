import React, { useState, useEffect, useRef } from 'react';
import {
  AppLanguage,
  CustomerData,
  DEFAULT_FIELD_CONFIGS,
  DocumentFieldKey,
  FIELD_DEFINITIONS,
  FieldConfig,
  SavedRecord,
  TemplateData,
} from './types';
import {
  deleteCustomerRecord,
  exportWorkspaceBackup,
  getAllCustomerRecords,
  getFieldConfigs,
  getPrimaryTemplate,
  importWorkspaceBackup,
  saveCustomerRecord,
  saveFieldConfigs,
  savePrimaryTemplate,
} from './services/db';
import { generateDefaultBankTemplate } from './utils/sampleTemplate';
import { downloadDocumentAsImage, downloadDocumentAsPdf, printDocument } from './services/pdfService';
import { Header } from './components/Header';
import { CustomerForm } from './components/CustomerForm';
import { DocumentCanvas } from './components/DocumentCanvas';
import { TemplateUploaderModal } from './components/TemplateUploaderModal';
import { SavedRecordsModal } from './components/SavedRecordsModal';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const DEFAULT_SAMPLE_CUSTOMER: CustomerData = {
  customerName: 'Mr. BHAVIN BHASKARBHAI PATEL',
  accountNumber: '306050055336',
  customerId: '350003624381',
  address: 'CHORAWALI KHADKI, SALUN TALPAD,\n387001, GUJARAT',
  branchName: 'PETLAD (5     )',
  branchCode: '006',
  ifscCode: 'GSCB0KDC006',
  micrCode: '388801051',
  branchAddress: 'Nr. N. K. High School',
  productDescription: 'SB INDIVIDUAL',
  dateOfIssue: '20/11/2026',
  ckycNo: 'XXXXXX5557',
  accountHolderName: '',
  nominee: 'N',
  nomineeName: 'NOMINEE NOT AVAILABLE',
  modeOfOperation: 'SELF',
};

const EMPTY_CUSTOMER_DATA: CustomerData = {
  customerName: '',
  accountHolderName: '',
  customerId: '',
  accountNumber: '',
  address: '',
  ifscCode: '',
  branchName: '',
  branchCode: '',
  micrCode: '',
  branchAddress: '',
  productDescription: 'SB INDIVIDUAL',
  dateOfIssue: '20/11/2026',
  ckycNo: '',
  nominee: 'N',
  nomineeName: 'NOMINEE NOT AVAILABLE',
  modeOfOperation: 'SELF',
};

export const App: React.FC = () => {
  const [template, setTemplate] = useState<TemplateData | null>(null);
  const [fields, setFields] = useState<Record<DocumentFieldKey, FieldConfig>>(DEFAULT_FIELD_CONFIGS);
  const [customerData, setCustomerData] = useState<CustomerData>(DEFAULT_SAMPLE_CUSTOMER);
  const [language, setLanguage] = useState<AppLanguage>('en');
  const [selectedFieldKey, setSelectedFieldKey] = useState<DocumentFieldKey>('customerName');

  // Zoom controls (default 0.85 for 1024x576)
  const [zoom, setZoom] = useState(0.85);

  // History & Records
  const [savedRecords, setSavedRecords] = useState<SavedRecord[]>([]);

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Export progress
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Initial load from IndexedDB
  useEffect(() => {
    async function init() {
      try {
        // Load or initialize template with KDCC passbook template
        let storedTemplate = await getPrimaryTemplate();
        const storedFields = await getFieldConfigs();

        // Check if stored template or coordinates are from the previous outdated version (e.g. branchName.x < 260)
        const isOutdated =
          !storedTemplate ||
          storedTemplate.width !== 1024 ||
          !storedFields ||
          !storedFields.branchName ||
          storedFields.branchName.x < 260;

        if (isOutdated) {
          storedTemplate = generateDefaultBankTemplate();
          await savePrimaryTemplate(storedTemplate);
          await saveFieldConfigs(DEFAULT_FIELD_CONFIGS);
          setFields(DEFAULT_FIELD_CONFIGS);
        } else {
          setFields({ ...DEFAULT_FIELD_CONFIGS, ...storedFields });
        }
        setTemplate(storedTemplate);

        const records = await getAllCustomerRecords();
        setSavedRecords(records);
      } catch (err) {
        console.error('Error initializing:', err);
      }
    }
    init();
  }, []);

  // Debounced auto-save for field position tweaks
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const handleUpdateFieldConfig = (key: DocumentFieldKey, updates: Partial<FieldConfig>) => {
    setFields((prev) => {
      const updated = {
        ...prev,
        [key]: {
          ...prev[key],
          ...updates,
        },
      };

      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = setTimeout(async () => {
        await saveFieldConfigs(updated);
      }, 600);

      return updated;
    });
  };

  const handleResetFieldPosition = (key: DocumentFieldKey) => {
    handleUpdateFieldConfig(key, DEFAULT_FIELD_CONFIGS[key]);
    showToast(`Reset ${key} to default position`);
  };

  // Quick Sample Fill
  const handleFillSample = (lang: AppLanguage) => {
    if (lang === 'gu') {
      const guSample: CustomerData = { ...DEFAULT_SAMPLE_CUSTOMER };
      FIELD_DEFINITIONS.forEach((def) => {
        if (def.sampleValueGujarati) {
          guSample[def.key] = def.sampleValueGujarati;
        }
      });
      setCustomerData(guSample);
      setLanguage('gu');
      showToast('ગુજરાતી નમૂનાની માહિતી ભરાઈ ગઈ');
    } else {
      setCustomerData({ ...DEFAULT_SAMPLE_CUSTOMER });
      setLanguage('en');
      showToast('Loaded KDCC Passbook sample data');
    }
  };

  // Save Record to History
  const handleSaveCustomerRecord = async () => {
    if (!customerData.customerName && !customerData.accountNumber) {
      showToast('Please enter Customer Name or Account Number', 'error');
      return;
    }

    const newRecord: SavedRecord = {
      id: `rec_${Date.now()}`,
      customerName: customerData.customerName || 'Unnamed',
      accountNumber: customerData.accountNumber || 'N/A',
      createdAt: Date.now(),
      data: { ...customerData },
    };

    await saveCustomerRecord(newRecord);
    const updated = await getAllCustomerRecords();
    setSavedRecords(updated);
    showToast('Record saved to history', 'success');
  };

  const handleDeleteRecord = async (id: string) => {
    await deleteCustomerRecord(id);
    const updated = await getAllCustomerRecords();
    setSavedRecords(updated);
    showToast('Record deleted');
  };

  // Reset to default KDCC template
  const handleResetDefaultTemplate = async () => {
    if (window.confirm('Reset to the authentic KDCC Bank passbook template?')) {
      const defaultTpl = generateDefaultBankTemplate();
      await savePrimaryTemplate(defaultTpl);
      setTemplate(defaultTpl);
      setFields(DEFAULT_FIELD_CONFIGS);
      await saveFieldConfigs(DEFAULT_FIELD_CONFIGS);
      setCustomerData({ ...DEFAULT_SAMPLE_CUSTOMER });
      showToast('Official KDCC Bank template restored');
    }
  };

  // Upload custom template
  const handleSaveUploadedTemplate = async (newTemplate: TemplateData) => {
    await savePrimaryTemplate(newTemplate);
    setTemplate(newTemplate);
    showToast(`Template updated to "${newTemplate.originalFileName}"`);
  };

  // Backup / Restore
  const handleExportBackup = async () => {
    const json = await exportWorkspaceBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartdoc-kdcc-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup downloaded');
  };

  const handleImportBackup = async (file: File) => {
    const text = await file.text();
    const ok = await importWorkspaceBackup(text);
    if (ok) {
      const tpl = await getPrimaryTemplate();
      const flds = await getFieldConfigs();
      const recs = await getAllCustomerRecords();
      if (tpl) setTemplate(tpl);
      setFields(flds);
      setSavedRecords(recs);
      showToast('Backup restored successfully!', 'success');
    } else {
      showToast('Failed to load backup', 'error');
    }
  };

  // PDF & Image Export
  const handleDownloadPdf = async () => {
    if (!template) return;
    setIsGeneratingPdf(true);
    try {
      const cleanName = (customerData.customerName || 'passbook')
        .replace(/[^a-zA-Z0-9_\u0A80-\u0AFF-]/g, '_')
        .substring(0, 30);
      await downloadDocumentAsPdf(template, fields, customerData, `KDCC_${cleanName}.pdf`);
      showToast('Official Passbook PDF downloaded!');
    } catch (err: any) {
      console.error(err);
      showToast('PDF error: ' + err.message, 'error');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadImage = async (format: 'png' | 'jpeg') => {
    if (!template) return;
    setIsGeneratingImg(true);
    try {
      const cleanName = (customerData.customerName || 'passbook')
        .replace(/[^a-zA-Z0-9_\u0A80-\u0AFF-]/g, '_')
        .substring(0, 30);
      await downloadDocumentAsImage(template, fields, customerData, format, `KDCC_${cleanName}`);
      showToast(`Passbook image downloaded as ${format.toUpperCase()}`);
    } catch (err: any) {
      console.error(err);
      showToast('Image error: ' + err.message, 'error');
    } finally {
      setIsGeneratingImg(false);
    }
  };

  const handlePrint = async () => {
    if (!template) return;
    try {
      await printDocument(template, fields, customerData);
    } catch (err: any) {
      console.error(err);
      showToast('Print error: ' + err.message, 'error');
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-800">
      {/* 1. Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        template={template}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onResetDefaultTemplate={handleResetDefaultTemplate}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
      />

      {/* 2. Workspace Body */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Side: Clean Form */}
        <aside className="w-full lg:w-[480px] shrink-0 h-1/2 lg:h-full z-10 shadow-xs border-r border-slate-200 bg-white flex flex-col">
          <CustomerForm
            data={customerData}
            onChange={(k, val) => setCustomerData((prev) => ({ ...prev, [k]: val }))}
            onClear={() => setCustomerData(EMPTY_CUSTOMER_DATA)}
            onFillSample={handleFillSample}
            language={language}
            onDownloadPdf={handleDownloadPdf}
            onDownloadImage={handleDownloadImage}
            onPrint={handlePrint}
            onSaveRecord={handleSaveCustomerRecord}
            onOpenHistory={() => setIsHistoryModalOpen(true)}
            historyCount={savedRecords.length}
            isGeneratingPdf={isGeneratingPdf}
            isGeneratingImg={isGeneratingImg}
            fields={fields}
            selectedFieldKey={selectedFieldKey}
            onSelectFieldKey={setSelectedFieldKey}
            onUpdateFieldConfig={handleUpdateFieldConfig}
            onResetFieldPosition={handleResetFieldPosition}
          />
        </aside>

        {/* Right Side: Large Document Preview */}
        <main className="flex-1 h-1/2 lg:h-full relative flex flex-col bg-slate-100 overflow-hidden">
          {/* Floating Zoom Controls Pill */}
          <div className="absolute bottom-5 right-5 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-slate-300 px-2.5 py-1.5 rounded-full shadow-md text-slate-700">
            <button
              onClick={() => setZoom((z) => Math.max(0.4, Number((z - 0.1).toFixed(2))))}
              className="p-1 rounded-full hover:bg-slate-100 transition"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-xs font-mono font-semibold px-1 text-slate-800">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(1.8, Number((z + 0.1).toFixed(2))))}
              className="p-1 rounded-full hover:bg-slate-100 transition"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <div className="h-3.5 w-px bg-slate-300 mx-0.5" />
            <button
              onClick={() => setZoom(0.85)}
              className="p-1 rounded-full hover:bg-slate-100 transition"
              title="Fit to View (85%)"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Konva Stage Preview */}
          {template ? (
            <DocumentCanvas
              template={template}
              fields={fields}
              customerData={customerData}
              selectedFieldKey={selectedFieldKey}
              onSelectField={setSelectedFieldKey}
              zoom={zoom}
              onZoomChange={setZoom}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
              Loading template...
            </div>
          )}
        </main>
      </div>

      {/* 3. Toast Message */}
      {toast && (
        <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-3 duration-200">
          <div
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold shadow-lg border ${
              toast.type === 'error'
                ? 'bg-red-50 text-red-800 border-red-200'
                : 'bg-slate-900 text-white border-slate-800'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="h-4 w-4 text-red-500" />
            ) : (
              <CheckCircle className="h-4 w-4 text-emerald-400" />
            )}
            <span>{toast.msg}</span>
          </div>
        </div>
      )}

      {/* 4. Modals */}
      <TemplateUploaderModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSaveTemplate={handleSaveUploadedTemplate}
        currentTemplate={template}
      />

      <SavedRecordsModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        records={savedRecords}
        onSelectRecord={(rec) => {
          setCustomerData(rec);
          showToast('Customer record loaded');
        }}
        onDeleteRecord={handleDeleteRecord}
      />
    </div>
  );
};

export default App;
