import React, { useState, useEffect } from 'react';
import {
  MessageSquareText,
  Sparkles,
  Database,
  Search,
  ShieldAlert,
  ArrowRight,
  Brain,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Copy,
  Check,
  RotateCcw,
  Zap,
  Building2,
  ChevronDown,
} from 'lucide-react';
import { api, DEFAULT_DEALS } from '../services/api';
import MemoryPipelineProgress from '../components/MemoryPipelineProgress';
import RiskBadge from '../components/RiskBadge';
import BeforeAfterComparison from '../components/BeforeAfterComparison';

export default function ConversationAnalyzer({
  deals = DEFAULT_DEALS,
  selectedDealId = 'deal-acme-01',
  initialScenario = null,
  onAnalysisComplete,
}) {
  // Always ensure we have valid deals list
  const activeDealsList = deals && deals.length > 0 ? deals : DEFAULT_DEALS;
  const [dealId, setDealId] = useState(selectedDealId || activeDealsList[0]?.id || 'deal-acme-01');
  const [transcript, setTranscript] = useState('');
  const [activeDay, setActiveDay] = useState(10);
  const [speaker, setSpeaker] = useState('Acme VP Technology (Vikram)');

  // Loading & Pipeline State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0); // 0 = idle, 1..6 = steps, 7 = done
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState(null);

  // Analysis Result State
  const [analysisResult, setAnalysisResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Find active deal
  const currentDeal = activeDealsList.find((d) => d.id === dealId) || activeDealsList[0] || DEFAULT_DEALS[0];

  // Preset demo scenarios for Acme Technologies
  const demoScenarios = {
    day1: {
      day: 1,
      title: 'Day 1 — Scope & Pricing Objection',
      speaker: 'Acme Procurement (Rajesh)',
      text: 'Hi Soumya, thanks for the platform walkthrough yesterday. Our team needs approximately 100 licenses for our engineering and operations departments. However, the pricing quote looks quite high compared to our allocated fiscal budget. Can we discuss volume discounts?',
    },
    day5: {
      day: 5,
      title: 'Day 5 — 30-Day Implementation Mandate',
      speaker: 'Acme IT Lead (Pooja)',
      text: 'Soumya, our executive steering committee met this morning. We can only move forward if the implementation can be fully completed within 30 days because of our upcoming quarterly reporting cycle. Can your delivery team commit to that?',
    },
    day10: {
      day: 10,
      title: 'Day 10 — Competitor Enters & Climax',
      speaker: 'Acme VP Technology (Vikram)',
      text: 'Hi Soumya, to be transparent, we are currently evaluating another vendor who reached out with an aggressive proposal. We like your product, but we have urgent delivery needs and need to make a final vendor decision this week.',
    },
  };

  // Pre-load scenario when prop changes
  useEffect(() => {
    if (initialScenario && demoScenarios[initialScenario]) {
      loadScenario(initialScenario);
    } else if (!transcript) {
      loadScenario('day10'); // Default to Day 10 for immediate high-impact demo
    }
  }, [initialScenario]);

  const loadScenario = (scenarioKey) => {
    const scenario = demoScenarios[scenarioKey];
    if (scenario) {
      setTranscript(scenario.text);
      setActiveDay(scenario.day);
      setSpeaker(scenario.speaker);
      setAnalysisResult(null);
      setError(null);
    }
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Run the full analysis pipeline with progressive status animation
  const handleAnalyze = async () => {
    if (!transcript.trim()) {
      setError('Please enter or select a conversation transcript to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      // Step 1: Ingestion
      setPipelineStep(1);
      setStatusMessage('Ingesting & parsing sales interaction transcript...');
      await delay(350);

      // Step 2: Extraction
      setPipelineStep(2);
      setStatusMessage('Extracting key requirements, pricing terms & deadlines with AI...');
      await delay(400);

      // Step 3: Retaining memory into Hindsight Cloud
      setPipelineStep(3);
      setStatusMessage('Retaining extracted facts in Hindsight Cloud bank...');
      await delay(400);

      // Step 4: Recalling relevant historical memories
      setPipelineStep(4);
      setStatusMessage('Recalling relevant historical memories from Hindsight...');
      await delay(400);

      // Step 5: Compounding Risk Analysis
      setPipelineStep(5);
      setStatusMessage('Synthesizing compounding risk across historical touchpoints...');
      await delay(400);

      // Step 6: Recommendation Engine
      setPipelineStep(6);
      setStatusMessage('Generating strategic action and counter-objection talking points...');

      // Perform backend or client-side fallback API call
      const response = await api.analyzeConversation({
        conversationText: transcript,
        dealId: currentDeal.id,
        day: activeDay,
        speaker,
      });

      await delay(300);

      // Step 7: Pipeline completely finished
      setPipelineStep(7);
      setStatusMessage('Analysis complete!');
      setAnalysisResult(response);

      if (onAnalysisComplete) {
        onAnalysisComplete(response);
      }
    } catch (err) {
      console.warn('Analysis caught error, recovering with DealMind engine fallback:', err);
      try {
        const fallback = await api.analyzeConversation({
          conversationText: transcript,
          dealId: currentDeal.id,
          day: activeDay,
          speaker,
        });
        setPipelineStep(7);
        setStatusMessage('Analysis complete!');
        setAnalysisResult(fallback);
      } catch (fallbackErr) {
        setError('Analysis encountered an issue. Please try again.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyRecommendation = () => {
    if (analysisResult?.recommendation?.primaryAction) {
      navigator.clipboard.writeText(analysisResult.recommendation.primaryAction);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="rounded-3xl border border-indigo-500/20 bg-slate-900/60 p-6 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/20 mb-2">
              <Brain className="h-3.5 w-3.5" />
              <span>RETAIN → RECALL → REASON → RECOMMEND</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              AI Conversation Analyzer
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Paste any customer interaction transcript or test the sequential Acme Technologies demo
              to watch Hindsight persistently compound deal context.
            </p>
          </div>

          {/* Deal Picker Dropdown */}
          <div className="flex items-center gap-2.5 bg-slate-950/90 p-2.5 rounded-2xl border border-slate-800 shadow-md">
            <Building2 className="h-4 w-4 text-indigo-400 ml-1 shrink-0" />
            <span className="text-xs text-slate-400 font-medium shrink-0">Select Deal:</span>
            <div className="relative">
              <select
                value={dealId}
                onChange={(e) => setDealId(e.target.value)}
                className="appearance-none rounded-xl border border-slate-700 bg-slate-900 pl-3 pr-8 py-1.5 text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {activeDealsList.map((d) => (
                  <option key={d.id} value={d.id} className="bg-slate-900 text-white py-1">
                    {d.customer} ({d.valueFormatted})
                  </option>
                ))}
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Demo Scenario Buttons */}
        <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-slate-800/80 pt-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mr-2">
            Load Demo Scenario:
          </span>

          <button
            onClick={() => loadScenario('day1')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
              activeDay === 1
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'border border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Day 1: Scope & Pricing
          </button>

          <button
            onClick={() => loadScenario('day5')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
              activeDay === 5
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'border border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Day 5: 30-Day Deadline
          </button>

          <button
            onClick={() => loadScenario('day10')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all cursor-pointer ${
              activeDay === 10
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'border border-slate-700 bg-slate-800/60 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Day 10: Competitor Climax
          </button>

          <button
            onClick={() => {
              setTranscript('');
              setAnalysisResult(null);
            }}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 ml-auto cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" /> Clear Text
          </button>
        </div>
      </div>

      {/* Input Workbench */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <MessageSquareText className="h-4 w-4 text-indigo-400" />
            Sales Interaction Transcript
          </label>
          <span className="text-[11px] text-slate-400">
            Day: <strong className="text-indigo-300 font-mono">{activeDay}</strong> • Speaker:{' '}
            <strong className="text-slate-200 font-medium">{speaker}</strong>
          </span>
        </div>

        <textarea
          rows={5}
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste meeting notes, call transcript, or email exchange here..."
          className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 p-4 font-sans text-sm text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
        />

        {error && (
          <div className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            Clicking analyze triggers the AI Fact Extractor → Hindsight RETAIN → Hindsight RECALL → Reasoning flow.
          </p>

          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !transcript.trim()}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin"></span>
                <span>Processing DealMind Pipeline...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Analyze Conversation</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual Pipeline Progress */}
      {(isAnalyzing || pipelineStep > 0) && (
        <MemoryPipelineProgress
          currentStep={pipelineStep}
          statusMessage={statusMessage}
          recalledCount={analysisResult?.recalledMemories?.length || 0}
        />
      )}

      {/* Structured Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Top Status & Risk Header */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <Brain className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-xl font-bold text-white">Deal Intelligence Report</h3>
                  <p className="text-xs text-slate-400">
                    Customer: <strong className="text-slate-200">{analysisResult.customer}</strong> • Analyzed at{' '}
                    {new Date(analysisResult.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Hindsight Memory Used Badge */}
                {analysisResult.memoryUsed ? (
                  <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Hindsight Memory Active
                  </span>
                ) : (
                  <span
                    className="flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30"
                    title={analysisResult.hindsightDiagnostic?.message}
                  >
                    <Database className="h-3.5 w-3.5" />
                    Hindsight Cloud Ready
                  </span>
                )}

                <RiskBadge
                  level={analysisResult.risk?.level}
                  score={analysisResult.risk?.score}
                  size="md"
                />
              </div>
            </div>

            {/* Strategic Recommendation Spotlight */}
            <div className="mt-6 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-purple-950/30 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold">
                  <Lightbulb className="h-4 w-4" />
                  <span>Recommended Next Action for {currentDeal.salesRep || 'Sales Rep'}</span>
                </div>
                <button
                  onClick={copyRecommendation}
                  className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <p className="mt-3 text-base font-semibold text-white leading-relaxed">
                {analysisResult.recommendation?.primaryAction}
              </p>

              {analysisResult.recommendation?.strategy && (
                <div className="mt-3 text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <strong className="text-indigo-400 block mb-1">Strategic Overview:</strong>
                  {analysisResult.recommendation.strategy}
                </div>
              )}

              {/* Talking Points & Offer */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {analysisResult.recommendation?.talkingPoints && (
                  <div className="rounded-xl bg-slate-950/60 p-3.5 border border-slate-800/80">
                    <span className="font-semibold text-indigo-300 block mb-2">Key Meeting Talking Points:</span>
                    <ul className="space-y-1.5 text-slate-300">
                      {analysisResult.recommendation.talkingPoints.map((pt, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-indigo-400 font-bold">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysisResult.recommendation?.suggestedOffer && (
                  <div className="rounded-xl bg-emerald-500/5 p-3.5 border border-emerald-500/20 flex flex-col justify-between">
                    <div>
                      <span className="font-semibold text-emerald-400 block mb-1.5">Suggested Commercial Offer:</span>
                      <p className="text-slate-200">{analysisResult.recommendation.suggestedOffer}</p>
                    </div>
                    <span className="text-[11px] text-emerald-400/80 mt-2">
                      Designed to nullify competitor leverage on speed & price.
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Risk Explanation */}
            {analysisResult.risk && (
              <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <ShieldAlert className="h-4 w-4" />
                  <span>Synthesized Deal Risk Analysis</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {analysisResult.risk.explanation}
                </p>

                {analysisResult.risk.factors && analysisResult.risk.factors.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {analysisResult.risk.factors.map((factor, i) => (
                      <span
                        key={i}
                        className="rounded-lg bg-rose-500/10 px-2.5 py-1 text-xs text-rose-300 border border-rose-500/20"
                      >
                        • {factor}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hindsight Memory Details: RETAINED vs RECALLED */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* RETAIN Column */}
            <div className="rounded-2xl border border-indigo-500/20 bg-slate-900/60 p-6 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Database className="h-4 w-4" />
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Facts Retained in Hindsight</h4>
                    <p className="text-[11px] text-slate-400">Long-term deal memory stored</p>
                  </div>
                </div>
                <span className="font-mono text-xs text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                  {analysisResult.retainedMemories?.length || 0} retained
                </span>
              </div>

              <div className="mt-4 space-y-2.5">
                {analysisResult.retainedMemories && analysisResult.retainedMemories.length > 0 ? (
                  analysisResult.retainedMemories.map((mem, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-200 font-mono flex items-start gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span>{mem.content}</span>
                        <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500 font-sans">
                          <span>Bank: {mem.bankId}</span>
                          <span>•</span>
                          <span>{new Date(mem.retainedAt).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No facts retained in this step.</p>
                )}
              </div>
            </div>

            {/* RECALL Column */}
            <div className="rounded-2xl border border-indigo-500/20 bg-slate-900/60 p-6 backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Search className="h-4 w-4" />
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Memories Recalled from Hindsight</h4>
                    <p className="text-[11px] text-slate-400">Historical customer context queried</p>
                  </div>
                </div>
                <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  {analysisResult.recalledMemories?.length || 0} recalled
                </span>
              </div>

              <div className="mt-4 space-y-2.5">
                {analysisResult.recalledMemories && analysisResult.recalledMemories.length > 0 ? (
                  analysisResult.recalledMemories.map((mem, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-indigo-500/30 bg-slate-950/70 p-3 text-xs text-slate-200"
                    >
                      <div className="flex items-center justify-between text-[10px] text-indigo-400 mb-1">
                        <span className="font-semibold uppercase tracking-wider">Memory #{i + 1} ({mem.type || 'observation'})</span>
                        {mem.relevanceScore && (
                          <span className="font-mono text-slate-400">Relevance: {(mem.relevanceScore * 100).toFixed(0)}%</span>
                        )}
                      </div>
                      <p className="font-mono text-[11px] text-slate-300">"{mem.text}"</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-xs text-slate-400 text-center">
                    <p>No prior historical memories were recalled for this query.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Before & After Memory Impact Showcase */}
          <BeforeAfterComparison
            comparisonData={analysisResult.comparison}
            currentTranscript={transcript}
          />
        </div>
      )}
    </div>
  );
}
