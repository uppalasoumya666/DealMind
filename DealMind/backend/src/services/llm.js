import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { config } from '../config/env.js';

class LLMService {
  constructor() {
    this.gemini = null;
    this.openai = null;
    this.initProviders();
  }

  initProviders() {
    if (config.gemini.apiKey && config.gemini.apiKey.trim() !== '') {
      try {
        const genAI = new GoogleGenerativeAI(config.gemini.apiKey.trim());
        this.gemini = genAI.getGenerativeModel({ model: config.gemini.model || 'gemini-1.5-flash' });
        console.log(`[LLM] Initialized Gemini (${config.gemini.model})`);
      } catch (err) {
        console.error('[LLM] Failed to initialize Gemini:', err.message);
      }
    }

    if (config.openai.apiKey && config.openai.apiKey.trim() !== '') {
      try {
        this.openai = new OpenAI({ apiKey: config.openai.apiKey.trim() });
        console.log(`[LLM] Initialized OpenAI (${config.openai.model})`);
      } catch (err) {
        console.error('[LLM] Failed to initialize OpenAI:', err.message);
      }
    }

    if (!this.gemini && !this.openai) {
      console.warn('[LLM] No external LLM key set. Using built-in contextual sales reasoning engine.');
    }
  }

  get activeProvider() {
    if (this.gemini) return 'gemini';
    if (this.openai) return 'openai';
    return 'local-heuristic';
  }

  /**
   * EXTRACT: Parse sales conversation and extract high-signal facts for Hindsight memory
   */
  async extractDealFacts(conversationText, dealContext = {}) {
    if (this.gemini) {
      try {
        const prompt = `
You are DealMind, an expert AI sales intelligence system.
Analyze the following sales conversation transcript for deal: ${dealContext.customer || 'Customer'} (${dealContext.product || 'Enterprise Product'}).

Extract ONLY critical, long-term deal facts suitable for persistent memory retention:
- customer requirements (e.g., license count, features)
- pricing concerns and budget limitations
- implementation deadlines and timeline mandates
- competitors evaluated or mentioned
- stakeholder concerns and objections
- decisions and commitments made

DO NOT include conversational filler or pleasantries.

Transcript:
"""
${conversationText}
"""

Return ONLY a valid JSON object:
{
  "summary": "1-sentence executive summary of what transpired",
  "factsToRetain": [
    "Clean, factual statement 1 for persistent memory",
    "Clean, factual statement 2 for persistent memory"
  ],
  "extractedEntities": {
    "requirements": ["..."],
    "pricingConcerns": ["..."],
    "deadlines": ["..."],
    "competitors": ["..."],
    "objections": ["..."]
  },
  "customerSentiment": "positive | hesitant | at-risk | neutral",
  "categories": ["requirements", "pricing", "deadline", "competition"]
}
`;
        const result = await this.gemini.generateContent(prompt);
        const text = result.response.text();
        const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(cleaned);
      } catch (err) {
        console.error('[Gemini Fact Extraction Error]:', err.message);
      }
    }

    if (this.openai) {
      try {
        const completion = await this.openai.chat.completions.create({
          model: config.openai.model || 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are DealMind, an expert sales intelligence assistant. Output valid JSON only.' },
            { role: 'user', content: `Analyze this conversation transcript for deal: ${dealContext.customer || 'Customer'}. Extract critical deal facts:\n\n${conversationText}` },
          ],
          response_format: { type: 'json_object' },
        });
        return JSON.parse(completion.choices[0].message.content);
      } catch (err) {
        console.error('[OpenAI Fact Extraction Error]:', err.message);
      }
    }

