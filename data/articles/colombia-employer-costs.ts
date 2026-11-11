import type { Article } from './types';

export const colombiaEmployerCosts: Article = {
  slug: 'colombia-employer-costs-prima-cesantias-2026',
  title: 'Hiring a Developer in Colombia in 2026: Contributions, Prima and Cesantías',
  description:
    'Colombia employer costs explained: pension, ARL, Caja, the 10-minimum-wage exemption, prima de servicios, cesantías and what a mid-level hire really costs.',
  category: 'Country guide',
  published: '2026-11-11',
  updated: '2026-11-11',
  countries: ['colombia'],
  blocks: [
    {
      type: 'p',
      text: 'Colombia, and Medellín and Bogotá in particular, has become one of the busiest nearshoring hubs for US companies. Its employer contributions look moderate at first glance, but mandatory benefits are among the highest in our calculator. For a mid-level developer, the true cost is about **34% above the base salary**.',
    },
    { type: 'h2', text: 'Employer contributions' },
    {
      type: 'table',
      caption: 'Employer contributions in Colombia (2026). SMMLV = monthly minimum wage, COP 1,750,905.',
      head: ['Contribution', 'Employer rate', 'When it applies'],
      rows: [
        ['Pension', '12%', 'Always; salary base capped at 25 SMMLV'],
        ['ARL occupational-risk insurance', '0.522% (office work, class I)', 'Always'],
        ['Caja de Compensación family fund', '4%', 'Always'],
        ['Health', '8.5%', 'Only for salaries above 10 SMMLV'],
        ['SENA', '2%', 'Only for salaries above 10 SMMLV'],
        ['ICBF', '3%', 'Only for salaries above 10 SMMLV'],
      ],
    },
    { type: 'h2', text: 'The 10-minimum-wage exemption' },
    {
      type: 'p',
      text: 'Under Article 114-1 of Colombia’s Tax Statute, employers that pay Colombian corporate income tax are exempt from health, SENA and ICBF contributions for employees earning less than 10 monthly minimum wages — COP 17.5 million a month in 2026, or roughly $64,600 a year. A foreign company employing through an Employer of Record benefits from this because the EOR’s Colombian entity is the taxpayer.',
    },
    {
      type: 'p',
      text: 'This creates a step in the cost curve. Below the threshold, employer contributions are about **16.5%** of salary. Above it, all six contributions apply and the rate jumps to about **30%**. On a $70,000 salary, that means about $21,015 in employer contributions instead of roughly $11,565 at the lower rate.',
    },
    { type: 'h2', text: 'Mandatory benefits (prestaciones sociales)' },
    {
      type: 'ul',
      items: [
        '**Prima de servicios:** one month of salary per year, paid in two halves, in June and December.',
        '**Cesantías:** one month of salary per year, deposited into the employee’s severance fund.',
        '**Interest on cesantías:** 12% a year on the cesantías balance, paid directly to the employee.',
        '**Vacation:** 15 working days of paid leave per year, plus 18 national holidays.',
      ],
    },
    {
      type: 'p',
      text: 'Prima, cesantías and interest together add about **17.7%** to the annual base salary — more than the employer contributions themselves for most developers.',
    },
    { type: 'h2', text: 'Worked example: $32,000 a year' },
    {
      type: 'table',
      caption: 'A mid-level developer in Colombia at COP 3,250 per US dollar (November 2026).',
      head: ['Item', 'USD'],
      rows: [
        ['Base salary', '$32,000'],
        ['Pension, ARL and Caja (16.522%)', '$5,287'],
        ['Prima, cesantías and interest (17.7%)', '$5,653'],
        ['True employment cost', '$42,940 (+34.2%)'],
      ],
    },
    { type: 'cta', corridor: 'us-to-colombia', label: 'Calculate a Colombian developer’s true cost' },
    { type: 'h2', text: 'Integral salary for senior hires' },
    {
      type: 'p',
      text: 'For high earners, Colombia allows an **integral salary**: a single package of at least 13 minimum wages that already includes prima, cesantías and their interest. Social security contributions are then calculated on 70% of the package. It simplifies payroll for senior engineers but needs to be agreed in writing.',
    },
    { type: 'h2', text: 'Working hours are falling' },
    {
      type: 'p',
      text: 'Law 2101 of 2021 has been reducing the maximum working week step by step, reaching **42 hours in July 2026**. Contracts and overtime calculations should reflect the new limit.',
    },
    { type: 'h2', text: 'Contractors and “primacy of reality”' },
    {
      type: 'p',
      text: 'Independent contractors (contratistas) must contribute to health and pension on 40% of their income and issue electronic invoices to the DIAN. Colombian courts look at how the work is actually done: if a contractor is subordinated and works continuously like an employee, the relationship is treated as employment, with back-dated contributions, prestaciones and a daily late-payment penalty. Our calculator rates Colombia as **high** compliance risk.',
    },
  ],
  sources: [
    { label: 'Aportes parafiscales 2026 (Buk)', url: 'https://www.buk.co/blog/aportes-parafiscales-con-salario-minimo-2026-en-colombia' },
    { label: 'Salario mínimo 2026 (Cafam)', url: 'https://www.cafam.com.co/noticias/salario-minimo-2026' },
    { label: 'Salary expectations in Colombia 2026', url: 'https://nearshorebusinesssolutions.com/news/salary-expectations-in-colombia/' },
  ],
};
