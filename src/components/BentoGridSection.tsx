import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ShieldCheck, Zap, Target, Cpu, FileSpreadsheet, ArrowUpRight, BarChart3, CheckCircle2 } from 'lucide-react';

interface BentoGridSectionProps {
  onAnalyzeClick: () => void;
}

export const BentoGridSection: React.FC<BentoGridSectionProps> = ({ onAnalyzeClick }) => {
  return (
    <section className="py-6 space-y-6">
      
      {/* Editorial Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-800/80 light:border-stone-200 pb-6">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 block mb-1">
            Bespoke Parsing Architecture
          </span>
          <h2 className="font-display font-black text-3xl sm:text-5xl text-slate-100 light:text-stone-900 tracking-tight leading-tight">
            How AuraCV Audits Your Resume <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-emerald-400 to-indigo-400">
              With Surgical Precision
            </span>
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 light:text-stone-700 max-w-md leading-relaxed">
          Unlike generic keyword matchers, our full-stack engine evaluates formatting integrity, quantifies metric impact, and analyzes keyword density using Google's Gemini models.
        </p>
      </div>

      {/* Asymmetric Bento Grid Composition */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Bento Box 1: Large Left Asymmetrical Feature (Spans 7 cols) */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className="md:col-span-7 glass-card asym-card-1 p-8 border border-slate-800 light:border-stone-200 relative overflow-hidden flex flex-col justify-between min-h-[320px]"
        >
          {/* Rotated Badge */}
          <div className="absolute top-6 right-6 transform rotate-6 bg-gradient-to-r from-amber-500 to-emerald-400 text-slate-950 px-3.5 py-1.5 rounded-xl font-display font-bold text-[10px] uppercase tracking-wider shadow-lg">
            99.4% Parser Accuracy
          </div>

          <div className="space-y-4 max-w-lg">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 w-fit">
              <Cpu className="w-6 h-6" />
            </div>

            <h3 className="font-display font-bold text-2xl text-slate-100 light:text-stone-900">
              Dual PDF & Docx Vector Structural Parsing
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 light:text-stone-700 leading-relaxed">
              Extract raw text buffers, decode multi-column layouts, clean artifact characters, and convert unstructured resumes into structured, machine-readable JSON schemas.
            </p>
          </div>

          <div className="pt-6 flex flex-wrap items-center gap-2">
            {['PDF Vector Text', 'Docx Word Processing', 'Header/Footer Unpacking', 'Hidden Table Extraction'].map((tag, i) => (
              <span key={i} className="px-3 py-1 rounded-xl bg-slate-900/80 light:bg-stone-200 text-slate-300 light:text-stone-800 text-[11px] font-semibold border border-slate-800 light:border-stone-300">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Bento Box 2: Top Right Metric Visualizer (Spans 5 cols) */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className="md:col-span-5 glass-card asym-card-2 p-8 border border-slate-800 light:border-stone-200 flex flex-col justify-between min-h-[320px] bg-gradient-to-br from-slate-900/90 to-slate-950"
        >
          <div className="flex items-center justify-between">
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              Live Evaluation
            </span>
          </div>

          <div className="space-y-2 my-4">
            <div className="text-4xl font-display font-black text-slate-100 light:text-stone-900 flex items-baseline gap-2">
              <span>85+</span>
              <span className="text-xs font-semibold text-emerald-400">Target Score</span>
            </div>
            <h4 className="font-display font-bold text-lg text-slate-200 light:text-stone-800">
              Quantifiable Impact Engine
            </h4>
            <p className="text-xs text-slate-400 light:text-stone-600 leading-relaxed">
              Detects action verbs, revenue growth %, team scaling numbers, and engineering metrics inside experience bullets.
            </p>
          </div>

          {/* Animated score bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-[10px] font-semibold text-slate-400">
              <span>Metric Density Ratio</span>
              <span className="text-amber-400">Optimal (92%)</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 w-[92%]" />
            </div>
          </div>
        </motion.div>

        {/* Bento Box 3: Bottom Left Job Description Matcher (Spans 5 cols) */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className="md:col-span-5 glass-card asym-card-3 p-8 border border-slate-800 light:border-stone-200 flex flex-col justify-between min-h-[280px]"
        >
          <div>
            <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-400 w-fit mb-4">
              <Target className="w-6 h-6" />
            </div>

            <h3 className="font-display font-bold text-xl text-slate-100 light:text-stone-900 mb-2">
              JD Gap Analysis & Missing Keywords
            </h3>

            <p className="text-xs text-slate-300 light:text-stone-700 leading-relaxed">
              Paste target job requirements to automatically reveal missing hard skills, toolchains, and certifications required by ATS keyword filters.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-400">Instant Context Suggestions</span>
            <button
              onClick={onAnalyzeClick}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 transition cursor-pointer"
            >
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Bento Box 4: Bottom Right Interactive CTA Card (Spans 7 cols) */}
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className="md:col-span-7 glass-card glass-card-accent p-8 rounded-3xl border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden"
        >
          <div className="space-y-3 max-w-md">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant AI Resume Audit</span>
            </div>
            <h3 className="font-display font-extrabold text-2xl text-slate-100 light:text-stone-900">
              Ready to Upgrade Your Interview Callback Rate?
            </h3>
            <p className="text-xs text-slate-300 light:text-stone-700">
              Upload your PDF/Docx resume or paste text to generate your instant executive ATS breakdown.
            </p>
          </div>

          <button
            onClick={onAnalyzeClick}
            className="px-6 py-3.5 rounded-2xl font-display font-bold text-xs text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-xl shadow-amber-500/20 transition shrink-0 cursor-pointer flex items-center gap-2"
          >
            <span>Start Free Scan</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};
