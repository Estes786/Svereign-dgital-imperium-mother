# Master Tool Use Blueprint: Membangun Aplikasi dengan Claude API

**Oleh: Manus AI**

## Pendahuluan

Dokumen ini adalah "Master Tool Use Blueprint" yang dirancang khusus untuk Anda, GYS, agar dapat menguasai modul "Tool Use with Claude" dari kursus "Building with the Claude API" Anthropic Skilljar. Blueprint ini akan membedah setiap aspek penggunaan tool, mulai dari konsep dasar hingga implementasi lanjutan, serta memberikan wawasan untuk menghadapi kuis asesmen. Tujuannya adalah memastikan Anda memiliki pemahaman yang sangat mendalam dan siap untuk membangun aplikasi AI yang canggih dengan Claude.

## Struktur Modul "Tool Use with Claude"

Modul "Tool Use with Claude" mencakup berbagai topik penting yang memungkinkan Claude berinteraksi dengan dunia luar. Berikut adalah sub-topik yang akan kita bahas secara detail:

1.  **Introducing Tool Use**
2.  **Project Overview**
3.  **Tool Functions**
4.  **Tool Schemas**
5.  **Handling Message Blocks**
6.  **Sending Tool Results**
7.  **Multi-turn Conversations with Tools**
8.  **Implementing Multiple Turns**
9.  **Using Multiple Tools**
10. **The Batch Tool**
11. **Tools for Structured Data**
12. **Fine-grained Tool Calling**
13. **The Text Edit Tool**
14. **The Web Search Tool**
15. **Quiz on Tool Use with Claude**

## 1. Introducing Tool Use

**Tool Use** adalah kemampuan revolusioner yang memungkinkan model bahasa besar (LLM) seperti Claude untuk berinteraksi dengan lingkungan eksternal. Alih-alih hanya menghasilkan teks, Claude dapat "memanggil" fungsi atau "tool" yang Anda definisikan untuk melakukan tindakan spesifik. Ini membuka pintu bagi Claude untuk melakukan tugas-tugas yang sebelumnya tidak mungkin, seperti mencari informasi real-time di internet, mengakses database, mengirim email, atau bahkan mengontrol perangkat lunak lain [1].

**Mengapa Tool Use Penting?**

*   **Memperluas Kemampuan LLM**: Claude tidak lagi terbatas pada data pelatihan statisnya. Dengan tool, ia dapat mengakses informasi terkini dan melakukan tindakan di dunia nyata.
*   **Mengurangi Halusinasi**: Dengan menggunakan tool untuk mengambil fakta, Claude dapat memberikan respons yang lebih akurat dan berbasis bukti.
*   **Membangun Aplikasi yang Lebih Kuat**: Aplikasi AI dapat menjadi lebih interaktif dan fungsional, mampu menyelesaikan tugas-tugas kompleks secara end-to-end.

## 2. Project Overview

Dalam konteks kursus ini, "Project Overview" mengacu pada pemahaman bagaimana Tool Use diintegrasikan ke dalam arsitektur aplikasi yang lebih besar. Biasanya, ini melibatkan Claude sebagai "otak" yang memutuskan kapan dan tool apa yang akan digunakan, sementara kode aplikasi Anda bertindak sebagai "tangan" yang mengeksekusi tool tersebut dan mengembalikan hasilnya kepada Claude [2].

**Alur Kerja Umum:**

1.  **Pengguna memberikan instruksi** kepada Claude (misalnya, "Cari tahu harga saham Google saat ini").
2.  **Claude menganalisis instruksi** dan memutuskan bahwa ia perlu menggunakan tool (misalnya, `get_stock_price`).
3.  **Claude merespons dengan permintaan `tool_use`** yang berisi nama tool dan argumen yang diperlukan.
4.  **Aplikasi Anda menerima permintaan `tool_use`**, mengeksekusi fungsi `get_stock_price` dengan argumen yang diberikan.
5.  **Hasil eksekusi tool** (misalnya, harga saham) dikirim kembali ke Claude sebagai `tool_result`.
6.  **Claude memproses `tool_result`** dan memberikan jawaban akhir kepada pengguna ("Harga saham Google saat ini adalah $X").

## 3. Tool Functions

