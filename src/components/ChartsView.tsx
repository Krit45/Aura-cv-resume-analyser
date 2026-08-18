import React from 'react';
import { ResumeAnalysis } from '../types';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { BarChart3, Layers, Award } from 'lucide-react';

interface ChartsViewProps {
  analysis: ResumeAnalysis;
}

export const ChartsView: React.FC<ChartsViewProps> = ({ analysis }) => {
  // Process skills for Radar Chart
  const extractedSkills = analysis?.extractedSkills || [];
  const radarData = extractedSkills.map((cat) => {
    const skills = cat.skills || [];
    const avgImportance =
      skills.length > 0
        ? Math.round(skills.reduce((sum, s) => sum + s.importance, 0) / skills.length)
        : 70;
    return {
      category: (cat.category || 'Skills').length > 14 ? (cat.category || 'Skills').slice(0, 12) + '...' : (cat.category || 'Skills'),
      score: avgImportance,
      fullCat: cat.category || 'Skills',
    };
  });

  // Flatten top skills for Bar Chart
  const allSkills = extractedSkills.flatMap((c) => c.skills || []);
  const topSkillsData = allSkills
    .sort((a, b) => b.importance - a.importance)
    .slice(0, 8)
    .map((s) => ({
      name: s.name,
      importance: s.importance,
      level: s.level,
    }));

  const COLORS = ['#F59E0B', '#10B981', '#6366F1', '#EC4899', '#8B5CF6', '#3B82F6'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      {/* Skill Categories Radar Chart */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 light:border-stone-200">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-amber-400" />
          <h3 className="font-display font-bold text-lg text-slate-100 light:text-stone-900">
            Domain Competency Radar
          </h3>
        </div>
        <p className="text-xs text-slate-400 light:text-stone-500 mb-6">
          Distribution of expertise across identified skill domains
        </p>

        <div className="w-full h-72">
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.1)" />
                <PolarAngleAxis dataKey="category" stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#64748B" />
                <Radar
                  name="Proficiency"
                  dataKey="score"
                  stroke="#F59E0B"
                  fill="#F59E0B"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              No categorical skills extracted for chart visualization.
            </div>
          )}
        </div>
      </div>

      {/* Top Skills Importance Bar Chart */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 light:border-stone-200">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-emerald-400" />
          <h3 className="font-display font-bold text-lg text-slate-100 light:text-stone-900">
            Core Technical Stack Density
          </h3>
        </div>
        <p className="text-xs text-slate-400 light:text-stone-500 mb-6">
          High-impact keywords detected in experience and skills
        </p>

        <div className="w-full h-72">
          {topSkillsData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSkillsData} layout="vertical" margin={{ left: 20, right: 20 }}>
                <XAxis type="number" domain={[0, 100]} stroke="#64748B" />
                <YAxis dataKey="name" type="category" stroke="#94A3B8" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="importance" radius={[0, 8, 8, 0]}>
                  {topSkillsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              No top skills data available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
