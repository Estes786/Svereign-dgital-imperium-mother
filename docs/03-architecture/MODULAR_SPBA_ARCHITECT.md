# MODULAR ARCHITECT: SOVEREIGN PERSONAL BUSINESS AGENT (SPBA)

## 1. ARCHITECTURE OVERVIEW: THE AUTONOMOUS BRAIN
SPBA adalah sistem otonom berlapis (Multi-Layer) yang menggabungkan kekuatan **CrewAI** (Orkestrasi Agen) dengan infrastruktur **Web 2.5 Bridge** (Vercel/Cloudflare). Ini dirancang untuk **Zero Manual Intervention**.

---

## 2. SYSTEM LAYERS (THE 4-LAYER MODEL)

### 2.1 Layer 1: The Predator Crew (Orchestration)
- **Framework:** CrewAI (Python).
- **Agents:**
  - **The Scout:** Lead Hunter (SerpAPI).
  - **The Profiler:** AI Scoring & Gap Analysis.
  - **The Ghostwriter:** "Devil Hunter" Copywriter.
  - **The Architect:** Instant Builder (AI Code Gen).
  - **The Harvester:** Finance & Staking Manager.

### 2.2 Layer 2: The Infrastructure (Web 2.5 Bridge)
- **Deployment:** Vercel API / Cloudflare Pages API (Direct Upload).
- **Compute:** Cloudflare Workers (Edge Computing).
- **Database:** Supabase (PostgreSQL + Real-time).
- **Communication:** WhatsApp Deeplink API.

### 2.3 Layer 3: The Intelligence (AI Brain)
- **Models:** Llama-3.3-70b (via Groq API) - Ultra Fast & Free.
- **RAG:** Retrieval Augmented Generation untuk data klien & pasar.
- **Memory:** LangChain / Mem0 untuk mengingat riwayat sesi.

### 2.4 Layer 4: The Identity (Web 5 Foundation)
- **Identity:** Decentralized Identifiers (DIDs).
- **Data Storage:** Decentralized Web Nodes (DWNs) untuk kedaulatan data.

---

## 3. DATA FLOW: THE PREDATOR LOOP (AUTOMATED)

1.  **Input:** Perintah strategis dari Master App (misal: "Target 20 Barber di Jakarta").
2.  **Scouting:** **The Scout** melakukan scrape GMaps via SerpAPI.
3.  **Profiling:** **The Profiler** memfilter dan menskor leads (Gap Analysis).
4.  **Generation:** **The Architect** men-generate kode Landing Page/PWA (HTML/Tailwind).
5.  **Deployment:** **The Architect** melakukan auto-deploy via Vercel API.
6.  **Outreach:** **The Ghostwriter** menyiapkan pesan WA personal dengan link demo.
7.  **Harvesting:** **The Harvester** mencatat profit dan memindahkan dana ke Liquidity Fund.

---

## 4. TECH STACK (PREDATOR EDITION)
| Komponen | Teknologi | Alasan |
| :--- | :--- | :--- |
| **Language** | Python 3.11 | Library AI yang matang (CrewAI, LangChain). |
| **Framework** | Hono v4 | Ringan & cepat untuk API di Edge. |
| **LLM API** | Groq API | Kecepatan tinggi (<100ms) & Gratis (Llama-3.3). |
| **Frontend** | React + Tailwind | Mobile-first & mudah di-generate AI. |
| **Deployment** | Vercel API | Mendukung deployment statis instan via API. |

---

## 5. SCALABILITY & ERROR HANDLING
- **Modular Design:** Setiap agen adalah modul terpisah yang bisa di-upgrade tanpa mengganggu agen lain.
- **Self-Healing:** Jika deployment gagal, **The Architect** otomatis mencoba deploy ke provider cadangan (Cloudflare).
- **Session Handoff:** State disimpan di Supabase agar progress tidak hilang saat ganti sesi AI.

---
*Document Version: 4.0 (Modular Architect)*
*Author: Manus AI*
