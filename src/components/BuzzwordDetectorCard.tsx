import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Search,
  Zap,
  Sparkles
} from 'lucide-react';
import { detectFirstPersonPronouns } from '../lib/pronounUtils';

interface BuzzwordDetectorCardProps {
  rawText: string;
  onOpenRewriter?: (bullet?: string) => void;
  onCleanPronouns?: () => void;
}

export const BuzzwordDetectorCard: React.FC<BuzzwordDetectorCardProps> = ({
  rawText,
  onOpenRewriter,
  onCleanPronouns,
}) => {
  const textLower = rawText.toLowerCase();

  // List of overused clichés/buzzwords
  const buzzwords = [
    { word: 'hard worker', replacement: 'Dedicated team member' },
    { word: 'team player', replacement: 'Collaborative team contributor' },
    { word: 'responsible for', replacement: 'Led / Managed / Designed' },
    { word: 'go-getter', replacement: 'Proactive team lead' },
    { word: 'out-of-the-box thinker', replacement: 'Creative problem solver' },
    { word: 'detail-oriented', replacement: 'Thorough, quality-focused professional' },
    { word: 'results-driven', replacement: 'Metrics-focused contributor' },
    { word: 'self-starter', replacement: 'Independent project leader' },
    { word: 'thought leader', replacement: 'Subject matter expert' },
    { word: 'synergy', replacement: 'Cross-functional teamwork' },
  ];

  const foundBuzzwords = buzzwords.filter((b) => textLower.includes(b.word));

  // Pronoun check using word boundary regex
  const foundPronouns = detectFirstPersonPronouns(rawText);

  const isHealthy = foundBuzzwords.length === 0 && foundPronouns.length === 0;

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-800 light:border-stone-200 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 light:border-stone-200 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-slate-100 light:text-stone-900">
              Enhanced Cliché & Tone Audit
            </h3>
            <p className="text-[11px] text-slate-400">
              Scans for overused buzzwords, passive voice, and first-person pronouns.
            </p>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 border ${
            isHealthy
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}
        >
          {isHealthy ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
          {isHealthy ? 'Tone Clean & Professional' : `${foundBuzzwords.length + foundPronouns.length} Tone Issues Identified`}
        </span>
      </div>

      {/* Audit Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Found Clichés Card */}
        <div className="p-4 rounded-2xl bg-slate-900/60 light:bg-stone-50 border border-slate-800 light:border-stone-200 space-y-3">
          <div className="text-xs font-mono font-bold uppercase text-slate-300 light:text-stone-800 flex items-center justify-between">
            <span>Overused Buzzwords & Clichés Detected ({foundBuzzwords.length})</span>
            {foundBuzzwords.length === 0 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </div>

          {foundBuzzwords.length === 0 ? (
            <p className="text-xs text-emerald-400 font-medium">
              No generic buzzwords detected. Excellent action-oriented phrasing!
            </p>
          ) : (
            <div className="space-y-2">
              {foundBuzzwords.map((b, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <span className="font-bold text-amber-300 capitalize">"{b.word}"</span>
                  <span className="text-[11px] text-emerald-400 font-semibold">
                    Replace with: {b.replacement}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* First Person Pronouns Card */}
        <div className="p-4 rounded-2xl bg-slate-900/60 light:bg-stone-50 border border-slate-800 light:border-stone-200 space-y-3">
          <div className="text-xs font-mono font-bold uppercase text-slate-300 light:text-stone-800 flex items-center justify-between">
            <span>First-Person Pronouns ("I", "my")</span>
            {foundPronouns.length === 0 && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </div>

          {foundPronouns.length === 0 ? (
            <p className="text-xs text-emerald-400 font-medium">
              Zero first-person pronouns found. Professional implicit-subject formatting!
            </p>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-rose-400 font-medium">
                Detected: {foundPronouns.map((p) => `"${p}"`).join(', ')}. ATS systems and executive recruiters prefer direct action verb bullets (e.g. "Spearheaded..." instead of "I managed...").
              </p>

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                {onCleanPronouns && (
                  <button
                    onClick={onCleanPronouns}
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-[11px] flex items-center justify-center gap-1.5 hover:bg-emerald-400 cursor-pointer transition shadow-md"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Auto-Clean Pronouns</span>
                  </button>
                )}

                {onOpenRewriter && (
                  <button
                    onClick={() => onOpenRewriter()}
                    className="flex-1 py-2 px-3 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-[11px] flex items-center justify-center gap-1.5 hover:bg-amber-400 cursor-pointer transition"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Launch STAR Rewriter</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