**Tool Functions** adalah fungsi-fungsi di kode aplikasi Anda yang dapat dipanggil oleh Claude. Fungsi-fungsi ini melakukan tugas-tugas spesifik, seperti mengambil data dari API eksternal, melakukan perhitungan, atau memanipulasi data. Penting untuk diingat bahwa Claude tidak secara langsung mengeksekusi kode fungsi ini; ia hanya meminta untuk menggunakannya [3].

**Karakteristik Tool Functions:**

*   **Spesifik**: Setiap fungsi harus memiliki tujuan yang jelas dan spesifik.
*   **Terisolasi**: Fungsi harus dapat berjalan secara independen dan mengembalikan hasil yang dapat dipahami oleh Claude.
*   **Aman**: Karena Claude dapat meminta eksekusi tool, penting untuk memastikan bahwa tool functions Anda aman dan tidak memiliki efek samping yang tidak diinginkan.

## 4. Tool Schemas

**Tool Schemas** adalah deskripsi formal dari Tool Functions Anda dalam format JSON Schema. Skema ini memberi tahu Claude tentang tool apa yang tersedia, apa yang mereka lakukan, dan parameter apa yang mereka butuhkan. Claude menggunakan skema ini untuk memahami kemampuan tool dan memutuskan kapan harus memanggilnya [3].

**Komponen Kunci Tool Schema:**

*   `name` (string, wajib): Nama unik dari tool (misalnya, `get_current_weather`).
*   `description` (string, wajib): Deskripsi singkat dan jelas tentang apa yang dilakukan tool. **Ini sangat penting**, karena Claude sangat bergantung pada deskripsi ini untuk memahami kapan harus menggunakan tool.
*   `input_schema` (object, wajib): Objek JSON Schema yang mendefinisikan parameter input yang diterima oleh tool. Ini mencakup tipe data, deskripsi, dan apakah parameter tersebut wajib atau opsional.

**Contoh Sederhana Tool Schema:**

```json
{
  "name": "get_current_weather",
  "description": "Mendapatkan kondisi cuaca saat ini untuk lokasi tertentu",
  "input_schema": {
    "type": "object",
    "properties": {
      "location": {
        "type": "string",
        "description": "Nama kota atau lokasi"
      },
      "unit": {
        "type": "string",
        "enum": ["celsius", "fahrenheit"],
        "description": "Unit suhu, default ke celsius"
      }
    },
    "required": ["location"]
  }
}
```

## 5. Handling Message Blocks

Ketika Claude memutuskan untuk menggunakan tool, responsnya tidak akan berupa teks biasa, melainkan akan berisi "message blocks" khusus. Ini adalah struktur data yang memberi tahu aplikasi Anda bahwa Claude ingin melakukan tindakan tertentu [2].

**Jenis Message Block Terkait Tool Use:**

*   `tool_use`: Blok ini menunjukkan bahwa Claude ingin memanggil tool. Ini akan berisi `id` untuk referensi, `name` dari tool yang akan dipanggil, dan `input` berupa objek JSON yang berisi argumen untuk tool tersebut.

**Contoh Respons Claude dengan `tool_use`:**

```json
{
  "role": "assistant",
  "content": [
    {
      "type": "tool_use",
      "id": "toolu_01A09C09C09C09C09C09C09C",
      "name": "get_current_weather",
      "input": {
        "location": "Jakarta",
        "unit": "celsius"
      }
    }
  ]
}
```

## 6. Sending Tool Results

Setelah aplikasi Anda mengeksekusi tool function yang diminta oleh Claude, hasilnya harus dikirim kembali ke Claude agar model dapat melanjutkan percakapan dan memberikan respons akhir kepada pengguna. Ini dilakukan dengan mengirimkan "message block" bertipe `tool_result` [2].

**Struktur `tool_result`:**

*   `type`: Selalu `tool_result`.
*   `tool_use_id`: ID dari blok `tool_use` yang sesuai yang sebelumnya dikirim oleh Claude. Ini penting untuk mengaitkan hasil dengan permintaan tool yang benar.
*   `content`: Hasil dari eksekusi tool. Ini bisa berupa string, objek JSON, atau tipe data lain yang relevan.

**Contoh Mengirim `tool_result`:**

```json
{
  "role": "user",
  "content": [
    {
      "type": "tool_result",
      "tool_use_id": "toolu_01A09C09C09C09C09C09C09C",
      "content": {
        "temperature": 28,
        "conditions": "Cerah"
      }
    }
  ]
}
```

