/**
 * Global Remote Hire — static country matrix.
 *
 * Conventions:
 * - Every salary figure is ANNUAL GROSS and denominated in USD.
 * - Rates are decimal fractions (0.12 === 12%).
 * - `usdToLocalRate` is "units of local currency per 1 USD" (mid-market, see FX_RATES_AS_OF).
 * - Employer costs are modelled component-by-component with real statutory rates, ceilings and
 *   thresholds (see lib/contributions.ts). Sources for every figure are listed in SOURCES.md.
 * - Figures are planning estimates for budgeting, not tax or legal advice.
 */

import { computeContributionLines, sumContributions, type EmployerContribution } from '../lib/contributions';

export type { EmployerContribution } from '../lib/contributions';

export type ComplianceRiskScore = 'Low' | 'Medium' | 'High';

export interface TalentCountry {
  /** URL-safe identifier used in `/hire/[company]-to-[talent]`. */
  readonly slug: string;
  readonly countryName: string;
  /** ISO 3166-1 alpha-2 code. */
  readonly isoCode: string;
  /** ISO 4217 currency code. */
  readonly currencyCode: string;
  /** Units of local currency per 1 USD (indicative). */
  readonly usdToLocalRate: number;
  /** Mid-point annual gross salary of a mid-level software developer, in USD. */
  readonly avgDevSalaryUSD: number;
  /** Typical mid-level developer salary range found across 2026 salary surveys, in USD. */
  readonly salaryRangeUSD: readonly [number, number];
  /**
   * Effective employer contribution rate at `avgDevSalaryUSD` (fraction of base salary).
   * Computed automatically from `employerContributions`, so it can never drift from the engine.
   */
  readonly employerTaxRate: number;
  /** Statutory employer contributions, each with its own rate, base, ceiling and threshold. */
  readonly employerContributions: readonly EmployerContribution[];
  /**
   * Mandatory statutory payments on top of 12 months of base salary
   * (13th-month pay, vacation premiums, severance-fund accruals), as a fraction of annual base.
   */
  readonly mandatoryBenefitsRate: number;
  /** Whether employer contributions are also charged on the mandatory benefits (Brazil, Mexico). */
  readonly benefitsSubjectToContributions: boolean;
  readonly complianceRiskScore: ComplianceRiskScore;
  /** One-paragraph explanation of the dominant legal risk for foreign employers. */
  readonly complianceRiskSummary: string;
  /** Mandatory local employer contributions and employee benefits. */
  readonly localTaxNotes: readonly string[];
  readonly paidLeaveSummary: string;
  /** How independent-contractor engagements typically work in this market. */
  readonly contractorModel: string;
}

export interface CompanyCountry {
  readonly slug: string;
  readonly countryName: string;
  /** Name as it reads inside a sentence, e.g. "the United States". */
  readonly nameInSentence: string;
  readonly isoCode: string;
  readonly currencyCode: string;
  /** Units of local currency per 1 USD (indicative). */
  readonly usdToLocalRate: number;
  /** Home-country obligations when paying people abroad. */
  readonly crossBorderNote: string;
}

export const DATA_YEAR = 2026;

/** Date of the mid-market exchange rates used below. */
export const FX_RATES_AS_OF = '10 November 2026';

type TalentCountryInput = Omit<TalentCountry, 'employerTaxRate'>;

/** Employer contributions owed on a given annual base salary, in local currency. */
export function employerContributionLinesLocal(
  country: Pick<
    TalentCountry,
    'employerContributions' | 'mandatoryBenefitsRate' | 'benefitsSubjectToContributions'
  >,
  annualSalaryLocal: number,
) {
  const base = country.benefitsSubjectToContributions
    ? annualSalaryLocal * (1 + country.mandatoryBenefitsRate)
    : annualSalaryLocal;
  return computeContributionLines(country.employerContributions, base);
}

function withEffectiveRate<const T extends TalentCountryInput>(country: T): T & { readonly employerTaxRate: number } {
  const salaryLocal = country.avgDevSalaryUSD * country.usdToLocalRate;
  const contributions = sumContributions(employerContributionLinesLocal(country, salaryLocal));
  return { ...country, employerTaxRate: contributions / salaryLocal };
}

