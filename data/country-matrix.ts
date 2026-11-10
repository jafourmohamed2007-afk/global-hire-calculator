/**
 * Global Remote Hire — static country matrix.
 *
 * Conventions:
 * - Every salary figure is ANNUAL GROSS and denominated in USD.
 * - Rates are decimal fractions of gross salary (0.12 === 12%).
 * - `usdToLocalRate` is "units of local currency per 1 USD" (indicative reference rate).
 * - Figures are planning estimates for budgeting, not tax or legal advice. Statutory
 *   caps, regional surcharges and company-specific regimes change real outcomes.
 */

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
  /** Indicative annual gross salary of a mid-level software developer, in USD. */
  readonly avgDevSalaryUSD: number;
  /** Employer-side statutory social security and payroll contributions, as a fraction of gross. */
  readonly employerTaxRate: number;
  /**
   * Mandatory statutory payments on top of 12 months of base salary
   * (13th-month pay, vacation premiums, severance-fund accruals), as a fraction of annual base.
   */
  readonly mandatoryBenefitsRate: number;
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

export const TALENT_COUNTRIES = [
  {
    slug: 'india',
    countryName: 'India',
    isoCode: 'IN',
    currencyCode: 'INR',
    usdToLocalRate: 88.5,
    avgDevSalaryUSD: 22000,
    employerTaxRate: 0.12,
    mandatoryBenefitsRate: 0.024,
    complianceRiskScore: 'Medium',
    complianceRiskSummary:
      'Permanent establishment (PE) exposure and contractor misclassification are the main risks. Long-term, exclusive, full-time contractors are frequently re-characterised as employees, triggering back-dated Provident Fund contributions, gratuity and interest.',
    localTaxNotes: [
      'Employees’ Provident Fund (EPF): employer contributes 12% of basic wages (split between EPF and the EPS pension scheme).',
      'Gratuity accrues at roughly 4.81% of basic wages and becomes payable after five years of continuous service.',
      'The Labour Codes require “wages” (basic + dearness allowance) to be at least 50% of total pay, which raises the PF and gratuity base.',
      'Employees’ State Insurance (3.25% employer) applies only to low-wage employees and rarely to developers.',
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
    usdToLocalRate: 5.35,
    avgDevSalaryUSD: 36000,
    employerTaxRate: 0.35,
    mandatoryBenefitsRate: 0.111,
    complianceRiskScore: 'High',
    complianceRiskSummary:
      'CLT labour law is strongly worker-protective. “PJ” contractor arrangements that look like employment (pejotização) are routinely reclassified by labour courts, with back-pay of FGTS, 13th salary, vacation bonus and fines.',
    localTaxNotes: [
      'Employer INSS social security of 20% on gross payroll, plus RAT/SAT work-accident insurance (1–3%) and third-party contributions (~5.8%).',
      'FGTS severance fund: employer deposits 8% of monthly gross into the employee’s account.',
      'Mandatory 13th salary (one extra month per year) and a one-third constitutional bonus on top of vacation pay.',
      'Customary benefits include meal/food vouchers (VR/VA) and the statutory transportation voucher (vale-transporte).',
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
    usdToLocalRate: 3.65,
    avgDevSalaryUSD: 52000,
    employerTaxRate: 0.2048,
    mandatoryBenefitsRate: 0,
    complianceRiskScore: 'Low',
    complianceRiskSummary:
      'Poland has a mature, widely accepted B2B contractor market and EU-standard employment law. The main risks are permanent establishment exposure and B2B contracts that mirror employment (fixed hours, subordination, no business risk).',
    localTaxNotes: [
      'Employer ZUS: pension 9.76%, disability 6.5%, accident insurance ~1.67%, Labour Fund 2.45% and Guaranteed Employee Benefits Fund 0.10%.',
      'Pension and disability contributions are capped annually at 30× the projected average monthly wage.',
      'Employee Capital Plans (PPK): employer contributes 1.5% of pay unless the employee opts out.',
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
    usdToLocalRate: 58.5,
    avgDevSalaryUSD: 20000,
    employerTaxRate: 0.065,
    mandatoryBenefitsRate: 0.0833,
    complianceRiskScore: 'Medium',
    complianceRiskSummary:
      'Employees become “regular” after a maximum six-month probation and gain strong security of tenure. Long-term contractors doing core, controlled work risk reclassification, with back-pay of 13th-month pay and government contributions.',
    localTaxNotes: [
      'SSS social security: employer pays 10% of monthly salary credit (capped), plus Employees’ Compensation of ₱10–₱30 per month.',
      'PhilHealth: 5% premium split equally, so the employer pays 2.5% up to the income ceiling.',
      'Pag-IBIG housing fund: employer contributes 2% of monthly compensation up to the statutory cap.',
      'Mandatory 13th-month pay equal to one-twelfth of basic annual salary, due by 24 December.',
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
    usdToLocalRate: 18.4,
    avgDevSalaryUSD: 38000,
    employerTaxRate: 0.27,
    mandatoryBenefitsRate: 0.049,
    complianceRiskScore: 'High',
    complianceRiskSummary:
      'The 2021 outsourcing reform bans personnel subcontracting outside registered (REPSE) specialised services. Disguised contractor relationships expose companies to IMSS assessments, mandatory profit sharing (PTU) and constitutional severance.',
    localTaxNotes: [
      'IMSS social security, INFONAVIT housing fund (5%) and SAR retirement savings, with employer retirement rates rising each year through 2030.',
      'State payroll tax (Impuesto Sobre Nómina) of 2–4% depending on the state.',
      'Mandatory aguinaldo year-end bonus of at least 15 days’ salary, paid by 20 December.',
      'Vacation premium (prima vacacional) of at least 25% of vacation-day pay.',
      'Mandatory profit sharing (PTU) of 10% of pre-tax profits for employers with a Mexican entity, capped per employee.',
    ],
    paidLeaveSummary: 'At least 12 paid vacation days in the first year, rising by two days per year to 20 days, then every five years.',
    contractorModel:
      'Contractors invoice under the RESICO or business-activity regimes and issue CFDI electronic invoices; exports of services can be 0% VAT.',
  },
  {
    slug: 'colombia',
    countryName: 'Colombia',
    isoCode: 'CO',
    currencyCode: 'COP',
    usdToLocalRate: 3900,
    avgDevSalaryUSD: 32000,
    employerTaxRate: 0.165,
    mandatoryBenefitsRate: 0.177,
    complianceRiskScore: 'High',
    complianceRiskSummary:
      'Colombian courts apply “primacy of reality”: any subordinated, continuous service is an employment contract regardless of paperwork. Reclassification brings back-dated social security, prestaciones sociales and a daily late-payment penalty.',
    localTaxNotes: [
      'Employer pension contribution of 12%, ARL occupational-risk insurance (from 0.522%) and Caja de Compensación family fund of 4%.',
      'Health (8.5%), SENA (2%) and ICBF (3%) apply to salaries above 10 monthly minimum wages for corporate taxpayers.',
      'Prima de servicios: one month of salary per year, paid in two instalments (June and December).',
      'Cesantías severance fund: one month of salary per year, plus 12% annual interest on the balance.',
      '“Integral salary” packages (≥13 minimum wages) can bundle benefits, but contributions apply to 70% of pay.',
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
    usdToLocalRate: 26300,
    avgDevSalaryUSD: 24000,
    employerTaxRate: 0.215,
    mandatoryBenefitsRate: 0,
    complianceRiskScore: 'Medium',
    complianceRiskSummary:
      'Foreign companies cannot employ Vietnamese staff directly without a local legal entity or a licensed labour-leasing partner. Unregistered employment and long-running contractor arrangements expose the company to tax and social insurance assessments.',
    localTaxNotes: [
      'Employer social insurance of 17.5% (including occupational accident and disease fund), capped at 20× the statutory base salary.',
      'Employer health insurance of 3% and unemployment insurance of 1% of contribution salary.',
      'A 2% trade union fee on the social insurance salary fund is commonly levied on employers.',
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
    usdToLocalRate: 41.8,
    avgDevSalaryUSD: 40000,
    employerTaxRate: 0.22,
    mandatoryBenefitsRate: 0,
    complianceRiskScore: 'High',
    complianceRiskSummary:
      'Martial law brings mobilisation rules, banking and currency controls and business-continuity risk. Most engineers work as FOP private entrepreneurs; arrangements that look like employment can be reclassified.',
    localTaxNotes: [
      'Unified Social Contribution (ESV) of 22% paid by the employer, capped at 20× the minimum monthly wage.',
      'Employer withholds 18% personal income tax and the military levy on employee pay.',
      'Employment contracts must be registered and paid through a Ukrainian entity or an Employer of Record.',
      'Diia.City residents can access a special 5% PIT regime and ESV on the minimum wage for gig specialists.',
    ],
    paidLeaveSummary: '24 calendar days of paid annual leave, plus public holidays (holiday transfers suspended under martial law).',
    contractorModel:
      'FOP “Group 3” single-tax entrepreneurs pay 5% of revenue plus a fixed minimum ESV and invoice foreign clients in USD or EUR.',
  },
] as const satisfies readonly TalentCountry[];

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
    usdToLocalRate: 0.76,
    crossBorderNote:
      'UK businesses do not operate PAYE for workers based and working entirely overseas. IR35 off-payroll rules generally do not apply to non-UK-resident contractors, but local employment law in the worker’s country still does.',
  },
  {
    slug: 'canada',
    countryName: 'Canada',
    nameInSentence: 'Canada',
    isoCode: 'CA',
    currencyCode: 'CAD',
    usdToLocalRate: 1.4,
    crossBorderNote:
      'Canadian companies paying non-residents for services performed outside Canada generally have no Regulation 102 withholding. Keep contracts, invoices and proof of work location to support the expense deduction.',
  },
  {
    slug: 'germany',
    countryName: 'Germany',
    nameInSentence: 'Germany',
    isoCode: 'DE',
    currencyCode: 'EUR',
    usdToLocalRate: 0.86,
    crossBorderNote:
      'German companies face strict “Scheinselbstständigkeit” (false self-employment) scrutiny for contractors in the EU. Reverse-charge VAT applies to B2B services from abroad, and senior remote staff can create a foreign permanent establishment.',
  },
  {
    slug: 'australia',
    countryName: 'Australia',
    nameInSentence: 'Australia',
    isoCode: 'AU',
    currencyCode: 'AUD',
    usdToLocalRate: 1.53,
    crossBorderNote:
      'Australian employers generally have no PAYG withholding or Superannuation Guarantee obligation for non-residents working wholly overseas. Collect invoices (no ABN required) and review GST reverse-charge rules for imported services.',
  },
  {
    slug: 'singapore',
    countryName: 'Singapore',
    nameInSentence: 'Singapore',
    isoCode: 'SG',
    currencyCode: 'SGD',
    usdToLocalRate: 1.3,
    crossBorderNote:
      'Singapore companies do not contribute CPF for foreigners working outside Singapore. Payments to non-residents for services performed abroad are generally outside Singapore withholding tax, but GST reverse charge may apply.',
  },
] as const satisfies readonly CompanyCountry[];

export type TalentSlug = (typeof TALENT_COUNTRIES)[number]['slug'];
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
