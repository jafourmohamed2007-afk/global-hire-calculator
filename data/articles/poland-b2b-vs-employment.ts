import type { Article } from './types';

export const polandB2bVsEmployment: Article = {
  slug: 'poland-b2b-vs-employment-contract',
  title: 'Poland B2B vs. Employment Contract: A Guide for Foreign Companies Hiring Developers',
  description:
    'Compare B2B contracts and employment contracts (umowa o pracę) in Poland: ZUS rates, the 2026 contribution cap, PPK, leave and misclassification risk.',
  category: 'Country guide',
  published: '2026-11-11',
  updated: '2026-11-11',
  countries: ['poland'],
  blocks: [
    {
      type: 'p',
      text: 'Poland has a large and experienced software engineering market. It is also unusual in how many senior developers work on **B2B contracts** as self-employed sole traders rather than as employees. Understanding both models helps you make an offer that is competitive and compliant.',
    },
    { type: 'h2', text: 'Employment contract (umowa o pracę)' },
    {
      type: 'p',
      text: 'An employee on an employment contract gets full social security, paid leave and the protections of the Polish Labour Code. The employer pays social security contributions to ZUS on top of gross salary.',
    },
    {
      type: 'table',
      caption: 'Employer ZUS contributions in Poland (2026).',
      head: ['Contribution', 'Employer rate', 'Cap'],
      rows: [
        ['Pension insurance (emerytalne)', '9.76%', 'Annual pay up to PLN 282,600'],
        ['Disability insurance (rentowe)', '6.50%', 'Annual pay up to PLN 282,600'],
        ['Accident insurance', '0.67–3.33% (1.67% typical)', 'None'],
        ['Labour Fund + Solidarity Fund', '2.45%', 'None'],
        ['Guaranteed Employee Benefits Fund (FGŚP)', '0.10%', 'None'],
        ['Total', '20.48%', ''],
      ],
    },
    {
      type: 'p',
      text: 'The annual cap of PLN 282,600 is 30 times the projected average monthly wage. Above it, pension and disability contributions stop for the rest of the year, which lowers the effective rate for senior developers. On a $100,000 salary, employer contributions come to about 15.9% instead of 20.48%.',
    },
    {
      type: 'p',
      text: 'Employees are also auto-enrolled into Employee Capital Plans (PPK), where the employer contributes 1.5% of pay unless the employee opts out. Paid leave is 20 days a year, rising to 26 days after 10 years of seniority, and years of education count towards seniority.',
    },
    { type: 'h2', text: 'B2B contract' },
    {
      type: 'p',
      text: 'On a B2B contract, the developer runs a sole-trader business (JDG), invoices you monthly and pays their own social security and taxes. Many choose the 19% flat income tax or the IP Box regime for qualifying software income. Invoices carry 23% VAT, which is reverse-charged for foreign business clients.',
    },
    {
      type: 'p',
      text: 'B2B invoice rates are usually set higher than an equivalent salary, because the developer pays their own contributions and is not paid for holidays. Compare a B2B quote with the full employment cost below, not with the gross salary alone.',
    },
    { type: 'h2', text: 'Cost comparison: $46,000 salary' },
    {
      type: 'table',
      caption: 'Mid-level developer in Poland at PLN 3.93 per US dollar (November 2026).',
      head: ['Model', 'Annual cost (USD)'],
      rows: [
        ['Employment contract: salary', '$46,000'],
        ['Employment contract: employer ZUS (20.48%)', '$9,421'],
        ['Employment contract: total', '$55,421'],
        ['Employment through an EOR ($599/month)', '$62,609'],
        ['B2B contract', 'The negotiated invoice amount — no employer contributions'],
      ],
    },
    { type: 'cta', corridor: 'us-to-poland', label: 'Calculate a Polish developer’s true cost' },
    { type: 'h2', text: 'Is B2B safe for a foreign company?' },
    {
      type: 'p',
      text: 'Poland’s B2B market is mature and widely accepted, which is why our calculator rates Poland as low compliance risk. The risk rises when a B2B contract looks like employment: fixed working hours, subordination to a manager, paid leave written into the contract and no business risk for the contractor. Keep B2B relationships outcome-based, and consider an employment contract for people who will be fully integrated into your team.',
    },
    {
      type: 'callout',
      title: 'Watch your own country’s rules',
      text: 'Some employers face their own home-country rules on contractors. German companies, for example, are strict about false self-employment (Scheinselbstständigkeit) for contractors in the EU.',
    },
  ],
  sources: [
    { label: 'Social security costs in Poland 2026 (getsix)', url: 'https://getsix.eu/human-resources-payroll-in-poland/social-security-costs-in-poland-and-germany-2026/' },
    { label: 'Poland tax and payroll (Teamed)', url: 'https://www.teamed.global/country-hiring-guides/poland/tax-and-payroll' },
    { label: 'IT salaries in Poland 2026, B2B vs employment (b2b-vs-uop.pl)', url: 'https://b2b-vs-uop.pl/en/blog/it-salaries-poland-2026/' },
  ],
};
