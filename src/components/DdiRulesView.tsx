import React, { useState } from 'react';
import { DdiRule, DdiSeverity, DdiAction } from '../types';
import { 
  PlusCircle, 
  Search, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  Info, 
  X, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Layers
} from 'lucide-react';

interface DdiRulesViewProps {
  rules: DdiRule[];
  onToggleRule: (ruleId: string) => void;
  onCreateRule: (newRule: Omit<DdiRule, 'id' | 'lastUpdated'>) => void;
  onDeleteRule: (ruleId: string) => void;
}

export const DdiRulesView: React.FC<DdiRulesViewProps> = ({
  rules,
  onToggleRule,
  onCreateRule,
  onDeleteRule,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;

  // Form State for new rule
  const [formDrugA, setFormDrugA] = useState('');
  const [formDrugAActive, setFormDrugAActive] = useState('');
  const [formDrugB, setFormDrugB] = useState('');
  const [formDrugBActive, setFormDrugBActive] = useState('');
  const [formSeverity, setFormSeverity] = useState<DdiSeverity>('CRITICAL');
  const [formAction, setFormAction] = useState<DdiAction>('ESCALATE_TO_MD');
  const [formDesc, setFormDesc] = useState('');

  const filteredRules = rules.filter((r) => {
    if (severityFilter !== 'ALL' && r.severity !== severityFilter) return false;
    if (!searchFilter) return true;
    const q = searchFilter.toLowerCase();
    return (
      r.drugA.toLowerCase().includes(q) ||
      r.drugAActive.toLowerCase().includes(q) ||
      r.drugB.toLowerCase().includes(q) ||
      r.drugBActive.toLowerCase().includes(q) ||
      r.ruleNumber.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredRules.length / itemsPerPage));
  const displayedRules = filteredRules.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const activeRulesCount = rules.filter((r) => r.isActive).length;
  const criticalInterventionsCount = rules.filter((r) => r.severity === 'CRITICAL' && r.isActive).length * 14 + 3;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDrugA || !formDrugB) return;

    onCreateRule({
      ruleNumber: `RULE #${Math.floor(1000 + Math.random() * 9000)}`,
      drugA: formDrugA,
      drugAActive: formDrugAActive || formDrugA,
      drugB: formDrugB,
      drugBActive: formDrugBActive || formDrugB,
      severity: formSeverity,
      recommendedAction: formAction,
      isActive: true,
      description: formDesc || `Potential ${formSeverity.toLowerCase()} interaction between ${formDrugA} and ${formDrugB}.`
    });

    // Reset form
    setFormDrugA('');
    setFormDrugAActive('');
    setFormDrugB('');
    setFormDrugBActive('');
    setFormDesc('');
    setShowCreateModal(false);
  };

  const getSeverityBadge = (sev: DdiSeverity) => {
    switch (sev) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 text-[11px] font-bold tracking-wider uppercase border border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            CRITICAL
          </span>
        );
      case 'MAJOR':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold tracking-wider uppercase border border-blue-500/30">
            <AlertTriangle className="w-3.5 h-3.5 text-blue-400" />
            MAJOR
          </span>
        );
      case 'MODERATE':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-bold tracking-wider uppercase border border-purple-500/30">
            <Info className="w-3.5 h-3.5 text-purple-400" />
            MODERATE
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 text-slate-300 text-[11px] font-bold uppercase border border-white/10">
            MINOR
          </span>
        );
    }
  };

  return (
    <div id="ddi-rules-container" className="flex flex-col w-full min-h-screen text-slate-100 pb-12">
      {/* Top Banner / Hero Section with Frosted Glass */}
      <div className="px-8 pt-8">
        <div 
          id="ddi-hero-banner"
          className="relative bg-white/[0.04] backdrop-blur-2xl px-8 py-10 rounded-3xl border border-white/10 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        >
          {/* Ambient Glow */}
          <div className="absolute right-0 top-0 w-80 h-80 bg-blue-600/10 blur-[90px] rounded-full pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="max-w-2xl">
              <p className="text-[12px] font-bold uppercase tracking-widest text-blue-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> SYSTEM CONFIGURATION
              </p>
              <h1 className="text-[30px] font-bold text-white mb-2 tracking-tight">
                DDI Rules Management
              </h1>
              <p className="text-[14px] text-slate-300 leading-relaxed">
                Maintain the enterprise pharmacovigilance rules engine. Active rules automatically evaluate case products during intake to detect critical safety signals and trigger immediate medical triage.
              </p>
            </div>

            <button
              id="btn-create-new-rule"
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(59,130,246,0.35)] border border-white/15 text-[12px] font-bold uppercase tracking-wider cursor-pointer shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Rule</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats & Search Row */}
      <div className="px-8 mt-6 flex flex-wrap lg:flex-nowrap gap-6">
        {/* Stat Card 1 */}
        <div className="flex-1 min-w-[200px] bg-white/[0.03] backdrop-blur-2xl rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider">
              Active Rules
            </p>
            <p className="text-[28px] font-bold text-white mt-1 font-mono">
              {1200 + activeRulesCount}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="flex-1 min-w-[200px] bg-white/[0.03] backdrop-blur-2xl rounded-3xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-red-500/30 flex items-center justify-between">
          <div>
            <p className="text-[12px] font-bold text-red-300 uppercase tracking-wider">
              Critical Interventions
            </p>
            <p className="text-[28px] font-bold text-red-400 mt-1 font-mono shadow-[0_0_12px_rgba(239,68,68,0.3)]">
              {criticalInterventionsCount}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Search Box */}
        <div className="flex-[2] min-w-[320px] bg-white/[0.03] backdrop-blur-2xl rounded-3xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] border border-white/10 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="ddi-rules-search-input"
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search by Drug A, Drug B, or active ingredient..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-11 pr-4 text-[13px] text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-inner"
            />
          </div>

          <div className="relative">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="h-10 px-4 rounded-2xl bg-white/5 border border-white/10 text-[12px] font-semibold text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-[#0f1026] text-white">All Severities</option>
              <option value="CRITICAL" className="bg-[#0f1026] text-white">Critical Only</option>
              <option value="MAJOR" className="bg-[#0f1026] text-white">Major Only</option>
              <option value="MODERATE" className="bg-[#0f1026] text-white">Moderate Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="px-8 py-6">
        <div className="bg-white/[0.03] backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.37)] border border-white/10 overflow-hidden">
          
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-white/5 border-b border-white/10 text-[11px] font-bold text-slate-400 uppercase tracking-wider items-center">
            <div className="col-span-3">Drug A</div>
            <div className="col-span-3">Drug B</div>
            <div className="col-span-2">Severity Level</div>
            <div className="col-span-2">Recommended Action</div>
            <div className="col-span-1 text-center">Status</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {/* Table Body */}
          <div className="flex flex-col divide-y divide-white/5">
            {displayedRules.map((rule) => {
              return (
                <div
                  key={rule.id}
                  id={`ddi-rule-row-${rule.id}`}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 items-center transition-colors min-h-[54px] ${
                    !rule.isActive
                      ? 'bg-white/[0.01] opacity-60'
                      : 'hover:bg-white/[0.05]'
                  }`}
                >
                  {/* Drug A */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${
                        rule.severity === 'CRITICAL' ? 'bg-red-400 shadow-[0_0_6px_#ef4444]' : 'bg-blue-400 shadow-[0_0_6px_#60a5fa]'
                      }`}></div>
                      <div className="min-w-0">
                        <p className="text-[14px] font-bold text-white truncate">
                          {rule.drugA}
                        </p>
                        <p className="text-[12px] text-slate-400 truncate">
                          {rule.drugAActive}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Drug B */}
                  <div className="col-span-3">
                    <div className="flex items-center gap-3">
                      <Plus className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[14px] font-bold text-white truncate">
                          {rule.drugB}
                        </p>
                        <p className="text-[12px] text-slate-400 truncate">
                          {rule.drugBActive}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Severity Level */}
                  <div className="col-span-2">
                    {getSeverityBadge(rule.severity)}
                  </div>

                  {/* Recommended Action */}
                  <div className="col-span-2">
                    <span className="font-mono text-[11px] text-slate-300 uppercase tracking-wide bg-white/10 border border-white/10 px-2.5 py-1 rounded-lg">
                      {rule.recommendedAction}
                    </span>
                  </div>

                  {/* Status Switch (Interactive toggle) */}
                  <div className="col-span-1 flex justify-center">
                    <div
                      onClick={() => onToggleRule(rule.id)}
                      className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors shadow-inner border border-white/10 ${
                        rule.isActive ? 'bg-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-white/10'
                      }`}
                      title={rule.isActive ? 'Active (Click to Disable)' : 'Inactive (Click to Enable)'}
                    >
                      <div
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                          rule.isActive ? 'right-0.5' : 'left-0.5'
                        }`}
                      ></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex justify-end gap-2 text-slate-400">
                    <button 
                      onClick={() => alert(`Mechanism of Action:\n${rule.description}\n\nClinical Effect: ${rule.clinicalEffect || 'High risk of adverse signal.'}`)}
                      className="p-1.5 hover:text-white transition-colors rounded-lg hover:bg-white/10 cursor-pointer"
                      title="Inspect Rule Details"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteRule(rule.id)}
                      className="p-1.5 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10 cursor-pointer"
                      title="Delete Rule"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination / Footer */}
          <div className="px-6 py-4 bg-white/5 border-t border-white/10 flex justify-between items-center text-[13px] text-slate-400">
            <span>
              Showing {filteredRules.length > 0 ? (page - 1) * itemsPerPage + 1 : 0} to{' '}
              {Math.min(page * itemsPerPage, filteredRules.length)} of {1200 + filteredRules.length} rules
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

      {/* Create New Rule Modal with Frosted Glass */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-[#0f1026]/95 backdrop-blur-2xl rounded-3xl max-w-lg w-full p-6 shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-white/15 text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-blue-400" />
                <h3 className="text-[17px] font-bold text-white">Create New DDI Evaluation Rule</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="mt-4 space-y-4 text-[13px]">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Drug A Brand/Name *</label>
                  <input
                    type="text"
                    required
                    value={formDrugA}
                    onChange={(e) => setFormDrugA(e.target.value)}
                    placeholder="e.g. Warfarin"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-[13px] text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Drug A Active Ingredient</label>
                  <input
                    type="text"
                    value={formDrugAActive}
                    onChange={(e) => setFormDrugAActive(e.target.value)}
                    placeholder="e.g. Warfarin Sodium"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-[13px] text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Drug B Brand/Name *</label>
                  <input
                    type="text"
                    required
                    value={formDrugB}
                    onChange={(e) => setFormDrugB(e.target.value)}
                    placeholder="e.g. Aspirin"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-[13px] text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Drug B Active Ingredient</label>
                  <input
                    type="text"
                    value={formDrugBActive}
                    onChange={(e) => setFormDrugBActive(e.target.value)}
                    placeholder="e.g. Acetylsalicylic Acid"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-[13px] text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-inner"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Severity Level</label>
                  <select
                    value={formSeverity}
                    onChange={(e) => setFormSeverity(e.target.value as DdiSeverity)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-[13px] text-white focus:outline-none"
                  >
                    <option value="CRITICAL" className="bg-[#0f1026]">CRITICAL</option>
                    <option value="MAJOR" className="bg-[#0f1026]">MAJOR</option>
                    <option value="MODERATE" className="bg-[#0f1026]">MODERATE</option>
                    <option value="MINOR" className="bg-[#0f1026]">MINOR</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Recommended Action</label>
                  <select
                    value={formAction}
                    onChange={(e) => setFormAction(e.target.value as DdiAction)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-[13px] text-white focus:outline-none"
                  >
                    <option value="ESCALATE_TO_MD" className="bg-[#0f1026]">ESCALATE_TO_MD</option>
                    <option value="FLAG_WARNING" className="bg-[#0f1026]">FLAG_WARNING</option>
                    <option value="MONITOR" className="bg-[#0f1026]">MONITOR</option>
                    <option value="NO_ACTION" className="bg-[#0f1026]">NO_ACTION</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Mechanism / Clinical Rationale</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  rows={3}
                  placeholder="Describe pharmacological interaction mechanism and contraindication details..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-[13px] text-white focus:outline-none resize-none shadow-inner"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-[13px] font-semibold text-slate-400 hover:text-white rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-[13px] font-semibold shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer"
                >
                  Save & Activate Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
