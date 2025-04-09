# 🧾 Tea Auto

Script ini digunakan untuk mengirim token ERC-20 atau native coin (TEA) ke banyak alamat secara otomatis. Script mendukung banyak private key (multi-wallet), pengambilan data penerima dari file lokal atau URL, dan penjadwalan transfer otomatis dengan delay acak antar transaksi.

---

## 🔧 Fitur

- **Multi-Wallet**: Mendukung banyak private key untuk mengirim token dari beberapa wallet.
- **Dukungan Token**: Bisa mengirim native token (TEA) atau ERC-20 token.
- **Sumber Data Penerima**:
  - File lokal (`address.txt`)
  - URL
- **Randomisasi**:
  - Jumlah transfer dibuat acak dalam rentang tertentu.
  - Delay antar transfer dibuat acak untuk menghindari pola yang mudah ditebak.
- **Penjadwalan Otomatis**: Script dapat dijadwalkan untuk berjalan otomatis setiap hari pada waktu acak.
- **Logging**: Semua aktivitas dicatat di file `logs.txt`.

---

## 📁 Struktur File

```
tea-auto/
├── .env                  # File untuk menyimpan private key
├── address.txt           # (Optional) Daftar alamat penerima. Jika kosong, akan menggunakan alamat dari URL
├── config.js             # File konfigurasi utama
├── index.js              # Script utama
├── package.json          # File konfigurasi npm
├── token.txt             # File berisi alamat kontrak token
└── logs.txt              # File log aktivitas transfer
```

---

## ⚙️ Konfigurasi

### 1. `.env`

Rename `.env.example` menjadi `.env` dan isi dengan private key wallet Anda. Jika menggunakan lebih dari satu wallet, pisahkan dengan koma:

```env
PRIVATE_KEY=0xabc123...,0xdef456...
```

### 2. `config.js`

File konfigurasi utama untuk mengatur parameter script. Contoh isi file `config.js`:

```js
export default {
  rpcUrl: "https://tea-sepolia.g.alchemy.com/public", // RPC endpoint
  chainId: 10218, // Chain ID sesuai jaringan
  ExplorerUrl: "https://sepolia.tea.xyz", // URL block explorer
  defaultTokenAddress: "0x0000000000000000000000000000000000000000", // Default token address
  tokenAddress: "token.txt", // File berisi alamat kontrak token
  recipients: "address.txt", // File berisi daftar penerima
  min_amount: 0.01, // Minimal jumlah transfer
  max_amount: 0.02, // Maksimal jumlah transfer
  min_delay: 5, // Minimal delay antar transfer (detik)
  max_delay: 15, // Maksimal delay antar transfer (detik)
  max_recipients: 200, // Jumlah alamat yang dikirim per run
  address_url:
    "https://docs.google.com/spreadsheets/d/1rImLq4NMEAk5cPBGBW1-d3jI-4QC0oQoFU-JHrDostk/export?format=csv&gid=362289845", // Don't change this
};
```

---

## 🚀 Cara Menjalankan

### 1. Clone Repository

```bash
git clone https://github.com/fandyahmd/tea-auto.git
cd tea-auto
```

### 2. Install Dependensi

Pastikan Anda sudah menginstall Node.js. Kemudian jalankan perintah berikut untuk menginstall dependensi:

```bash
npm install
```

### 3. Jalankan Script

Jalankan script dengan perintah berikut:

```bash
npm start
```

---

## 📝 Catatan Penting

- **Native Token**: Jika ingin mengirim native token (TEA), kosongkan file `token.txt`.
- **Penjadwalan Otomatis**: Script akan menjadwalkan run berikutnya secara otomatis setelah selesai.
- **Saldo Wallet**: Pastikan saldo wallet cukup untuk menghindari error terkait gas fee atau transaksi yang gagal.

---

## 🛠️ Troubleshooting

- **Error "No PRIVATE_KEY found in .env"**: Pastikan file `.env` sudah diisi dengan private key.
- **Gas Fee Error**: Pastikan saldo wallet cukup untuk membayar gas fee.
