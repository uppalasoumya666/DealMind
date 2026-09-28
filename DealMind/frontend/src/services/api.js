// DealMind API Client

const API_BASE = '/api';

export const api = {
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('Health check failed:', err.message);
      return { status: 'offline', error: err.message };
    }
  },

  async getDeals() {
    const res = await fetch(`${API_BASE}/deals`);
    if (!res.ok) throw new Error(`Failed to fetch deals: ${res.statusText}`);
    return await res.json();
  },

  async getDealById(id) {
    const res = await fetch(`${API_BASE}/deals/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch deal ${id}: ${res.statusText}`);
    return await res.json();
  },

  async analyzeConversation(payload) {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error || `Failed to analyze conversation: ${res.statusText}`);
    }
    return await res.json();
  },

  async retainMemory(payload) {
    const res = await fetch(`${API_BASE}/memory/retain`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`Failed to retain memory: ${res.statusText}`);
    return await res.json();
  },

  async recallMemories(query, bankId) {
    const res = await fetch(`${API_BASE}/memory/recall`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, bankId }),
    });
    if (!res.ok) throw new Error(`Failed to recall memories: ${res.statusText}`);
    return await res.json();
  },
};
