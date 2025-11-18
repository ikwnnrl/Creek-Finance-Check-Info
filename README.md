# Creek Finance — Badge Checker & Auto Register
Automated SUI Wallet Analyzer for Creek Finance Testnet

<p align="center">
  <b>🔍 Cek badge — 📝 Auto register — 📊 Summary otomatis — 💡 Multi-wallet</b>
</p>

---

<div align="center">

[🚀 Fitur Utama](#-fitur-utama) •
[⚙️ Instalasi](#️-persyaratan) •
[🧩 Cara Menjalankan](#-cara-menjalankan) •
[📊 Output](#-contoh-output-terminal) •
[📎 Troubleshooting](#-troubleshooting)

</div>

---

# 🤖 Creek Finance Badge Checker — SUI Wallet Automation

Skrip **Node.js otomatis** untuk mengecek status akun Creek Finance menggunakan daftar private key SUI.  
Dilengkapi fitur:

✔ Auto decode private key  
✔ Auto registrasi wallet  
✔ Fetch data user  
✔ Badge analyzer lengkap  
✔ Export invite code  
✔ Summary tabel lengkap  

---

# 🚀 Fitur Utama

### 🔐 **1. Auto Decode Private Key**
- Mendukung format Base64 dari wallet SUI.
- Menghasilkan Sui Address secara otomatis.

### 📝 **2. Auto Register Wallet**
- Jika wallet belum terdaftar → script mendaftarkan otomatis.
- Menggunakan endpoint resmi testnet Creek Finance.

### 📡 **3. Auto Fetch User Info**
Mengambil semua data penting:
- Invite Code  
- Total Points  
- Rank  
- Invite Count  
- Invitees Total Points  
- Status Check-In  

### 🪪 **4. Badge Analyzer**
- Menampilkan badge **completed** & **incomplete**
- Menampilkan progress dan reward point
- Menghitung total poin earned & remaining

### 📤 **5. Export Invite Code**
- Semua kode undangan disimpan ke `code.txt`.

### 🗂 **6. Summary Table**
- Tabel rapi berisi Address, Code, Points, Rank, Badges.

---

# ⚙️ Persyaratan

### 1. Instalasi Modul
Jalankan:

```bash
npm install axios @mysten/sui @mysten/sui.js
```

### 2. File yang Dibutuhkan

| File | Deskripsi |
|------|-----------|
| `privatekey.txt` | Daftar private key (1 per baris) |

Contoh:

```
suiprivkey1xxxxxxxxxxxxxxxxxxxxxxxxxxx
suiprivkey1abcdefghijklmnopqrs1234567
```

---

# 🧩 Cara Menjalankan

1. Pastikan `privatekey.txt` sudah terisi.  
2. Jalankan:

```bash
node index.js
```

3. Script akan:
   - Decode key  
   - Cek akun  
   - Registrasi jika perlu  
   - Menampilkan badge  
   - Membuat summary  
   - Export invite code  

---

# ⚙️ Konfigurasi

Dapat disesuaikan melalui bagian:

```js
const CONFIG = {
  PRIVATE_KEYS_FILE: 'privatekey.txt',
  OUTPUT_CODE_FILE: 'code.txt'
};
```

---

# 🧠 Mekanisme Bot

1. Ambil semua private key  
2. Decode ke address  
3. Fetch data user  
4. Jika belum terdaftar → register  
5. Ambil data badge  
6. Hitung poin  
7. Simpan result  
8. Cetak Summary  

---

# 🧾 Contoh Output Terminal

```
================================================================================
[1/15] Processing Wallet
================================================================================
📍 0x8af901cd8364f7de...
🔄 Fetching...
⚠️ Not registered → Registering...
✅ Registered successfully!

👤 ACCOUNT:
   Code: KJSD92 | Points: 140 | Rank: 2159
   Invites: 3 | Invitees Pts: 90
   Check-in: ❌

📋 BADGES (3/12 completed):

   ✅ COMPLETED:
      1. [11] Early Tester Badge
         +20pts | 2025-02-18

   ❌ INCOMPLETE:
      1. [22] Daily Check-in
         +20pts | 1/7 (14%)

💰 60pts earned | 180pts remaining
```

---

# 📊 Tabel Summary (Auto Generated)

```
┌────┬──────────────────────┬──────────┬────────┬──────┬──────────┐
│ No │ Address              │ Code     │ Points │ Rank │ Badges   │
├────┼──────────────────────┼──────────┼────────┼──────┼──────────┤
│  1 │ 0x91bd0b1af93e...    │ 23ASFJ   │ 140    │ 2159 │ 3/12     │
└────┴──────────────────────┴──────────┴────────┴──────┴──────────┘
```

---

# ⚠️ Peringatan Keamanan

> ⚡ **WAJIB DIBACA!**  
> - Jangan pernah mempublikasikan private key.  
> - Jangan jalankan di Mainnet tanpa memahami risiko.  
> - Gunakan VPN atau proxy jika memproses banyak wallet.  
> - Script ini hanya untuk edukasi & testnet.

---

# 🔧 Troubleshooting

| Masalah | Penyebab | Solusi |
|--------|----------|--------|
| `Invalid private key` | Format salah | Gunakan key Base64 dari SUI |
| `Registration failed` | API error | Coba ulangi beberapa saat |
| `No data` | Wallet belum terdaftar | Script akan coba register |
| API timeout | Server lambat | Tambah delay |

---

# 🧩 Struktur Folder

```
CreekBadgeChecker/
├── index.js
├── privatekey.txt
├── code.txt
└── README.md
```

---

# 👨‍💻 Pembuat
**Creek Finance Badge Checker**  
Dibuat oleh **iwwwit**  
Lisensi: **MIT License**

---

## 🏁 Catatan Tambahan

Skrip ini dibuat untuk tujuan **otomatisasi pengecekan akun & badge** pada platform Creek Finance.  
Gunakan dengan bijak dan pahami bahwa setiap aktivitas yang dilakukan script menggunakan wallet Anda secara langsung.
