export type CaseStatus = 'INTAKE' | 'TRIAGED' | 'IMMEDIATE_REVIEW' | 'CLOSED';

export type DdiSeverity = 'CRITICAL' | 'MAJOR' | 'MODERATE' | 'MINOR' | 'NONE';

export type DdiAction = 'ESCALATE_TO_MD' | 'FLAG_WARNING' | 'MONITOR' | 'NO_ACTION';

export type ProductRole = 'SUSPECT' | 'CONCOMITANT' | 'INTERACTING';

export interface ProductInventoryItem {
  id: string;
  drugName: string;
  role: ProductRole;
  activeIngredient: string;
  classType: string;
  dailyDose: string;
  route?: string;
  frequency?: string;
  startDate?: string;
  indication?: string;
}

export interface AuditLogEntry {
  id: string;
  timestampUtc: string;
  caseId: string;
  userAgent: string;
  table: string;
  field: string;
  oldValue: string;
  newValue: string;
  isAutomated?: boolean;
  notes?: string;
}

export interface MedicalNote {
  id: string;
  author: string;
  role: string;
  timestamp: string;
  content: string;
  signatureHash?: string;
}

export interface SafetyCase {
  id: string; // e.g., "PV-2024-002"
  patientInitials: string; // e.g., "AS"
  patientDobMasked: string; // "Masked per HIPAA"
  receiptDate: string; // e.g., "May 20, 2024"
  source: string; // e.g., "Spontaneous Report"
  status: CaseStatus;
  expedited: boolean;
  dueDate: string; // e.g., "+2 Days" or "May 22, 2024"
  regulatoryDeadlineHours?: number; // 48
  severity: DdiSeverity;
  alertTitle?: string;
  alertSummary?: string;
  recommendedAction?: DdiAction;
  products: ProductInventoryItem[];
  narrative: string;
  notes: MedicalNote[];
  auditHistory: AuditLogEntry[];
}

export interface DdiRule {
  id: string;
  ruleNumber: string; // e.g., "RULE #1042" or "RULE #1001"
  drugA: string;
  drugAActive: string;
  drugB: string;
  drugBActive: string;
  severity: DdiSeverity;
  recommendedAction: DdiAction;
  isActive: boolean;
  description: string;
  mechanism?: string;
  clinicalEffect?: string;
  lastUpdated: string;
}

export interface DrugDictionaryItem {
  id: string;
  brandName: string;
  activeSubstance: string;
  atcCode: string;
  therapeuticClass: string;
  halfLife: string;
  cypMetabolism: string;
  blackBoxWarning: boolean;
  commonInteractions: string[];
  contraindications: string[];
}

export type ActiveNavTab = 'safety-cases' | 'drug-dictionary' | 'ddi-rules' | 'audit-logs';
export type CaseFilter = 'all-cases' | 'intake' | 'triaged' | 'immediate-review' | 'closed';