// ── Statutory reference values (2026) used in the components below ──
/** India: EPF wage ceiling for EDLI, ₹15,000/month. */
const IN_EPF_WAGE_CEILING_ANNUAL = 15_000 * 12;
/** Poland: annual cap on pension & disability base = 30× projected average wage (PLN 282,600 in 2026). */
const PL_ZUS_ANNUAL_CAP = 282_600;
/** Mexico: UMA (Unidad de Medida y Actualización) = MXN 117.31/day from 1 Feb 2026 (INEGI). */
const MX_UMA_DAILY = 117.31;
const MX_SBC_ANNUAL_CAP = 25 * MX_UMA_DAILY * 365; // IMSS/INFONAVIT base ceiling: 25 UMA per day
const MX_EXCEDENTE_FLOOR = 3 * MX_UMA_DAILY * 365; // sickness surplus applies above 3 UMA per day
/** Colombia: SMMLV (monthly minimum wage) = COP 1,750,905 in 2026. */
const CO_SMMLV = 1_750_905;
/** Vietnam: social & health insurance base capped at 20× base salary (VND 2.53M from 1 Jul 2026). */
const VN_SI_ANNUAL_CAP = 20 * 2_530_000 * 12;
/** Vietnam: unemployment insurance capped at 20× Region I minimum wage (VND 5.31M in 2026). */
const VN_UI_ANNUAL_CAP = 20 * 5_310_000 * 12;
/** Ukraine: ESV base capped at 20× minimum wage (UAH 8,647/month in 2026). */
const UA_ESV_ANNUAL_CAP = 20 * 8_647 * 12;

