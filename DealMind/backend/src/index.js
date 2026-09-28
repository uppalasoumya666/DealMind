import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import healthRouter from './routes/health.js';
import dealsRouter from './routes/deals.js';
import memoryRouter from './routes/memory.js';
import analyzeRouter from './routes/analyze.js';

const app = express();

// Middlewares
app.use(cors({
  origin: '*', // Allow frontend dev server and local origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '5mb' }));

// Route registrations
app.use('/api/health', healthRouter);
app.use('/api/deals', dealsRouter);
app.use('/api/memory', memoryRouter);
app.use('/api/analyze', analyzeRouter);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'DealMind Backend API is running.',
    endpoints: {
      health: 'GET /api/health',
      deals: 'GET /api/deals',
      dealDetails: 'GET /api/deals/:id',
      analyze: 'POST /api/analyze',
      retainMemory: 'POST /api/memory/retain',
      recallMemory: 'POST /api/memory/recall',
    },
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
});

// Start Server
app.listen(config.port, () => {
  console.log(`
╔═════════════════════════════════════════════════════════════════╗
║                  DealMind — Backend Server                      ║
║         AI Deal Intelligence Agent with Hindsight Memory        ║
╚═════════════════════════════════════════════════════════════════╝
🚀 Server running at: http://localhost:${config.port}
🩺 Health Check:      http://localhost:${config.port}/api/health
💼 Deals Endpoint:    http://localhost:${config.port}/api/deals
🧠 Memory Pipeline:   http://localhost:${config.port}/api/analyze
  `);
});
