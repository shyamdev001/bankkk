import React from 'react';
import {
  AVAILABLE_FONTS,
  DocumentFieldKey,
  FIELD_DEFINITIONS,
  FieldConfig,
  DEFAULT_FIELD_CONFIGS,
} from '../types';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Eye,
  EyeOff,
  RotateCcw,
  ScanText,
  Save,
  CheckCircle2,
  Sliders,
  Type,
  Move,
  Palette,
} from 'lucide-react';

interface FieldDesignerProps {
  fields: Record<DocumentFieldKey, FieldConfig>;
  selectedKey: DocumentFieldKey;
  onSelectKey: (key: DocumentFieldKey) => void;
  onUpdateConfig: (key: DocumentFieldKey, updates: Partial<FieldConfig>) => void;
  onResetField: (key: DocumentFieldKey) => void;
  onResetAll: () => void;
  onSaveToIndexedDb: () => Promise<void>;
  onTriggerOcrScan: () => void;
  isSaving: boolean;
  lastSavedTime: number | null;
}

const COLOR_PRESETS = [
  { name: 'Dark Navy', hex: '#0f172a' },
  { name: 'Pure Black', hex: '#000000' },
  { name: 'Bank Blue', hex: '#1e3a8a' },
  { name: 'Cobalt', hex: '#0284c7' },
  { name: 'Charcoal', hex: '#334155' },
  { name: 'Forest Green', hex: '#065f46' },
  { name: 'Maroon', hex: '#881337' },
];

