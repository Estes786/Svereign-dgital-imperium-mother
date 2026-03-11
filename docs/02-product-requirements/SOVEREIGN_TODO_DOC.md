# TODO DOCUMENTATION: SOVEREIGN ECOSYSTEM ROADMAP

## 1. IMMEDIATE ACTIONS (Phase 0: MVP Setup)
- [ ] **Setup Sovereign Subdomains:** `barber.gani-hypha-web3.pages.dev` and `legacy.gani-hypha-web3.pages.dev`.
- [ ] **Database Schema Expansion:** Add `barber_shops`, `client_styles`, `family_vault`, and `legacy_assets` tables to Supabase.
- [ ] **Initial AI Agent Prompting:** Create specialized system prompts for "Sovereign Barber Agent" and "Family Legacy Advisor" in `MASTER_SYSTEM_PROMPT.md`.
- [ ] **Landing Pages:** Build simple MVP landing pages for both SB and SL using existing `SCALanding.tsx` as a template.

---

## 2. SOVEREIGN BARBER (SB) — TASK LIST
- [ ] **Style Advisor API:** Implement the Groq-powered hair/beard style recommendation endpoint.
- [ ] **WhatsApp Booking Flow:** Connect n8n/Twilio to the GANI AI agent for barber appointments.
- [ ] **Style Vault PWA:** Create the client-facing gallery for past cuts (IPFS integration).
- [ ] **Inventory Link:** Integrate the barber dashboard with the Sovereign Store API for "Low Stock" alerts.
- [ ] **Loyalty Badges:** Deploy the "Sovereign Barber" NFT collection on Polygon/Alchemy.

---

## 3. SOVEREIGN LEGACY (SL) — TASK LIST
- [ ] **Legacy Vault UI:** Build the encrypted file upload and management interface.
- [ ] **Web5 DWN Integration:** Implement basic DWN storage for family "DIDs."
- [ ] **Family Treasury Dashboard:** Create a simplified view of family finances, $HYPHA staking, and shared goals.
- [ ] **Succession Logic:** Draft the smart contract for the "Dead Man's Switch" (Legacy Transfer).
- [ ] **Home IoT Bridge:** Research and prototype a basic local-first IoT bridge (e.g., Home Assistant to Web5).

---

## 4. INTEGRATION & CROSS-ECOSYSTEM SYNERGY
- [ ] **$HYPHA Rewards:** Implement the logic to reward "Sovereign" activities (e.g., booking a cut, securing a document).
- [ ] **Cross-Agent Bundle:** Create a "Sovereign Family Bundle" (SL + SHGA for special occasions).
- [ ] **Master Dashboard Update:** Add "Sovereign Barber" and "Sovereign Legacy" modules to the main GANI HYPHA `MasterControl.tsx`.

---

## 5. MILESTONES & TIMELINE
| Milestone | Timeline | Deliverable |
| :--- | :--- | :--- |
| **Milestone 1** | Week 1-2 | Database & Landing Pages (MVP) |
| **Milestone 2** | Week 3-4 | AI Style Advisor & WhatsApp Booking |
| **Milestone 3** | Week 5-6 | Legacy Vault (Web5) & Family Treasury |
| **Milestone 4** | Week 7-8 | Full Integration with GANI Store & $HYPHA |
| **Milestone 5** | Month 3+ | Public Launch & "Sovereign" Community Scaling |

---

## 6. MAINTENANCE & OPS
- [ ] **Weekly Backups:** Ensure Supabase and IPFS data are regularly mirrored.
- [ ] **AI Model Fine-tuning:** Update Llama 3.3 prompts based on real barber-client interactions.
- [ ] **Security Audit:** Perform a penetration test on the Legacy Vault encryption.

---
*Document Version: 1.0*
*Status: READY FOR EXECUTION*
