import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, Sparkles, ShieldCheck, FileCheck, Layers } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  tag: string;
}

export const FaqSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const faqs: FaqItem[] = [
    {
      id: 'faq-1',
      question: 'How does AuraCV analyze complex resume formats and tables?',
      answer: 'AuraCV uses direct buffer text extraction via pdf-parse and Mammoth docx modules, paired with Gemini structured JSON schema analysis. It extracts hidden table contents, header elements, and multi-column text blocks into unified clean semantic sections.',
      tag: 'Parsing Tech',
    },
    {
      id: 'faq-2',
      question: 'What makes the Job Description (JD) Keyword Matcher so effective?',
      answer: 'Rather than simple exact string searching, our engine measures semantic importance, domain relevance, and context alignment. It identifies high-impact keywords missing from your experience bullets and provides ready-to-paste AI rewrites.',
      tag: 'ATS Optimization',
    },
    {
      id: 'faq-3',
      question: 'Why is an ATS Score above 80 PTS critical for tech & enterprise roles?',
      answer: 'Top employers receive thousands of submissions per job posting. Automated Applicant Tracking Systems (e.g. Workday, Greenhouse, Lever) automatically rank resumes based on keyword density, action verb strength, and metric quantification.',
      tag: 'Recruiter Insights',
    },
    {
      id: 'faq-4',
      question: 'Can I track and compare my resume iterations over time?',
      answer: 'Yes! Every scan you run is stored securely in your candidate history. You can select multiple versions to view side-by-side ATS score gains, keyword additions, and quantifiable metric growth.',
      tag: 'Version History',
    },
  ];

  return (
    <section className="py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Expert Knowledge Base</span>
          </div>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-100 light:text-stone-900 tracking-tight">
            Frequently Asked <span className="text-amber-400">Questions</span>
          </h2>
        </div>
        <p className="text-xs text-slate-400 light:text-stone-600 max-w-md">
          Understanding automated recruitment algorithms, ATS parser mechanics, and optimizing your candidacy.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className={`rounded-2xl transition-all duration-300 border ${
                isOpen
                  ? 'bg-slate-900/90 light:bg-white border-amber-500/40 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-900/40 light:bg-stone-100 border-slate-800/80 light:border-stone-200 hover:border-slate-700'
              }`}
            >
              <button
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                    {faq.tag}
                  </span>
                  <h3 className="font-display font-bold text-base sm:text-lg text-slate-100 light:text-stone-900">
                    {faq.question}
                  </h3>
                </div>

                <div className={`p-2 rounded-xl transition-transform duration-300 shrink-0 ${isOpen ? 'bg-amber-500/20 text-amber-400 rotate-180' : 'bg-slate-800 text-slate-400'}`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-6 sm:px-6 pt-0 text-xs sm:text-sm text-slate-300 light:text-stone-700 leading-relaxed border-t border-slate-800/60 light:border-stone-200 mt-2">
                      <p className="pt-4">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};
