# 🛠️ Sovereign Omni-Sync Guide: Unifying Social & Web Repo

## 1. PENDAHULUAN: THE "OMNI-MOTHER" REPO
Gyss! 😌🔥👑 Panduan ini akan membawa Anda dari 3 repository (Web 2.0, 2.5, 3.0) ke **4 Repository Terintegrasi** yang mencakup **Social Media Predator Engine**.

---

## 2. STEP 1: ADD THE SOCIAL PREDATOR REPO (L-0/L-1)
Tarik repo baru (atau folder baru) untuk Social Media Automation Anda ke dalam Mother Folder.

```bash
cd sovereign-master/apps

# 1. Tarik Repo Social Media Predator (L-0/L-1)
# (Atau buat folder baru jika belum ada reponya)
mkdir social-predator && cd social-predator
npm init -y
```

---

## 3. STEP 2: CONNECT THE SOCIAL DATA (THE SYNC)
Gunakan **Supabase** sebagai "Jantung Data" yang menghubungkan Web 2.0 (Google Maps) dengan Social Media (IG, TikTok, FB).

1.  **Web 2.0 Predator** menemukan bisnis di Google Maps.
2.  **Social Predator** otomatis mencari akun IG/TikTok bisnis tersebut berdasarkan nama/alamat.
3.  **Data Sinkron:** Jika bisnis di Google Maps punya IG, tandai di database: `has_social: true`.

---

## 4. STEP 3: OMNI-CHANNEL WEBHOOKS (THE TRIGGER)
Setting Webhook di Cloudflare Workers agar data mengalir:

- **Trigger: "New Lead Found" (Google Maps)** -> **Webhook** -> **Social Predator** (Mulai Scrape IG).
- **Trigger: "IG Commented" (Social Predator)** -> **Webhook** -> **Web 2.0 Predator** (Tandai di Dashboard: "Engagement Started").
- **Trigger: "DM Replied" (Social Predator)** -> **Webhook** -> **Web 2.5 Store** (Generate Invoice/Demo Web otomatis).

---

## 5. STEP 4: DEPLOYMENT (THE UNIFIED ASCENSION)
Gunakan **Vercel Monorepo Deployment** untuk keempat repo:
- **Project A:** `apps/web2-predator`
- **Project B:** `apps/web2.5-store`
- **Project C:** `apps/web3-hypha`
- **Project D:** `apps/social-predator` (Background Workers via Vercel Cron or Edge Functions).

---

## 6. TIPS UNTUK RAM 2GB (GOD MODE)
- **Edge Functions:** Jalankan semua logika scraping dan DM di **Edge Functions** (Cloudflare/Vercel) agar tidak membebani RAM VPS.
- **Headless Scraper:** Gunakan layanan pihak ketiga (Apify/ScraperAPI) untuk scraping agar tidak perlu menjalankan Chrome di VPS.
- **Unified Dashboard:** Gunakan `sovereign-predator-suite.pages.dev` sebagai satu-satunya dashboard untuk memantau semua platform (Google Maps + IG + TikTok).

---
*Omni-Sync Guide Version: 1.0 (Crystal Clear Integration)*
*Author: Manus AI*
*Status: READY FOR OMNI-CHANNEL EXECUTION*
