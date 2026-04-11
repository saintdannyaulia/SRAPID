# 🤖 AI Auto-Reply System — Google Form + Gemini + Gmail

Sistem otomatis yang menjawab pertanyaan *machine learning* dari Google Form menggunakan **Gemini AI**, lalu mengirimkan balasan ke email pengguna dalam waktu kurang dari 1 menit — seluruhnya dijalankan di atas **Google Apps Script**, tanpa server.

---

## Daftar Isi

- [Fitur](#fitur)
- [Cara Kerja](#cara-kerja)
- [Prasyarat](#prasyarat)
- [Panduan Setup](#panduan-setup)
  - [1. Dapatkan Gemini API Key](#1-dapatkan-gemini-api-key)
  - [2. Buat Google Form](#2-buat-google-form)
  - [3. Pasang Apps Script](#3-pasang-apps-script)
  - [4. Aktifkan Trigger Otomatis](#4-aktifkan-trigger-otomatis)
  - [5. Test Sistem](#5-test-sistem)
  - [6. Share Link Form](#6-share-link-form)
- [Struktur Kode](#struktur-kode)
- [Konfigurasi](#konfigurasi)
- [Troubleshooting](#troubleshooting)
- [Batasan](#batasan)
- [Lisensi](#lisensi)

---

## Fitur

- **Respon otomatis** — setiap submit form langsung memicu jawaban AI
- **Powered by Gemini 1.5 Flash** — model cepat dan gratis dari Google AI Studio
- **Email HTML** — balasan berformat rapi dengan highlight pertanyaan dan jawaban
- **Zero server** — berjalan 100% di Google Apps Script, tanpa hosting
- **Delay < 1 menit** — trigger `onFormSubmit` berjalan secara real-time
- **Gratis** — memanfaatkan free tier Google AI Studio dan Gmail

---

## Cara Kerja

```
User submit form  →  Apps Script trigger  →  Gemini API  →  Gmail reply
 (email + question)     (onFormSubmit)      (generate AI answer)   (< 1 menit)
```

1. User mengisi Google Form dengan email dan pertanyaan machine learning
2. Trigger `onFormSubmit` di Apps Script aktif secara otomatis
3. Script mengirim pertanyaan ke Gemini API dengan prompt terstruktur
4. Gemini menghasilkan jawaban ringkas dalam bahasa Indonesia
5. Script mengirim email balasan HTML ke alamat yang diisi user

---

## Prasyarat

- Akun Google (untuk Google Form, Apps Script, Gmail)
- API key dari [Google AI Studio](https://aistudio.google.com/app/apikey) (gratis)
- Tidak perlu server, hosting, atau dependensi eksternal

---

## Panduan Setup

### 1. Dapatkan Gemini API Key

1. Buka [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Login dengan akun Google
3. Klik **"Create API key"** → pilih atau buat project Google Cloud
4. Salin API key yang dihasilkan — akan dipakai di langkah berikutnya

> **Catatan:** Free tier Google AI Studio mencakup 1.500 request/hari untuk Gemini 1.5 Flash, lebih dari cukup untuk penggunaan personal.

---

### 2. Buat Google Form

1. Buka [forms.google.com](https://forms.google.com) → klik **"Blank form"**
2. Isi judul form: `Form-[Nama Anda]` (contoh: `Form-Budi`)
3. Tambahkan dua pertanyaan berikut:

| # | Judul Pertanyaan | Tipe |
|---|---|---|
| 1 | `Your email` | Short answer |
| 2 | `Question` | Paragraph |

> **Penting:** Nama field harus **persis sama** dengan yang ada di kode (`Your email` dan `Question`) agar `namedValues` terbaca dengan benar.

4. Klik ikon **Mata** (Preview) untuk melihat tampilan form

---

### 3. Pasang Apps Script

Ada dua cara menghubungkan script ke form:

**Cara A — Langsung dari Google Form (direkomendasikan):**
1. Di halaman form, klik ikon **⋮ (tiga titik)** pojok kanan atas
2. Pilih **"Script editor"**
3. Project Apps Script akan terbuka dan otomatis terhubung ke form

**Cara B — Dari Google Apps Script:**
1. Buka [script.google.com](https://script.google.com) → **"New project"**
2. Nanti saat membuat trigger, pilih form secara manual

**Langkah selanjutnya:**
1. Hapus isi default di editor, paste seluruh kode dari file `Code.gs`
2. Isi nilai variabel di baris paling atas:

```javascript
const GEMINI_API_KEY = "PASTE_API_KEY_KAMU_DI_SINI";
```

3. Simpan project (`Ctrl+S` / `Cmd+S`) dan beri nama, misalnya `ML Auto-Reply`

---

### 4. Aktifkan Trigger Otomatis

1. Di Apps Script editor, klik ikon **⏰ (Triggers)** di sidebar kiri
2. Klik tombol **"+ Add Trigger"** di pojok kanan bawah
3. Isi konfigurasi trigger:

| Field | Nilai |
|---|---|
| Choose which function to run | `onFormSubmit` |
| Choose which deployment should run | `Head` |
| Select event source | `From form` |
| Select event type | `On form submit` |

4. Klik **Save**
5. Akan muncul popup izin OAuth — klik **"Advanced"** → **"Go to [nama project]"** → **"Allow"**

> Izin yang dibutuhkan: akses ke Google Forms (baca respons) dan Gmail (kirim email).

---

### 5. Test Sistem

**Test manual dari editor:**
1. Di Apps Script editor, pilih fungsi `testManual` dari dropdown
2. Klik tombol **▶ Run**
3. Buka **"View → Logs"** untuk melihat output
4. Cek inbox email `test@gmail.com` (atau email yang kamu ubah di fungsi `testManual`)

**Test dengan form sungguhan:**
1. Buka link form (klik **Preview** atau tombol **Send**)
2. Isi email aktif dan pertanyaan tentang machine learning
3. Submit form
4. Tunggu maksimal 1 menit — email balasan akan masuk

---

### 6. Share Link Form

Untuk mendapatkan link publik yang bisa dibagikan:

1. Di Google Form, klik tombol **"Send"**
2. Pilih tab **🔗 (Link)**
3. Centang **"Shorten URL"** untuk URL pendek
4. Klik **"Copy"**

Format link: `https://forms.gle/xxxxxxxxxx`

Link ini bisa langsung dibuka siapa saja tanpa perlu login Google.

---

## Struktur Kode

```
Code.gs
│
├── GEMINI_API_KEY          — konfigurasi API key
├── GEMINI_URL              — endpoint Gemini 1.5 Flash
│
├── onFormSubmit(e)         — trigger utama, entry point sistem
├── callGemini(question)    — kirim prompt ke Gemini, return jawaban
├── sendReplyEmail(...)     — kirim email HTML via GmailApp
├── escapeHtml(text)        — sanitasi teks untuk HTML
└── testManual()            — fungsi uji coba tanpa submit form
```

### Prompt yang digunakan

```
Jawab pertanyaan machine learning ini secara ringkas: [question]
```

---

## Konfigurasi

| Variabel | Lokasi | Keterangan |
|---|---|---|
| `GEMINI_API_KEY` | baris 3 | API key dari Google AI Studio |
| `maxOutputTokens` | `callGemini()` | Panjang maksimal jawaban (default: 300) |
| `temperature` | `callGemini()` | Kreativitas jawaban 0–1 (default: 0.7) |
| Nama pengirim email | `sendReplyEmail()` | Default: `"AI ML Assistant"` |

Untuk mengubah model Gemini, ganti bagian URL di variabel `GEMINI_URL`:

```javascript
// Model yang tersedia (free tier):
// gemini-1.5-flash      ← cepat, hemat kuota (default)
// gemini-1.5-flash-8b   ← lebih ringan
// gemini-1.5-pro        ← lebih pintar, kuota lebih kecil
```

---

## Troubleshooting

| Masalah | Kemungkinan Penyebab | Solusi |
|---|---|---|
| Email tidak terkirim | Izin OAuth belum diberikan | Hapus dan buat ulang trigger, ulangi proses authorize |
| `Gemini error 400` | API key salah atau kosong | Periksa nilai `GEMINI_API_KEY`, pastikan tidak ada spasi |
| `namedValues` kosong | Nama field form tidak cocok | Pastikan field form bernama persis `Your email` dan `Question` |
| Trigger tidak aktif | Trigger terhapus atau error | Buka Triggers → pastikan `onFormSubmit` terdaftar |
| Jawaban tidak muncul di email | Respons Gemini kosong | Cek Logs untuk melihat pesan error dari API |
| Melebihi kuota Gmail | > 100 email/hari (akun gratis) | Gunakan akun Google Workspace, atau tambahkan throttling |

Untuk melihat log error secara detail:
1. Di Apps Script editor, klik **"Executions"** di sidebar kiri
2. Klik eksekusi yang gagal untuk melihat stack trace lengkap

---

## Batasan

- **Gmail:** Maksimal 100 email/hari untuk akun Google biasa (500/hari untuk Workspace)
- **Gemini free tier:** 1.500 request/hari, 15 request/menit untuk Gemini 1.5 Flash
- **Apps Script:** Runtime maksimal 6 menit per eksekusi (lebih dari cukup untuk use case ini)
- **Konteks:** Sistem tidak menyimpan riwayat percakapan — setiap pertanyaan diproses secara independen

---

## Lisensi

MIT License — bebas digunakan, dimodifikasi, dan didistribusikan.
