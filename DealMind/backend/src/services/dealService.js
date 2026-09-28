import { config } from '../config/env.js';

// Initial synthetic demo deals
let dealsData = [
  {
    id: 'deal-acme-01',
    customer: 'Acme Technologies',
    dealValue: 850000,
    valueFormatted: '₹8,50,000',
    product: 'Enterprise Platform',
    stage: 'Negotiation',
    status: 'At Risk',
    riskLevel: 'HIGH',
    riskScore: 89,
    salesRep: 'Soumya',
    bankId: config.hindsight.bankId || 'dealmind-acme',
    competitor: 'Evaluating Alternative Vendor',
    requirements: ['Approx 100 enterprise licenses', '30-day turnkey deployment SLA', 'Role-based access controls'],
    concerns: ['High per-seat pricing objection', 'Strict 30-day implementation deadline', 'Competitor offering aggressive terms'],
    timeline: [
      {
        day: 1,
        date: '2026-09-18',
        title: 'Day 1 — 100 Licenses & Pricing Friction',
        speaker: 'Acme Procurement (Rajesh)',
        summary: 'Customer expressed strong interest for ~100 licenses but raised a significant pricing concern.',
        retainedMemory: 'Customer requires ~100 licenses. Pricing is a major objection.',
        recalledCount: 0,
        riskLevel: 'LOW',
      },
      {
        day: 5,
        date: '2026-09-23',
        title: 'Day 5 — 30-Day Implementation Mandate',
        speaker: 'Acme IT Lead (Pooja)',
        summary: 'Customer stated deployment must be completed within 30 days due to quarterly audit.',
        retainedMemory: 'Implementation must be strictly completed within 30 days.',
        recalledCount: 1,
        riskLevel: 'MEDIUM',
      },
      {
        day: 10,
        date: '2026-09-28',
        title: 'Day 10 — Competitor Evaluation & Climax',
        speaker: 'Acme VP of Tech (Vikram)',
        summary: 'Customer announced active evaluation of a competing vendor offering aggressive terms.',
        retainedMemory: 'Customer actively evaluating another vendor.',
        recalledCount: 2,
        riskLevel: 'HIGH',
      },
    ],
    demoScenarios: {
      day1: {
        day: 1,
        title: 'Day 1: Scope & Pricing Concern',
        transcript: 'Hi Soumya, thanks for the platform walkthrough yesterday. Our team needs approximately 100 licenses for our engineering and ops departments. However, the pricing quote looks quite high compared to our allocated fiscal budget. Can we discuss volume discounts?',
        expectedRisk: 'LOW',
        keyFact: 'Customer needs ~100 licenses; pricing is a concern.',
      },
      day5: {
        day: 5,
        title: 'Day 5: Urgent 30-Day Timeline Mandate',
        speaker: 'Acme IT Director',
        transcript: 'Soumya, our executive steering committee met this morning. We can only move forward if the implementation can be fully completed within 30 days because of our upcoming quarterly reporting cycle. Can your delivery team commit to that?',
        expectedRisk: 'MEDIUM',
        keyFact: 'Customer requires 30-day deployment completion.',
      },
      day10: {
        day: 10,
        title: 'Day 10: Competitor Enters & Evaluation',
        speaker: 'Acme VP Technology',
        transcript: 'Hi Soumya, to be transparent, we are currently evaluating another vendor who reached out with an aggressive proposal. We like your product, but we have urgent delivery needs and need to make a final vendor decision this week.',
        expectedRisk: 'HIGH',
        keyFact: 'Customer actively evaluating competing vendor.',
      },
    },
  },
  {
    id: 'deal-nova-02',
    customer: 'Nova Systems',
    dealValue: 1400000,
    valueFormatted: '₹14,00,000',
    product: 'AI Agent Suite',
    stage: 'Proposal',
    status: 'In Progress',
    riskLevel: 'MEDIUM',
    riskScore: 62,
    salesRep: 'Rohan',
    bankId: config.hindsight.bankId || 'dealmind-nova',
    competitor: 'None reported',
    requirements: ['Multi-tenant agent orchestration', 'SOC2 Type II verification', 'SSO integration'],
    concerns: ['Security review pending compliance sign-off'],
    timeline: [
      {
        day: 3,
        date: '2026-09-20',
        title: 'Day 3 — Architecture Review',
        summary: 'Enterprise architect approved multi-tenant agent specs.',
        retainedMemory: 'Requires SOC2 Type II report before MSA signing.',
        recalledCount: 0,
        riskLevel: 'LOW',
      },
    ],
    demoScenarios: {
      day1: {
        day: 1,
        title: 'Day 1: Security Requirements',
        transcript: 'Hello Rohan, our CISO requires your SOC2 Type II audit report before we can proceed with the AI Agent Suite proposal.',
        expectedRisk: 'MEDIUM',
        keyFact: 'SOC2 Type II compliance prerequisite.',
      },
    },
  },
  {
    id: 'deal-pqr-03',
    customer: 'PQR Industries',
    dealValue: 620000,
    valueFormatted: '₹6,20,000',
    product: 'Analytics Engine',
    stage: 'Discovery',
    status: 'On Track',
    riskLevel: 'LOW',
    riskScore: 28,
    salesRep: 'Ananya',
    bankId: config.hindsight.bankId || 'dealmind-pqr',
    competitor: 'Legacy In-house scripts',
    requirements: ['25 department seats', 'PostgreSQL pipeline connector', 'Weekly scheduled reports'],
    concerns: ['Legacy database connector latency'],
    timeline: [
      {
        day: 2,
        date: '2026-09-22',
        title: 'Day 2 — Data Pipeline Sync',
        summary: 'Confirmed connection to PostgreSQL DB.',
        retainedMemory: 'Needs automated weekly executive reports.',
        recalledCount: 0,
        riskLevel: 'LOW',
      },
    ],
    demoScenarios: {
      day1: {
        day: 1,
        title: 'Day 1: Initial Discovery',
        transcript: 'Ananya, our team is looking for 25 seats for the analytics dashboard with real-time sync to PostgreSQL.',
        expectedRisk: 'LOW',
        keyFact: '25 seats, PostgreSQL connector required.',
      },
    },
  },
  {
    id: 'deal-zenith-04',
    customer: 'Zenith Global',
    dealValue: 1850000,
    valueFormatted: '₹18,50,000',
    product: 'Enterprise Platform',
    stage: 'Contract Review',
    status: 'Ready to Close',
    riskLevel: 'LOW',
    riskScore: 18,
    salesRep: 'Soumya',
    bankId: config.hindsight.bankId || 'dealmind-zenith',
    competitor: 'None',
    requirements: ['250 enterprise seats', 'Dedicated Customer Success Manager', '99.9% uptime SLA'],
    concerns: ['Minor legal redlines on indemnity clause'],
    timeline: [
      {
        day: 14,
        date: '2026-09-27',
        title: 'Day 14 — Legal Redline Review',
        summary: 'Commercial terms agreed, legal reviewing standard SLA clause.',
        retainedMemory: 'Customer approved ₹18.5L budget, waiting on legal sign-off.',
        recalledCount: 1,
        riskLevel: 'LOW',
      },
    ],
    demoScenarios: {
      day1: {
        day: 1,
        title: 'Day 1: Final Legal Review',
        transcript: 'Soumya, our procurement and legal counsel have approved the contract with standard 99.9% uptime terms.',
        expectedRisk: 'LOW',
        keyFact: 'Contract approved, final sign-off pending.',
      },
    },
  },
];

