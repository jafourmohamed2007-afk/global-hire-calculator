# Global Remote Hire Tax & Cost Calculator

A Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 programmatic-SEO utility that calculates the true cost of hiring a remote developer abroad: base salary vs. true business cost (employer payroll taxes and mandatory benefits), currency conversions and compliance-risk warnings. Employer of Record referral cards (Deel, Remote) sit next to the results.

- No UI component libraries: semantic HTML and Tailwind only.
- 48 statically generated corridor pages (`/hire/us-to-india`, `/hire/uk-to-brazil`, …) with unique `generateMetadata` titles, canonical URLs and JSON-LD (WebPage, BreadcrumbList, WebApplication, FAQPage).
- Mobile-first: every interactive control is ≥ 48px tall and there is no horizontal scrolling from 320px up.
- `sitemap.xml` and `robots.txt` are generated automatically.

## Getting started

```bash
npm install
cp .env.example .env.local   # set NEXT_PUBLIC_SITE_URL and your affiliate links
npm run dev
```

`npm run build && npm start` for production. `npm run typecheck` runs the TypeScript checks.

## Project structure

| Path | Purpose |
| --- | --- |
| `data/country-matrix.ts` | Type-safe talent and company country matrix, plus slug helpers |
| `data/partners.ts` | EOR partner cards and the default EOR fee |
| `lib/cost-engine.ts` | Pure cost calculation |
| `lib/format.ts` | Currency and percent formatting (locale pinned to avoid hydration mismatches) |
| `app/page.tsx` | Homepage with the Company/Candidate location selectors |
| `app/hire/[slug]/page.tsx` | Dynamic corridor page: metadata, JSON-LD, calculator, FAQ |
| `app/hire/page.tsx` | No-JavaScript fallback that redirects `?from=&to=` to the canonical slug |
| `components/CostCalculator.tsx` | Interactive client-side calculator (slider, presets, currency toggle) |

## Data disclaimer

Salaries, employer contribution rates and exchange rates are indicative planning figures. Review and update `data/country-matrix.ts` regularly; it is not tax or legal advice.
