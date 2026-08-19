import { SafetyCase, DdiRule, AuditLogEntry, DrugDictionaryItem } from '../types';

export const INITIAL_CASES: SafetyCase[] = [
  {
    id: 'PV-2024-002',
    patientInitials: 'AS',
    patientDobMasked: 'Masked per HIPAA',
    receiptDate: 'May 20, 2024',
    source: 'Spontaneous Report',
    status: 'IMMEDIATE_REVIEW',
    expedited: true,
    dueDate: '+2 Days',
    regulatoryDeadlineHours: 48,
    severity: 'CRITICAL',
    alertTitle: 'CRITICAL INTERACTION DETECTED',
    alertSummary: 'System detected CRITICAL severity interaction between Warfarin (5mg) and Aspirin (81mg). Recommended Action: ESCALATE_TO_MD.',
    recommendedAction: 'ESCALATE_TO_MD',
    products: [
      {
        id: 'p-1',
        drugName: 'Warfarin',
        role: 'SUSPECT',
        activeIngredient: 'Warfarin Sodium',
        classType: 'Anticoagulant',
        dailyDose: '5mg',
        route: 'Oral',
        frequency: 'Once Daily (Evening)',
        startDate: '2024-01-15',
        indication: 'Atrial Fibrillation Stroke Prophylaxis'
      },
      {
        id: 'p-2',
        drugName: 'Aspirin',
        role: 'CONCOMITANT',
        activeIngredient: 'Acetylsalicylic Acid',
        classType: 'NSAID / Antiplatelet',
        dailyDose: '81mg',
        route: 'Oral',
        frequency: 'Once Daily (Morning)',
        startDate: '2024-05-18',
        indication: 'Self-administered for tension headache'
      }
    ],
    narrative:
      'Patient A.S. experienced severe bruising and minor bleeding episodes after initiating 81mg Aspirin concomitantly with a maintenance dose of 5mg Warfarin. The interaction was flagged during routine clinical review. No hospitalization required at the time of report.',
    notes: [
      {
        id: 'n-1',
        author: 'Dr. Sarah Miller',
        role: 'Medical Reviewer',
        timestamp: 'May 20, 2024 · 10:15 AM',
        content: 'Patient contacted primary care provider for urgent INR check. Automated DDI engine triggered expedited regulatory 48h clock.',
        signatureHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
      }
    ],
    auditHistory: [
      {
        id: 'aud-101',
        timestampUtc: '2024-05-20 10:00:02',
        caseId: 'PV-2024-002',
        userAgent: 'SYSTEM_TRIGGER',
        table: 'SAFETY_CASES',
        field: 'STATUS',
        oldValue: 'INTAKE',
        newValue: 'IMMEDIATE_REVIEW',
        isAutomated: true,
        notes: 'TRG_AFTER_PRODUCT_INSERT triggered rule #DDI-RULES-V2'
      },
      {
        id: 'aud-102',
        timestampUtc: '2024-05-20 10:00:01',
        caseId: 'PV-2024-002',
        userAgent: 'JDOE_DATA_ENTRY',
        table: 'CASE_PRODUCTS',
        field: 'INSERT_ROW',
        oldValue: '-',
        newValue: 'Aspirin 81mg (CONCOMITANT)',
        isAutomated: false
      },
      {
        id: 'aud-103',
        timestampUtc: '2024-05-20 09:55:00',
        caseId: 'PV-2024-002',
        userAgent: 'JDOE_DATA_ENTRY',
        table: 'CASE_PRODUCTS',
        field: 'INSERT_ROW',
        oldValue: '-',
        newValue: 'Warfarin 5mg (SUSPECT)',
        isAutomated: false
      },
      {
        id: 'aud-104',
        timestampUtc: '2024-05-20 09:50:12',
        caseId: 'PV-2024-002',
        userAgent: 'JDOE_DATA_ENTRY',
        table: 'SAFETY_CASES',
        field: 'INSERT_ROW',
        oldValue: '-',
        newValue: 'Case Created. Initial intake logged.',
        isAutomated: false
      }
    ]
  },
  {
    id: 'PV-2024-001',
    patientInitials: 'JD',
    patientDobMasked: 'Masked per HIPAA',
    receiptDate: 'May 19, 2024',
    source: 'Clinical Trial Site 04',
    status: 'INTAKE',
    expedited: false,
    dueDate: '+15 Days',
    regulatoryDeadlineHours: 360,
    severity: 'MINOR',
    recommendedAction: 'NO_ACTION',
    products: [
      {
        id: 'p-3',
        drugName: 'Metoprolol Tartrate',
        role: 'SUSPECT',
        activeIngredient: 'Metoprolol',
        classType: 'Beta Blocker',
        dailyDose: '50mg',
        route: 'Oral',
        frequency: 'BID',
        indication: 'Hypertension'
      },
      {
        id: 'p-4',
        drugName: 'Lisinopril',
        role: 'CONCOMITANT',
        activeIngredient: 'Lisinopril',
        classType: 'ACE Inhibitor',
        dailyDose: '10mg',
        route: 'Oral',
        frequency: 'QD',
        indication: 'Hypertension'
      }
    ],
    narrative:
      'Patient J.D. reported mild lightheadedness upon standing after morning dosage adjustment. No syncopal events or electrolyte derangement observed.',
    notes: [],
    auditHistory: [
      {
        id: 'aud-201',
        timestampUtc: '2024-05-19 14:32:10',
        caseId: 'PV-2024-001',
        userAgent: 'JOHN_DOE',
        table: 'SAFETY_CASES',
        field: 'STATUS',
        oldValue: 'INTAKE',
        newValue: 'INTAKE',
        isAutomated: false
      }
    ]
  },
  {
    id: 'PV-2024-003',
    patientInitials: 'MK',
    patientDobMasked: 'Masked per HIPAA',
    receiptDate: 'May 18, 2024',
    source: 'Healthcare Professional Portal',
    status: 'TRIAGED',
    expedited: false,
    dueDate: '+10 Days',
    regulatoryDeadlineHours: 240,
    severity: 'MODERATE',
    alertTitle: 'MODERATE DDI FLAGGED',
    alertSummary: 'Concomitant administration of Atorvastatin with Amlodipine. Monitoring recommended for myopathy signs.',
    recommendedAction: 'MONITOR',
    products: [
      {
        id: 'p-5',
        drugName: 'Atorvastatin',
        role: 'SUSPECT',
        activeIngredient: 'Atorvastatin Calcium',
        classType: 'HMG-CoA Reductase Inhibitor',
        dailyDose: '40mg',
        route: 'Oral',
        frequency: 'QHS',
        indication: 'Hyperlipidemia'
      },
      {
        id: 'p-6',
        drugName: 'Amlodipine',
        role: 'CONCOMITANT',
        activeIngredient: 'Amlodipine Besylate',
        classType: 'Calcium Channel Blocker',
        dailyDose: '5mg',
        route: 'Oral',
        frequency: 'QD',
        indication: 'Hypertension'
      }
    ],
    narrative:
      'Patient M.K. experienced bilateral lower extremity cramping without elevation in serum creatinine kinase. Medication reconciled by clinical pharmacist.',
    notes: [],
    auditHistory: []
  },
  {
    id: 'PV-2024-004',
    patientInitials: 'RL',
    patientDobMasked: 'Masked per HIPAA',
    receiptDate: 'May 17, 2024',
    source: 'Direct Patient Call Center',
    status: 'INTAKE',
    expedited: false,
    dueDate: '+14 Days',
    regulatoryDeadlineHours: 336,
    severity: 'MINOR',
    recommendedAction: 'NO_ACTION',
    products: [
      {
        id: 'p-7',
        drugName: 'Sertraline',
        role: 'SUSPECT',
        activeIngredient: 'Sertraline HCl',
        classType: 'SSRI Antidepressant',
        dailyDose: '50mg',
        route: 'Oral',
        frequency: 'QD',
        indication: 'Major Depressive Disorder'
      },
      {
        id: 'p-8',
        drugName: 'Omeprazole',
        role: 'CONCOMITANT',
        activeIngredient: 'Omeprazole',
        classType: 'Proton Pump Inhibitor',
        dailyDose: '20mg',
        route: 'Oral',
        frequency: 'QD',
        indication: 'GERD'
      }
    ],
    narrative:
      'Patient R.L. reported mild nausea during initial titration week. Reassured that symptom typically resolves within 14 days.',
    notes: [],
    auditHistory: []
  },
  {
    id: 'PV-2024-005',
    patientInitials: 'WT',
    patientDobMasked: 'Masked per HIPAA',
    receiptDate: 'May 19, 2024',
    source: 'Emergency Dept Discharge Summary',
    status: 'IMMEDIATE_REVIEW',
    expedited: true,
    dueDate: '+3 Days',
    regulatoryDeadlineHours: 72,
    severity: 'MAJOR',
    alertTitle: 'MAJOR DDI: CYP3A4 INHIBITION',
    alertSummary: 'Rule #1042 triggered: Simvastatin + Erythromycin co-administration risks severe rhabdomyolysis.',
    recommendedAction: 'FLAG_WARNING',
    products: [
      {
        id: 'p-9',
        drugName: 'Simvastatin',
        role: 'SUSPECT',
        activeIngredient: 'Simvastatin',
        classType: 'Statin',
        dailyDose: '40mg',
        route: 'Oral',
        frequency: 'QHS',
        indication: 'Dyslipidemia'
      },
      {
        id: 'p-10',
        drugName: 'Erythromycin',
        role: 'CONCOMITANT',
        activeIngredient: 'Erythromycin Base',
        classType: 'Macrolide Antibiotic',
        dailyDose: '500mg',
        route: 'Oral',
        frequency: 'QID',
        indication: 'Acute Bronchial Infection'
      }
    ],
    narrative:
      'Patient W.T. presented with generalized muscle soreness and tea-colored urine 4 days after adding Erythromycin to regular Simvastatin regimen. Simvastatin held immediately.',
    notes: [],
    auditHistory: []
  },
  {
    id: 'PV-2024-006',
    patientInitials: 'EL',
    patientDobMasked: 'Masked per HIPAA',
    receiptDate: 'April 28, 2024',
    source: 'Rheumatology Specialty Clinic',
    status: 'CLOSED',
    expedited: false,
    dueDate: 'Closed (May 15)',
    regulatoryDeadlineHours: 0,
    severity: 'CRITICAL',
    alertTitle: 'RESOLVED: METHOTREXATE TOXICITY',
    alertSummary: 'Case closed after comprehensive clinical sign-off and regulatory submission to FDA FAERS.',
    recommendedAction: 'ESCALATE_TO_MD',
    products: [
      {
        id: 'p-11',
        drugName: 'Methotrexate',
        role: 'SUSPECT',
        activeIngredient: 'Methotrexate Sodium',
        classType: 'Antimetabolite / DMARD',
        dailyDose: '15mg',
        route: 'Oral',
        frequency: 'Weekly',
        indication: 'Rheumatoid Arthritis'
      },
      {
        id: 'p-12',
        drugName: 'Ibuprofen',
        role: 'CONCOMITANT',
        activeIngredient: 'Ibuprofen',
        classType: 'NSAID',
        dailyDose: '800mg',
        route: 'Oral',
        frequency: 'TID',
        indication: 'Joint Pain Flare'
      }
    ],
    narrative:
      'Patient E.L. exhibited marked bone marrow suppression and oral ulcerations secondary to reduced renal clearance of Methotrexate caused by high-dose NSAID co-administration. Folinic acid rescue administered with full recovery.',
    notes: [
      {
        id: 'n-2',
        author: 'Dr. Sarah Miller',
        role: 'Medical Reviewer',
        timestamp: 'May 15, 2024 · 04:30 PM',
        content: 'Final review completed. Expedited 15-day alert submitted to FDA E2B portal. Safety case closed.',
        signatureHash: '4a6b22c92e92c2b3d84b23910c2e91129b122049e7b233a0b12e3391d84820a1'
      }
    ],
    auditHistory: []
  }
];

