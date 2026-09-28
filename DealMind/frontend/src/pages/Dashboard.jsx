import React from 'react';
import { ArrowUpRight, TrendingUp, AlertTriangle, Users, DollarSign, Sparkles, Brain, CheckCircle2 } from 'lucide-react';
import StatCard from '../components/StatCard';
import DealCard from '../components/DealCard';

export default function Dashboard({
  deals = [],
  stats = {},
  onSelectDeal,
  onNavigateToAnalyzer,
  onLoadScenario,
}) {
  return (
    <div className="space-y-8">
      {/* Hero / Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-purple-950/30 p-8 backdrop-blur-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400 border border-indigo-500/20 mb-3">
            <Brain className="h-3.5 w-3.5" />
            <span>Biomimetic Persistent Memory Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            DealMind Intelligence Hub
          </h1>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Unlike stateless CRM assistants that forget yesterday’s conversation, DealMind uses{' '}
            <strong className="text-indigo-400 font-semibold">Hindsight Cloud</strong> persistent memory
            to retain deal requirements across cycles, detect compound risks, and recommend decisive sales actions.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateToAnalyzer('deal-acme-01')}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/40"
            >
              <Sparkles className="h-4 w-4" />
              Open Conversation Analyzer
            </button>
            <button
              onClick={() => onLoadScenario('day10')}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm font-medium text-slate-200 transition-all hover:bg-slate-700 hover:text-white"
            >
              Test Day 10 Acme Scenario
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Deals"
          value={stats.activeDeals || deals.length || 4}
          subtitle="4 enterprise opportunities"
          icon={TrendingUp}
          color="indigo"
        />
        <StatCard
          title="Deals At Risk"
          value={stats.dealsAtRisk || 1}
          subtitle="Requires memory intervention"
          icon={AlertTriangle}
          color="rose"
        />
        <StatCard
          title="Follow-ups Today"
          value={stats.followupsToday || 3}
          subtitle="Scheduled sales actions"
          icon={Users}
          color="amber"
        />
        <StatCard
          title="Pipeline Value"
          value={stats.pipelineValueFormatted || '₹47.20 Lakhs'}
          subtitle="Total active pipeline"
          icon={DollarSign}
          color="emerald"
        />
      </div>

      {/* Quick Demo Scenario Bar */}
      <div className="rounded-2xl border border-indigo-500/20 bg-slate-900/60 p-5 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Acme Technologies Demo Walkthrough (Day 1 → Day 5 → Day 10)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Run each day sequentially to observe how Hindsight retains and compounds memory over time.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onLoadScenario('day1')}
              className="rounded-lg border border-slate-700 bg-slate-800/90 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-indigo-500 hover:bg-indigo-600/20 hover:text-white transition-all"
            >
              Day 1 (Pricing)
            </button>
            <button
              onClick={() => onLoadScenario('day5')}
              className="rounded-lg border border-slate-700 bg-slate-800/90 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-indigo-500 hover:bg-indigo-600/20 hover:text-white transition-all"
            >
              Day 5 (30-Day SLA)
            </button>
            <button
              onClick={() => onLoadScenario('day10')}
              className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
            >
              Day 10 (Competitor Evaluation)
            </button>
          </div>
        </div>
      </div>

      {/* Active Deals Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">Active Enterprise Deals</h2>
            <p className="text-xs text-slate-400">Track memory health and detected risks across your pipeline</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {deals.length} deals loaded
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              onSelect={onSelectDeal}
              onAnalyze={(d) => onNavigateToAnalyzer(d.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
