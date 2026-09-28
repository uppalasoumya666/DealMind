import express from 'express';
import { dealService } from '../services/dealService.js';

const router = express.Router();

// GET /api/deals - List all deals + summary stats
router.get('/', (req, res) => {
  try {
    const deals = dealService.getAllDeals();
    const stats = dealService.getDashboardStats();
    res.json({
      success: true,
      deals,
      stats,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/deals/:id - Fetch single deal with details and history
router.get('/:id', (req, res) => {
  try {
    const deal = dealService.getDealById(req.params.id);
    if (!deal) {
      return res.status(404).json({ success: false, error: 'Deal not found' });
    }
    res.json({
      success: true,
      deal,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
