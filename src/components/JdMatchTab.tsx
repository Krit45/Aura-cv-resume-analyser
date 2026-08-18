import React from 'react';
import { JdComparison } from '../types';
import { Target, CheckCircle2, AlertTriangle, ArrowRight, Sparkles, Layers } from 'lucide-react';

interface JdMatchTabProps {
  jdComparison?: JdComparison;
}

export const JdMatchTab: React.FC<JdMatchTabProps> = ({ jdComparison }) => {
  if (!jdComparison) {
    return (
      <div className="glass-card rounded-3xl p-8 text-center border border-slate-800 light:border-stone-200">
        <Target className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="font-display font-bold text-lg text-slate-200 light:text-stone-800 mb-1">
          No Target Job Description Provided
        </h3>
        <p className="text-xs text-slate-400 light:text-stone-600 max-w-md mx-auto">
          Re-analyze your resume with a pasted Job Description to unlock keyword gap analysis, match percentage, and targeted keyword placement advice.
        </p>
      </div>
    );
  }

  const { jobTitle, companyName, matchScore, matchedKeywords = [], missingKeywords = [], roleRelevanceAnalysis } = jdComparison;

  return (
    <div className="space-y-6">
      
      {/* Target JD Overview Banner */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 light:border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <Target className="w-4 h-4" />
            Target Role Comparison
          </div>
          <h3 className="font-display font-bold text-xl text-slate-100 light:text-stone-900">
            {jobTitle || 'Target Position'} <span className="text-slate-400 font-normal">at {companyName || 'Target Company'}</span>
          </h3>
          <p className="text-xs text-slate-400 light:text-stone-600 mt-1 max-w-xl">
            {roleRelevanceAnalysis}
          </p>
        </div>

        {/* Match Percentage Badge */}
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-900/80 light:bg-stone-100 border border-slate-800 light:border-stone-200 min-w-[120px]">
          <span className="text-3xl font-display font-extrabold text-emerald-400">
            {matchScore}%
          </span>
          <span className="text-[10px] font-semibold uppercase text-slate-400 light:text-stone-500 tracking-wider mt-0.5">
            JD Match Rate
          </span>
        </div>
      </div>

      {/* Missing Keywords Action Section */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 light:border-stone-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="font-display font-bold text-lg text-slate-100 light:text-stone-900">
              Missing Critical ATS Keywords ({missingKeywords.length})
            </h3>
          </div>
          <span className="text-xs text-amber-400 font-medium">High Impact for ATS Optimization</span>
        </div>

        <div className="space-y-3">
          {missingKeywords.map((item, index) => {
            let priorityBadge = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
            if (item.importance === 'High') priorityBadge = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
            if (item.importance === 'Medium') priorityBadge = 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';

            return (
              <div
                key={index}
                className="p-4 rounded-2xl bg-slate-900/60 light:bg-stone-100 border border-slate-800/80 light:border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border shrink-0 mt-0.5 ${priorityBadge}`}>
                    {item.importance}
                  </span>
                  <div>
                    <h4 className="font-semibold text-sm text-slate-200 light:text-stone-900">
                      {item.keyword}
                    </h4>
                    <p className="text-xs text-slate-400 light:text-stone-600 mt-0.5">
                      {item.contextSuggestion}
                    </p>
                  </div>
                </div>

                <div className="self-end md:self-center shrink-0">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 hover:underline cursor-pointer">
                    AI Context Suggestion <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Matched Keywords Grid */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 light:border-stone-200">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <h3 className="font-display font-bold text-lg text-slate-100 light:text-stone-900">
            Successfully Matched JD Keywords ({matchedKeywords.length})
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {matchedKeywords.map((kw, i) => (
            <span
              key={i}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {kw}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
