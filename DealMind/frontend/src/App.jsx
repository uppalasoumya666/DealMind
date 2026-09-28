import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import DealDetails from './pages/DealDetails';
import ConversationAnalyzer from './pages/ConversationAnalyzer';
import MemoryTimelinePage from './pages/MemoryTimelinePage';
import BeforeAfterComparison from './components/BeforeAfterComparison';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [deals, setDeals] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedDealId, setSelectedDealId] = useState('deal-acme-01');
  const [healthInfo, setHealthInfo] = useState(null);
  const [initialScenario, setInitialScenario] = useState('day10');
  const [latestAnalysis, setLatestAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initial data loading
  useEffect(() => {
    async function loadData() {
      try {
        const [healthRes, dealsRes] = await Promise.all([
          api.getHealth(),
          api.getDeals(),
        ]);
        setHealthInfo(healthRes);
        if (dealsRes?.deals) {
          setDeals(dealsRes.deals);
          setStats(dealsRes.stats || {});
        }
      } catch (err) {
        console.error('Failed to load initial data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const selectedDeal = deals.find((d) => d.id === selectedDealId) || deals[0] || null;

  const handleSelectDeal = (deal) => {
    setSelectedDealId(deal.id);
    setActiveTab('deal-details');
  };

  const handleNavigateToAnalyzer = (targetDealId = 'deal-acme-01') => {
    setSelectedDealId(targetDealId);
    setActiveTab('analyzer');
  };

  const handleLoadScenario = (scenarioKey) => {
    setSelectedDealId('deal-acme-01');
    setInitialScenario(scenarioKey);
    setActiveTab('analyzer');
  };

  const handleAnalysisComplete = (analysisData) => {
    setLatestAnalysis(analysisData);
    // Refresh deals list to sync updated timeline and risk score
    api.getDeals().then((res) => {
      if (res?.deals) {
        setDeals(res.deals);
        setStats(res.stats || {});
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        healthInfo={healthInfo}
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
                onBack={() => setActiveTab('dashboard')}
                onNavigateToAnalyzer={handleNavigateToAnalyzer}
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
