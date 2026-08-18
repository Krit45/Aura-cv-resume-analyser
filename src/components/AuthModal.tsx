import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../lib/api';
import { User } from '../types';
import { Mail, Lock, User as UserIcon, X, ArrowRight, KeyRound, Sparkles } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await api.login({ email, password });
        onSuccess(res.user);
      } else {
        const res = await api.register({ name, email, password, targetRole });
        onSuccess(res.user);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 light:bg-stone-900/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="glass-panel p-6 sm:p-10 max-w-lg w-full border border-slate-800 light:border-stone-300 shadow-2xl relative overflow-hidden my-auto rounded-[2.5rem] asym-card-1"
      >
        {/* Organic Decorative Hand-crafted Elements */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-500/10 light:bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-emerald-500/10 light:bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Top Close Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-2xl text-slate-400 light:text-stone-600 hover:text-slate-100 light:hover:text-stone-900 hover:bg-slate-800/80 light:hover:bg-stone-200 transition cursor-pointer z-10 border border-transparent hover:border-slate-700 light:hover:border-stone-300"
        >
          <X className="w-5 h-5" />
        </motion.button>

        {/* Editorial Brand Header */}
        <div className="space-y-3 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 light:text-amber-600 bg-amber-500/10 light:bg-amber-500/15 px-3 py-1 rounded-full border border-amber-500/20">
              AUDIT ACCESS GATE
            </span>
            <span className="text-[10px] font-mono text-slate-400 light:text-stone-500">
              // AUTH_v2.4
            </span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-100 light:text-stone-900 tracking-tight leading-tight">
            {mode === 'login' ? (
              <>
                Candidate <span className="font-serif-editorial italic font-normal text-amber-400 light:text-amber-600">Sign In</span>
              </>
            ) : (
              <>
                Engine <span className="font-serif-editorial italic font-normal text-emerald-400 light:text-emerald-600">Registration</span>
              </>
            )}
          </h2>

          <p className="text-xs text-slate-300 light:text-stone-700 leading-relaxed max-w-sm">
            {mode === 'login'
              ? 'Access saved ATS score histories, side-by-side versions, and targeted job keyword matches.'
              : 'Setup your candidate account to unlock real-time Gemini parsing and ATS optimization tools.'}
          </p>
        </div>

        {/* Bespoke Interactive Tab Switcher */}
        <div className="flex p-1.5 rounded-2xl bg-slate-900/90 light:bg-stone-200/80 border border-slate-800/80 light:border-stone-300 mb-6 relative">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors relative z-10 cursor-pointer ${
              mode === 'login'
                ? 'text-slate-950 light:text-slate-950 font-black'
                : 'text-slate-400 light:text-stone-600 hover:text-slate-200'
            }`}
          >
            {mode === 'login' && (
              <motion.div
                layoutId="active-auth-tab"
                className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl shadow-md"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" />
              Sign In
            </span>
          </button>

          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors relative z-10 cursor-pointer ${
              mode === 'register'
                ? 'text-slate-950 light:text-slate-950 font-black'
                : 'text-slate-400 light:text-stone-600 hover:text-slate-200'
            }`}
          >
            {mode === 'register' && (
              <motion.div
                layoutId="active-auth-tab"
                className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-xl shadow-md"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Register
            </span>
          </button>
        </div>

        {/* Dynamic Animated Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.08,
                    delayChildren: 0.02,
                  },
                },
                exit: { opacity: 0, y: -8, transition: { duration: 0.15 } }
              }}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              {mode === 'register' && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 25 } }
                  }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-300 light:text-stone-800">Full Name</label>
                    <span className="text-[10px] font-mono text-slate-500">FIELD // 01</span>
                  </div>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="Elena Rostova"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900/90 light:bg-white border border-slate-800 light:border-stone-300 text-slate-100 light:text-stone-900 text-xs focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                    />
                  </div>
                </motion.div>
              )}

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 25 } }
                }}
              >
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-300 light:text-stone-800">Email Address</label>
                  <span className="text-[10px] font-mono text-slate-500">
                    {mode === 'register' ? 'FIELD // 02' : 'FIELD // 01'}
                  </span>
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="candidate@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900/90 light:bg-white border border-slate-800 light:border-stone-300 text-slate-100 light:text-stone-900 text-xs focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                  />
                </div>
              </motion.div>

              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 14 },
                  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 25 } }
                }}
              >
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-300 light:text-stone-800">Password</label>
                  <span className="text-[10px] font-mono text-slate-500">
                    {mode === 'register' ? 'FIELD // 03' : 'FIELD // 02'}
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-900/90 light:bg-white border border-slate-800 light:border-stone-300 text-slate-100 light:text-stone-900 text-xs focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                  />
                </div>
              </motion.div>

              {mode === 'register' && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 25 } }
                  }}
                >
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-300 light:text-stone-800">
                      Target Job Role <span className="font-normal text-slate-500">(Optional)</span>
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">FIELD // 04</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Senior Staff Engineer"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-900/90 light:bg-white border border-slate-800 light:border-stone-300 text-slate-100 light:text-stone-900 text-xs focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
                  />
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-2xl bg-rose-500/10 light:bg-rose-50 border border-rose-500/30 text-rose-400 light:text-rose-700 text-xs font-medium"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 rounded-2xl font-display font-black text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'login'
                ? 'text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-amber-500/20'
                : 'text-slate-950 bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 shadow-emerald-500/20'
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                Authenticating...
              </span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Authorize Session' : 'Create Candidate Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer info note */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 light:border-stone-300/80 text-center text-xs text-slate-400 light:text-stone-600">
          <p>
            {mode === 'login' ? (
              <>
                Need an account?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(null); }}
                  className="text-amber-400 light:text-amber-700 font-bold hover:underline cursor-pointer ml-1"
                >
                  Register here
                </button>
              </>
            ) : (
              <>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(null); }}
                  className="text-emerald-400 light:text-emerald-700 font-bold hover:underline cursor-pointer ml-1"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

