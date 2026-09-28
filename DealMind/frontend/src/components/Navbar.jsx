import React from 'react';
import {
  Brain,
  Sparkles,
  Database,
  Shield,
  LayoutDashboard,
  MessageSquareText,
  History,
  SplitSquareVertical,
  LogOut,
  User,
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  healthInfo,
  onOpenLogoModal,
  currentUser,
  onSignOut,
}) {
  const isHindsightConnected = healthInfo?.hindsight?.connected;
  const isHindsightConfigured = healthInfo?.hindsight?.configured;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'deal-details', label: 'Deal Details', icon: Shield },
    { id: 'analyzer', label: 'Conversation Analyzer', icon: MessageSquareText },
    { id: 'timeline', label: 'Memory Timeline', icon: History },
    { id: 'comparison', label: 'Before vs After Demo', icon: SplitSquareVertical },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo - Click to view Logo Modal */}
        <div
          onClick={onOpenLogoModal}
          className="flex items-center gap-3 cursor-pointer group select-none"
          title="Click to view DealMind Logo & Architecture"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/25 transition-transform duration-300 group-hover:scale-105 group-hover:shadow-indigo-500/40">
            <Brain className="h-5 w-5 text-white" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                DealMind
              </span>
              <span className="rounded-md bg-indigo-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-400 border border-indigo-500/20 group-hover:border-indigo-500/40">
                View Logo
              </span>
            </div>
            <p className="text-[11px] text-slate-400">AI Deal Intelligence Agent</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-1 backdrop-blur-md">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Status & User Profile */}
        <div className="flex items-center gap-3">
          {/* Hindsight Live Status Indicator */}
          <div className="hidden lg:flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs">
            <Database className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-slate-400">Hindsight:</span>
            {isHindsightConnected ? (
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Connected
              </span>
            ) : isHindsightConfigured ? (
              <span className="flex items-center gap-1 text-amber-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                Connecting...
              </span>
            ) : (
              <span className="flex items-center gap-1 text-indigo-300 font-medium">
                <span className="h-2 w-2 rounded-full bg-indigo-400"></span>
                Cloud Ready
              </span>
            )}
          </div>

          {/* User Profile & Sign Out */}
          {currentUser && (
            <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-300 font-semibold text-xs border border-indigo-500/30">
                  {currentUser.avatar || 'SU'}
                </div>
                <div className="hidden sm:block text-left text-xs">
                  <p className="font-semibold text-slate-200 leading-tight">{currentUser.name || 'Soumya'}</p>
                  <p className="text-[10px] text-slate-400 leading-tight">{currentUser.role || 'Sales Rep'}</p>
                </div>
              </div>
              <button
                onClick={onSignOut}
                title="Sign Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors ml-1 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="flex md:hidden overflow-x-auto border-t border-slate-800/60 px-4 py-2 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                isActive ? 'bg-indigo-600 text-white' : 'text-slate-400'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
