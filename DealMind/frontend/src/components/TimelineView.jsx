import React from 'react';
import { Calendar, Brain, ArrowDown, Database, Check, AlertTriangle, ShieldCheck } from 'lucide-react';
import RiskBadge from './RiskBadge';

export default function TimelineView({ deal, activeRecalledMemories = [] }) {
  const timelineEvents = deal?.timeline || [
    {
      day: 1,
      date: '2026-09-18',
      title: 'Day 1 — 100 Licenses & Pricing Friction',
      speaker: 'Acme Procurement (Rajesh)',
      summary: 'Customer stated scope is ~100 licenses. Voiced strong pricing objection.',
      retainedMemory: 'Customer requires ~100 licenses. Pricing is a major objection.',
      recalledCount: 0,
      riskLevel: 'LOW',
    },
    {
      day: 5,
      date: '2026-09-23',
      title: 'Day 5 — 30-Day Implementation Mandate',
      speaker: 'Acme IT Lead (Pooja)',
      summary: 'Customer established strict 30-day go-live mandate for quarterly audit.',
      retainedMemory: 'Implementation must be strictly completed within 30 days.',
      recalledCount: 1,
      riskLevel: 'MEDIUM',
    },
    {
      day: 10,
      date: '2026-09-28',
      title: 'Day 10 — Competitor Evaluation & Climax',
      speaker: 'Acme VP of Tech (Vikram)',
      summary: 'Customer revealed active evaluation of an alternative vendor with aggressive terms.',
      retainedMemory: 'Customer actively evaluating another vendor.',
      recalledCount: 2,
      riskLevel: 'HIGH',
    },
  ];

  // Helper to check if a timeline event was recalled in the active conversation
  const isEventRecalled = (event) => {
    if (!activeRecalledMemories || activeRecalledMemories.length === 0) return false;
    const eventText = (event.retainedMemory || event.summary || '').toLowerCase();
    return activeRecalledMemories.some((mem) => {
      const memText = (mem.text || mem.content || '').toLowerCase();
      return (
        (event.day === 1 && (memText.includes('license') || memText.includes('price') || memText.includes('pricing'))) ||
        (event.day === 5 && (memText.includes('30') || memText.includes('day') || memText.includes('implementation'))) ||
        memText.includes(eventText.slice(0, 15))
      );
    });
  };

  return (
    <div className="relative">
      {/* Vertical timeline trace line */}
      <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gradient-to-b from-indigo-500/40 via-purple-500/40 to-rose-500/40 hidden sm:block"></div>

      <div className="space-y-6">
        {timelineEvents.map((event, index) => {
          const recalledInActive = isEventRecalled(event);

          return (
            <div
              key={event.id || index}
              className={`relative flex flex-col sm:flex-row items-start gap-4 rounded-2xl border p-5 transition-all ${
                recalledInActive
                  ? 'border-indigo-500/60 bg-slate-900/90 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/30'
                  : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
              }`}
            >
              {/* Day badge indicator */}
              <div className="flex sm:flex-col items-center justify-center shrink-0">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl font-bold text-sm shadow-md ${
                    event.day === 10
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : event.day === 5
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  }`}
                >
                  D{event.day}
                </div>
              </div>

              {/* Event Body */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h4 className="text-base font-semibold text-white flex items-center gap-2">
                      {event.title}
                      {recalledInActive && (
                        <span className="flex items-center gap-1 rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-500/40 animate-pulse">
                          <Check className="h-3 w-3" /> Recalled for Current Recommendation
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Speaker: <span className="text-slate-300 font-medium">{event.speaker || 'Customer Contact'}</span> • Date: {event.date}
                    </p>
                  </div>
                  <RiskBadge level={event.riskLevel || 'LOW'} size="sm" />
                </div>

                <p className="mt-3 text-xs text-slate-300 leading-relaxed">{event.summary}</p>

                {/* Hindsight Retained Memory snippet */}
                <div className="mt-3 rounded-xl border border-indigo-500/20 bg-slate-950/60 p-3 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-indigo-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Database className="h-3.5 w-3.5" /> Hindsight Memory Bank Entry
                    </span>
                    <span className="text-slate-500 font-mono">bank: {deal?.bankId || 'dealmind-acme'}</span>
                  </div>
                  <p className="mt-1.5 font-mono text-[11px] text-slate-200 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                    "{event.retainedMemory}"
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
