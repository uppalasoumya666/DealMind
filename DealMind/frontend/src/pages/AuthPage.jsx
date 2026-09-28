import React, { useState } from 'react';
import { Brain, Sparkles, Lock, Mail, User, Building, ArrowRight, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';

export default function AuthPage({ onLoginSuccess }) {
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [email, setEmail] = useState('soumya@dealmind.ai');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Soumya Uppala');
  const [company, setCompany] = useState('Enterprise Sales Ops');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const user = {
        name: mode === 'signup' ? name : 'Soumya Uppala',
        email,
        company: mode === 'signup' ? company : 'Acme Enterprise Sales',
        role: 'Senior Account Executive',
        avatar: 'SU',
        token: 'dealmind_jwt_token_' + Date.now(),
      };
      localStorage.setItem('dealmind_user', JSON.stringify(user));
      setLoading(false);
      onLoginSuccess(user);
    }, 600);
  };

  const handleQuickDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const demoUser = {
        name: 'Soumya Uppala',
        email: 'soumya@dealmind.ai',
        company: 'Acme Enterprise Sales',
        role: 'Lead Account Executive',
        avatar: 'SU',
        token: 'dealmind_demo_token_123',
      };
      localStorage.setItem('dealmind_user', JSON.stringify(demoUser));
      setLoading(false);
      onLoginSuccess(demoUser);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 shadow-xl shadow-indigo-500/30 mb-4 animate-pulse-glow">
            <Brain className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
            DealMind
            <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/30">
              Agentic Memory
            </span>
          </h1>
          <p className="mt-2 text-xs text-slate-400">
            Sign in to access your AI sales intelligence agent powered by Hindsight Cloud.
          </p>
        </div>

        {/* 1-Click Fast Demo Login Pill */}
        <div className="mb-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900/90 to-purple-950/40 p-4 backdrop-blur-md text-center shadow-lg">
          <p className="text-xs text-indigo-200 mb-2.5 font-medium flex items-center justify-center gap-1.5">
            <Zap className="h-4 w-4 text-amber-400" />
            <span>Fast-track evaluator access</span>
          </p>
          <button
            onClick={handleQuickDemoLogin}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>1-Click Demo Login as Soumya (Sales Rep)</span>
          </button>
        </div>

        {/* Auth Card */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-7 backdrop-blur-xl shadow-2xl">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-950/80 p-1 mb-6 border border-slate-800">
            <button
              onClick={() => setMode('signin')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signin'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'signup'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="h-4 w-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Soumya Uppala"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/90 pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                    Organization / Company
                  </label>
                  <div className="relative">
                    <Building className="h-4 w-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Acme Enterprise"
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/90 pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/90 pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                {mode === 'signin' && (
                  <span className="text-[10px] text-indigo-400 hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/90 pl-10 pr-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In to Workspace' : 'Create DealMind Account'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-800/80 pt-4 text-center">
            <p className="text-[11px] text-slate-400">
              Protected by Enterprise End-to-End Encryption & Hindsight Memory Guard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