## 7. Multi-turn Conversations with Tools

Tool Use menjadi sangat kuat dalam percakapan multi-turn (berulang). Claude dapat menggunakan tool, menerima hasilnya, dan kemudian menggunakan informasi tersebut untuk merespons atau memanggil tool lain dalam percakapan yang sama. Kunci di sini adalah mempertahankan riwayat percakapan [2].

**Prinsip Utama:**

*   **Pertahankan Konteks**: Setiap kali Anda mengirim pesan ke Claude, Anda harus menyertakan seluruh riwayat percakapan sebelumnya, termasuk pesan pengguna, respons Claude (baik teks maupun `tool_use`), dan `tool_result`.
*   **Claude sebagai Orkestrator**: Claude bertindak sebagai orkestrator, memutuskan langkah selanjutnya dalam percakapan berdasarkan riwayat dan tujuan pengguna.

## 8. Implementing Multiple Turns

Implementasi percakapan multi-turn dengan tool melibatkan loop yang terus-menerus mengirim pesan ke Claude dan memproses responsnya hingga Claude memberikan respons akhir yang tidak memerlukan tool lagi. Ini biasanya dilakukan di sisi server aplikasi Anda [2].

**Langkah-langkah Implementasi:**

1.  Inisialisasi riwayat pesan dengan prompt pengguna.
2.  Kirim riwayat pesan ke Claude.
3.  Periksa respons Claude:
    *   Jika berisi `tool_use`: Eksekusi tool, tambahkan `tool_use` dan `tool_result` ke riwayat, lalu ulangi langkah 2.
    *   Jika berisi teks biasa: Ini adalah respons akhir, tampilkan kepada pengguna dan akhiri loop.

## 9. Using Multiple Tools

Claude memiliki kemampuan untuk menggunakan beberapa tool dalam satu respons atau secara berurutan dalam percakapan multi-turn. Ini memungkinkan Claude untuk menyelesaikan tugas yang lebih kompleks yang memerlukan beberapa langkah atau sumber informasi [2].

**Skenario Penggunaan:**

*   **Panggilan Tool Paralel**: Claude dapat meminta untuk menggunakan beberapa tool sekaligus jika tugas pengguna memerlukan informasi dari beberapa sumber yang independen.
*   **Panggilan Tool Berurutan**: Claude dapat memanggil satu tool, memproses hasilnya, dan kemudian memanggil tool lain berdasarkan hasil tersebut.

## 10. The Batch Tool

Konsep "Batch Tool" dalam konteks Claude API mengacu pada kemampuan untuk memproses beberapa permintaan atau interaksi tool secara asinkron atau dalam satu "batch" untuk efisiensi. Meskipun tidak ada tool spesifik bernama "Batch Tool" yang didefinisikan secara eksplisit sebagai tool yang dapat dipanggil oleh Claude, konsep *batch processing* sangat relevan untuk mengoptimalkan penggunaan API [4].

**Manfaat Batch Processing:**

*   **Efisiensi Biaya**: Mengurangi jumlah panggilan API individual dapat menghemat biaya.
*   **Peningkatan Throughput**: Memproses banyak permintaan sekaligus dapat mempercepat alur kerja.
*   **Asinkronisitas**: Ideal untuk tugas-tugas yang tidak memerlukan respons instan, memungkinkan aplikasi Anda untuk melakukan pekerjaan lain sementara Claude memproses batch.

## 11. Tools for Structured Data

Claude sangat mahir dalam menghasilkan dan memahami data terstruktur, terutama dalam format JSON. Anda dapat mendefinisikan tool yang secara eksplisit mengharapkan atau menghasilkan data terstruktur, memungkinkan Claude untuk berinteraksi dengan database, API, atau sistem lain yang menggunakan format data yang ketat [3].

**Teknik Kunci:**

*   **JSON Schema yang Ketat**: Pastikan `input_schema` dari tool Anda sangat spesifik dalam mendefinisikan struktur JSON yang diharapkan. Ini akan memandu Claude untuk menghasilkan output yang sesuai.
*   **Forcing JSON Output**: Dengan mendefinisikan tool yang inputnya adalah objek JSON, Anda dapat secara efektif "memaksa" Claude untuk menghasilkan JSON yang valid ketika ia memutuskan untuk memanggil tool tersebut.

