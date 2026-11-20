import React, { useState, useMemo } from 'react';
import {
  Building2,
  MapPin,
  Search,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Phone,
  Mail,
  Hash,
} from 'lucide-react';
import { BankBranch, SUPPORTED_BANKS } from '../data/bankDirectory';
import { AppLanguage, DocumentFieldKey } from '../types';

interface BankBranchSelectorProps {
  language: AppLanguage;
  onApplyBranch: (fields: Partial<Record<DocumentFieldKey, string>>) => void;
}

export const BankBranchSelector: React.FC<BankBranchSelectorProps> = ({
  language,
  onApplyBranch,
}) => {
  const isGu = language === 'gu';

  // Selected Bank (Defaults to KDCC Bank)
  const [selectedBankId, setSelectedBankId] = useState<string>('kheda_dccb');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<BankBranch | null>(
    SUPPORTED_BANKS[0].branches[0] || null // Default to first KDCC branch (Anand)
  );
  const [copyBranchAddress, setCopyBranchAddress] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  const currentBank = useMemo(() => {
    return SUPPORTED_BANKS.find((b) => b.id === selectedBankId) || SUPPORTED_BANKS[0];
  }, [selectedBankId]);

  // Filter branches based on search input
  const filteredBranches = useMemo(() => {
    if (!searchTerm.trim()) return currentBank.branches;
    const term = searchTerm.toLowerCase();
    return currentBank.branches.filter((b) => {
      return (
        b.officeEn.toLowerCase().includes(term) ||
        b.officeGu.toLowerCase().includes(term) ||
        b.ifsc.toLowerCase().includes(term) ||
        b.districtEn.toLowerCase().includes(term) ||
        b.districtGu.toLowerCase().includes(term) ||
        b.micrCode.includes(term) ||
        b.branchCode.includes(term)
      );
    });
  }, [currentBank, searchTerm]);

  // Handle branch application to the form
  const handleApply = (branch: BankBranch) => {
    const codePadded = (branch.branchCode || '').padEnd(6, ' ');
    const branchName = isGu
      ? `${branch.officeGu} (${codePadded})`
      : `${branch.officeEn.toUpperCase()} (${codePadded})`;

    const updates: Partial<Record<DocumentFieldKey, string>> = {
      branchName,
      branchCode: branch.branchCode,
      ifscCode: branch.ifsc,
      micrCode: branch.micrCode,
      branchAddress: branch.address,
    };

    if (copyBranchAddress && branch.address) {
      updates.address = branch.address;
    }

    onApplyBranch(updates);
    setSelectedBranch(branch);
    setIsApplied(true);
    setTimeout(() => setIsApplied(false), 2500);
  };

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 space-y-3 shadow-inner">
      {/* Header with Source Link */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
          <Building2 className="h-4 w-4" />
          <span>{isGu ? 'બેંક અને શાખા પસંદગી' : 'Bank & Branch Quick Select'}</span>
        </div>

        <a
          href="https://www.khedadccb.bank.in/branch-locater"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-blue-400 transition"
          title="Open official KDCC Bank Branch Locator"
        >
          <span>khedadccb.bank.in</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* 1. Bank Selection Dropdown */}
      <div className="space-y-1">
        <label className="text-[11px] font-medium text-slate-300 block">
          {isGu ? 'બેંકનું નામ પસંદ કરો' : 'Select Bank:'}
        </label>
        <div className="relative">
          <select
            value={selectedBankId}
            onChange={(e) => {
              setSelectedBankId(e.target.value);
              setSearchTerm('');
              const newBank = SUPPORTED_BANKS.find((b) => b.id === e.target.value);
              if (newBank && newBank.branches.length > 0) {
                setSelectedBranch(newBank.branches[0]);
              }
            }}
            className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg px-2.5 py-1.5 text-xs text-white appearance-none cursor-pointer pr-8 font-medium"
          >
            {SUPPORTED_BANKS.map((bank) => (
              <option key={bank.id} value={bank.id}>
                {isGu ? bank.nameGu : bank.nameEn} ({bank.branches.length} {isGu ? 'શાખાઓ' : 'Branches'})
              </option>
            ))}
          </select>
          <ChevronDown className="h-4 w-4 absolute right-2.5 top-2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* 2. Branch Search and Selector */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <label className="font-medium text-slate-300">
            {isGu ? 'શાખા પસંદ કરો' : 'Select Branch:'}
          </label>
          <span className="text-[10px] text-slate-400">
            {filteredBranches.length} {isGu ? 'શાખાઓ ઉપલબ્ધ' : 'branches available'}
          </span>
        </div>

        {/* Search input for branches */}
        <div className="relative">
          <Search className="h-3.5 w-3.5 absolute left-2.5 top-2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              isGu
                ? 'શાખાનું નામ, જિલ્લો અથવા IFSC કોડ શોધો...'
                : 'Search branch by name, district, or IFSC...'
            }
            className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-slate-500"
          />
        </div>

        {/* Branch Dropdown */}
        <div className="relative">
          <select
            value={selectedBranch?.ifsc || ''}
            onChange={(e) => {
              const b = currentBank.branches.find((br) => br.ifsc === e.target.value);
              if (b) {
                setSelectedBranch(b);
              }
            }}
            className="w-full bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-lg px-2.5 py-1.5 text-xs text-white appearance-none cursor-pointer pr-8"
          >
            {filteredBranches.map((branch) => (
              <option key={branch.ifsc} value={branch.ifsc}>
                {isGu ? branch.officeGu : branch.officeEn} ({branch.districtEn}) — IFSC: {branch.ifsc}
              </option>
            ))}
          </select>
          <ChevronDown className="h-4 w-4 absolute right-2.5 top-2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* 3. Selected Branch Details Preview Card */}
      {selectedBranch && (
        <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-bold text-white flex items-center gap-1.5">
                <span>{isGu ? selectedBranch.officeGu : selectedBranch.officeEn}</span>
                <span className="text-[10px] font-normal text-slate-400">
                  ({selectedBranch.districtEn} Dist.)
                </span>
              </h4>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                {selectedBranch.address}
              </p>
            </div>
          </div>

          {/* Grid of Key Codes */}
          <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-slate-800 font-mono text-[11px]">
            <div className="bg-slate-950 p-1.5 rounded border border-slate-800/80">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 block">IFSC</span>
              <span className="text-emerald-400 font-bold">{selectedBranch.ifsc}</span>
            </div>
            <div className="bg-slate-950 p-1.5 rounded border border-slate-800/80">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 block">MICR</span>
              <span className="text-blue-400 font-bold">{selectedBranch.micrCode}</span>
            </div>
            <div className="bg-slate-950 p-1.5 rounded border border-slate-800/80">
              <span className="text-[9px] uppercase tracking-wider text-slate-500 block">Code</span>
              <span className="text-amber-400 font-bold">{selectedBranch.branchCode}</span>
            </div>
          </div>

          {/* Phone / Contact if available */}
          {selectedBranch.phone && (
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-0.5">
              <Phone className="h-3 w-3 text-slate-500" />
              <span>Contact: {selectedBranch.phone}</span>
              {selectedBranch.email && (
                <>
                  <span className="text-slate-600">•</span>
                  <Mail className="h-3 w-3 text-slate-500" />
                  <span className="truncate">{selectedBranch.email}</span>
                </>
              )}
            </div>
          )}

          {/* Optional copy address checkbox */}
          <div className="pt-1">
            <label className="flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={copyBranchAddress}
                onChange={(e) => setCopyBranchAddress(e.target.checked)}
                className="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-blue-500"
              />
              <span>
                {isGu
                  ? 'શાખાનું સરનામું પણ સરનામા ફીલ્ડમાં કોપી કરો'
                  : 'Also copy branch address into Address field'}
              </span>
            </label>
          </div>

          {/* Apply Button */}
          <button
            onClick={() => handleApply(selectedBranch)}
            className={`w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition shadow-sm ${
              isApplied
                ? 'bg-emerald-600 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {isApplied ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>{isGu ? 'શાખા વિગતો ફોર્મમાં ભરાઈ ગઈ!' : 'Branch Details Filled!'}</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-blue-200" />
                <span>
                  {isGu
                    ? `આ શાખા વિગતો ફોર્મમાં લાગુ કરો (${selectedBranch.officeGu})`
                    : `Autofill ${selectedBranch.officeEn} Details to Form`}
                </span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
