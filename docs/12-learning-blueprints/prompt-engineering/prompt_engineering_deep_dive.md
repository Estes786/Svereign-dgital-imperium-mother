# 🧪 Deep Dive Analysis: Anthropic Prompt Engineering Techniques

**Sumber**: Anthropic Official Documentation & Best Practices | **Analisis Oleh**: Manus AI

---

## 1. Prinsip Utama: Kejelasan & Ketegasan (Clear & Direct)
Claude bekerja paling baik ketika diberikan instruksi yang eksplisit dan spesifik.
- **Golden Rule**: Jika rekan kerja Anda bingung membaca prompt tersebut, Claude pun akan bingung.
- **Strategi**: Gunakan langkah-langkah berurutan (numbered lists) untuk tugas yang kompleks. Jelaskan format output dan batasan (constraints) secara detail.

---

## 2. Struktur Data: Kekuatan XML Tags
XML tags adalah standar emas Anthropic untuk membantu Claude membedakan antara instruksi, konteks, contoh, dan input.
- **Manfaat**: Mengurangi misinterpretasi saat prompt mencampur berbagai jenis konten.
- **Contoh Struktur**:
  ```xml
  <instructions>
  Lakukan analisis pada dokumen berikut.
  </instructions>
  <document>
  [Konten Dokumen]
  </document>
  <examples>
  [Contoh Output]
  </examples>
  ```
- **Nesting**: Gunakan tag bersarang untuk data yang hierarkis (misal: `<documents>` berisi beberapa `<document>`).

---

## 3. Optimasi Konteks: Long Context Prompting
Untuk input besar (20K+ tokens), urutan sangat menentukan performa.
- **Data di Atas**: Letakkan dokumen panjang di bagian atas prompt.
- **Instruksi di Bawah**: Letakkan query dan instruksi di bagian akhir untuk meningkatkan akurasi hingga 30%.
- **Quote Extraction**: Minta Claude untuk mengutip bagian relevan sebelum melakukan tugas utama untuk menjaga fokus.

---

## 4. Steering Output: Few-Shot & Role Prompting
- **Few-Shot (Examples)**: Memberikan 3-5 contoh adalah cara paling andal untuk mengatur tone, format, dan struktur. Pastikan contoh relevan dan beragam.
- **Role Prompting**: Menetapkan peran (misal: "You are a senior Python developer") dalam system prompt sangat efektif untuk memfokuskan perilaku dan gaya komunikasi.

---

## 5. Kontrol Format & Gaya Komunikasi
- **Positive Instructions**: Beritahu Claude apa yang *harus* dilakukan, bukan apa yang *jangan* dilakukan.
- **Prose vs Bullets**: Untuk konten teknis atau laporan, gunakan prose yang mengalir daripada bullet points yang berlebihan untuk meningkatkan keterbacaan.
- **XML Format Indicators**: Gunakan tag XML dalam instruksi format (misal: "Tulis dalam tag <analisis>").
