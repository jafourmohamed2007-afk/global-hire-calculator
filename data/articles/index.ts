import { brazilCltCost } from './brazil-clt-cost';
import { colombiaEmployerCosts } from './colombia-employer-costs';
import { eorVsContractor } from './eor-vs-contractor';
import { indiaLabourCodes } from './india-labour-codes';
import { mexicoPayrollCosts } from './mexico-payroll-costs';
import { misclassificationRisk } from './misclassification-risk';
import { philippinesContributions } from './philippines-contributions';
import { polandB2bVsEmployment } from './poland-b2b-vs-employment';
import { trueCostOfHiringAbroad } from './true-cost-of-hiring-abroad';
import { ukraineHiringGuide } from './ukraine-hiring-guide';
import { vietnamSocialInsurance } from './vietnam-social-insurance';
import type { Article } from './types';

export type { Article, ArticleBlock } from './types';

/** All published guides, in the order shown on the guides page. */
export const ARTICLES: readonly Article[] = [
  trueCostOfHiringAbroad,
  eorVsContractor,
  misclassificationRisk,
  brazilCltCost,
  indiaLabourCodes,
  mexicoPayrollCosts,
  philippinesContributions,
  polandB2bVsEmployment,
  colombiaEmployerCosts,
  vietnamSocialInsurance,
  ukraineHiringGuide,
];

const articleBySlug = new Map(ARTICLES.map((article) => [article.slug, article]));

export function getArticle(slug: string): Article | undefined {
  return articleBySlug.get(slug);
}

/** Guides relevant to a talent country, most specific (single-country) first. */
export function getArticlesForCountry(countrySlug: string, limit = 3): Article[] {
  return ARTICLES.filter((article) => article.countries.includes(countrySlug))
    .sort((a, b) => a.countries.length - b.countries.length)
    .slice(0, limit);
}

/** Estimated reading time in minutes (≈220 words per minute). */
export function readingMinutes(article: Article): number {
  const words = article.blocks
    .map((block) => {
      if ('text' in block) return block.text;
      if ('items' in block) return block.items.join(' ');
      if (block.type === 'table') return block.rows.flat().join(' ');
      return '';
    })
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(3, Math.round(words / 220));
}

export function formatArticleDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
