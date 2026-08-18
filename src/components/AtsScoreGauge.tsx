import React from 'react';
import { MetricBreakdown } from '../types';
import { ShieldCheck, Award, AlertCircle, Sparkles } from 'lucide-react';

interface AtsScoreGaugeProps {
  score: number; // 0-100
  metricBreakdown?: MetricBreakdown;
  size?: 'sm' | 'md' | 'lg';
}

export const AtsScoreGauge: React.FC<AtsScoreGaugeProps> = ({ score, metricBreakdown, size = 'md' }) => {
  // Determine color theme based on score grade
  let strokeColor = '#10B981'; // Emerald >= 80
  let badgeLabel = 'ATS Elite Pass';
  let badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

  if (score < 60) {
    strokeColor = '#F43F5E'; // Rose
    badgeLabel = 'Needs Heavy Optimization';
    badgeBg = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
  } else if (score < 80) {
    strokeColor = '#F59E0B'; // Amber
    badgeLabel = 'Good - Minor Gaps';
    badgeBg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  }

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center p-4">
        {/* Glowing Orb Background */}
        <div 
          className="absolute inset-0 rounded-full filter blur-2xl opacity-30 transition-all duration-700"
          style={{ backgroundColor: strokeColor }}
        />

        {/* SVG Circular Progress Gauge */}
        <svg className="w-48 h-48 transform -rotate-90">
          <circle
            cx="96"
            cy="96"
            r={radius}
            className="stroke-slate-800 light:stroke-stone-200"
            strokeWidth="12"
            fill="transparent"
          />
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke={strokeColor}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Inner Counter Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-display font-extrabold text-slate-100 light:text-stone-900 tracking-tight">
            {score}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 light:text-stone-500">
            / 100 ATS Score
          </span>
        </div>
      </div>

      {/* Grade Status Badge */}
      <div className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${badgeBg}`}>
        <Sparkles className="w-3.5 h-3.5" />
        <span>{badgeLabel}</span>
      </div>

      {/* Sub-Metrics Breakdown Bars */}
      {metricBreakdown && (
        <div className="w-full mt-6 space-y-3 pt-4 border-t border-slate-800/80 light:border-stone-200">
          <MetricBar label="ATS Formatting & Parseability" value={metricBreakdown.formatting} />
          <MetricBar label="Keyword Density & Role Fit" value={metricBreakdown.keywords} />
          <MetricBar label="Quantified Impact & Metrics" value={metricBreakdown.impactAndMetrics} />
          <MetricBar label="Role Experience Relevance" value={metricBreakdown.relevance} />
        </div>
      )}
    </div>
  );
};

const MetricBar: React.FC<{ label: string; value: number }> = ({ label, value }) => {
  let colorClass = 'bg-emerald-500';
  if (value < 60) colorClass = 'bg-rose-500';
  else if (value < 80) colorClass = 'bg-amber-500';

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-slate-300 light:text-stone-700 font-medium">
        <span>{label}</span>
        <span className="font-semibold">{value}%</span>
      </div>
      <div className="w-full h-2 bg-slate-800/80 light:bg-stone-200 rounded-full overflow-hidden p-[1px]">
        <div
          className={`h-full rounded-full transition-all duration-700 ${colorClass}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};
