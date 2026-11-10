import { employerContributionLinesLocal, type TalentCountry } from '@/data/country-matrix';
import { EOR_MONTHLY_FEE_USD } from '@/data/partners';

export interface ContributionLineUSD {
  readonly label: string;
  readonly amountUSD: number;
}

export interface CostBreakdown {
  readonly baseSalaryUSD: number;
  /** Sum of all statutory employer contributions (after ceilings and thresholds). */
  readonly employerTaxUSD: number;
  /** Employer contributions as a fraction of base salary at this salary level. */
  readonly effectiveEmployerTaxRate: number;
  /** Per-component breakdown of employer contributions. */
  readonly contributionLines: readonly ContributionLineUSD[];
  readonly mandatoryBenefitsUSD: number;
  /** Salary + employer taxes + mandatory benefits. */
  readonly trueCostUSD: number;
  readonly eorFeeUSD: number;
  /** True cost + optional EOR platform fee. */
  readonly totalCostUSD: number;
  readonly monthlyTotalUSD: number;
  /** Everything paid on top of base salary. */
  readonly overheadUSD: number;
  /** Total cost divided by base salary (e.g. 1.35). */
  readonly costMultiplier: number;
  /** Employer contributions + mandatory benefits typically back-dated if a contractor is reclassified. */
  readonly misclassificationExposureUSD: number;
}

export interface SalaryRange {
  readonly min: number;
  readonly max: number;
  readonly step: number;
}

export const MIN_SALARY_USD = 1000;
export const MAX_SALARY_USD = 1_000_000;

export function clampSalary(value: number): number {
  if (!Number.isFinite(value)) return MIN_SALARY_USD;
  return Math.min(MAX_SALARY_USD, Math.max(MIN_SALARY_USD, Math.round(value)));
}

export function calculateHireCost(
  talent: Pick<
    TalentCountry,
    'usdToLocalRate' | 'employerContributions' | 'mandatoryBenefitsRate' | 'benefitsSubjectToContributions'
  >,
  baseSalaryUSD: number,
  includeEorFee = false,
): CostBreakdown {
  const base = clampSalary(baseSalaryUSD);
  // Contributions are computed in local currency because statutory ceilings are set in local currency.
  const contributionLines = employerContributionLinesLocal(talent, base * talent.usdToLocalRate).map((line) => ({
    label: line.label,
    amountUSD: line.amountLocal / talent.usdToLocalRate,
  }));
  const employerTaxUSD = contributionLines.reduce((total, line) => total + line.amountUSD, 0);
  const mandatoryBenefitsUSD = base * talent.mandatoryBenefitsRate;
  const trueCostUSD = base + employerTaxUSD + mandatoryBenefitsUSD;
  const eorFeeUSD = includeEorFee ? EOR_MONTHLY_FEE_USD * 12 : 0;
  const totalCostUSD = trueCostUSD + eorFeeUSD;

  return {
    baseSalaryUSD: base,
    employerTaxUSD,
    effectiveEmployerTaxRate: employerTaxUSD / base,
    contributionLines,
    mandatoryBenefitsUSD,
    trueCostUSD,
    eorFeeUSD,
    totalCostUSD,
    monthlyTotalUSD: totalCostUSD / 12,
    overheadUSD: totalCostUSD - base,
    costMultiplier: totalCostUSD / base,
    misclassificationExposureUSD: employerTaxUSD + mandatoryBenefitsUSD,
  };
}

function roundTo(value: number, increment: number): number {
  return Math.round(value / increment) * increment;
}

/** Slider bounds derived from the market's average developer salary. */
export function getSalaryRange(avgDevSalaryUSD: number): SalaryRange {
  const min = Math.max(3000, roundTo(avgDevSalaryUSD * 0.3, 1000));
  const max = Math.max(min + 10000, roundTo(avgDevSalaryUSD * 3, 5000));
  return { min, max, step: 500 };
}

export function convertFromUSD(amountUSD: number, usdToLocalRate: number): number {
  return amountUSD * usdToLocalRate;
}
