# ♾️ Sovereign Master Session Roadmap: 100-Token Mastery (001-End)

## 1. PENDAHULUAN: STRATEGI "LEAN & MEAN"
Gyss! 😌🔥👑 Karena kita beroperasi dalam keterbatasan **100 Token/Sesi** di GenSpark.ai, kita harus menggunakan strategi **"One-Shot Execution"**. Setiap sesi harus memiliki output yang nyata dan dapat di-handoff ke sesi berikutnya tanpa kehilangan konteks.

---

## 2. SESSION 001: THE SCOUT FOUNDATION (HUNTING MODE)
**Tujuan:** Mendapatkan 50 Hot Leads pertama dan melakukan Scoring.

- **Prompt Utama:** "Berdasarkan MODULAR_SPBA_PRD, aktifkan [SCOUT] Agent. Gunakan SerpAPI untuk mencari 50 Barber di [LOKASI TARGET]. Berikan output berupa tabel JSON dengan nama, rating, alamat, dan AI Score (0-100) berdasarkan Digital Gap mereka."
- **Output:** Tabel 50 Leads + JSON File.
- **Handoff:** Simpan daftar 50 Leads ke file `leads_001.json`.

---

## 3. SESSION 002: THE CLOSER HOOK (PERSUASION MODE)
**Tujuan:** Menyiapkan pesan "Devil Hunter" dan link WhatsApp.

- **Prompt Utama:** "Ambil data dari `leads_001.json`. Untuk 10 leads dengan skor tertinggi, buatkan pesan WhatsApp 'Devil Hunter' yang mematikan menggunakan template dari AGGRESSIVE_ACQUISITION_STRATEGY. Sertakan link WhatsApp Deeplink yang siap diklik."
- **Output:** 10 Pesan WhatsApp yang siap dikirim.
- **Handoff:** Daftar 10 "High-Priority Outreach" + Status: Ready to Send.

---

## 4. SESSION 003: THE ARCHITECT BUILDER (DEMO MODE)
**Tujuan:** Men-generate 3-5 Demo Website untuk leads yang paling potensial.

- **Prompt Utama:** "Berdasarkan MODULAR_SPBA_ARCHITECT, aktifkan [ARCHITECT] Agent. Buatkan kode HTML/Tailwind untuk Landing Page Barber 'X' (pilih dari leads_001). Gunakan Vercel API untuk melakukan auto-deploy dan berikan link demo yang sudah live."
- **Output:** 3-5 Link Demo Website (Live).
- **Handoff:** Daftar Link Demo + Status: Ready for Showcase.

---

## 5. SESSION 004: THE HARVESTER SETTLEMENT (PROFIT MODE)
**Tujuan:** Mencatat respon, melakukan closing, dan mencatat profit.

- **Prompt Utama:** "Update status 10 leads dari sesi 002. Jika ada yang closing, gunakan [HARVESTER] Agent untuk men-generate invoice Rp 150.000 - Rp 300.000. Catat profit ke dalam Treasury dan hitung progres menuju target $500."
- **Output:** Invoice + Treasury Report.
- **Handoff:** Progres Likuiditas Terkini (misal: Rp 450.000 / Rp 7.500.000).

---

## 6. SESSION 005 - END: THE INFINITY LOOP (SCALING MODE)
**Tujuan:** Otomatisasi penuh dan pengulangan siklus hingga target $500 tercapai.

- **Prompt Utama:** "Analisis performa sesi 001-004. Optimalkan 'Hook' pesan dan 'Template' website. Jalankan siklus Scout -> Closer -> Architect -> Harvester secara otomatis untuk 50 leads berikutnya. Jangan berhenti sampai target $500 tercapai."
- **Output:** Autonomous Workflow Report + Scaling Progress.
- **Handoff:** Final Report: $500 REACHED. Ready for Web 3.0 Ascension.

---

## 7. PROTOKOL SESSION HANDOFF (WAJIB)
Setiap akhir sesi, Anda **WAJIB** meminta GenSpark untuk membuat laporan ini:
```markdown
**📦 MASTER_SESSION_HANDOFF_REPORT**
- **Session_ID**: [Nomor Sesi]
- **Current_Project_State**: [Status Terakhir Project]
- **Completed_Tasks**: [Daftar Tugas Selesai]
- **Pending_Tasks**: [Daftar Tugas Tertunda]
- **Next_Session_Instruction**: [Instruksi spesifik untuk sesi berikutnya]
```

---
*Roadmap Version: 1.0 (100-Token Mastery)*
*Author: Manus AI*
*Status: READY FOR EXECUTION*
