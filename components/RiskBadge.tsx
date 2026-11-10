import type { ComplianceRiskScore } from '@/data/country-matrix';

const STYLES: Record<ComplianceRiskScore, string> = {
  Low: 'bg-emerald-50 text-emerald-800 ring-emerald-600/25',
  Medium: 'bg-amber-50 text-amber-900 ring-amber-600/30',
  High: 'bg-rose-50 text-rose-800 ring-rose-600/25',
};

const DOTS: Record<ComplianceRiskScore, string> = {
  Low: 'bg-emerald-500',
  Medium: 'bg-amber-500',
  High: 'bg-rose-500',
};

interface RiskBadgeProps {
  readonly score: ComplianceRiskScore;
  readonly className?: string;
}

export function RiskBadge({ score, className = '' }: RiskBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${STYLES[score]} ${className}`}
    >
      <span aria-hidden="true" className={`size-2 rounded-full ${DOTS[score]}`} />
      {score} risk
    </span>
  );
}
