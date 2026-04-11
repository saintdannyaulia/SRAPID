// ============================================================
// AI Auto-Reply System — Google Form + Gemini + Gmail
// ============================================================

const GEMINI_API_KEY = "ISI_API_KEY_KAMU_DI_SINI";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// ─── Fungsi utama: dipanggil saat form disubmit ─────────────
function onFormSubmit(e) {
  try {
    const responses = e.namedValues;

    // Ambil email dan pertanyaan dari form
    const email    = (responses["Your email"]  || responses["Email"] || [""])[0].trim();
    const question = (responses["Question"]    || responses["Pertanyaan"] || [""])[0].trim();

    if (!email || !question) {
      Logger.log("Email atau pertanyaan kosong, skip.");
      return;
    }

    Logger.log(`Email: ${email}`);
    Logger.log(`Question: ${question}`);

    // Kirim ke Gemini untuk generate jawaban
    const answer = callGemini(question);

    // Kirim email balasan
    sendReplyEmail(email, question, answer);

    Logger.log("Berhasil kirim balasan ke: " + email);

  } catch (err) {
    Logger.log("ERROR: " + err.message);
  }
}

// ─── Panggil Gemini API ──────────────────────────────────────
function callGemini(question) {
  const prompt = `Jawab pertanyaan machine learning ini secara ringkas: ${question}`;

  const payload = {
    contents: [{
      parts: [{ text: prompt }]
    }],
    generationConfig: {
      maxOutputTokens: 300,
      temperature: 0.7
    }
  };

  const options = {
    method: "POST",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(GEMINI_URL, options);
  const json     = JSON.parse(response.getContentText());

  // Tangani error dari API
  if (json.error) {
    Logger.log("Gemini error: " + JSON.stringify(json.error));
    return "Maaf, saat ini jawaban tidak tersedia. Silakan coba lagi nanti.";
  }

  const answer = json.candidates?.[0]?.content?.parts?.[0]?.text || "Tidak ada jawaban.";
  return answer.trim();
}

// ─── Kirim email balasan ─────────────────────────────────────
function sendReplyEmail(email, question, answer) {
  // Potong pertanyaan untuk subjek (max 60 karakter)
  const shortQuestion = question.length > 60
    ? question.substring(0, 57) + "..."
    : question;

  const subject = `Reply for your question: ${shortQuestion}`;

  const body = `Halo!

Terima kasih telah mengajukan pertanyaan seputar Machine Learning.

─────────────────────────────
Pertanyaan Anda:
${question}

Jawaban:
${answer}
─────────────────────────────

Semoga membantu! Jangan ragu untuk mengajukan pertanyaan lagi.

Salam,
AI ML Assistant
`;

  const htmlBody = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #f9f9f9; border-radius: 8px;">
  <h2 style="color: #4A90D9; border-bottom: 2px solid #4A90D9; padding-bottom: 8px;">
    🤖 Jawaban ML Assistant
  </h2>
  <p style="color: #555;">Halo! Terima kasih telah mengajukan pertanyaan.</p>

  <div style="background: #EEF4FF; border-left: 4px solid #4A90D9; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
    <strong style="color: #333;">Pertanyaan Anda:</strong>
    <p style="margin: 6px 0 0; color: #444;">${escapeHtml(question)}</p>
  </div>

  <div style="background: #F0FFF4; border-left: 4px solid #27AE60; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
    <strong style="color: #333;">Jawaban:</strong>
    <p style="margin: 6px 0 0; color: #444; line-height: 1.6;">${escapeHtml(answer).replace(/\n/g, '<br>')}</p>
  </div>

  <p style="color: #888; font-size: 12px; margin-top: 24px;">
    Pesan ini dikirim otomatis oleh AI ML Assistant.<br>
    Jangan balas email ini.
  </p>
</div>`;

  GmailApp.sendEmail(email, subject, body, {
    htmlBody: htmlBody,
    name: "AI ML Assistant"
  });
}

// ─── Helper: escape HTML untuk keamanan ─────────────────────
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ─── Test manual (jalankan dari editor) ─────────────────────
function testManual() {
  const fakeEvent = {
    namedValues: {
      "Your email": ["test@gmail.com"],
      "Question":   ["Apa itu overfitting dalam machine learning?"]
    }
  };
  onFormSubmit(fakeEvent);
}
