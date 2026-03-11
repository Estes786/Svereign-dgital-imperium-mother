# PROJECT ESTIMATE: Sovereign Digital Imperium
**Date**: 11 Maret 2026 | **Author**: AI Dev Session #002

---

## Executive Summary

Project ini adalah **monorepo** dengan 4 web apps yang bertujuan menghasilkan **$500 USD (Rp 7.800.000)** dalam 30 hari melalui jasa digital ke UMKM Indonesia. Berikut estimasi waktu, biaya, dan session yang dibutuhkan.

---

## 1. Estimasi Session GenSpark (100 credit/hari)

| Phase | Session | Estimasi Credit | Deskripsi |
|:------|:--------|:----------------|:----------|
| S001 | 1 session | 100 credit | Mother Folder init, repo integration |
| S002 | 1 session | 100 credit | Merge docs, GitHub push, CF deploy |
| **S003** | **2-3 sessions** | **200-300 credit** | **Scout Agent (Groq + SerpAPI + Supabase)** |
| S004 | 1-2 sessions | 100-200 credit | Closer Agent (WA message gen) |
| S005 | 2-3 sessions | 200-300 credit | Architect Agent (Demo web builder) |
| S006 | 1-2 sessions | 100-200 credit | Revenue engine + basic payment |
| S007 | 1 session | 100 credit | VPS deployment + PM2 24/7 |
| S008+ | 3-5 sessions | 300-500 credit | Web3 token, DAO, scaling |
| **TOTAL** | **12-18 sessions** | **1200-1800 credit** | **~12-18 hari** |

### Timeline Realistis
- **MVP Working (Scout + Closer + Demo)**: 5-8 sessions = **5-8 hari**
- **Revenue-Ready (Payment + VPS)**: 8-12 sessions = **8-12 hari**
- **Full Suite**: 12-18 sessions = **12-18 hari**

---

## 2. Estimasi Biaya Infrastructure

| Service | Plan | Biaya/bulan | Catatan |
|:--------|:-----|:------------|:--------|
| **Cloudflare Pages** | Free | $0 | 500 builds/bulan, unlimited bandwidth |
| **Groq API** | Free | $0 | Rate limited, cukup untuk MVP |
| **SerpAPI** | Free | $0 | 100 searches/bulan |
| **Supabase** | Free | $0 | 500MB DB, 50K monthly active users |
| **GitHub** | Free | $0 | Public/private repos |
| **GenSpark** | Free | $0 | 100 credits/hari |
| **Domain (optional)** | TLD | ~$10/tahun | .com atau .id |
| **VPS (optional)** | 2GB RAM | $5-10/bulan | Untuk 24/7 automation |
| **TOTAL** | | **$0-15/bulan** | Free untuk start! |

### Upgrade Path (Setelah $500)
| Service | Upgrade | Biaya | Benefit |
|:--------|:--------|:------|:--------|
| Groq | Pro | ~$0.27/1M tokens | Higher rate limits |
| SerpAPI | Basic | $50/bulan | 5000 searches |
| Supabase | Pro | $25/bulan | 8GB DB, more auth |
| VPS | 4GB | $10-20/bulan | Better performance |

---

## 3. Estimasi Revenue (30 Hari)

### Per-Service Pricing
| Jasa | Harga (IDR) | Harga (USD) |
|:-----|:------------|:------------|
| Website demo (basic) | Rp 150.000 | ~$10 |
| Website full (landing page) | Rp 300.000 | ~$20 |
| Google Business Profile setup | Rp 100.000 | ~$7 |
| Social Media setup package | Rp 200.000 | ~$13 |
| Complete digital package | Rp 500.000 | ~$32 |

### Revenue Projection
| Minggu | Target Deals | Revenue | Kumulatif |
|:-------|:------------|:--------|:----------|
| Week 1 | 3 basic websites | Rp 450.000 | Rp 450.000 |
| Week 2 | 5 websites + 2 packages | Rp 1.900.000 | Rp 2.350.000 |
| Week 3 | 7 websites + 3 packages | Rp 2.600.000 | Rp 4.950.000 |
| Week 4 | 5 full packages | Rp 2.500.000 | Rp 7.450.000 |
| **TOTAL** | **20+ deals** | | **Rp 7.450.000 (~$480)** |

---

## 4. Prioritas Eksekusi (Session Berikutnya)

### IMMEDIATE (Session 003 - BESOK)
1. **Setup .dev.vars** di `apps/web2-predator/` dengan Groq + SerpAPI + Supabase keys
2. **Wire Scout Agent**:
   - `POST /api/scout/hunt` -> SerpAPI Google Maps -> return businesses
   - `POST /api/scout/score` -> Groq AI scoring (0-100)
   - `CRUD /api/leads` -> Supabase leads table
3. **Test** with real data (cari "barbershop di Jakarta")
4. **Deploy** web2-predator to Cloudflare Pages

### MEDIUM (Session 004-005)
1. Closer Agent - WA message generation with Groq
2. Architect Agent - Demo website HTML generation
3. Auto-deploy demo sites to Cloudflare Pages

### LATER (Session 006+)
1. Payment integration (Midtrans/DOKU)
2. VPS 24/7 orchestrator
3. Social media automation
4. Web3 token launch

---

## 5. Risiko & Mitigasi

| Risiko | Impact | Mitigasi |
|:-------|:-------|:---------|
| SerpAPI free limit (100/bulan) | Terbatas leads | Batch searches, cache results |
| Groq rate limiting | Slow AI responses | Queue requests, retry logic |
| Supabase free limit | Data storage | Cleanup old data, optimize queries |
| GenSpark 100 credit/hari | 1 session/hari max | Prioritize tasks, use handoff docs |
| Client rejection | Low revenue | Demo-first approach, value selling |

---

## 6. Success Metrics

| Metric | Target | Tracking |
|:-------|:-------|:---------|
| Sessions completed | 12+ in 18 days | This handoff doc |
| Leads generated | 100+ | Supabase leads table |
| Demo sites deployed | 20+ | Cloudflare Pages |
| Deals closed | 15+ | Pipeline CRM |
| Revenue | $500 in 30 days | Treasury dashboard |
| Closing rate | >10% | Conversion analytics |

---

*Cost Estimate | Sovereign Digital Imperium | 11 Maret 2026*
*"Free tools, paid execution. $0 cost, $500 target."*
