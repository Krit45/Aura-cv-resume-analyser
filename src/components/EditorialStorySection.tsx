import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, CheckCircle2, AlertTriangle, RefreshCw, Layers, Shield, FileCheck } from 'lucide-react';

export const EditorialStorySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'before' | 'after'>('after');

  return (
    <section className="py-12 space-y-12 border-t border-slate-800/80 light:border-stone-200">
      
      {/* Editorial Headline with Asymmetric Typographic Contrast */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-8 space-y-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-md border border-amber-500/20 w-fit block">
            The Human Recruiter & Algorithm Reality
          </span>
          <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-slate-100 light:text-stone-900 tracking-tight leading-[1.05]">
            Why 75% of Qualified Resumes <br className="hidden sm:inline" />
            <span className="font-serif-editorial italic font-normal text-amber-400 text-5xl sm:text-7xl">
              Get Silently Filtered Out
            </span>
          </h2>
        </div>

        <div className="lg:col-span-4 space-y-4 text-xs sm:text-sm text-slate-300 light:text-stone-700 leading-relaxed border-l-2 border-amber-500/40 pl-5">
          <p>
            Modern Applicant Tracking Systems don't read resumes like humans. They parse buffers into token trees. Unstandardized section titles or missing quantifiable metrics reduce your candidacy rank score before a recruiter ever opens your file.
          </p>
        </div>
      </div>

      {/* Interactive Bullet Transformer Preview (Before vs After) */}
      <div className="glass-card asym-card-1 p-6 sm:p-10 border border-slate-800 light:border-stone-200 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/80 light:border-stone-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
              Live AI Bullet Enhancement
            </span>
            <h3 className="font-display font-bold text-xl text-slate-100 light:text-stone-900">
              Compare Impact Quantification
            </h3>
          </div>

          {/* Toggle pill button */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-900 light:bg-stone-200 border border-slate-800 light:border-stone-300 w-fit">
            <button
              onClick={() => setActiveTab('before')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'before'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Generic Weak Bullet
            </button>
            <button
              onClick={() => setActiveTab('after')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'after'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              AuraCV Quantified Rewrite
            </button>
          </div>
        </div>

        {/* Dynamic Display Card */}
        <div className="p-6 rounded-2xl bg-slate-950/80 light:bg-stone-50 border border-slate-800/80 light:border-stone-200 relative">
          {activeTab === 'before' ? (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>Low Impact • Unquantified • Missing Action Verbs</span>
              </div>
              <p className="text-sm font-mono text-slate-300 light:text-stone-800 bg-slate-900/90 light:bg-stone-100 p-4 rounded-xl border border-slate-800 light:border-stone-200">
                "Worked on improving backend API performance and fixed bugs for our e-commerce client web application."
              </p>
              <div className="flex items-center gap-4 text-[11px] text-slate-400">
                <span>ATS Metric Rating: <strong className="text-rose-400">32/100</strong></span>
                <span>Keyword Density: <strong className="text-rose-400">Low</strong></span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>High Impact • Quantified Metrics • Target Tech Stack Density</span>
              </div>
              <p className="text-sm font-mono text-emerald-300 light:text-stone-900 bg-emerald-950/30 light:bg-emerald-50/80 p-4 rounded-xl border border-emerald-500/30">
                "Engineered distributed Node.js/TypeScript REST APIs, reducing database p99 query latency by 42% and sustaining 15,000+ peak concurrent users during high-traffic client sales."
              </p>
              <div className="flex items-center gap-4 text-[11px] text-slate-300 light:text-stone-700">
                <span>ATS Metric Rating: <strong className="text-emerald-400">96/100</strong></span>
                <span>Keyword Density: <strong className="text-emerald-400">Optimal (+4 Keywords)</strong></span>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Asymmetric 3-Step Process Flow with Varied Corner Radii */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="glass-card p-6 rounded-3xl border border-slate-800 light:border-stone-200 relative space-y-4">
          <span className="text-4xl font-display font-black text-slate-700/50 light:text-stone-300 block">01</span>
          <h4 className="font-display font-bold text-lg text-slate-100 light:text-stone-900">
            Buffer Text Parsing
          </h4>
          <p className="text-xs text-slate-300 light:text-stone-700 leading-relaxed">
            Direct binary buffer extraction for PDF & Docx removes hidden formatting noise, converting unorganized layouts into clean token streams.
          </p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-800 light:border-stone-200 relative space-y-4 translate-y-0 md:-translate-y-4">
          <span className="text-4xl font-display font-black text-amber-500/40 block">02</span>
          <h4 className="font-display font-bold text-lg text-slate-100 light:text-stone-900">
            Gemini Schema Evaluation
          </h4>
          <p className="text-xs text-slate-300 light:text-stone-700 leading-relaxed">
            Evaluates structural completeness, quantifies experience metrics, and checks hard skills against enterprise candidate benchmarks.
          </p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-slate-800 light:border-stone-200 relative space-y-4">
          <span className="text-4xl font-display font-black text-emerald-500/40 block">03</span>
          <h4 className="font-display font-bold text-lg text-slate-100 light:text-stone-900">
            Actionable Optimization Map
          </h4>
          <p className="text-xs text-slate-300 light:text-stone-700 leading-relaxed">
            Receive side-by-side bullet rewrites, JD keyword insertion targets, and version history tracking to maximize interview callbacks.
          </p>
        </div>

      </div>
    </section>
  );
};
