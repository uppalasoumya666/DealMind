import express from 'express';
import { hindsightService } from '../services/hindsight.js';
import { llmService } from '../services/llm.js';
import { dealService } from '../services/dealService.js';

const router = express.Router();

/**
 * POST /api/analyze
 * Full RETAIN -> RECALL -> REASON -> RECOMMEND Pipeline
 * Body: { conversationText, dealId, day, speaker }
 */
router.post('/', async (req, res) => {
  try {
    const { conversationText, dealId, day, speaker } = req.body;

    if (!conversationText || typeof conversationText !== 'string' || conversationText.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'conversationText is required and cannot be empty.',
      });
    }

    const deal = dealService.getDealById(dealId || 'deal-acme-01');
    if (!deal) {
      return res.status(404).json({
        success: false,
        error: `Deal with ID "${dealId}" not found.`,
      });
    }

    const targetBankId = deal.bankId || 'dealmind-acme';
    console.log(`\n======================================================`);
    console.log(`[DealMind Analysis Flow] Deal: ${deal.customer} (${deal.id}) | Day: ${day || 'N/A'}`);
    console.log(`======================================================`);

    // -------------------------------------------------------------------------
    // STEP 1: AI Analysis & Fact Extraction
    // -------------------------------------------------------------------------
    console.log('[Step 1/5] Extracting long-term facts from conversation...');
    const extractedData = await llmService.extractDealFacts(conversationText, deal);
    const factsToRetain = extractedData.factsToRetain || [];
    console.log('[Step 1 Complete] Extracted facts:', factsToRetain);

    // -------------------------------------------------------------------------
    // STEP 2: Hindsight RETAIN
    // Store extracted facts into persistent Hindsight Cloud memory
    // -------------------------------------------------------------------------
    console.log('[Step 2/5] Retaining extracted facts into Hindsight Cloud...');
    const retainResults = [];
    let retainSucceeded = false;
    let retainError = null;

    if (factsToRetain.length > 0) {
      for (const fact of factsToRetain) {
        const retainRes = await hindsightService.retain(fact, {
          bankId: targetBankId,
          dealId: deal.id,
          customer: deal.customer,
          day,
          context: `Sales interaction Day ${day || 'N/A'} with ${deal.customer}`,
          metadata: {
            day: day ? String(day) : undefined,
            speaker: speaker || 'Customer',
            dealValue: String(deal.dealValue),
            stage: deal.stage,
          },
        });
        retainResults.push(retainRes);
        if (retainRes.success) retainSucceeded = true;
        else if (!retainError) retainError = retainRes.error;
      }
    } else {
      const retainRes = await hindsightService.retain(extractedData.summary || conversationText, {
        bankId: targetBankId,
        dealId: deal.id,
        customer: deal.customer,
        day,
      });
      retainResults.push(retainRes);
      if (retainRes.success) retainSucceeded = true;
      else retainError = retainRes.error;
    }

    // -------------------------------------------------------------------------
    // STEP 3: Hindsight RECALL
    // Retrieve historical memories for this customer/deal from Hindsight Cloud
    // -------------------------------------------------------------------------
    console.log('[Step 3/5] Recalling relevant historical memories from Hindsight Cloud...');
    const recallQuery = `pricing concerns budget implementation deadline requirements competitor ${deal.customer} ${deal.product}`;
    const recallRes = await hindsightService.recall(recallQuery, {
      bankId: targetBankId,
      budget: 'mid',
    });

    let liveRecalledMemories = recallRes.results || [];
    const liveRecallSucceeded = recallRes.success && liveRecalledMemories.length > 0;

    // Strictly report memoryUsed=true only when Hindsight Cloud live service succeeded
    const memoryUsed = Boolean(retainSucceeded || liveRecallSucceeded);

    // Context for reasoning: use live Hindsight memories if available.
    // If Hindsight is not connected yet, use prior deal timeline facts to enable reasoning demonstration
    let memoriesForReasoning = liveRecalledMemories;
    let fallbackMemoriesShown = [];

    if (!liveRecallSucceeded && deal.timeline && deal.timeline.length > 0) {
      // Prior timeline events (excluding current day if already there)
      const priorEvents = deal.timeline.filter(e => !day || e.day < day);
      fallbackMemoriesShown = priorEvents.map((e, idx) => ({
        id: `demo-mem-${idx}`,
        text: e.retainedMemory || e.summary,
        type: 'observation',
        context: e.title,
        occurred_start: e.date,
        relevanceScore: 0.95,
      }));
      memoriesForReasoning = fallbackMemoriesShown;
    }

    console.log(`[Step 3 Complete] Hindsight live recall: ${liveRecallSucceeded}, Memories for reasoning: ${memoriesForReasoning.length}`);

    // Diagnostic information
    let hindsightDiagnostic = null;
    if (!memoryUsed) {
      hindsightDiagnostic = {
        status: 'cloud_key_not_configured',
        message: retainError || recallRes.error || 'HINDSIGHT_API_KEY is not configured in backend/.env',
        hint: 'Add HINDSIGHT_API_KEY and HINDSIGHT_BANK_ID to backend/.env to activate live cloud memory persistence.',
      };
    }

    // -------------------------------------------------------------------------
    // STEP 4 & 5: REASON & RECOMMEND
    // Combine current conversation + deal information + recalled memories
    // -------------------------------------------------------------------------
    console.log('[Step 4 & 5] Reasoning over combined context and generating strategic recommendation...');
    const reasoningResult = await llmService.reasonAndRecommend({
      conversationText,
      deal,
      recalledMemories: memoriesForReasoning,
      extractedFacts: extractedData,
    });

    // Update Deal Risk in local state
    if (reasoningResult?.risk) {
      dealService.updateDealRisk(deal.id, reasoningResult.risk);
    }

    // Record interaction in deal timeline
    const timelineEntry = {
      day: day || (deal.timeline.length + 1),
      title: `Day ${day || 'X'} — ${extractedData.summary ? extractedData.summary.slice(0, 45) + '...' : 'Conversation Analyzed'}`,
      speaker: speaker || 'Customer',
      summary: extractedData.summary,
      retainedMemory: factsToRetain.join(' | ') || extractedData.summary,
      recalledCount: (liveRecalledMemories.length > 0 ? liveRecalledMemories : memoriesForReasoning).length,
      riskLevel: reasoningResult.risk?.level || 'LOW',
      recalledMemories: (liveRecalledMemories.length > 0 ? liveRecalledMemories : memoriesForReasoning).map(m => m.text),
    };
    dealService.addTimelineEvent(deal.id, timelineEntry);

    console.log(`[DealMind Analysis Flow Completed] Risk: ${reasoningResult.risk?.level}, MemoryUsed: ${memoryUsed}\n`);

    // Output returned to client
    res.json({
      success: true,
      dealId: deal.id,
      customer: deal.customer,
      day: day || null,
      memoryUsed, // STRICT RULE: true only when Hindsight Cloud succeeded
      hindsightDiagnostic,
      extractedFacts: {
        summary: extractedData.summary,
        factsToRetain,
        customerSentiment: extractedData.customerSentiment,
        categories: extractedData.categories,
        extractedEntities: extractedData.extractedEntities,
      },
      retainedMemories: factsToRetain.map((fact, idx) => ({
        id: `fact-${idx}`,
        content: fact,
        bankId: targetBankId,
        retainedAt: new Date().toISOString(),
        hindsightSuccess: retainResults[idx]?.success || false,
      })),
      recalledMemories: (liveRecalledMemories.length > 0 ? liveRecalledMemories : fallbackMemoriesShown).map((m) => ({
        id: m.id,
        text: m.text,
        type: m.type,
        context: m.context,
        occurred_start: m.occurred_start,
        relevanceScore: m.relevanceScore,
      })),
      risk: reasoningResult.risk,
      recommendation: reasoningResult.recommendations,
      comparison: reasoningResult.comparison,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[Analyze Pipeline Error]:', err);
    res.status(500).json({
      success: false,
      memoryUsed: false,
      error: err.message,
    });
  }
});

/**
 * POST /api/recommend
 * Direct recommendation generation endpoint
 * Body: { currentConversation, dealId, recalledMemories }
 */
router.post('/recommend', async (req, res) => {
  try {
    const { currentConversation, dealId, recalledMemories } = req.body;
    const deal = dealService.getDealById(dealId || 'deal-acme-01') || {};

    const recommendation = await llmService.reasonAndRecommend({
      conversationText: currentConversation || '',
      deal,
      recalledMemories: recalledMemories || [],
      extractedFacts: { factsToRetain: [] },
    });

    res.json({
      success: true,
      recommendation,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
