import type { Article } from './types';

export const philippinesContributions: Article = {
  slug: 'philippines-13th-month-pay-sss-philhealth-pag-ibig',
  title: 'Hiring in the Philippines: 13th-Month Pay, SSS, PhilHealth and Pag-IBIG Explained',
  description:
    'A plain-English guide to Philippine employer contributions in 2026: SSS, PhilHealth and Pag-IBIG caps, 13th-month pay, leave and regularization rules.',
  category: 'Country guide',
  published: '2026-11-11',
  updated: '2026-11-11',
  countries: ['philippines'],
  blocks: [
    {
      type: 'p',
      text: 'The Philippines is a popular destination for remote hiring, helped by widespread English and working hours that can overlap with both the US and Australia. Employer contributions are modest because each government scheme has a salary cap. The larger statutory cost is the **13th-month pay**.',
    },
    { type: 'h2', text: 'The three government contributions' },
    {
      type: 'table',
      caption: 'Employer contributions in the Philippines (2026).',
      head: ['Scheme', 'Employer share', 'Cap', 'Maximum per month'],
      rows: [
        ['SSS (social security)', '10% of monthly salary credit', '₱35,000 salary credit', '₱3,500'],
        ['SSS Employees’ Compensation', 'Fixed', '—', '₱30'],
        ['PhilHealth (health insurance)', '2.5% (half of the 5% premium)', '₱100,000 monthly salary', '₱2,500'],
        ['Pag-IBIG (housing fund)', '2%', '₱10,000 monthly compensation', '₱200'],
      ],
    },
    {
      type: 'p',
      text: 'Because of these caps, the employer’s share shrinks as a percentage when salaries rise. For a developer earning ₱84,080 a month, the employer pays about ₱5,832 a month — roughly 6.9% of salary.',
    },
    { type: 'h2', text: '13th-month pay' },
    {
      type: 'p',
      text: 'Rank-and-file employees are entitled to 13th-month pay equal to one-twelfth of their basic salary earned during the year, paid no later than **24 December**. It is not a discretionary bonus: if you employ someone for part of a year, they receive a pro-rated amount. Developers who are not managers are generally rank-and-file employees, so budget for it.',
    },
    { type: 'h2', text: 'Worked example: $16,000 a year' },
    {
      type: 'table',
      caption: 'A mid-level developer in the Philippines at ₱63.06 per US dollar (November 2026).',
      head: ['Item', 'PHP per year', 'USD'],
      rows: [
        ['Gross salary', '₱1,008,960', '$16,000'],
        ['SSS + Employees’ Compensation', '₱42,360', '$672'],
        ['PhilHealth', '₱25,224', '$400'],
        ['Pag-IBIG', '₱2,400', '$38'],
        ['13th-month pay', '₱84,080', '$1,333'],
        ['True employment cost', '₱1,163,024', '$18,443 (+15.3%)'],
      ],
    },
    { type: 'cta', corridor: 'us-to-philippines', label: 'Calculate a Philippine developer’s true cost' },
    { type: 'h2', text: 'Leave and benefits' },
    {
      type: 'ul',
      items: [
        'The legal minimum is 5 days of Service Incentive Leave after one year of service.',
        'Many tech employers offer more paid leave than the legal minimum.',
        'Private HMO health coverage is not mandatory, but it is commonly offered by tech employers.',
      ],
    },
    { type: 'h2', text: 'Regularization: the rule that surprises foreign employers' },
    {
      type: 'p',
      text: 'Probation in the Philippines can last up to six months. After that, an employee becomes “regular” and can only be dismissed for just or authorized causes, following due process. The same logic can apply to long-term contractors who do core, controlled work: they may be found to be regular employees, owed 13th-month pay and government contributions for the whole period.',
    },
    {
      type: 'p',
      text: 'Genuine freelancers register with the Bureau of Internal Revenue as self-employed, pay graduated or 8% flat income tax, and issue official receipts or invoices.',
    },
  ],
  sources: [
    { label: 'SSS, PhilHealth and Pag-IBIG tables 2026 (KAMI Workforce)', url: 'https://kamiworkforce.com/ph/blog/sss-philhealth-pagibig-contribution-tables-2026/' },
    { label: 'Philippines payroll, benefits and tax 2026 (Second Talent)', url: 'https://www.secondtalent.com/resources/philippines-payroll-benefits-tax/' },
    { label: 'USD to PHP reference rate', url: 'https://taxcalculator.com.ph/exchange-rates/usd-to-php' },
  ],
};