export const INITIAL_DDI_RULES: DdiRule[] = [
  {
    id: 'r-1',
    ruleNumber: 'RULE #1001',
    drugA: 'Warfarin',
    drugAActive: 'Warfarin Sodium',
    drugB: 'Aspirin',
    drugBActive: 'Acetylsalicylic Acid',
    severity: 'CRITICAL',
    recommendedAction: 'ESCALATE_TO_MD',
    isActive: true,
    description: 'Synergistic antiplatelet and anticoagulant effect severely increases major gastrointestinal and intracranial hemorrhage risk.',
    mechanism: 'Inhibition of platelet COX-1 combined with inhibition of hepatic vitamin K 2,3-epoxide reductase.',
    clinicalEffect: 'Severe bleeding risk, INR prolongation, intracranial hemorrhage.',
    lastUpdated: '2024-05-10'
  },
  {
    id: 'r-2',
    ruleNumber: 'RULE #1042',
    drugA: 'Simvastatin',
    drugAActive: 'Statin',
    drugB: 'Erythromycin',
    drugBActive: 'Antibiotic (Macrolide)',
    severity: 'MAJOR',
    recommendedAction: 'FLAG_WARNING',
    isActive: true,
    description: 'Potent CYP3A4 inhibition by erythromycin increases simvastatin AUC by up to 5-fold, drastically elevating rhabdomyolysis risk.',
    mechanism: 'Inhibition of CYP3A4-mediated first-pass and hepatic clearance.',
    clinicalEffect: 'Myopathy, muscle breakdown, acute renal failure due to myoglobinuria.',
    lastUpdated: '2024-04-18'
  },
  {
    id: 'r-3',
    ruleNumber: 'RULE #1088',
    drugA: 'Clopidogrel',
    drugAActive: 'Antiplatelet',
    drugB: 'Omeprazole',
    drugBActive: 'PPI (Proton Pump Inhibitor)',
    severity: 'MODERATE',
    recommendedAction: 'MONITOR',
    isActive: false,
    description: 'Omeprazole competitively inhibits CYP2C19, reducing bioactivation of clopidogrel and potentially attenuating antiplatelet efficacy.',
    mechanism: 'Competitive inhibition of CYP2C19 bioactivation pathway.',
    clinicalEffect: 'Sub-therapeutic platelet inhibition, increased risk of ischemic cardiac events.',
    lastUpdated: '2024-03-22'
  },
  {
    id: 'r-4',
    ruleNumber: 'RULE #1105',
    drugA: 'Methotrexate',
    drugAActive: 'Antimetabolite / DMARD',
    drugB: 'Ibuprofen',
    drugBActive: 'NSAID',
    severity: 'CRITICAL',
    recommendedAction: 'ESCALATE_TO_MD',
    isActive: true,
    description: 'NSAIDs reduce renal tubular secretion of methotrexate and decrease glomerular filtration rate, leading to toxic methotrexate accumulation.',
    mechanism: 'Prostaglandin synthesis inhibition causing renal vasoconstriction and organic anion transporter blockage.',
    clinicalEffect: 'Severe myelosuppression, aplastic anemia, gastrointestinal ulceration.',
    lastUpdated: '2024-05-02'
  },
  {
    id: 'r-5',
    ruleNumber: 'RULE #1140',
    drugA: 'Digoxin',
    drugAActive: 'Cardiac Glycoside',
    drugB: 'Amiodarone',
    drugBActive: 'Antiarrhythmic Class III',
    severity: 'CRITICAL',
    recommendedAction: 'ESCALATE_TO_MD',
    isActive: true,
    description: 'Amiodarone inhibits P-glycoprotein efflux pump, elevating serum digoxin concentration by 70-100%.',
    mechanism: 'Inhibition of intestinal and renal tubular P-gp transport.',
    clinicalEffect: 'Fatal cardiac arrhythmias, severe bradycardia, visual halos, hyperkalemia.',
    lastUpdated: '2024-04-30'
  },
  {
    id: 'r-6',
    ruleNumber: 'RULE #1192',
    drugA: 'Fluoxetine',
    drugAActive: 'SSRI',
    drugB: 'Tramadol',
    drugBActive: 'Synthetic Opioid',
    severity: 'MAJOR',
    recommendedAction: 'FLAG_WARNING',
    isActive: true,
    description: 'Dual serotonergic enhancement combined with CYP2D6 inhibition elevates risk of Serotonin Syndrome and seizures.',
    mechanism: 'Combined serotonin reuptake blockade with competitive CYP2D6 metabolic inhibition.',
    clinicalEffect: 'Hyperthermia, autonomic instability, neuromuscular excitability (clonus), seizures.',
    lastUpdated: '2024-05-08'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-001',
    timestampUtc: '2024-05-20 10:00:01',
    caseId: 'PV-2024-002',
    userAgent: 'SYSTEM_TRIGGER',
    table: 'SAFETY_CASES',
    field: 'STATUS',
    oldValue: 'INTAKE',
    newValue: 'IMMEDIATE_MEDICAL_REVIEW',
    isAutomated: true,
    notes: 'Trigger TRG_AFTER_PRODUCT_INSERT triggered automated escalation to Level 1 triage'
  },
  {
    id: 'aud-002',
    timestampUtc: '2024-05-20 10:00:01',
    caseId: 'PV-2024-002',
    userAgent: 'SYSTEM_TRIGGER',
    table: 'SAFETY_CASES',
    field: 'EXPEDITED_FLAG',
    oldValue: 'N',
    newValue: 'Y',
    isAutomated: true,
    notes: 'Expedited 48-hour regulatory clock initiated per 21 CFR 314.80'
  },
  {
    id: 'aud-003',
    timestampUtc: '2024-05-20 09:59:58',
    caseId: 'PV-2024-002',
    userAgent: 'SARAH_MILLER',
    table: 'CASE_PRODUCTS',
    field: 'INSERT_ROW',
    oldValue: '-',
    newValue: 'Drug ID: 2, Type: CONCOMITANT, Dose: 81mg',
    isAutomated: false,
    notes: 'Concomitant medication entry logged from spontaneous report form'
  },
  {
    id: 'aud-004',
    timestampUtc: '2024-05-20 09:58:45',
    caseId: 'PV-2024-002',
    userAgent: 'SARAH_MILLER',
    table: 'CASE_PRODUCTS',
    field: 'INSERT_ROW',
    oldValue: '-',
    newValue: 'Drug ID: 1, Type: SUSPECT, Dose: 5mg',
    isAutomated: false,
    notes: 'Primary suspect product assigned'
  },
  {
    id: 'aud-005',
    timestampUtc: '2024-05-20 09:55:12',
    caseId: 'PV-2024-002',
    userAgent: 'SARAH_MILLER',
    table: 'SAFETY_CASES',
    field: 'INSERT_ROW',
    oldValue: '-',
    newValue: 'Initials: AS, Status: INTAKE',
    isAutomated: false,
    notes: 'Initial case record established'
  },
  {
    id: 'aud-006',
    timestampUtc: '2024-05-19 14:32:10',
    caseId: 'PV-2024-001',
    userAgent: 'JOHN_DOE',
    table: 'SAFETY_CASES',
    field: 'STATUS',
    oldValue: 'INTAKE',
    newValue: 'TRIAGED',
    isAutomated: false,
    notes: 'Routine clinical triage completed. Non-expedited schedule applied.'
  },
  {
    id: 'aud-007',
    timestampUtc: '2024-05-19 11:20:04',
    caseId: 'PV-2024-005',
    userAgent: 'SYSTEM_TRIGGER',
    table: 'SAFETY_CASES',
    field: 'STATUS',
    oldValue: 'INTAKE',
    newValue: 'IMMEDIATE_REVIEW',
    isAutomated: true,
    notes: 'Rule #1042 match: Simvastatin + Erythromycin'
  },
  {
    id: 'aud-008',
    timestampUtc: '2024-05-18 16:45:22',
    caseId: 'PV-2024-003',
    userAgent: 'SARAH_MILLER',
    table: 'SAFETY_CASES',
    field: 'STATUS',
    oldValue: 'INTAKE',
    newValue: 'TRIAGED',
    isAutomated: false,
    notes: 'Pharmacist note appended regarding Amlodipine dosage adjustment.'
  },
  {
    id: 'aud-009',
    timestampUtc: '2024-05-15 16:30:00',
    caseId: 'PV-2024-006',
    userAgent: 'SARAH_MILLER',
    table: 'SAFETY_CASES',
    field: 'STATUS',
    oldValue: 'IMMEDIATE_REVIEW',
    newValue: 'CLOSED',
    isAutomated: false,
    notes: 'Regulatory sign-off approved by Medical Director. FAERS transmission hash: 99c1e0a2.'
  }
];