## 12. Fine-grained Tool Calling

**Fine-grained Tool Calling** memberikan Anda kontrol yang lebih besar atas bagaimana dan kapan Claude menggunakan tool. Ini dilakukan melalui parameter `tool_choice` dalam permintaan API, yang memungkinkan Anda untuk menentukan strategi pemilihan tool [2].

**Opsi `tool_choice`:**

*   `auto` (default): Claude secara otomatis memutuskan apakah akan menggunakan tool atau tidak, dan tool mana yang akan digunakan, berdasarkan prompt dan skema tool yang tersedia.
*   `any`: Memaksa Claude untuk menggunakan setidaknya satu tool dari daftar yang tersedia. Jika ada beberapa tool yang relevan, Claude akan memilih yang paling sesuai.
*   `tool`: Memaksa Claude untuk menggunakan tool spesifik yang Anda tentukan. Ini berguna ketika Anda tahu persis tool mana yang harus digunakan untuk tugas tertentu.

**Contoh `tool_choice`:**

```json
{
  "model": "claude-3-opus-20240229",
  "messages": [
    {
      "role": "user",
      "content": "Berapa suhu di London?"
    }
  ],
  "tools": [
    // ... definisi tool get_current_weather ...
  ],
  "tool_choice": {
    "type": "tool",
    "name": "get_current_weather"
  }
}
```

## 13. The Text Edit Tool

**The Text Edit Tool** adalah tool bawaan Anthropic yang memungkinkan Claude untuk melihat, memodifikasi, dan memanipulasi file teks atau kode. Tool ini sangat berguna untuk tugas-tugas pengembangan, debugging, dan otomatisasi yang melibatkan perubahan pada konten tekstual [5].

**Fungsionalitas Umum:**

*   **Membaca File**: Claude dapat meminta untuk membaca isi file tertentu.
*   **Mengedit File**: Claude dapat meminta untuk menyisipkan, menghapus, atau mengganti teks dalam file.
*   **Membuat File Baru**: Claude dapat meminta untuk membuat file baru dengan konten tertentu.

Tool ini memberdayakan Claude untuk bertindak sebagai asisten coding yang dapat secara langsung berinteraksi dengan codebase Anda.

## 14. The Web Search Tool

**The Web Search Tool** adalah tool bawaan Anthropic lainnya yang memberikan Claude kemampuan untuk melakukan pencarian web secara real-time. Ini memungkinkan Claude untuk mengakses informasi terkini yang tidak ada dalam data pelatihannya, seperti berita terbaru, harga saham, atau detail produk [6].

**Cara Kerja:**

*   Ketika Claude mendeteksi bahwa ia membutuhkan informasi eksternal yang dapat ditemukan di web, ia akan memanggil `web_search` tool.
*   Tool ini akan melakukan pencarian menggunakan mesin pencari dan mengembalikan hasil (misalnya, snippet teks atau URL) ke Claude.
*   Claude kemudian akan menggunakan hasil pencarian tersebut untuk merumuskan respons yang akurat dan relevan.

Tool ini sangat penting untuk mengurangi "halusinasi" dan memastikan Claude memberikan informasi yang faktual dan up-to-date.

## 15. Quiz on Tool Use with Claude (Prediksi Topik & Contoh Pertanyaan)

Bagian ini akan mencakup prediksi topik-topik yang mungkin muncul dalam kuis "Tool Use with Claude" dan contoh pertanyaan untuk membantu Anda mempersiapkan diri. Berdasarkan materi yang telah dibahas, fokus utama kuis kemungkinan besar akan berada pada pemahaman konsep, struktur, dan alur kerja implementasi.

**Topik Kunci untuk Kuis:**

