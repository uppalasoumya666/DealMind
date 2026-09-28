# DealMind — AI Deal Intelligence Agent

> **An AI sales intelligence agent powered by Hindsight Cloud persistent memory that remembers customer interactions across deal cycles, detects compounding deal risks, and recommends decisive salesperson actions.**

---

## 📌 1. Project Overview

Traditional CRM AI assistants are **stateless**: they examine only the latest meeting notes or email in isolation. In high-stakes B2B enterprise sales, deal cycles span weeks or months with multiple stakeholders, evolving constraints, and subtle objections. When a customer says *"We are evaluating another vendor"* on Day 10, a stateless agent provides a generic response ("Send product brochure"). 

**DealMind** solves this problem by using **Hindsight Cloud** as a persistent, biomimetic memory system. DealMind autonomously **retains** high-signal facts (pricing objections, timeline constraints, budget limits) from every conversation, **recalls** them in future interactions, **reasons** over the compounded context, and **recommends** proactive commercial strategies before deals are lost.

---

## 🏗️ 2. Architecture & Memory Flow

```
┌─────────────────────────────────────────────────────────────┐
│                 React + Vite Frontend (UI)                  │
│       Dashboard • Analyzer • Deal Details • Memory Timeline │
└──────────────────────────────┬──────────────────────────────┘
                               │  HTTP / JSON (REST API)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                Node.js / Express Backend API                │
│             src/routes/analyze.js (Port: 5001)              │
└───────┬──────────────────────┬──────────────────────┬───────┘
        │                      │                      │
   [1] Extract            [2] RETAIN             [3] RECALL
        │                      │                      │
        ▼                      ▼                      ▼
┌───────────────┐     ┌───────────────────────────────────────┐
│  LLM Engine   │     │        Hindsight Cloud Memory         │
│ Gemini / OpenAI│     │       (@vectorize-io/hindsight-client)│
└───────┬───────┘     └───────────────────┬───────────────────┘
        │                                 │
        └────────────────┬────────────────┘
                         ▼
                    [4] REASON
                         │
                         ▼
                   [5] RECOMMEND
                         │
                         ▼
        Structured Deal Intelligence + Compounding Risk
```

### The RETAIN → RECALL → REASON → RECOMMEND Cycle:
1. **RETAIN:** When a sales conversation occurs, DealMind extracts critical long-term facts (requirements, budget, pricing concerns, deadlines, competitors, objections) and stores them in Hindsight Cloud. Conversational filler and pleasantries are discarded.
2. **RECALL:** Prior to generating any advice, DealMind queries Hindsight using semantic and temporal search to retrieve relevant historical memories for that customer.
3. **REASON:** DealMind synthesizes the current conversation, deal parameters (value, stage, sales rep), and all recalled Hindsight memories to uncover compounding risk patterns.
4. **RECOMMEND:** DealMind generates high-conviction next steps, strategic talking points, and tailored commercial counter-offers for the salesperson.

---

## 💻 3. Tech Stack

- **Frontend:**
  - React 18
  - Vite 6
  - Tailwind CSS 3
  - Lucide React (Icons)
  - Google Fonts (Inter & JetBrains Mono)
- **Backend:**
  - Node.js (v20+ / v24)
  - Express 4
  - `@vectorize-io/hindsight-client` (Official Hindsight Cloud Client)
  - `@google/generative-ai` (Gemini 2.5 Flash / 1.5 Flash support)
  - `openai` (Optional alternative LLM provider)
  - `dotenv` & `cors`

---

## 📂 4. Folder Structure

