import React, { useState } from 'react';
import { ResumeAnalysis } from '../types';
import { Search, Filter, Trash2, Eye, GitCompare, Sparkles, Calendar, FileText } from 'lucide-react';

interface HistoryViewProps {
  history: ResumeAnalysis[];
  onSelectAnalysis: (analysis: ResumeAnalysis) => void;
  onDeleteAnalysis: (id: string) => void;
  onCompareAnalyses: (ids: string[]) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectAnalysis,
  onDeleteAnalysis,
  onCompareAnalyses,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);

  const filteredHistory = history.filter((item) => {
    const term = searchTerm.toLowerCase();
    const candidateMatch = item.candidateName?.toLowerCase().includes(term);
    const filenameMatch = item.filename?.toLowerCase().includes(term);
    const summaryMatch = item.summary?.toLowerCase().includes(term);
    const versionMatch = item.versionTag?.toLowerCase().includes(term);
    const skillMatch = item.extractedSkills.some((cat) =>
      cat.skills.some((s) => s.name.toLowerCase().includes(term))
    );
    return candidateMatch || filenameMatch || summaryMatch || versionMatch || skillMatch;
  });

  const toggleSelectForCompare = (id: string) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter((i) => i !== id));
    } else {
      if (selectedForCompare.length >= 3) return;
      setSelectedForCompare([...selectedForCompare, id]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search Header Bar */}
      <div className="glass-card rounded-3xl p-6 border border-slate-800 light:border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search candidates, skills, files, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-900/80 light:bg-white border border-slate-800 light:border-stone-300 text-slate-200 light:text-stone-900 text-xs focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Selected Compare Bar */}
        {selectedForCompare.length >= 2 && (
          <button
            onClick={() => onCompareAnalyses(selectedForCompare)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-md shadow-amber-500/20 transition cursor-pointer"
          >
            <GitCompare className="w-4 h-4" />
            Compare {selectedForCompare.length} Selected Versions
          </button>
        )}
      </div>

      {/* History Grid / List */}
      {filteredHistory.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-slate-800 light:border-stone-200">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg text-slate-200 light:text-stone-800 mb-1">
            No Saved Analyses Found
          </h3>
          <p className="text-xs text-slate-400 light:text-stone-600 max-w-sm mx-auto">
            Try adjusting your search criteria or upload a new resume to start building your analysis log.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHistory.map((item) => {
            const isSelected = selectedForCompare.includes(item.id);
            let scoreBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
            if (item.atsScore < 60) scoreBg = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
            else if (item.atsScore < 80) scoreBg = 'bg-amber-500/10 text-amber-400 border-amber-500/30';

            return (
              <div
                key={item.id}
                className={`glass-card rounded-3xl p-6 border transition-all duration-300 relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/5 shadow-lg shadow-amber-500/10'
                    : 'border-slate-800 light:border-stone-200 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                        {item.versionTag || 'v1.0'}
                      </span>
                      <h3 className="font-display font-bold text-lg text-slate-100 light:text-stone-900 leading-snug">
                        {item.candidateName}
                      </h3>
                    </div>

                    <span className={`px-3 py-1 rounded-xl text-sm font-extrabold border ${scoreBg}`}>
                      {item.atsScore} <span className="text-[10px] font-medium uppercase">ATS</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 light:text-stone-600 line-clamp-2 mb-4">
                    {item.summary}
                  </p>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-4">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="truncate max-w-[150px]">{item.filename}</span>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-4 border-t border-slate-800/80 light:border-stone-200 flex items-center justify-between gap-2">
                  <label className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectForCompare(item.id)}
                      className="rounded border-slate-800 text-amber-500 focus:ring-amber-500"
                    />
                    <span>Compare</span>
                  </label>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onSelectAnalysis(item)}
                      className="p-2 rounded-xl text-amber-400 hover:bg-amber-500/10 transition"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteAnalysis(item.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