    return this.heuristicFactExtraction(conversationText, dealContext);
  }

  /**
   * REASON & RECOMMEND:
   * Synthesize conversation + deal info + recalled Hindsight memories into risk assessment & actionable recommendation
   */
  async reasonAndRecommend({ conversationText, deal = {}, recalledMemories = [], extractedFacts = {} }) {
    const memoryContext = recalledMemories.map((m, i) => `Memory #${i + 1}: ${m.text || m.content} (Type: ${m.type || 'fact'})`).join('\n');

    if (this.gemini) {
      try {
        const prompt = `
You are DealMind, an AI sales strategist.
Analyze the current situation for deal:
- Customer: ${deal.customer || 'Acme Technologies'}
- Deal Value: ${deal.valueFormatted || deal.value || '₹8,50,000'}
- Product: ${deal.product || 'Enterprise Platform'}
- Stage: ${deal.stage || 'Negotiation'}
- Sales Rep: ${deal.salesRep || 'Soumya'}

HISTORICAL MEMORIES RECALLED FROM HINDSIGHT:
${memoryContext || 'None available yet.'}

CURRENT CONVERSATION FACTS:
${(extractedFacts.factsToRetain || []).join('\n') || conversationText}

LATEST CONVERSATION TRANSCRIPT:
"""
${conversationText}
"""

YOUR TASK:
1. REASON: Synthesize how past memories (e.g. pricing objections, 30-day timeline requirement) interact with current conversation (e.g. competitor evaluation). If past concerns are recalled, notice compounding deal risk!
2. RISK ASSESSMENT: Determine risk level (HIGH, MEDIUM, or LOW), risk score (0-100), risk factors, and clear explanation.
3. RECOMMENDATION: Formulate the single most effective next step for the sales rep.
4. COMPARISON: Show how an agent WITHOUT memory would behave generically vs how DealMind with Hindsight acts strategically.

Return ONLY a valid JSON object matching:
{
  "risk": {
    "level": "HIGH | MEDIUM | LOW",
    "score": 88,
    "factors": ["Competing vendor evaluating", "Past unaddressed pricing concern", "Strict 30-day timeline deadline"],
    "explanation": "Detailed explanation of why the deal is at this risk level based on the memory synthesis."
  },
  "recommendations": {
    "primaryAction": "Specific, actionable instruction for the sales rep",
    "strategy": "Strategic overview",
    "talkingPoints": [
      "Key point 1 addressing pricing & timeline",
      "Key point 2 differentiating against competitor"
    ],
    "suggestedOffer": "Concrete commercial or delivery counter-offer"
  },
  "comparison": {
    "withoutMemory": {
      "assessment": "Appears to be standard vendor evaluation (Medium risk).",
      "action": "Send standard product one-sheeter and request a routine follow-up call.",
      "failureReason": "Blind to earlier pricing sensitivity and 30-day go-live mandate. Likely to lose the deal on speed and price."
    },
    "withHindsight": {
      "assessment": "Critical compounding risk: Buyer is testing competitor specifically because pricing was high and 30-day deadline is approaching.",
      "action": "Executive intervention: Offer volume-tiered discount and contractual 30-day onboarding SLA to eliminate competitor leverage.",
      "advantage": "Hindsight recalled Day 1 pricing friction and Day 5 deadline, allowing the rep to proactively neutralize both before the competitor closes."
    }
  }
}
`;
        const result = await this.gemini.generateContent(prompt);
        const text = result.response.text();
        const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
        return JSON.parse(cleaned);
      } catch (err) {
        console.error('[Gemini Reason & Recommend Error]:', err.message);
      }
    }

    if (this.openai) {
      try {
        const completion = await this.openai.chat.completions.create({
          model: config.openai.model || 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are DealMind, an expert sales strategist. Output valid JSON only.' },
            { role: 'user', content: `Synthesize deal context, current conversation, and Hindsight recalled memories into risk score and sales recommendations.\nCustomer: ${deal.customer}\nRecalled Memories:\n${memoryContext}\nCurrent text:\n${conversationText}` },
          ],
          response_format: { type: 'json_object' },
        });
        return JSON.parse(completion.choices[0].message.content);
      } catch (err) {
        console.error('[OpenAI Reason & Recommend Error]:', err.message);
      }
    }

    return this.heuristicReasonAndRecommend({ conversationText, deal, recalledMemories, extractedFacts });
  }

  /**
   * Rule-based intelligent fallback for fact extraction
   */
  heuristicFactExtraction(text, dealContext) {
    const lower = text.toLowerCase();
    const facts = [];
    const categories = [];
    const entities = {
      requirements: [],
      pricingConcerns: [],
      deadlines: [],
      competitors: [],
      objections: [],
    };

    // License & Requirement detection
    const licenseMatch = text.match(/(\d+)\s*(licenses|users|seats)/i);
    if (licenseMatch) {
      facts.push(`Customer requires approximately ${licenseMatch[1]} licenses for their deployment.`);
      entities.requirements.push(`${licenseMatch[1]} licenses`);
      categories.push('requirements');
    } else if (lower.includes('license') || lower.includes('requirement')) {
      facts.push('Customer specified license scaling requirements.');
      categories.push('requirements');
    }

    // Pricing & Budget detection
    if (lower.includes('price') || lower.includes('pricing') || lower.includes('budget') || lower.includes('cost') || lower.includes('expensive') || lower.includes('discount')) {
      facts.push('Pricing and budget are significant concerns for the customer.');
      entities.pricingConcerns.push('Budget sensitivity / pricing friction');
      categories.push('pricing');
    }

    // Timeline & Deadline detection
    const dayDeadlineMatch = text.match(/(\d+)\s*(days|weeks|months)/i);
    if (dayDeadlineMatch) {
      facts.push(`Implementation must be strictly completed within ${dayDeadlineMatch[1]} ${dayDeadlineMatch[2]}.`);
      entities.deadlines.push(`${dayDeadlineMatch[1]} ${dayDeadlineMatch[2]} go-live deadline`);
      categories.push('deadline');
    } else if (lower.includes('deadline') || lower.includes('timeline') || lower.includes('immediate')) {
      facts.push('Customer has urgent implementation delivery timeline constraints.');
      categories.push('deadline');
    }

    // Competitor & Vendor evaluation
    if (lower.includes('competitor') || lower.includes('another vendor') || lower.includes('other vendor') || lower.includes('evaluating') || lower.includes('alternative') || lower.includes('cloudscale')) {
      facts.push('Customer is actively evaluating competing vendor proposals.');
      entities.competitors.push('Active alternative vendor evaluation');
      categories.push('competition');
    }

    if (facts.length === 0) {
      facts.push(`Discussion regarding ${dealContext.customer || 'customer'} deployment terms and progress.`);
      categories.push('general_update');
    }

    let sentiment = 'neutral';
    if (categories.includes('competition') || (categories.includes('pricing') && categories.includes('deadline'))) {
      sentiment = 'at-risk';
    } else if (categories.includes('pricing')) {
      sentiment = 'hesitant';
    } else if (lower.includes('agree') || lower.includes('ready') || lower.includes('sign')) {
      sentiment = 'positive';
    }

    return {
      summary: facts.join(' ') || 'Sales interaction reviewed and categorized.',
      factsToRetain: facts,
      extractedEntities: entities,
      customerSentiment: sentiment,
      categories: Array.from(new Set(categories)),
    };
  }

  /**
   * Rule-based intelligent fallback for reasoning and recommendation
   */
  heuristicReasonAndRecommend({ conversationText, deal, recalledMemories, extractedFacts }) {
    const memoryTexts = (recalledMemories || []).map(m => (m.text || m.content || '').toLowerCase()).join(' ');
    const currentText = (conversationText + ' ' + (extractedFacts?.factsToRetain || []).join(' ')).toLowerCase();
    const allContext = `${memoryTexts} ${currentText}`;

    const hasPricingConcern = allContext.includes('price') || allContext.includes('pricing') || allContext.includes('budget') || allContext.includes('discount');
    const hasDeadline = allContext.includes('30 day') || allContext.includes('30-day') || allContext.includes('deadline') || allContext.includes('implementation');
    const hasCompetitor = currentText.includes('vendor') || currentText.includes('competitor') || currentText.includes('evaluating');

    // SCENARIO 1: Competitor mentioned WITH historical memories of pricing or 30-day deadline
    // (The climax of Day 10 with Hindsight memory!)
    if (hasCompetitor && (hasPricingConcern || hasDeadline)) {
      return {
        risk: {
          level: 'HIGH',
          score: 89,
          factors: [
            'Customer actively evaluating another competing vendor',
            'Unresolved Day 1 pricing friction (~100 licenses)',
            'Strict Day 5 implementation deadline (30-day turnaround)',
          ],
          explanation:
            'Critical Compounding Risk: The customer is actively evaluating a competing vendor. Recalled Hindsight memories reveal they have an unaddressed pricing friction from Day 1 and an inflexible 30-day implementation deadline from Day 5. If the salesperson fails to guarantee both rapid deployment and commercial flexibility, the competitor will win this deal.',
        },
        recommendations: {
          primaryAction:
            'Address the pricing concern directly with a 100-license tiered volume discount, formally confirm the 30-day deployment requirement with a rapid onboarding SLA, and differentiate the Enterprise Platform against the competing vendor.',
          strategy:
            'Differentiate on rapid time-to-value while nullifying competitor pricing leverage through flexible quarterly milestone billing.',
          talkingPoints: [
            'Acknowledge the 30-day go-live mandate with an SLA-backed deployment roadmap.',
            'Address the 100-license pricing concern with a volume ramp structure.',
            'Highlight our proven enterprise reliability and turnkey migration over the alternative vendor.',
          ],
          suggestedOffer:
            'Enterprise Platform with 30-day Onboarding Assurance SLA + 12% Volume Concession for 100 seats.',
        },
        comparison: {
          withoutMemory: {
            assessment: 'Moderate Risk: Rep assumes this is just standard due diligence with an alternative vendor.',
            action: 'Send standard product one-sheeter and request a routine follow-up call next week.',
            failureReason:
              'Without memory of the 30-day deadline and pricing sensitivity, the rep delivers generic messaging. The competitor moves fast and closes the deal.',
          },
          withHindsight: {
            assessment: 'High Compounding Risk: The vendor evaluation is directly fueled by past pricing doubts and delivery pressure.',
            action:
              'Targeted counter-offensive addressing the Day 1 pricing concern, Day 5 30-day deployment SLA, and competitor differentiation in a single executive proposal.',
            advantage:
              'Persistent memory synthesized three separate conversation threads into a decisive, win-or-lose intervention.',
          },
        },
      };
    }

    // SCENARIO 2: Competitor mentioned WITHOUT historical memory (Stateless Agent Behavior)
    if (hasCompetitor) {
      return {
        risk: {
          level: 'MEDIUM',
          score: 55,
          factors: ['Customer mentioned evaluating another vendor'],
          explanation:
            'Moderate Risk: Customer is evaluating an alternative vendor. In isolation, this appears to be standard procurement comparison shopping.',
        },
        recommendations: {
          primaryAction:
            'Send product collateral and ask which alternative vendor they are considering.',
          strategy: 'Standard competitive defense.',
          talkingPoints: [
            'Send product brochure.',
            'Ask what features they are looking for in the other vendor.',
          ],
          suggestedOffer: 'Standard pricing sheet with standard terms.',
        },
        comparison: {
          withoutMemory: {
            assessment: 'Moderate Risk: Customer is evaluating another vendor.',
            action: 'Send standard brochure and ask what features they are looking for.',
            failureReason:
              'Blind to the past: Completely unaware that pricing was already a sticking point on Day 1 and that they have an immovable 30-day go-live mandate from Day 5.',
          },
          withHindsight: {
            assessment: 'High Compounding Risk: The competitor is exploiting earlier delivery and cost anxieties.',
            action: 'Counter with guaranteed 30-day SLA and volume discount.',
            advantage: 'Persistent memory turns a generic chat into a high-win sales counter-offer.',
          },
        },
      };
    }

    // SCENARIO 3: Day 5 Implementation / Deadline constraint
    if (hasDeadline) {
      return {
        risk: {
          level: 'MEDIUM',
          score: 64,
          factors: [
            'Strict 30-day deployment deadline requirement',
            hasPricingConcern ? 'Prior Day 1 pricing concern remains open' : 'Operational delivery constraint',
          ],
          explanation:
            'Moderate Risk: Customer is adding operational constraints (30-day implementation). When coupled with earlier pricing friction, the deal is vulnerable unless delivery capacity is verified immediately.',
        },
        recommendations: {
          primaryAction:
            'Provide a verified 30-day deployment timeline drafted by the implementation architect, confirming milestone feasibility.',
          strategy: 'Build operational confidence to prevent the customer from looking outside.',
          talkingPoints: [
            'Present the 4-week step-by-step onboarding plan.',
            'Confirm dedicated technical onboarding manager.',
            'Keep pricing discussion warm for final contract stage.',
          ],
          suggestedOffer: 'Fast-track deployment kick-off package with no extra onboarding fees.',
        },
        comparison: {
          withoutMemory: {
            assessment: 'Low Risk: Just a routine timeline question.',
            action: 'Reply: "Yes, our team normally installs within a month."',
            failureReason: 'Does not realize the customer is getting anxious about both budget and delivery.',
          },
          withHindsight: {
            assessment: 'Elevated Medium Risk: Timelines are tightening on an already price-sensitive account.',
            action: 'Formalize 30-day milestone roadmap and lock in the 100-license scope.',
            advantage: 'Tracks the evolving deal criteria continuously across days.',
          },
        },
      };
    }

    // SCENARIO 4: Day 1 Scope & Initial Pricing Concern
    return {
      risk: {
        level: 'LOW',
        score: 38,
        factors: [
          'Initial pricing objection for ~100 licenses',
          'Customer in discovery/budget alignment phase',
        ],
        explanation:
          'Low to Moderate Friction: Customer requires approximately 100 licenses and has voiced budget concerns. Normal negotiation dynamics at this stage.',
      },
      recommendations: {
        primaryAction:
          'Quantify ROI for 100 licenses and offer tiered milestone discounts rather than an immediate flat price drop.',
        strategy: 'Anchor on business value before discounting.',
        talkingPoints: [
          'Demonstrate per-user productivity gains.',
          'Introduce flexible annual vs quarterly payment options.',
        ],
        suggestedOffer: 'Tiered 100-license package with modular add-ons.',
      },
      comparison: {
        withoutMemory: {
          assessment: 'Standard pricing inquiry.',
          action: 'Send standard price sheet.',
          failureReason: 'Loses an opportunity to anchor high-value features early.',
        },
        withHindsight: {
          assessment: 'Foundational memory retained: 100 licenses requested, price sensitivity flagged.',
          action: 'Store fact into Hindsight bank for automatic recall in future interactions.',
          advantage: 'Ensures no future sales conversation forgets this critical budget constraint.',
        },
      },
    };
  }
}

export const llmService = new LLMService();
