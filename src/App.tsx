import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  AppLanguage,
  AppMode,
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
  deletePrimaryTemplate,
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
import { FieldDesigner } from './components/FieldDesigner';
import { DocumentCanvas } from './components/DocumentCanvas';
import { TemplateUploaderModal } from './components/TemplateUploaderModal';
import { OcrModal } from './components/OcrModal';
import { SavedRecordsModal } from './components/SavedRecordsModal';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

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
};

export const App: React.FC = () => {
  // === Primary States ===
  const [template, setTemplate] = useState<TemplateData | null>(null);
  const [fields, setFields] = useState<Record<DocumentFieldKey, FieldConfig>>(DEFAULT_FIELD_CONFIGS);
  const [customerData, setCustomerData] = useState<CustomerData>(EMPTY_CUSTOMER_DATA);
  const [mode, setMode] = useState<AppMode>('generate');
  const [language, setLanguage] = useState<AppLanguage>('en');
  const [selectedFieldKey, setSelectedFieldKey] = useState<DocumentFieldKey>('customerName');

  // Canvas View Controls
  const [zoom, setZoom] = useState(0.65);
  const [showGrid, setShowGrid] = useState(false);

  // Storage and Records
  const [savedRecords, setSavedRecords] = useState<SavedRecord[]>([]);
  const [isSavingFields, setIsSavingFields] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<number | null>(null);

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isOcrModalOpen, setIsOcrModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Export Progress
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);

  // Toast / Notification
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // === Initial Load from IndexedDB ===
  useEffect(() => {
    async function loadInitialData() {
      try {
        // 1. Load or initialize template
        let storedTemplate = await getPrimaryTemplate();
        if (!storedTemplate) {
          storedTemplate = generateDefaultBankTemplate();
          await savePrimaryTemplate(storedTemplate);
        }
        setTemplate(storedTemplate);

        // 2. Load field configurations
        const storedFields = await getFieldConfigs();
        setFields(storedFields);
        setLastSavedTime(Date.now());

        // 3. Load saved history
        const records = await getAllCustomerRecords();
        setSavedRecords(records);

        // Default to sample data so user sees immediate results
        handleFillSample('en');

        // Adjust initial zoom to comfortably fit window width
        const availableWidth = window.innerWidth > 1024 ? window.innerWidth - 460 : window.innerWidth;
        const targetZoom = Math.min(0.75, Math.max(0.4, (availableWidth * 0.85) / storedTemplate.width));
        setZoom(Number(targetZoom.toFixed(2)));
      } catch (err) {
        console.error('Error loading initial data from IndexedDB:', err);
      }
    }
    loadInitialData();
  }, []);

  // Save fields to IndexedDB
  const handleSaveFields = async () => {
    setIsSavingFields(true);
    try {
      await saveFieldConfigs(fields);
      setLastSavedTime(Date.now());
      showToast('Field positions saved to IndexedDB', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to save fields to IndexedDB', 'error');
    } finally {
      setIsSavingFields(false);
    }
  };

  // Debounced auto-save when in design mode
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const updateFieldConfig = (key: DocumentFieldKey, updates: Partial<FieldConfig>) => {
    setFields((prev) => {
      const updated = {
        ...prev,
        [key]: {
          ...prev[key],
          ...updates,
        },
      };

      // Trigger debounced auto-save
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = setTimeout(async () => {
        await saveFieldConfigs(updated);
        setLastSavedTime(Date.now());
      }, 800);

      return updated;
    });
  };

  // Fill sample data
  const handleFillSample = (lang: AppLanguage) => {
    const sample: CustomerData = { ...EMPTY_CUSTOMER_DATA };
    FIELD_DEFINITIONS.forEach((def) => {
      sample[def.key] = lang === 'gu' ? def.sampleValueGujarati : def.sampleValue;
    });
    setCustomerData(sample);
    setLanguage(lang);
    showToast(`Loaded sample data (${lang === 'gu' ? 'ગુજરાતી' : 'English'})`, 'info');
  };

  // Reset fields
  const handleResetField = (key: DocumentFieldKey) => {
    updateFieldConfig(key, DEFAULT_FIELD_CONFIGS[key]);
    showToast(`Reset ${key} to default position`);
  };

  const handleResetAllFields = async () => {
    if (window.confirm('Reset all 9 field positions to their default layout?')) {
      setFields(DEFAULT_FIELD_CONFIGS);
      await saveFieldConfigs(DEFAULT_FIELD_CONFIGS);
      setLastSavedTime(Date.now());
      showToast('All fields reset to default layout');
    }
  };

  // Template handling
  const handleSaveTemplate = async (newTemplate: TemplateData) => {
    await savePrimaryTemplate(newTemplate);
    setTemplate(newTemplate);
    showToast(`Set "${newTemplate.originalFileName}" as fixed template!`);
  };

  const handleResetDefaultTemplate = async () => {
    if (window.confirm('Reset to pre-installed official bank certificate template?')) {
      const defaultTpl = generateDefaultBankTemplate();
      await savePrimaryTemplate(defaultTpl);
      setTemplate(defaultTpl);
      showToast('Default bank template restored');
    }
  };

  // Customer record persistence
  const handleSaveCustomerRecord = async () => {
    if (!customerData.customerName && !customerData.accountNumber) {
      showToast('Please enter at least a customer name or account number', 'error');
      return;
    }

    const newRecord: SavedRecord = {
      id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      customerName: customerData.customerName || 'Unnamed',
      accountNumber: customerData.accountNumber || 'N/A',
      createdAt: Date.now(),
      data: { ...customerData },
    };

    await saveCustomerRecord(newRecord);
    const updated = await getAllCustomerRecords();
    setSavedRecords(updated);
    showToast('Customer record saved to IndexedDB', 'success');
  };

  const handleDeleteRecord = async (id: string) => {
    await deleteCustomerRecord(id);
    const updated = await getAllCustomerRecords();
    setSavedRecords(updated);
    showToast('Record deleted from history');
  };

  // OCR Suggestions
  const handleApplyOcrSuggestions = (suggestions: Partial<Record<DocumentFieldKey, Partial<FieldConfig>>>) => {
    setFields((prev) => {
      const updated = { ...prev };
      for (const k of Object.keys(suggestions) as DocumentFieldKey[]) {
        if (suggestions[k]) {
          updated[k] = {
            ...updated[k],
            ...suggestions[k],
          };
        }
      }
      saveFieldConfigs(updated);
      setLastSavedTime(Date.now());
      return updated;
    });
    showToast('Applied OCR detected field coordinates!', 'success');
  };

  // Workspace backup / restore
  const handleExportBackup = async () => {
    const json = await exportWorkspaceBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartdoc-studio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Workspace backup exported');
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
      showToast('Workspace backup successfully restored!', 'success');
    } else {
      showToast('Failed to parse backup file', 'error');
    }
  };

  // Downloads & Print
  const handleDownloadPdf = async () => {
    if (!template) return;
    setIsGeneratingPdf(true);
    try {
      const cleanName = (customerData.customerName || 'certificate')
        .replace(/[^a-zA-Z0-9_\u0A80-\u0AFF-]/g, '_')
        .substring(0, 30);
      await downloadDocumentAsPdf(template, fields, customerData, `SmartDoc_${cleanName}.pdf`);
      showToast('Official PDF generated and downloaded!');
    } catch (err: any) {
      console.error(err);
      showToast('Failed to generate PDF: ' + err.message, 'error');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadImage = async (format: 'png' | 'jpeg') => {
    if (!template) return;
    setIsGeneratingImg(true);
    try {
      const cleanName = (customerData.customerName || 'document')
        .replace(/[^a-zA-Z0-9_\u0A80-\u0AFF-]/g, '_')
        .substring(0, 30);
      await downloadDocumentAsImage(template, fields, customerData, format, `SmartDoc_${cleanName}`);
      showToast(`Document downloaded as ${format.toUpperCase()}`);
    } catch (err: any) {
      console.error(err);
      showToast('Failed to generate image: ' + err.message, 'error');
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
      showToast('Failed to initiate print: ' + err.message, 'error');
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans">
      {/* 1. Header Bar */}
      <Header
        mode={mode}
        onModeChange={(m) => {
          setMode(m);
          if (m === 'design') {
            setShowGrid(true);
          }
        }}
        language={language}
        onLanguageChange={setLanguage}
        template={template}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onResetDefaultTemplate={handleResetDefaultTemplate}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
      />

      {/* 2. Main Split-Screen Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left Side: Form (Generate Mode) or Designer (Design Mode) */}
        <aside className="w-full lg:w-[450px] shrink-0 h-1/2 lg:h-full z-10 shadow-xl border-r border-slate-800">
          {mode === 'generate' ? (
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
            />
          ) : (
            <FieldDesigner
              fields={fields}
              selectedKey={selectedFieldKey}
              onSelectKey={setSelectedFieldKey}
              onUpdateConfig={updateFieldConfig}
              onResetField={handleResetField}
              onResetAll={handleResetAllFields}
              onSaveToIndexedDb={handleSaveFields}
              onTriggerOcrScan={() => setIsOcrModalOpen(true)}
              isSaving={isSavingFields}
              lastSavedTime={lastSavedTime}
            />
          )}
        </aside>

        {/* Right Side: Document Preview & Interactive Stage */}
        <main className="flex-1 h-1/2 lg:h-full relative flex flex-col bg-slate-950 overflow-hidden">
          {/* Floating Canvas Controls Overlay */}
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-1.5 rounded-xl shadow-xl text-slate-300">
            {/* Zoom Out */}
            <button
              onClick={() => setZoom((z) => Math.max(0.3, Number((z - 0.1).toFixed(2))))}
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>

            {/* Current Zoom Percentage */}
            <span className="text-xs font-mono px-1.5 text-slate-200">
              {Math.round(zoom * 100)}%
            </span>

            {/* Zoom In */}
            <button
              onClick={() => setZoom((z) => Math.min(2.0, Number((z + 0.1).toFixed(2))))}
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>

            <div className="h-4 w-px bg-slate-800 mx-1" />

            {/* Fit / Reset Zoom */}
            <button
              onClick={() => setZoom(0.65)}
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-white transition"
              title="Reset Zoom (65%)"
            >
              <Maximize2 className="h-4 w-4" />
            </button>

            {/* Grid Toggle in Design Mode */}
            {mode === 'design' && (
              <button
                onClick={() => setShowGrid((g) => !g)}
                className={`p-1.5 rounded-lg transition ${
                  showGrid ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'
                }`}
                title="Toggle Alignment Grid"
              >
                <Grid className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Mode Indicator Tag */}
          <div className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-xl shadow-lg text-xs">
            <span
              className={`h-2 w-2 rounded-full ${
                mode === 'design' ? 'bg-indigo-500 animate-pulse' : 'bg-emerald-500'
              }`}
            />
            <span className="text-slate-300 font-medium">
              {mode === 'design' ? 'Field Layout Designer (Drag & Drop)' : 'Live Document Preview'}
            </span>
          </div>

          {/* Konva Interactive Document Canvas */}
          {template ? (
            <DocumentCanvas
              template={template}
              fields={fields}
              customerData={customerData}
              mode={mode}
              selectedFieldKey={selectedFieldKey}
              onSelectField={(key) => {
                if (key) setSelectedFieldKey(key);
              }}
              onUpdateFieldConfig={updateFieldConfig}
              zoom={zoom}
              onZoomChange={setZoom}
              showGrid={showGrid}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">
              Loading document template...
            </div>
          )}
        </main>
      </div>

      {/* 3. Toast Notifications */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-3 duration-200">
          <div
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-2xl border ${
              notification.type === 'error'
                ? 'bg-red-950/90 text-red-200 border-red-800'
                : notification.type === 'info'
                ? 'bg-blue-950/90 text-blue-200 border-blue-800'
                : 'bg-emerald-950/90 text-emerald-200 border-emerald-800'
            }`}
          >
            {notification.type === 'error' ? (
              <AlertCircle className="h-4 w-4 text-red-400" />
            ) : (
              <CheckCircle className="h-4 w-4 text-emerald-400" />
            )}
            <span>{notification.msg}</span>
          </div>
        </div>
      )}

      {/* 4. Modals */}
      <TemplateUploaderModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSaveTemplate={handleSaveTemplate}
        currentTemplate={template}
      />

      {template && (
        <OcrModal
          isOpen={isOcrModalOpen}
          onClose={() => setIsOcrModalOpen(false)}
          templateDataUrl={template.dataUrl}
          onApplySuggestions={handleApplyOcrSuggestions}
        />
      )}

      <SavedRecordsModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        records={savedRecords}
        onSelectRecord={(recData) => {
          setCustomerData(recData);
          showToast('Customer record loaded into form');
        }}
        onDeleteRecord={handleDeleteRecord}
      />
    </div>
  );
};

export default App;
