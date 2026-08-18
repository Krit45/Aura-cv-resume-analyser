import React from 'react';
import { Sparkles, CheckCircle2, ShieldAlert, Cpu, Award } from 'lucide-react';

export const MarqueeTicker: React.FC = () => {
  const tickerItems = [
    { text: 'Google ATS Rule: Quantitative Metrics (>85% Weight)', icon: Cpu, color: 'text-amber-400' },
    { text: 'Meta ATS Parser: Standard Single-Column Layout Mandate', icon: CheckCircle2, color: 'text-emerald-400' },
    { text: '75% of Resumes Rejected Before Human Review', icon: ShieldAlert, color: 'text-rose-400' },
    { text: 'AuraCV AI Engine: Live Gemini 2.5 Structured Extraction', icon: Sparkles, color: 'text-indigo-400' },
    { text: 'Amazon Leadership Principles Keyword Density Checker', icon: Award, color: 'text-amber-400' },
    { text: 'PDF Vector Text & Word .docx Dual-Parser Engine', icon: CheckCircle2, color: 'text-emerald-400' },
  ];

  return (
    <div className="w-full overflow-hidden py-3 bg-slate-900/60 light:bg-stone-200/80 border-y border-slate-800/80 light:border-stone-300 backdrop-blur-md">
      <div className="animate-marquee flex items-center gap-8 whitespace-nowrap">
        {[...tickerItems, ...tickerItems].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-slate-300 light:text-stone-800 shrink-0">
              <Icon className={`w-4 h-4 ${item.color}`} />
              <span>{item.text}</span>
              <span className="text-slate-600 light:text-stone-400 ml-4">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