*   **Definisi dan Tujuan Tool Use**: Apa itu Tool Use dan mengapa penting dalam pengembangan aplikasi AI?
*   **Struktur Tool Schema**: Komponen wajib dari `tool_schema` (nama, deskripsi, `input_schema`).
*   **Peran `description` dalam Tool Schema**: Mengapa deskripsi tool harus jelas dan akurat?
*   **Alur Kerja Tool Use**: Urutan langkah-langkah dari permintaan pengguna hingga respons akhir Claude dengan tool.
*   **Perbedaan `tool_use` dan `tool_result`**: Apa yang dikandung oleh masing-masing message block dan siapa yang mengirimnya?
*   **Pentingnya Konteks dalam Multi-turn**: Mengapa seluruh riwayat percakapan harus dipertahankan?
*   **Implementasi Multi-turn**: Logika dasar untuk mengelola percakapan berulang dengan tool.
*   **Penggunaan Beberapa Tool**: Skenario di mana Claude dapat menggunakan tool secara paralel atau berurutan.
*   **Batch Processing**: Manfaat dan konsep dasar batch processing dalam konteks API Claude.
*   **Tool untuk Data Terstruktur**: Bagaimana JSON Schema digunakan untuk memaksa output terstruktur.
*   **Fine-grained Tool Calling**: Fungsi dan opsi dari parameter `tool_choice` (`auto`, `any`, `tool`).
*   **Tool Bawaan Anthropic**: Fungsi dan kegunaan `Text Edit Tool` dan `Web Search Tool`.

**Contoh Pertanyaan Kuis (Prediksi):**

1.  Manakah dari berikut ini yang merupakan komponen wajib dalam definisi `tool_schema`?
    a) `output_schema`
    b) `description`
    c) `version`
    d) `author`

2.  Ketika Claude memutuskan untuk menggunakan tool, message block apa yang akan dikirimkannya?
    a) `text`
    b) `tool_result`
    c) `tool_use`
    d) `error`

3.  Apa tujuan utama dari parameter `tool_choice` dengan nilai `"type": "tool", "name": "my_specific_tool"`?
    a) Membiarkan Claude memilih tool secara otomatis.
    b) Memaksa Claude untuk menggunakan tool `my_specific_tool`.
    c) Meminta Claude untuk tidak menggunakan tool apa pun.
    d) Memungkinkan Claude untuk menggunakan beberapa tool secara paralel.

4.  Dalam percakapan multi-turn dengan tool, mengapa penting untuk menyertakan seluruh riwayat pesan dalam setiap permintaan ke Claude?
    a) Untuk mengurangi biaya API.
    b) Untuk mempertahankan konteks percakapan dan memungkinkan Claude membuat keputusan yang tepat.
    c) Untuk mempercepat respons Claude.
    d) Karena Claude tidak memiliki memori internal.

5.  Tool bawaan Anthropic yang memungkinkan Claude untuk mencari informasi real-time di internet adalah...
    a) `Text Edit Tool`
    b) `Batch Tool`
    c) `Web Search Tool`
    d) `Structured Data Tool`

## Kesimpulan

Dengan "Master Tool Use Blueprint" ini, Anda kini memiliki panduan lengkap untuk menaklukkan modul "Tool Use with Claude". Ingatlah bahwa praktik adalah kunci. Eksperimenlah dengan contoh-contoh kode, bangun tool Anda sendiri, dan terapkan konsep-konsep ini dalam proyek-proyek kecil. Semakin Anda berlatih, semakin mahir Anda dalam memanfaatkan kekuatan Tool Use Claude untuk menciptakan aplikasi AI yang luar biasa. Selamat belajar dan semoga sukses dalam mendapatkan sertifikasi Anda, GYS!

## Referensi

[1] Anthropic. (n.d.). *Tool use with Claude*. Claude API Docs. Retrieved from [https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)
[2] Anthropic. (n.d.). *How to implement tool use*. Claude API Docs. Retrieved from [https://platform.claude.com/docs/en/agents-and-tools/tool-use/implement-tool-use](https://platform.claude.com/docs/en/agents-and-tools/tool-use/implement-tool-use)
[3] Anthropic. (n.d.). *Tool use with Claude: Function Calling*. Scribd. Retrieved from [https://www.scribd.com/document/740794512/10-2-appendix-tool-use](https://www.scribd.com/document/740794512/10-2-appendix-tool-use)
[4] Anthropic. (n.d.). *Batch processing*. Claude API Docs. Retrieved from [https://platform.claude.com/docs/en/build-with-claude/batch-processing](https://platform.claude.com/docs/en/build-with-claude/batch-processing)
[5] Anthropic. (n.d.). *Text editor tool*. Claude API Docs. Retrieved from [https://platform.claude.com/docs/en/agents-and-tools/tool-use/text-editor-tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/text-editor-tool)
[6] Anthropic. (n.d.). *Web search tool*. Claude API Docs. Retrieved from [https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool)
