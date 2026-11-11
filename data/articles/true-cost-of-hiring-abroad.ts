import type { Article } from './types';

export const trueCostOfHiringAbroad: Article = {
  slug: 'true-cost-of-hiring-a-remote-developer-abroad',
  title: 'How to Calculate the True Cost of Hiring a Remote Developer Abroad (2026)',
  description:
    'A step-by-step method to budget an international hire: salary, employer taxes, mandatory benefits, contribution caps, EOR fees and currency risk.',
  category: 'Budgeting',
  published: '2026-11-11',
  updated: '2026-11-11',
  countries: ['india', 'brazil', 'poland', 'philippines', 'mexico', 'colombia', 'vietnam', 'ukraine'],
  blocks: [
    {
      type: 'p',
      text: 'When a founder compares a developer in São Paulo with one in Kraków or Manila, the first number on the table is usually the salary. It is also the number most likely to mislead. Depending on the country, the real annual cost of an employee can be anywhere from about 9% to more than 50% higher than the salary you agree on — before you pay a single platform fee.',
    },
    {
      type: 'p',
      text: 'This guide walks through the five layers that make up the true cost of an international hire, using the same 2026 figures that power our [hiring cost calculator](/). Work through them in order and you will have a budget you can defend to your finance team.',
    },
    { type: 'h2', text: 'Layer 1: the local gross salary' },
    {
      type: 'p',
      text: 'Start with the gross annual salary in the candidate’s country, not a converted US salary. Salary surveys for software developers disagree widely, so use a range rather than a single average. For a mid-level developer in 2026, typical ranges are roughly $12,000–$22,000 in India, $10,000–$22,000 in the Philippines, $31,000–$42,000 in Brazil and $38,000–$58,000 in Poland.',
    },
    {
      type: 'p',
      text: 'Agree the salary in the employee’s local currency. Local employment contracts, payslips and statutory contributions are all denominated in local currency, and that is what the employee will judge their pay against.',
    },
    { type: 'h2', text: 'Layer 2: employer social security contributions' },
    {
      type: 'p',
      text: 'Almost every country requires the employer to pay contributions on top of gross salary — pension, health, unemployment, housing funds or payroll taxes. These are paid by the employer and are not deducted from the employee’s pay, so they are a pure addition to your cost.',
    },
    {
      type: 'p',
      text: 'The rates vary enormously. At a mid-level salary, employer contributions are about **6.3% in India** (Provident Fund applies only to basic wages), **20.5% in Poland**, **25.9% in Mexico** and **39.8% in Brazil**, where contributions are also charged on the 13th salary and vacation bonus.',
    },
    { type: 'cost-table' },
    { type: 'h2', text: 'Layer 3: contribution ceilings change the percentage' },
    {
      type: 'p',
      text: 'A common budgeting mistake is to apply one flat percentage to every salary. Many countries cap the salary on which contributions are charged. Above the cap, the employer pays nothing more for that component, so the effective rate falls as pay rises.',
    },
    {
      type: 'ul',
      items: [
        '**Poland:** pension (9.76%) and disability (6.5%) contributions stop once annual pay reaches PLN 282,600 in 2026. A developer on $100,000 costs about 15.9% in employer contributions, not 20.48%.',
        '**Philippines:** SSS is capped at a ₱35,000 monthly salary credit, PhilHealth at ₱100,000 a month and Pag-IBIG at ₱10,000 a month, so the employer share is small for well-paid developers.',
        '**Vietnam:** social and health insurance stop at 20 times the statutory base salary — VND 50.6 million a month since 1 July 2026.',
        '**Ukraine:** the 22% unified social contribution stops at 20 times the minimum wage, UAH 172,940 a month in 2026.',
      ],
    },
    {
      type: 'p',
      text: 'The opposite also happens. In Colombia, health (8.5%), SENA (2%) and ICBF (3%) contributions only apply once salary passes 10 monthly minimum wages, so the rate jumps from about 16.5% to about 30% for senior salaries.',
    },
    { type: 'h2', text: 'Layer 4: mandatory benefits' },
    {
      type: 'p',
      text: 'Some countries require payments that are not called taxes but are just as compulsory. The most common is a 13th-month salary.',
    },
    {
      type: 'ul',
      items: [
        '**Brazil:** a 13th salary plus a one-third bonus on vacation pay — about 11.1% of annual base.',
        '**Philippines:** 13th-month pay of one-twelfth of basic annual salary, due by 24 December.',
        '**Colombia:** prima de servicios (one month), cesantías severance fund (one month) and 12% interest on cesantías — about 17.7%.',
        '**Mexico:** an aguinaldo of at least 15 days’ pay and a 25% vacation premium — about 4.9%.',
        '**India:** gratuity accrues at about 4.81% of basic wages per year of service.',
      ],
    },
    { type: 'h2', text: 'Layer 5: how you employ them' },
    {
      type: 'p',
      text: 'If you do not have a legal entity in the country, you have two realistic options: engage the person as an independent contractor, or use an Employer of Record (EOR) that employs them on your behalf. Major EOR platforms publish list prices of around $599 per employee per month in 2026 — $7,188 a year.',
    },
    {
      type: 'p',
      text: 'That fee matters more for lower salaries. On an $18,000 salary in India it adds about 40% to the base salary; on a $46,000 salary in Poland it adds about 16%. Our article on [EOR vs. contractors](/blog/employer-of-record-vs-independent-contractor) explains when the fee is worth paying.',
    },
    { type: 'h2', text: 'Do not forget currency risk' },
    {
      type: 'p',
      text: 'Because salaries and contributions are paid in local currency, your cost in dollars, pounds or euros moves with the exchange rate. A 5% move in the currency changes your cost by 5%. Budget with a buffer of 3–5% for annual plans, and revisit the rate when you approve annual raises.',
    },
    { type: 'h2', text: 'Worked example: a mid-level developer in Brazil' },
    {
      type: 'table',
      caption: 'Annual cost of a $36,000 developer in Brazil employed through an EOR (2026 rates).',
      head: ['Item', 'Annual cost (USD)'],
      rows: [
        ['Base salary', '$36,000'],
        ['13th salary + vacation bonus', '$4,000'],
        ['INSS, RAT, third-party contributions and FGTS (35.8%, also on the 13th and bonus)', '$14,320'],
        ['True employment cost', '$54,320'],
        ['EOR platform fee ($599 × 12)', '$7,188'],
        ['Total budget', '$61,508'],
      ],
    },
    {
      type: 'p',
      text: 'The total is 1.71 times the salary. A team that budgeted $36,000 would be short by more than $25,000 for this one hire.',
    },
    { type: 'cta', corridor: 'us-to-brazil', label: 'Try this example in the calculator' },
    { type: 'h2', text: 'A quick budgeting checklist' },
    {
      type: 'ol',
      items: [
        'Set the salary as a local-currency range from at least two salary sources.',
        'Add employer contributions using the country’s real rates and ceilings.',
        'Add mandatory benefits such as 13th-month pay.',
        'Choose the employment model and add its fee.',
        'Add a 3–5% currency buffer and a line for equipment and paid holidays cover.',
        'Re-check the figures every January and July, when many ceilings and minimum wages change.',
      ],
    },
  ],
  sources: [
    { label: 'Poland ZUS contribution rates 2026 (getsix)', url: 'https://getsix.eu/human-resources-payroll-in-poland/social-security-costs-in-poland-and-germany-2026/' },
    { label: 'Brazil employer cost worked example', url: 'https://accounts-os.com/br/questions/how-much-does-an-employee-cost-in-brazil' },
    { label: 'Vietnam base salary increase from July 2026 (Vietnam Briefing)', url: 'https://www.vietnam-briefing.com/news/vietnam-raises-statutory-basic-salary-from-july-2026-implications-for-employers.html' },
    { label: 'Deel pricing 2026 (Gloroots)', url: 'https://gloroots.com/blog/deel-pricing' },
  ],
};
