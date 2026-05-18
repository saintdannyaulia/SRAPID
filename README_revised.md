# 🤖 StarLive Response Automation via Prompt Integrated Data

[![Java](https://img.shields.io/badge/Javascript-App-yellow?logo=javascript)](https://javascript.com)

> Sistem otomatis untuk menjawab pertanyaan *machine learning* dari Google Form menggunakan **Gemini AI**, lalu mengirimkan balasan ke email pengguna dalam waktu kurang dari 1 menit — seluruhnya dijalankan di atas **Google Apps Script**, tanpa server.
>
> *Merupakan pertanyaan pada tes METI Government of Japan for AI and Tech Internship tahun 2025*

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
  - [5. Uji Sistem](#5-uji-sistem)
  - [6. Bagikan Tautan Form](#6-bagikan-tautan-form)
- [Struktur Kode](#struktur-kode)
- [Konfigurasi](#konfigurasi)
- [Pemecahan Masalah](#pemecahan-masalah)
- [Batasan](#batasan)
- [Lisensi](#lisensi)

---

## Fitur

- **Respons otomatis** — setiap pengiriman form memicu jawaban AI secara langsung
- **Didukung Gemini 1.5 Flash** — model cepat dan tersedia secara gratis melalui Google AI Studio
- **Email berformat HTML** — balasan ditampilkan secara rapi dengan sorotan pertanyaan dan jawaban
- **Tanpa server** — berjalan 100% di Google Apps Script, tanpa kebutuhan hosting
- **Latensi kurang dari 1 menit** — trigger `onFormSubmit` berjalan secara real-time
- **Tanpa biaya** — memanfaatkan free tier Google AI Studio dan Gmail

---

## Cara Kerja

```
User submit form  →  Apps Script trigger  →  Gemini API  →  Gmail reply
 (email + question)     (onFormSubmit)      (generate AI answer)   (< 1 menit)
```

1. Pengguna mengisi Google Form dengan alamat email dan pertanyaan machine learning.
2. Trigger `onFormSubmit` di Apps Script aktif secara otomatis.
3. Script mengirimkan pertanyaan ke Gemini API dengan prompt terstruktur.
4. Gemini menghasilkan jawaban ringkas dalam bahasa Indonesia.
5. Script mengirimkan email balasan berformat HTML ke alamat yang telah diisi pengguna.

---

## Prasyarat

- Akun Google (untuk Google Form, Apps Script, dan Gmail)
- API key dari [Google AI Studio](https://aistudio.google.com/app/apikey) (gratis)
- Tidak diperlukan server, hosting, maupun dependensi eksternal

---

## Panduan Setup

### 1. Dapatkan Gemini API Key

1. Buka [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
2. Masuk menggunakan akun Google.
3. Klik **"Create API key"**, lalu pilih atau buat project Google Cloud.
4. Salin API key yang dihasilkan — akan digunakan pada langkah berikutnya.

> **Catatan:** Free tier Google AI Studio mencakup 1.500 request per hari untuk Gemini 1.5 Flash, yang sudah memadai untuk penggunaan personal.

---

### 2. Buat Google Form

1. Buka [forms.google.com](https://forms.google.com), lalu klik **"Blank form"**.
2. Isi judul form: `Form-[Nama]` (contoh: `Form-Budi`).
3. Tambahkan dua pertanyaan berikut:

| # | Judul Pertanyaan | Tipe |
|---|---|---|
| 1 | `Your email` | Short answer |
| 2 | `Question` | Paragraph |

> **Penting:** Nama field harus **persis sama** dengan yang tercantum di kode (`Your email` dan `Question`) agar `namedValues` dapat terbaca dengan benar.

4. Klik ikon **Mata** (Preview) untuk meninjau tampilan form.

---

### 3. Pasang Apps Script

Terdapat dua cara untuk menghubungkan script ke form:

**Cara A — Langsung dari Google Form (direkomendasikan):**
1. Di halaman form, klik ikon **⋮ (tiga titik)** di sudut kanan atas.
2. Pilih **"Script editor"**.
3. Project Apps Script akan terbuka dan terhubung secara otomatis ke form.

**Cara B — Dari Google Apps Script:**
1. Buka [script.google.com](https://script.google.com), lalu klik **"New project"**.
2. Saat membuat trigger, pilih form secara manual.

**Langkah selanjutnya:**
1. Hapus konten default di editor, lalu tempel seluruh kode dari file `Code.gs`.
2. Isi nilai variabel pada baris paling atas:

```javascript
const GEMINI_API_KEY = "PASTE_API_KEY_DI_SINI";
```

3. Simpan project (`Ctrl+S` / `Cmd+S`) dan beri nama, misalnya `ML Auto-Reply`.

---

### 4. Aktifkan Trigger Otomatis

1. Di Apps Script editor, klik ikon **⏰ (Triggers)** pada sidebar kiri.
2. Klik tombol **"+ Add Trigger"** di sudut kanan bawah.
3. Isi konfigurasi trigger sebagai berikut:

| Field | Nilai |
|---|---|
| Choose which function to run | `onFormSubmit` |
| Choose which deployment should run | `Head` |
| Select event source | `From form` |
| Select event type | `On form submit` |

4. Klik **Save**.
5. Popup izin OAuth akan muncul — klik **"Advanced"** → **"Go to [nama project]"** → **"Allow"**.

> Izin yang dibutuhkan: akses ke Google Forms (membaca respons) dan Gmail (mengirim email).

---

### 5. Uji Sistem

**Uji manual dari editor:**
1. Di Apps Script editor, pilih fungsi `testManual` dari dropdown.
2. Klik tombol **▶ Run**.
3. Buka **"View → Logs"** untuk melihat output.
4. Periksa inbox email `test@gmail.com` (atau email yang telah diubah di fungsi `testManual`).

**Uji dengan form sesungguhnya:**
1. Buka tautan form melalui **Preview** atau tombol **Send**.
2. Isi email aktif dan pertanyaan seputar machine learning.
3. Kirimkan form.
4. Tunggu maksimal 1 menit — email balasan akan masuk ke inbox.

---

### 6. Bagikan Tautan Form

1. Di Google Form, klik tombol **"Send"**.
2. Pilih tab **🔗 (Link)**.
3. Centang **"Shorten URL"** untuk mendapatkan URL yang lebih singkat.
4. Klik **"Copy"**.

Format tautan: `https://forms.gle/xxxxxxxxxx`

Tautan ini dapat dibuka oleh siapa saja tanpa perlu masuk ke akun Google.

---

## Struktur Kode

```
Code.gs
│
├── GEMINI_API_KEY          — konfigurasi API key
├── GEMINI_URL              — endpoint Gemini 1.5 Flash
│
├── onFormSubmit(e)         — trigger utama, entry point sistem
├── callGemini(question)    — mengirim prompt ke Gemini dan mengembalikan jawaban
├── sendReplyEmail(...)     — mengirim email HTML melalui GmailApp
├── escapeHtml(text)        — sanitasi teks untuk keamanan HTML
└── testManual()            — fungsi uji coba tanpa pengiriman form
```

### Prompt yang Digunakan

```
Jawab pertanyaan machine learning ini secara ringkas: [question]
```

---

## Konfigurasi

| Variabel | Lokasi | Keterangan |
|---|---|---|
| `GEMINI_API_KEY` | baris 3 | API key dari Google AI Studio |
| `maxOutputTokens` | `callGemini()` | Panjang maksimal jawaban (default: 300) |
| `temperature` | `callGemini()` | Tingkat kreativitas jawaban, rentang 0–1 (default: 0.7) |
| Nama pengirim email | `sendReplyEmail()` | Default: `"AI ML Assistant"` |

Untuk mengganti model Gemini, ubah bagian URL pada variabel `GEMINI_URL`:

```javascript
// Model yang tersedia (free tier):
// gemini-1.5-flash      ← cepat, hemat kuota (default)
// gemini-1.5-flash-8b   ← lebih ringan
// gemini-1.5-pro        ← lebih akurat, kuota lebih terbatas
```

---

## Pemecahan Masalah

| Masalah | Kemungkinan Penyebab | Solusi |
|---|---|---|
| Email tidak terkirim | Izin OAuth belum diberikan | Hapus dan buat ulang trigger, lalu ulangi proses otorisasi |
| `Gemini error 400` | API key salah atau kosong | Periksa nilai `GEMINI_API_KEY`, pastikan tidak ada spasi |
| `namedValues` kosong | Nama field form tidak sesuai | Pastikan field form bernama persis `Your email` dan `Question` |
| Trigger tidak aktif | Trigger terhapus atau mengalami error | Buka Triggers dan pastikan `onFormSubmit` terdaftar |
| Jawaban tidak muncul di email | Respons Gemini kosong | Periksa Logs untuk melihat pesan error dari API |
| Kuota Gmail terlampaui | Lebih dari 100 email per hari (akun gratis) | Gunakan akun Google Workspace atau tambahkan mekanisme throttling |

Untuk melihat log error secara lengkap:
1. Di Apps Script editor, klik **"Executions"** pada sidebar kiri.
2. Klik eksekusi yang gagal untuk melihat stack trace secara mendetail.

---

## Batasan

- **Gmail:** Maksimal 100 email per hari untuk akun Google biasa (500 per hari untuk Workspace)
- **Gemini free tier:** 1.500 request per hari, 15 request per menit untuk Gemini 1.5 Flash
- **Apps Script:** Batas waktu eksekusi maksimal 6 menit per sesi (memadai untuk kasus penggunaan ini)
- **Konteks percakapan:** Sistem tidak menyimpan riwayat percakapan — setiap pertanyaan diproses secara independen
