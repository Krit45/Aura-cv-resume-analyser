import React, { useState } from 'react';
import { motion } from 'motion/react';
import { api } from '../lib/api';
import {
  X,
  Sparkles,
  Copy,
  Check,
  Download,
  FileText,
  Send,
  Zap
} from 'lucide-react';

interface CoverLetterModalProps {
  resumeText: string;
  jobDescription?: string;
  candidateName: string;
  onClose: () => void;
}

export const CoverLetterModal: React.FC<CoverLetterModalProps> = ({
  resumeText,
  jobDescription = '',
  candidateName,
  onClose,
}) => {
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const letter = await api.generateCoverLetter({
        resumeText,
        jobDescription,
        candidateName,
      });
      setCoverLetter(letter);
    } catch (e) {
      console.error('Cover letter generation failed:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!coverLetter) return;
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadTxt = () => {
    if (!coverLetter) return;
    const blob = new Blob([coverLetter], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${candidateName.replace(/\s+/g, '_')}_Cover_Letter.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 light:bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-slate-950 light:bg-white border border-slate-800 light:border-stone-300 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-auto max-h-[90vh] flex flex-col overflow-hidden space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 light:border-stone-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono font-bold text-indigo-400 uppercase tracking-wider block">
                Enhanced AI Cover Letter Engine
              </span>
              <h2 className="font-display font-black text-xl text-slate-100 light:text-stone-900">
                Generate Aligned Executive Cover Letter
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

        {/* Content Area */}
        {!coverLetter ? (
          <div className="space-y-6 text-center py-8">
            <div className="max-w-md mx-auto space-y-3">
              <Sparkles className="w-10 h-10 text-indigo-400 mx-auto animate-pulse" />
              <h3 className="font-display font-extrabold text-lg text-slate-100 light:text-stone-900">
                Craft a Cover Letter Tailored to Your Candidate Profile
              </h3>
              <p className="text-xs text-slate-400 light:text-stone-600 leading-relaxed">
                Uses candidate achievement metrics extracted from your resume and matches the tone of your target job description.
              </p>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-8 py-3.5 rounded-2xl font-display font-extrabold text-xs text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-indigo-400 hover:opacity-95 transition shadow-xl shadow-amber-500/10 cursor-pointer inline-flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>{isGenerating ? 'Writing Cover Letter...' : 'Generate AI Cover Letter Now'}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                Cover Letter Ready
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 light:bg-stone-100 text-slate-300 light:text-stone-800 text-xs font-semibold hover:text-emerald-400 cursor-pointer border border-slate-700 light:border-stone-300"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Text'}</span>
                </button>

                <button
                  onClick={handleDownloadTxt}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-400 text-xs font-bold hover:bg-indigo-500/20 cursor-pointer border border-indigo-500/30"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .TXT</span>
                </button>
              </div>
            </div>

            <textarea
              rows={12}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-900/80 light:bg-stone-50 text-slate-100 light:text-stone-900 border border-slate-800 light:border-stone-300 text-xs leading-relaxed font-sans focus:outline-none focus:border-indigo-500 overflow-y-auto flex-1"
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};
