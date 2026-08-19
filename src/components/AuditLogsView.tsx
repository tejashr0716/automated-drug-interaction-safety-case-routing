import React, { useState } from 'react';
import { AuditLogEntry } from '../types';
import { 
  Download, 
  FileText, 
  Search, 
  Bot, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck,
  X
} from 'lucide-react';

interface AuditLogsViewProps {
  auditLogs: AuditLogEntry[];
  initialSearch?: string;
  onSelectCase?: (caseId: string) => void;
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({
  auditLogs,
  initialSearch = '',
  onSelectCase,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [dateRange, setDateRange] = useState('7_days');
  const [tableFilter, setTableFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  // Filter logs
  const filteredLogs = auditLogs.filter((log) => {
    if (tableFilter !== 'ALL' && log.table !== tableFilter) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      log.caseId.toLowerCase().includes(q) ||
      log.userAgent.toLowerCase().includes(q) ||
      log.table.toLowerCase().includes(q) ||
      log.field.toLowerCase().includes(q) ||
      log.newValue.toLowerCase().includes(q) ||
      log.oldValue.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / itemsPerPage));
  const displayedLogs = filteredLogs.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Timestamp_UTC', 'Case_ID', 'User_Agent', 'Table', 'Field', 'Old_Value', 'New_Value', 'Notes'];
    const rows = filteredLogs.map(l => [
      `"${l.timestampUtc}"`,
      `"${l.caseId}"`,
      `"${l.userAgent}"`,
      `"${l.table}"`,
      `"${l.field}"`,
      `"${l.oldValue}"`,
      `"${l.newValue}"`,
      `"${l.notes || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `21_CFR_Part_11_Audit_Trail_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div id="audit-logs-page" className="flex flex-col w-full min-h-screen px-8 py-6 text-slate-100 pb-12">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 mt-2 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[12px] font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/30 px-3 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" /> 21 CFR Part 11 Compliant
            </span>
          </div>
          <h1 className="text-[30px] font-bold text-white tracking-tight">
            Immutable Audit Trail
          </h1>
          <p className="text-[14px] text-slate-400 max-w-2xl leading-relaxed mt-1">
            Tamper-evident record of all system events, manual edits, and DDI escalation triggers. System-generated events are flagged under <span className="font-mono text-blue-300 font-semibold bg-white/10 px-1.5 py-0.5 rounded border border-white/10">SYSTEM_TRIGGER</span>.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            id="btn-export-csv"
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 border border-white/15 rounded-xl text-[12px] font-bold text-white hover:bg-white/15 transition-all shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>EXPORT CSV</span>
          </button>
          
          <button
            id="btn-generate-pdf"
            onClick={handlePrintPDF}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-[12px] font-bold shadow-[0_0_20px_rgba(59,130,246,0.35)] border border-white/15 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-white" />
            <span>GENERATE PDF</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-4 flex flex-wrap items-center gap-4 mb-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        
        {/* Search Field */}
        <div className="relative flex-1 min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="audit-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Case ID, User, or Field..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-2 pl-10 pr-8 text-[13px] text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Date Range Selector */}
        <div className="flex items-center gap-2 border-l border-white/10 pl-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Date Range:
          </span>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3.5 py-1.5 bg-white/5 rounded-xl border border-white/10 text-[12px] font-medium text-white hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
          >
            <option value="today" className="bg-[#0f1026]">Last 24 Hours</option>
            <option value="7_days" className="bg-[#0f1026]">Last 7 Days</option>
            <option value="30_days" className="bg-[#0f1026]">Last 30 Days</option>
            <option value="all" className="bg-[#0f1026]">All Time</option>
          </select>
        </div>

        {/* Table Filter Selector */}
        <div className="flex items-center gap-2 border-l border-white/10 pl-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Table:
          </span>
          <select
            value={tableFilter}
            onChange={(e) => setTableFilter(e.target.value)}
            className="px-3.5 py-1.5 bg-white/5 rounded-xl border border-white/10 text-[12px] font-medium text-white hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
          >
            <option value="ALL" className="bg-[#0f1026]">All Tables</option>
            <option value="SAFETY_CASES" className="bg-[#0f1026]">SAFETY_CASES</option>
            <option value="CASE_PRODUCTS" className="bg-[#0f1026]">CASE_PRODUCTS</option>
            <option value="DDI_RULES" className="bg-[#0f1026]">DDI_RULES</option>
          </select>
        </div>
      </div>

      {/* Audit Grid Container */}
      <div className="flex-1 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.37)] flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap w-[180px]">
                  Timestamp (UTC)
                </th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap w-[140px]">
                  Case ID
                </th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap w-[180px]">
                  User / Agent
                </th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap w-[130px]">
                  Table
                </th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap w-[140px]">
                  Field
                </th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Old Value
                </th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  New Value
                </th>
              </tr>
            </thead>
            
            <tbody className="text-[13px] text-slate-200 divide-y divide-white/5 font-mono">
              {displayedLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400 font-sans">
                    No audit records match the current filter query.
                  </td>
                </tr>
              ) : (
                displayedLogs.map((log) => {
                  const isAutoEscalation = log.isAutomated && (log.newValue.includes('IMMEDIATE') || log.field === 'EXPEDITED_FLAG');
                  
                  return (
                    <tr
                      key={log.id}
                      id={`audit-row-${log.id}`}
                      className={`transition-colors ${
                        isAutoEscalation
                          ? 'bg-red-500/[0.08] hover:bg-red-500/[0.14]'
                          : 'hover:bg-white/[0.04]'
                      }`}
                    >
                      {/* Timestamp */}
                      <td className="px-4 py-3.5 align-top whitespace-nowrap text-slate-400">
                        <div className="flex items-center gap-2">
                          {isAutoEscalation && (
                            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
                          )}
                          <span>{log.timestampUtc}</span>
                        </div>
                      </td>

                      {/* Case ID */}
                      <td className="px-4 py-3.5 align-top font-bold text-white">
                        {onSelectCase ? (
                          <button
                            onClick={() => onSelectCase(log.caseId)}
                            className="hover:underline text-blue-400 font-semibold cursor-pointer"
                          >
                            {log.caseId}
                          </button>
                        ) : (
                          log.caseId
                        )}
                      </td>

                      {/* User / Agent */}
                      <td className="px-4 py-3.5 align-top">
                        {log.userAgent === 'SYSTEM_TRIGGER' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-bold font-sans">
                            <Bot className="w-3.5 h-3.5 text-blue-400" />
                            SYSTEM_TRIGGER
                          </span>
                        ) : (
                          <span className="text-slate-200 font-sans font-medium text-[12px]">
                            {log.userAgent}
                          </span>
                        )}
                      </td>

                      {/* Table */}
                      <td className="px-4 py-3.5 align-top text-slate-400 text-[12px]">
                        {log.table}
                      </td>

                      {/* Field */}
                      <td className="px-4 py-3.5 align-top font-bold text-white text-[12px]">
                        {log.field}
                      </td>

                      {/* Old Value */}
                      <td className="px-4 py-3.5 align-top text-slate-400 text-[12px]">
                        {log.oldValue}
                      </td>

                      {/* New Value */}
                      <td className="px-4 py-3.5 align-top text-[12px]">
                        <span className={isAutoEscalation ? 'text-red-400 font-bold' : 'text-slate-200'}>
                          {log.newValue}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="bg-white/5 px-6 py-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-[13px] text-slate-400">
            Showing {filteredLogs.length > 0 ? (page - 1) * itemsPerPage + 1 : 0} to{' '}
            {Math.min(page * itemsPerPage, filteredLogs.length)} of {1240 + filteredLogs.length} entries
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-white/10 transition-colors disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 text-[12px] font-mono text-white bg-white/10 rounded-xl border border-white/10">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:bg-white/10 transition-colors disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
