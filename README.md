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

## Google AdSense readiness

Already built in:

- Original content: 48 calculator pages and 8 sourced guides (`data/articles/`), with internal linking.
- Trust pages: About, Contact, Privacy policy (with the required Google advertising-cookie disclosures), Terms, Cookie policy and Disclaimer — all linked from the footer.
- Cookie consent banner wired to Google Consent Mode v2: ads are paused until the visitor chooses; "Reject" serves non-personalized ads only; "Cookie settings" in the footer reopens it.
- AdSense code, verification meta tag and `/ads.txt`, switched on by `NEXT_PUBLIC_ADSENSE_CLIENT`.
- Sitemap, robots.txt, canonical URLs, structured data, fast static pages and mobile-friendly layout.

What you need to do:

1. Deploy on **your own domain** (AdSense does not accept free subdomains such as `*.vercel.app`) and set `NEXT_PUBLIC_SITE_URL`.
2. Create the contact mailbox (or set `NEXT_PUBLIC_CONTACT_EMAIL`).
3. Submit the sitemap in Google Search Console and wait until pages are indexed.
4. Sign up for AdSense, then set `NEXT_PUBLIC_ADSENSE_CLIENT` to your `ca-pub-…` ID and redeploy so Google can verify the site and `ads.txt`.
5. In AdSense → Privacy & messaging, enable Google's certified consent message for the EEA/UK/Switzerland, then set `NEXT_PUBLIC_USE_GOOGLE_CMP=true`.
6. Keep publishing useful guides — approval is never guaranteed, and sites with more original content are more likely to be approved.

## Reviews

Only genuine, consented reviews may be added to `data/reviews.ts`. Fake or invented reviews are illegal in many countries and break Google's policies.

## Data & verification

Every figure is sourced in `SOURCES.md`, and `npm test` checks the calculations against hand-worked examples.

## Data disclaimer

Salaries, employer contribution rates and exchange rates are indicative planning figures. Review and update `data/country-matrix.ts` regularly; it is not tax or legal advice.
