import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ResumeAnalysis } from '../types';
import { GitCompare, TrendingUp, CheckCircle2, ArrowRight, X, Sparkles, Layers, ShieldCheck } from 'lucide-react';

interface CompareVersionsModalProps {
  analyses: ResumeAnalysis[];
  onClose: () => void;
}

export const CompareVersionsModal: React.FC<CompareVersionsModalProps> = ({ analyses, onClose }) => {
  if (!analyses || analyses.length < 2) return null;

  // Sort chronological
  const sorted = [...analyses].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const newest = sorted[sorted.length - 1];
  const baseline = sorted[0];

  const scoreDiff = newest.atsScore - baseline.atsScore;

  // Mobile selected tab state: 'all' (stacked/grid) or index of specific version
  const [selectedMobileIndex, setSelectedMobileIndex] = useState<number | 'all'>('all');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 light:bg-stone-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="glass-panel rounded-3xl sm:rounded-[2.5rem] p-4 sm:p-8 max-w-5xl w-full border border-slate-800 light:border-stone-300 shadow-2xl relative my-auto max-h-[90vh] flex flex-col overflow-hidden"
      >
        
        {/* Close Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-2xl text-slate-400 light:text-stone-600 hover:text-white light:hover:text-stone-900 hover:bg-slate-800/80 light:hover:bg-stone-200 transition cursor-pointer z-20 border border-transparent hover:border-slate-700 light:hover:border-stone-300"
        >
          <X className="w-5 h-5" />
        </motion.button>

        {/* Modal Header */}
        <div className="pr-10 sm:pr-0 mb-4 sm:mb-6 shrink-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 light:text-amber-600 bg-amber-500/10 light:bg-amber-500/15 px-2.5 py-1 rounded-full border border-amber-500/20 flex items-center gap-1.5">
              <GitCompare className="w-3.5 h-3.5" />
              VERSION MATRIX
            </span>
            <span className="text-[10px] font-mono text-slate-400 light:text-stone-500">
              {sorted.length} ITERATIONS
            </span>
          </div>

          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-100 light:text-stone-900 tracking-tight leading-tight">
            Resume Version <span className="font-serif-editorial italic font-normal text-amber-400 light:text-amber-600">Comparison</span>
          </h2>
          <p className="text-xs text-slate-400 light:text-stone-600 mt-1">
            Track score progression, keyword gains, and structural optimizations between versions.
          </p>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto pr-1 space-y-5 custom-scrollbar">

          {/* Overall Score Improvement Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 light:bg-stone-100 border border-slate-800/90 light:border-stone-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${scoreDiff >= 0 ? 'bg-emerald-500/10 text-emerald-400 light:text-emerald-700 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 light:text-stone-600">
                  Total Score Progression
                </div>
                <div className="text-xl sm:text-2xl font-display font-black text-slate-100 light:text-stone-900 flex items-center gap-2 mt-0.5">
                  <span className="text-slate-400 light:text-stone-600 text-lg sm:text-xl">{baseline.atsScore} PTS</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-400 light:text-amber-700">{newest.atsScore} PTS</span>
                </div>
              </div>
            </div>

            <div className={`self-start sm:self-auto px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black border tracking-wide flex items-center gap-1.5 ${
              scoreDiff >= 0 
                ? 'bg-emerald-500/15 text-emerald-400 light:text-emerald-700 border-emerald-500/30'
                : 'bg-rose-500/15 text-rose-400 light:text-rose-700 border-rose-500/30'
            }`}>
              <Sparkles className="w-4 h-4" />
              <span>{scoreDiff >= 0 ? `+${scoreDiff} PTS GAIN` : `${scoreDiff} PTS CHANGE`}</span>
            </div>
          </div>

          {/* Mobile Segmented Control Tab Switcher */}
          <div className="sm:hidden flex p-1 rounded-2xl bg-slate-900 light:bg-stone-200 border border-slate-800 light:border-stone-300 overflow-x-auto">
            <button
              onClick={() => setSelectedMobileIndex('all')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedMobileIndex === 'all'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 light:text-stone-600'
              }`}
            >
              Side-By-Side
            </button>
            {sorted.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setSelectedMobileIndex(idx)}
                className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedMobileIndex === idx
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 light:text-stone-600'
                }`}
              >
                {item.versionTag || `V${idx + 1}`}
              </button>
            ))}
          </div>

          {/* Version Cards Grid */}
          <div className={`grid grid-cols-1 ${
            selectedMobileIndex === 'all'
              ? sorted.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'
              : 'grid-cols-1'
          } gap-4 sm:gap-6`}>
            {sorted.map((item, index) => {
              // Hide non-selected in mobile individual tab view
              if (selectedMobileIndex !== 'all' && selectedMobileIndex !== index) {
                return null;
              }

              const isLatest = index === sorted.length - 1;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 sm:p-5 rounded-3xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                    isLatest
                      ? 'bg-slate-900/90 light:bg-white border-amber-500/50 shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/40 light:bg-stone-50/80 border-slate-800/80 light:border-stone-300'
                  }`}
                >
                  {isLatest && (
                    <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[9px] font-mono font-black uppercase px-3 py-1 rounded-bl-xl shadow-sm tracking-wider">
                      LATEST AUDIT
                    </div>
                  )}

                  <div>
                    {/* Header line */}
                    <div className="flex items-center justify-between mb-3 pr-12">
                      <span className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider ${
                        isLatest
                          ? 'bg-amber-500/15 text-amber-400 light:text-amber-700 border border-amber-500/30'
                          : 'bg-slate-800 light:bg-stone-200 text-slate-400 light:text-stone-700 border border-slate-700 light:border-stone-300'
                      }`}>
                        {item.versionTag || `Iteration ${index + 1}`}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 light:text-stone-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Score display */}
                    <div className="text-center py-3 sm:py-4 my-2 rounded-2xl bg-slate-950/70 light:bg-stone-100 border border-slate-800/80 light:border-stone-300">
                      <div className="text-3xl sm:text-4xl font-display font-black text-slate-100 light:text-stone-900">
                        {item.atsScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                      </div>
                      <div className="text-[10px] font-mono font-bold uppercase text-slate-400 light:text-stone-500 tracking-widest mt-1">
                        ATS SCORE
                      </div>
                    </div>

                    {/* Progress metrics */}
                    <div className="space-y-3 mt-4 text-xs">
                      <div>
                        <div className="flex justify-between items-center text-slate-300 light:text-stone-800 font-semibold mb-1">
                          <span>Formatting</span>
                          <span className="text-amber-400 font-mono text-[11px]">{item.metricBreakdown.formatting}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 light:bg-stone-200 rounded-full overflow-hidden p-0.5">
                          <div className="h-full bg-amber-400 rounded-full transition-all duration-500" style={{ width: `${item.metricBreakdown.formatting}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-slate-300 light:text-stone-800 font-semibold mb-1">
                          <span>Keywords Match</span>
                          <span className="text-emerald-400 font-mono text-[11px]">{item.metricBreakdown.keywords}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 light:bg-stone-200 rounded-full overflow-hidden p-0.5">
                          <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${item.metricBreakdown.keywords}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center text-slate-300 light:text-stone-800 font-semibold mb-1">
                          <span>Impact & Metrics</span>
                          <span className="text-indigo-400 font-mono text-[11px]">{item.metricBreakdown.impactAndMetrics}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-800 light:bg-stone-200 rounded-full overflow-hidden p-0.5">
                          <div className="h-full bg-indigo-400 rounded-full transition-all duration-500" style={{ width: `${item.metricBreakdown.impactAndMetrics}%` }} />
                        </div>
                      </div>

                      {/* Top Skills */}
                      <div className="pt-3 border-t border-slate-800/80 light:border-stone-200">
                        <span className="text-slate-400 light:text-stone-600 font-bold text-[11px] block mb-1.5 uppercase tracking-wider">
                          Extracted Stack
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.extractedSkills.flatMap(c => c.skills).slice(0, 5).map((s, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-800/90 light:bg-stone-200 text-slate-300 light:text-stone-800 border border-slate-700/60 light:border-stone-300">
                              {s.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>

      </motion.div>
    </div>
  );
};

