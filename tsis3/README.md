# TSIS 3 — CFO Bot (Cloud Economics)

## Live Demo
**[https://cfo-bot1.web.app](https://cfo-bot1.web.app)**

## Overview
CFO Bot is a web-based chatbot application that estimates monthly cloud computing costs based on usage assumptions and platform selection. It acts as a virtual Chief Financial Officer, helping users understand and plan their cloud expenses before committing to a provider.

## Supported Platforms
| Platform | Currency | Region |
|----------|----------|--------|
| Amazon Web Services (AWS) | USD | Global |
| Microsoft Azure | USD | Global |
| Google Cloud Platform (GCP) | USD | Global |
| PS Cloud | KZT | Kazakhstan |
| QazCloud by Kaztelecom | KZT | Kazakhstan |

## Cloud Components
- **Compute** — Virtual machine hours (per hour pricing)
- **Storage** — Data storage volume (per GB/month pricing)
- **Bandwidth** — Outbound data transfer / egress (per GB pricing)
- **Database** — Managed DB tiers: Basic, Standard, Premium (fixed monthly cost)

## Cost Formula
```
Total Monthly Cost = C_compute + C_storage + C_bandwidth + C_database

Where:
  C_compute   = compute_hours × price_per_hour
  C_storage   = storage_gb × price_per_gb
  C_bandwidth = bandwidth_gb × price_per_gb
  C_database  = fixed tier price
```

## Tech Stack
- **Frontend:** React + Vite
- **Hosting:** Firebase Hosting (Spark plan)
- **AI Chat:** OpenAI GPT-4o-mini
- **Pricing Config:** Centralized `pricing.js` (Single Source of Truth)

## Project Structure
```
tsis3/
├── SSOT.txt                    # System Specification (Phase 1)
├── Implementation_Plan.md      # AI-generated plan (Phase 2)
├── Test_Specification.md       # AI-generated test cases (Phase 2)
├── Pricing_Strategy_Document.md # Business strategy (Phase 4)
├── README.md
└── cfo-bot/                    # Application source (Phase 3)
    ├── src/
    │   ├── App.jsx             # Main chat interface
    │   └── utils/
    │       ├── pricing.js      # Centralized pricing config
    │       ├── calculator.js   # Cost calculation engine
    │       └── openai.js       # AI chat integration
    ├── firebase.json
    └── package.json
```

## Development Methodology
This project follows **Spec-Driven Development (SDD)** via Google Antigravity:
1. **Phase 1** — System Specification (SSOT) defining scope, math models, and constraints
2. **Phase 2** — Antigravity agents generated Implementation Plan and Test Specifications
3. **Phase 3** — Application built and deployed to Firebase
4. **Phase 4** — Pricing Strategy Document based on bot outputs

## Local Setup
```bash
cd tsis3/cfo-bot
npm install
npm run dev
```

## Deployment
```bash
npm run build
firebase deploy --only hosting
```
