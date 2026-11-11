import type { Article } from './types';

export const eorVsContractor: Article = {
  slug: 'employer-of-record-vs-independent-contractor',
  title: 'Employer of Record vs. Independent Contractor: How to Hire Abroad Legally',
  description:
    'Compare hiring an international developer as a contractor or through an Employer of Record: cost, legal risk, benefits and when each model makes sense.',
  category: 'Compliance',
  published: '2026-11-11',
  updated: '2026-11-11',
  countries: ['brazil', 'mexico', 'colombia', 'poland', 'india', 'philippines'],
  blocks: [
    {
      type: 'p',
      text: 'Once you have found the right developer abroad, the next question is how to pay them legally. Unless your company already has a legal entity in their country, there are two main routes: sign them as an **independent contractor**, or employ them through an **Employer of Record (EOR)**. The choice affects your cost, your legal exposure and the experience of the person you hire.',
    },
    { type: 'h2', text: 'What an independent contractor arrangement is' },
    {
      type: 'p',
      text: 'A contractor runs their own business. They invoice you, handle their own taxes and social security, and you pay the invoice. There is no payroll, no employer contributions and no statutory benefits, which makes it the cheapest and fastest option on paper.',
    },
    {
      type: 'p',
      text: 'The catch is that the label on the contract does not decide the relationship. Labour authorities and courts look at how the work actually happens. If the person works full time, only for you, on your schedule and under your direction, many countries will treat them as an employee regardless of what the contract says. See our guide to [contractor misclassification](/blog/contractor-misclassification-risk-abroad) for the warning signs.',
    },
    { type: 'h2', text: 'What an Employer of Record does' },
    {
      type: 'p',
      text: 'An EOR is a company that already has legal entities in the countries it covers. It becomes the legal employer of your hire, signs a compliant local employment contract, runs payroll, withholds income tax, pays employer contributions and provides mandatory benefits. You direct the day-to-day work and pay the EOR a monthly fee plus the employment costs.',
    },
    {
      type: 'table',
      caption: 'How the two models compare.',
      head: ['', 'Independent contractor', 'Employer of Record'],
      rows: [
        ['Legal employer', 'Nobody — business-to-business contract', 'The EOR’s local entity'],
        ['Employer contributions', 'None (contractor pays their own)', 'Paid through the EOR'],
        ['Mandatory benefits', 'None', '13th salary, leave, severance funds as required'],
        ['Typical platform cost', 'Often $0–$50 per month for payment tools', 'Around $599 per employee per month (2026 list prices)'],
        ['Misclassification risk', 'Yes, if the work looks like employment', 'Low — the person is a real employee'],
        ['Best for', 'Projects, part-time and genuinely independent specialists', 'Full-time, long-term team members'],
      ],
    },
    { type: 'h2', text: 'What the difference costs' },
    {
      type: 'p',
      text: 'Take a mid-level developer in Brazil earning $36,000. As a contractor invoicing through their own company, you pay about $36,000 a year. As an employee through an EOR, the true cost is about $54,320 in salary, contributions and benefits, plus $7,188 in EOR fees — $61,508 in total.',
    },
    {
      type: 'p',
      text: 'That $25,000 gap is why contractor arrangements are so common. It is also why authorities in Brazil, Mexico and Colombia look hard at them: much of the gap is social security that the state would otherwise have collected.',
    },
    { type: 'cta', corridor: 'us-to-brazil', label: 'Compare both costs for Brazil' },
    { type: 'h2', text: 'When a contractor is a reasonable choice' },
    {
      type: 'ul',
      items: [
        'The work is a defined project with a clear end date.',
        'The person has other clients, sets their own hours and uses their own tools.',
        'They are already registered as a business (for example a PJ company in Brazil or a sole trader in Poland).',
        'The country has a mature, accepted contractor market. Poland’s B2B model is a good example.',
      ],
    },
    { type: 'h2', text: 'When an EOR is the safer choice' },
    {
      type: 'ul',
      items: [
        'The person will work full time and only for you, for more than a few months.',
        'You set their hours, manage them like the rest of the team and give them a company title.',
        'The country is strict about reclassification. Our calculator rates Brazil, Mexico, Colombia and Ukraine as high compliance risk.',
        'The candidate wants employee protections — paid leave, social security and a local contract are often deal-breakers for senior hires.',
      ],
    },
    {
      type: 'callout',
      title: 'What about opening your own entity?',
      text: 'Setting up a subsidiary makes sense once you plan a sizeable team in one country. It brings local accounting, payroll, tax filings and directors’ duties, so most companies start with an EOR and revisit the decision as headcount grows.',
    },
    { type: 'h2', text: 'A simple decision test' },
    {
      type: 'ol',
      items: [
        'Would this person look like an employee to a neutral observer? If yes, use an EOR or your own entity.',
        'Is the country rated high risk for reclassification? If yes, lean towards an EOR even for borderline cases.',
        'Does the EOR fee exceed 30–40% of the salary? For lower salaries, check whether a well-structured contractor agreement is genuinely appropriate.',
        'Revisit the decision whenever the relationship changes — a three-month project that becomes a permanent role should move to employment.',
      ],
    },
  ],
  sources: [
    { label: 'Deel vs Remote EOR pricing 2026 (Costbench)', url: 'https://costbench.com/compare/deel-vs-remote' },
    { label: 'Remote EOR price change, October 2026 (PricingSaaS)', url: 'https://pricingsaas.com/companies/remote/diffs/2026W43' },
    { label: 'Brazil employer cost worked example', url: 'https://accounts-os.com/br/questions/how-much-does-an-employee-cost-in-brazil' },
  ],
};
