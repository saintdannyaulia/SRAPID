# 🤖 StarLive Response Automation via Prompt Integrated Data

[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)](https://javascript.com)
[![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?logo=google&logoColor=white)](https://script.google.com)
[![Google Gemini](https://img.shields.io/badge/Gemini%201.5%20Flash-886FBF?logo=googlegemini&logoColor=white)](https://aistudio.google.com)
[![Gmail](https://img.shields.io/badge/Gmail-D14836?logo=gmail&logoColor=white)](https://mail.google.com)
[![Google Forms](https://img.shields.io/badge/Google%20Forms-7248B9?logo=googleforms&logoColor=white)](https://forms.google.com)
[![License](https://img.shields.io/badge/License-MIT-22c55e?logo=opensourceinitiative&logoColor=white)](LICENSE)

---

## Directory

- [Overview](#overview)
- [Features & Tech Stack](#features--tech-stack)
- [System Workflow](#system-workflow)
- [User Guide](#user-guide)
  - [Equipment](#equipment)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Troubleshooting](#troubleshooting)
- [Development Notes](#development-notes)
  - [Limitations](#limitations)
  - [Future Development](#future-development)
- [Author](#author)

---

## Overview

Proyek ini dikembangkan sebagai solusi untuk tes seleksi **METI Government of Japan AI and Tech Internship 2025**. Sistem dirancang untuk merespons pertanyaan seputar *machine learning* secara otomatis tanpa memerlukan infrastruktur server maupun biaya hosting — seluruhnya berjalan di atas ekosistem Google menggunakan **Gemini AI** dan **Google Apps Script**.

Setiap kali pengguna mengisi Google Form, sistem langsung memproses pertanyaan dan mengirimkan jawaban berformat HTML ke alamat email yang telah diisi, dalam waktu kurang dari 1 menit.

> **📝 Notes**
> <!-- Tambahkan catatan tambahan, konteks proyek, atau informasi relevan lainnya di sini -->
> <!-- Contoh: versi, kondisi khusus, atau hal yang perlu diketahui pembaca sebelum lanjut -->

---

## Features & Tech Stack

### Features

- **Respons otomatis real-time** — trigger `onFormSubmit` aktif setiap kali form dikirimkan
- **Email berformat HTML** — balasan ditampilkan rapi dengan sorotan pertanyaan dan jawaban
- **Tanpa server & tanpa biaya** — berjalan 100% di Google Apps Script dengan free tier
- **Latensi < 1 menit** — dari pengiriman form hingga email masuk inbox

### Tech Stack

| Komponen | Teknologi |
|---|---|
| Runtime | Google Apps Script (JavaScript) |
| AI Model | Gemini 1.5 Flash via Google AI Studio API |
| Input | Google Forms |
| Output | Gmail (GmailApp) |
| Hosting | Serverless (Google Cloud internally) |

---

## System Workflow

### Flowchart

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  User mengisi   │     │  Trigger aktif   │     │  Kirim prompt   │
│  Google Form    │────▶│  onFormSubmit    │────▶│  ke Gemini API  │
│ (email + soal)  │     │  (Apps Script)   │     │  (callGemini)   │
└─────────────────┘     └──────────────────┘     └────────┬────────┘
                                                           │
                                                           ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Email masuk    │     │  Kirim email     │     │  Gemini         │
│  inbox user     │◀────│  HTML balasan    │◀────│  menghasilkan   │
│  < 1 menit ✅   │     │  via GmailApp    │     │  jawaban AI     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### Penjelasan

| Langkah | Proses | Keterangan |
|---|---|---|
| 1 | User submit form | Mengisi `email` dan `pertanyaan` di Google Form |
| 2 | Trigger `onFormSubmit` | Apps Script menangkap event pengiriman form secara otomatis |
| 3 | `callGemini(question)` | Pertanyaan dikirim ke endpoint Gemini 1.5 Flash dengan prompt terstruktur |
| 4 | Generate jawaban | Gemini menghasilkan jawaban ringkas dalam Bahasa Indonesia |
| 5 | `sendReplyEmail()` | Jawaban dikemas dalam template HTML dan dikirim via GmailApp |

---

## User Guide

### Equipment

Pastikan hal berikut tersedia sebelum memulai:

- Akun Google aktif (untuk Google Form, Apps Script, dan Gmail)
- API key dari [Google AI Studio](https://aistudio.google.com/app/apikey) — gratis, tidak perlu kartu kredit
- Tidak diperlukan server, hosting, maupun dependensi eksternal

---

### Installation

#### 1. Dapatkan Gemini API Key

1. Buka [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Masuk dengan akun Google, lalu klik **"Create API key"**
3. Pilih atau buat project Google Cloud
4. Salin API key — akan digunakan pada langkah berikutnya

> Free tier mencakup **1.500 request/hari** untuk Gemini 1.5 Flash.

---

#### 2. Buat Google Form

1. Buka [forms.google.com](https://forms.google.com) → **"Blank form"**
2. Isi judul: `Form-[Nama]` (contoh: `Form-Budi`)
3. Tambahkan dua pertanyaan berikut:

| # | Judul Pertanyaan | Tipe |
|---|---|---|
| 1 | `Your email` | Short answer |
| 2 | `Question` | Paragraph |

> **Penting:** Nama field harus **persis sama** agar `namedValues` dapat terbaca dengan benar oleh script.

---

#### 3. Pasang Apps Script

**Cara yang direkomendasikan — langsung dari Google Form:**

1. Di halaman form, klik **⋮ (tiga titik)** → **"Script editor"**
2. Project Apps Script akan terbuka dan terhubung otomatis ke form
3. Hapus konten default, tempel seluruh kode dari file `Code.gs`
4. Isi API key pada baris paling atas:

```javascript
const GEMINI_API_KEY = "PASTE_API_KEY_DI_SINI";
```

5. Simpan project (`Ctrl+S` / `Cmd+S`), beri nama misalnya `ML Auto-Reply`

---

#### 4. Aktifkan Trigger Otomatis

1. Di Apps Script editor, klik ikon **⏰ (Triggers)** pada sidebar kiri
2. Klik **"+ Add Trigger"** di sudut kanan bawah
3. Isi konfigurasi berikut:

| Field | Nilai |
|---|---|
| Function to run | `onFormSubmit` |
| Deployment | `Head` |
| Event source | `From form` |
| Event type | `On form submit` |

4. Klik **Save** → ikuti popup izin OAuth → klik **"Allow"**

---

#### 5. Uji Sistem

**Uji manual dari editor:**
1. Pilih fungsi `testManual` dari dropdown, lalu klik **▶ Run**
2. Buka **"View → Logs"** untuk melihat output
3. Periksa inbox email yang digunakan di fungsi `testManual`

**Uji dengan form sesungguhnya:**
1. Buka form melalui **Preview** atau tombol **Send**
2. Isi email aktif dan pertanyaan machine learning
3. Tunggu maksimal 1 menit — email balasan akan masuk inbox

---

#### 6. Bagikan Tautan Form

1. Klik tombol **"Send"** → tab **🔗 (Link)**
2. Centang **"Shorten URL"** → klik **"Copy"**

Format tautan: `https://forms.gle/xxxxxxxxxx`

---

### Configuration

| Variabel | Lokasi | Default | Keterangan |
|---|---|---|---|
| `GEMINI_API_KEY` | Baris 3 `Code.gs` | *(wajib diisi)* | API key dari Google AI Studio |
| `maxOutputTokens` | `callGemini()` | `300` | Panjang maksimal jawaban |
| `temperature` | `callGemini()` | `0.7` | Kreativitas jawaban (rentang 0–1) |
| Nama pengirim | `sendReplyEmail()` | `"AI ML Assistant"` | Nama yang muncul di email balasan |

**Mengganti model Gemini:**

```javascript
// Model tersedia (free tier):
// gemini-1.5-flash      ← cepat, hemat kuota (default)
// gemini-1.5-flash-8b   ← lebih ringan
// gemini-1.5-pro        ← lebih akurat, kuota lebih terbatas
```

---

### Troubleshooting

| Masalah | Kemungkinan Penyebab | Solusi |
|---|---|---|
| Email tidak terkirim | Izin OAuth belum diberikan | Hapus dan buat ulang trigger, ulangi otorisasi |
| `Gemini error 400` | API key salah atau kosong | Periksa nilai `GEMINI_API_KEY`, pastikan tidak ada spasi |
| `namedValues` kosong | Nama field form tidak sesuai | Pastikan field bernama persis `Your email` dan `Question` |
| Trigger tidak aktif | Trigger terhapus atau error | Buka Triggers, pastikan `onFormSubmit` terdaftar |
| Jawaban tidak muncul | Respons Gemini kosong | Buka **Executions** di sidebar untuk melihat stack trace |

---

## Development Notes

### Limitations

| Komponen | Batasan |
|---|---|
| Gmail (akun gratis) | Maks. 100 email/hari (500/hari untuk Workspace) |
| Gemini free tier | 1.500 request/hari, 15 request/menit |
| Apps Script | Batas eksekusi 6 menit per sesi |
| Konteks percakapan | Tidak ada — setiap pertanyaan diproses independen |

### Future Development

Beberapa pengembangan yang dapat dilakukan ke depan:

- [ ] **Multi-language support** — deteksi bahasa pertanyaan dan jawab sesuai bahasa pengguna
- [ ] **Conversation history** — menyimpan riwayat tanya jawab per pengguna di Google Sheets
- [ ] **Topic filtering** — validasi agar hanya pertanyaan ML yang diproses
- [ ] **Dashboard monitoring** — laporan harian via Google Sheets tentang jumlah pertanyaan dan status pengiriman
- [ ] **Rate limiting** — mekanisme throttling agar tidak melampaui kuota Gmail

---

<p align="center">
  <b>Pengembangan dari tim StarLive SAINT</b>
</p>

<p align="center">Danny Aulia · Said Hasan Hanafiah · Noah Von Nobelius · Arvian Raveindra Pradana</p>

<p align="center"><i>METI Government of Japan — AI and Tech Internship 2025</i></p>
