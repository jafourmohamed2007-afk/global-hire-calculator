/**
 * Article content model. Inline text supports **bold** and [link text](/path-or-url).
 */
export type ArticleBlock =
  | { readonly type: 'h2'; readonly text: string }
  | { readonly type: 'h3'; readonly text: string }
  | { readonly type: 'p'; readonly text: string }
  | { readonly type: 'ul'; readonly items: readonly string[] }
  | { readonly type: 'ol'; readonly items: readonly string[] }
  | {
      readonly type: 'table';
      readonly caption: string;
      readonly head: readonly string[];
      readonly rows: readonly (readonly string[])[];
    }
  | { readonly type: 'callout'; readonly title: string; readonly text: string }
  /** Live table of every talent market's mid-level cost, computed from the calculator engine. */
  | { readonly type: 'cost-table' }
  /** Button linking to a calculator corridor, e.g. "us-to-brazil". */
  | { readonly type: 'cta'; readonly corridor: string; readonly label: string };

export interface ArticleSource {
  readonly label: string;
  readonly url: string;
}

export interface Article {
  readonly slug: string;
  readonly title: string;
  /** Meta description: 140–160 characters. */
  readonly description: string;
  readonly category: 'Budgeting' | 'Compliance' | 'Country guide';
  /** ISO dates. */
  readonly published: string;
  readonly updated: string;
  /** Talent-country slugs this article is about (used for related links on calculator pages). */
  readonly countries: readonly string[];
  readonly blocks: readonly ArticleBlock[];
  readonly sources: readonly ArticleSource[];
}
