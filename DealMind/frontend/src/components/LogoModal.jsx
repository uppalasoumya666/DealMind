import React from 'react';
import { Brain, X, Sparkles, Database, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';

export default function LogoModal({ isOpen, onClose, onNavigateDashboard }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl border border-indigo-500/30 bg-slate-900/95 p-8 shadow-2xl shadow-indigo-500/20 text-center text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Large Logo Emblem */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 shadow-2xl shadow-indigo-500/40 mb-6 ring-4 ring-indigo-500/20 animate-pulse-glow">
          <Brain className="h-12 w-12 text-white" />
        </div>

        {/* Brand Details */}
        <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
          <span>DealMind</span>
          <span className="rounded-lg bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/30">
            v1.0.0
          </span>
        </h2>
        <p className="text-xs text-indigo-300 font-medium mt-1">
          AI Deal Intelligence Agent with Hindsight Persistent Memory
        </p>

        <p className="mt-4 text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
          Unlike stateless CRM chat assistants that forget yesterday's interaction, DealMind continuously
          builds an interconnected knowledge graph across customer conversation cycles, detecting compound
          deal risks and prescribing high-conviction next steps.
        </p>

        {/* Architecture Badges */}
        <div className="mt-6 grid grid-cols-4 gap-2 text-[10px] font-mono">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-2">
            <span className="text-indigo-400 block font-bold">RETAIN</span>
            <span className="text-slate-400 text-[9px]">Extract Facts</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-2">
            <span className="text-indigo-400 block font-bold">RECALL</span>
            <span className="text-slate-400 text-[9px]">Query Memory</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-2">
            <span className="text-indigo-400 block font-bold">REASON</span>
            <span className="text-slate-400 text-[9px]">Compound Risk</span>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-2">
            <span className="text-emerald-400 block font-bold">RECOMMEND</span>
            <span className="text-slate-400 text-[9px]">Action Plan</span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => {
              onClose();
              if (onNavigateDashboard) onNavigateDashboard();
            }}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all cursor-pointer"
          >
            <span>Go to Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
