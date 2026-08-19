import React, { useState, useMemo } from 'react';
import { ActiveNavTab, CaseFilter, SafetyCase, DdiRule, AuditLogEntry, DrugDictionaryItem } from './types';
import { 
  INITIAL_CASES, 
  INITIAL_DDI_RULES, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_DRUG_DICTIONARY 
} from './data/initialData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { TriageDashboard } from './components/TriageDashboard';
import { CaseDetailView } from './components/CaseDetailView';
import { DdiRulesView } from './components/DdiRulesView';
import { AuditLogsView } from './components/AuditLogsView';
import { DrugDictionaryView } from './components/DrugDictionaryView';
import { NewCaseModal } from './components/NewCaseModal';

export const App: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('safety-cases');
  const [selectedFilter, setSelectedFilter] = useState<CaseFilter>('all-cases');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [auditFilterCaseId, setAuditFilterCaseId] = useState<string>('');
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);

  // Data State
  const [cases, setCases] = useState<SafetyCase[]>(INITIAL_CASES);
  const [rules, setRules] = useState<DdiRule[]>(INITIAL_DDI_RULES);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [drugDictionary] = useState<DrugDictionaryItem[]>(INITIAL_DRUG_DICTIONARY);

  // Calculate Badge Counts for Sidebar
  const caseCounts = useMemo(() => {
    return {
      all: cases.length,
      intake: cases.filter(c => c.status === 'INTAKE').length,
      triaged: cases.filter(c => c.status === 'TRIAGED').length,
      immediateReview: cases.filter(c => c.status === 'IMMEDIATE_REVIEW').length,
      closed: cases.filter(c => c.status === 'CLOSED').length,
    };
  }, [cases]);

  // Selected Case Object
  const currentSelectedCase = useMemo(() => {
    if (!selectedCaseId) return null;
    return cases.find(c => c.id === selectedCaseId) || null;
  }, [cases, selectedCaseId]);

  // Handler: Select a case to view details
  const handleSelectCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActiveTab('safety-cases');
  };

  // Handler: Back to case queue
  const handleBackToQueue = () => {
    setSelectedCaseId(null);
  };

  // Handler: Add Medical Note
  const handleAddNote = (caseId: string, noteContent: string) => {
    const nowUtc = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const signatureHash = `sha256_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;

    const newNote = {
      id: `note-${Date.now()}`,
      author: 'Dr. Sarah Miller',
      role: 'Medical Director (MD)',
      timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      content: noteContent,
      signatureHash: signatureHash
    };

    const newAuditEntry: AuditLogEntry = {
      id: `aud-note-${Date.now()}`,
      timestampUtc: nowUtc,
      caseId: caseId,
      userAgent: 'SARAH_MILLER_MD',
      table: 'SAFETY_CASES',
      field: 'MEDICAL_NOTE_ADDED',
      oldValue: '-',
      newValue: `Note appended & digitally signed (${newNote.author})`,
      isAutomated: false,
      notes: noteContent.substring(0, 80) + '...'
    };

    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          notes: [...c.notes, newNote],
          auditHistory: [newAuditEntry, ...c.auditHistory]
        };
      }
      return c;
    }));

    setAuditLogs(prev => [newAuditEntry, ...prev]);
  };

  // Handler: Escalate Case to MD
  const handleEscalateCase = (caseId: string, reason: string) => {
    const nowUtc = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const auditEntry1: AuditLogEntry = {
      id: `aud-esc-stat-${Date.now()}`,
      timestampUtc: nowUtc,
      caseId: caseId,
      userAgent: 'SARAH_MILLER_MD',
      table: 'SAFETY_CASES',
      field: 'STATUS',
      oldValue: 'INTAKE',
      newValue: 'IMMEDIATE_MEDICAL_REVIEW',
      isAutomated: false,
      notes: reason
    };

    const auditEntry2: AuditLogEntry = {
      id: `aud-esc-exp-${Date.now()}`,
      timestampUtc: nowUtc,
      caseId: caseId,
      userAgent: 'SARAH_MILLER_MD',
      table: 'SAFETY_CASES',
      field: 'EXPEDITED_FLAG',
      oldValue: 'N',
      newValue: 'Y',
      isAutomated: false,
      notes: 'Escalated by Medical Director'
    };

    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          status: 'IMMEDIATE_REVIEW',
          expedited: true,
          dueDate: '+2 Days',
          severity: 'CRITICAL',
          auditHistory: [auditEntry1, auditEntry2, ...c.auditHistory]
        };
      }
      return c;
    }));

    setAuditLogs(prev => [auditEntry1, auditEntry2, ...prev]);
  };

  // Handler: Sign Off Case
  const handleSignOffCase = (caseId: string, comment: string) => {
    const nowUtc = new Date().toISOString().replace('T', ' ').slice(0, 19);

    const auditEntry: AuditLogEntry = {
      id: `aud-signoff-${Date.now()}`,
      timestampUtc: nowUtc,
      caseId: caseId,
      userAgent: 'SARAH_MILLER_MD',
      table: 'SAFETY_CASES',
      field: 'STATUS',
      oldValue: 'IMMEDIATE_MEDICAL_REVIEW',
      newValue: 'CLOSED',
      isAutomated: false,
      notes: `Electronic sign-off executed: ${comment}`
    };

    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          status: 'CLOSED',
          auditHistory: [auditEntry, ...c.auditHistory]
        };
      }
      return c;
    }));

    setAuditLogs(prev => [auditEntry, ...prev]);
  };

  // Handler: Toggle DDI Rule Active/Inactive
  const handleToggleRule = (ruleId: string) => {
    const nowUtc = new Date().toISOString().replace('T', ' ').slice(0, 19);
    let targetRule: DdiRule | undefined;

    setRules(prev => prev.map(r => {
      if (r.id === ruleId) {
        targetRule = r;
        return { ...r, isActive: !r.isActive };
      }
      return r;
    }));

    if (targetRule) {
      const newAudit: AuditLogEntry = {
        id: `aud-rule-tog-${Date.now()}`,
        timestampUtc: nowUtc,
        caseId: 'GLOBAL_CONFIG',
        userAgent: 'SARAH_MILLER_MD',
        table: 'DDI_RULES',
        field: 'IS_ACTIVE',
        oldValue: targetRule.isActive ? 'TRUE' : 'FALSE',
        newValue: !targetRule.isActive ? 'TRUE' : 'FALSE',
        isAutomated: false,
        notes: `Toggled status for ${targetRule.ruleNumber} (${targetRule.drugA} + ${targetRule.drugB})`
      };
      setAuditLogs(prev => [newAudit, ...prev]);
    }
  };

  // Handler: Create DDI Rule
  const handleCreateRule = (newRuleData: Omit<DdiRule, 'id' | 'lastUpdated'>) => {
    const nowUtc = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const newRule: DdiRule = {
      ...newRuleData,
      id: `rule-${Date.now()}`,
      lastUpdated: nowUtc
    };

    const newAudit: AuditLogEntry = {
      id: `aud-rule-create-${Date.now()}`,
      timestampUtc: nowUtc,
      caseId: 'GLOBAL_CONFIG',
      userAgent: 'SARAH_MILLER_MD',
      table: 'DDI_RULES',
      field: 'INSERT_ROW',
      oldValue: '-',
      newValue: `Rule Created: ${newRule.ruleNumber} (${newRule.drugA} + ${newRule.drugB}, Severity: ${newRule.severity})`,
      isAutomated: false
    };

    setRules(prev => [newRule, ...prev]);
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  // Handler: Delete DDI Rule
  const handleDeleteRule = (ruleId: string) => {
    const nowUtc = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const targetRule = rules.find(r => r.id === ruleId);
    if (!targetRule) return;

    const newAudit: AuditLogEntry = {
      id: `aud-rule-del-${Date.now()}`,
      timestampUtc: nowUtc,
      caseId: 'GLOBAL_CONFIG',
      userAgent: 'SARAH_MILLER_MD',
      table: 'DDI_RULES',
      field: 'DELETE_ROW',
      oldValue: `${targetRule.ruleNumber} (${targetRule.drugA} + ${targetRule.drugB})`,
      newValue: 'DELETED',
      isAutomated: false
    };

    setRules(prev => prev.filter(r => r.id !== ruleId));
    setAuditLogs(prev => [newAudit, ...prev]);
  };

  // Handler: New Case Intake Created
  const handleCaseCreated = (newCase: SafetyCase, newAudits: AuditLogEntry[]) => {
    setCases(prev => [newCase, ...prev]);
    setAuditLogs(prev => [...newAudits, ...prev]);
    setSelectedCaseId(newCase.id);
    setActiveTab('safety-cases');
  };

  return (
    <div className="flex min-h-screen bg-[#0a0a1a] text-slate-100 font-sans antialiased relative overflow-hidden selection:bg-blue-500/30 selection:text-white">
      {/* Frosted Glass Ambient Lighting Effects */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[100px] pointer-events-none z-0"></div>
      <div className="fixed top-[35%] left-[25%] w-[35%] h-[35%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none z-0"></div>
      <div className="fixed top-[60%] left-[10%] w-[25%] h-[25%] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none z-0"></div>

      {/* Global Sidebar (288px / 72rem) */}
      <Sidebar
        selectedFilter={selectedFilter}
        onSelectFilter={(f) => {
          setSelectedFilter(f);
          setSelectedCaseId(null);
          setActiveTab('safety-cases');
        }}
        caseCounts={caseCounts}
      />

      {/* Main Content Area (Offset left 72 / 288px) */}
      <div className="flex-1 ml-72 flex flex-col min-h-screen relative z-10">
        {/* Global Fixed Header */}
        <Header
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            if (tab !== 'safety-cases') {
              setSelectedCaseId(null);
            }
          }}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenNewCaseModal={() => setIsNewCaseModalOpen(true)}
          criticalAlertCount={caseCounts.immediateReview}
        />

        {/* View Routing / Screen Rendering */}
        <main className="flex-1 mt-16 flex flex-col relative z-10">
          {/* TAB 1: SAFETY CASES */}
          {activeTab === 'safety-cases' && (
            selectedCaseId && currentSelectedCase ? (
              <CaseDetailView
                safetyCase={currentSelectedCase}
                onBackToQueue={handleBackToQueue}
                onAddNote={handleAddNote}
                onEscalateCase={handleEscalateCase}
                onSignOffCase={handleSignOffCase}
              />
            ) : (
              <TriageDashboard
                cases={cases}
                selectedFilter={selectedFilter}
                onSelectCase={handleSelectCase}
                onSelectNavTab={setActiveTab}
                onSetAuditFilter={setAuditFilterCaseId}
                searchQuery={searchQuery}
              />
            )
          )}

          {/* TAB 2: DRUG DICTIONARY */}
          {activeTab === 'drug-dictionary' && (
            <DrugDictionaryView drugs={drugDictionary} />
          )}

          {/* TAB 3: DDI RULES */}
          {activeTab === 'ddi-rules' && (
            <DdiRulesView
              rules={rules}
              onToggleRule={handleToggleRule}
              onCreateRule={handleCreateRule}
              onDeleteRule={handleDeleteRule}
            />
          )}

          {/* TAB 4: AUDIT LOGS */}
          {activeTab === 'audit-logs' && (
            <AuditLogsView
              auditLogs={auditLogs}
              initialSearch={auditFilterCaseId}
              onSelectCase={handleSelectCase}
            />
          )}
        </main>
      </div>

      {/* New Case Intake Modal */}
      <NewCaseModal
        isOpen={isNewCaseModalOpen}
        onClose={() => setIsNewCaseModalOpen(false)}
        onCaseCreated={handleCaseCreated}
        activeRules={rules}
      />
    </div>
  );
};

export default App;
