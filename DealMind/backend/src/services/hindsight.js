import { HindsightClient } from '@vectorize-io/hindsight-client';
import { config } from '../config/env.js';

class HindsightService {
  constructor() {
    this.client = null;
    this.initClient();
  }

  initClient() {
    const { baseUrl, apiKey } = config.hindsight;
    if (apiKey && apiKey.trim() !== '') {
      try {
        this.client = new HindsightClient({
          baseUrl: baseUrl || 'https://api.hindsight.vectorize.io',
          apiKey: apiKey.trim(),
        });
        console.log('[Hindsight] Initialized client with baseUrl:', baseUrl);
      } catch (err) {
        console.error('[Hindsight] Failed to initialize client:', err.message);
        this.client = null;
      }
    } else {
      console.warn('[Hindsight] HINDSIGHT_API_KEY is not set. Real memory operations will indicate memoryUsed=false.');
      this.client = null;
    }
  }

  isConfigured() {
    return Boolean(this.client && config.hindsight.bankId && config.hindsight.bankId.trim() !== '');
  }

  getBankId(overrideBankId) {
    return overrideBankId || config.hindsight.bankId || 'dealmind-default';
  }

  /**
   * Health check to test live connection to Hindsight Cloud
   */
  async checkConnection() {
    if (!this.client) {
      return {
        connected: false,
        message: 'Hindsight client not initialized. Set HINDSIGHT_API_KEY in backend/.env',
        configured: false,
      };
    }

    try {
      // getVersion verifies network connectivity and authentication
      const versionInfo = await this.client.getVersion();
      return {
        connected: true,
        configured: true,
        version: versionInfo?.api_version || 'active',
        features: versionInfo?.features || {},
        bankId: config.hindsight.bankId,
      };
    } catch (err) {
      console.error('[Hindsight Health Check Error]:', err.message);
      return {
        connected: false,
        configured: true,
        error: err.message,
        statusCode: err.statusCode || err.status || 500,
        message: 'Failed to communicate with Hindsight Cloud. Verify API key and network access.',
      };
    }
  }

  /**
   * RETAIN: Store extracted deal memory in Hindsight Cloud
   * @param {string} content - Natural language fact or structured deal memory
   * @param {object} options - { bankId, context, metadata, timestamp }
   */
  async retain(content, options = {}) {
    if (!this.client) {
      return {
        success: false,
        memoryUsed: false,
        error: 'Hindsight is not configured. Add HINDSIGHT_API_KEY in backend/.env',
      };
    }

    const bankId = this.getBankId(options.bankId);
    if (!bankId) {
      return {
        success: false,
        memoryUsed: false,
        error: 'Hindsight bankId is required. Set HINDSIGHT_BANK_ID in backend/.env',
      };
    }

    try {
      console.log(`[Hindsight RETAIN] Retaining fact into bank "${bankId}":`, content);
      
      const retainOptions = {
        context: options.context || 'Sales Conversation Fact',
        metadata: {
          source: 'DealMind Agent',
          dealId: options.dealId || 'unknown',
          customer: options.customer || 'unknown',
          day: options.day ? String(options.day) : undefined,
          category: options.category || 'sales_interaction',
          ...(options.metadata || {}),
        },
        timestamp: options.timestamp ? new Date(options.timestamp) : new Date(),
      };

      const result = await this.client.retain(bankId, content, retainOptions);
      console.log(`[Hindsight RETAIN Success] Result:`, result);

      return {
        success: true,
        memoryUsed: true,
        bankId,
        content,
        result,
        timestamp: retainOptions.timestamp,
      };
    } catch (err) {
      console.error('[Hindsight RETAIN Error]:', err.message);
      return {
        success: false,
        memoryUsed: false,
        error: err.message,
        statusCode: err.statusCode || 500,
      };
    }
  }

  /**
   * RECALL: Query relevant historical memories from Hindsight Cloud
   * @param {string} query - Query string (e.g., "pricing concerns, competitor, requirements")
   * @param {object} options - { bankId, budget, include_chunks }
   */
  async recall(query, options = {}) {
    if (!this.client) {
      return {
        success: false,
        memoryUsed: false,
        results: [],
        error: 'Hindsight is not configured. Add HINDSIGHT_API_KEY in backend/.env',
      };
    }

    const bankId = this.getBankId(options.bankId);
    if (!bankId) {
      return {
        success: false,
        memoryUsed: false,
        results: [],
        error: 'Hindsight bankId is required. Set HINDSIGHT_BANK_ID in backend/.env',
      };
    }

    try {
      console.log(`[Hindsight RECALL] Querying bank "${bankId}" with: "${query}"`);
      
      const recallResponse = await this.client.recall(bankId, query, {
        budget: options.budget || 'mid',
        include_chunks: true,
      });

      // Standardize memory results array
      const rawResults = recallResponse?.results || recallResponse?.memories || [];
      console.log(`[Hindsight RECALL Success] Retrieved ${rawResults.length} memories`);

      const formattedResults = rawResults.map((mem, idx) => ({
        id: mem.id || `mem-${idx}`,
        text: mem.text || mem.content || (typeof mem === 'string' ? mem : JSON.stringify(mem)),
        type: mem.type || 'observation',
        context: mem.context || '',
        metadata: mem.metadata || {},
        entities: mem.entities || [],
        occurred_start: mem.occurred_start || mem.mentioned_at || null,
        relevanceScore: mem.score || mem.relevance || 0.9,
      }));

      return {
        success: true,
        memoryUsed: true,
        bankId,
        query,
        count: formattedResults.length,
        results: formattedResults,
      };
    } catch (err) {
      console.error('[Hindsight RECALL Error]:', err.message);
      return {
        success: false,
        memoryUsed: false,
        results: [],
        error: err.message,
        statusCode: err.statusCode || 500,
      };
    }
  }

  /**
   * REFLECT: Ask Hindsight to synthesize reasoning or an opinion
   */
  async reflect(query, options = {}) {
    if (!this.client) {
      return {
        success: false,
        memoryUsed: false,
        text: '',
        error: 'Hindsight is not configured.',
      };
    }

    const bankId = this.getBankId(options.bankId);
    try {
      console.log(`[Hindsight REFLECT] Reflecting on bank "${bankId}": "${query}"`);
      const response = await this.client.reflect(bankId, query, {
        budget: options.budget || 'low',
      });
      return {
        success: true,
        memoryUsed: true,
        text: response?.text || '',
      };
    } catch (err) {
      console.error('[Hindsight REFLECT Error]:', err.message);
      return {
        success: false,
        memoryUsed: false,
        text: '',
        error: err.message,
      };
    }
  }
}

export const hindsightService = new HindsightService();