export const INITIAL_DRUG_DICTIONARY: DrugDictionaryItem[] = [
  {
    id: 'd-1',
    brandName: 'Coumadin / Jantoven',
    activeSubstance: 'Warfarin Sodium',
    atcCode: 'B01AA03',
    therapeuticClass: 'Vitamin K Antagonist / Anticoagulant',
    halfLife: '20 - 60 hours',
    cypMetabolism: 'CYP2C9 (primary), CYP1A2, CYP3A4',
    blackBoxWarning: true,
    commonInteractions: ['Aspirin', 'NSAIDs', 'Amiodarone', 'Fluconazole', 'Broad-Spectrum Antibiotics'],
    contraindications: ['Active bleeding', 'Severe thrombocytopenia', 'Uncontrolled malignant hypertension', 'Pregnancy (Category X)']
  },
  {
    id: 'd-2',
    brandName: 'Bayer / Ecotrin',
    activeSubstance: 'Acetylsalicylic Acid (Aspirin)',
    atcCode: 'N02BA01',
    therapeuticClass: 'NSAID / Platelet Aggregation Inhibitor',
    halfLife: '15 - 20 minutes (Salicylate: 2-30 hours)',
    cypMetabolism: 'Hepatic Conjugation / Renal Excretion',
    blackBoxWarning: false,
    commonInteractions: ['Warfarin', 'Heparin', 'SSRIs', 'Methotrexate', 'ACE Inhibitors'],
    contraindications: ['Peptic ulcer disease', 'Hemophilia', 'Reye syndrome risk in pediatric viral infections']
  },
  {
    id: 'd-3',
    brandName: 'Zocor',
    activeSubstance: 'Simvastatin',
    atcCode: 'C10AA01',
    therapeuticClass: 'HMG-CoA Reductase Inhibitor (Statin)',
    halfLife: '2 - 3 hours',
    cypMetabolism: 'CYP3A4 (substrate)',
    blackBoxWarning: false,
    commonInteractions: ['Erythromycin', 'Clarithromycin', 'Ketoconazole', 'Cyclosporine', 'Grapefruit juice'],
    contraindications: ['Active liver disease', 'Concomitant potent CYP3A4 inhibitors', 'Pregnancy']
  },
  {
    id: 'd-4',
    brandName: 'Erythrocin / E-Mycin',
    activeSubstance: 'Erythromycin',
    atcCode: 'J01FA01',
    therapeuticClass: 'Macrolide Antibacterial',
    halfLife: '1.5 - 2 hours',
    cypMetabolism: 'CYP3A4 (potent mechanism-based inhibitor)',
    blackBoxWarning: false,
    commonInteractions: ['Simvastatin', 'Lovastatin', 'Theophylline', 'Digoxin', 'Warfarin'],
    contraindications: ['Known hypersensitivity', 'Concomitant astemizole or terfenadine']
  },
  {
    id: 'd-5',
    brandName: 'Plavix',
    activeSubstance: 'Clopidogrel',
    atcCode: 'B01AC04',
    therapeuticClass: 'P2Y12 Platelet Inhibitor',
    halfLife: '6 hours (active thiol metabolite: 30 min)',
    cypMetabolism: 'CYP2C19 (bioactivation), CYP3A4',
    blackBoxWarning: true,
    commonInteractions: ['Omeprazole', 'Esomeprazole', 'Fluoxetine', 'Anticoagulants'],
    contraindications: ['Active pathological bleeding such as peptic ulcer or intracranial hemorrhage']
  },
  {
    id: 'd-6',
    brandName: 'Prilosec',
    activeSubstance: 'Omeprazole',
    atcCode: 'A02BC01',
    therapeuticClass: 'Proton Pump Inhibitor (PPI)',
    halfLife: '0.5 - 1 hour',
    cypMetabolism: 'CYP2C19 (substrate & inhibitor), CYP3A4',
    blackBoxWarning: false,
    commonInteractions: ['Clopidogrel', 'Methotrexate', 'Diazepam', 'Phenytoin'],
    contraindications: ['Hypersensitivity to substituted benzimidazoles']
  },
  {
    id: 'd-7',
    brandName: 'Trexall',
    activeSubstance: 'Methotrexate Sodium',
    atcCode: 'L01BA01',
    therapeuticClass: 'Folate Antagonist Antineoplastic / DMARD',
    halfLife: '3 - 10 hours (low dose), up to 15 hours (high dose)',
    cypMetabolism: 'Intracellular polyglutamylation / Renal clearance',
    blackBoxWarning: true,
    commonInteractions: ['Ibuprofen', 'Naproxen', 'Probenecid', 'Penicillins', 'Trimethoprim'],
    contraindications: ['Severe renal impairment (CrCl < 30 mL/min)', 'Pre-existing blood dyscrasias', 'Pregnancy in non-oncology indications']
  }
];
