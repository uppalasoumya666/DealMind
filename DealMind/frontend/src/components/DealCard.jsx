import React from 'react';
import { Building2, User, ArrowRight, BrainCircuit, Calendar, Layers } from 'lucide-react';
import RiskBadge from './RiskBadge';

export default function DealCard({ deal, onSelect, onAnalyze }) {
  return (
    <div className="group relative rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md transition-all duration-300 hover:border-indigo-500/40 hover:bg-slate-900/80 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <Building2 className="h-4 w-4" />
            </span>
            <h4 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
              {deal.customer}
            </h4>
          </div>
          <p className="mt-1 text-xs text-slate-400 flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-slate-500" />
            {deal.product} • <span className="text-slate-300 font-medium">{deal.stage}</span>
          </p>
        </div>
        <RiskBadge level={deal.riskLevel} score={deal.riskScore} size="sm" />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-slate-950/60 p-3 text-xs border border-slate-800/60">
        <div>
          <span className="text-slate-500">Deal Value</span>
          <p className="font-semibold text-slate-200">{deal.valueFormatted}</p>
        </div>
        <div>
          <span className="text-slate-500">Sales Rep</span>
          <p className="font-medium text-slate-300 flex items-center gap-1">
            <User className="h-3 w-3 text-slate-400" /> {deal.salesRep}
          </p>
        </div>
      </div>

      {deal.timeline && deal.timeline.length > 0 && (
        <div className="mt-4 border-t border-slate-800/80 pt-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <BrainCircuit className="h-3.5 w-3.5 text-indigo-400" />
              <span>{deal.timeline.length} Memory Events Stored</span>
            </span>
            <span className="text-[11px] text-slate-500">
              Latest: Day {deal.timeline[deal.timeline.length - 1].day}
            </span>
          </div>
        </div>
      )}

      <div className="mt-5 flex items-center gap-2">
        <button
          onClick={() => onSelect(deal)}
          className="flex-1 rounded-xl border border-slate-700 bg-slate-800/60 px-3 py-2 text-xs font-medium text-slate-200 transition-all hover:bg-slate-700 hover:text-white"
        >
          View Details
        </button>
        <button
          onClick={() => onAnalyze(deal)}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-medium text-white transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25"
        >
          Analyze <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