const TALENT_COUNTRY_DATA = [
  {
    slug: 'india',
    countryName: 'India',
    isoCode: 'IN',
    currencyCode: 'INR',
    usdToLocalRate: 93.6,
    avgDevSalaryUSD: 18000,
    salaryRangeUSD: [12000, 25000],
    employerContributions: [
      { label: 'Provident Fund + Pension Scheme (EPF/EPS) on basic wages', rate: 0.12, baseShare: 0.5 },
      { label: 'EPF administration charges', rate: 0.005, baseShare: 0.5 },
      {
        label: 'EDLI insurance (on wages up to ₹15,000/month)',
        rate: 0.005,
        baseShare: 0.5,
        annualBaseCapLocal: IN_EPF_WAGE_CEILING_ANNUAL,
      },
    ],
    // Gratuity accrual: 15/26 of a month's basic per year of service = 4.81% of basic (basic = 50% of pay).
    mandatoryBenefitsRate: 0.0481 * 0.5,
    benefitsSubjectToContributions: false,
    complianceRiskScore: 'Medium',
    complianceRiskSummary:
      'Permanent establishment (PE) exposure and contractor misclassification are the main risks. Long-term, exclusive, full-time contractors are frequently re-characterised as employees, triggering back-dated Provident Fund contributions, gratuity and interest.',
    localTaxNotes: [
      'Employer Provident Fund + Pension Scheme: 12% of basic wages, plus 0.5% EPF administration charges and 0.5% EDLI insurance (EDLI on wages up to ₹15,000/month).',
      'The four Labour Codes (in force since 21 November 2025) require basic wages to be at least 50% of total pay — this calculator applies PF to 50% of gross. Employers may legally limit PF to the ₹15,000/month wage ceiling (₹1,800/month), which lowers cost.',
      'Gratuity accrues at 15/26 of a month’s basic wages per year of service (≈4.81% of basic).',
      'Employees’ State Insurance (3.25% employer) applies only to employees earning up to ₹21,000/month, so it rarely applies to developers.',
      'Professional Tax and Labour Welfare Fund contributions vary by state; employers must also withhold income tax (TDS) monthly.',
    ],
    paidLeaveSummary:
      'Earned leave of roughly 12–21 days per year under state Shops & Establishments Acts, plus national and festival holidays.',
    contractorModel:
      'Contractors invoice as sole proprietors and pay their own income tax and 18% GST where registered; exports of services can be zero-rated.',
  },
  {
    slug: 'brazil',
    countryName: 'Brazil',
    isoCode: 'BR',
    currencyCode: 'BRL',
    usdToLocalRate: 5.51,
    avgDevSalaryUSD: 36000,
    salaryRangeUSD: [31000, 45000],
    employerContributions: [
      { label: 'INSS employer social security', rate: 0.2 },
      { label: 'RAT/SAT work-accident insurance (1–3%, 2% used)', rate: 0.02 },
      { label: 'Third-party contributions (Terceiros: Sistema S, INCRA, salário-educação)', rate: 0.058 },
      { label: 'FGTS severance fund deposit', rate: 0.08 },
    ],
    // 13th salary (1/12) + one-third constitutional vacation bonus (1/3 of a month = 1/36).
    mandatoryBenefitsRate: 1 / 12 + 1 / 36,
    benefitsSubjectToContributions: true,
    complianceRiskScore: 'High',
    complianceRiskSummary:
      'CLT labour law is strongly worker-protective. “PJ” contractor arrangements that look like employment (pejotização) are routinely reclassified by labour courts, with back-pay of FGTS, 13th salary, vacation bonus and fines.',
    localTaxNotes: [
      'Employer INSS social security of 20% of gross pay (no ceiling), plus RAT/SAT work-accident insurance of 1–3% depending on risk class and FAP factor.',
      'Third-party contributions (Terceiros) of roughly 3.3–5.8% depending on activity; 5.8% is used here.',
      'FGTS severance fund: employer deposits 8% of monthly gross into the employee’s account.',
      'Mandatory 13th salary (one extra month per year) and a one-third constitutional bonus on vacation pay — INSS and FGTS are charged on both, bringing total cost to ≈51% above base salary.',
      'Dismissal without cause triggers a 40% FGTS penalty and notice of 30 days plus 3 days per year of service.',
    ],
    paidLeaveSummary: '30 calendar days of paid vacation per year, paid with an additional one-third bonus.',
    contractorModel:
      'Contractors operate through a PJ company (often under Simples Nacional or as an MEI) and invoice in BRL or via export-of-services contracts.',
  },
  {
    slug: 'poland',
    countryName: 'Poland',
    isoCode: 'PL',
    currencyCode: 'PLN',
    usdToLocalRate: 3.93,
    avgDevSalaryUSD: 46000,
    salaryRangeUSD: [38000, 58000],
    employerContributions: [
      { label: 'Pension insurance (emerytalne)', rate: 0.0976, annualBaseCapLocal: PL_ZUS_ANNUAL_CAP },
      { label: 'Disability insurance (rentowe)', rate: 0.065, annualBaseCapLocal: PL_ZUS_ANNUAL_CAP },
      { label: 'Accident insurance (0.67–3.33%, 1.67% used)', rate: 0.0167 },
      { label: 'Labour Fund + Solidarity Fund', rate: 0.0245 },
      { label: 'Guaranteed Employee Benefits Fund (FGŚP)', rate: 0.001 },
    ],
    mandatoryBenefitsRate: 0,
    benefitsSubjectToContributions: false,
    complianceRiskScore: 'Low',
    complianceRiskSummary:
      'Poland has a mature, widely accepted B2B contractor market and EU-standard employment law. The main risks are permanent establishment exposure and B2B contracts that mirror employment (fixed hours, subordination, no business risk).',
    localTaxNotes: [
      'Employer ZUS: pension 9.76%, disability 6.5%, accident insurance 0.67–3.33% by sector (1.67% used), Labour Fund + Solidarity Fund 2.45% and FGŚP 0.10% — 20.48% in total.',
      'Pension and disability contributions stop once annual pay reaches 30× the projected average wage — PLN 282,600 in 2026.',
      'Employee Capital Plans (PPK): employer contributes 1.5% of pay unless the employee opts out (not included above).',
      'Employer must withhold PIT income tax and the employee’s 9% health insurance contribution via payroll.',
    ],
    paidLeaveSummary: '20 days of paid leave per year, rising to 26 days after 10 years of seniority (education counts).',
    contractorModel:
      'Developers commonly work B2B as sole traders (JDG) on flat 19% tax or IP Box regimes and invoice with 23% VAT (reverse-charged for foreign clients).',
  },
  {
    slug: 'philippines',
    countryName: 'Philippines',
    isoCode: 'PH',
    currencyCode: 'PHP',
    usdToLocalRate: 63.06,
    avgDevSalaryUSD: 16000,
    salaryRangeUSD: [10000, 22000],
    employerContributions: [
      { label: 'SSS social security (10% of salary credit up to ₱35,000/month)', rate: 0.1, annualBaseCapLocal: 35_000 * 12 },
      { label: 'SSS Employees’ Compensation (₱30/month)', rate: 0, fixedAnnualLocal: 30 * 12 },
      { label: 'PhilHealth (2.5% up to ₱100,000/month)', rate: 0.025, annualBaseCapLocal: 100_000 * 12 },
      { label: 'Pag-IBIG housing fund (2% up to ₱10,000/month)', rate: 0.02, annualBaseCapLocal: 10_000 * 12 },
    ],
    // Mandatory 13th-month pay = 1/12 of basic annual salary (rank-and-file employees).
    mandatoryBenefitsRate: 1 / 12,
    benefitsSubjectToContributions: false,
    complianceRiskScore: 'Medium',
    complianceRiskSummary:
      'Employees become “regular” after a maximum six-month probation and gain strong security of tenure. Long-term contractors doing core, controlled work risk reclassification, with back-pay of 13th-month pay and government contributions.',
    localTaxNotes: [
      'SSS: employer pays 10% of the monthly salary credit (capped at ₱35,000, so at most ₱3,500/month), plus Employees’ Compensation of ₱30/month.',
      'PhilHealth: 5% premium split equally — employer pays 2.5% on salary up to ₱100,000/month.',
      'Pag-IBIG housing fund: employer contributes 2% of compensation up to ₱10,000/month (₱200/month maximum).',
      'Mandatory 13th-month pay equal to one-twelfth of basic annual salary for rank-and-file employees, due by 24 December.',
      'HMO private health coverage is not mandatory but is expected by developers in competitive markets.',
    ],
    paidLeaveSummary:
      'Minimum 5 days of Service Incentive Leave after one year; 15+ days of vacation and sick leave is market standard for tech roles.',
    contractorModel:
      'Freelancers register with the BIR as self-employed, pay graduated or 8% flat income tax, and issue official receipts or invoices.',
  },
  {
    slug: 'mexico',
    countryName: 'Mexico',
    isoCode: 'MX',
    currencyCode: 'MXN',
    usdToLocalRate: 18.5,
    avgDevSalaryUSD: 38000,
    salaryRangeUSD: [34000, 50000],
    employerContributions: [
      { label: 'IMSS sickness & maternity — fixed fee (20.40% of UMA per day)', rate: 0, fixedAnnualLocal: 0.204 * MX_UMA_DAILY * 365 },
      {
        label: 'IMSS sickness & maternity — surplus above 3 UMA',
        rate: 0.011,
        annualBaseCapLocal: MX_SBC_ANNUAL_CAP,
        annualBaseFloorLocal: MX_EXCEDENTE_FLOOR,
      },
      { label: 'IMSS cash benefits', rate: 0.007, annualBaseCapLocal: MX_SBC_ANNUAL_CAP },
      { label: 'IMSS pensioners’ medical expenses', rate: 0.0105, annualBaseCapLocal: MX_SBC_ANNUAL_CAP },
      { label: 'IMSS disability & life', rate: 0.0175, annualBaseCapLocal: MX_SBC_ANNUAL_CAP },
      { label: 'IMSS childcare & social benefits', rate: 0.01, annualBaseCapLocal: MX_SBC_ANNUAL_CAP },
      { label: 'IMSS work-risk premium (class I office minimum)', rate: 0.0054355, annualBaseCapLocal: MX_SBC_ANNUAL_CAP },
      { label: 'Retirement (SAR)', rate: 0.02, annualBaseCapLocal: MX_SBC_ANNUAL_CAP },
      { label: 'Severance & old age (CEAV, 2026 rate above 4 UMA)', rate: 0.07513, annualBaseCapLocal: MX_SBC_ANNUAL_CAP },
      { label: 'INFONAVIT housing fund', rate: 0.05, annualBaseCapLocal: MX_SBC_ANNUAL_CAP },
      { label: 'State payroll tax (ISN, 1–4% by state, 3% used)', rate: 0.03 },
    ],
    // Aguinaldo of 15 days + 25% vacation premium on 12 vacation days (3 days) = 18/365 of annual pay.
    mandatoryBenefitsRate: 18 / 365,
    benefitsSubjectToContributions: true,
    complianceRiskScore: 'High',
    complianceRiskSummary:
      'The 2021 outsourcing reform bans personnel subcontracting outside registered (REPSE) specialised services. Disguised contractor relationships expose companies to IMSS assessments, mandatory profit sharing (PTU) and constitutional severance.',
    localTaxNotes: [
      'IMSS social security across five insurance branches, 2% SAR retirement and 5% INFONAVIT housing fund, charged on the integrated daily salary (SBC) up to 25 UMA per day (UMA = MXN 117.31 in 2026).',
      'Employer severance & old-age (CEAV) contributions rise every year under the 2020 pension reform: 7.513% for salaries above 4 UMA in 2026, reaching 11.875% in 2030.',
      'State payroll tax (Impuesto Sobre Nómina) of 1–4% depending on the state; 3% is used here.',
      'Mandatory aguinaldo year-end bonus of at least 15 days’ salary (paid by 20 December) and a vacation premium of at least 25% of vacation pay; both integrate into the contribution base.',
      'Mandatory profit sharing (PTU) of 10% of pre-tax profits for employers with a Mexican entity, capped per employee (not included above).',
    ],
    paidLeaveSummary: 'At least 12 paid vacation days in the first year, rising by two days per year to 20 days, then by two days every five years.',
    contractorModel:
      'Contractors invoice under the RESICO or business-activity regimes and issue CFDI electronic invoices; exports of services can be 0% VAT.',
  },
  {
    slug: 'colombia',
    countryName: 'Colombia',
    isoCode: 'CO',
    currencyCode: 'COP',
    usdToLocalRate: 3250,
    avgDevSalaryUSD: 32000,
    salaryRangeUSD: [25000, 50000],
    employerContributions: [
      { label: 'Pension (12%, base capped at 25 minimum wages)', rate: 0.12, annualBaseCapLocal: 25 * CO_SMMLV * 12 },
      { label: 'ARL occupational-risk insurance (class I)', rate: 0.00522, annualBaseCapLocal: 25 * CO_SMMLV * 12 },
      { label: 'Caja de Compensación family fund', rate: 0.04 },
      {
        label: 'Health (8.5%, only above 10 minimum wages)',
        rate: 0.085,
        appliesAboveAnnualLocal: 10 * CO_SMMLV * 12,
        annualBaseCapLocal: 25 * CO_SMMLV * 12,
      },
      { label: 'SENA (2%, only above 10 minimum wages)', rate: 0.02, appliesAboveAnnualLocal: 10 * CO_SMMLV * 12 },
      { label: 'ICBF (3%, only above 10 minimum wages)', rate: 0.03, appliesAboveAnnualLocal: 10 * CO_SMMLV * 12 },
    ],
    // Prima de servicios (1 month) + cesantías (1 month) + 12% interest on cesantías.
    mandatoryBenefitsRate: 1 / 12 + 1 / 12 + 0.12 / 12,
    benefitsSubjectToContributions: false,
    complianceRiskScore: 'High',
    complianceRiskSummary:
      'Colombian courts apply “primacy of reality”: any subordinated, continuous service is an employment contract regardless of paperwork. Reclassification brings back-dated social security, prestaciones sociales and a daily late-payment penalty.',
    localTaxNotes: [
      'Employer pension contribution of 12%, ARL occupational-risk insurance (0.522% for office work) and Caja de Compensación family fund of 4%.',
      'Health (8.5%), SENA (2%) and ICBF (3%) are exempt for employees earning under 10 minimum wages (COP 17.5M/month in 2026) when the employer is a Colombian income-tax payer, such as an EOR (Art. 114-1 Tax Statute).',
      'Prima de servicios: one month of salary per year, paid in two instalments (June and December).',
      'Cesantías severance fund: one month of salary per year, plus 12% annual interest on the balance.',
      '2026 minimum wage (SMMLV): COP 1,750,905 per month.',
    ],
    paidLeaveSummary: '15 working days of paid vacation per year, plus 18 national holidays.',
    contractorModel:
      'Independent contractors (contratistas) must self-contribute to health and pension on 40% of their income and invoice electronically to the DIAN.',
  },
  {
    slug: 'vietnam',
    countryName: 'Vietnam',
    isoCode: 'VN',
    currencyCode: 'VND',
    usdToLocalRate: 25650,
    avgDevSalaryUSD: 20000,
    salaryRangeUSD: [12000, 30000],
    employerContributions: [
      { label: 'Social insurance (incl. occupational accident fund)', rate: 0.175, annualBaseCapLocal: VN_SI_ANNUAL_CAP },
      { label: 'Health insurance', rate: 0.03, annualBaseCapLocal: VN_SI_ANNUAL_CAP },
      { label: 'Unemployment insurance', rate: 0.01, annualBaseCapLocal: VN_UI_ANNUAL_CAP },
      { label: 'Trade union fee', rate: 0.02, annualBaseCapLocal: VN_SI_ANNUAL_CAP },
    ],
    mandatoryBenefitsRate: 0,
    benefitsSubjectToContributions: false,
    complianceRiskScore: 'Medium',
    complianceRiskSummary:
      'Foreign companies cannot employ Vietnamese staff directly without a local legal entity or a licensed labour-leasing partner. Unregistered employment and long-running contractor arrangements expose the company to tax and social insurance assessments.',
    localTaxNotes: [
      'Employer social insurance 17.5%, health insurance 3% and unemployment insurance 1% — 21.5% in total.',
      'Social and health insurance stop at 20× the statutory base salary: VND 50.6M/month since 1 July 2026 (base salary VND 2.53M). Unemployment insurance stops at 20× the regional minimum wage (VND 106.2M/month in Region I).',
      'A 2% trade union fee on the social insurance salary fund is payable by employers.',
      'A 13th-month Tết bonus is customary in tech but not legally mandatory unless written into the contract.',
      'Employers must withhold progressive personal income tax and file monthly or quarterly declarations.',
    ],
    paidLeaveSummary: '12 days of paid annual leave, plus one day per five years of service and 11 public holidays.',
    contractorModel:
      'Individuals receiving foreign service fees self-declare personal income tax; companies often use labour-leasing partners for compliance.',
  },
  {
    slug: 'ukraine',
    countryName: 'Ukraine',
    isoCode: 'UA',
    currencyCode: 'UAH',
    usdToLocalRate: 45.32,
    avgDevSalaryUSD: 36000,
    salaryRangeUSD: [28000, 42000],
    employerContributions: [
      { label: 'Unified Social Contribution (ESV, capped at 20× minimum wage)', rate: 0.22, annualBaseCapLocal: UA_ESV_ANNUAL_CAP },
    ],
    mandatoryBenefitsRate: 0,
    benefitsSubjectToContributions: false,
    complianceRiskScore: 'High',
    complianceRiskSummary:
      'Martial law brings mobilisation rules, banking and currency controls and business-continuity risk. Most engineers work as FOP private entrepreneurs; arrangements that look like employment can be reclassified.',
    localTaxNotes: [
      'Unified Social Contribution (ESV) of 22% paid by the employer, on salary up to 20× the minimum wage (UAH 172,940/month in 2026; minimum wage UAH 8,647).',
      'Employer withholds 18% personal income tax and the 5% military levy from employee pay.',
      'Employment contracts must be registered and paid through a Ukrainian entity or an Employer of Record.',
      'Diia.City residents can access a special 5% PIT regime and reduced ESV for gig specialists.',
    ],
    paidLeaveSummary: '24 calendar days of paid annual leave, plus public holidays (holiday transfers suspended under martial law).',
    contractorModel:
      'FOP “Group 3” single-tax entrepreneurs pay 5% of revenue plus a fixed minimum ESV (UAH 1,902/month in 2026) and invoice foreign clients in USD or EUR.',
  },
] as const satisfies readonly TalentCountryInput[];

