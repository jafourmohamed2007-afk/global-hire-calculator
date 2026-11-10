/**
 * Hand-verified calculation tests. Every expected value below was worked out manually from the
 * statutory rates and ceilings documented in SOURCES.md — not by calling the engine — so these
 * tests prove the engine reproduces the real-world arithmetic.
 *
 * Run with: npm test
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { TALENT_COUNTRIES, getTalentCountry, type TalentCountry } from '@/data/country-matrix';
import { calculateHireCost } from '@/lib/cost-engine';

function country(slug: string): TalentCountry {
  const found = getTalentCountry(slug);
  if (!found) throw new Error(`Unknown country ${slug}`);
  return found;
}

/** Asserts two dollar amounts match to the cent (± 1 cent for floating-point). */
function assertUSD(actual: number, expected: number, label: string) {
  assert.ok(Math.abs(actual - expected) < 0.01, `${label}: expected ${expected.toFixed(2)}, got ${actual.toFixed(2)}`);
}

describe('Brazil — contributions also charged on 13th salary and vacation bonus', () => {
  // $36,000 base → benefits 36,000 × (1/12 + 1/36) = 3,000 + 1,000 = 4,000
  // contribution base 40,000 × (20% + 2% + 5.8% + 8%) = 40,000 × 35.8% = 14,320
  const r = calculateHireCost(country('brazil'), 36_000);
  it('mandatory benefits', () => assertUSD(r.mandatoryBenefitsUSD, 4_000, 'benefits'));
  it('employer contributions', () => assertUSD(r.employerTaxUSD, 14_320, 'contributions'));
  it('true cost ≈ 50.9% above base', () => {
    assertUSD(r.trueCostUSD, 54_320, 'true cost');
    assert.equal((r.trueCostUSD / 36_000 - 1).toFixed(3), '0.509');
  });
});

describe('Poland — pension & disability stop at PLN 282,600', () => {
  // $46,000 × 3.93 = PLN 180,780 (below cap) → full 20.48%
  it('below the cap: 20.48%', () => {
    const r = calculateHireCost(country('poland'), 46_000);
    assertUSD(r.employerTaxUSD, 46_000 * 0.2048, 'contributions');
  });
  // $100,000 × 3.93 = PLN 393,000 → 16.26% × 282,600 + 4.22% × 393,000 = 45,950.76 + 16,584.60 = 62,535.36 PLN
  it('above the cap', () => {
    const r = calculateHireCost(country('poland'), 100_000);
    assertUSD(r.employerTaxUSD, 62_535.36 / 3.93, 'contributions');
    assert.ok(r.effectiveEmployerTaxRate < 0.2048);
  });
});

describe('Philippines — SSS, PhilHealth and Pag-IBIG ceilings', () => {
  // $16,000 × 63.06 = ₱1,008,960/yr
  // SSS 10% × 420,000 = 42,000 · EC 360 · PhilHealth 2.5% × 1,008,960 = 25,224 · Pag-IBIG 2% × 120,000 = 2,400
  const r = calculateHireCost(country('philippines'), 16_000);
  it('employer contributions', () => assertUSD(r.employerTaxUSD, 69_984 / 63.06, 'contributions'));
  it('13th-month pay = 1/12', () => assertUSD(r.mandatoryBenefitsUSD, 16_000 / 12, '13th month'));
});

describe('Mexico — IMSS components on integrated salary, UMA MXN 117.31', () => {
  // $38,000 × 18.5 = 703,000 → SBC base × (1 + 18/365) = 737,668.49 (below 25-UMA cap 1,070,453.75)
  // fixed fee 0.204 × 117.31 × 365 = 8,734.90
  // surplus 1.1% × (737,668.49 − 128,454.45) = 6,701.35
  // capped rates 19.55655% × 737,668.49 = 144,262.42 · ISN 3% × 737,668.49 = 22,130.05
  const base = 703_000 * (1 + 18 / 365);
  const expectedLocal =
    0.204 * 117.31 * 365 + 0.011 * (base - 3 * 117.31 * 365) + 0.1955655 * base + 0.03 * base;
  const r = calculateHireCost(country('mexico'), 38_000);
  it('employer contributions', () => assertUSD(r.employerTaxUSD, expectedLocal / 18.5, 'contributions'));
  it('≈25.9% of base salary', () => assert.equal(r.effectiveEmployerTaxRate.toFixed(3), '0.259'));
});

