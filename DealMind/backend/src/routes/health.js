import express from 'express';
import { hindsightService } from '../services/hindsight.js';
import { llmService } from '../services/llm.js';
import { config } from '../config/env.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const hindsightStatus = await hindsightService.checkConnection();
    
    res.json({
      status: 'ok',
      service: 'DealMind Backend API',
      timestamp: new Date().toISOString(),
      hindsight: {
        configured: hindsightService.isConfigured(),
        ...hindsightStatus,
      },
      llm: {
        activeProvider: llmService.activeProvider,
        geminiConfigured: Boolean(config.gemini.apiKey),
        openaiConfigured: Boolean(config.openai.apiKey),
      },
      environment: {
        port: config.port,
        nodeVersion: process.version,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
});

export default router;
