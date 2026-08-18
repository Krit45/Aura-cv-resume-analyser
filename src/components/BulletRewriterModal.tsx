import React, { useState } from 'react';
import { motion } from 'motion/react';
import { api } from '../lib/api';
import {
  X,
  Sparkles,
  Copy,
  Check,
  Edit3,
  Zap,
  ArrowRight,
  TrendingUp,
  Layers,
  HelpCircle
} from 'lucide-react';

interface BulletRewriterModalProps {
  initialBullet?: string;
  onClose: () => void;
}

export const BulletRewriterModal: React.FC<BulletRewriterModalProps> = ({
  initialBullet = '',
  onClose,
}) => {
  const [bulletText, setBulletText] = useState<string>(
    initialBullet || 'Responsible for managing the team software updates and improving speed.'
  );
  const [selectedGoal, setSelectedGoal] = useState<string>('Add STAR Metrics (%, $, numbers)');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rewrittenOptions, setRewrittenOptions] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const goals = [
    'Add STAR Metrics (%, $, numbers)',
    'Strong Executive Action Verbs',
    'Make Concise & Punchy',
    'Highlight Technical Leadership',
  ];

  const handleRewrite = async () => {
    if (!bulletText.trim()) return;
    setIsLoading(true);
    setRewrittenOptions([]);
    try {
      const options = await api.rewriteBullet(bulletText, selectedGoal);
      setRewrittenOptions(options);
    } catch (e) {
      console.error('Rewrite failed:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 light:bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-slate-950 light:bg-white border border-slate-800 light:border-stone-300 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-auto max-h-[90vh] flex flex-col overflow-hidden space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 light:border-stone-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                Enhanced AI STAR Bullet Optimizer
              </span>
              <h2 className="font-display font-black text-xl text-slate-100 light:text-stone-900">
                Turn Weak Bullets Into High-Impact Achievements
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-900 light:bg-stone-100 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Controls */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-mono font-bold uppercase text-slate-400 light:text-stone-600 block mb-1.5">
              Paste Your Original Resume Bullet Point:
            </label>
            <textarea
              rows={3}
              value={bulletText}
              onChange={(e) => setBulletText(e.target.value)}
              placeholder="e.g. Worked on app backend and fixed performance bugs..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-900/80 light:bg-stone-50 text-slate-100 light:text-stone-900 border border-slate-800 light:border-stone-300 text-xs focus:outline-none focus:border-amber-500 leading-relaxed font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-mono font-bold uppercase text-slate-400 light:text-stone-600 block mb-1.5">
              Optimization Goal:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {goals.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGoal(g)}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-left transition cursor-pointer border ${
                    selectedGoal === g
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-slate-900/50 light:bg-stone-50 text-slate-400 light:text-stone-700 border-slate-800/80 light:border-stone-200 hover:text-slate-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleRewrite}
            disabled={isLoading || !bulletText.trim()}
            className="w-full py-3 px-6 rounded-2xl font-display font-extrabold text-xs text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-400 hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-500/10 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            <span>{isLoading ? 'Generating High-Impact Rewrites...' : 'Generate 3 Enhanced High-Impact Options'}</span>
          </button>
        </div>

        {/* Generated Options Output */}
        {rewrittenOptions.length > 0 && (
          <div className="space-y-3 pt-2 overflow-y-auto max-h-64 pr-1 scrollbar-thin">
            <h3 className="text-xs font-mono font-bold uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              <span>AI Optimized Bullet Variations (STAR Method)</span>
            </h3>

            {rewrittenOptions.map((opt, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/80 light:bg-stone-50 border border-slate-800 light:border-stone-200 space-y-2 hover:border-emerald-500/30 transition group"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono font-bold text-amber-400">Option {idx + 1}</span>
                  <button
                    onClick={() => handleCopy(opt, idx)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 light:bg-white text-slate-300 light:text-stone-800 border border-slate-700/60 light:border-stone-300 hover:text-emerald-400 cursor-pointer font-medium"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-400" />
                        <span>Copy Bullet</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-100 light:text-stone-900 font-medium leading-relaxed">
                  "{opt}"
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};
