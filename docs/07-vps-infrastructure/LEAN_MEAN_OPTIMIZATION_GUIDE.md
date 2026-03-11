# 🚀 Lean & Mean Optimization Guide: 2GB RAM Mastery

## 1. VISION: THE EFFICIENCY PREDATOR
Gyss! 😌🔥👑 RAM 2GB di DomaiNesia adalah modal yang cukup kalau kita tahu cara "memeras" setiap byte-nya. Kita akan membuat VPS Anda berjalan secepat kilat tanpa *crash* saat menjalankan **OpenClaw x Predator Suite**.

---

## 2. STEP 1: CREATE A SMART SWAP FILE (THE BACKUP LUNG)
Karena RAM cuma 2GB, kita butuh "paru-paru cadangan" di SSD NVMe Anda.
```bash
# 1. Buat file swap 4GB (2x RAM)
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 2. Buat permanen
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 3. Optimasi Swappiness (Gunakan swap hanya jika perlu)
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
echo 'vm.vfs_cache_pressure=50' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

## 3. STEP 2: INSTALL ZRAM (THE RAM COMPRESSOR)
ZRAM akan mengompres data di RAM secara real-time, membuat 2GB terasa seperti 4GB.
```bash
sudo apt install zram-config -y
# Cek status
zramctl
```

---

## 4. STEP 3: NODE.JS & PYTHON TUNING (LEAN EXECUTION)
Jangan biarkan proses memakan memori berlebih.
- **Node.js:** Gunakan flag `--max-old-space-size=1024` agar proses Node tidak melebihi 1GB.
- **Python:** Gunakan `uv` atau `pip install --no-cache-dir` untuk menghemat ruang disk dan memori saat instalasi.
- **Runtime:** Gunakan **Bun** (`bun run`) sebagai pengganti Node.js jika memungkinkan, karena Bun jauh lebih hemat RAM.

---

## 5. STEP 4: CLEANUP SERVICE (THE REAPER)
Matikan service bawaan Ubuntu yang tidak perlu (Snap, Multipathd, etc).
```bash
sudo systemctl stop snapd.service multipathd.service
sudo systemctl disable snapd.service multipathd.service
```

---

## 6. STEP 5: MEMORY MONITORING (THE WATCHDOG)
Selalu pantau penggunaan RAM Anda dengan satu perintah cepat.
```bash
# Tambahkan alias ke .bashrc
echo "alias ram='free -h && ps aux --sort=-%mem | head -n 10'" >> ~/.bashrc
source ~/.bashrc
```

---
*Optimization Guide Version: 1.0 (Predator Edition)*
*Author: Manus AI*
*Status: OPTIMIZED & READY FOR ACTION*