describe('Colombia — health, SENA, ICBF only above 10 minimum wages', () => {
  it('below threshold: 12% + 0.522% + 4% = 16.522%', () => {
    const r = calculateHireCost(country('colombia'), 32_000);
    assertUSD(r.employerTaxUSD, 32_000 * 0.16522, 'contributions');
  });
  // $70,000 × 3,250 = COP 227.5M > 10 × 1,750,905 × 12 = 210,108,600 → all components apply
  it('above threshold: 30.022%', () => {
    const r = calculateHireCost(country('colombia'), 70_000);
    assertUSD(r.employerTaxUSD, 70_000 * 0.30022, 'contributions');
  });
});

describe('Vietnam — insurance caps (VND 50.6M and 106.2M per month)', () => {
  // $30,000 × 25,650 = 769.5M VND/yr; SI/HI/union cap 607.2M; UI cap 1,274.4M
  // 17.5% × 607.2M + 3% × 607.2M + 2% × 607.2M + 1% × 769.5M = 144,315,000
  const r = calculateHireCost(country('vietnam'), 30_000);
  it('employer contributions', () => assertUSD(r.employerTaxUSD, 144_315_000 / 25_650, 'contributions'));
});

describe('Ukraine — ESV capped at 20× minimum wage', () => {
  // cap 20 × 8,647 × 12 = 2,075,280 UAH → 22% × 2,075,280 = 456,561.60
  const r = calculateHireCost(country('ukraine'), 50_000);
  it('employer contributions', () => assertUSD(r.employerTaxUSD, 456_561.6 / 45.32, 'contributions'));
});

describe('India — PF on basic wages (50% of pay)', () => {
  // $18,000 × 93.6 = ₹1,684,800 → basic 842,400
  // 12% × 842,400 + 0.5% × 842,400 + 0.5% × 180,000 = 101,088 + 4,212 + 900 = 106,200
  const r = calculateHireCost(country('india'), 18_000);
  it('employer contributions', () => assertUSD(r.employerTaxUSD, 106_200 / 93.6, 'contributions'));
  it('gratuity accrual 4.81% of basic', () => assertUSD(r.mandatoryBenefitsUSD, 18_000 * 0.5 * 0.0481, 'gratuity'));
});

describe('Totals, EOR fee and effective rates', () => {
  it('EOR fee adds exactly $599 × 12', () => {
    const without = calculateHireCost(country('india'), 30_000, false);
    const withFee = calculateHireCost(country('india'), 30_000, true);
    assertUSD(withFee.totalCostUSD - without.totalCostUSD, 7_188, 'EOR fee');
  });

  for (const c of TALENT_COUNTRIES) {
    it(`${c.countryName}: parts add up and headline rate matches engine`, () => {
      const r = calculateHireCost(c, c.avgDevSalaryUSD, true);
      assertUSD(r.trueCostUSD, r.baseSalaryUSD + r.employerTaxUSD + r.mandatoryBenefitsUSD, 'true cost');
      assertUSD(r.totalCostUSD, r.trueCostUSD + r.eorFeeUSD, 'total');
      assertUSD(r.monthlyTotalUSD * 12, r.totalCostUSD, 'monthly');
      assertUSD(r.contributionLines.reduce((s, l) => s + l.amountUSD, 0), r.employerTaxUSD, 'lines');
      assert.ok(Math.abs(r.effectiveEmployerTaxRate - c.employerTaxRate) < 1e-12);
      assert.ok(c.avgDevSalaryUSD >= c.salaryRangeUSD[0] && c.avgDevSalaryUSD <= c.salaryRangeUSD[1]);
    });
  }
});
