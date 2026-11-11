import type { Article } from './types';

export const indiaLabourCodes: Article = {
  slug: 'india-labour-codes-guide-for-foreign-employers',
  title: 'India’s New Labour Codes: What Foreign Companies Hiring Developers Need to Know',
  description:
    'How India’s Labour Codes change developer pay: the 50% basic-wage rule, Provident Fund at 12%, gratuity, and what a mid-level hire really costs in 2026.',
  category: 'Country guide',
  published: '2026-11-11',
  updated: '2026-11-11',
  countries: ['india'],
  blocks: [
    {
      type: 'p',
      text: 'India’s four Labour Codes — on wages, industrial relations, social security and occupational safety — came into force on **21 November 2025**, replacing 29 older labour laws. For companies hiring Indian developers, the most important change is a new definition of “wages” that pushes up the base on which Provident Fund and gratuity are calculated.',
    },
    { type: 'h2', text: 'The 50% wage rule' },
    {
      type: 'p',
      text: 'Indian salary packages have traditionally been split into a small basic salary and many allowances. Because Provident Fund and gratuity are calculated on basic wages, a low basic kept those costs down. Under the Codes, allowances above 50% of total pay are added back into “wages”. In practice, basic pay plus dearness allowance should now be at least half of the package.',
    },
    { type: 'h2', text: 'Employer contributions' },
    {
      type: 'table',
      caption: 'Employer contributions for a salaried developer in India (2026).',
      head: ['Contribution', 'Rate', 'Base'],
      rows: [
        ['Provident Fund + Pension Scheme (EPF/EPS)', '12%', 'Basic wages; the pension share is limited to the ₹15,000 wage ceiling'],
        ['EPF administration charges', '0.5%', 'Basic wages'],
        ['EDLI insurance', '0.5%', 'Basic wages up to ₹15,000 a month'],
        ['Employees’ State Insurance (ESI)', '3.25%', 'Only for employees earning up to ₹21,000 a month — rarely developers'],
      ],
    },
    {
      type: 'p',
      text: 'Employers may legally limit Provident Fund to the ₹15,000 monthly wage ceiling, which caps the employer’s 12% at ₹1,800 a month. Many technology employers contribute on the full basic salary instead, because candidates value the retirement savings. Our calculator uses the full basic salary, which is the more conservative budget.',
    },
    { type: 'h2', text: 'Gratuity' },
    {
      type: 'p',
      text: 'Gratuity is a lump sum paid when employment ends: 15 days of the last basic wage for each completed year of service, using a 26-working-day month. That works out to about **4.81% of basic wages per year**, or roughly 2.4% of total pay when basic is half the package. Gratuity normally requires five years of continuous service, but the Codes make fixed-term employees eligible after one year.',
    },
    { type: 'h2', text: 'Worked example: $18,000 a year' },
    {
      type: 'table',
      caption: 'A mid-level developer in India at ₹93.6 per US dollar (November 2026).',
      head: ['Item', 'INR', 'USD'],
      rows: [
        ['Gross salary', '₹1,684,800', '$18,000'],
        ['Basic wages (50%)', '₹842,400', '$9,000'],
        ['Employer PF (12%) + admin (0.5%) + EDLI', '₹106,200', '$1,135'],
        ['Gratuity accrual (4.81% of basic)', '₹40,519', '$433'],
        ['True employment cost', '₹1,831,519', '$19,568 (+8.7%)'],
      ],
    },
    {
      type: 'p',
      text: 'If the employer limited Provident Fund to the ₹15,000 ceiling, PF-related costs would fall from ₹106,200 to about ₹23,400 a year. Either way, India remains one of the least expensive markets in employer contributions — the bigger cost item for a foreign company is usually the Employer of Record fee, which can add around 40% to an $18,000 salary.',
    },
    { type: 'cta', corridor: 'us-to-india', label: 'Calculate an Indian developer’s true cost' },
    { type: 'h2', text: 'Other obligations' },
    {
      type: 'ul',
      items: [
        'Employers must withhold income tax (TDS) monthly and issue Form 16.',
        'Professional Tax and Labour Welfare Fund contributions depend on the state.',
        'Earned leave is typically 12–21 days per year under state Shops & Establishments Acts, plus national and festival holidays.',
      ],
    },
    { type: 'h2', text: 'Contractors and permanent establishment' },
    {
      type: 'p',
      text: 'Many Indian developers work as independent contractors and charge GST at 18% where registered; exports of services can be zero-rated. The two risks for foreign companies are reclassification of long-term, exclusive contractors as employees, and **permanent establishment** — a senior person who negotiates or signs contracts for your company in India could create a taxable presence there.',
    },
  ],
  sources: [
    { label: 'New Wage Code India 2026 (Kredily)', url: 'https://kredily.com/new-wage-code-india-2026-payroll-impact/' },
    { label: 'India’s new labour codes expand gratuity rules (Fisher Phillips)', url: 'https://www.fisherphillips.com/en/insights/insights/indias-new-labor-codes-expand-gratuity-payment-rules' },
    { label: 'Labour codes implemented (Mondaq)', url: 'https://www.mondaq.com/india/employee-rights-labour-relations/1716104/labour-codes-implemented-a-landmark-reform' },
  ],
};
