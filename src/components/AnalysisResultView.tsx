import React, { useState, useRef, useEffect, FC } from 'react';
import { ResumeAnalysis } from '../types';
import { AtsScoreGauge } from './AtsScoreGauge';
import { JdMatchTab } from './JdMatchTab';
import { ChartsView } from './ChartsView';
import { BulletRewriterModal } from './BulletRewriterModal';
import { CoverLetterModal } from './CoverLetterModal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { sanitizeClonedDocumentForPdf } from '../lib/pdfUtils';
import { cleanFirstPersonPronouns } from '../lib/pronounUtils';
import {
  Download,
  Sparkles,
  Lightbulb,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Award,
  CheckCircle2,
  FileText,
  Target,
  BarChart2,
  ArrowRight,
  Printer,
  Zap,
  Sliders,
  Send
} from 'lucide-react';

interface AnalysisResultViewProps {
  analysis: ResumeAnalysis;
  onReAnalyze?: () => void;
}

export const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({ analysis, onReAnalyze }: AnalysisResultViewProps) => {
  const [displayAnalysis, setDisplayAnalysis] = useState<ResumeAnalysis>(analysis);
  const [activeTab, setActiveTab] = useState<'suggestions' | 'jd' | 'charts' | 'parsed'>('suggestions');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [showRewriter, setShowRewriter] = useState(false);
  const [rewriterInitialBullet, setRewriterInitialBullet] = useState<string>('');
  const [showCoverLetter, setShowCoverLetter] = useState(false);

  useEffect(() => {
    setDisplayAnalysis(analysis);
  }, [analysis]);

  const handleCleanAllPronouns = () => {
    setDisplayAnalysis((prev: ResumeAnalysis) => ({
      ...prev,
      rawText: cleanFirstPersonPronouns(prev.rawText),
      summary: cleanFirstPersonPronouns(prev.summary),
      extractedExperience: (prev.extractedExperience || []).map((exp) => ({
        ...exp,
        achievements: (exp.achievements || []).map((ach) => cleanFirstPersonPronouns(ach)),
      })),
      extractedProjects: (prev.extractedProjects || []).map((proj) => ({
        ...proj,
        description: proj.description ? cleanFirstPersonPronouns(proj.description) : proj.description,
        metrics: proj.metrics ? cleanFirstPersonPronouns(proj.metrics) : proj.metrics,
      })),
    }));
  };

  const pdfContainerRef = useRef<HTMLDivElement>(null);

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    try {
      if (!pdfContainerRef.current) return;
      const canvas = await html2canvas(pdfContainerRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: sanitizeClonedDocumentForPdf,
      });
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pdfWidth = 210;
      const pdfHeight = 297;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      if (imgHeight <= pdfHeight) {
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
      } else {
        // Fit proportionately onto single clean page if close, or 2 pages with smooth offset
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      }

      pdf.save(`${analysis.candidateName.replace(/\s+/g, '_')}_AuraCV_ATS_Report.pdf`);
    } catch (e) {
      console.error('PDF export failed:', e);
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  const openRewriterWith = (bulletText?: string) => {
    setRewriterInitialBullet(bulletText || '');
    setShowRewriter(true);
  };

  return (
    <div className="space-y-8" ref={pdfContainerRef}>
      
      {/* Top Candidate & ATS Score Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 light:border-stone-200 shadow-2xl relative overflow-hidden">
        
        {/* Glow ambient background orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Candidate Overview */}
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AI Audit Complete
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300">
                File: {displayAnalysis.filename}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300">
                {displayAnalysis.versionTag || 'v1.0'}
              </span>
            </div>

            <div>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-100 light:text-stone-900 tracking-tight">
                {displayAnalysis.candidateName}
              </h1>
              <p className="text-sm text-slate-300 light:text-stone-700 mt-2 leading-relaxed">
                {displayAnalysis.summary}
              </p>
            </div>

            {/* Quick Action Tools */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleExportPdf}
                disabled={isExportingPdf}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20 transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                {isExportingPdf ? 'Generating Executive PDF...' : 'Download Full PDF Audit Report'}
              </button>

              <button
                onClick={() => openRewriterWith()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 transition cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>AI Bullet Rewriter</span>
              </button>

              <button
                onClick={() => setShowCoverLetter(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20 transition cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>AI Cover Letter</span>
              </button>

              {onReAnalyze && (
                <button
                  onClick={onReAnalyze}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 transition"
                >
                  Analyze New File
                </button>
              )}
            </div>
          </div>

          {/* ATS Gauge Widget */}
          <div className="w-full lg:w-auto shrink-0 bg-slate-900/60 light:bg-stone-100/80 p-6 rounded-3xl border border-slate-800 light:border-stone-200">
            <AtsScoreGauge score={displayAnalysis.atsScore} metricBreakdown={displayAnalysis.metricBreakdown} />
          </div>
        </div>
      </div>

      {/* Navigation Tabs for Analysis View */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/80 light:bg-stone-200/60 rounded-2xl border border-slate-800 light:border-stone-300">
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'suggestions'
              ? 'bg-slate-800 light:bg-white text-amber-400 light:text-stone-900 shadow-md'
              : 'text-slate-400 light:text-stone-600 hover:text-slate-200'
          }`}
        >
          <Lightbulb className="w-4 h-4" />
          AI Recommendations ({(displayAnalysis.aiSuggestions || []).length})
        </button>

        <button
          onClick={() => setActiveTab('jd')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'jd'
              ? 'bg-slate-800 light:bg-white text-amber-400 light:text-stone-900 shadow-md'
              : 'text-slate-400 light:text-stone-600 hover:text-slate-200'
          }`}
        >
          <Target className="w-4 h-4" />
          Job Description Match
          {displayAnalysis.jdComparison && (
            <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-400 font-extrabold">
              {displayAnalysis.jdComparison.matchScore}%
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('charts')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'charts'
              ? 'bg-slate-800 light:bg-white text-amber-400 light:text-stone-900 shadow-md'
              : 'text-slate-400 light:text-stone-600 hover:text-slate-200'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          Skill Analytics & Charts
        </button>

        <button
          onClick={() => setActiveTab('parsed')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'parsed'
              ? 'bg-slate-800 light:bg-white text-amber-400 light:text-stone-900 shadow-md'
              : 'text-slate-400 light:text-stone-600 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          Extracted Sections Breakdown
        </button>
      </div>

      {/* Tab 1: AI Suggestions */}
      {activeTab === 'suggestions' && (
        <div className="space-y-6">
          <div className="space-y-4">
            {(displayAnalysis.aiSuggestions || []).map((sug) => {
              let badgeClass = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
              if (sug.type === 'critical') badgeClass = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
              if (sug.type === 'enhancement') badgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

              return (
                <div
                  key={sug.id}
                  className="glass-card rounded-3xl p-6 border border-slate-800 light:border-stone-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${badgeClass}`}>
                        {sug.type}
                      </span>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Section: {sug.section}
                      </span>
                    </div>

                    {sug.exampleBeforeAfter && (
                      <button
                        onClick={() => openRewriterWith(sug.exampleBeforeAfter?.before)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30 hover:bg-amber-500/20 cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Rewrite with AI</span>
                      </button>
                    )}
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-base text-slate-100 light:text-stone-900">
                      {sug.title}
                    </h3>
                    <p className="text-xs text-slate-300 light:text-stone-700 mt-1">
                      <strong className="text-slate-200">Weakness:</strong> {sug.issue}
                    </p>
                    <p className="text-xs text-emerald-400 light:text-emerald-700 mt-1">
                      <strong className="text-emerald-300">Action:</strong> {sug.recommendation}
                    </p>
                  </div>

                  {/* Before / After Rewrite Card */}
                  {sug.exampleBeforeAfter && (
                    <div className="mt-3 p-4 rounded-2xl bg-slate-900/80 light:bg-stone-100 border border-slate-800/80 light:border-stone-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-rose-400 mb-1">
                          Original Phrasing
                        </div>
                        <p className="text-xs text-slate-300 light:text-stone-700 italic">
                          "{sug.exampleBeforeAfter.before}"
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          AI Optimized Bullet
                        </div>
                        <p className="text-xs text-emerald-200 light:text-emerald-900 font-medium">
                          "{sug.exampleBeforeAfter.after}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Job Description Match */}
      {activeTab === 'jd' && <JdMatchTab jdComparison={displayAnalysis.jdComparison} />}

      {/* Tab 3: Charts */}
      {activeTab === 'charts' && <ChartsView analysis={displayAnalysis} />}

      {/* Tab 4: Parsed Sections */}
      {activeTab === 'parsed' && (
        <div className="space-y-6">
          
          {/* Extracted Skills */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 light:border-stone-200 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800/80 light:border-stone-200 pb-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="font-display font-bold text-lg text-slate-100 light:text-stone-900">
                Extracted Skills Matrix
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(displayAnalysis.extractedSkills || []).map((cat, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 light:bg-stone-100 border border-slate-800 light:border-stone-200">
                  <h4 className="font-semibold text-xs text-amber-400 uppercase tracking-wider mb-2">
                    {cat.category}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(cat.skills || []).map((s, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 light:bg-white text-slate-200 light:text-stone-800 text-xs border border-slate-700/60 light:border-stone-300"
                      >
                        {s.name} <span className="text-[10px] text-slate-400">({s.level})</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Extracted Work Experience */}
          <div className="glass-card rounded-3xl p-6 border border-slate-800 light:border-stone-200 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800/80 light:border-stone-200 pb-3">
              <Briefcase className="w-5 h-5 text-emerald-400" />
              <h3 className="font-display font-bold text-lg text-slate-100 light:text-stone-900">
                Work Experience & Action Verbs
              </h3>
            </div>

            <div className="space-y-4">
              {(displayAnalysis.extractedExperience || []).map((exp, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 light:bg-stone-100 border border-slate-800 light:border-stone-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <h4 className="font-semibold text-base text-slate-100 light:text-stone-900">
                      {exp.title} <span className="text-slate-400 font-normal">at {exp.company}</span>
                    </h4>
                    <span className="text-xs font-semibold text-amber-400">{exp.duration}</span>
                  </div>

                  <ul className="space-y-2 list-none text-xs text-slate-300 light:text-stone-700">
                    {(exp.achievements || []).map((ach, i) => (
                      <li key={i} className="flex items-start justify-between gap-3 p-2 rounded-xl bg-slate-900/40 light:bg-stone-50 border border-slate-800/40 light:border-stone-200">
                        <span>• {ach}</span>
                        <button
                          onClick={() => openRewriterWith(ach)}
                          className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 text-amber-400 text-[10px] font-bold hover:bg-amber-500/20 cursor-pointer border border-amber-500/20"
                        >
                          <Zap className="w-3 h-3" />
                          <span>Rewrite</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Extracted Education & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card rounded-3xl p-6 border border-slate-800 light:border-stone-200 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800/80 light:border-stone-200 pb-3">
                <GraduationCap className="w-5 h-5 text-indigo-400" />
                <h3 className="font-display font-bold text-lg text-slate-100 light:text-stone-900">
                  Education
                </h3>
              </div>

              {(displayAnalysis.extractedEducation || []).map((edu, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/60 light:bg-stone-100">
                  <div className="font-semibold text-sm text-slate-200 light:text-stone-900">{edu.degree}</div>
                  <div className="text-xs text-slate-400 light:text-stone-600">{edu.institution} • {edu.year}</div>
                  {edu.gpaOrHonors && (
                    <div className="text-xs text-amber-400 font-medium mt-1">{edu.gpaOrHonors}</div>
                  )}
                </div>
              ))}
            </div>

            <div className="glass-card rounded-3xl p-6 border border-slate-800 light:border-stone-200 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800/80 light:border-stone-200 pb-3">
                <Award className="w-5 h-5 text-amber-400" />
                <h3 className="font-display font-bold text-lg text-slate-100 light:text-stone-900">
                  Certifications
                </h3>
              </div>

              {(displayAnalysis.extractedCertifications || []).map((cert, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/60 light:bg-stone-100">
                  <div className="font-semibold text-sm text-slate-200 light:text-stone-900">{cert.title}</div>
                  <div className="text-xs text-slate-400 light:text-stone-600">{cert.issuer} {cert.year && `• ${cert.year}`}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showRewriter && (
        <BulletRewriterModal
          initialBullet={rewriterInitialBullet}
          onClose={() => setShowRewriter(false)}
        />
      )}

      {showCoverLetter && (
        <CoverLetterModal
          resumeText={displayAnalysis.rawText}
          jobDescription={displayAnalysis.jobDescriptionPasted}
          candidateName={displayAnalysis.candidateName}
          onClose={() => setShowCoverLetter(false)}
        />
      )}
    </div>
  );
};

