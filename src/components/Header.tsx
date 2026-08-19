import React, { useState } from 'react';
import { ActiveNavTab } from '../types';
import { Search, Bell, HelpCircle, Plus, AlertTriangle, ShieldCheck, X, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenNewCaseModal: () => void;
  criticalAlertCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
  onOpenNewCaseModal,
  criticalAlertCount,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const navTabs: { id: ActiveNavTab; label: string }[] = [
    { id: 'safety-cases', label: 'Safety Cases' },
    { id: 'drug-dictionary', label: 'Drug Dictionary' },
    { id: 'ddi-rules', label: 'DDI Rules' },
    { id: 'audit-logs', label: 'Audit Logs' },
  ];

  return (
    <>
      <header
        id="global-header"
        className="fixed top-0 left-72 right-0 h-16 bg-[#0a0a1a]/60 backdrop-blur-2xl z-40 border-b border-white/10 flex items-center justify-between px-8"
      >
        {/* Navigation Tabs */}
        <nav id="top-nav-tabs" className="flex items-center gap-8 h-full">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => onSelectTab(tab.id)}
                className={`relative h-full flex items-center text-[14px] transition-all cursor-pointer ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-slate-400 hover:text-white font-normal'
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-blue-500 via-indigo-400 to-purple-500 rounded-t-sm shadow-[0_0_12px_rgba(59,130,246,0.8)]"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Bar */}
        <div className="flex items-center gap-4">
          {/* Quick Intake Trigger */}
          <button
            id="quick-intake-btn"
            onClick={onOpenNewCaseModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-[12px] font-semibold shadow-[0_0_20px_rgba(59,130,246,0.35)] border border-white/15 transition-all cursor-pointer"
            title="Simulate new adverse event case intake"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Case Intake</span>
          </button>

          {/* Search Box with Frosted Glass styling */}
          <div className="relative w-80 group">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Case ID, Patient, Substance..."
              className="w-full bg-white/5 border border-white/10 backdrop-blur-md rounded-full py-1.5 pl-10 pr-4 text-[13px] text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400/60 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Notification Button & Popover */}
          <div className="relative">
            <button
              id="notifications-bell-btn"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {criticalAlertCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse"></span>
              )}
            </button>

            {showNotifications && (
              <div 
                id="notifications-dropdown"
                className="absolute right-0 mt-2 w-84 bg-[#0f1026]/95 backdrop-blur-2xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] border border-white/15 p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-200"
              >
                <div className="flex items-center justify-between pb-2.5 border-b border-white/10 mb-2.5">
                  <span className="text-[12px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    System Safety Alerts
                  </span>
                  <span className="text-[10px] bg-red-500/20 text-red-300 border border-red-500/30 px-2 py-0.5 rounded-full font-semibold">
                    {criticalAlertCount} Active
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/25 flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[12px] font-semibold text-red-200">Case PV-2024-002 Auto-Escalated</p>
                      <p className="text-[11px] text-red-300/80 mt-0.5">Critical DDI: Warfarin (5mg) + Aspirin (81mg). Regulatory clock: 48h.</p>
                      <span className="text-[10px] text-red-400/70 font-mono">2 mins ago</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[12px] font-semibold text-blue-200">DDI Engine Active</p>
                      <p className="text-[11px] text-blue-300/80 mt-0.5">Rule #1042 evaluated for Simvastatin + Erythromycin.</p>
                      <span className="text-[10px] text-blue-400/70 font-mono">45 mins ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Help Button */}
          <button
            id="help-guide-btn"
            onClick={() => setShowHelpModal(true)}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Help and Standards Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Help Modal */}
      {showHelpModal && (
        <div 
          id="help-guide-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          onClick={() => setShowHelpModal(false)}
        >
          <div 
            className="bg-[#0f1026]/95 backdrop-blur-2xl rounded-3xl max-w-xl w-full p-6 shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-white/15 text-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-[17px] font-bold text-white">Clinical Integrity PV Reference Guide</h3>
              </div>
              <button 
                onClick={() => setShowHelpModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3 text-[13px] text-slate-300 leading-relaxed">
              <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10">
                <h4 className="font-semibold text-white mb-1">Automated DDI Detection Engine</h4>
                <p>When suspect and concomitant products are entered, real-time trigger rules cross-reference the active DDI rule database. High-severity signals trigger automatic escalation to <span className="font-mono text-red-300 bg-red-500/20 px-1.5 py-0.5 rounded border border-red-500/30">IMMEDIATE_MEDICAL_REVIEW</span>.</p>
              </div>
              <div className="p-3.5 bg-white/5 rounded-2xl border border-white/10">
                <h4 className="font-semibold text-white mb-1">21 CFR Part 11 Audit Integrity</h4>
                <p>All automated status transitions and manual user actions (medical notes, escalations, sign-offs) are immutably logged with timestamp, user ID, previous state, and new state.</p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-[13px] font-semibold shadow-[0_0_15px_rgba(59,130,246,0.3)] cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
