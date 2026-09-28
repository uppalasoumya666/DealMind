import { HindsightClient } from '@vectorize-io/hindsight-client';
import { config } from './src/config/env.js';
import { hindsightService } from './src/services/hindsight.js';
import { dealService } from './src/services/dealService.js';

console.log('Testing DealMind Backend Components...');
console.log('--------------------------------------------------');
console.log('Node version:', process.version);
console.log('Hindsight Base URL:', config.hindsight.baseUrl);
console.log('Hindsight API Key configured:', config.hindsight.apiKey ? 'YES (hidden)' : 'NO (empty)');
console.log('Hindsight Bank ID:', config.hindsight.bankId || 'None');
console.log('Gemini API Key configured:', config.gemini.apiKey ? 'YES (hidden)' : 'NO (empty)');

console.log('\nTesting Deals Data:');
const deals = dealService.getAllDeals();
console.log(`Loaded ${deals.length} deals:`, deals.map(d => `${d.customer} (${d.valueFormatted})`).join(', '));

const stats = dealService.getDashboardStats();
console.log('Dashboard Stats:', stats);

console.log('\nChecking Hindsight Client status:');
const connection = await hindsightService.checkConnection();
console.log('Hindsight Check Result:', connection);

console.log('\nAll initial checks passed.');
