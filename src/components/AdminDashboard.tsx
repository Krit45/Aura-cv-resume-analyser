import React, { useEffect, useState } from 'react';
import { AdminStats } from '../types';
import { api } from '../lib/api';
import { ShieldCheck, Users, FileText, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400">
        <Activity className="w-8 h-8 animate-spin mx-auto mb-2 text-amber-400" />
        <p className="text-xs">Loading Admin Analytics Engine...</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8">
      
      {/* Top Banner */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 light:border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h2 className="font-display font-bold text-2xl text-slate-100 light:text-stone-900">
              Admin System Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-400 light:text-stone-600">
            Platform-wide metrics, candidate ATS volume trends, and missing keyword frequencies.
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
          Admin Role Verified
        </span>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card rounded-3xl p-6 border border-slate-800 light:border-stone-200 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-display font-bold text-slate-100 light:text-stone-900">
              {stats.totalUsers}
            </div>
            <div className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
              Total Candidates
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-slate-800 light:border-stone-200 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-display font-bold text-slate-100 light:text-stone-900">
              {stats.totalAnalyses}
            </div>
            <div className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
              Resumes Scanned
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-6 border border-slate-800 light:border-stone-200 flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-display font-bold text-indigo-400">
              {stats.avgAtsScore} PTS
            </div>
            <div className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
              System Avg ATS Score
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Monthly Volume Chart */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 light:border-stone-200">
          <h3 className="font-display font-bold text-lg text-slate-100 light:text-stone-900 mb-1">
            Monthly Analysis Volume
          </h3>
          <p className="text-xs text-slate-400 mb-6">Candidate scans processed over time</p>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyVolume}>
                <XAxis dataKey="month" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Missing Skills Across All Resumes */}
        <div className="glass-card rounded-3xl p-6 border border-slate-800 light:border-stone-200">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="font-display font-bold text-lg text-slate-100 light:text-stone-900">
              Top Missing ATS Keywords
            </h3>
          </div>
          <p className="text-xs text-slate-400 mb-6">Most frequently missing keywords in candidate submissions</p>

          <div className="space-y-3">
            {stats.topMissingSkills.map((sk, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs p-3 rounded-xl bg-slate-900/60 light:bg-stone-100">
                <span className="font-semibold text-slate-200 light:text-stone-800">{sk.name}</span>
                <span className="px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-400 font-bold border border-rose-500/20">
                  Missing in {sk.count} resumes
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Scans Table */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 light:border-stone-200 space-y-4">
        <h3 className="font-display font-bold text-lg text-slate-100 light:text-stone-900">
          Recent Candidate Scan Activity Log
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 light:text-stone-700">
            <thead className="bg-slate-900/80 light:bg-stone-100 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Candidate</th>
                <th className="p-3">Email</th>
                <th className="p-3">ATS Score</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {stats.recentAnalyses.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/40">
                  <td className="p-3 font-semibold text-slate-200 light:text-stone-900">{item.candidateName}</td>
                  <td className="p-3 text-slate-400">{item.userEmail}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {item.score} PTS
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