export const TALENT_COUNTRIES = TALENT_COUNTRY_DATA.map(withEffectiveRate);

export const COMPANY_COUNTRIES = [
  {
    slug: 'us',
    countryName: 'United States',
    nameInSentence: 'the United States',
    isoCode: 'US',
    currencyCode: 'USD',
    usdToLocalRate: 1,
    crossBorderNote:
      'US companies usually have no US payroll obligation for non-resident workers performing services abroad. Collect Form W-8BEN from foreign contractors (no 1099 filing) and watch for state nexus if the worker relocates to the US.',
  },
  {
    slug: 'uk',
    countryName: 'United Kingdom',
    nameInSentence: 'the United Kingdom',
    isoCode: 'GB',
    currencyCode: 'GBP',
    usdToLocalRate: 0.749,
    crossBorderNote:
      'UK businesses do not operate PAYE for workers based and working entirely overseas. IR35 off-payroll rules generally do not apply to non-UK-resident contractors, but local employment law in the worker’s country still does.',
  },
  {
    slug: 'canada',
    countryName: 'Canada',
    nameInSentence: 'Canada',
    isoCode: 'CA',
    currencyCode: 'CAD',
    usdToLocalRate: 1.412,
    crossBorderNote:
      'Canadian companies paying non-residents for services performed outside Canada generally have no Regulation 102 withholding. Keep contracts, invoices and proof of work location to support the expense deduction.',
  },
  {
    slug: 'germany',
    countryName: 'Germany',
    nameInSentence: 'Germany',
    isoCode: 'DE',
    currencyCode: 'EUR',
    usdToLocalRate: 0.894,
    crossBorderNote:
      'German companies face strict “Scheinselbstständigkeit” (false self-employment) scrutiny for contractors in the EU. Reverse-charge VAT applies to B2B services from abroad, and senior remote staff can create a foreign permanent establishment.',
  },
  {
    slug: 'australia',
    countryName: 'Australia',
    nameInSentence: 'Australia',
    isoCode: 'AU',
    currencyCode: 'AUD',
    usdToLocalRate: 1.456,
    crossBorderNote:
      'Australian employers generally have no PAYG withholding or Superannuation Guarantee obligation for non-residents working wholly overseas. Collect invoices (no ABN required) and review GST reverse-charge rules for imported services.',
  },
  {
    slug: 'singapore',
    countryName: 'Singapore',
    nameInSentence: 'Singapore',
    isoCode: 'SG',
    currencyCode: 'SGD',
    usdToLocalRate: 1.283,
    crossBorderNote:
      'Singapore companies do not contribute CPF for foreigners working outside Singapore. Payments to non-residents for services performed abroad are generally outside Singapore withholding tax, but GST reverse charge may apply.',
  },
] as const satisfies readonly CompanyCountry[];

