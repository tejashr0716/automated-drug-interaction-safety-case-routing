import React, { useState } from 'react';
import { DrugDictionaryItem } from '../types';
import { 
  BookOpen, 
  Search, 
  AlertOctagon, 
  Activity, 
  ShieldAlert, 
  ChevronRight,
  Pill,
  X
} from 'lucide-react';

interface DrugDictionaryViewProps {
  drugs: DrugDictionaryItem[];
}

export const DrugDictionaryView: React.FC<DrugDictionaryViewProps> = ({ drugs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDrug, setSelectedDrug] = useState<DrugDictionaryItem | null>(drugs[0]);

  const filteredDrugs = drugs.filter((d) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      d.brandName.toLowerCase().includes(q) ||
      d.activeSubstance.toLowerCase().includes(q) ||
      d.atcCode.toLowerCase().includes(q) ||
      d.therapeuticClass.toLowerCase().includes(q)
    );
  });

  return (
    <div id="drug-dictionary-page" className="flex flex-col w-full min-h-screen px-8 py-6 text-slate-100 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 mt-2 gap-4">
        <div>
          <h1 className="text-[30px] font-bold text-white mb-1 tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-blue-400" />
            Enterprise Drug & Active Substance Dictionary
          </h1>
          <p className="text-[14px] text-slate-400 max-w-2xl leading-relaxed mt-1">
            Standardized active ingredient taxonomy, WHO ATC classifications, metabolic pathways, and cross-referenced black box contraindications.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search substance, ATC code, or brand..."
            className="w-full bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl py-2 pl-10 pr-8 text-[13px] text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-inner"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: List on Left, Detailed Monograph on Right */}
      <div className="grid grid-cols-12 gap-6 flex-1">
        
        {/* Drug List (5 cols) */}
        <div className="col-span-12 lg:col-span-5 bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col">
          <div className="p-4 bg-white/5 border-b border-white/10 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Substances Index</span>
            <span className="bg-white/10 px-2 py-0.5 rounded-full text-slate-300 font-mono text-[10px]">
              {filteredDrugs.length} Items
            </span>
          </div>
          <div className="divide-y divide-white/5 overflow-y-auto max-h-[650px]">
            {filteredDrugs.map((item) => {
              const isSelected = selectedDrug?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedDrug(item)}
                  className={`p-4 transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-white/10 border-l-4 border-blue-400 shadow-inner'
                      : 'hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[14px] font-bold text-white truncate">
                        {item.activeSubstance}
                      </h4>
                      {item.blackBoxWarning && (
                        <span className="bg-red-500/20 text-red-300 border border-red-500/40 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">
                          Black Box
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-slate-400 truncate mt-0.5">
                      {item.brandName} • <span className="font-mono text-slate-300">{item.atcCode}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {item.therapeuticClass}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-colors ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Monograph View (7 cols) */}
        <div className="col-span-12 lg:col-span-7">
          {selectedDrug ? (
            <div className="bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/10 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] flex flex-col gap-6">
              
              {/* Header Info */}
              <div className="flex items-start justify-between pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-[24px] font-bold text-white tracking-tight">
                      {selectedDrug.activeSubstance}
                    </h2>
                    {selectedDrug.blackBoxWarning && (
                      <span className="bg-red-500/20 text-red-300 border border-red-500/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
                        <AlertOctagon className="w-3.5 h-3.5 text-red-400" /> Black Box Warning
                      </span>
                    )}
                  </div>
                  <p className="text-[14px] text-slate-400 font-medium mt-1">
                    Trade Names: <strong className="text-slate-200">{selectedDrug.brandName}</strong>
                  </p>
                </div>

                <div className="bg-white/5 px-3.5 py-1.5 rounded-xl border border-white/10 text-right font-mono">
                  <span className="text-[10px] text-slate-400 block uppercase">ATC Code</span>
                  <span className="text-[13px] font-bold text-blue-300">{selectedDrug.atcCode}</span>
                </div>
              </div>

              {/* Clinical Pharmacology Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-blue-400" /> Therapeutic Class
                  </span>
                  <p className="text-[13px] font-semibold text-white mt-1.5">{selectedDrug.therapeuticClass}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5 text-purple-400" /> Elimination Half-Life
                  </span>
                  <p className="text-[13px] font-semibold text-white mt-1.5">{selectedDrug.halfLife}</p>
                </div>
              </div>

              {/* CYP450 Metabolism */}
              <div>
                <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Metabolic & Cytochrome P450 Pathway
                </h3>
                <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10 text-[13px] font-mono text-slate-200">
                  {selectedDrug.cypMetabolism}
                </div>
              </div>

              {/* Common DDI Signals */}
              <div>
                <h3 className="text-[12px] font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5 text-red-300">
                  <ShieldAlert className="w-4 h-4 text-red-400" /> Known High-Risk Drug Interactions
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDrug.commonInteractions.map((inter, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-red-500/10 text-red-300 border border-red-500/30 rounded-xl text-[12px] font-medium"
                    >
                      {selectedDrug.activeSubstance} + {inter}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contraindications */}
              <div>
                <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Contraindications
                </h3>
                <ul className="space-y-1.5 text-[13px] text-slate-300 list-disc list-inside">
                  {selectedDrug.contraindications.map((contra, idx) => (
                    <li key={idx}>{contra}</li>
                  ))}
                </ul>
              </div>

            </div>
          ) : (
            <div className="h-full bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/10 p-8 flex items-center justify-center text-slate-400 text-[14px]">
              Select an active substance from the directory on the left to view monograph.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