export const dealService = {
  getAllDeals() {
    return dealsData;
  },

  getDealById(id) {
    return dealsData.find((d) => d.id === id) || null;
  },

  updateDealRisk(id, riskAssessment) {
    const deal = dealsData.find((d) => d.id === id);
    if (deal && riskAssessment) {
      deal.riskLevel = riskAssessment.level || deal.riskLevel;
      deal.riskScore = riskAssessment.score || deal.riskScore;
      if (deal.riskLevel === 'HIGH') deal.status = 'At Risk';
      else if (deal.riskLevel === 'MEDIUM') deal.status = 'In Progress';
      else deal.status = 'On Track';
    }
    return deal;
  },

  addTimelineEvent(id, event) {
    const deal = dealsData.find((d) => d.id === id);
    if (deal) {
      deal.timeline = deal.timeline || [];
      deal.timeline.push({
        id: `event-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        ...event,
      });
    }
    return deal;
  },

  getDashboardStats() {
    const totalPipeline = dealsData.reduce((sum, d) => sum + (d.dealValue || 0), 0);
    const atRiskCount = dealsData.filter((d) => d.riskLevel === 'HIGH' || d.status === 'At Risk').length;
    const activeCount = dealsData.length;
    const followupsToday = 3;

    return {
      activeDeals: activeCount,
      dealsAtRisk: atRiskCount,
      followupsToday,
      pipelineValue: totalPipeline,
      pipelineValueFormatted: `₹${(totalPipeline / 100000).toFixed(2)} Lakhs`,
    };
  },
};
