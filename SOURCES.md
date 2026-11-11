# Data sources & verification (reviewed 10 November 2026)

Every figure in `data/country-matrix.ts` and `data/partners.ts` is listed here with where it was checked.
Calculations are verified by hand-worked tests in `tests/cost-engine.test.ts` (`npm test`).

> These figures are planning estimates, not tax or legal advice. Most third-party sources are EOR and payroll
> vendor guides; confirm with official agencies or a local adviser before running payroll. Re-check exchange
> rates and annual ceilings at least every January and July.

## Exchange rates (mid-market, ~9–10 Nov 2026)

| Currency | Per 1 USD | Source |
|---|---|---|
| INR | 93.6 | [X-Rates](https://www.x-rates.com/table/?from=USD&amount=1), [MTFX](https://www.mtfxgroup.com/fx-monthly-us/) |
| BRL | 5.51 | [Trading Economics](https://tradingeconomics.com/brazil/currency) |
| PLN | 3.93 | Derived from [ECB reference rates](https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html) (PLN/EUR ÷ USD/EUR) |
| PHP | 63.06 | [BSP reference rate via taxcalculator.com.ph](https://taxcalculator.com.ph/exchange-rates/usd-to-php) |
| MXN | 18.50 | [X-Rates](https://www.x-rates.com/table/?from=USD&amount=1) |
| COP | 3,250 | [Investing.com](https://www.investing.com/currencies/usd-cop-historical-data), [Forbes Advisor](https://www.forbes.com/advisor/money-transfer/currency-converter/usd-cop/) (3,229–3,276) |
| VND | 25,650 | [OFX](https://www.ofx.com/en-us/exchange-rates/vnd/), [Forbes Advisor](https://www.forbes.com/advisor/money-transfer/currency-converter/usd-vnd/) |
| UAH | 45.32 | NBU official rate 9 Nov 2026 ([UNN](https://unn.ua/en/news/exchange-rates-for-november-9-the-nbu-sharply-crashed-the-euro)) |
| GBP / EUR / CAD / AUD / SGD | 0.749 / 0.894 / 1.412 / 1.456 / 1.283 | [X-Rates 7 Nov 2026](https://x-rates.com/historical/?from=USD&amount=1&date=2026-11-07), ECB |

## Employer contributions

| Country | Model used | Sources |
|---|---|---|
| India | EPF/EPS 12% + admin 0.5% + EDLI 0.5% (₹15k ceiling) on basic wages = 50% of pay (Labour Codes in force 21 Nov 2025); gratuity 15/26 × basic ≈ 4.81% | [Kredily](https://kredily.com/new-wage-code-india-2026-payroll-impact/), [Fisher Phillips](https://www.fisherphillips.com/en/insights/insights/indias-new-labor-codes-expand-gratuity-payment-rules), [Mondaq](https://www.mondaq.com/india/employee-rights-labour-relations/1716104/labour-codes-implemented-a-landmark-reform) |
| Brazil | INSS 20% + RAT 2% (1–3%) + Terceiros 5.8% + FGTS 8% = 35.8%, also on 13th salary and ⅓ vacation bonus → ≈50.9% all-in | [RemotePass](https://www.remotepass.com/country/brazil/payroll), [Accounts-OS worked example](https://accounts-os.com/br/questions/how-much-does-an-employee-cost-in-brazil) |
| Poland | 9.76% + 6.5% (capped at PLN 282,600/yr) + accident 1.67% + FP/FS 2.45% + FGŚP 0.10% = 20.48% | [getsix](https://getsix.eu/human-resources-payroll-in-poland/social-security-costs-in-poland-and-germany-2026/), [Teamed](https://www.teamed.global/country-hiring-guides/poland/tax-and-payroll) |
| Philippines | SSS 10% (MSC cap ₱35,000) + EC ₱30 + PhilHealth 2.5% (cap ₱100,000) + Pag-IBIG 2% (cap ₱10,000); 13th month 1/12 | [KAMI Workforce](https://kamiworkforce.com/ph/blog/sss-philhealth-pagibig-contribution-tables-2026/), [Second Talent](https://www.secondtalent.com/resources/philippines-payroll-benefits-tax/) |
| Mexico | IMSS branches + SAR 2% + CEAV 7.513% (2026, >4 UMA) + INFONAVIT 5% on SBC capped at 25 UMA; ISN 3%; UMA = MXN 117.31; aguinaldo 15 days + prima vacacional 25% | [INEGI UMA 2026](https://www.inegi.org.mx/contenidos/saladeprensa/boletines/2026/uma/uma2026.pdf), [Deel (≈25.9%)](https://www.deel.com/blog/employer-costs-for-an-employee-in-mexico/), [Start-ops](https://start-ops.com.mx/tools/mexico-labor-cost-calculator.html) |
| Colombia | Pension 12% + ARL 0.522% + Caja 4%; health 8.5%, SENA 2%, ICBF 3% only above 10 SMMLV (Art. 114-1 E.T.); SMMLV COP 1,750,905; prima + cesantías + 12% interest | [Buk](https://www.buk.co/blog/aportes-parafiscales-con-salario-minimo-2026-en-colombia), [Cafam](https://www.cafam.com.co/noticias/salario-minimo-2026) |
| Vietnam | SI 17.5% + HI 3% + UI 1% + trade union 2%; SI/HI cap 20 × VND 2.53M (from 1 Jul 2026), UI cap 20 × VND 5.31M | [Vietnam Briefing](https://www.vietnam-briefing.com/news/vietnam-raises-statutory-basic-salary-from-july-2026-implications-for-employers.html), [Cake](https://www.cake.me/resources/recruitment/shui-vietnam) |
| Ukraine | ESV 22% capped at 20 × UAH 8,647 minimum wage; military levy 5% (employee) | [SUP](https://sup.org.ua/en/news/new-tax-rates-as-of-january-1-2026/), [Fair.org.ua](https://www.fair.org.ua/en/minimalna-zarplata-2026-rozmir-zminy-ta-realnyj-vplyv/) |

## Mid-level developer salaries (USD/year)

Salary surveys disagree widely, so the app shows a **range** and uses a mid-point for defaults.

| Country | Range | Mid-point | Sources |
|---|---|---|---|
| India | 12k–22k | 18k | [devtoollab](https://devtoollab.com/blog/vietnam-vs-india-software-engineers), [itsourcecode](https://itsourcecode.com/blogs/programmer-salary-by-country-2026/) |
| Brazil | 31k–42k | 36k | [Uvik](https://uvik.net/blog/global-software-developer-rates-2026/), [Howdy](https://www.howdy.com/blog/brazil-software-engineer-salary-hiring-cost-benchmarks) |
| Poland | 38k–58k | 46k | [Jobicy](https://jobicy.com/salaries/pl/software-developer), [OctogleHire](https://www.octoglehire.com/rates/poland) |
| Philippines | 10k–22k | 16k | [Second Talent](https://www.secondtalent.com/developer-rate-card/philippines/), [Omnivoo](https://omnivoo.com/blog/cost-to-hire-developers-philippines-2026) |
| Mexico | 34k–50k | 38k | [Uvik](https://uvik.net/blog/global-software-developer-rates-2026/), [Howdy](https://www.howdy.com/blog/mexico-software-engineer-salary-hiring-cost-benchmarks-2026) |
| Colombia | 25k–50k | 32k | [Nearshore Business Solutions](https://nearshorebusinesssolutions.com/news/salary-expectations-in-colombia/), [Uvik](https://uvik.net/blog/global-software-developer-rates-2026/) |
| Vietnam | 12k–30k | 20k | [Second Talent](https://www.secondtalent.com/cost-to-hire/vietnam/), [devtoollab](https://devtoollab.com/blog/vietnam-vs-india-software-engineers) |
| Ukraine | 28k–42k | 36k | [Uvik](https://uvik.net/blog/global-software-developer-rates-2026/), [Qubit Labs](https://qubit-labs.com/average-software-developer-salaries-salary-comparison-country/) |

## EOR pricing

| Provider | List price | Source |
|---|---|---|
| Deel | $599/employee/month | [Gloroots](https://gloroots.com/blog/deel-pricing), [Costbench](https://costbench.com/compare/deel-vs-remote) |
| Remote | $599 billed annually, $699 billed monthly (cut from $699 in Oct 2026) | [PricingSaaS](https://pricingsaas.com/companies/remote/diffs/2026W43), [Gloroots](https://gloroots.com/blog/remote-pricing) |

## Additional checks (11 November 2026)

| Fact | Source |
|---|---|
| Mexico CEAV employer rate 7.513% above 4.01 UMA in 2026 | [elcontribuyente.mx](https://www.elcontribuyente.mx/indicadores/cuotas-imss/), [contadormx.com](https://contadormx.com/cuotas-imss-2026-tablas-porcentajes-y-fechas/) |
| Vietnam Region I minimum wage VND 5.31M (Decree 293/2025) | [Baker McKenzie](https://www.bakermckenzie.com/en/insight/publications/2026/03/vietnam-change-to-the-regional-minimum-wage-in-2026) |
| India: fixed-term employees get pro-rata gratuity after one year | [BDO India](https://www.bdo.in/en-gb/news/2025/gratuity-payment-after-1-year-of-service-for-salaried-employees-under-fixed-term-employment;-know-ho), [Fisher Phillips](https://www.fisherphillips.com/en/insights/insights/indias-new-labor-codes-expand-gratuity-payment-rules) |
| Brazil 13th salary due by 30 November and 20 December | [The Brazil Business](https://thebrazilbusiness.com/article/13th-salary-in-brazil) |
| Ukraine: public holidays are working days under martial law | [Verkhovna Rada research service](https://research.rada.gov.ua/en/documents/analyticRSmaterialsDocs_en/hum_social_policy_en/inform_references-hsp_en/77458.html) |