```
DealMind/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── env.js                 # Environment validation and configuration
│   │   ├── services/
│   │   │   ├── hindsight.js           # Official @vectorize-io/hindsight-client wrapper
│   │   │   ├── llm.js                 # Gemini & OpenAI reasoning engine + fallback
│   │   │   └── dealService.js         # Deal state, demo scenarios & dashboard metrics
│   │   ├── routes/
│   │   │   ├── health.js              # GET /api/health (live Hindsight & LLM checks)
│   │   │   ├── deals.js               # GET /api/deals, GET /api/deals/:id
│   │   │   ├── memory.js              # POST /api/memory/retain, POST /api/memory/recall
│   │   │   └── analyze.js             # POST /api/analyze, POST /api/recommend
│   │   └── index.js                   # Express server entrypoint
│   ├── .env.example                   # Template for required environment variables
│   ├── .env                           # Local environment file (never committed)
│   ├── .gitignore
│   ├── package.json
│   └── test-hindsight.js              # Diagnostic verification script
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx             # Top bar with live Hindsight Cloud status
│   │   │   ├── StatCard.jsx           # Dashboard metric cards
│   │   │   ├── DealCard.jsx           # Individual deal summary cards
│   │   │   ├── RiskBadge.jsx          # HIGH / MEDIUM / LOW risk indicators
│   │   │   ├── MemoryPipelineProgress.jsx # Animated 6-step pipeline tracker
│   │   │   ├── TimelineView.jsx       # Acme Technologies memory timeline
│   │   │   └── BeforeAfterComparison.jsx # Stateless vs Hindsight comparison
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx          # Pipeline overview & active deals
│   │   │   ├── DealDetails.jsx        # Deal profile, requirements & history
│   │   │   ├── ConversationAnalyzer.jsx # Flagship interactive workbench
│   │   │   └── MemoryTimelinePage.jsx # Chronological Hindsight stream viewer
│   │   ├── services/
│   │   │   └── api.js                 # Frontend API client
│   │   ├── App.jsx                    # Root component & page router
│   │   ├── main.jsx                   # React mounting
│   │   └── index.css                  # Tailwind styles and custom utilities
│   ├── index.html
│   ├── vite.config.js                 # Vite config with backend API proxy
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── .gitignore
├── package.json                       # Root script orchestrator
└── README.md                          # Complete project documentation
```

---

## 🔑 5. Environment Variables & Setup

### A. Backend `.env` File
Create or edit `DealMind/backend/.env` (see `backend/.env.example`):

```ini
# Server Port
PORT=5001

# Hindsight Cloud (https://ui.hindsight.vectorize.io)
HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io
HINDSIGHT_API_KEY=your_hindsight_api_key_here
HINDSIGHT_BANK_ID=your_hindsight_bank_id_here

# LLM Provider - Google Gemini (Recommended)
# Get your free key at: https://aistudio.google.com
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# Optional Alternative: OpenAI API
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

### B. Hindsight Setup Steps
1. Log in to [Hindsight Cloud](https://ui.hindsight.vectorize.io/).
2. Navigate to your **Organization** and open **Memory Banks**.
3. Create a memory bank (e.g., `dealmind-acme` or `dealmind-bank`).
4. Go to **Settings / Connect / API Keys** and generate an API key.
5. Copy your API Key into `HINDSIGHT_API_KEY` and Bank ID into `HINDSIGHT_BANK_ID` in `DealMind/backend/.env`.

---

## 🚀 6. Installation & Running

### Option 1: Quick Start (From Root)
Open your terminal in `DealMind/` or the root workspace folder:

```bash
# 1. Install dependencies
cd DealMind/backend && npm install
cd ../frontend && npm install
cd ..

# 2. Start Backend (Terminal 1)
npm run dev:backend

