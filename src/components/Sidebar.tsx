import React from 'react';
import { CaseFilter } from '../types';
import { 
  List, 
  Inbox, 
  CheckSquare, 
  AlertTriangle, 
  CheckCircle2, 
  User,
  ShieldCheck,
  Activity
} from 'lucide-react';

interface SidebarProps {
  selectedFilter: CaseFilter;
  onSelectFilter: (filter: CaseFilter) => void;
  caseCounts: {
    all: number;
    intake: number;
    triaged: number;
    immediateReview: number;
    closed: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedFilter,
  onSelectFilter,
  caseCounts,
}) => {
  const filterItems: { id: CaseFilter; label: string; icon: React.ReactNode; count: number; isUrgent?: boolean }[] = [
    {
      id: 'all-cases',
      label: 'All Cases',
      icon: <List className="w-4 h-4 mr-3" />,
      count: caseCounts.all,
    },
    {
      id: 'intake',
      label: 'Intake',
      icon: <Inbox className="w-4 h-4 mr-3" />,
      count: caseCounts.intake,
    },
    {
      id: 'triaged',
      label: 'Triaged',
      icon: <CheckSquare className="w-4 h-4 mr-3" />,
      count: caseCounts.triaged,
    },
    {
      id: 'immediate-review',
      label: 'Immediate Review',
      icon: <AlertTriangle className="w-4 h-4 mr-3" />,
      count: caseCounts.immediateReview,
      isUrgent: true,
    },
    {
      id: 'closed',
      label: 'Closed',
      icon: <CheckCircle2 className="w-4 h-4 mr-3" />,
      count: caseCounts.closed,
    },
  ];

  return (
    <aside 
      id="main-sidebar"
      className="fixed left-0 top-0 h-full w-72 bg-white/[0.03] backdrop-blur-2xl z-50 flex flex-col border-r border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
    >
      {/* Brand Header */}
      <div 
        id="brand-header"
        onClick={() => onSelectFilter('all-cases')}
        className="h-16 flex items-center px-6 border-b border-white/10 mb-4 cursor-pointer group gap-3"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-[15px] font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
            CLINICAL INTEGRITY
          </span>
          <span className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">
            PV Safety Triage
          </span>
        </div>
      </div>

      {/* Case Status Filters Header */}
      <div className="px-6 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
        <span>Case Status Filters</span>
        <Activity className="w-3.5 h-3.5 text-blue-400" />
      </div>

      {/* Nav List */}
      <nav id="case-filters-nav" className="flex-1 px-3 space-y-1.5 mt-1">
        {filterItems.map((item) => {
          const isActive = selectedFilter === item.id;
          return (
            <button
              key={item.id}
              id={`filter-btn-${item.id}`}
              onClick={() => onSelectFilter(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-[13px] rounded-xl transition-all text-left group cursor-pointer ${
                isActive
                  ? 'bg-white/10 text-white font-semibold backdrop-blur-md border border-white/15 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent font-normal'
              }`}
            >
              <div className="flex items-center">
                <span className={isActive ? 'text-blue-400' : item.isUrgent ? 'text-red-400' : 'text-slate-400 group-hover:text-slate-200'}>
                  {item.icon}
                </span>
                <span className={isActive ? 'text-white' : ''}>{item.label}</span>
              </div>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-mono transition-all ${
                  isActive
                    ? 'bg-blue-500/30 text-blue-200 font-bold border border-blue-400/30'
                    : item.isUrgent
                    ? 'bg-red-500/20 text-red-300 font-bold border border-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.3)]'
                    : 'bg-white/5 text-slate-400 border border-white/10 group-hover:text-slate-300'
                }`}
              >
                {item.count}
              </span>
            </button>
          );
        })}
      </nav>

      {/* System Integrity & Regulatory Status Widget */}
      <div className="px-4 mb-3">
        <div className="p-3.5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-sm">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-medium">
            <span className="uppercase tracking-wider">21 CFR 11 Engine</span>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
              Active
            </span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
            <div className="w-[88%] h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>
          <p className="text-[10px] text-slate-400 font-mono flex justify-between">
            <span>DDI Rules Synced</span>
            <span className="text-slate-300 font-semibold">1,204 Rules</span>
          </p>
        </div>
      </div>

      {/* Profile Footer */}
      <div id="sidebar-user-footer" className="px-4 pb-6">
        <div className="bg-white/5 backdrop-blur-xl p-3 rounded-2xl flex items-center gap-3 border border-white/10 shadow-sm hover:border-white/20 transition-all">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-[13px] font-semibold text-white truncate">
              Dr. Sarah Miller
            </p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]"></span>
              <p className="text-[11px] text-slate-400 truncate">Medical Reviewer (MD)</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
