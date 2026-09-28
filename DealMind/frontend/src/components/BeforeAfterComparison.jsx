import React from 'react';
import { EyeOff, Brain, Sparkles, AlertOctagon, CheckCircle2, ArrowRight, ShieldAlert, Zap } from 'lucide-react';

export default function BeforeAfterComparison({ comparisonData, currentTranscript }) {
  const withoutMem = comparisonData?.withoutMemory || {
    assessment: 'Moderate Risk: Customer is doing standard vendor benchmarking.',
    action: 'Send standard brochure and ask: "What features are you looking for in the other vendor?"',
    failureReason: 'Blind to the past: Completely unaware that pricing was already a sticking point on Day 1 and that they have an immovable 30-day go-live mandate from Day 5. Sending generic collateral while the competitor promises fast delivery will lose this ₹8,50,000 deal.',
  };

  const withHindsight = comparisonData?.withHindsight || {
    assessment: 'Critical Compounding Risk (Score: 89%): The vendor evaluation is directly triggered by past pricing doubts and delivery pressure.',
    action: 'Executive Counter-Offensive: Soumya offers a verified 30-day rapid onboarding SLA with dedicated implementation engineer, coupled with a 12% tiered volume discount for the 100 licenses. Neutralizes the competitor immediately on both speed and price.',
    advantage: 'Hindsight synthesized Day 1 pricing friction and Day 5 30-day deployment deadline, arming the sales rep with a winning proposal before the customer commits elsewhere.',
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/30 via-slate-900 to-purple-950/30 p-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
            <Zap className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-lg font-bold text-white">Before vs. After Persistent Memory Impact</h3>
            <p className="text-xs text-slate-400">
              Witness how Hindsight Cloud persistent memory transforms a generic response into a winning sales strategy.
            </p>
          </div>
        </div>

        {/* The Trigger Message */}
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/80 p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Latest Customer Message (Day 10):</span>
            <span className="font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              At-Risk Trigger
            </span>
          </div>
          <p className="mt-1.5 font-mono text-xs text-indigo-200">
            "{currentTranscript || "We have received a proposal from another vendor and are actively evaluating them. They are offering aggressive terms."}"
          </p>
        </div>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WITHOUT MEMORY */}
        <div className="relative rounded-2xl border border-rose-500/30 bg-slate-900/60 p-6 backdrop-blur-md transition-all hover:border-rose-500/50">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
                <EyeOff className="h-4 w-4" />
              </span>
              <div>
                <h4 className="text-base font-bold text-white">Agent Without Memory</h4>
                <p className="text-[11px] text-slate-400">Standard Stateless LLM</p>
              </div>
            </div>
            <span className="rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-400 border border-rose-500/20">
              Context Blind
            </span>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Perceived Deal Risk
              </span>
              <p className="mt-1 text-xs text-slate-300 font-medium">{withoutMem.assessment}</p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-400">
                Generic AI Recommendation
              </span>
              <p className="mt-1 text-xs text-slate-200 italic leading-relaxed">
                "{withoutMem.action}"
              </p>
            </div>

            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5">
              <div className="flex items-center gap-1.5 text-rose-400 text-xs font-semibold">
                <AlertOctagon className="h-4 w-4" /> Why It Fails
              </div>
              <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                {withoutMem.failureReason}
              </p>
            </div>
          </div>
        </div>

        {/* WITH HINDSIGHT */}
        <div className="relative rounded-2xl border border-indigo-500/40 bg-slate-900/90 p-6 backdrop-blur-md shadow-xl shadow-indigo-500/10 ring-1 ring-indigo-500/30">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-md shadow-indigo-500/30">
                <Brain className="h-4 w-4" />
              </span>
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  DealMind + Hindsight
                  <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                </h4>
                <p className="text-[11px] text-indigo-300">Biomimetic Persistent Memory</p>
              </div>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
              Memory Powered
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {/* Recalled Memory Graph */}
            <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
                Recalled Historical Facts
              </span>
              <ul className="mt-2 space-y-1.5 text-xs text-slate-200">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0"></span>
                  <span><strong className="text-indigo-300">Day 1:</strong> Need approx 100 licenses; severe pricing friction with finance.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0"></span>
                  <span><strong className="text-indigo-300">Day 5:</strong> Non-negotiable 30-day implementation completion requirement.</span>
                </li>
              </ul>
            </div>

            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Synthesized Risk Intelligence
              </span>
              <p className="mt-1 text-xs text-slate-300 font-medium">{withHindsight.assessment}</p>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3.5">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="h-4 w-4" /> Strategic Counter-Action
              </div>
              <p className="mt-1.5 text-xs text-slate-200 leading-relaxed font-medium">
                {withHindsight.action}
              </p>
            </div>

            <div className="rounded-xl border border-indigo-500/20 bg-slate-950/60 p-3">
              <span className="text-[11px] font-semibold text-indigo-400">The Hindsight Advantage:</span>
              <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                {withHindsight.advantage}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
