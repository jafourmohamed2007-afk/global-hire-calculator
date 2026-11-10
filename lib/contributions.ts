/**
 * Statutory employer-contribution engine (dependency-free so the data matrix can use it).
 *
 * Every country's employer cost is modelled as a list of real statutory components, each with
 * its own rate, contribution base, ceiling and threshold — instead of one flat percentage — so
 * results stay correct when a salary crosses a social-security cap.
 * All amounts are ANNUAL and in the talent country's LOCAL currency.
 */

export interface EmployerContribution {
  /** Human-readable component name, e.g. "Pension insurance (emerytalne)". */
  readonly label: string;
  /** Rate applied to the contribution base (0.0976 === 9.76%). */
  readonly rate: number;
  /** Share of gross pay that forms the base, e.g. India basic wages = 0.5. Defaults to 1. */
  readonly baseShare?: number;
  /** Annual ceiling on the contribution base, in local currency. */
  readonly annualBaseCapLocal?: number;
  /** Only the part of the base above this annual amount is charged (applied after the cap). */
  readonly annualBaseFloorLocal?: number;
  /** Component applies only when the annual base exceeds this amount (e.g. Colombia > 10 minimum wages). */
  readonly appliesAboveAnnualLocal?: number;
  /** Flat annual amount in local currency, added on top of `rate × base`. */
  readonly fixedAnnualLocal?: number;
}

export interface ContributionLine {
  readonly label: string;
  readonly amountLocal: number;
}

/** Returns the employer amount owed for each component on an annual contribution base. */
export function computeContributionLines(
  contributions: readonly EmployerContribution[],
  annualBaseLocal: number,
): ContributionLine[] {
  const base = Math.max(0, annualBaseLocal);

  return contributions.map((component) => {
    if (component.appliesAboveAnnualLocal !== undefined && base <= component.appliesAboveAnnualLocal) {
      return { label: component.label, amountLocal: 0 };
    }

    let componentBase = base * (component.baseShare ?? 1);
    if (component.annualBaseCapLocal !== undefined) {
      componentBase = Math.min(componentBase, component.annualBaseCapLocal);
    }
    if (component.annualBaseFloorLocal !== undefined) {
      componentBase = Math.max(0, componentBase - component.annualBaseFloorLocal);
    }

    const amountLocal = component.rate * componentBase + (component.fixedAnnualLocal ?? 0);
    return { label: component.label, amountLocal };
  });
}

export function sumContributions(lines: readonly ContributionLine[]): number {
  return lines.reduce((total, line) => total + line.amountLocal, 0);
}
