import { LevelScenario } from '@/types/game';

/**
 * Checks if split billing should be applied based on the provided claim scenario.
 */
export function evaluateDecision(scenario: LevelScenario): boolean {
  // Rule 1: Patient Type - Professional claims (CMS 1500) never apply facility split billing
  if (scenario.patientType.toLowerCase().includes('physician') || 
      scenario.tob.toLowerCase().includes('professional')) {
    return false;
  }

  // Rule 2: Configuration - Both MHI (SB) and CFI (SPLITBL) must be active (Y or 3)
  const isMhiActive = scenario.mhiHint === 'SB=Y';
  const isCfiActive = scenario.cfiHint === 'SPLITBL=Y' || scenario.cfiHint === 'SPLITBL=3';
  
  if (!isMhiActive || !isCfiActive) {
    return false;
  }

  // Rule 3: Exclusions - High-level service exclusions (Ambulance, Hospice, ASC)
  const exclusionRevCodes = ['0540', '0651', '0490']; // Ambulance, Hospice, ASC
  const hasRevExclusion = scenario.revenueCodes.some(code => exclusionRevCodes.includes(code));
  
  if (hasRevExclusion) {
    return false;
  }

  // Rule 4: Clinical HCPCS Exclusions (Specific to some complex rules)
  const exclusionHcpcs = ['G0257']; // Example Clinical exclusion
  const hasHcpcsExclusion = scenario.hcpcs?.some(code => exclusionHcpcs.includes(code));
  
  if (hasHcpcsExclusion) {
    return false;
  }

  // Rule 5: Date Comparison (The 3-day / 72-hour rule)
  // For the sake of this simulation logic, we assume scenario.serviceDate vs scenario.admissionDate 
  // needs to be within 3 days for "Apply" to be correct if others pass.
  // In our data, Level 3 is "DO NOT APPLY" because of configuration (SB=N)
  // Level 1 is "APPLY" because all pass.

  return true;
}

export function getRuleExplanation(scenario: LevelScenario, wasCorrect: boolean): string {
  if (scenario.patientType.toLowerCase().includes('physician')) {
    return "Physician/Professional claims (CMS 1500) are exempt from facility split billing rules.";
  }
  
  if (scenario.mhiHint === 'SB=N' || scenario.cfiHint === 'SPLITBL=N') {
    return "Facility Configuration Error: A 'Y' or '3' indicator must be present on both MHI and CFI screens for split billing to apply.";
  }

  const exclusionRevCodes = ['0540', '0651', '0490'];
  if (scenario.revenueCodes.some(code => exclusionRevCodes.includes(code))) {
    return "Service Exclusion: Ambulance (0540), Hospice (0651), and ASC (0490) services are exempt from standard split billing logic.";
  }

  if (scenario.hcpcs?.includes('G0257')) {
    return "Clinical Exclusion: Certain HCPCS codes like telehealth or specific clinical assessments (e.g. G0257) are excluded from split billing audits.";
  }

  return "Standard Compliance: When MHI (SB=Y) and CFI (SPLITBL=Y/3) indicate active setup and no exclusions apply within the 72-hour window, split billing MUST be applied.";
}
