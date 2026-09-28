import React from 'react';
import {
  Building2,
  User,
  DollarSign,
  Layers,
  ArrowLeft,
  MessageSquareText,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Database,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  Users,
  CheckSquare,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import RiskBadge from '../components/RiskBadge';
import TimelineView from '../components/TimelineView';
import { DEFAULT_DEALS } from '../services/api';

export default function DealDetails({
  deal,
  deals = DEFAULT_DEALS,
  onSelectDeal,
  onBack,
  onNavigateToAnalyzer,
  onNavigateToTimeline,
}) {
  // If deal is null, default to Acme Technologies (deal-acme-01)
  const activeDeal = deal || deals.find((d) => d.id === 'deal-acme-01') || deals[0] || DEFAULT_DEALS[0];

  return (
    <div className="space-y-8">
      {/* Top Header Bar & Deal Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>

        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Switch Deal Dropdown */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-xs">
            <span className="text-slate-400 font-medium">Switch Deal:</span>
            <select
              value={activeDeal.id}
              onChange={(e) => {
                const target = deals.find((d) => d.id === e.target.value);
                if (target && onSelectDeal) onSelectDeal(target);
              }}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              {deals.map((d) => (
                <option key={d.id} value={d.id} className="bg-slate-900 text-white">
                  {d.customer} ({d.valueFormatted})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => onNavigateToAnalyzer(activeDeal.id)}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition-all cursor-pointer"
          >
            <MessageSquareText className="h-4 w-4" />
            Analyze Conversation for {activeDeal.customer}
          </button>
        </div>
      </div>

      {/* Main Deal Hero Card */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Building2 className="h-6 w-6" />
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{activeDeal.customer}</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Deal ID: <span className="font-mono text-slate-300">{activeDeal.id}</span> • Sales Lead:{' '}
                  <span className="font-semibold text-indigo-300">{activeDeal.salesRep}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <RiskBadge level={activeDeal.riskLevel} score={activeDeal.riskScore} size="lg" />
            <div className="rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-2.5">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Total Contract Value</span>
              <span className="text-xl font-bold text-emerald-400">{activeDeal.valueFormatted}</span>
            </div>
          </div>
        </div>

        {/* Financial & Deal Health Grid */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800/80 pt-6 text-xs">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <span className="text-slate-500 block flex items-center gap-1">
              <Layers className="h-3 w-3 text-slate-400" /> Product Scope
            </span>
            <span className="mt-1 font-semibold text-slate-200 block">{activeDeal.product}</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <span className="text-slate-500 block flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-indigo-400" /> Sales Stage
            </span>
            <span className="mt-1 font-semibold text-indigo-400 block">{activeDeal.stage}</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <span className="text-slate-500 block flex items-center gap-1">
              <Clock className="h-3 w-3 text-amber-400" /> Days in Stage
            </span>
            <span className="mt-1 font-semibold text-slate-200 block">{activeDeal.daysInStage || 18} days</span>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <span className="text-slate-500 block flex items-center gap-1">
              <Database className="h-3 w-3 text-emerald-400" /> Hindsight Memory Bank
            </span>
            <span className="mt-1 font-mono text-[11px] text-emerald-300 font-semibold block">
              {activeDeal.bankId || 'Dealmind'}
            </span>
          </div>
        </div>
      </div>

      {/* Stakeholders Matrix & Commercial Economics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stakeholder / Buying Committee */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold">
              <Users className="h-4 w-4" />
              <span>Buying Committee & Stakeholders</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              {(activeDeal.stakeholders || []).length || 4} decision makers
            </span>
          </div>

          <div className="space-y-3">
            {(activeDeal.stakeholders || [
              { name: 'Rajesh Kumar', role: 'Head of Procurement', stance: 'Friction on initial pricing', focus: 'Budget & Volume Discount' },
              { name: 'Pooja Sharma', role: 'Director of IT & Ops', stance: 'Delivery-critical', focus: '30-Day Turnaround SLA' },
              { name: 'Vikram Malhotra', role: 'VP of Technology', stance: 'Evaluating alternatives', focus: 'Architecture & Vendor Comparison' },
              { name: 'Soumya', role: 'Lead Account Executive', stance: 'Deal Owner', focus: 'Closing Contract before competitor' },
            ]).map((sh, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl border border-slate-800/80 bg-slate-950/70 p-3 text-xs"
              >
                <div>
                  <p className="font-semibold text-white">{sh.name}</p>
                  <p className="text-[11px] text-slate-400">{sh.role}</p>
                </div>
                <div className="text-right">
                  <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-300 border border-indigo-500/20">
                    {sh.focus}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-0.5">{sh.stance}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commercial Economics & Pricing Breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                <DollarSign className="h-4 w-4" />
                <span>Commercial Economics & Packaging</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                Annual Subscription
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Seat Volume</span>
                <span className="font-semibold text-white">100 Enterprise Licenses</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Base Price Per User</span>
                <span className="font-semibold text-white">₹8,500 / seat / year</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Payment Schedule</span>
                <span className="font-semibold text-white">Quarterly Advance</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
                <span className="text-slate-400">Implementation SLA Fee</span>
                <span className="font-semibold text-emerald-400">Included (Fast-Track 30-Day)</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-400">Recommended Concession</span>
                <span className="font-semibold text-amber-400">12% Tiered Volume Ramp</span>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-indigo-500/20 bg-indigo-950/20 p-3 text-[11px] text-slate-300">
            <span className="font-semibold text-indigo-300">Sales Playbook Note:</span> Offer quarterly milestone billing rather than a flat upfront discount to protect deal margin while eliminating customer cash-flow friction.
          </div>
        </div>
      </div>

      {/* Requirements, Concerns & Competitive Threat Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Requirements */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md">
          <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold mb-4">
            <CheckCircle2 className="h-4 w-4" />
            <span>Technical & Security Specs</span>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {(activeDeal.requirements || []).map((req, idx) => (
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
            <span>Customer Friction Points</span>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {(activeDeal.concerns || []).map((concern, idx) => (
              <li key={idx} className="flex items-start gap-2 rounded-xl bg-slate-950/60 p-2.5 border border-slate-800/60">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                <span>{concern}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Competitor Threat & Defense */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md">
          <div className="flex items-center gap-2 text-rose-400 text-sm font-semibold mb-4">
            <ShieldAlert className="h-4 w-4" />
            <span>Competitive Defense</span>
          </div>
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-xs">
            <span className="text-[11px] uppercase tracking-wider text-rose-400 font-semibold block">
              Active Evaluation
            </span>
            <p className="mt-1 text-slate-200 font-bold">
              {activeDeal.competitor || 'Alternative Vendor Evaluation'}
            </p>
            <p className="mt-2 text-slate-300 leading-relaxed text-[11px]">
              Customer announced an aggressive proposal from an alternative vendor. Competitor is trying to win on discount.
            </p>
            <div className="mt-3 border-t border-rose-500/20 pt-2 text-[11px] text-emerald-400 font-medium">
              ✓ Counter-measure: Guaranteed 30-day onboarding SLA + Volume Tier
            </div>
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
          <button
            onClick={() => onNavigateToTimeline(activeDeal.id)}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
          >
            Open Full Memory Stream →
          </button>
        </div>

        <TimelineView deal={activeDeal} />
      </div>
    </div>
  );
}
