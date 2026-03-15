# SESSION 006 PLAN — Harvester Agent + Revenue Pipeline

---

## OBJECTIVE
Build the **Harvester Agent** — the deal-closing and revenue-tracking engine that transforms leads into paying clients. This completes the core revenue pipeline.

---

## PRIORITY TASKS

### 1. Harvester Agent (`agents/harvester.ts`)
- **Deal Management**: Create, track, and close deals
- **Invoice Generation**: Auto-generate invoices (HTML) for UMKM clients
- **Payment Tracking**: Record payments (transfer, cash, QRIS)
- **Status Pipeline**: lead → contacted → interested → demo_sent → negotiating → closed_won / closed_lost
- **Revenue Calculator**: Auto-compute IDR + USD, profit splits

### 2. Supabase Tables
- **`deals`**: id, lead_id, business_name, package, price_idr, status, notes, created_at, closed_at
- **`payments`**: id, deal_id, amount_idr, method, status, proof_url, paid_at
- **`invoices`**: id, deal_id, invoice_number, html, sent_via, created_at

### 3. API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/deals` | GET | List all deals |
| `/api/deals` | POST | Create deal from lead |
| `/api/deals/:id` | PATCH | Update deal status |
| `/api/deals/:id/invoice` | POST | Generate invoice |
| `/api/payments` | POST | Record payment |
| `/api/payments/:deal_id` | GET | Get payments for deal |
| `/api/treasury/stats` | GET | Live revenue stats |
| `/api/treasury/export` | GET | Export CSV |

### 4. Dashboard v6.0 — Treasury Tab Upgrade
- **Deal Pipeline Board**: Visual kanban (contacted → interested → demo → negotiating → closed)
- **Live Revenue Counter**: Real-time IDR + USD with progress bar to $500
- **Payment Recording**: Quick payment entry form
- **Invoice Viewer**: Preview and send invoices via WA
- **Profit Split Chart**: Operational / Growth / Liquidity / Staking

### 5. Service Packages
Pre-defined packages for UMKM clients:
| Package | Price IDR | Includes |
|---------|-----------|----------|
| Starter | Rp 200.000 | Landing page + WA integration |
| Growth | Rp 500.000 | Landing page + SEO + Google Maps optimization |
| Premium | Rp 1.000.000 | Full website + booking system + social media setup |
| Maintenance | Rp 150.000/mo | Monthly updates + support |

---

## EXPECTED OUTCOMES
- Full revenue pipeline: Hunt → Score → Contact → Demo → Close → PAYMENT
- Live treasury with real revenue tracking
- Invoice generation and WA delivery
- Deal pipeline management
- Target: Get first 5 deals from existing 42 leads

---

## TECHNICAL NOTES
- Reuse existing Supabase client (`lib/supabase.ts`)
- All new agent code in `agents/harvester.ts`
- Invoice HTML templates similar to demo templates
- Payment proof can be URL (uploaded elsewhere) or text notes
- QRIS integration = future phase (manual for now)

---

## SESSION 006 SUCCESS CRITERIA
- [ ] Harvester Agent functional with deal CRUD
- [ ] Invoice generation working
- [ ] Payment recording and tracking
- [ ] Treasury tab shows real revenue data
- [ ] Deal pipeline visualization in dashboard
- [ ] All deployed to production
- [ ] Master Handoff 006 created
