import type { Article } from './types';

export const misclassificationRisk: Article = {
  slug: 'contractor-misclassification-risk-abroad',
  title: 'Contractor Misclassification Abroad: Warning Signs and What It Can Cost',
  description:
    'How labour authorities decide whether an international contractor is really an employee, the warning signs to watch for, and the back-pay exposure by country.',
  category: 'Compliance',
  published: '2026-11-11',
  updated: '2026-11-11',
  countries: ['brazil', 'mexico', 'colombia', 'philippines', 'india', 'poland', 'ukraine', 'vietnam'],
  blocks: [
    {
      type: 'p',
      text: 'Hiring developers abroad as contractors is fast and inexpensive, which is exactly why it attracts scrutiny. When a “contractor” is really working like an employee, the company can be ordered to pay the employer contributions and benefits it skipped — often for every year of the relationship, with interest and fines on top.',
    },
    { type: 'h2', text: 'How authorities decide' },
    {
      type: 'p',
      text: 'The tests differ by country, but they ask similar questions. Courts look at the reality of the relationship rather than the contract title. Colombia even has a name for it: the principle of “primacy of reality”.',
    },
    {
      type: 'ul',
      items: [
        '**Control:** do you decide how, when and where the work is done?',
        '**Integration:** is the person part of your team, with a company email, title and manager?',
        '**Exclusivity and dependence:** do they work only for you and depend on you for most of their income?',
        '**Duration:** is the engagement open-ended rather than tied to a project?',
        '**Business risk:** do they invoice for results and bear their own costs, or are they paid a fixed monthly amount regardless?',
      ],
    },
    { type: 'h2', text: 'Warning signs in your own setup' },
    {
      type: 'ol',
      items: [
        'A fixed monthly “invoice” that never changes.',
        'Required working hours, daily stand-ups and approval for time off.',
        'Paid holidays or a 13th payment informally added to the invoice.',
        'Equipment, software licences and a company email provided by you.',
        'The contractor appears on your org chart and website as a team member.',
        'The engagement has run for more than a year with no defined deliverables.',
      ],
    },
    { type: 'h2', text: 'Country spotlights' },
    { type: 'h3', text: 'Brazil' },
    {
      type: 'p',
      text: 'Arrangements where an employee is hired through their own company (a “PJ”) are known as pejotização. Labour courts regularly reclassify them, ordering back-payment of FGTS, the 13th salary and vacation bonus. At a mid-level salary of $36,000, employer contributions and mandatory benefits come to about **$18,320 a year**.',
    },
    { type: 'h3', text: 'Mexico' },
    {
      type: 'p',
      text: 'The 2021 outsourcing reform bans subcontracting personnel except for registered specialised services (REPSE). Disguised employment can lead to IMSS assessments, mandatory profit sharing (PTU) and constitutional severance. At $38,000, the annual exposure for contributions and benefits is about **$11,700**.',
    },
    { type: 'h3', text: 'Colombia' },
    {
      type: 'p',
      text: 'Any subordinated, continuous service can be treated as an employment contract. Reclassification brings back-dated social security and prestaciones sociales — prima, cesantías and interest — plus a daily late-payment penalty. At $32,000, contributions and benefits come to about **$10,940 a year**.',
    },
    { type: 'h3', text: 'Philippines' },
    {
      type: 'p',
      text: 'Employees become “regular” after a probation of up to six months and gain strong security of tenure. Long-term contractors doing core work can be found to be regular employees, owed 13th-month pay and government contributions.',
    },
    { type: 'h3', text: 'Poland and India' },
    {
      type: 'p',
      text: 'Poland has a mature and widely accepted B2B contractor market, so risk is lower, but contracts that mirror employment — fixed hours, subordination, no business risk — can still be challenged. In India, long-term exclusive contractors risk being re-characterised as employees, and a senior person acting for the company can create permanent establishment (PE) tax exposure.',
    },
    {
      type: 'table',
      caption: 'Annual employer contributions and mandatory benefits at a mid-level salary — the core of a back-pay claim (2026).',
      head: ['Country', 'Mid-level salary', 'Annual exposure', 'Risk rating'],
      rows: [
        ['Brazil', '$36,000', '$18,320', 'High'],
        ['Mexico', '$38,000', '$11,703', 'High'],
        ['Colombia', '$32,000', '$10,940', 'High'],
        ['Poland', '$46,000', '$9,421', 'Low'],
        ['Ukraine', '$36,000', '$7,920', 'High'],
        ['Vietnam', '$20,000', '$4,700', 'Medium'],
        ['Philippines', '$16,000', '$2,443', 'Medium'],
        ['India', '$18,000', '$1,568', 'Medium'],
      ],
    },
    {
      type: 'p',
      text: 'These figures exclude fines, interest, legal costs and severance, which can exceed the contributions themselves.',
    },
    { type: 'h2', text: 'How to reduce the risk' },
    {
      type: 'ul',
      items: [
        'Use contractors for genuine projects with deliverables, not for permanent roles.',
        'Let contractors control their own schedule, methods and tools, and allow other clients.',
        'Move long-term, full-time people to employment through an Employer of Record or your own entity.',
        'Review every contractor relationship at least once a year — relationships drift towards employment over time.',
        'Get local legal advice in high-risk countries before you sign.',
      ],
    },
    { type: 'cta', corridor: 'us-to-mexico', label: 'Check the exposure for your salary' },
  ],
  sources: [
    { label: 'Mexico employer costs (Deel)', url: 'https://www.deel.com/blog/employer-costs-for-an-employee-in-mexico/' },
    { label: 'Brazil payroll guide (RemotePass)', url: 'https://www.remotepass.com/country/brazil/payroll' },
    { label: 'Colombia parafiscales 2026 (Buk)', url: 'https://www.buk.co/blog/aportes-parafiscales-con-salario-minimo-2026-en-colombia' },
  ],
};
