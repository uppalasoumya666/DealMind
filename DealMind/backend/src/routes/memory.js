import express from 'express';
import { hindsightService } from '../services/hindsight.js';

const router = express.Router();

/**
 * POST /api/memory/retain
 * Retains a single fact or conversation snippet into Hindsight Cloud
 * Body: { content, bankId, dealId, customer, context, metadata }
 */
router.post('/retain', async (req, res) => {
  try {
    const { content, bankId, dealId, customer, context, metadata, day } = req.body;
    
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'content is required and must be a non-empty string',
      });
    }

    const retainResult = await hindsightService.retain(content.trim(), {
      bankId,
      dealId,
      customer,
      context,
      metadata,
      day,
    });

    if (!retainResult.success) {
      return res.status(200).json({
        success: false,
        memoryUsed: false,
        message: retainResult.error || 'Failed to retain memory in Hindsight',
        details: retainResult,
      });
    }

    res.json({
      success: true,
      memoryUsed: true,
      retained: retainResult,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      memoryUsed: false,
      error: err.message,
    });
  }
});

/**
 * POST /api/memory/recall
 * Recalls relevant memories from Hindsight Cloud
 * Body: { query, bankId, budget }
 */
router.post('/recall', async (req, res) => {
  try {
    const { query, bankId, budget } = req.body;

    if (!query || typeof query !== 'string' || query.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'query is required and must be a non-empty string',
      });
    }

    const recallResult = await hindsightService.recall(query.trim(), {
      bankId,
      budget: budget || 'mid',
    });

    res.json({
      success: recallResult.success,
      memoryUsed: recallResult.memoryUsed,
      count: recallResult.count || 0,
      results: recallResult.results || [],
      error: recallResult.error || null,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      memoryUsed: false,
      results: [],
      error: err.message,
    });
  }
});

export default router;