export const FieldDesigner: React.FC<FieldDesignerProps> = ({
  fields,
  selectedKey,
  onSelectKey,
  onUpdateConfig,
  onResetField,
  onResetAll,
  onSaveToIndexedDb,
  onTriggerOcrScan,
  isSaving,
  lastSavedTime,
}) => {
  const currentConfig = fields[selectedKey] || DEFAULT_FIELD_CONFIGS[selectedKey];
  const definition = FIELD_DEFINITIONS.find((d) => d.key === selectedKey)!;

  const handleUpdate = (updates: Partial<FieldConfig>) => {
    onUpdateConfig(selectedKey, updates);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-100">
      {/* Designer Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">Template Field Layout</h2>
          </div>

          <div className="flex items-center gap-2">
            {lastSavedTime && (
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                <CheckCircle2 className="h-3 w-3" />
                IndexedDB
              </span>
            )}
            <button
              onClick={onSaveToIndexedDb}
              disabled={isSaving}
              className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow transition disabled:opacity-50"
              title="Save all field positions to IndexedDB"
            >
              <Save className="h-3.5 w-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* OCR Auto-Detect Banner Button */}
        <button
          onClick={onTriggerOcrScan}
          className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-indigo-500/15 via-blue-500/15 to-purple-500/15 hover:from-indigo-500/25 hover:to-purple-500/25 text-indigo-300 border border-indigo-500/30 transition shadow-sm"
        >
          <ScanText className="h-4 w-4 text-indigo-400" />
          <span>Auto-Scan Labels with Tesseract OCR</span>
        </button>
      </div>

      {/* Field Selector Pill List */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/60 overflow-x-auto scrollbar-none">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Select Field to Style &amp; Position:
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {FIELD_DEFINITIONS.map((def) => {
            const isSelected = def.key === selectedKey;
            const config = fields[def.key];
            return (
              <button
                key={def.key}
                onClick={() => onSelectKey(def.key)}
                className={`flex items-center justify-between text-left px-2.5 py-1.5 rounded-md text-xs font-medium transition ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <span className="truncate">{def.label}</span>
                {!config?.visible && (
                  <EyeOff className="h-3 w-3 text-slate-500 ml-1 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Scrollable Configuration Controls */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Active Field Title & Visibility */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
              Selected Field
            </span>
            <h3 className="text-sm font-bold text-white">{definition.label}</h3>
            <span className="text-xs text-slate-400">{definition.labelGujarati}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleUpdate({ visible: !currentConfig.visible })}
              className={`p-1.5 rounded-md text-xs transition ${
                currentConfig.visible
                  ? 'bg-slate-800 text-blue-400 hover:bg-slate-700'
                  : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
              }`}
              title={currentConfig.visible ? 'Hide field on document' : 'Show field on document'}
            >
              {currentConfig.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </button>
            <button
              onClick={() => onResetField(selectedKey)}
              className="p-1.5 rounded-md text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              title="Reset field position & font to default"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* 1. Position & Coordinates (X, Y, Width, Height) */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <Move className="h-3.5 w-3.5 text-indigo-400" />
            <span>Position &amp; Bounding Box (px)</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* X Position */}
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <label className="text-[10px] text-slate-400 font-medium block mb-1">
                X (Horizontal)
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={currentConfig.x}
                  onChange={(e) => handleUpdate({ x: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                />
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => handleUpdate({ x: currentConfig.x + 5 })}
                    className="px-1 text-[10px] bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleUpdate({ x: Math.max(0, currentConfig.x - 5) })}
                    className="px-1 text-[10px] bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                  >
                    -
                  </button>
                </div>
              </div>
            </div>

            {/* Y Position */}
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <label className="text-[10px] text-slate-400 font-medium block mb-1">
                Y (Vertical)
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={currentConfig.y}
                  onChange={(e) => handleUpdate({ y: parseInt(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
                />
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => handleUpdate({ y: currentConfig.y + 5 })}
                    className="px-1 text-[10px] bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleUpdate({ y: Math.max(0, currentConfig.y - 5) })}
                    className="px-1 text-[10px] bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                  >
                    -
                  </button>
                </div>
              </div>
            </div>

            {/* Width */}
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <label className="text-[10px] text-slate-400 font-medium block mb-1">Width</label>
              <input
                type="number"
                value={currentConfig.width}
                onChange={(e) => handleUpdate({ width: parseInt(e.target.value) || 50 })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
              />
            </div>

            {/* Height */}
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
              <label className="text-[10px] text-slate-400 font-medium block mb-1">Height</label>
              <input
                type="number"
                value={currentConfig.height}
                onChange={(e) => handleUpdate({ height: parseInt(e.target.value) || 20 })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* 2. Typography & Fonts (English & Gujarati) */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <Type className="h-3.5 w-3.5 text-indigo-400" />
            <span>Typography (English &amp; Gujarati)</span>
          </div>

          {/* Font Family Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] text-slate-400 block font-medium">Font Family</label>
            <select
              value={currentConfig.fontFamily}
              onChange={(e) => handleUpdate({ fontFamily: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
            >
              <optgroup label="English Fonts">
                {AVAILABLE_FONTS.filter((f) => f.category === 'English').map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Gujarati Fonts (ગુજરાતી)">
                {AVAILABLE_FONTS.filter((f) => f.category === 'Gujarati').map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {/* Font Size Slider & Number */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <label className="text-[11px] text-slate-400 font-medium">Font Size</label>
              <span className="text-white font-mono">{currentConfig.fontSize}px</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={8}
                max={48}
                step={1}
                value={currentConfig.fontSize}
                onChange={(e) => handleUpdate({ fontSize: parseInt(e.target.value) })}
                className="w-full accent-indigo-500"
              />
              <input
                type="number"
                min={8}
                max={48}
                value={currentConfig.fontSize}
                onChange={(e) => handleUpdate({ fontSize: parseInt(e.target.value) || 14 })}
                className="w-14 bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-xs text-center font-mono text-white"
              />
            </div>
          </div>

          {/* Formatting Toggles: Alignment, Bold, Italic */}
          <div className="flex items-center gap-2">
            {/* Alignment buttons */}
            <div className="flex bg-slate-950 border border-slate-800 rounded-lg p-0.5">
              <button
                onClick={() => handleUpdate({ align: 'left' })}
                className={`p-1.5 rounded text-xs ${
                  currentConfig.align === 'left' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`}
                title="Align Left"
              >
                <AlignLeft className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleUpdate({ align: 'center' })}
                className={`p-1.5 rounded text-xs ${
                  currentConfig.align === 'center' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`}
                title="Align Center"
              >
                <AlignCenter className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => handleUpdate({ align: 'right' })}
                className={`p-1.5 rounded text-xs ${
                  currentConfig.align === 'right' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                }`}
                title="Align Right"
              >
                <AlignRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Bold Toggle */}
            <button
              onClick={() => handleUpdate({ bold: !currentConfig.bold })}
              className={`p-2 rounded-lg border text-xs font-bold transition ${
                currentConfig.bold
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
              title="Toggle Bold"
            >
              <Bold className="h-3.5 w-3.5" />
            </button>

            {/* Italic Toggle */}
            <button
              onClick={() => handleUpdate({ italic: !currentConfig.italic })}
              className={`p-2 rounded-lg border text-xs italic transition ${
                currentConfig.italic
                  ? 'bg-indigo-600 text-white border-indigo-500'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
              title="Toggle Italic"
            >
              <Italic className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* 3. Text Color Selection */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <Palette className="h-3.5 w-3.5 text-indigo-400" />
            <span>Text Color</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="color"
              value={currentConfig.color}
              onChange={(e) => handleUpdate({ color: e.target.value })}
              className="h-8 w-10 bg-transparent border-0 cursor-pointer rounded"
            />
            <input
              type="text"
              value={currentConfig.color}
              onChange={(e) => handleUpdate({ color: e.target.value })}
              className="flex-1 bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs font-mono text-white"
            />
          </div>

          {/* Quick color preset chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {COLOR_PRESETS.map((p) => (
              <button
                key={p.hex}
                onClick={() => handleUpdate({ color: p.hex })}
                className="w-6 h-6 rounded-full border border-slate-700 shadow-xs hover:scale-110 transition"
                style={{ backgroundColor: p.hex }}
                title={p.name}
              />
            ))}
          </div>
        </div>

        {/* 4. Optional Prefix */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={!!currentConfig.showPrefix}
              onChange={(e) => handleUpdate({ showPrefix: e.target.checked })}
              className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Prepend static prefix to field value</span>
          </label>

          {currentConfig.showPrefix && (
            <input
              type="text"
              value={currentConfig.prefixText || ''}
              onChange={(e) => handleUpdate({ prefixText: e.target.value })}
              placeholder="e.g. A/C NO: or IFSC:"
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
            />
          )}
        </div>

        {/* Reset All Fields to Defaults */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={onResetAll}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-red-400 bg-slate-950 hover:bg-slate-800 border border-slate-800 transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset All 9 Fields to Default Layout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
