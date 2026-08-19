import React, { useState } from 'react';
import { SafetyCase, DdiRule, AuditLogEntry, ProductInventoryItem } from '../types';
import { Plus, Trash2, X, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaseCreated: (newCase: SafetyCase, auditEntries: AuditLogEntry[]) => void;
  activeRules: DdiRule[];
}

export const NewCaseModal: React.FC<NewCaseModalProps> = ({
  isOpen,
  onClose,
  onCaseCreated,
  activeRules,
}) => {
  const [patientInitials, setPatientInitials] = useState('TS');
  const [source, setSource] = useState('Spontaneous Report');
  const [narrative, setNarrative] = useState('Patient reported unexplained hematoma and mucosal bleeding following recent medication co-prescription.');
  
  const [products, setProducts] = useState<{ drugName: string; role: 'SUSPECT' | 'CONCOMITANT'; activeIngredient: string; classType: string; dailyDose: string }[]>([
    { drugName: 'Warfarin', role: 'SUSPECT', activeIngredient: 'Warfarin Sodium', classType: 'Anticoagulant', dailyDose: '5mg' },
    { drugName: 'Aspirin', role: 'CONCOMITANT', activeIngredient: 'Acetylsalicylic Acid', classType: 'NSAID', dailyDose: '81mg' }
  ]);

  const [customDrugName, setCustomDrugName] = useState('');
  const [customRole, setCustomRole] = useState<'SUSPECT' | 'CONCOMITANT'>('CONCOMITANT');
  const [customDose, setCustomDose] = useState('10mg');

  if (!isOpen) return null;

  const handleAddProduct = () => {
    if (!customDrugName.trim()) return;
    setProducts([
      ...products,
      {
        drugName: customDrugName,
        role: customRole,
        activeIngredient: customDrugName,
        classType: 'Pharmacological Agent',
        dailyDose: customDose
      }
    ]);
    setCustomDrugName('');
    setCustomDose('10mg');
  };

  const handleRemoveProduct = (index: number) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleQuickPreset = (type: 'warfarin-aspirin' | 'simva-erythro' | 'routine') => {
    if (type === 'warfarin-aspirin') {
      setProducts([
        { drugName: 'Warfarin', role: 'SUSPECT', activeIngredient: 'Warfarin Sodium', classType: 'Anticoagulant', dailyDose: '5mg' },
        { drugName: 'Aspirin', role: 'CONCOMITANT', activeIngredient: 'Acetylsalicylic Acid', classType: 'NSAID', dailyDose: '81mg' }
      ]);
      setNarrative('Patient developed bilateral petechiae after adding 81mg baby aspirin daily to maintenance Warfarin anticoagulant therapy.');
    } else if (type === 'simva-erythro') {
      setProducts([
        { drugName: 'Simvastatin', role: 'SUSPECT', activeIngredient: 'Simvastatin', classType: 'Statin', dailyDose: '40mg' },
        { drugName: 'Erythromycin', role: 'CONCOMITANT', activeIngredient: 'Erythromycin Base', classType: 'Macrolide Antibiotic', dailyDose: '500mg' }
      ]);
      setNarrative('Patient presented with severe myalgia and dark urine after 3 days of co-prescribed Erythromycin.');
    } else {
      setProducts([
        { drugName: 'Metoprolol', role: 'SUSPECT', activeIngredient: 'Metoprolol Tartrate', classType: 'Beta Blocker', dailyDose: '25mg' },
        { drugName: 'Lisinopril', role: 'CONCOMITANT', activeIngredient: 'Lisinopril', classType: 'ACE Inhibitor', dailyDose: '10mg' }
      ]);
      setNarrative('Patient reported transient postural dizziness. Normal orthostatic vital signs.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (products.length === 0) return;

    const caseNum = Math.floor(100 + Math.random() * 900);
    const caseId = `PV-2024-${caseNum}`;
    const nowUtc = new Date().toISOString().replace('T', ' ').slice(0, 19);

    // Run Automated DDI Detection Engine
    let detectedRule: DdiRule | null = null;
    for (const rule of activeRules) {
      if (!rule.isActive) continue;
      const hasDrugA = products.some(p => p.drugName.toLowerCase().includes(rule.drugA.toLowerCase()) || p.activeIngredient.toLowerCase().includes(rule.drugA.toLowerCase()));
      const hasDrugB = products.some(p => p.drugName.toLowerCase().includes(rule.drugB.toLowerCase()) || p.activeIngredient.toLowerCase().includes(rule.drugB.toLowerCase()));
      if (hasDrugA && hasDrugB) {
        detectedRule = rule;
        break;
      }
    }

    const isCritical = detectedRule?.severity === 'CRITICAL';
    const isMajor = detectedRule?.severity === 'MAJOR';
    const isEscalated = isCritical || isMajor;

    const finalStatus = isEscalated ? 'IMMEDIATE_REVIEW' : 'INTAKE';

    const caseProducts: ProductInventoryItem[] = products.map((p, idx) => ({
      id: `p-${caseId}-${idx}`,
      drugName: p.drugName,
      role: p.role,
      activeIngredient: p.activeIngredient,
      classType: p.classType,
      dailyDose: p.dailyDose,
    }));

    const auditEntries: AuditLogEntry[] = [
      {
        id: `aud-${Date.now()}-1`,
        timestampUtc: nowUtc,
        caseId: caseId,
        userAgent: 'JDOE_DATA_ENTRY',
        table: 'SAFETY_CASES',
        field: 'INSERT_ROW',
        oldValue: '-',
        newValue: `Initials: ${patientInitials}, Status: INTAKE`,
        isAutomated: false,
        notes: 'Adverse event intake initiated'
      },
      ...caseProducts.map((p, idx) => ({
        id: `aud-${Date.now()}-prod-${idx}`,
        timestampUtc: nowUtc,
        caseId: caseId,
        userAgent: 'JDOE_DATA_ENTRY',
        table: 'CASE_PRODUCTS',
        field: 'INSERT_ROW',
        oldValue: '-',
        newValue: `Drug: ${p.drugName} (${p.role}), Dose: ${p.dailyDose}`,
        isAutomated: false
      }))
    ];

    if (isEscalated && detectedRule) {
      auditEntries.unshift({
        id: `aud-${Date.now()}-auto-status`,
        timestampUtc: nowUtc,
        caseId: caseId,
        userAgent: 'SYSTEM_TRIGGER',
        table: 'SAFETY_CASES',
        field: 'STATUS',
        oldValue: 'INTAKE',
        newValue: 'IMMEDIATE_MEDICAL_REVIEW',
        isAutomated: true,
        notes: `Engine trigger: ${detectedRule.ruleNumber} (${detectedRule.drugA} + ${detectedRule.drugB})`
      });

      if (isCritical) {
        auditEntries.unshift({
          id: `aud-${Date.now()}-auto-expedited`,
          timestampUtc: nowUtc,
          caseId: caseId,
          userAgent: 'SYSTEM_TRIGGER',
          table: 'SAFETY_CASES',
          field: 'EXPEDITED_FLAG',
          oldValue: 'N',
          newValue: 'Y',
          isAutomated: true,
          notes: '48h regulatory clock auto-started'
        });
      }
    }

    const newSafetyCase: SafetyCase = {
      id: caseId,
      patientInitials: patientInitials.toUpperCase(),
      patientDobMasked: 'Masked per HIPAA',
      receiptDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      source: source,
      status: finalStatus,
      expedited: isCritical,
      dueDate: isCritical ? '+2 Days' : '+15 Days',
      regulatoryDeadlineHours: isCritical ? 48 : 360,
      severity: detectedRule ? detectedRule.severity : 'NONE',
      alertTitle: detectedRule ? `${detectedRule.severity} INTERACTION DETECTED` : undefined,
      alertSummary: detectedRule ? `System detected ${detectedRule.severity} severity interaction between ${detectedRule.drugA} and ${detectedRule.drugB}. Action: ${detectedRule.recommendedAction}` : undefined,
      recommendedAction: detectedRule?.recommendedAction || 'NO_ACTION',
      products: caseProducts,
      narrative: narrative,
      notes: [],
      auditHistory: auditEntries
    };

    onCaseCreated(newSafetyCase, auditEntries);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#0f1026]/95 backdrop-blur-2xl rounded-3xl max-w-2xl w-full p-6 shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-white/15 my-8 text-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center text-white shadow-sm">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-[17px] font-bold text-white">
              Simulate Adverse Event Case Intake & Automated DDI Engine
            </h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Buttons */}
        <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/10">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            Load Quick DDI Test Scenarios:
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleQuickPreset('warfarin-aspirin')}
              className="px-3.5 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 rounded-xl text-[12px] font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span>Warfarin + Aspirin (Critical Escalation)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('simva-erythro')}
              className="px-3.5 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-500/30 rounded-xl text-[12px] font-semibold flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Simvastatin + Erythromycin (Major Flag)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickPreset('routine')}
              className="px-3.5 py-1.5 bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 rounded-xl text-[12px] font-semibold cursor-pointer"
            >
              Routine Non-Interacting Case
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-[13px]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-bold text-slate-300 block mb-1">Patient Initials</label>
              <input
                type="text"
                required
                value={patientInitials}
                onChange={(e) => setPatientInitials(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-inner"
              />
            </div>
            <div>
              <label className="font-bold text-slate-300 block mb-1">Intake Source</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white focus:outline-none cursor-pointer"
              >
                <option value="Spontaneous Report" className="bg-[#0f1026]">Spontaneous Report</option>
                <option value="Clinical Trial Site" className="bg-[#0f1026]">Clinical Trial Site</option>
                <option value="Healthcare Professional" className="bg-[#0f1026]">Healthcare Professional</option>
                <option value="Literature Report" className="bg-[#0f1026]">Literature Report</option>
              </select>
            </div>
          </div>

          {/* Product Inventory in Case */}
          <div>
            <label className="font-bold text-slate-300 block mb-1.5">
              Medications Added to Case ({products.length}):
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {products.map((p, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      p.role === 'SUSPECT' ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {p.role}
                    </span>
                    <span className="font-bold text-white">{p.drugName}</span>
                    <span className="text-slate-400 font-mono text-[12px]">{p.dailyDose}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(idx)}
                    className="text-slate-400 hover:text-red-400 p-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add More Products Row */}
            <div className="mt-2.5 flex gap-2">
              <input
                type="text"
                value={customDrugName}
                onChange={(e) => setCustomDrugName(e.target.value)}
                placeholder="Add substance (e.g. Clopidogrel)..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl p-2 text-[12px] text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 shadow-inner"
              />
              <select
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value as 'SUSPECT' | 'CONCOMITANT')}
                className="bg-white/5 border border-white/10 rounded-xl p-2 text-[12px] text-white focus:outline-none cursor-pointer"
              >
                <option value="SUSPECT" className="bg-[#0f1026]">SUSPECT</option>
                <option value="CONCOMITANT" className="bg-[#0f1026]">CONCOMITANT</option>
              </select>
              <input
                type="text"
                value={customDose}
                onChange={(e) => setCustomDose(e.target.value)}
                placeholder="Dose"
                className="w-20 bg-white/5 border border-white/10 rounded-xl p-2 text-[12px] text-white focus:outline-none font-mono shadow-inner"
              />
              <button
                type="button"
                onClick={handleAddProduct}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/15 border border-white/15 text-white rounded-xl text-[12px] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-blue-400" /> Add
              </button>
            </div>
          </div>

          {/* Narrative */}
          <div>
            <label className="font-bold text-slate-300 block mb-1">Clinical Case Narrative</label>
            <textarea
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-white focus:outline-none resize-none shadow-inner"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white rounded-xl font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={products.length === 0}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-semibold shadow-[0_0_20px_rgba(59,130,246,0.4)] border border-white/15 flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-cyan-300" />
              <span>Submit Case & Run DDI Trigger</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
