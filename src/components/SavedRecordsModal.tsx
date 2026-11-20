import React, { useState } from 'react';
import {
  X,
  History,
  Trash2,
  ArrowRight,
  Search,
  Calendar,
  CreditCard,
  User,
} from 'lucide-react';
import { CustomerData, SavedRecord } from '../types';

interface SavedRecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  records: SavedRecord[];
  onSelectRecord: (data: CustomerData) => void;
  onDeleteRecord: (id: string) => Promise<void>;
}

export const SavedRecordsModal: React.FC<SavedRecordsModalProps> = ({
  isOpen,
  onClose,
  records,
  onSelectRecord,
  onDeleteRecord,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredRecords = records.filter((r) => {
    const term = search.toLowerCase();
    return (
      (r.customerName || '').toLowerCase().includes(term) ||
      (r.accountNumber || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-blue-400" />
            <div>
              <h3 className="text-base font-bold text-white">Generated Document History</h3>
              <p className="text-xs text-slate-400">
                Quickly reload past customer profiles and certificates
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

        {/* Search */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/50">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name or account number..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500"
            />
          </div>
        </div>

        {/* Records List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              {search ? 'No records match your search query.' : 'No customer records saved yet.'}
            </div>
          ) : (
            filteredRecords.map((rec) => {
              const formattedDate = new Date(rec.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={rec.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 text-blue-400" />
                      <span className="text-xs font-bold text-white">
                        {rec.customerName || 'Unnamed Customer'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 font-mono">
                        <CreditCard className="h-3 w-3 text-emerald-400" />
                        A/C: {rec.accountNumber || 'N/A'}
                      </span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <Calendar className="h-3 w-3" />
                        {formattedDate}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onSelectRecord(rec.data);
                        onClose();
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition shadow-xs"
                    >
                      <span>Load</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => onDeleteRecord(rec.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-900 transition"
                      title="Delete record"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 bg-slate-950">
          <span>{records.length} records saved in IndexedDB</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-md text-slate-400 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
