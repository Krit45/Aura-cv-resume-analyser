import React, { useState, useEffect } from 'react';
import { User, ResumeAnalysis } from './types';
import { api, authStorage } from './lib/api';
import { Navbar } from './components/Navbar';
import { UploadZone } from './components/UploadZone';
import { AnalysisResultView } from './components/AnalysisResultView';
import { HistoryView } from './components/HistoryView';
import { CompareVersionsModal } from './components/CompareVersionsModal';
import { ProfileView } from './components/ProfileView';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { ScrollProgress } from './components/ScrollProgress';
import { MouseSpotlight } from './components/MouseSpotlight';
import { MarqueeTicker } from './components/MarqueeTicker';
import { BentoGridSection } from './components/BentoGridSection';
import { EditorialStorySection } from './components/EditorialStorySection';
import { FaqSection } from './components/FaqSection';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  FileUp,
  History,
  GitCompare,
  ShieldCheck,
  Award,
  TrendingUp,
  Target,
  ArrowRight,
  CheckCircle2,
  Users,
  BarChart2,
  Zap,
  Check,
  X as XIcon,
  Cpu,
  Layers
} from 'lucide-react';

// Helper function to ensure all required properties on ResumeAnalysis are initialized
const normalizeAnalysis = (item: ResumeAnalysis): ResumeAnalysis => {
  if (!item) return item;
  return {
    ...item,
    candidateName: item.candidateName || 'Candidate',
    summary: item.summary || 'Resume analysis completed successfully.',
    atsScore: typeof item.atsScore === 'number' && !isNaN(item.atsScore) ? item.atsScore : 80,
    aiSuggestions: item.aiSuggestions || [],
    extractedSkills: item.extractedSkills || [],
    extractedExperience: item.extractedExperience || [],
    extractedEducation: item.extractedEducation || [],
    extractedCertifications: item.extractedCertifications || [],
    extractedProjects: item.extractedProjects || [],
  };
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [history, setHistory] = useState<ResumeAnalysis[]>([]);
  const [activeAnalysis, setActiveAnalysisState] = useState<ResumeAnalysis | null>(null);

  const setActiveAnalysis = (item: ResumeAnalysis | null) => {
    setActiveAnalysisState(item ? normalizeAnalysis(item) : null);
  };
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [compareModalOpen, setCompareModalOpen] = useState<boolean>(false);
  const [compareList, setCompareList] = useState<ResumeAnalysis[]>([]);

  // Enforce light theme on document element
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  }, []);

  // Initial user authentication check & history fetch
  useEffect(() => {
    const token = authStorage.getToken();
    if (token) {
      api.getMe()
        .then((userData) => {
          setUser(userData);
          fetchHistory();
        })
        .catch(() => {
          authStorage.removeToken();
          fetchHistory();
        });
    } else {
      fetchHistory();
    }
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await api.getHistory();
      const normalizedList = (data || []).map(normalizeAnalysis);
      setHistory(normalizedList);
      setActiveAnalysisState((current) => {
        if (!current && normalizedList.length > 0) {
          return normalizedList[0];
        }
        return current;
      });
    } catch (e) {
      console.warn('Failed to fetch history:', e);
    }
  };

  const handleLogout = () => {
    authStorage.removeToken();
    setUser(null);
    fetchHistory();
  };

  const handleQuickDemoLogin = async () => {
    try {
      const res = await api.login({ email: 'demo@resumai.com', password: 'demo123' });
      setUser(res.user);
      fetchHistory();
    } catch (e) {
      console.error('Demo login failed:', e);
    }
  };

  const handleRunAnalysis = async (formData: FormData) => {
    setIsAnalyzing(true);
    try {
      const result = await api.analyzeResume(formData);
      const normalizedResult = normalizeAnalysis(result);
      setActiveAnalysisState(normalizedResult);
      setCurrentTab('result');

      // Update history in background without clearing activeAnalysis
      try {
        const historyData = await api.getHistory();
        if (historyData) {
          setHistory(historyData.map(normalizeAnalysis));
        }
      } catch (histErr) {
        console.warn('Failed to update history list:', histErr);
      }
    } catch (err) {
      throw err;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDeleteAnalysis = async (id: string) => {
    try {
      await api.deleteAnalysis(id);
      await fetchHistory();
      if (activeAnalysis?.id === id) {
        setActiveAnalysis(null);
      }
    } catch (e) {
      console.error('Delete failed:', e);
    }
  };

  const handleCompareAnalyses = async (ids: string[]) => {
    // Check if we already have matching items in local history state
    const localMatches = history.filter((h) => ids.includes(h.id));
    if (localMatches.length >= 2) {
      setCompareList(localMatches);
      setCompareModalOpen(true);
      return;
    }

    try {
      const items = await api.compareAnalyses(ids);
      if (items && items.length >= 2) {
        setCompareList(items);
        setCompareModalOpen(true);
      } else if (localMatches.length > 0) {
        setCompareList(localMatches);
        setCompareModalOpen(true);
      }
    } catch (e) {
      console.warn('Compare API call failed, using local fallback:', e);
      if (localMatches.length > 0) {
        setCompareList(localMatches);
        setCompareModalOpen(true);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300 relative light bg-[#faf9f6] text-stone-900">
      {/* Scroll Progress Bar & Mouse Spotlight Cursor */}
      <ScrollProgress />
      <MouseSpotlight />

      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Running Marquee Ticker */}
      <MarqueeTicker />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {/* TAB 1: DASHBOARD */}
            {currentTab === 'dashboard' && (
              <div className="space-y-12">
                
                {/* Hero Section */}
                <section className="relative overflow-hidden rounded-[32px] p-8 sm:p-12 glass-card border border-slate-800 light:border-stone-200">
                  
                  {/* Decorative Ambient Glowing Orbs */}
                  <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute bottom-0 left-1/4 w-[360px] h-[360px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                  {/* Overlapping Floating Asymmetric Badge */}
                  <div className="hidden lg:block absolute -right-4 bottom-8 transform -rotate-3 p-4 rounded-2xl bg-slate-900/90 light:bg-white border border-amber-500/30 shadow-2xl z-20 max-w-xs">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-100 light:text-stone-900">
                          98.5% Interview Callback Rate
                        </div>
                        <div className="text-[10px] text-slate-400">
                          For candidates scoring 85+ PTS
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 max-w-3xl space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/25">
                      <Sparkles className="w-4 h-4 animate-spin-slow" />
                      <span>Gemini-Powered ATS Intelligence</span>
                    </div>

                    <h1 className="font-display font-black text-4xl sm:text-6xl text-slate-100 light:text-stone-900 tracking-tight leading-[1.08]">
                      Transform Your Resume Into An <br className="hidden sm:inline" />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-emerald-400 to-indigo-400">
                        ATS High-Score Magnet
                      </span>
                    </h1>

                    <p className="text-base sm:text-lg text-slate-300 light:text-stone-700 leading-relaxed max-w-2xl">
                      Audit structural formatting, extract core technical stack density, match target job descriptions, and generate quantitative metric enhancements in seconds.
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <button
                        onClick={() => setCurrentTab('analyze')}
                        className="px-7 py-4 rounded-2xl font-display font-bold text-base text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-400 hover:opacity-95 shadow-xl shadow-amber-500/20 transition flex items-center gap-2 cursor-pointer group"
                      >
                        <FileUp className="w-5 h-5" />
                        <span>Upload Resume for AI Audit</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>

                      <button
                        onClick={() => setCurrentTab('history')}
                        className="px-6 py-4 rounded-2xl font-display font-semibold text-sm bg-slate-900/80 light:bg-white text-slate-200 light:text-stone-800 border border-slate-800 light:border-stone-300 hover:bg-slate-800 transition flex items-center gap-2"
                      >
                        <History className="w-4 h-4 text-amber-400" />
                        <span>View Saved History ({history.length})</span>
                      </button>
                    </div>
                  </div>
                </section>

                {/* Quick Analytics Summary Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  <div className="glass-card asym-card-1 p-6 border border-slate-800 light:border-stone-200 flex items-center gap-4">
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-display font-bold text-slate-100 light:text-stone-900">
                        {history.length > 0 ? `${Math.round(history.reduce((s, a) => s + a.atsScore, 0) / history.length)} PTS` : '85 PTS'}
                      </div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Average ATS Score
                      </div>
                    </div>
                  </div>

                  <div className="glass-card asym-card-2 p-6 border border-slate-800 light:border-stone-200 flex items-center gap-4">
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-400">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-display font-bold text-slate-100 light:text-stone-900">
                        94.2%
                      </div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Keyword Accuracy
                      </div>
                    </div>
                  </div>

                  <div className="glass-card asym-card-3 p-6 border border-slate-800 light:border-stone-200 flex items-center gap-4">
                    <div className="p-3.5 rounded-2xl bg-indigo-500/10 text-indigo-400">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-display font-bold text-slate-100 light:text-stone-900">
                        +24 PTS
                      </div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Avg Iteration Gain
                      </div>
                    </div>
                  </div>

                  <div className="glass-card rounded-3xl p-6 border border-slate-800 light:border-stone-200 flex items-center gap-4">
                    <div className="p-3.5 rounded-2xl bg-rose-500/10 text-rose-400">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="text-2xl font-display font-bold text-slate-100 light:text-stone-900">
                        Sub-3s
                      </div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        AI Gemini Audit
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bento Grid Architecture Feature Section */}
                <BentoGridSection onAnalyzeClick={() => setCurrentTab('analyze')} />

                {/* Editorial Story Narrative Section */}
                <EditorialStorySection />

                {/* Upload & Recent Activity Feed */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Left 2 Cols: Upload Tool */}
                  <div className="lg:col-span-2">
                    <UploadZone 
                      onAnalyze={handleRunAnalysis} 
                      isAnalyzing={isAnalyzing}
                    />
                  </div>

                  {/* Right Col: Recent Audits Activity Feed */}
                  <div className="glass-card rounded-3xl p-6 border border-slate-800 light:border-stone-200 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
                        <h3 className="font-display font-bold text-lg text-slate-100 light:text-stone-900 flex items-center gap-2">
                          <History className="w-5 h-5 text-amber-400" />
                          Recent Candidate Audits
                        </h3>
                        <button
                          onClick={() => setCurrentTab('history')}
                          className="text-xs text-amber-400 font-semibold hover:underline"
                        >
                          View All
                        </button>
                      </div>

                      <div className="space-y-3">
                        {history.slice(0, 4).map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              setActiveAnalysis(item);
                              setCurrentTab('result');
                            }}
                            className="p-3.5 rounded-2xl bg-slate-900/60 light:bg-stone-100 border border-slate-800/80 light:border-stone-200 hover:border-amber-500/40 cursor-pointer transition flex items-center justify-between group"
                          >
                            <div>
                              <div className="font-semibold text-xs text-slate-200 light:text-stone-900 group-hover:text-amber-400 transition-colors">
                                {item.candidateName}
                              </div>
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                {item.versionTag || 'v1.0'} • {new Date(item.createdAt).toLocaleDateString()}
                              </div>
                            </div>

                            <span className="px-2.5 py-1 rounded-lg text-xs font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              {item.atsScore} PTS
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800/80 mt-6 text-center">
                      <p className="text-xs text-slate-400">
                        Pro Tip: Include target Job Description text to highlight missing ATS keywords.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Feature Matrix: Traditional vs AuraCV AI Engine */}
                <section className="py-6 space-y-6">
                  <div className="text-center max-w-xl mx-auto space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                      Why AuraCV Outperforms Standard Tools
                    </span>
                    <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-100 light:text-stone-900">
                      Feature Comparison Matrix
                    </h2>
                  </div>

                  <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 light:border-stone-200 overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-slate-800 light:border-stone-200 text-slate-400 uppercase tracking-wider font-semibold">
                          <th className="py-4 px-4">Audit Capability</th>
                          <th className="py-4 px-4 text-slate-500">Traditional Resume Builders</th>
                          <th className="py-4 px-4 text-amber-400 font-bold bg-amber-500/5 rounded-t-xl">
                            AuraCV AI Engine
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 light:divide-stone-200">
                        <tr>
                          <td className="py-4 px-4 font-semibold text-slate-200 light:text-stone-800">
                            PDF Vector Buffer Extraction
                          </td>
                          <td className="py-4 px-4 text-slate-500">
                            <XIcon className="w-4 h-4 text-rose-500/80" />
                          </td>
                          <td className="py-4 px-4 bg-amber-500/5 text-emerald-400 font-bold flex items-center gap-1.5">
                            <Check className="w-4 h-4 text-emerald-400" /> Deep Buffer Parsing
                          </td>
                        </tr>
                        <tr>
                          <td className="py-4 px-4 font-semibold text-slate-200 light:text-stone-800">
                            Target JD Match Percentage
                          </td>
                          <td className="py-4 px-4 text-slate-500">Simple Word Match</td>
                          <td className="py-4 px-4 bg-amber-500/5 text-emerald-400 font-bold flex items-center gap-1.5">
                            <Check className="w-4 h-4 text-emerald-400" /> Contextual Semantic Mapping
                          </td>
                        </tr>
                        <tr>
                          <td className="py-4 px-4 font-semibold text-slate-200 light:text-stone-800">
                            AI Context Bullet Rewrites
                          </td>
                          <td className="py-4 px-4 text-slate-500">
                            <XIcon className="w-4 h-4 text-rose-500/80" />
                          </td>
                          <td className="py-4 px-4 bg-amber-500/5 text-emerald-400 font-bold flex items-center gap-1.5">
                            <Check className="w-4 h-4 text-emerald-400" /> Action-Oriented AI Prompts
                          </td>
                        </tr>
                        <tr>
                          <td className="py-4 px-4 font-semibold text-slate-200 light:text-stone-800">
                            Side-by-Side Version Evolution
                          </td>
                          <td className="py-4 px-4 text-slate-500">
                            <XIcon className="w-4 h-4 text-rose-500/80" />
                          </td>
                          <td className="py-4 px-4 bg-amber-500/5 text-emerald-400 font-bold flex items-center gap-1.5">
                            <Check className="w-4 h-4 text-emerald-400" /> Multi-Version Matrix
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* FAQ Section */}
                <FaqSection />
              </div>
            )}

            {/* TAB 2: UPLOAD & ANALYZE */}
            {currentTab === 'analyze' && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
                    Candidate Submission
                  </span>
                  <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-100 light:text-stone-900">
                    Upload Resume or Paste Text
                  </h2>
                  <p className="text-xs text-slate-400 light:text-stone-600">
                    Supports PDF, Docx, or raw text input with optional Job Description targeting.
                  </p>
                </div>

                <UploadZone 
                  onAnalyze={handleRunAnalysis} 
                  isAnalyzing={isAnalyzing}
                />
              </div>
            )}

            {/* TAB 3: ANALYSIS RESULT VIEW */}
            {currentTab === 'result' && (
              activeAnalysis ? (
                <AnalysisResultView
                  analysis={activeAnalysis}
                  onReAnalyze={() => setCurrentTab('analyze')}
                />
              ) : history.length > 0 ? (
                <AnalysisResultView
                  analysis={history[0]}
                  onReAnalyze={() => setCurrentTab('analyze')}
                />
              ) : (
                <div className="glass-card rounded-3xl p-8 border border-slate-800 light:border-stone-200 text-center space-y-4 max-w-lg mx-auto">
                  <p className="text-slate-300 light:text-stone-700 font-semibold text-sm">
                    No active resume analysis selected.
                  </p>
                  <button
                    onClick={() => setCurrentTab('analyze')}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition cursor-pointer"
                  >
                    Upload A Resume For AI Audit
                  </button>
                </div>
              )
            )}

            {/* TAB 4: HISTORY */}
            {currentTab === 'history' && (
              <HistoryView
                history={history}
                onSelectAnalysis={(item) => {
                  setActiveAnalysis(item);
                  setCurrentTab('result');
                }}
                onDeleteAnalysis={handleDeleteAnalysis}
                onCompareAnalyses={handleCompareAnalyses}
              />
            )}

            {/* TAB 5: COMPARE VERSIONS */}
            {currentTab === 'compare' && (
              <div className="space-y-6">
                <div className="glass-card rounded-3xl p-8 border border-slate-800 light:border-stone-200 max-w-2xl mx-auto text-center space-y-4">
                  <GitCompare className="w-12 h-12 text-amber-400 mx-auto" />
                  <h2 className="font-display font-bold text-2xl text-slate-100 light:text-stone-900">
                    Multi-Version Resume Comparison Engine
                  </h2>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Select 2 or more stored analyses from your candidate history to see side-by-side ATS score changes, keyword additions, and metric growth.
                  </p>
                  <button
                    onClick={() => setCurrentTab('history')}
                    className="px-6 py-3 rounded-xl text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition cursor-pointer"
                  >
                    Go to History & Select Versions
                  </button>
                </div>
              </div>
            )}

            {/* TAB 6: PROFILE */}
            {currentTab === 'profile' && user && (
              <ProfileView user={user} analyses={history} />
            )}

            {/* TAB 7: ADMIN ANALYTICS */}
            {currentTab === 'admin' && (
              <AdminDashboard />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Compare Modal */}
      {compareModalOpen && (
        <CompareVersionsModal
          analyses={compareList}
          onClose={() => setCompareModalOpen(false)}
        />
      )}

      {/* Auth Modal */}
      {authModalOpen && (
        <AuthModal
          onClose={() => setAuthModalOpen(false)}
          onSuccess={(loggedUser) => {
            setUser(loggedUser);
            fetchHistory();
          }}
        />
      )}

      {/* Bespoke Footer */}
      <footer className="mt-auto border-t border-slate-800/80 light:border-stone-200 glass-panel py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400 light:text-stone-600">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-stone-900 light:bg-stone-900 text-amber-400 flex items-center justify-center border border-stone-800 light:border-stone-700 shadow-sm">
              <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4">
                <rect x="5" y="5" width="22" height="22" rx="6" stroke="currentColor" strokeWidth="1.5" className="text-amber-500/30" />
                <path d="M10 22L16 10L22 22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400" />
                <path d="M12.5 17.5H19.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-emerald-400" />
              </svg>
            </div>
            <div>
              <span className="font-display font-bold text-slate-200 light:text-stone-800 text-sm tracking-tight">
                AURA<span className="font-serif-editorial italic font-normal text-amber-500 text-base ml-0.5">CV</span>
              </span>
              <span className="text-[11px] text-slate-400 block">Resume Architecture & ATS Engine v2.4</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <span className="hover:text-amber-400 transition cursor-pointer">Privacy & Data Governance</span>
            <span className="hover:text-amber-400 transition cursor-pointer">ATS Audit Schema Rules</span>
            <span className="hover:text-amber-400 transition cursor-pointer">Gemini AI API Status</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

