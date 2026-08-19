import React, { useState } from 'react';
import { SafetyCase, CaseFilter, ActiveNavTab } from '../types';
import { 
  AlertTriangle, 
  ArrowRight, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight, 
  Cpu, 
  Zap, 
  ListFilter
} from 'lucide-react';

interface TriageDashboardProps {
  cases: SafetyCase[];
  selectedFilter: CaseFilter;
  onSelectCase: (caseId: string) => void;
  onSelectNavTab: (tab: ActiveNavTab) => void;
  onSetAuditFilter?: (caseId: string) => void;
  searchQuery: string;
}

export const TriageDashboard: React.FC<TriageDashboardProps> = ({
  cases,
  selectedFilter,
  onSelectCase,
  onSelectNavTab,
  onSetAuditFilter,
  searchQuery,
}) => {
  const [queueMode, setQueueMode] = useState<'live' | 'historical'>('live');
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  // Filter cases according to sidebar status filter and queue mode
  const filteredCases = cases.filter((c) => {
    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchId = c.id.toLowerCase().includes(q);
      const matchInitials = c.patientInitials.toLowerCase().includes(q);
      const matchDrug = c.products.some(p => 
        p.drugName.toLowerCase().includes(q) || 
        p.activeIngredient.toLowerCase().includes(q)
      );
      if (!matchId && !matchInitials && !matchDrug) return false;
    }

    // Live vs Historical
    if (queueMode === 'live' && c.status === 'CLOSED') {
      if (selectedFilter !== 'closed') return false;
    }
    if (queueMode === 'historical' && c.status !== 'CLOSED') {
      return false;
    }

    // Status filter
    if (selectedFilter === 'all-cases') return true;
    if (selectedFilter === 'intake') return c.status === 'INTAKE';
    if (selectedFilter === 'triaged') return c.status === 'TRIAGED';
    if (selectedFilter === 'immediate-review') return c.status === 'IMMEDIATE_REVIEW';
    if (selectedFilter === 'closed') return c.status === 'CLOSED';
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredCases.length / itemsPerPage));
  const displayedCases = filteredCases.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const getStatusBadge = (status: SafetyCase['status']) => {
    switch (status) {
      case 'IMMEDIATE_REVIEW':
        return (
          <span className="bg-red-500/20 text-red-300 border border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.2)] font-semibold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider truncate">
            IMMEDIATE_MD_REVIEW
          </span>
        );
      case 'TRIAGED':
        return (
          <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            TRIAGED
          </span>
        );
      case 'INTAKE':
        return (
          <span className="bg-white/10 text-slate-300 border border-white/10 font-semibold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            INTAKE
          </span>
        );
      case 'CLOSED':
        return (
          <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            CLOSED
          </span>
        );
    }
  };

  const handleViewAuditLog = (caseId: string) => {
    if (onSetAuditFilter) {
      onSetAuditFilter(caseId);
    }
    onSelectNavTab('audit-logs');
  };

  return (
    <div id="triage-dashboard-container" className="flex flex-col w-full text-slate-100">
      {/* Main Content Padding Wrapper */}
      <div className="px-8 py-6 flex flex-col gap-8">
        {/* URGENT REVIEW SECTION */}
        <section className="flex flex-col gap-4">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-[26px] font-bold text-white tracking-tight flex items-center gap-2">
                Triage Dashboard
              </h1>
              <p className="text-[13px] text-slate-400 mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse"></span>
                Automated DDI Detection Engine Active
              </p>
            </div>
            {/* Live Queue / Historical Selector with Frosted Glass styling */}
            <div className="flex items-center gap-1 bg-white/5 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-sm">
              <button
                id="btn-live-queue"
                onClick={() => {
                  setQueueMode('live');
                  setPage(1);
                }}
                className={`px-3.5 py-1 rounded-full text-[12px] font-semibold transition-all cursor-pointer ${
                  queueMode === 'live'
                    ? 'bg-white/15 text-white shadow-[0_0_12px_rgba(255,255,255,0.1)] border border-white/15'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Live Queue
              </button>
              <button
                id="btn-historical-queue"
                onClick={() => {
                  setQueueMode('historical');
                  setPage(1);
                }}
                className={`px-3.5 py-1 rounded-full text-[12px] font-semibold transition-all cursor-pointer ${
                  queueMode === 'historical'
                    ? 'bg-white/15 text-white shadow-[0_0_12px_rgba(255,255,255,0.1)] border border-white/15'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Historical
              </button>
            </div>
          </div>

          {/* Critical Alert Card (PV-2024-002) with Frosted Red Glass */}
          <div 
            id="critical-alert-hero-card"
            className="relative bg-red-500/[0.08] backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-red-500/30 overflow-hidden flex items-stretch"
          >
            {/* Status Indicator Bar */}
            <div className="w-2 bg-gradient-to-b from-red-500 to-rose-600 shadow-[0_0_15px_#ef4444] shrink-0"></div>

            {/* Abstract Background SVG for visual richness */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none text-red-400 flex justify-end items-center overflow-hidden">
              <svg className="w-64 h-64 -mr-16" fill="currentColor" viewBox="0 0 200 200">
                <path
                  d="M100 0C44.77 0 0 44.77 0 100s44.77 100 100 100 100-44.77 100-100S155.23 0 100 0zM100 160c-33.14 0-60-26.86-60-60s26.86-60 60-60 60 26.86 60 60-26.86 60-60 60z"
                  opacity="0.5"
                />
                <circle cx="100" cy="100" r="30" />
              </svg>
            </div>

            <div className="flex-1 p-6 flex flex-col md:flex-row items-start md:items-center justify-between relative z-10 gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="bg-red-500/20 text-red-300 font-bold text-[11px] px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5 border border-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.2)]">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> Critical DDI
                  </span>
                  <span className="bg-white/10 text-slate-300 font-semibold text-[11px] px-3 py-1 rounded-full uppercase tracking-widest border border-white/10">
                    Immediate Medical Review
                  </span>
                </div>
                <div className="flex items-baseline gap-4 mt-2">
                  <h2 className="text-[32px] font-bold text-white tracking-tight">
                    PV-2024-002
                  </h2>
                  <span className="font-mono text-[13px] text-slate-400">
                    Patient Initials: AS
                  </span>
                </div>
                <p className="text-[14px] text-slate-200 mt-1 max-w-3xl leading-relaxed">
                  System detected <strong className="font-semibold text-red-300">CRITICAL</strong> severity interaction between Warfarin (5mg) and Aspirin (81mg). Recommended Action: <span className="font-mono text-[12px] bg-white/10 px-2 py-0.5 rounded-md font-semibold text-blue-200 border border-white/10">ESCALATE_TO_MD</span>.
                </p>
              </div>

              <div className="flex flex-col items-start md:items-end gap-3 pl-0 md:pl-6 border-t md:border-t-0 md:border-l border-white/10 shrink-0 w-full md:w-auto pt-3 md:pt-0">
                <div className="text-left md:text-right">
                  <p className="text-[12px] font-medium text-slate-400">Auto-Escalated</p>
                  <p className="text-[15px] text-red-400 font-bold mt-0.5 font-mono shadow-[0_0_10px_rgba(239,68,68,0.3)]">Due: +2 Days</p>
                </div>
                <button
                  id="hero-review-case-btn"
                  onClick={() => onSelectCase('PV-2024-002')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[12px] font-bold px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] border border-white/15 transition-all flex items-center gap-2 group cursor-pointer"
                >
                  Review Case File{' '}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN GRID LAYOUT */}
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT PANEL: High Density Frosted Table */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-bold text-white flex items-center gap-2">
                <ListFilter className="w-5 h-5 text-blue-400" /> Active Case Queue
              </h3>
              <span className="text-[12px] text-slate-400">
                Filter: <strong className="capitalize text-slate-200">{selectedFilter.replace('-', ' ')}</strong>
              </span>
            </div>

            <div className="bg-white/[0.03] backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.37)] border border-white/10 overflow-hidden flex flex-col">
              {/* Table Header */}
              <div className="grid grid-cols-12 bg-white/5 px-5 py-3.5 gap-4 items-center border-b border-white/10">
                <div className="col-span-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Case ID
                </div>
                <div className="col-span-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Patient
                </div>
                <div className="col-span-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Status
                </div>
                <div className="col-span-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">
                  Due Date
                </div>
                <div className="col-span-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">
                  Action
                </div>
              </div>

              {/* Table Body (High Density Frosted Rows) */}
              <div className="flex flex-col divide-y divide-white/5">
                {displayedCases.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-[13px]">
                    No cases match the selected filter or search criteria.
                  </div>
                ) : (
                  displayedCases.map((c) => {
                    const isCritical = c.severity === 'CRITICAL' && c.status === 'IMMEDIATE_REVIEW';
                    return (
                      <div
                        key={c.id}
                        id={`case-row-${c.id}`}
                        onClick={() => onSelectCase(c.id)}
                        className={`grid grid-cols-12 px-5 py-3 gap-4 items-center transition-all relative cursor-pointer ${
                          isCritical
                            ? 'bg-red-500/[0.08] hover:bg-red-500/[0.15]'
                            : 'hover:bg-white/[0.05]'
                        }`}
                      >
                        {isCritical && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 shadow-[0_0_8px_#ef4444]"></div>
                        )}
                        
                        {/* Case ID */}
                        <div className="col-span-3 font-mono text-[13px] text-white font-semibold flex items-center gap-2">
                          {isCritical && (
                            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
                          )}
                          <span className={!isCritical ? 'pl-2' : ''}>{c.id}</span>
                        </div>

                        {/* Patient */}
                        <div className="col-span-2 text-[13px] text-slate-300 font-medium">
                          {c.patientInitials}
                        </div>

                        {/* Status */}
                        <div className="col-span-3 flex items-center">
                          {getStatusBadge(c.status)}
                        </div>

                        {/* Due Date */}
                        <div className={`col-span-2 font-mono text-right text-[12px] ${
                          isCritical ? 'text-red-400 font-bold' : 'text-slate-400'
                        }`}>
                          {c.dueDate}
                        </div>

                        {/* Action */}
                        <div className="col-span-2 flex justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectCase(c.id);
                            }}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                            title="Open case details"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Table Footer / Pagination */}
              <div className="bg-white/5 px-5 py-3 flex items-center justify-between text-[13px] text-slate-400 border-t border-white/10">
                <span>
                  Showing {filteredCases.length > 0 ? (page - 1) * itemsPerPage + 1 : 0}-
                  {Math.min(page * itemsPerPage, filteredCases.length)} of {filteredCases.length} Active Cases
                </span>
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-2.5 py-0.5 text-[12px] font-mono text-slate-300 bg-white/5 rounded-md border border-white/10">
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-slate-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Recent System Flags */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
            <h3 className="text-[18px] font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-indigo-400" /> Recent System Flags
            </h3>

            {/* Primary Flag Card with Frosted Glass */}
            <div className="bg-white/[0.04] backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/10 p-5 flex flex-col gap-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Engine: DDI-RULES-v2
                </span>
                <span className="font-mono text-[11px] text-blue-400">2 mins ago</span>
              </div>

              {/* Connection Visualization */}
              <div className="bg-white/5 rounded-2xl p-4 flex flex-col gap-3 relative border border-white/10 shadow-inner">
                <div className="absolute left-6 top-8 bottom-8 w-px border-l border-dashed border-white/20"></div>

                {/* Drug A */}
                <div className="flex items-start gap-3 relative z-10">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 shrink-0 mt-1 shadow-[0_0_8px_rgba(96,165,250,0.6)] ring-2 ring-[#0a0a1a]"></div>
                  <div>
                    <h4 className="text-[13px] font-bold text-white">Warfarin</h4>
                    <p className="text-[11px] text-slate-400">Suspect Product • 5mg</p>
                  </div>
                </div>

                {/* Interaction Node */}
                <div className="flex items-center gap-3 ml-1 relative z-10">
                  <div className="w-6 h-6 rounded-full bg-red-500/20 shadow-sm flex items-center justify-center border border-red-500/40">
                    <Zap className="w-3.5 h-3.5 text-red-400" />
                  </div>
                  <span className="bg-red-500/20 text-red-300 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-red-500/30">
                    Critical Severity
                  </span>
                </div>

                {/* Drug B */}
                <div className="flex items-start gap-3 relative z-10">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-purple-400 to-indigo-500 shrink-0 mt-1 shadow-[0_0_8px_rgba(192,132,252,0.6)] ring-2 ring-[#0a0a1a]"></div>
                  <div>
                    <h4 className="text-[13px] font-bold text-white">Aspirin</h4>
                    <p className="text-[11px] text-slate-400">Concomitant Product • 81mg</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[13px] text-slate-300 leading-relaxed">
                  Automated evaluation completed for{' '}
                  <span 
                    onClick={() => onSelectCase('PV-2024-002')}
                    className="font-mono text-blue-400 font-bold underline cursor-pointer hover:text-blue-300"
                  >
                    PV-2024-002
                  </span>
                  . Escalation protocol triggered via{' '}
                  <span className="font-mono text-[11px] bg-white/10 px-1.5 py-0.5 rounded text-slate-300 border border-white/10">
                    TRG_AFTER_PRODUCT_INSERT
                  </span>
                  .
                </p>
              </div>

              <button
                id="btn-view-audit-log-from-flag"
                onClick={() => handleViewAuditLog('PV-2024-002')}
                className="w-full mt-1 bg-white/10 text-white hover:bg-white/15 border border-white/15 text-[12px] font-bold py-2.5 rounded-xl transition-all text-center shadow-sm cursor-pointer"
              >
                View Audit Log
              </button>
            </div>

            {/* Secondary Flag (Major) */}
            <div 
              id="flag-card-rule-1042"
              onClick={() => onSelectCase('PV-2024-005')}
              className="bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 p-5 flex flex-col gap-3 hover:bg-white/[0.06] hover:border-white/20 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Rule #1042
                </span>
                <span className="font-mono text-[11px] text-slate-400">45 mins ago</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Major Severity
                </span>
                <span className="text-[13px] font-semibold text-white">
                  Simvastatin + Erythromycin
                </span>
              </div>
              <p className="text-[12px] text-slate-400 truncate">
                Flagged warning. No auto-escalation required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
