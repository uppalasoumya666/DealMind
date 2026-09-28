import React from 'react';
import { History, Brain, Database, ArrowRight, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import TimelineView from '../components/TimelineView';

export default function MemoryTimelinePage({ deal, onNavigateToAnalyzer }) {
  const currentDeal = deal || {
    id: 'deal-acme-01',
    customer: 'Acme Technologies',
    dealValue: 850000,
    valueFormatted: '₹8,50,000',
    product: 'Enterprise Platform',
    salesRep: 'Soumya',
    bankId: 'dealmind-acme',
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-purple-950/30 p-8 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20 mb-3">
              <History className="h-3.5 w-3.5" />
              <span>Hindsight Persistent Memory Stream</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {currentDeal.customer} — Memory Timeline
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Trace the complete chronological evolution of memories retained in the{' '}
              <span className="font-mono text-indigo-400 font-semibold">{currentDeal.bankId}</span> bank.
              Observe how past friction points (pricing, deadlines) persist and resurface to inform current deal strategy.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigateToAnalyzer(currentDeal.id)}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              Analyze Deal Conversation
            </button>
          </div>
        </div>
      </div>

      {/* Memory Architecture Explainer Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-semibold">Step 1</span>
          <h4 className="text-sm font-bold text-white mt-1">RETAIN</h4>
          <p className="text-xs text-slate-400 mt-1">
            Extracts high-signal facts (pricing, budget, timeline) and stores them in Hindsight.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-semibold">Step 2</span>
          <h4 className="text-sm font-bold text-white mt-1">RECALL</h4>
          <p className="text-xs text-slate-400 mt-1">
            Semantic & temporal query retrieves relevant historical facts for the current deal.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-semibold">Step 3</span>
          <h4 className="text-sm font-bold text-white mt-1">REASON</h4>
          <p className="text-xs text-slate-400 mt-1">
            Synthesizes past objections with present signals to detect compound deal risks.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold">Step 4</span>
          <h4 className="text-sm font-bold text-white mt-1">RECOMMEND</h4>
          <p className="text-xs text-slate-400 mt-1">
            Delivers a high-conviction, custom sales strategy to win the deal.
          </p>
        </div>
      </div>

      {/* Interactive Timeline Display */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Chronological Memory Sequence</h2>
            <p className="text-xs text-slate-400">Day 1 Pricing Concern → Day 5 Implementation SLA → Day 10 Competitor Threat</p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
            Hindsight Bank: {currentDeal.bankId}
          </span>
        </div>

        <TimelineView deal={currentDeal} />
      </div>
    </div>
  );
}
