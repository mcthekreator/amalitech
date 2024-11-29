import type { RiskFactors } from '../calculation';

export const RISK_FACTORS: RiskFactors = {
  defaultChainflexRiskFactor: 1,
  defaultMat017ItemRiskFactor: 1.12, // Risk'22 (see ICALC-443 for more information)
  defaultMat017ItemAndWorkStepRiskFactor: 1.058, // Risk’07-22 (see ICALC-443 for more information)
};
