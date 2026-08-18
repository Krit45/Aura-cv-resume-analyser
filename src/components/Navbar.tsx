import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../types';
import { 
  Sparkles, 
  LayoutDashboard, 
  FileUp, 
  History, 
  GitCompare, 
  ShieldCheck, 
  User as UserIcon, 
  LogOut, 
  LogIn,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  user,
  onOpenAuth,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analyze', label: 'Analyze Resume', icon: FileUp, highlight: true },
    { id: 'history', label: 'History & Search', icon: History },
    { id: 'compare', label: 'Compare Versions', icon: GitCompare },
    ...(user?.role === 'admin' ? [{ id: 'admin', label: 'Admin Analytics', icon: ShieldCheck }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 light:border-stone-200 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => {
            setCurrentTab('dashboard');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2.5 sm:gap-3.5 cursor-pointer group shrink-0"
        >
          <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-stone-900 light:bg-stone-900 text-amber-400 flex items-center justify-center border border-stone-800 light:border-stone-700 shadow-md group-hover:border-amber-500/50 group-hover:scale-105 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-emerald-500/10 pointer-events-none" />
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 sm:w-6 sm:h-6 relative z-10">
              <rect x="5" y="5" width="22" height="22" rx="6" stroke="currentColor" strokeWidth="1.5" className="text-amber-500/30" />
              <path d="M10 22L16 10L22 22" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400" />
              <path d="M12.5 17.5H19.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-emerald-400" />
              <circle cx="21" cy="9" r="1.5" fill="currentColor" className="text-amber-400" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-slate-100 light:text-stone-900">
                AURA<span className="font-serif-editorial italic font-normal text-amber-500 light:text-amber-600 text-xl sm:text-2xl ml-0.5">CV</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-mono font-bold tracking-widest uppercase rounded-md bg-stone-900 light:bg-stone-200 text-slate-400 light:text-stone-700 border border-stone-800 light:border-stone-300">
                v2.4 AUDIT
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400 light:text-stone-500 hidden md:block tracking-wide">
              Resume Architecture & ATS Engine
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/60 light:bg-stone-100 p-1.5 rounded-2xl border border-slate-800/80 light:border-stone-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-slate-800 light:bg-white text-amber-400 light:text-stone-900 shadow-md border border-slate-700/50 light:border-stone-200 font-bold'
                    : 'text-slate-400 light:text-stone-600 hover:text-slate-200 light:hover:text-stone-900 hover:bg-slate-800/40 light:hover:bg-stone-200/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400 light:text-stone-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Tools & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-3">

          {/* User Profile or Login */}
          {user ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => {
                  setCurrentTab('profile');
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 p-1.5 sm:pr-3 rounded-2xl border transition cursor-pointer ${
                  currentTab === 'profile'
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-slate-900/80 light:bg-stone-100 border-slate-800 light:border-stone-200 hover:border-slate-700'
                }`}
              >
                <img
                  src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover border border-amber-500/30"
                />
                <div className="text-left hidden md:block">
                  <div className="text-xs font-bold text-slate-200 light:text-stone-800 leading-tight">
                    {user.name}
                  </div>
                  <div className="text-[10px] text-slate-400 light:text-stone-500 capitalize">
                    {user.role}
                  </div>
                </div>
              </button>
              
              <button
                onClick={onLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer hidden sm:block"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 shadow-md shadow-amber-500/20 transition cursor-pointer shrink-0"
            >
              <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Sign In</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-300 light:text-stone-700 hover:bg-slate-800/80 light:hover:bg-stone-200 transition cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* Animated Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="lg:hidden border-t border-slate-800/90 light:border-stone-300 bg-slate-950/95 light:bg-stone-50/95 backdrop-blur-2xl px-4 pt-4 pb-6 space-y-4 shadow-2xl overflow-hidden"
          >
            {/* User card header inside mobile drawer if logged in */}
            {user && (
              <div 
                onClick={() => {
                  setCurrentTab('profile');
                  setMobileMenuOpen(false);
                }}
                className="p-3.5 rounded-2xl bg-slate-900/90 light:bg-stone-200/80 border border-slate-800 light:border-stone-300 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                    alt={user.name}
                    className="w-10 h-10 rounded-xl object-cover border border-amber-500/40"
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-100 light:text-stone-900">
                      {user.name}
                    </div>
                    <div className="text-xs text-slate-400 light:text-stone-600">
                      {user.email}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-500" />
              </div>
            )}

            {/* Navigation Section */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 light:text-stone-500 px-2 mb-2">
                MAIN NAVIGATION
              </div>

              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    onClick={() => {
                      setCurrentTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-amber-500/15 light:bg-amber-500/20 text-amber-400 light:text-amber-800 border border-amber-500/30 shadow-sm'
                        : 'text-slate-300 light:text-stone-800 hover:bg-slate-900 light:hover:bg-stone-200/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-amber-400 light:text-amber-700' : 'text-slate-400 light:text-stone-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 light:bg-amber-600 shadow-sm shadow-amber-400" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Account Action Footer inside Mobile Drawer */}
            {user && (
              <div className="pt-2 border-t border-slate-800/80 light:border-stone-200">
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2.5 w-full px-4 py-3 rounded-2xl text-sm font-bold text-rose-400 light:text-rose-700 hover:bg-rose-500/10 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out Account</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

