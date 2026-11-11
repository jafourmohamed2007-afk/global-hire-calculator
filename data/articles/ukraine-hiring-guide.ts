import type { Article } from './types';

export const ukraineHiringGuide: Article = {
  slug: 'hiring-developers-in-ukraine-esv-fop-2026',
  title: 'Hiring Developers in Ukraine in 2026: ESV, FOP Contractors and Martial-Law Risks',
  description:
    'Employer costs for hiring Ukrainian developers in 2026: the 22% ESV and its cap, the 5% military levy, FOP contractors and business-continuity risks.',
  category: 'Country guide',
  published: '2026-11-11',
  updated: '2026-11-11',
  countries: ['ukraine'],
  blocks: [
    {
      type: 'p',
      text: 'Ukraine has a large software development and outsourcing industry that has continued to serve international clients during the war. Employer contributions are simple — a single social contribution — but most developers work as private entrepreneurs rather than employees, and martial law adds risks that every foreign company should plan for.',
    },
    { type: 'h2', text: 'Employer contribution: ESV' },
    {
      type: 'p',
      text: 'Employers pay a **Unified Social Contribution (ESV) of 22%** on gross salary. It is capped at 20 times the minimum wage. With the 2026 minimum wage of UAH 8,647 a month, the cap is **UAH 172,940 a month** (the maximum ESV is about UAH 38,047 a month). Most payroll sources agree on the 20× cap, though at least one cites 15×, so confirm the current figure with your payroll provider.',
    },
    {
      type: 'table',
      caption: 'Employer ESV at different salaries (UAH 45.32 per US dollar, November 2026).',
      head: ['Annual salary', 'Employer ESV', 'Effective rate'],
      rows: [
        ['$36,000 (below the cap)', '$7,920', '22.0%'],
        ['$50,000 (above the cap)', '$10,074', '20.1%'],
      ],
    },
    { type: 'h2', text: 'What employees pay' },
    {
      type: 'p',
      text: 'The employer withholds **18% personal income tax** and the **5% military levy** from the employee’s gross salary. The military levy rose from 1.5% to 5% under Law 4015-IX. These are deducted from pay rather than added to your cost, but they affect the net salary a candidate will compare offers against.',
    },
    { type: 'h2', text: 'Worked example: $36,000 a year' },
    {
      type: 'table',
      caption: 'A mid-level developer employed in Ukraine (2026).',
      head: ['Item', 'USD'],
      rows: [
        ['Base salary', '$36,000'],
        ['Employer ESV (22%)', '$7,920'],
        ['True employment cost', '$43,920 (+22%)'],
      ],
    },
    { type: 'cta', corridor: 'us-to-ukraine', label: 'Calculate a Ukrainian developer’s true cost' },
    { type: 'h2', text: 'FOP contractors: the common model' },
    {
      type: 'p',
      text: 'Most Ukrainian developers work as **FOP** private entrepreneurs in the simplified tax system’s third group. They pay a 5% single tax on revenue plus a fixed minimum ESV — UAH 1,902 a month in 2026 — and invoice foreign clients in US dollars or euros. For the client company, there are no payroll obligations.',
    },
    {
      type: 'p',
      text: 'The FOP model is widely used and legal, but it carries reclassification risk when the relationship looks like employment: fixed hours, subordination, paid leave and a single client. Companies that want employees can use a Ukrainian entity or an Employer of Record. Residents of Diia.City, Ukraine’s special regime for tech companies, can also use dedicated gig contracts with their own tax rules.',
    },
    { type: 'h2', text: 'Martial-law risks to plan for' },
    {
      type: 'ul',
      items: [
        '**Mobilisation:** male employees of conscription age may be called up. Some employers can apply to reserve critical staff, subject to official criteria.',
        '**Business continuity:** power outages and connectivity disruptions can happen, so teams may need backup power and flexible schedules.',
        '**Banking and currency controls:** cross-border payments work, but rules can change at short notice.',
        '**Leave and holidays:** employees are entitled to 24 calendar days of paid annual leave, and under martial law public holidays are normal working days unless the employer decides otherwise.',
      ],
    },
    {
      type: 'p',
      text: 'For these reasons, our calculator rates Ukraine as **high** compliance risk — not because the rules are unusually strict, but because the operating environment can change quickly.',
    },
  ],
  sources: [
    { label: 'New tax rates as of 1 January 2026 (SUP)', url: 'https://sup.org.ua/en/news/new-tax-rates-as-of-january-1-2026/' },
    { label: 'Ukraine’s minimum wage in 2026 (Fair.org.ua)', url: 'https://www.fair.org.ua/en/minimalna-zarplata-2026-rozmir-zminy-ta-realnyj-vplyv/' },
    { label: 'NBU official exchange rate, 9 November 2026 (UNN)', url: 'https://unn.ua/en/news/exchange-rates-for-november-9-the-nbu-sharply-crashed-the-euro' },
  ],
};
