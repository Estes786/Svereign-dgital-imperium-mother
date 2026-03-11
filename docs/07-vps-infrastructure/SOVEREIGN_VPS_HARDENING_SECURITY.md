# 🛡️ Sovereign VPS Hardening & Security Protocol (Ubuntu 24.04)

## 1. VISION: THE UNBEATABLE FORTRESS
Gyss! 😌🔥👑 VPS Anda adalah markas besar (HQ) dari **Sovereign Predator Suite**. Kita harus mengamankannya agar tidak ada "penyusup" yang bisa mencuri data atau menghentikan agen otonom Anda.

---

## 2. STEP 1: INITIAL SYSTEM UPDATE
Selalu mulai dengan sistem yang paling baru dan aman.
```bash
sudo apt update && sudo apt upgrade -y
sudo apt autoremove -y
```

---

## 3. STEP 2: SECURE SSH ACCESS (THE GATEKEEPER)
Jangan biarkan orang menebak password Anda.
- **Ubah Port SSH:** Ubah dari 22 ke port acak (misal: 2209).
- **Disable Root Login:** Jangan izinkan login langsung sebagai root.
- **SSH Key Only:** Gunakan SSH Key untuk login, matikan Password Authentication.

```bash
# Edit file config SSH
sudo nano /etc/ssh/sshd_config

# Ubah baris berikut:
Port 2209
PermitRootLogin no
PasswordAuthentication no

# Restart SSH
sudo systemctl restart ssh
```

---

## 4. STEP 3: FIREWALL SETUP (UFW)
Hanya buka pintu yang benar-benar dibutuhkan.
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 2209/tcp # Port SSH baru Anda
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

---

## 5. STEP 4: INSTALL FAIL2BAN (THE BOUNCER)
Otomatis blokir IP yang mencoba masuk secara paksa (Brute Force).
```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 6. STEP 5: AUTOMATIC SECURITY UPDATES
Biarkan VPS Anda mengupdate celah keamanan secara otomatis.
```bash
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

---
*Security Protocol Version: 1.0 (Titan Edition)*
*Author: Manus AI*
*Status: SECURE & READY FOR DEPLOYMENT*
