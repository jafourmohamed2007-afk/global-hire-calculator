import type { Article } from './types';

export const brazilCltCost: Article = {
  slug: 'cost-of-hiring-a-developer-in-brazil',
  title: 'The Real Cost of Hiring a Developer in Brazil in 2026 (CLT Explained)',
  description:
    'Brazil employer costs explained: INSS, RAT, third-party contributions, FGTS, the 13th salary and vacation bonus, and why total cost is about 51% above salary.',
  category: 'Country guide',
  published: '2026-11-11',
  updated: '2026-11-11',
  countries: ['brazil'],
  blocks: [
    {
      type: 'p',
      text: 'Brazil has one of the largest developer markets in Latin America and a time zone that suits North American teams. It also has a strongly protective and relatively expensive employment system. If you hire an employee under Brazil’s labour code, the CLT, expect the true cost to be roughly **51% above the salary**.',
    },
    { type: 'h2', text: 'Employer contributions' },
    {
      type: 'table',
      caption: 'Main employer contributions on gross pay in Brazil (2026).',
      head: ['Contribution', 'Rate', 'Notes'],
      rows: [
        ['INSS employer social security', '20%', 'No salary ceiling for the employer share'],
        ['RAT/SAT work-accident insurance', '1–3%', 'Depends on risk class, adjusted by the FAP factor; 2% used in our calculator'],
        ['Third-party contributions (Terceiros)', '≈3.3–5.8%', 'Sistema S, INCRA, salário-educação; 5.8% used in our calculator'],
        ['FGTS severance fund', '8%', 'Deposited monthly into the employee’s FGTS account'],
        ['Total', '≈35.8%', 'Before the 13th salary and vacation bonus'],
      ],
    },
    {
      type: 'p',
      text: 'Companies under Brazil’s payroll-tax relief regime (CPRB) pay differently, but that relief is being phased out through 2028, so most foreign employers and EORs should budget with the standard rates.',
    },
    { type: 'h2', text: 'The 13th salary and vacation bonus' },
    {
      type: 'p',
      text: 'Every CLT employee receives a **13th salary** — one extra month of pay each year, paid in two instalments: the first by 30 November and the second by 20 December. They also receive 30 calendar days of paid vacation with a constitutional **one-third bonus** on top of vacation pay. Together these add about 11.1% to the annual base salary.',
    },
    {
      type: 'p',
      text: 'Importantly, INSS and FGTS are also charged on the 13th salary and the vacation bonus. That is why the total employer contribution comes to about 39.8% of base salary rather than 35.8%.',
    },
    { type: 'h2', text: 'Worked example: $36,000 a year' },
    {
      type: 'table',
      caption: 'Annual cost of a mid-level developer in Brazil (2026).',
      head: ['Item', 'USD'],
      rows: [
        ['Base salary (12 months)', '$36,000'],
        ['13th salary + one-third vacation bonus', '$4,000'],
        ['Employer contributions (35.8% of $40,000)', '$14,320'],
        ['True employment cost', '$54,320 (+50.9%)'],
        ['With an EOR fee of $599/month', '$61,508'],
      ],
    },
    { type: 'cta', corridor: 'us-to-brazil', label: 'Calculate your own Brazil salary' },
    { type: 'h2', text: 'Benefits developers expect' },
    {
      type: 'p',
      text: 'Beyond the statutory minimum, meal or food vouchers (VR/VA) and private health insurance are common in tech. The transportation voucher (vale-transporte) is statutory for commuting employees, though it matters less for fully remote roles. Budget for these when you compare offers.',
    },
    { type: 'h2', text: 'Ending employment' },
    {
      type: 'p',
      text: 'If you dismiss a CLT employee without cause, you pay a penalty of 40% of the balance in their FGTS account, plus notice of 30 days and 3 additional days per year of service. Factor this into your planning, especially for roles you may restructure.',
    },
    { type: 'h2', text: 'What about PJ contractors?' },
    {
      type: 'p',
      text: 'Many Brazilian developers invoice through their own company — a “PJ” — often under the Simples Nacional regime or as an MEI. It is much cheaper, but when a PJ works like an employee, labour courts frequently reclassify the relationship (known as pejotização) and order back-payment of the benefits and contributions listed above. Read our [misclassification guide](/blog/contractor-misclassification-risk-abroad) before choosing this route for a full-time role.',
    },
    { type: 'h2', text: 'Key takeaways' },
    {
      type: 'ul',
      items: [
        'Budget about 1.51 times the base salary for a CLT employee, before EOR fees.',
        'Contributions apply to the 13th salary and vacation bonus as well as monthly pay.',
        'Brazil is rated high risk for contractor reclassification.',
        'Exchange rates move: the real traded around 5.51 per US dollar in November 2026.',
      ],
    },
  ],
  sources: [
    { label: 'Brazil payroll guide (RemotePass)', url: 'https://www.remotepass.com/country/brazil/payroll' },
    { label: 'How much does an employee cost in Brazil in 2026? (Accounts-OS)', url: 'https://accounts-os.com/br/questions/how-much-does-an-employee-cost-in-brazil' },
    { label: 'Brazilian real exchange rate (Trading Economics)', url: 'https://tradingeconomics.com/brazil/currency' },
  ],
};
