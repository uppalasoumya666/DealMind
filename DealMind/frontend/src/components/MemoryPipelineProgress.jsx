import React from 'react';
import { CheckCircle2, Loader2, Brain, Database, Search, ShieldAlert, Sparkles, MessageSquare } from 'lucide-react';

export default function MemoryPipelineProgress({ currentStep, statusMessage, recalledCount = 0 }) {
  // Steps in the pipeline:
  // 1: Analyzing conversation...
  // 2: Retaining memory...
  // 3: Memory retained
  // 4: Recalling relevant memories...
  // 5: Recalled memories
  // 6: Generating recommendation...
  // 7: Done

  const steps = [
    {
      id: 1,
      title: 'Conversation Ingestion',
      desc: 'Raw sales chat parsed',
      icon: MessageSquare,
      activeWhen: [1],
      doneWhen: [2, 3, 4, 5, 6, 7],
    },
    {
      id: 2,
      title: 'AI Analysis & Extraction',
      desc: 'Isolate requirements, pricing & deadlines',
      icon: Brain,
      activeWhen: [2],
      doneWhen: [3, 4, 5, 6, 7],
    },
    {
      id: 3,
      title: 'Hindsight RETAIN',
      desc: 'Persist facts into cloud memory bank',
      icon: Database,
      activeWhen: [3],
      doneWhen: [4, 5, 6, 7],
    },
    {
      id: 4,
      title: 'Hindsight RECALL',
      desc: recalledCount > 0 ? `${recalledCount} memories recalled` : 'Retrieve historical deal context',
      icon: Search,
      activeWhen: [4],
      doneWhen: [5, 6, 7],
    },
    {
      id: 5,
      title: 'Compounding Risk Analysis',
      desc: 'Synthesize past objections with current signals',
      icon: ShieldAlert,
      activeWhen: [5],
      doneWhen: [6, 7],
    },
    {
      id: 6,
      title: 'Recommendation Engine',
      desc: 'Generate decisive tactical action',
      icon: Sparkles,
      activeWhen: [6],
      doneWhen: [7],
    },
  ];

  return (
    <div className="rounded-2xl border border-indigo-500/20 bg-slate-900/80 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
          <h4 className="text-sm font-semibold text-white">DealMind Memory Pipeline</h4>
        </div>
        <span className="rounded-md bg-indigo-500/10 px-2.5 py-1 text-xs font-mono font-medium text-indigo-400 border border-indigo-500/20">
          {statusMessage || 'Processing pipeline...'}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {steps.map((step) => {
          const Icon = step.icon;
          const isDone = step.doneWhen.includes(currentStep);
          const isActive = step.activeWhen.includes(currentStep) && !isDone;

          return (
            <div
              key={step.id}
              className={`relative flex flex-col justify-between rounded-xl border p-3 transition-all ${
                isDone
                  ? 'border-emerald-500/30 bg-emerald-500/5 text-slate-200'
                  : isActive
                  ? 'border-indigo-500/50 bg-indigo-500/10 text-white shadow-md shadow-indigo-500/10 animate-pulse-glow'
                  : 'border-slate-800/80 bg-slate-950/40 text-slate-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`rounded-lg p-1.5 ${
                    isDone
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : isActive
                      ? 'bg-indigo-500 text-white'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                {isDone ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                ) : isActive ? (
                  <Loader2 className="h-4 w-4 text-indigo-400 animate-spin" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-slate-700"></span>
                )}
              </div>

              <div className="mt-2">
                <p className="text-xs font-semibold leading-tight">{step.title}</p>
                <p className="mt-1 text-[10px] text-slate-400 line-clamp-2">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
