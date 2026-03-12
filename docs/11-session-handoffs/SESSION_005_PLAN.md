# SESSION 005 — ARCHITECT AGENT + FIRST REVENUE
## Sovereign Digital Imperium — Planning Document
**Target Start**: Next Session
**Priority**: HIGH — Revenue-generating features
**Goal**: Deploy first demo websites → Close first deals → Earn first Rupiah!

---

## MISSION BRIEF

Session 005 focuses on the **Architect Agent** — the Ghost Web Builder that creates professional landing pages for UMKM leads in under 60 seconds. Combined with the existing Closer Agent, this creates the full pipeline:

```
HUNT → SCORE → CONTACT (WA) → DEMO → CLOSE → REVENUE!
```

---

## TASK BREAKDOWN

### Task 1: Architect Agent (`src/agents/architect.ts`)
**Priority**: CRITICAL

Create a website template engine that generates complete HTML landing pages from lead data.

**Templates needed** (5 categories):
1. **Barber Shop** — Dark theme, bold fonts, booking CTA, gallery placeholder
2. **Cafe/Restaurant** — Warm colors, menu section, location map, order via WA
3. **Salon & Beauty** — Elegant, gallery, services list, booking via WA
4. **Bengkel/Workshop** — Clean, services, price list, WhatsApp CTA
5. **Generic** — Universal template for any UMKM

**Each template includes**:
- Business name, address, phone
- Rating & review count showcase
- WhatsApp booking button (deeplink)
- Google Maps link
- Mobile-responsive (Tailwind CSS via CDN)
- Professional look, clean design
- Open Graph meta tags for sharing

**Input**: Lead data from Supabase
**Output**: Complete HTML string (self-contained, no external dependencies except CDN)

### Task 2: Demo Deployment API
**Priority**: HIGH

```
POST /api/architect/generate
  → Input: { lead_id, template_type }
  → Generate HTML from lead data + template
  → Return: { html, preview_url }

GET /api/demos
  → List all generated demos

GET /api/demos/:id
  → Serve the actual demo HTML page

POST /api/demos/:id/track
  → Track page view (increment counter)
```

### Task 3: Closer Agent Enhancement
**Priority**: HIGH

- New message type: `demo_offer` with actual demo URL
- Auto-generate demo → auto-generate WA message with link
- Pipeline: one-click "Generate Demo + Send WA" per lead

### Task 4: Lead Status Pipeline
**Priority**: MEDIUM

```
new → contacted → demo_sent → interested → converted → rejected
```

Update lead status in Supabase when:
- WA message sent → status: "contacted"
- Demo generated → status: "demo_sent"
- Lead responds positively → status: "interested"
- Deal closed → status: "converted"

### Task 5: Transaction & Revenue API
**Priority**: MEDIUM

```
POST /api/transactions
  → Record payment: { lead_id, amount_idr, payment_method, notes }

GET /api/treasury/stats
  → Real revenue from Supabase (not dummy data)
```

Create Supabase table: `transactions`
```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER REFERENCES hunting_leads(id),
  amount_idr INTEGER NOT NULL,
  amount_usd DECIMAL(10,2),
  description TEXT,
  payment_method TEXT DEFAULT 'transfer',
  payment_status TEXT DEFAULT 'pending',
  invoice_number TEXT,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Task 6: Dashboard v4.5 Update
**Priority**: MEDIUM

- Builder tab: template preview + one-click generate
- Lead cards: "Generate Demo" button → instant preview
- Treasury: Real revenue from DB
- Pipeline view: visual funnel (new → contacted → demo → interested → converted)

---

## REVENUE STRATEGY

### Pricing Tiers:
| Tier | Price | What They Get |
|------|-------|--------------|
| Basic | Rp 150.000 | Landing page + WA booking |
| Standard | Rp 250.000 | Landing page + menu/gallery + WA |
| Premium | Rp 500.000 | Full website + booking system + domain |

### Sales Flow:
1. **Hunt**: Find UMKM without website (AI Score 80+)
2. **Contact**: Send personalized WA message
3. **Demo**: Generate free demo website → share link
4. **Close**: "Kalau cocok, harga spesial Rp 150rb aja"
5. **Deliver**: Customize template → deploy to their sub-domain
6. **Upsell**: Offer maintenance Rp 50rb/bulan

### Targets:
- **Week 1**: 5 demos deployed, 2 sales (Rp 400.000)
- **Week 2**: 10 demos, 5 sales (Rp 1.000.000)
- **Week 3**: 15 demos, 8 sales (Rp 2.000.000)
- **Week 4**: 20 demos, 15 total (Rp 4.500.000)
- **TOTAL**: Rp 7.900.000 (~$527) → TARGET ACHIEVED!

---

## FILES TO CREATE/MODIFY

### New Files:
- `src/agents/architect.ts` — Template engine
- `src/templates/barber.ts` — Barber shop template
- `src/templates/cafe.ts` — Cafe template
- `src/templates/salon.ts` — Salon template
- `src/templates/workshop.ts` — Workshop template
- `src/templates/generic.ts` — Generic template

### Modified Files:
- `src/index.tsx` — New routes (architect, demos, transactions)
- `src/pages/dashboard.ts` — Builder tab upgrade, pipeline view
- `src/agents/closer.ts` — Demo offer messages

### Supabase:
- New table: `transactions`
- New table: `demos` (optional, or use in-memory + Supabase)

---

## SUCCESS CRITERIA

- [ ] 5 website templates generating correctly
- [ ] Demo pages serveable via API
- [ ] WA messages include demo links
- [ ] Lead status pipeline working
- [ ] First transaction recorded
- [ ] Production deployed and verified
- [ ] Dashboard shows real pipeline data

---

## FUTURE SESSIONS MAP

```
Session 005: Architect Agent + Demo Deploy (THIS SESSION)
Session 006: Harvester Agent + Payment Automation
Session 007: Full Orchestrator (autonomous hunt → contact → demo → close loop)
Session 008: Web 2.5 Store — Agent marketplace activation
Session 009: Web 3.0 Economy — Token/staking integration
Session 010: Scale — Auto-scaling, monitoring, optimization
```

---

*Prepared for GANI HYPHA (Gyss) — Sovereign Digital Imperium*
*"From zero to $500 in 30 days. One hunt at a time."*
