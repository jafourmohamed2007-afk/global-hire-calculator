import type { Article } from './types';

export const mexicoPayrollCosts: Article = {
  slug: 'mexico-payroll-costs-imss-infonavit-2026',
  title: 'Mexico Payroll Costs in 2026: IMSS, INFONAVIT and the Rising CEAV Rate',
  description:
    'What it costs to employ a developer in Mexico in 2026: IMSS branches, INFONAVIT, the CEAV pension increase to 2030, state payroll tax, aguinaldo and PTU.',
  category: 'Country guide',
  published: '2026-11-11',
  updated: '2026-11-11',
  countries: ['mexico'],
  blocks: [
    {
      type: 'p',
      text: 'Mexico shares time zones with the United States, has a deep pool of engineers and a well-developed nearshoring industry. Its payroll system is more complex than most: employer contributions are split across several social security branches, many are capped, and one of them rises every year until 2030. For a mid-level developer, employer contributions come to about **25.9% of base salary** in 2026.',
    },
    { type: 'h2', text: 'The building blocks: SBC and UMA' },
    {
      type: 'p',
      text: 'Contributions are charged on the **integrated daily salary (SBC)**, which includes not just base pay but also the aguinaldo and vacation premium. Most contributions are capped at **25 UMA per day**. The UMA (Unidad de Medida y Actualización) is a reference value published by INEGI; in 2026 it is MXN 117.31 per day, so the cap is about MXN 1.07 million a year.',
    },
    { type: 'h2', text: 'Employer contributions in 2026' },
    {
      type: 'table',
      caption: 'Main employer contributions for a developer earning above 4 UMA per day (2026).',
      head: ['Contribution', 'Employer rate'],
      rows: [
        ['IMSS sickness & maternity — fixed fee', '20.40% of one UMA per day'],
        ['IMSS sickness & maternity — surplus above 3 UMA', '1.10%'],
        ['IMSS cash benefits', '0.70%'],
        ['IMSS pensioners’ medical expenses', '1.05%'],
        ['IMSS disability & life', '1.75%'],
        ['IMSS childcare & social benefits', '1.00%'],
        ['IMSS work-risk premium (office work, class I)', '≈0.54%'],
        ['Retirement (SAR)', '2.00%'],
        ['Severance & old age (CEAV)', '7.513%'],
        ['INFONAVIT housing fund', '5.00%'],
        ['State payroll tax (ISN)', '1–4% depending on the state'],
      ],
    },
    { type: 'h2', text: 'Why CEAV keeps rising' },
    {
      type: 'p',
      text: 'The 2020 pension reform increases the employer’s severance and old-age (CEAV) contribution every year. For salaries above 4.01 UMA per day, the rate is 7.513% in 2026 and reaches **11.875% in 2030**. Lower salary bands rise more slowly. If you are budgeting a multi-year team, expect Mexico’s employer cost to climb by about one percentage point a year.',
    },
    { type: 'h2', text: 'Mandatory benefits' },
    {
      type: 'ul',
      items: [
        '**Aguinaldo:** a year-end bonus of at least 15 days’ salary, paid by 20 December.',
        '**Vacation:** at least 12 paid days in the first year, rising by two days a year to 20 days, then by two days every five years.',
        '**Vacation premium (prima vacacional):** at least 25% of vacation-day pay.',
        '**Profit sharing (PTU):** employers with a Mexican entity share 10% of pre-tax profits with employees, capped per employee.',
      ],
    },
    { type: 'h2', text: 'Worked example: $38,000 a year' },
    {
      type: 'table',
      caption: 'A mid-level developer in Mexico at MXN 18.50 per US dollar (November 2026).',
      head: ['Item', 'USD'],
      rows: [
        ['Base salary', '$38,000'],
        ['Aguinaldo + vacation premium', '$1,874'],
        ['Employer contributions (≈25.9%)', '$9,829'],
        ['True employment cost', '$49,703 (+30.8%)'],
      ],
    },
    { type: 'cta', corridor: 'us-to-mexico', label: 'Calculate a Mexican developer’s true cost' },
    { type: 'h2', text: 'The outsourcing reform and contractors' },
    {
      type: 'p',
      text: 'Since 2021, Mexico bans subcontracting personnel except for specialised services registered with the labour ministry (REPSE). Disguised employment — a full-time “contractor” who works like an employee — exposes the company to IMSS assessments, PTU and constitutional severance. Genuine contractors invoice under the RESICO or business-activity tax regimes with CFDI electronic invoices, and exports of services can be zero-rated for VAT.',
    },
    {
      type: 'callout',
      title: 'Budgeting tip',
      text: 'State payroll tax varies between states, and the work-risk premium depends on your company’s risk class. Ask your EOR or payroll provider for the exact figures for your hire’s state.',
    },
  ],
  sources: [
    { label: 'UMA 2026 values (INEGI)', url: 'https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2026/uma/uma2026.pdf' },
    { label: 'Employer costs for an employee in Mexico (Deel)', url: 'https://www.deel.com/blog/employer-costs-for-an-employee-in-mexico/' },
    { label: 'Mexico labor cost calculator 2026 (Start-ops)', url: 'https://start-ops.com.mx/tools/mexico-labor-cost-calculator.html' },
  ],
};
