import React from 'react';
import { Building2, User, DollarSign, Layers, ArrowLeft, MessageSquareText, ShieldAlert, CheckCircle2, AlertTriangle, Database, Calendar } from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import TimelineView from '../components/TimelineView';

export default function DealDetails({ deal, onBack, onNavigateToAnalyzer }) {
  if (!deal) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">No deal selected.</p>
        <button onClick={onBack} className="mt-4 text-indigo-400 hover:underline text-sm">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Breadcrumb & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>

        <button
          onClick={() => onNavigateToAnalyzer(deal.id)}
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition-all"
        >
          <MessageSquareText className="h-4 w-4" />
          Analyze New Conversation for {deal.customer}
        </button>
      </div>

      {/* Main Deal Header Card */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Building2 className="h-6 w-6" />
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{deal.customer}</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Deal ID: <span className="font-mono text-slate-300">{deal.id}</span> • Rep:{' '}
                  <span className="font-medium text-indigo-300">{deal.salesRep}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <RiskBadge level={deal.riskLevel} score={deal.riskScore} size="lg" />
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-2">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Contract Value</span>
              <span className="text-xl font-bold text-emerald-400">{deal.valueFormatted}</span>
            </div>
          </div>
        </div>

        {/* Deal Attributes Grid */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800/80 pt-6 text-xs">
          <div>
            <span className="text-slate-500 block">Product</span>
            <span className="mt-1 font-semibold text-slate-200">{deal.product}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Sales Stage</span>
            <span className="mt-1 font-semibold text-indigo-400">{deal.stage}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Status</span>
            <span className="mt-1 font-semibold text-slate-200">{deal.status}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Hindsight Bank ID</span>
            <span className="mt-1 font-mono text-[11px] text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 inline-block">
              {deal.bankId}
            </span>
          </div>
        </div>
      </div>

      {/* Requirements, Concerns & Competitor Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Requirements */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md">
          <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold mb-4">
            <CheckCircle2 className="h-4 w-4" />
            <span>Customer Requirements</span>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {(deal.requirements || []).map((req, idx) => (
              <li key={idx} className="flex items-start gap-2 rounded-xl bg-slate-950/60 p-2.5 border border-slate-800/60">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0"></span>
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Known Concerns / Objections */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md">
          <div className="flex items-center gap-2 text-amber-400 text-sm font-semibold mb-4">
            <AlertTriangle className="h-4 w-4" />
            <span>Historical Concerns / Objections</span>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {(deal.concerns || []).map((concern, idx) => (
              <li key={idx} className="flex items-start gap-2 rounded-xl bg-slate-950/60 p-2.5 border border-slate-800/60">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                <span>{concern}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Competitor Threat */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md">
          <div className="flex items-center gap-2 text-rose-400 text-sm font-semibold mb-4">
            <ShieldAlert className="h-4 w-4" />
            <span>Competitive Intelligence</span>
          </div>
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-xs">
            <span className="text-[11px] uppercase tracking-wider text-rose-400 font-semibold block">
              Active Evaluation
            </span>
            <p className="mt-1 text-slate-200 font-medium">
              {deal.competitor || 'No competitor detected'}
            </p>
            <p className="mt-2 text-slate-400 leading-relaxed text-[11px]">
              Customer revealed in recent interactions that an aggressive alternative vendor is in play.
            </p>
          </div>
        </div>
      </div>

      {/* Interaction Timeline Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">Deal Interaction History</h2>
            <p className="text-xs text-slate-400">
              Chronological log of customer conversations persisted in Hindsight Cloud
            </p>
          </div>
          <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
            {deal.timeline?.length || 0} touchpoints
          </span>
        </div>

        <TimelineView deal={deal} />
      </div>
    </div>
  );
}
