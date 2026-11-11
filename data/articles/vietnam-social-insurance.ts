import type { Article } from './types';

export const vietnamSocialInsurance: Article = {
  slug: 'vietnam-social-insurance-employer-guide-2026',
  title: 'Hiring Developers in Vietnam: Social Insurance, Caps and Legal Options (2026)',
  description:
    'What employers pay in Vietnam in 2026: social, health and unemployment insurance, the July 2026 cap increase, trade union fees and how foreign companies hire.',
  category: 'Country guide',
  published: '2026-11-11',
  updated: '2026-11-11',
  countries: ['vietnam'],
  blocks: [
    {
      type: 'p',
      text: 'Vietnam’s engineering talent pool has grown quickly, and Ho Chi Minh City, Hanoi and Da Nang now host large software teams for overseas clients. Employer contributions are straightforward — four components and no mandatory 13th month — but there is an important legal hurdle: a foreign company cannot simply employ someone in Vietnam without a local presence.',
    },
    { type: 'h2', text: 'Employer contributions' },
    {
      type: 'table',
      caption: 'Employer contributions in Vietnam (2026).',
      head: ['Contribution', 'Employer rate', 'Monthly salary cap'],
      rows: [
        ['Social insurance (retirement, sickness & maternity, occupational accident)', '17.5%', 'VND 50.6 million'],
        ['Health insurance', '3%', 'VND 50.6 million'],
        ['Unemployment insurance', '1%', 'VND 106.2 million (Region I)'],
        ['Trade union fee', '2%', 'VND 50.6 million'],
        ['Total', '23.5%', ''],
      ],
    },
    { type: 'h2', text: 'The July 2026 cap increase' },
    {
      type: 'p',
      text: 'Social and health insurance are capped at 20 times the statutory base salary. From **1 July 2026**, the base salary rose from VND 2.34 million to VND 2.53 million, lifting the cap from VND 46.8 million to **VND 50.6 million a month**. Unemployment insurance has its own cap of 20 times the regional minimum wage — VND 106.2 million a month in Region I, which covers the major cities.',
    },
    {
      type: 'p',
      text: 'The caps matter for developers because tech salaries often sit near or above them. At $20,000 a year (about VND 42.8 million a month) everything is below the cap, so the employer pays the full 23.5%. At $30,000 a year, the salary passes the social insurance cap and the effective rate falls to about **18.8%**.',
    },
    { type: 'h2', text: 'Worked example: $20,000 a year' },
    {
      type: 'table',
      caption: 'A mid-level developer in Vietnam at VND 25,650 per US dollar (November 2026).',
      head: ['Item', 'USD'],
      rows: [
        ['Base salary', '$20,000'],
        ['Employer contributions (23.5%)', '$4,700'],
        ['True employment cost', '$24,700 (+23.5%)'],
      ],
    },
    { type: 'cta', corridor: 'us-to-vietnam', label: 'Calculate a Vietnamese developer’s true cost' },
    { type: 'h2', text: 'The 13th-month Tết bonus' },
    {
      type: 'p',
      text: 'A 13th-month bonus paid before the Lunar New Year (Tết) is so common in Vietnamese tech that many candidates treat it as part of the package. It is not legally required unless your contract or company policy promises it, which is why our calculator does not include it by default. Budget for it if you want competitive offers.',
    },
    { type: 'h2', text: 'Leave and working conditions' },
    {
      type: 'ul',
      items: [
        '12 days of paid annual leave, plus one extra day for every five years of service.',
        '11 public holidays, including several days for Tết.',
        'Employers withhold progressive personal income tax and file regular declarations.',
      ],
    },
    { type: 'h2', text: 'How foreign companies can hire legally' },
    {
      type: 'p',
      text: 'Without a Vietnamese legal entity, a foreign company cannot sign a local employment contract directly. The usual options are an **Employer of Record or licensed labour-leasing partner**, or setting up a local company. Long-running contractor arrangements with individuals who work like employees expose the company to tax and social insurance assessments, so our calculator rates Vietnam as **medium** compliance risk.',
    },
    {
      type: 'callout',
      title: 'Check the effective date',
      text: 'Vietnam updated its Social Insurance Law from 1 July 2025 and the base salary from 1 July 2026. When you budget a full year, check which cap applies to each month.',
    },
  ],
  sources: [
    { label: 'Vietnam raises statutory basic salary from July 2026 (Vietnam Briefing)', url: 'https://www.vietnam-briefing.com/news/vietnam-raises-statutory-basic-salary-from-july-2026-implications-for-employers.html' },
    { label: 'SHUI contributions in Vietnam (Cake)', url: 'https://www.cake.me/resources/recruitment/shui-vietnam' },
    { label: 'Vietnam payroll, benefits and tax 2026 (Second Talent)', url: 'https://www.secondtalent.com/resources/vietnam-payroll-benefits-tax/' },
  ],
};
