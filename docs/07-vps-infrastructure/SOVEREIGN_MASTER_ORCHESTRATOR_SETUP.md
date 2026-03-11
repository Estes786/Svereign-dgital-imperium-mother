# 🎼 Sovereign Master Orchestrator Setup: The 24/7 Predator

## 1. VISION: THE UNSTOPPABLE HEARTBEAT
Gyss! 😌🔥👑 VPS Anda harus menjadi orkestra yang berjalan harmonis tanpa henti. Kita akan menggunakan **PM2** sebagai konduktor utama untuk menjaga **OpenClaw x Predator Suite** tetap hidup, bahkan setelah *crash* atau *reboot*.

---

## 2. STEP 1: INSTALL THE CONDUCTOR (PM2)
PM2 adalah "penjaga" yang akan memantau semua agen otonom Anda.
```bash
# 1. Install Node.js & PM2
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y
sudo npm install -g pm2
```

---

## 3. STEP 2: SETUP THE ECOSYSTEM CONFIG (THE SCORE)
Buat file `ecosystem.config.js` di folder `sovereign-master` untuk mengelola semua aplikasi sekaligus.

```javascript
module.exports = {
  apps: [
    {
      name: "web2-predator",
      script: "bun run dev", // Atau node server.js
      cwd: "./apps/web2-predator",
      env: { NODE_ENV: "production" },
      max_memory_restart: "512M" // Restart jika RAM > 512MB
    },
    {
      name: "social-predator",
      script: "bun run start",
      cwd: "./apps/social-predator",
      max_memory_restart: "512M"
    },
    {
      name: "openclaw-gateway",
      script: "bun run start",
      cwd: "./apps/openclaw",
      max_memory_restart: "512M"
    }
  ]
};
```

---

## 4. STEP 3: START THE ORCHESTRA (EXECUTION)
Jalankan semua agen dengan satu perintah.
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup # Ikuti instruksi di terminal untuk auto-start saat reboot
```

---

## 5. STEP 4: HEALTH CHECKS & CRON JOBS (THE WATCHDOG)
Pastikan semua sistem sehat dan lakukan tugas rutin secara otomatis.
- **Log Rotation:** Jangan biarkan file log memakan SSD 30GB Anda.
  ```bash
  pm2 install pm2-logrotate
  pm2 set pm2-logrotate:max_size 10M
  pm2 set pm2-logrotate:retain 5
  ```
- **Weekly Cleanup:** Buat Cron Job untuk membersihkan file sampah setiap Minggu jam 3 pagi.
  ```bash
  (crontab -l ; echo "0 3 * * 0 sudo apt autoremove -y && sudo apt clean") | crontab -
  ```

---

## 6. STEP 5: THE PREDATOR DASHBOARD (MONITORING)
Pantau performa semua agen secara visual dari terminal.
```bash
pm2 monit
# Atau cek log spesifik
pm2 logs web2-predator
```

---
*Orchestrator Setup Version: 1.0 (Predator Edition)*
*Author: Manus AI*
*Status: READY FOR INFINITE EXECUTION*