export type TalentSlug = (typeof TALENT_COUNTRY_DATA)[number]['slug'];
export type CompanySlug = (typeof COMPANY_COUNTRIES)[number]['slug'];

export interface HireCorridor {
  readonly slug: string;
  readonly company: CompanyCountry;
  readonly talent: TalentCountry;
}

const SLUG_SEPARATOR = '-to-';

const talentBySlug = new Map<string, TalentCountry>(TALENT_COUNTRIES.map((c) => [c.slug, c]));
const companyBySlug = new Map<string, CompanyCountry>(COMPANY_COUNTRIES.map((c) => [c.slug, c]));

export function getTalentCountry(slug: string): TalentCountry | undefined {
  return talentBySlug.get(slug.toLowerCase());
}

export function getCompanyCountry(slug: string): CompanyCountry | undefined {
  return companyBySlug.get(slug.toLowerCase());
}

/** Builds a corridor slug such as `us-to-india`. */
export function buildCorridorSlug(companySlug: string, talentSlug: string): string {
  return `${companySlug.toLowerCase()}${SLUG_SEPARATOR}${talentSlug.toLowerCase()}`;
}

/** Parses `us-to-india` into its company and talent country records, or `null` if unknown. */
export function parseCorridorSlug(slug: string): HireCorridor | null {
  const normalised = decodeURIComponent(slug).trim().toLowerCase();
  const separatorIndex = normalised.indexOf(SLUG_SEPARATOR);
  if (separatorIndex <= 0) return null;

  const company = getCompanyCountry(normalised.slice(0, separatorIndex));
  const talent = getTalentCountry(normalised.slice(separatorIndex + SLUG_SEPARATOR.length));
  if (!company || !talent) return null;

  return { slug: buildCorridorSlug(company.slug, talent.slug), company, talent };
}

/** Every company × talent combination, used for static generation and the sitemap. */
export function getAllCorridors(): HireCorridor[] {
  return COMPANY_COUNTRIES.flatMap((company) =>
    TALENT_COUNTRIES.map((talent) => ({
      slug: buildCorridorSlug(company.slug, talent.slug),
      company,
      talent,
    })),
  );
}
