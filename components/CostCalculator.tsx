'use client';

import { useId, useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import type { CompanyCountry, TalentCountry } from '@/data/country-matrix';
import { EOR_MONTHLY_FEE_USD } from '@/data/partners';
import {
  MAX_SALARY_USD,
  MIN_SALARY_USD,
  calculateHireCost,
  clampSalary,
  convertFromUSD,
  getSalaryRange,
} from '@/lib/cost-engine';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/format';
import { RiskBadge } from './RiskBadge';

interface CostCalculatorProps {
  readonly company: CompanyCountry;
  readonly talent: TalentCountry;
  /** Rendered directly beneath the headline result (EOR partner placements). */
  readonly partnerSlot?: ReactNode;
}

interface CurrencyOption {
  readonly code: string;
  readonly rate: number;
  readonly label: string;
}

const SENIORITY_PRESETS = [
  { label: 'Junior', factor: 0.6 },
  { label: 'Mid-level', factor: 1 },
  { label: 'Senior', factor: 1.6 },
  { label: 'Lead', factor: 2.2 },
] as const;

const RISK_PANEL: Record<TalentCountry['complianceRiskScore'], { wrap: string; icon: string; title: string }> = {
  Low: {
    wrap: 'border-emerald-200 bg-emerald-50 text-emerald-950',
    icon: 'fill-emerald-600',
    title: 'Low compliance risk',
  },
  Medium: {
    wrap: 'border-amber-200 bg-amber-50 text-amber-950',
    icon: 'fill-amber-600',
    title: 'Medium compliance risk — structure the contract carefully',
  },
  High: {
    wrap: 'border-rose-200 bg-rose-50 text-rose-950',
    icon: 'fill-rose-600',
    title: 'High compliance risk — use a compliant employment model',
  },
};

function roundTo(value: number, increment: number) {
  return Math.round(value / increment) * increment;
}

export function CostCalculator({ company, talent, partnerSlot }: CostCalculatorProps) {
  const ids = useId();
  const range = useMemo(() => getSalaryRange(talent.avgDevSalaryUSD), [talent.avgDevSalaryUSD]);

  const [salaryUSD, setSalaryUSD] = useState<number>(talent.avgDevSalaryUSD);
  const [salaryDraft, setSalaryDraft] = useState<string>(String(talent.avgDevSalaryUSD));
  const [includeEorFee, setIncludeEorFee] = useState(true);

  const currencies = useMemo<CurrencyOption[]>(() => {
    const list: CurrencyOption[] = [{ code: 'USD', rate: 1, label: 'US dollar' }];
    if (!list.some((c) => c.code === company.currencyCode)) {
      list.push({ code: company.currencyCode, rate: company.usdToLocalRate, label: `${company.countryName} (HQ)` });
    }
    if (!list.some((c) => c.code === talent.currencyCode)) {
      list.push({ code: talent.currencyCode, rate: talent.usdToLocalRate, label: `${talent.countryName} (local)` });
    }
    return list;
  }, [company, talent]);

  const [displayCurrency, setDisplayCurrency] = useState<string>(company.currencyCode);
  const activeCurrency = currencies.find((c) => c.code === displayCurrency) ?? currencies[0]!;

  const breakdown = useMemo(
    () => calculateHireCost(talent, salaryUSD, includeEorFee),
    [talent, salaryUSD, includeEorFee],
  );

  const money = (usd: number, currency: CurrencyOption = activeCurrency) =>
    formatCurrency(convertFromUSD(usd, currency.rate), currency.code);

  const sliderValue = Math.min(range.max, Math.max(range.min, salaryUSD));
  const fillPercent = ((sliderValue - range.min) / (range.max - range.min)) * 100;
  const isAboveSliderMax = salaryUSD > range.max;
  const marketDelta = salaryUSD / talent.avgDevSalaryUSD - 1;

  function updateSalary(value: number) {
    const next = clampSalary(value);
    setSalaryUSD(next);
    setSalaryDraft(String(next));
  }

  function handleDraftChange(raw: string) {
    const digits = raw.replace(/[^\d]/g, '').slice(0, 7);
    setSalaryDraft(digits);
    const parsed = Number(digits);
    if (digits !== '' && parsed >= MIN_SALARY_USD) setSalaryUSD(clampSalary(parsed));
  }

  const segments = [
    { key: 'base', label: 'Base salary', usd: breakdown.baseSalaryUSD, color: 'bg-brand-600' },
    { key: 'tax', label: 'Employer taxes', usd: breakdown.employerTaxUSD, color: 'bg-amber-500' },
    { key: 'benefits', label: 'Mandatory benefits', usd: breakdown.mandatoryBenefitsUSD, color: 'bg-violet-500' },
    { key: 'eor', label: 'EOR platform fee', usd: breakdown.eorFeeUSD, color: 'bg-slate-400' },
  ].filter((segment) => segment.usd > 0);

  const risk = RISK_PANEL[talent.complianceRiskScore];

  return (
    <section
      id="calculator"
      aria-labelledby={`${ids}-title`}
      className="scroll-mt-20 rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* ───────────────────────── Inputs ───────────────────────── */}
        <div className="border-b border-slate-200 p-4 sm:p-6 lg:border-b-0 lg:border-r">
          <h2 id={`${ids}-title`} className="text-xl font-bold tracking-tight text-ink">
            Salary calculator
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Drag the slider or type an annual gross salary for your {talent.countryName}-based hire.
          </p>

          <div className="mt-5">
            <div className="flex items-end justify-between gap-3">
              <label htmlFor={`${ids}-salary-input`} className="text-sm font-semibold text-ink">
                Annual base salary (USD)
              </label>
              <span className="text-xs font-medium text-slate-500">
                {marketDelta === 0
                  ? 'Market average'
                  : `${marketDelta > 0 ? '+' : ''}${formatPercent(marketDelta, 0)} vs. market`}
              </span>
            </div>
            <div className="relative mt-2">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl font-semibold text-slate-400"
              >
                $
              </span>
              <input
                id={`${ids}-salary-input`}
                type="text"
                inputMode="numeric"
                autoComplete="off"
                enterKeyHint="done"
                value={salaryDraft}
                aria-describedby={`${ids}-salary-help`}
                onChange={(event) => handleDraftChange(event.target.value)}
                onBlur={() => setSalaryDraft(String(salaryUSD))}
                className="block min-h-14 w-full rounded-xl border border-slate-300 bg-white py-3 pl-9 pr-4 text-2xl font-bold tabular-nums text-ink shadow-sm focus:border-brand-600 focus:outline-none focus:ring-4 focus:ring-brand-100"
              />
            </div>
            <p id={`${ids}-salary-help`} className="mt-1.5 text-xs text-slate-500">
              {formatCurrency(MIN_SALARY_USD, 'USD')} – {formatCurrency(MAX_SALARY_USD, 'USD')}. Average mid-level
              developer in {talent.countryName}: {formatCurrency(talent.avgDevSalaryUSD, 'USD')}.
            </p>

            <div className="mt-4">
              <label htmlFor={`${ids}-salary-slider`} className="sr-only">
                Annual base salary slider
              </label>
              <input
                id={`${ids}-salary-slider`}
                type="range"
                min={range.min}
                max={range.max}
                step={range.step}
                value={sliderValue}
                aria-valuetext={`${formatCurrency(salaryUSD, 'USD')} per year`}
                onChange={(event) => updateSalary(Number(event.target.value))}
                className="range-slider"
                style={{ '--fill': `${fillPercent}%` } as CSSProperties}
              />
              <div className="flex justify-between text-xs font-medium tabular-nums text-slate-500">
                <span>{formatCurrency(range.min, 'USD', true)}</span>
                <span>
                  {isAboveSliderMax ? 'Custom: ' : ''}
                  {formatCurrency(range.max, 'USD', true)}
                  {isAboveSliderMax ? '+' : ''}
                </span>
              </div>
            </div>
          </div>

          <fieldset className="mt-5">
            <legend className="text-sm font-semibold text-ink">Seniority presets</legend>
            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {SENIORITY_PRESETS.map((preset) => {
                const presetSalary = roundTo(talent.avgDevSalaryUSD * preset.factor, 500);
                const isActive = presetSalary === salaryUSD;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => updateSalary(presetSalary)}
                    className={`flex min-h-12 flex-col items-center justify-center rounded-xl border px-2 py-1.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 ${
                      isActive
                        ? 'border-brand-600 bg-brand-600 text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:border-brand-500 hover:text-brand-700'
                    }`}
                  >
                    {preset.label}
                    <span className={`text-xs font-medium tabular-nums ${isActive ? 'text-brand-100' : 'text-slate-500'}`}>
                      {formatCurrency(presetSalary, 'USD', true)}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="mt-5">
            <legend className="text-sm font-semibold text-ink">Show results in</legend>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {currencies.map((currency) => (
                <label
                  key={currency.code}
                  className="relative flex min-h-12 cursor-pointer items-center justify-center rounded-xl border border-slate-300 bg-white px-2 text-center text-sm font-bold text-slate-700 transition-colors hover:border-brand-500 has-[:checked]:border-brand-600 has-[:checked]:bg-brand-50 has-[:checked]:text-brand-800 has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-brand-100"
                >
                  <input
                    type="radio"
                    name={`${ids}-currency`}
                    value={currency.code}
                    checked={displayCurrency === currency.code}
                    onChange={() => setDisplayCurrency(currency.code)}
                    className="sr-only"
                  />
                  {currency.code}
                  <span className="sr-only"> — {currency.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="mt-5 flex min-h-12 cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2">
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-ink">Include EOR platform fee</span>
              <span className="block text-xs text-slate-500">
                Typical list price ~{formatCurrency(EOR_MONTHLY_FEE_USD, 'USD')}/month
              </span>
            </span>
            <input
              type="checkbox"
              role="switch"
              checked={includeEorFee}
              onChange={(event) => setIncludeEorFee(event.target.checked)}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className="relative h-8 w-14 shrink-0 rounded-full bg-slate-300 transition-colors peer-checked:bg-brand-600 peer-focus-visible:ring-4 peer-focus-visible:ring-brand-100 after:absolute after:left-1 after:top-1 after:size-6 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-6"
            />
          </label>
        </div>

        {/* ───────────────────────── Results ───────────────────────── */}
        <div className="space-y-5 p-4 sm:p-6">
          <div className="rounded-2xl bg-ink p-5 text-white">
            <p className="text-sm font-medium text-slate-300">True annual business cost</p>
            <p className="mt-1 break-words text-4xl font-black tabular-nums tracking-tight sm:text-5xl">
              {money(breakdown.totalCostUSD)}
            </p>
            <p className="mt-1 text-sm text-slate-300" aria-live="polite">
              {money(breakdown.monthlyTotalUSD)}/month ·{' '}
              <strong className="text-white">{formatNumber(breakdown.costMultiplier, 2)}×</strong> base salary
            </p>

            <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
              <div className="min-w-0">
                <dt className="text-xs text-slate-400">Base salary</dt>
                <dd className="break-words text-lg font-bold tabular-nums">{money(breakdown.baseSalaryUSD)}</dd>
              </div>
              <div className="min-w-0">
                <dt className="text-xs text-slate-400">Cost on top of salary</dt>
                <dd className="break-words text-lg font-bold tabular-nums text-amber-300">
                  +{money(breakdown.overheadUSD)}
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-ink">Base salary vs. true business cost</h3>
            <div
              role="img"
              aria-label={segments.map((s) => `${s.label} ${money(s.usd)}`).join(', ')}
              className="mt-2 flex h-4 w-full overflow-hidden rounded-full bg-slate-100"
            >
              {segments.map((segment) => (
                <div
                  key={segment.key}
                  className={`${segment.color} h-full transition-[width] duration-200`}
                  style={{ width: `${(segment.usd / breakdown.totalCostUSD) * 100}%` }}
                />
              ))}
            </div>
            <dl className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-200">
              {[
                {
                  label: 'Base salary',
                  hint: '12 months gross',
                  usd: breakdown.baseSalaryUSD,
                  color: 'bg-brand-600',
                },
                {
                  label: 'Employer payroll taxes',
                  hint: `${formatPercent(talent.employerTaxRate)} statutory contributions`,
                  usd: breakdown.employerTaxUSD,
                  color: 'bg-amber-500',
                },
                {
                  label: 'Mandatory benefits',
                  hint:
                    talent.mandatoryBenefitsRate > 0
                      ? `${formatPercent(talent.mandatoryBenefitsRate)} 13th-month, bonuses & accruals`
                      : 'No statutory extra-month payments',
                  usd: breakdown.mandatoryBenefitsUSD,
                  color: 'bg-violet-500',
                },
                ...(includeEorFee
                  ? [
                      {
                        label: 'EOR platform fee',
                        hint: `~${formatCurrency(EOR_MONTHLY_FEE_USD, 'USD')} × 12 months`,
                        usd: breakdown.eorFeeUSD,
                        color: 'bg-slate-400',
                      },
                    ]
                  : []),
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-3 px-3 py-2.5">
                  <dt className="flex min-w-0 items-start gap-2.5">
                    <span aria-hidden="true" className={`mt-1.5 size-2.5 shrink-0 rounded-full ${row.color}`} />
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-slate-800">{row.label}</span>
                      <span className="block text-xs text-slate-500">{row.hint}</span>
                    </span>
                  </dt>
                  <dd className="shrink-0 text-right text-sm font-bold tabular-nums text-ink">{money(row.usd)}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between gap-3 bg-slate-50 px-3 py-3">
                <dt className="text-sm font-bold text-ink">True business cost</dt>
                <dd className="shrink-0 text-right text-base font-black tabular-nums text-brand-700">
                  {money(breakdown.totalCostUSD)}
                </dd>
              </div>
            </dl>
          </div>

          {partnerSlot}

          <div>
            <h3 className="text-sm font-semibold text-ink">Currency conversions</h3>
            <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {currencies.map((currency) => (
                <li key={currency.code} className="min-w-0 rounded-xl border border-slate-200 p-3">
                  <p className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-500">
                    <span>{currency.code}</span>
                    <span className="truncate font-normal">{currency.label}</span>
                  </p>
                  <p className="mt-1 text-xs text-slate-500">Base salary</p>
                  <p className="break-words text-sm font-bold tabular-nums text-ink">
                    {money(breakdown.baseSalaryUSD, currency)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">True cost / month</p>
                  <p className="break-words text-sm font-bold tabular-nums text-brand-700">
                    {money(breakdown.monthlyTotalUSD, currency)}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-slate-500">
              Indicative rates: 1 USD = {formatNumber(talent.usdToLocalRate)} {talent.currencyCode}
              {company.currencyCode !== 'USD' && ` = ${formatNumber(company.usdToLocalRate)} ${company.currencyCode}`}.
              Payroll is usually funded at the provider’s live rate.
            </p>
          </div>

          <aside aria-labelledby={`${ids}-risk-title`} className={`rounded-2xl border p-4 ${risk.wrap}`}>
            <div className="flex items-start gap-3">
              <svg aria-hidden="true" viewBox="0 0 20 20" className={`mt-0.5 size-5 shrink-0 ${risk.icon}`}>
                <path d="M8.3 2.9a2 2 0 0 1 3.4 0l6.3 10.9A2 2 0 0 1 16.3 17H3.7A2 2 0 0 1 2 13.8L8.3 2.9ZM10 7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
              </svg>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 id={`${ids}-risk-title`} className="text-base font-bold">
                    {risk.title}
                  </h3>
                  <RiskBadge score={talent.complianceRiskScore} />
                </div>
                <p className="mt-1.5 text-sm leading-relaxed">{talent.complianceRiskSummary}</p>
                <p className="mt-2 text-sm leading-relaxed">
                  <strong>Misclassification exposure:</strong> if a contractor at this salary were reclassified as an
                  employee, back-dated employer contributions and mandatory benefits alone could reach about{' '}
                  <strong className="tabular-nums">{money(breakdown.misclassificationExposureUSD)}</strong> per year
                  of engagement — before fines, interest and severance.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
