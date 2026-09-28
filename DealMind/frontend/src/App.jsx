import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LogoModal from './components/LogoModal';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import DealDetails from './pages/DealDetails';
import ConversationAnalyzer from './pages/ConversationAnalyzer';
import MemoryTimelinePage from './pages/MemoryTimelinePage';
import BeforeAfterComparison from './components/BeforeAfterComparison';
import { api, DEFAULT_DEALS, DEFAULT_STATS } from './services/api';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('dealmind_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [deals, setDeals] = useState(DEFAULT_DEALS);
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [selectedDealId, setSelectedDealId] = useState('deal-acme-01');
  const [healthInfo, setHealthInfo] = useState(null);
  const [initialScenario, setInitialScenario] = useState('day10');
  const [latestAnalysis, setLatestAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  // Initial data loading
  useEffect(() => {
    async function loadData() {
      try {
        const [healthRes, dealsRes] = await Promise.all([
          api.getHealth(),
          api.getDeals(),
        ]);
        setHealthInfo(healthRes);
        if (dealsRes?.deals && dealsRes.deals.length > 0) {
          setDeals(dealsRes.deals);
          setStats(dealsRes.stats || DEFAULT_STATS);
        }
      } catch (err) {
        console.warn('Initial data loading using fallback deals:', err);
        setDeals(DEFAULT_DEALS);
        setStats(DEFAULT_STATS);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Safe deal selection fallback: never null
  const selectedDeal = deals.find((d) => d.id === selectedDealId) || deals[0] || DEFAULT_DEALS[0];

  const handleSelectDeal = (deal) => {
    setSelectedDealId(deal.id);
    setActiveTab('deal-details');
  };

  const handleNavigateToAnalyzer = (targetDealId = 'deal-acme-01') => {
    setSelectedDealId(targetDealId);
    setActiveTab('analyzer');
  };

  const handleNavigateToTimeline = (targetDealId = 'deal-acme-01') => {
    setSelectedDealId(targetDealId);
    setActiveTab('timeline');
  };

  const handleLoadScenario = (scenarioKey) => {
    setSelectedDealId('deal-acme-01');
    setInitialScenario(scenarioKey);
    setActiveTab('analyzer');
  };

  const handleAnalysisComplete = (analysisData) => {
    setLatestAnalysis(analysisData);
    api.getDeals().then((res) => {
      if (res?.deals) {
        setDeals(res.deals);
        setStats(res.stats || DEFAULT_STATS);
      }
    });
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setActiveTab('dashboard');
  };

  const handleSignOut = () => {
    localStorage.removeItem('dealmind_user');
    setCurrentUser(null);
  };

  // If user is not authenticated, render AuthPage before Dashboard
  if (!currentUser) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        healthInfo={healthInfo}
        onOpenLogoModal={() => setIsLogoModalOpen(true)}
        currentUser={currentUser}
        onSignOut={handleSignOut}
      />

      {/* Interactive Logo Modal (opens when clicking logo in Navbar) */}
      <LogoModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        onNavigateDashboard={() => setActiveTab('dashboard')}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="h-10 w-10 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin"></div>
            <p className="mt-4 text-xs font-mono text-slate-400">Loading DealMind Intelligence Engine...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                deals={deals}
                stats={stats}
                onSelectDeal={handleSelectDeal}
                onNavigateToAnalyzer={handleNavigateToAnalyzer}
                onLoadScenario={handleLoadScenario}
              />
            )}

            {activeTab === 'deal-details' && (
              <DealDetails
                deal={selectedDeal}
                deals={deals}
                onSelectDeal={handleSelectDeal}
                onBack={() => setActiveTab('dashboard')}
                onNavigateToAnalyzer={handleNavigateToAnalyzer}
                onNavigateToTimeline={handleNavigateToTimeline}
              />
            )}

            {activeTab === 'analyzer' && (
              <ConversationAnalyzer
                deals={deals}
                selectedDealId={selectedDealId}
                initialScenario={initialScenario}
                onAnalysisComplete={handleAnalysisComplete}
              />
            )}

            {activeTab === 'timeline' && (
              <MemoryTimelinePage
                deal={selectedDeal}
                onNavigateToAnalyzer={handleNavigateToAnalyzer}
              />
            )}

            {activeTab === 'comparison' && (
              <div className="space-y-6">
                <div className="rounded-3xl border border-indigo-500/20 bg-slate-900/60 p-6 backdrop-blur-xl">
                  <h1 className="text-2xl font-bold text-white">Before & After Memory Comparison</h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Demonstration of how persistent memory shifts AI from generic chatting to high-conversion deal intelligence.
                  </p>
                </div>
                <BeforeAfterComparison
                  comparisonData={latestAnalysis?.comparison}
                  currentTranscript={latestAnalysis?.extractedFacts?.summary}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">DealMind</span>
            <span>— AI Deal Intelligence Agent powered by</span>
            <span className="text-indigo-400 font-medium">Hindsight Cloud Memory</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>RETAIN</span>
            <span>•</span>
            <span>RECALL</span>
            <span>•</span>
            <span>REASON</span>
            <span>•</span>
            <span>RECOMMEND</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
