import { KnowledgeQuestion, LevelScenario } from '@/types/game';

export interface FinalDecision {
  question: string;
  options: string[];
  correct: number;
}

export interface LevelData {
  scenario: LevelScenario;
  mcqs: KnowledgeQuestion[];
  finalDecision: FinalDecision;
  hints: string[];
}

export const QUESTIONS_DATA: Record<string, LevelData> = {
  level1: {
    scenario: {
      patientType: "Inpatient Hospital (St. Jude)",
      tob: "111",
      revenueCodes: ["0110", "0250"],
      admissionDate: "10/12/2023",
      serviceDate: "10/10/2023",
      splitBlEdit: "Flagged (Manual Review)",
      mhiHint: "SB=Y",
      cfiHint: "SPLITBL=Y"
    },
    mcqs: [
      {
        question: "What should you check first?",
        options: ["Payment", "CFI Screen", "Email"],
        correct: 1
      },
      {
        question: "What does SPLITBL = Y mean?",
        options: ["No split billing", "Split billing applies", "Denied claim"],
        correct: 1
      }
    ],
    finalDecision: {
      question: "Final Decision:",
      options: ["Apply Split Billing", "Do Not Apply Split Billing"],
      correct: 0
    },
    hints: [
      "Check the MHI indicator first to see if the patient is set up for split billing.",
      "Verify the CFI screen for the 'Y' indicator to confirm facility enrollment."
    ]
  },
  level2: {
    scenario: {
      patientType: "Physician (CMS 1500)",
      tob: "Professional (N/A)",
      revenueCodes: ["99213"],
      admissionDate: "10/12/2023",
      serviceDate: "10/11/2023",
      splitBlEdit: "Informational Alert",
      mhiHint: "SB=N (Physician)",
      cfiHint: "No SPLITBL Field"
    },
    mcqs: [
      {
        question: "Is SPLITBL applicable?",
        options: ["Yes", "No"],
        correct: 1
      },
      {
        question: "Where is SPLITBL not available?",
        options: ["Hospital", "Physician CFI"],
        correct: 1
      }
    ],
    finalDecision: {
      question: "Final Ruling:",
      options: ["Apply Split Billing", "Do Not Apply Split Billing"],
      correct: 1
    },
    hints: [
      "Notice the claim type — split billing is a facility-level rule.",
      "Check if the CFI screen even exists for professional records."
    ]
  },
  level3: {
    scenario: {
      patientType: "Outpatient Facility (City Clinic)",
      tob: "131",
      revenueCodes: ["0300", "0450"],
      admissionDate: "11/01/2023",
      serviceDate: "10/29/2023",
      splitBlEdit: "Flagged",
      mhiHint: "SB=N",
      cfiHint: "SPLITBL=N"
    },
    mcqs: [
      {
        question: "What does SB = N indicate?",
        options: ["Split billing applied", "CFI not set up for split billing", "Claim denied"],
        correct: 1
      },
      {
        question: "Should split billing be applied?",
        options: ["Yes", "No"],
        correct: 1
      }
    ],
    finalDecision: {
      question: "Final Ruling:",
      options: ["Apply Split Billing", "Do Not Apply Split Billing"],
      correct: 1
    },
    hints: [
      "The 'N' indicator is a showstopper for split billing logic.",
      "Verify both Screens; if either is 'N', the rule cannot be applied."
    ]
  },
  level4: {
    scenario: {
      patientType: "Inpatient Hospital (Emergency)",
      tob: "111",
      revenueCodes: ["0540 (Ambulance)"],
      admissionDate: "12/05/2023",
      serviceDate: "12/03/2023",
      splitBlEdit: "Flagged",
      mhiHint: "SB=Y",
      cfiHint: "SPLITBL=Y"
    },
    mcqs: [
      {
        question: "Is this excluded from split billing?",
        options: ["Yes", "No"],
        correct: 0
      },
      {
        question: "Why is this excluded?",
        options: ["Payment issue", "Service exclusion rule"],
        correct: 1
      }
    ],
    finalDecision: {
      question: "Final Ruling:",
      options: ["Apply Split Billing", "Do Not Apply Split Billing"],
      correct: 1
    },
    hints: [
      "Look closely at the revenue codes for clinical exclusions.",
      "Some services are exempt even if the facility configuration is correct."
    ]
  },
  level5: {
    scenario: {
      patientType: "Inpatient Hospital (Advanced)",
      tob: "111",
      revenueCodes: ["0110"],
      hcpcs: ["G0257"],
      admissionDate: "01/10/2024",
      serviceDate: "01/08/2024",
      splitBlEdit: "Flagged",
      mhiHint: "SB=Y",
      cfiHint: "SPLITBL=3"
    },
    mcqs: [
      {
        question: "What does SPLITBL = 3 mean?",
        options: ["3 claims", "3-day rule applies"],
        correct: 1
      },
      {
        question: "Is this an exclusion?",
        options: ["Yes", "No"],
        correct: 0
      }
    ],
    finalDecision: {
      question: "Final Ruling:",
      options: ["Apply Split Billing", "Do Not Apply Split Billing"],
      correct: 1
    },
    hints: [
      "HCPCS level auditing is required for 'SPLITBL=3' logic.",
      "Validate the HCPCS code G0257 against the exclusion list."
    ]
  }
};

export const BONUS_QUESTIONS: KnowledgeQuestion[] = [
  {
    question: "Where is SPLITBL located?",
    options: ["MHI Screen", "CFI Screen", "CAS Dashboard"],
    correct: 1
  },
  {
    question: "Where is SB field?",
    options: ["MHI Screen", "CFI Screen", "HCPCS List"],
    correct: 0
  },
  {
    question: "What does '3' mean in SPLITBL?",
    options: ["3-day rule", "3 claim lines", "Level 3 priority"],
    correct: 0
  },
  {
    question: "Name one exclusion",
    options: ["Ambulance / Hospice / ASC", "Standard Surgery", "Lab Work"],
    correct: 0
  }
];
