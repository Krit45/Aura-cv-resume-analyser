import React, { useState, useRef } from 'react';
import { FileUp, FileText, Briefcase, Sparkles, AlertCircle, CheckCircle2, Upload, RefreshCw } from 'lucide-react';

interface UploadZoneProps {
  onAnalyze: (formData: FormData) => Promise<void>;
  isAnalyzing: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ 
  onAnalyze, 
  isAnalyzing,
}) => {
  const [activeTab, setActiveTab] = useState<'file' | 'text'>('file');
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [candidateName, setCandidateName] = useState<string>('');
  const [versionTag, setVersionTag] = useState<string>('v1.0 - Initial Scan');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  const validateAndSetFile = (f: File) => {
    setErrorMessage(null);
    const ext = f.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx' && ext !== 'doc' && ext !== 'txt') {
      setErrorMessage('Please upload a PDF, DOCX, or TXT file.');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds 10MB limit.');
      return;
    }
    setFile(f);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (activeTab === 'file' && !file) {
      setErrorMessage('Please select or drop a resume file (PDF or DOCX).');
      return;
    }

    if (activeTab === 'text' && (!resumeText || resumeText.trim().length < 30)) {
      setErrorMessage('Please paste at least 30 characters of resume text.');
      return;
    }

    const formData = new FormData();
    if (activeTab === 'file' && file) {
      formData.append('resumeFile', file);
    } else {
      formData.append('resumeText', resumeText);
    }

    if (jobDescription.trim()) {
      formData.append('jobDescription', jobDescription);
    }

    if (candidateName.trim()) {
      formData.append('candidateName', candidateName);
    }

    if (versionTag.trim()) {
      formData.append('versionTag', versionTag);
    }

    try {
      await onAnalyze(formData);
    } catch (err: any) {
      setErrorMessage(err.message || 'Analysis failed. Please check file format.');
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 light:border-stone-200 shadow-2xl relative overflow-hidden">
      
      {/* Background Subtle Gradient */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="font-display font-bold text-2xl text-slate-100 light:text-stone-900">
              AI Resume Audit & ATS Matcher
            </h2>
          </div>
          <p className="text-sm text-slate-400 light:text-stone-600">
            Upload your resume and target job description for instant deep ATS scoring & AI improvement tips.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Candidate Metadata Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 light:text-stone-700 mb-1.5">
              Candidate Name (Optional)
            </label>
            <input
              type="text"
              placeholder="Alex Mercer"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 light:bg-white border border-slate-800 light:border-stone-300 text-slate-200 light:text-stone-900 focus:outline-none focus:border-amber-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 light:text-stone-700 mb-1.5">
              Resume Version Tag
            </label>
            <input
              type="text"
              placeholder="v1.2 - FinTech Target"
              value={versionTag}
              onChange={(e) => setVersionTag(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 light:bg-white border border-slate-800 light:border-stone-300 text-slate-200 light:text-stone-900 focus:outline-none focus:border-amber-500 text-sm"
            />
          </div>
        </div>

        {/* Mode Selector Tabs (File Upload vs Text Paste) */}
        <div>
          <div className="flex items-center gap-2 p-1 bg-slate-900/80 light:bg-stone-200/60 rounded-xl max-w-md border border-slate-800 light:border-stone-300 mb-4">
            <button
              type="button"
              onClick={() => setActiveTab('file')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'file'
                  ? 'bg-slate-800 light:bg-white text-amber-400 light:text-stone-900 shadow-sm'
                  : 'text-slate-400 light:text-stone-600 hover:text-slate-200'
              }`}
            >
              <FileUp className="w-4 h-4" />
              Upload PDF / DOCX
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('text')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'text'
                  ? 'bg-slate-800 light:bg-white text-amber-400 light:text-stone-900 shadow-sm'
                  : 'text-slate-400 light:text-stone-600 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              Paste Text Directly
            </button>
          </div>

          {/* Tab 1: Drag & Drop Zone */}
          {activeTab === 'file' ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                dragActive
                  ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
                  : file
                  ? 'border-emerald-500/50 bg-emerald-500/5'
                  : 'border-slate-800 light:border-stone-300 hover:border-slate-700 bg-slate-900/40 light:bg-stone-50'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.docx,.doc,.txt"
                className="hidden"
              />

              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <span className="font-semibold text-slate-200 light:text-stone-900 text-sm">
                    {file.name}
                  </span>
                  <span className="text-xs text-slate-400 light:text-stone-500">
                    {(file.size / 1024).toFixed(1)} KB • Click or drag to replace
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-200 light:text-stone-800 text-sm">
                      Drop your resume here, or <span className="text-amber-400 underline">browse</span>
                    </p>
                    <p className="text-xs text-slate-400 light:text-stone-500 mt-1">
                      Supports PDF, DOCX, DOC, or TXT up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <textarea
                rows={8}
                placeholder="Paste your complete resume text here (including Work Experience, Skills, Education)..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full p-4 rounded-2xl bg-slate-900/80 light:bg-white border border-slate-800 light:border-stone-300 text-slate-200 light:text-stone-900 text-xs font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          )}
        </div>

        {/* Target Job Description Section */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 light:text-stone-700">
              Target Job Description (Recommended for Keyword Matcher)
            </label>
          </div>
          <textarea
            rows={4}
            placeholder="Paste target job posting here to extract missing critical keywords, match percentage, and customized AI suggestions..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="w-full p-4 rounded-2xl bg-slate-900/80 light:bg-white border border-slate-800 light:border-stone-300 text-slate-200 light:text-stone-900 text-xs focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Action Button */}
        <button
          type="submit"
          disabled={isAnalyzing}
          className="w-full py-4 rounded-2xl font-display font-bold text-base text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-emerald-400 hover:opacity-95 shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin text-slate-950" />
              <span>Analyzing Resume & Extracting AI Insights...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 fill-slate-950" />
              <span>Run AI ATS Audit & Keyword Matcher</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
