import React, { useState } from 'react';
import { SafetyCase } from '../types';
import { 
  ArrowLeft, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  History, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  X,
  Send,
  Lock
} from 'lucide-react';

interface CaseDetailViewProps {
  safetyCase: SafetyCase;
  onBackToQueue: () => void;
  onAddNote: (caseId: string, noteContent: string) => void;
  onEscalateCase: (caseId: string, reason: string) => void;
  onSignOffCase: (caseId: string, signOffComment: string) => void;
}

export const CaseDetailView: React.FC<CaseDetailViewProps> = ({
  safetyCase,
  onBackToQueue,
  onAddNote,
  onEscalateCase,
  onSignOffCase,
}) => {
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [escalateReason, setEscalateReason] = useState('Critical DDI interaction verified. Urgent clinical follow-up required.');
  const [showSignOffModal, setShowSignOffModal] = useState(false);
  const [signOffComment, setSignOffComment] = useState('Medical review completed. Clinical benefit-risk ratio evaluated and documented.');
  const [signaturePassword, setSignaturePassword] = useState('');

  const isCritical = safetyCase.severity === 'CRITICAL' || safetyCase.status === 'IMMEDIATE_REVIEW';

  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    onAddNote(safetyCase.id, noteText);
    setNoteText('');
    setShowNoteModal(false);
  };

  const handleConfirmEscalate = () => {
    onEscalateCase(safetyCase.id, escalateReason);
    setShowEscalateModal(false);
  };

  const handleConfirmSignOff = () => {
    onSignOffCase(safetyCase.id, signOffComment);
    setShowSignOffModal(false);
  };

  return (
    <div id="case-detail-container" className="flex flex-col w-full min-h-screen text-slate-100 pb-12">
      {/* Top Action Bar with Frosted Glass styling */}
      <div 
        id="case-top-action-bar"
        className="w-full bg-[#0a0a1a]/70 backdrop-blur-2xl border-b border-white/10 sticky top-16 z-30 px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-sm"
      >
        <div className="flex items-center gap-6">
          <button
            id="back-to-queue-btn"
            onClick={onBackToQueue}
            className="flex items-center gap-2 text-slate-400 text-[13px] hover:text-white font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Queue</span>
          </button>
          <div className="h-6 w-px bg-white/10"></div>
          <div className="flex items-baseline gap-3">
            <h1 className="text-[22px] font-bold text-white tracking-tight font-mono">
              {safetyCase.id}
            </h1>
            {safetyCase.expedited && (
              <span className="bg-red-500/20 text-red-300 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                EXPEDITED
              </span>
            )}
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
              safetyCase.status === 'CLOSED'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : safetyCase.status === 'IMMEDIATE_REVIEW'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                : 'bg-white/10 text-slate-300 border border-white/10'
            }`}>
              {safetyCase.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            id="btn-add-medical-note"
            onClick={() => setShowNoteModal(true)}
            className="px-4 py-2 bg-white/10 border border-white/15 rounded-xl text-[13px] font-semibold text-white hover:bg-white/15 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <FileText className="w-4 h-4 text-blue-400" />
            <span>Add Medical Note</span>
          </button>

          {safetyCase.status !== 'IMMEDIATE_REVIEW' && safetyCase.status !== 'CLOSED' && (
            <button
              id="btn-escalate-to-md"
              onClick={() => setShowEscalateModal(true)}
              className="px-4 py-2 bg-red-600/80 hover:bg-red-500 text-white rounded-xl text-[13px] font-semibold transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] border border-red-400/40 flex items-center gap-2 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Escalate to MD</span>
            </button>
          )}

          {safetyCase.status !== 'CLOSED' ? (
            <button
              id="btn-sign-off"
              onClick={() => setShowSignOffModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-[13px] font-semibold transition-all shadow-[0_0_20px_rgba(59,130,246,0.35)] border border-white/15 flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Sign Off</span>
            </button>
          ) : (
            <span className="flex items-center gap-1.5 text-emerald-300 bg-emerald-500/20 px-3.5 py-1.5 rounded-xl border border-emerald-500/30 text-[12px] font-bold">
              <ShieldCheck className="w-4 h-4" /> Signed Off & Closed
            </span>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="p-8 grid grid-cols-12 gap-6 max-w-[1600px] mx-auto w-full">
        
        {/* Left Column: Patient & Timeline */}
        <div className="col-span-12 xl:col-span-3 flex flex-col gap-6">
          
          {/* Patient Info Card */}
          <div className="bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/10 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <h2 className="text-[11px] font-bold text-slate-400 mb-4 uppercase tracking-wider">
              Patient Demographics
            </h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-[18px] font-bold shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                {safetyCase.patientInitials}
              </div>
              <div>
                <div className="text-[16px] font-bold text-white">
                  Initials: {safetyCase.patientInitials}
                </div>
                <div className="text-[12px] text-slate-400">
                  {safetyCase.patientDobMasked}
                </div>
              </div>
            </div>
            <div className="space-y-4 text-[13px]">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Receipt Date</div>
                <div className="text-[14px] text-slate-200 font-semibold mt-0.5">
                  {safetyCase.receiptDate}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Source</div>
                <div className="text-[14px] text-slate-200 font-semibold mt-0.5">
                  {safetyCase.source}
                </div>
              </div>
            </div>
          </div>

          {/* Regulatory Timeline Card */}
          <div className="bg-red-500/[0.08] backdrop-blur-2xl rounded-3xl border border-red-500/30 p-6 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <h2 className="text-[11px] font-bold text-red-300 mb-4 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-400" />
              Regulatory Timeline
            </h2>
            <div className="flex flex-col items-center justify-center py-3">
              <div className="text-[38px] font-bold text-red-400 leading-none mb-1 font-mono shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                {safetyCase.status === 'CLOSED' ? '0h' : '48h'}
              </div>
              <div className="text-[12px] text-slate-400 text-center">
                {safetyCase.status === 'CLOSED' ? 'Case Resolved' : 'Until Regulatory Deadline'}
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 mt-2 mb-4 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all ${
                  safetyCase.status === 'CLOSED' ? 'bg-emerald-400' : 'bg-gradient-to-r from-red-500 to-rose-600 shadow-[0_0_8px_#ef4444]'
                }`}
                style={{ width: safetyCase.status === 'CLOSED' ? '100%' : '85%' }}
              ></div>
            </div>
            <div className="text-[12px] text-slate-400 flex justify-between">
              <span>Due:</span>
              <span className="font-semibold text-slate-200">{safetyCase.dueDate}</span>
            </div>
          </div>

        </div>

        {/* Center Column: Products & DDI */}
        <div className="col-span-12 xl:col-span-6 flex flex-col gap-6">
          
          {/* Critical DDI Banner */}
          {isCritical && (
            <div className="bg-red-500/[0.12] backdrop-blur-2xl border border-red-500/40 rounded-3xl p-6 flex items-start gap-4 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-red-500 shadow-[0_0_10px_#ef4444]"></div>
              <AlertTriangle className="w-7 h-7 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-[18px] font-bold text-red-200 mb-1.5 tracking-tight">
                  CRITICAL INTERACTION DETECTED
                </h3>
                <p className="text-[13px] text-red-300/90 mb-3 leading-relaxed">
                  System automatically escalated case to <span className="font-mono font-semibold text-white bg-red-500/20 px-1 rounded border border-red-500/30">IMMEDIATE_MEDICAL_REVIEW</span> due to Level 1 interaction between Suspect and Concomitant medications.
                </p>
                <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-red-500/30 text-red-200 text-[12px] font-bold shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
                  <span>
                    {safetyCase.products.map(p => p.drugName).join(' + ')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Products Table */}
          <div className="bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/10 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div className="p-4 px-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Product Inventory
              </h2>
              <span className="text-[12px] text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full font-mono font-semibold border border-white/10">
                {safetyCase.products.length} Items
              </span>
            </div>
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Drug Name</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Active Ingredient</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Daily Dose</th>
                  </tr>
                </thead>
                <tbody className="text-[13px] divide-y divide-white/5">
                  {safetyCase.products.map((prod) => {
                    const isSuspect = prod.role === 'SUSPECT';
                    return (
                      <tr key={prod.id} className="hover:bg-white/[0.04] transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${isSuspect ? 'bg-red-400 shadow-[0_0_6px_#ef4444]' : 'bg-blue-400 shadow-[0_0_6px_#60a5fa]'}`}></span>
                          {prod.drugName}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${
                            isSuspect
                              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}>
                            {prod.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          {prod.activeIngredient}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">
                          {prod.classType}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-200">
                          {prod.dailyDose}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Case Narrative */}
          <div className="bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/10 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <h2 className="text-[11px] font-bold text-slate-400 mb-3 uppercase tracking-wider">
              Case Narrative
            </h2>
            <p className="text-[14px] text-slate-300 leading-relaxed">
              {safetyCase.narrative}
            </p>
          </div>

          {/* Medical Reviewer Notes */}
          {safetyCase.notes.length > 0 && (
            <div className="bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/10 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
              <h2 className="text-[11px] font-bold text-slate-400 mb-4 uppercase tracking-wider flex items-center justify-between">
                <span>Medical Reviewer Notes & Signatures</span>
                <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-2.5 py-0.5 rounded-full font-mono border border-emerald-500/30">
                  21 CFR 11 Signed
                </span>
              </h2>
              <div className="space-y-4">
                {safetyCase.notes.map((n) => (
                  <div key={n.id} className="p-4 bg-white/5 rounded-2xl border border-white/10 text-[13px]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-white">{n.author} ({n.role})</span>
                      <span className="text-[11px] text-slate-400 font-mono">{n.timestamp}</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">{n.content}</p>
                    {n.signatureHash && (
                      <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                        <Lock className="w-3 h-3 text-blue-400" />
                        <span>e-Sig SHA256: {n.signatureHash.substring(0, 24)}...</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: 21 CFR Part 11 Audit Trail */}
        <div className="col-span-12 xl:col-span-3 flex flex-col">
          <div className="bg-white/[0.03] backdrop-blur-2xl rounded-3xl border border-white/10 flex flex-col h-full overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div className="p-4 px-6 border-b border-white/10 bg-white/5 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" />
              <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                21 CFR Part 11 Audit
              </h2>
            </div>
            <div className="p-6 flex-1 overflow-y-auto max-h-[700px]">
              <div className="relative border-l-2 border-white/10 ml-3 space-y-6">
                {safetyCase.auditHistory.length === 0 ? (
                  <div className="pl-6 text-[12px] text-slate-400">
                    No audit records logged yet for this case.
                  </div>
                ) : (
                  safetyCase.auditHistory.map((item, idx) => {
                    const isSystem = item.userAgent === 'SYSTEM_TRIGGER';
                    return (
                      <div key={item.id || idx} className="relative pl-6">
                        {/* Timeline Node */}
                        <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-[#0a0a1a] ${
                          isSystem ? 'bg-red-400 shadow-[0_0_8px_#ef4444]' : 'bg-slate-400'
                        }`}></div>

                        <div className="text-[11px] font-mono text-slate-400 mb-1">
                          {item.timestampUtc}
                        </div>

                        <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10 shadow-sm">
                          <div className="text-[13px] font-bold text-white mb-1">
                            {item.field === 'STATUS' ? 'Status Auto-Updated' : item.field === 'INSERT_ROW' ? 'Record Added' : `${item.field} Changed`}
                          </div>
                          
                          {item.field === 'STATUS' ? (
                            <div className="text-[12px] text-slate-400 mb-2 flex items-center gap-1.5 font-mono">
                              <span className="line-through opacity-70">{item.oldValue}</span>
                              <ArrowRight className="w-3 h-3 text-red-400" />
                              <span className="text-red-300 font-bold">{item.newValue}</span>
                            </div>
                          ) : (
                            <div className="text-[12px] text-slate-300 mb-2">
                              {item.newValue}
                            </div>
                          )}

                          <div className="text-[10px] text-slate-300 font-mono bg-white/10 px-2 py-0.5 rounded-md inline-block border border-white/10">
                            User: {item.userAgent}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Add Medical Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-[#0f1026]/95 backdrop-blur-2xl rounded-3xl max-w-lg w-full p-6 shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-white/15 text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <h3 className="text-[16px] font-bold text-white">Add Medical Assessment Note</h3>
              </div>
              <button onClick={() => setShowNoteModal(false)} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <p className="text-[12px] text-slate-400">
                All clinical notes will be immutably recorded in the 21 CFR Part 11 audit log and signed under Dr. Sarah Miller (MD).
              </p>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Enter clinical assessment, rationale, patient INR status, or prescriber outreach details..."
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-[13px] text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none shadow-inner"
              />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowNoteModal(false)}
                className="px-4 py-2 text-[13px] font-semibold text-slate-400 hover:text-white rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                disabled={!noteText.trim()}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-[13px] font-semibold shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Save & Sign Note</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Escalate to MD Modal */}
      {showEscalateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-[#0f1026]/95 backdrop-blur-2xl rounded-3xl max-w-md w-full p-6 shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-red-500/30 text-slate-200">
            <div className="flex items-center gap-2.5 text-red-400 mb-2">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-[17px] font-bold text-white">Escalate Case to Medical Director</h3>
            </div>
            <p className="text-[13px] text-slate-400 mb-4">
              This action will mark the case as <span className="font-bold text-red-300">IMMEDIATE_REVIEW</span> and start the expedited 48-hour regulatory timeline.
            </p>
            <div className="space-y-2 mb-4">
              <label className="text-[12px] font-bold text-slate-300">Escalation Rationale:</label>
              <textarea
                value={escalateReason}
                onChange={(e) => setEscalateReason(e.target.value)}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-[13px] text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 resize-none shadow-inner"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowEscalateModal(false)}
                className="px-4 py-2 text-[13px] font-semibold text-slate-400 hover:text-white rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmEscalate}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-[13px] font-semibold shadow-[0_0_15px_rgba(239,68,68,0.4)] cursor-pointer"
              >
                Confirm Escalation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sign Off Modal */}
      {showSignOffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-[#0f1026]/95 backdrop-blur-2xl rounded-3xl max-w-md w-full p-6 shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-white/15 text-slate-200">
            <div className="flex items-center gap-2.5 text-white mb-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <h3 className="text-[17px] font-bold">21 CFR Part 11 Electronic Sign-Off</h3>
            </div>
            <p className="text-[13px] text-slate-400 mb-4">
              By providing your electronic signature, you certify that this pharmacovigilance safety evaluation has been thoroughly reviewed according to GCP and FDA 21 CFR 314.80 guidelines.
            </p>
            <div className="space-y-3 mb-5">
              <div>
                <label className="text-[12px] font-bold text-slate-300">Medical Review Summary:</label>
                <textarea
                  value={signOffComment}
                  onChange={(e) => setSignOffComment(e.target.value)}
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-[13px] text-white mt-1 resize-none shadow-inner"
                />
              </div>
              <div>
                <label className="text-[12px] font-bold text-slate-300">Reviewer PIN / Confirmation:</label>
                <input
                  type="password"
                  value={signaturePassword}
                  onChange={(e) => setSignaturePassword(e.target.value)}
                  placeholder="Enter PIN (e.g. 1234)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-[13px] text-white mt-1 shadow-inner"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowSignOffModal(false)}
                className="px-4 py-2 text-[13px] font-semibold text-slate-400 hover:text-white rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSignOff}
                className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-[13px] font-semibold shadow-[0_0_15px_rgba(59,130,246,0.35)] flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Execute Electronic Signature</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
