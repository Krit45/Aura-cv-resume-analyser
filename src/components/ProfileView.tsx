import React, { useState } from 'react';
import { User, ResumeAnalysis } from '../types';
import { User as UserIcon, Mail, Target, Award, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';

interface ProfileViewProps {
  user: User;
  analyses: ResumeAnalysis[];
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, analyses }) => {
  const [targetRole, setTargetRole] = useState(user.targetRole || 'Full Stack Engineer');

  const totalAnalyses = analyses.length;
  const avgScore = totalAnalyses > 0
    ? Math.round(analyses.reduce((sum, a) => sum + a.atsScore, 0) / totalAnalyses)
    : 0;

  const topScore = totalAnalyses > 0
    ? Math.max(...analyses.map((a) => a.atsScore))
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Profile Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 light:border-stone-200 flex flex-col sm:flex-row items-center gap-6">
        <img
          src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
          alt={user.name}
          className="w-24 h-24 rounded-2xl object-cover border-2 border-amber-500/40 shadow-xl"
        />

        <div className="text-center sm:text-left space-y-2">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h2 className="font-display font-extrabold text-2xl text-slate-100 light:text-stone-900">
              {user.name}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
              {user.role}
            </span>
          </div>

          <div className="text-xs text-slate-400 light:text-stone-600 flex items-center justify-center sm:justify-start gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            <span>{user.email}</span>
          </div>

          <div className="text-xs text-slate-300 light:text-stone-700 flex items-center justify-center sm:justify-start gap-1.5">
            <Target className="w-3.5 h-3.5 text-amber-400" />
            <span>Targeting: <strong>{targetRole}</strong></span>
          </div>
        </div>
      </div>

      {/* Performance Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card rounded-3xl p-6 border border-slate-800 light:border-stone-200 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-display font-bold text-slate-100 light:text-stone-900">
              {totalAnalyses}
            </div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Resumes Scanned
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-slate-800 light:border-stone-200 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-display font-bold text-emerald-400">
              {topScore} PTS
            </div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Peak ATS Score
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-slate-800 light:border-stone-200 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-display font-bold text-indigo-400">
              {avgScore} PTS
            </div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Average Score
            </div>
          </div>
        </div>
      </div>

      {/* Preferences & Target Role Setting */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 light:border-stone-200 space-y-4">
        <h3 className="font-display font-bold text-lg text-slate-100 light:text-stone-900 border-b border-slate-800/80 light:border-stone-200 pb-3">
          Career Profile & Target Role Settings
        </h3>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 light:text-stone-700 mb-2">
            Default Target Role for AI Matching
          </label>
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-slate-900/80 light:bg-white border border-slate-800 light:border-stone-300 text-slate-200 light:text-stone-900 text-sm focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>
    </div>
  );
};