# 3. Start Frontend (Terminal 2)
npm run dev:frontend
```

Frontend will run at: **http://localhost:5173**  
Backend API will run at: **http://localhost:5001**

---

## 🎯 7. Demo Customer Scenario (Acme Technologies)

- **Customer:** Acme Technologies
- **Deal Value:** ₹8,50,000
- **Product:** Enterprise Platform
- **Sales Rep:** Soumya
- **Stage:** Negotiation

### Step-by-Step Interactive Demo:
1. Open **Conversation Analyzer** in the top navigation.
2. Click **"Day 1: Scope & Pricing"**:
   - *Transcript:* "Hi Soumya, thanks for the platform walkthrough yesterday. Our team needs approximately 100 licenses... However, the pricing quote looks quite high compared to our allocated fiscal budget. Can we discuss volume discounts?"
   - Click **Analyze Conversation**.
   - DealMind extracts: `~100 licenses needed`, `pricing is a concern`.
   - Facts are **retained** into Hindsight Cloud. Risk level: `LOW`.
3. Click **"Day 5: 30-Day Deadline"**:
   - *Transcript:* "Soumya, our executive steering committee met this morning. We can only move forward if the implementation can be fully completed within 30 days..."
   - Click **Analyze Conversation**.
   - DealMind retains: `30-day implementation deadline`.
   - Recalls Day 1 pricing friction. Risk level: `MEDIUM`.
4. Click **"Day 10: Competitor Climax"**:
   - *Transcript:* "Hi Soumya, to be transparent, we are currently evaluating another vendor who reached out with an aggressive proposal. We like your product, but we have urgent delivery needs and need to make a final vendor decision this week."
   - Click **Analyze Conversation**.
   - DealMind recalls:
     1. Day 1 Pricing Friction (~100 licenses)
     2. Day 5 Turnkey Mandate (30-day turnaround)
   - **Risk Level Escalates to HIGH (89%)**!
   - **Recommendation:** Proactively offer a 100-license tiered volume discount and contractual 30-day rapid deployment SLA to nullify the competitor on both price and delivery speed!

---

## ⚡ 8. Before vs. After Memory Demo

| Dimension | Agent WITHOUT Memory (Stateless) | DealMind with Hindsight Cloud |
| :--- | :--- | :--- |
| **Observation** | Sees only: *"Customer is evaluating another vendor."* | Recalls Day 1 pricing concern + Day 5 30-day deadline requirement. |
| **Risk Detection** | Underestimates risk as **Medium / Normal**. | Detects critical compounding risk (**HIGH - 89%**). |
| **Sales Action** | Generic: *"Send product brochure and ask what features they like."* | Strategic: *Deliver an SLA-backed 30-day onboarding commitment with volume discount.* |
| **Outcome** | Competitor wins on speed and budget. | Sales rep proactively closes the deal before competitor can counter. |

---

## 🔌 9. Backend API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Live diagnostic check for Hindsight Cloud and LLM provider |
| `GET` | `/api/deals` | List all deals with pipeline summary metrics |
| `GET` | `/api/deals/:id` | Fetch detailed deal record, requirements, and timeline |
| `POST` | `/api/analyze` | Full `RETAIN → RECALL → REASON → RECOMMEND` execution |
| `POST` | `/api/memory/retain`| Direct call to persist a fact into Hindsight Cloud |
| `POST` | `/api/memory/recall`| Direct call to query memories from Hindsight Cloud |
| `POST` | `/api/recommend` | Generate recommendations over provided deal context |

---

## 🧪 10. Automated Tests & Verification

Run the built-in diagnostic test:

```bash
cd DealMind/backend
node test-hindsight.js
```

Verifies:
- Node.js runtime compatibility (v24.19.0)
- `@vectorize-io/hindsight-client` SDK initialization
- Deal data integrity & dashboard aggregations
- Live Hindsight Cloud connectivity and credentials status

---

## 🔮 11. Known Limitations & Future Improvements

- **CRM Ingestion:** Currently supports pasted transcripts and preset demo interactions; future versions can auto-sync via Salesforce / HubSpot webhooks.
- **Multimodal Audio:** Can be extended with Whisper / Gemini Audio to transcribe customer calls directly in real time.
- **Automated Email Drafting:** Can draft ready-to-send executive follow-up emails directly inside the sales rep's inbox.
