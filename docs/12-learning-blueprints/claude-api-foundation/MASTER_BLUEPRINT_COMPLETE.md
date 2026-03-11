# MASTER SECRET BLUEPRINT
# Building with the Claude API - Anthropic Academy
## Dokumentasi Komprehensif Bahasa Indonesia

---

# DAFTAR ISI

1. [MODUL 1: INTRODUCTION - Pengenalan Claude](#modul-1)
2. [MODUL 2: ACCESSING CLAUDE WITH THE API](#modul-2)
3. [MODUL 3: PROMPT EVALUATION](#modul-3)
4. [MODUL 4: PROMPT ENGINEERING TECHNIQUES](#modul-4)
5. [MODUL 5: TOOL USE WITH CLAUDE](#modul-5)
6. [MODUL 6: RETRIEVAL AUGMENTED GENERATION (RAG)](#modul-6)
7. [MODUL 7: FEATURES OF CLAUDE](#modul-7)
8. [MODUL 8: MODEL CONTEXT PROTOCOL (MCP)](#modul-8)
9. [MODUL 9: ANTHROPIC APPS - Claude Code & Computer Use](#modul-9)
10. [MODUL 10: AGENTS AND WORKFLOWS](#modul-10)
11. [FINAL ASSESSMENT GUIDE](#final-assessment)
12. [CHEAT SHEET & QUICK REFERENCE](#cheat-sheet)

---

# MODUL 1: INTRODUCTION - Pengenalan Claude {#modul-1}

## 1.1 Overview Model Claude

Claude punya **3 keluarga model** yang dioptimasi untuk prioritas berbeda:

### Tabel Perbandingan Model

| Model | Kekuatan | Kelemahan | Kapan Pakai |
|-------|----------|-----------|-------------|
| **Opus** | Kecerdasan tertinggi, reasoning mendalam, planning multi-step | Mahal, lambat (latency tinggi) | Task kompleks yang butuh pemikiran mendalam |
| **Sonnet** | Seimbang (intelligence + speed + cost), coding kuat, editing presisi | Tidak se-pintar Opus untuk reasoning sangat kompleks | **Kebanyakan use case praktis** (RECOMMENDED) |
| **Haiku** | Tercepat, termurah | Tidak punya kemampuan reasoning seperti Opus/Sonnet | Interaksi real-time, high-volume processing |

### Framework Pemilihan Model
- **Butuh kecerdasan?** --> Opus
- **Butuh kecepatan?** --> Haiku
- **Butuh keseimbangan?** --> Sonnet

### Insight Penting
- Semua model punya kemampuan dasar yang sama: text generation, coding, image analysis
- Perbedaan utama = **fokus optimasi**
- **Pendekatan umum di production**: Gunakan **BEBERAPA model** dalam satu aplikasi berdasarkan kebutuhan task spesifik (bukan hanya pilih satu model)

---

# MODUL 2: ACCESSING CLAUDE WITH THE API {#modul-2}

## 2.1 Alur Akses API (5 Langkah)

```
[User Input] --> [Server Developer] --> [Anthropic API] --> [Text Generation] --> [Response ke User]
```

### Langkah Detail:

**Langkah 1: Client --> Server**
- User mengirim teks ke server developer
- **JANGAN PERNAH** akses Anthropic API langsung dari client/frontend (API key harus rahasia!)

**Langkah 2: Server --> Anthropic API**
- Server membuat request menggunakan SDK (Python, TypeScript, JavaScript, Go, Ruby) atau HTTP biasa
- **Parameter WAJIB:**
  - `API key` - kunci autentikasi
  - `model` - nama model yang dipakai
  - `messages` - daftar pesan percakapan
  - `max_tokens` - batas panjang respons

**Langkah 3: Proses Text Generation (4 Tahap Internal)**

```
Input Text --> Tokenisasi --> Embedding --> Kontekstualisasi --> Generasi Output
```

1. **Tokenisasi** = memecah input jadi token (kata/bagian kata/simbol/spasi)
2. **Embedding** = mengubah token jadi daftar angka yang merepresentasikan semua kemungkinan makna kata
3. **Kontekstualisasi** = menyesuaikan embedding berdasarkan token tetangga untuk menentukan makna yang tepat
4. **Generasi** = layer output menghasilkan probabilitas kata berikutnya, model memilih pakai probabilitas + randomness, tambah kata terpilih, ulangi proses

**Langkah 4: Model Berhenti**
- Ketika `max_tokens` tercapai, ATAU
- Token spesial `end_of_sequence` dihasilkan

**Langkah 5: Response Dikembalikan**
- API mengembalikan: teks yang dihasilkan + jumlah token terpakai + alasan berhenti (`stop_reason`)
- Server kirim ke client untuk ditampilkan

### Glosarium Kunci
| Istilah | Definisi |
|---------|----------|
| Token | Potongan teks (kata/bagian/simbol) |
| Embedding | Representasi numerik makna kata |
| Kontekstualisasi | Penyempurnaan makna menggunakan kata tetangga |
| Max_tokens | Batas panjang generasi |
| Stop_reason | Alasan model berhenti generate |

## 2.2 Membuat Request (Making a Request)

### Setup 4 Langkah:

```python
# 1. Install packages
pip install anthropic python-dotenv

# 2. Simpan API key (buat file .env)
# ANTHROPIC_API_KEY="sk-ant-xxx..."

# 3. Load environment variable
from dotenv import load_dotenv
load_dotenv()

# 4. Buat client
import anthropic
client = anthropic.Anthropic()
model = "claude-sonnet-4-20250514"
```

### Struktur API Request:

```python
message = client.messages.create(
    model=model,
    max_tokens=1000,
    messages=[
        {"role": "user", "content": "Apa itu quantum computing?"}
    ]
)

# Akses respons penuh (termasuk metadata)
print(message)

# Akses teks saja
print(message.content[0].text)
```

### Tipe Pesan:
- **User message** = `{"role": "user", "content": "teks kamu"}` (konten dari manusia)
- **Assistant message** = berisi respons yang dihasilkan model

## 2.3 Multi-Turn Conversations (Percakapan Multi-Giliran)

### Batasan Kunci: Anthropic API **TIDAK MENYIMPAN** pesan apapun!

Setiap request itu **independen** - tidak ada memori dari pertukaran sebelumnya.

### Solusi: Maintain Message List Secara Manual

```python
# Helper functions
def add_user_message(messages, text):
    messages.append({"role": "user", "content": text})
    return messages

def add_assistant_message(messages, text):
    messages.append({"role": "assistant", "content": text})
    return messages

def chat(messages):
    response = client.messages.create(
        model=model,
        max_tokens=1000,
        messages=messages
    )
    return response

# Alur Percakapan:
messages = []

# Giliran 1
messages = add_user_message(messages, "Halo, siapa kamu?")
response = chat(messages)
messages = add_assistant_message(messages, response.content[0].text)

# Giliran 2 (kirim SELURUH history!)
messages = add_user_message(messages, "Ceritakan lebih detail")
response = chat(messages)
```

### Alur:
```
Kirim user message --> Terima assistant response --> Tambah ke history --> 
Tambah user message baru --> Kirim SELURUH history --> Repeat
```

**TANPA history** = respons tanpa konteks, tidak nyambung
**DENGAN history lengkap** = Claude maintain konteks percakapan

## 2.4 System Prompts

### Apa itu System Prompt?
Teknik untuk meng-kustomisasi **gaya dan nada** respons Claude dengan memberikan **peran atau pola perilaku** tertentu.

### Implementasi:

```python
system_prompt = """Kamu adalah tutor matematika yang sabar. 
Berikan petunjuk dan panduan, bukan jawaban langsung. 
Dorong siswa untuk berpikir sendiri."""

response = client.messages.create(
    model=model,
    max_tokens=1000,
    system=system_prompt,  # <-- keyword argument 'system'
    messages=[
        {"role": "user", "content": "Berapa 15 x 23?"}
    ]
)
```

### Prinsip Kunci:
- System prompt mengontrol **BAGAIMANA** Claude merespons, bukan **APA** yang direspons
- Pertanyaan yang sama mendapat perlakuan berbeda berdasarkan peran yang ditetapkan
- Baris pertama biasanya menetapkan peran: "You are a patient math tutor"
- Handle kasus `None` dengan mengecualikan parameter system sepenuhnya

```python
# Implementasi teknis yang lebih robust
params = {
    "model": model,
    "max_tokens": 1000,
    "messages": messages
}
if system_prompt:
    params["system"] = system_prompt

response = client.messages.create(**params)
```

## 2.5 Temperature

### Definisi
Parameter (0-1) yang mengontrol **keacakan** dalam generasi teks Claude dengan mempengaruhi probabilitas pemilihan token.

### Cara Kerja:
```
Input --> Tokenisasi --> Probabilitas untuk setiap token berikutnya --> 
Pemilihan berdasarkan probabilitas --> Ulangi
```

### Efek Temperature:

| Temperature | Perilaku | Contoh Penggunaan |
|-------------|----------|-------------------|
| **0** | Deterministik, selalu pilih token probabilitas tertinggi | Ekstraksi data, task faktual |
| **0.1 - 0.3** | Sedikit variasi, masih konsisten | Summarization, Q&A |
| **0.5 - 0.7** | Seimbang antara konsistensi dan kreativitas | General purpose |
| **0.8 - 1.0** | Kreatif, output tak terduga | Brainstorming, penulisan kreatif, jokes, marketing |

```python
response = client.messages.create(
    model=model,
    max_tokens=1000,
    temperature=0.7,  # <-- parameter temperature
    messages=[...]
)
```

### Insight:
- Temperature **secara langsung memanipulasi distribusi probabilitas** pemilihan token berikutnya
- Temperature tinggi **tidak menjamin** output berbeda, hanya **meningkatkan kemungkinan** variasi

## 2.6 Response Streaming

### Masalah yang Diselesaikan
Respons AI bisa memakan waktu **10-30 detik**. User mengharapkan feedback segera, bukan hanya spinner.

### Cara Kerja:

```
Server kirim pesan --> Claude kirim acknowledgment --> 
Stream event berturut-turut (chunk teks) --> 
Server forward chunk ke frontend secara real-time
```

### Tipe Event:
| Event | Keterangan |
|-------|------------|
| `message_start` | Acknowledgment awal |
| `content_block_start` | Generasi teks dimulai |
| `content_block_delta` | **Berisi chunk teks aktual** (paling penting!) |
| `content_block_stop` | Generasi selesai |
| `message_stop` | Pesan selesai |

### Implementasi:

```python
# Cara Basic
response = client.messages.create(
    stream=True,  # <-- aktifkan streaming
    model=model,
    max_tokens=1000,
    messages=[...]
)
for event in response:
    # proses setiap event
    pass

# Cara Simplified (RECOMMENDED)
with client.messages.stream(
    model=model,
    max_tokens=1000,
    messages=[...]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
    
    # Dapatkan pesan final lengkap untuk penyimpanan
    final_message = stream.get_final_message()
```

## 2.7 Controlling Model Output

### Teknik 1: Pre-filling Assistant Messages

**Cara kerja:** Tambahkan pesan assistant secara manual di akhir percakapan untuk mengarahkan respons.

```python
messages = [
    {"role": "user", "content": "Mana yang lebih baik, kopi atau teh?"},
    {"role": "assistant", "content": "Kopi lebih baik karena"}  # <-- pre-fill
]
# Claude akan MELANJUTKAN dari titik tepat ini
```

**Poin kunci:**
- Claude melihat pre-fill sebagai konten yang sudah dia tulis sendiri
- Claude melanjutkan dari **titik akhir persis** pre-fill
- Harus menggabungkan pre-fill + respons yang dihasilkan

### Teknik 2: Stop Sequences

**Cara kerja:** Paksa Claude berhenti ketika string tertentu muncul.

```python
response = client.messages.create(
    model=model,
    max_tokens=1000,
    stop_sequences=[", five"],  # <-- stop sequence
    messages=[
        {"role": "user", "content": "Hitung dari 1 sampai 10"}
    ]
)
# Output: "one, two, three, four" (berhenti sebelum "five")
```

**Catatan:** Teks stop sequence **TIDAK termasuk** dalam output final.

## 2.8 Structured Data (Data Terstruktur)

### Masalah
Claude secara otomatis menambahkan formatting markdown, header, komentar saat menghasilkan JSON/code.

### Solusi: Kombinasi Pre-fill + Stop Sequence

```python
messages = [
    {"role": "user", "content": "Buat JSON data 3 buah dengan nama dan warna"},
    {"role": "assistant", "content": "```json"}  # <-- pre-fill pembuka
]

response = client.messages.create(
    model=model,
    max_tokens=1000,
    stop_sequences=["```"],  # <-- stop di penutup
    messages=messages
)
# Hasil: JSON murni tanpa komentar atau formatting tambahan!
```

### Pattern Ini Bekerja Untuk:
- JSON
- Python code
- Regex
- Daftar terstruktur apapun
- Apapun yang butuh output bersih tanpa penjelasan

---

# MODUL 3: PROMPT EVALUATION {#modul-3}

## 3.1 Konsep Prompt Evaluation

### Apa itu?
Testing otomatis terhadap prompt menggunakan **metrik objektif** untuk mengukur efektivitas.

### 3 Jalan Setelah Menulis Prompt:

| Path | Deskripsi | Hasil |
|------|-----------|-------|
| **Path 1** (JEBAKAN) | Test 1-2 kali, langsung deploy ke production | Bug di production! |
| **Path 2** (JEBAKAN) | Test dengan input custom, tweak minor | Masih banyak corner case |
| **Path 3** (BENAR) | Jalankan melalui evaluation pipeline untuk scoring objektif | Prompt yang teruji! |

## 3.2 Alur Eval Workflow (6 Langkah)

```
1. Tulis draft prompt awal
       |
2. Buat dataset evaluasi (3 contoh sampai ribuan)
       |
3. Generate variasi prompt (interpolasi setiap input dataset ke template)
       |
4. Dapatkan respons LLM (kirim setiap variasi ke Claude)
       |
5. Grading respons (skor setiap respons, misal skala 1-10)
       |
6. Iterasi (modifikasi prompt, ulangi seluruh proses, bandingkan versi)
```

### Catatan Penting:
- Tidak ada metodologi standar yang baku
- Banyak tools open-source/berbayar tersedia
- Bisa mulai sederhana dengan implementasi custom
- Scoring objektif memungkinkan peningkatan prompt yang **sistematis**

## 3.3 Generating Test Datasets

### Pendekatan:
1. **Manual** - tulis sendiri satu per satu
2. **Otomatis** - gunakan Claude (pakai model lebih cepat seperti Haiku)

### Implementasi:

```python
def generate_dataset():
    prompt = """Buat 20 test case untuk prompt asisten kode AWS. 
    Setiap test case harus berupa JSON object dengan property 'task'."""
    
    messages = [
        {"role": "user", "content": prompt},
        {"role": "assistant", "content": "```json"}  # pre-fill
    ]
    
    response = client.messages.create(
        model="claude-3-haiku-20240307",  # pakai model cepat
        max_tokens=4000,
        stop_sequences=["```"],  # stop sequence
        messages=messages
    )
    
    dataset = json.loads(response.content[0].text)
    
    with open("dataset.json", "w") as f:
        json.dump(dataset, f, indent=2)
    
    return dataset
```

## 3.4 Running the Eval

### 3 Fungsi Inti:

```python
def run_prompt(test_case, prompt_template):
    """Gabungkan test case dengan prompt, kirim ke Claude"""
    prompt = prompt_template.format(task=test_case["task"])
    response = chat([{"role": "user", "content": prompt}])
    return response.content[0].text

def run_test_case(test_case, prompt_template):
    """Jalankan prompt dan grading hasilnya"""
    output = run_prompt(test_case, prompt_template)
    score = grade(output)  # sistem grading
    return {"output": output, "test_case": test_case, "score": score}

def run_eval(dataset, prompt_template):
    """Loop seluruh dataset"""
    results = []
    for test_case in dataset:
        result = run_test_case(test_case, prompt_template)
        results.append(result)
    return results
```

## 3.5 Model Based Grading

### 3 Tipe Grader:

| Tipe | Cara Kerja | Kelebihan | Kekurangan |
|------|------------|-----------|------------|
| **Code Grader** | Cek programatik (panjang, kehadiran kata, validasi sintaks) | Cepat, konsisten | Terbatas pada apa yang bisa dicek secara programatik |
| **Model Grader** | API call tambahan ke LLM untuk mengevaluasi output | Sangat fleksibel | Mungkin inkonsisten |
| **Human Grader** | Orang mengevaluasi respons | Paling fleksibel | Lambat, melelahkan |

### Implementasi Model Grader:

```python
def model_grade(output, test_case):
    grading_prompt = f"""Evaluasi output berikut.
    
    Task: {test_case['task']}
    Output: {output}
    
    Berikan analisis dalam JSON:
    - strengths: kekuatan output
    - weaknesses: kelemahan output  
    - reasoning: penjelasan penilaian
    - score: skor 1-10 (10 = terbaik)"""
    
    messages = [
        {"role": "user", "content": grading_prompt},
        {"role": "assistant", "content": "```json"}
    ]
    
    response = client.messages.create(
        model=model,
        max_tokens=1000,
        stop_sequences=["```"],
        messages=messages
    )
    
    return json.loads(response.content[0].text)
```

**Tips:** Minta reasoning/strengths/weaknesses, **BUKAN hanya skor saja** (kalau hanya skor, model cenderung kasih skor tengah-tengah).

## 3.6 Code Based Grading

### Implementasi Validator:

```python
import json
import ast
import re

def validate_json(output):
    try:
        json.loads(output)
        return 10
    except:
        return 0

def validate_python(output):
    try:
        ast.parse(output)
        return 10
    except:
        return 0

def validate_regex(output):
    try:
        re.compile(output)
        return 10
    except:
        return 0

# Skor akhir = (model_score + syntax_score) / 2
# Gabungan evaluasi semantik + validasi teknis
```

---

# MODUL 4: PROMPT ENGINEERING TECHNIQUES {#modul-4}

## 4.1 Konsep Prompt Engineering

**Definisi:** Teknik untuk menulis/mengedit prompt agar Claude lebih memahami permintaan dan respons yang diinginkan.

### Alur Peningkatan:
```
Prompt awal yang buruk --> Terapkan teknik satu per satu --> 
Evaluasi setiap teknik --> Amati peningkatan skor
```

**Contoh:** Prompt awal skor 2.32 --> setelah teknik diterapkan bisa naik signifikan!

## 4.2 Being Clear and Direct (Jelas dan Langsung)

### Prinsip:
- Gunakan bahasa **sederhana dan langsung** dengan **kata kerja aksi** di baris pertama
- Baris pertama = bagian **PALING KRITIS** dari prompt

### Struktur: `[Kata Kerja Aksi] + [Deskripsi Task Jelas] + [Spesifikasi Output]`

### Contoh BURUK vs BAIK:

```
BURUK: "Saya ingin tahu tentang panel surya dan bagaimana cara kerjanya, 
        mungkin bisa jelaskan dalam beberapa paragraf?"

BAIK:  "Tulis tiga paragraf tentang cara kerja panel surya."
```

```
BURUK: "Bisakah kamu membantu saya dengan informasi tentang energi geotermal?"

BAIK:  "Identifikasi tiga negara yang menggunakan energi geotermal dan 
        untuk masing-masing sertakan statistik pembangkitan energi."
```

**Hasil:** Skor naik dari **2.32 ke 3.92** hanya dengan teknik ini!

## 4.3 Being Specific (Menjadi Spesifik)

### 2 Tipe Guidelines:

**Type A - Atribut** (sifat yang diinginkan dalam output):
```
Panduan Output:
- Panjang: 500-700 kata
- Format: daftar bernomor
- Sertakan kalori per porsi
- Sertakan waktu persiapan
```

**Type B - Langkah** (langkah yang harus diikuti model):
```
Langkah-langkah:
1. Pertimbangkan kebutuhan kalori berdasarkan berat badan dan tinggi
2. Hitung distribusi makronutrien (protein, karbohidrat, lemak)
3. Pilih makanan yang sesuai dengan batasan diet
4. Bagi menjadi 3 makan utama dan 2 snack
```

### Kapan Menggunakan:
- **Type A:** Direkomendasikan untuk **hampir semua prompt**
- **Type B:** Untuk masalah kompleks di mana kamu ingin model mempertimbangkan perspektif lebih luas

**Hasil:** Skor melompat dari **3.92 ke 7.86** - peningkatan MASIF!

## 4.4 Structure with XML Tags (Struktur dengan Tag XML)

### Tujuan:
Membantu AI membedakan antara **tipe informasi yang berbeda** dan memahami pengelompokan teks.

### Implementasi:

```
BURUK (dump tanpa struktur):
"Berikut data penjualan dan kode saya yang bermasalah, 
tolong debug: [data campur kode]"

BAIK (terstruktur dengan XML):
"Tolong debug kode saya berdasarkan dokumentasi:

<my_code>
def calculate_total(items):
    return sum(item.price for item in items)
</my_code>

<docs>
API mengharuskan semua harga dalam format cents (integer).
</docs>"
```

### Tips Penamaan Tag:
- Gunakan nama **deskriptif dan spesifik**
- `<sales_records>` lebih baik dari `<data>`
- `<athlete_information>` lebih jelas dari `<info>`

## 4.5 Providing Examples (Memberikan Contoh)

### Terminologi:
- **One-shot prompting** = satu contoh
- **Multi-shot prompting** = beberapa contoh

### Struktur:

```xml
<example>
  <input>Review: "Makanan di sini 'luar biasa enak' 🙄"</input>
  <ideal_output>Sentimen: Negatif (sarkasme terdeteksi)</ideal_output>
  <reasoning>Tanda kutip dan emoji rolling eyes mengindikasikan sarkasme</reasoning>
</example>
```

### Best Practices:
1. Tambahkan **konteks untuk corner cases** ("hati-hati dengan sarkasme")
2. Sertakan **reasoning** yang menjelaskan mengapa output tersebut ideal
3. Gunakan contoh dengan **skor tertinggi** dari evaluasi sebagai template
4. Tempatkan contoh **SETELAH** instruksi/guidelines utama
5. Gabungkan contoh dengan penjelasan untuk memperkuat karakteristik output yang diinginkan

---

# MODUL 5: TOOL USE WITH CLAUDE {#modul-5}

## 5.1 Introducing Tool Use (Pengenalan Penggunaan Tool)

### Masalah Tanpa Tools:
Claude hanya tahu informasi dari data training-nya. Tidak bisa akses event terkini, data real-time, atau sistem eksternal.

### Alur Tool Use:

```
1. Kirim request awal ke Claude + instruksi akses data eksternal
       |
2. Claude evaluasi apakah butuh data eksternal --> minta info spesifik
       |
3. Server jalankan kode untuk fetch data dari sumber eksternal
       |
4. Kirim follow-up request ke Claude dengan data yang diambil
       |
5. Claude generate respons final menggunakan prompt asli + data eksternal
```

### Contoh Cuaca:
```
User: "Cuaca di Jakarta sekarang?"
--> Claude: "Saya butuh data cuaca untuk Jakarta" (tool request)
--> Server: Panggil API cuaca --> dapat data
--> Claude: "Cuaca di Jakarta saat ini cerah, suhu 32°C..." (respons final)
```

## 5.2 Project Overview - Sistem Reminder

### Goal: Ajarkan Claude untuk set reminder berbasis waktu

**3 Masalah yang Butuh Tools:**

| Masalah | Tool Solusi |
|---------|-------------|
| Claude tidak tahu waktu sekarang (hanya tanggal) | `get_current_datetime` |
| Claude kadang salah hitung waktu | `add_duration_to_datetime` |
| Claude tidak punya mekanisme reminder | `set_reminder` |

## 5.3 Tool Functions (Fungsi Tool)

### Karakteristik Utama:
- Fungsi Python biasa yang dipanggil Claude saat butuh info tambahan
- **HARUS** punya nama fungsi dan argumen yang deskriptif
- **HARUS** validasi input dan raise error dengan pesan bermakna
- Pesan error terlihat oleh Claude --> bisa retry dengan parameter yang diperbaiki

### Contoh:

```python
from datetime import datetime

def get_current_datetime(date_format="%Y%m%d %H:%M:%S"):
    """Mendapatkan tanggal dan waktu saat ini."""
    if not date_format:
        raise ValueError("Format tanggal tidak boleh kosong")
    return datetime.now().strftime(date_format)
```

### Best Practices:
1. Nama fungsi dan argumen yang **well-named**
2. Validasi input dengan **error raising segera**
3. Pesan error yang **bermakna** dan memandu koreksi

## 5.4 Tool Schemas

### Apa itu?
Spesifikasi JSON Schema yang mendeskripsikan fungsi tool dan parameternya untuk language model.

### Struktur Schema:

```python
from anthropic.types import ToolParam

get_datetime_schema = ToolParam({
    "name": "get_current_datetime",
    "description": "Mendapatkan tanggal dan waktu saat ini. "
                   "Gunakan saat user bertanya tentang waktu sekarang. "
                   "Mengembalikan datetime dalam format yang ditentukan.",
    "input_schema": {
        "type": "object",
        "properties": {
            "date_format": {
                "type": "string",
                "description": "Format strftime untuk output datetime. "
                              "Default: '%Y%m%d %H:%M:%S'"
            }
        },
        "required": []
    }
})
```

### Trik Generate Schema:
1. Bawa fungsi tool ke Claude.ai
2. Prompt: "Tulis JSON schema spec yang valid untuk tool calling fungsi ini, ikuti best practices dari dokumentasi terlampir"
3. Lampirkan halaman dokumentasi Anthropic API tool use
4. Copy schema yang dihasilkan!

### Konvensi Penamaan:
- Fungsi: `get_current_datetime`
- Schema: `get_current_datetime_schema`

## 5.5 Handling Message Blocks

### Perubahan Penting dengan Tools:
Pesan sekarang berisi **MULTIPLE BLOCKS** (bukan hanya text block)!

### Struktur Respons Tool:
```python
# Respons assistant berisi:
# 1. Text block = penjelasan untuk user
# 2. Tool use block = nama fungsi + argumen untuk eksekusi tool

response.content = [
    {
        "type": "text",
        "text": "Saya akan mengecek waktu saat ini..."
    },
    {
        "type": "tool_use",
        "id": "toolu_xxx",
        "name": "get_current_datetime",
        "input": {"date_format": "%Y-%m-%d %H:%M:%S"}
    }
]
```

### KRITIS: Maintenance History
- Claude **TIDAK MENYIMPAN APAPUN**
- Tambahkan **SELURUH** `response.content` (semua blocks) ke list pesan
- BUKAN hanya teks!

## 5.6 Sending Tool Results

### Proses:
```
Eksekusi fungsi tool --> Buat tool result block --> 
Kirim follow-up request dengan history lengkap
```

### Struktur Tool Result Block:

```python
tool_result = {
    "type": "tool_result",
    "tool_use_id": "toolu_xxx",  # HARUS cocok dengan ID asli!
    "content": json.dumps(result),  # output fungsi (string)
    "is_error": False  # Boolean untuk error
}
```

### Penting:
- `tool_use_id` menghubungkan request dengan result yang benar
- Tool result masuk ke **user message** (bukan assistant message!)
- **HARUS** sertakan tool schemas asli meskipun tidak pakai tools lagi
- Kirim **SELURUH** message history (user asli + assistant tool use + user dengan tool result)

## 5.7 Multi-Turn Conversations with Tools

### Tool Chaining:
```
User tanya --> Claude minta tool 1 --> tool 1 dijalankan --> 
hasil dikembalikan --> Claude minta tool 2 --> tool 2 dijalankan --> 
hasil dikembalikan --> Claude kasih jawaban final
```

### Contoh: "Hari apa 103 hari dari sekarang?"
1. Claude panggil `get_current_datetime`
2. Claude panggil `add_duration_to_datetime`
3. Claude berikan jawaban

### Insight Kunci:
- Tidak bisa memprediksi berapa banyak tools yang dibutuhkan
- Sistem harus handle **rantai tool calls yang arbitrary** secara otomatis

## 5.8 Implementing Multiple Turns

### Stop Reason Field:
- `stop_reason = "tool_use"` --> Claude mau panggil tool
- Nilai lain --> Claude sudah selesai

### Fungsi `run_conversation`:

```python
def run_conversation(messages, tools):
    while True:
        # 1. Panggil Claude
        response = client.messages.create(
            model=model,
            max_tokens=4096,
            tools=tools,
            messages=messages
        )
        
        # 2. Tambah respons assistant ke history
        messages.append({
            "role": "assistant",
            "content": response.content
        })
        
        # 3. Cek apakah masih mau tool
        if response.stop_reason != "tool_use":
            break  # Selesai!
        
        # 4. Jalankan tools
        tool_results = run_tools(response)
        
        # 5. Tambah hasil sebagai user message
        messages.append({
            "role": "user",
            "content": tool_results
        })
    
    return response
```

### Fungsi `run_tools`:

```python
def run_tools(response):
    results = []
    for block in response.content:
        if block.type == "tool_use":
            try:
                output = run_tool(block.name, block.input)
                results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": json.dumps(output),
                    "is_error": False
                })
            except Exception as e:
                results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": str(e),
                    "is_error": True
                })
    return results
```

### Fungsi `run_tool` (Dispatcher):

```python
def run_tool(tool_name, tool_input):
    if tool_name == "get_current_datetime":
        return get_current_datetime(**tool_input)
    elif tool_name == "add_duration_to_datetime":
        return add_duration_to_datetime(**tool_input)
    elif tool_name == "set_reminder":
        return set_reminder(**tool_input)
    else:
        raise ValueError(f"Tool tidak dikenal: {tool_name}")
```

## 5.9 Using Multiple Tools

### Proses Menambah Tool Baru (3 Langkah):
1. Tambah tool schema ke list tools di `run_conversation`
2. Tambah conditional case di `run_tool` untuk handle nama tool baru
3. Implementasi fungsi tool yang sebenarnya

### Skalabilitas:
Setelah framework awal selesai, menambah tool baru = **pattern sederhana** schema + routing + implementasi!

## 5.10 The Batch Tool

### Masalah:
Claude secara teknis **bisa** kirim multiple tool use blocks dalam satu pesan, tapi **jarang** melakukannya --> tool calls sequential yang tidak perlu.

### Solusi: Batch Tool

```python
batch_tool_schema = ToolParam({
    "name": "batch_tool",
    "description": "Menjalankan beberapa tool secara paralel dalam satu panggilan.",
    "input_schema": {
        "type": "object",
        "properties": {
            "invocations": {
                "type": "array",
                "items": {
                    "type": "object",
                    "properties": {
                        "tool_name": {"type": "string"},
                        "arguments": {"type": "string"}  # JSON string
                    }
                }
            }
        },
        "required": ["invocations"]
    }
})

def run_batch(invocations):
    results = []
    for inv in invocations:
        tool_name = inv["tool_name"]
        args = json.loads(inv["arguments"])
        result = run_tool(tool_name, args)
        results.append(result)
    return results
```

**Mekanisme:** "Menipu" Claude ke eksekusi tool paralel lewat abstraksi level tinggi.
**Hasil:** Satu siklus request-response, bukan beberapa rounds sequential!

## 5.11 Tools for Structured Data

### Alternatif dari Pre-fill + Stop Sequence:
Gunakan sistem tool Claude untuk **ekstrak data JSON terstruktur** dari sumber data.

### Perbedaan dari Metode Prompt:
- **Lebih reliable** outputnya
- Setup lebih **kompleks**
- Butuh **JSON schema** specification

### Implementasi:

```python
extraction_schema = ToolParam({
    "name": "extract_data",
    "description": "Mengekstrak data terstruktur dari teks.",
    "input_schema": {
        "type": "object",
        "properties": {
            "nama": {"type": "string"},
            "umur": {"type": "integer"},
            "kota": {"type": "string"}
        },
        "required": ["nama", "umur", "kota"]
    }
})

response = client.messages.create(
    model=model,
    max_tokens=1000,
    tools=[extraction_schema],
    tool_choice={"type": "tool", "name": "extract_data"},  # PAKSA tool!
    messages=[{"role": "user", "content": "John berumur 30 tahun dan tinggal di Jakarta"}]
)

# Akses data terstruktur
structured_data = response.content[0].input
# {"nama": "John", "umur": 30, "kota": "Jakarta"}
```

### `tool_choice` Parameter:
- `{"type": "tool", "name": "nama_tool"}` = **PAKSA** Claude selalu panggil tool tertentu
- Memastikan Claude selalu menghasilkan data terstruktur

## 5.12 Fine-Grained Tool Calling (Tool Streaming)

### Mode Default:
- Claude generate chunk JSON untuk argumen tool
- API **buffer** chunk sampai key-value pair lengkap
- **Validasi** JSON terhadap schema sebelum kirim
- Hasilnya: delay lalu burst chunk datang bersamaan

### Mode Fine-Grained (`fine_grained: true`):
- **Nonaktifkan** validasi JSON di sisi API
- Kirim chunk **segera** saat dihasilkan
- Streaming tradisional yang smooth
- **Butuh** error handling JSON di sisi client

### Trade-off:

| | Default | Fine-Grained |
|---|---------|-------------|
| Kecepatan | Lambat | Cepat |
| JSON Valid | Ya, tervalidasi | Mungkin invalid |
| Use case | Validasi delay OK | Butuh update UI segera |

## 5.13 The Text Edit Tool

### Apa itu?
Tool bawaan Claude untuk operasi file/teks (baca, tulis, buat, replace, undo).

### Keunikan:
- **Hanya** JSON schema yang built-in di Claude
- **Implementasi harus ditulis sendiri** (custom code)
- Schema stub dikirim ke Claude --> Claude **auto-expand** ke schema lengkap

### Workflow:
```
1. Kirim schema stub minimal ke Claude (name + type + tanggal versi)
2. Claude expand ke schema lengkap secara internal
3. Claude kirim tool use requests
4. Implementasi custom kita eksekusi operasi file
5. Hasil dikirim balik ke Claude
```

### Use cases:
- Replikasi fungsi AI code editor
- Operasi file system
- Automated code generation/refactoring
- Manipulasi proyek multi-file

## 5.14 The Web Search Tool

### Built-in tool tanpa custom code!

### Schema:

```python
web_search_schema = {
    "type": "web_search_20250305",
    "name": "web_search",
    "max_uses": 5,  # batas total pencarian
    "allowed_domains": ["nih.gov"]  # opsional: batasi domain
}
```

### Struktur Respons:
- **Text blocks** = teks penjelasan Claude
- **Tool use blocks** = query pencarian yang dijalankan
- **Web search result blocks** = halaman yang ditemukan (judul, URL)
- **Citation blocks** = teks spesifik yang mendukung pernyataan Claude

### Fitur:
- Multiple pencarian per request (sampai `max_uses`)
- Pembatasan domain untuk kontrol kualitas
- Sistem sitasi yang menghubungkan pernyataan ke sumber

---

# MODUL 6: RETRIEVAL AUGMENTED GENERATION (RAG) {#modul-6}

## 6.1 Introducing RAG

### Masalah:
Bagaimana mengekstrak informasi spesifik dari dokumen besar (100-1000+ halaman) menggunakan Claude tanpa melebihi batas konteks?

### 2 Opsi:

**Opsi 1 - Pendekatan Langsung:**
```
Masukkan SELURUH teks dokumen ke dalam prompt
```
- Batasan: Hard token limits, efektivitas menurun dengan prompt panjang, biaya tinggi, lambat

**Opsi 2 - Pendekatan RAG:**
```
1. Pecah dokumen jadi chunk kecil
2. Untuk setiap pertanyaan user, cari chunk paling relevan
3. Masukkan HANYA chunk relevan ke prompt
```

### Perbandingan:

| | Langsung | RAG |
|---|---------|-----|
| Simplicity | Mudah | Kompleks |
| Scalability | Terbatas | Sangat scalable |
| Biaya | Tinggi | Rendah |
| Kecepatan | Lambat | Cepat |
| Preprocessing | Tidak perlu | Perlu |

## 6.2 Text Chunking Strategies

### 3 Strategi Utama:

**1. Size-Based Chunking** (berdasarkan ukuran)
```python
def chunk_by_size(text, chunk_size=1000, overlap=200):
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start = end - overlap  # overlap untuk preservasi konteks
    return chunks
```
- **Pro:** Mudah implementasi, paling umum di production
- **Kontra:** Memotong kata, kurang konteks
- **Solusi:** Strategi overlap = sertakan karakter dari chunk tetangga

**2. Structure-Based Chunking** (berdasarkan struktur)
```python
def chunk_by_section(text, delimiter="## "):
    return text.split(delimiter)
```
- Terbaik untuk dokumen terstruktur (markdown, HTML)
- Butuh jaminan formatting dokumen

**3. Semantic-Based Chunking** (berdasarkan semantik)
- Teknik paling canggih
- Mengelompokkan kalimat berdasarkan kemiripan semantik
- Implementasi kompleks

### Aturan:
**Tidak ada metode chunking terbaik yang universal** - tergantung jenis dokumen dan use case!

## 6.3 Text Embeddings

### Definisi:
Representasi numerik dari makna teks yang dihasilkan oleh model embedding.

### Cara Kerja:
```
Input Teks --> Model Embedding --> Daftar Angka (range -1 sampai +1)
```

### Semantic Search:
Menggunakan text embeddings untuk menemukan chunk teks yang **relevan** dengan pertanyaan user dalam pipeline RAG.

### Implementasi:
- Anthropic merekomendasikan **Voyage AI** untuk embedding generation
- Butuh akun/API key terpisah
- Gratis untuk mulai

## 6.4 The Full RAG Flow (7 Langkah)

```
=== PREPROCESSING (Dilakukan Sekali) ===

Step 1: Text Chunking
  Dokumen sumber --> dipecah jadi chunk-chunk

Step 2: Generate Embeddings
  Setiap chunk --> diubah jadi vektor numerik

Step 3: Normalisasi
  Skala magnitude vektor ke 1.0 (otomatis oleh API)

Step 4: Simpan di Vector Database
  Embeddings disimpan di database khusus vektor

=== REAL-TIME (Setiap Query User) ===

Step 5: Query Processing
  Pertanyaan user --> diubah jadi embedding (pakai model yang sama!)

Step 6: Similarity Search
  Cari embeddings tersimpan yang paling mirip (cosine similarity)

Step 7: Prompt Assembly
  Gabungkan pertanyaan user + chunk teks relevan --> kirim ke LLM
```

### Konsep Matematika:
- **Cosine Similarity** = cosinus sudut antara vektor, range -1 sampai 1, makin dekat 1 = makin mirip
- **Cosine Distance** = 1 - cosine similarity, makin dekat 0 = makin mirip
- **Vector Database** = melakukan kalkulasi similarity untuk menemukan embedding terdekat

## 6.5 Implementing the RAG Flow

```python
# Step 1: Chunking
chunks = chunk_by_section(document_text)

# Step 2: Generate embeddings
def generate_embedding(text):
    # Menggunakan Voyage AI atau embedding model lain
    result = voyage_client.embed(text, model="voyage-2")
    return result.embeddings[0]

# Step 3 & 4: Simpan di vector store
store = VectorIndex()
for chunk in chunks:
    embedding = generate_embedding(chunk)
    store.add_vector(embedding, {"content": chunk})

# Step 5: Query processing
user_query = "Apa yang dilakukan departemen software engineering tahun lalu?"
query_embedding = generate_embedding(user_query)

# Step 6: Similarity search
results = store.search(query_embedding, top_k=2)
# returns: [{"content": "...", "distance": 0.71}, {"content": "...", "distance": 0.72}]

# Step 7: Prompt assembly
context = "\n".join([r["content"] for r in results])
prompt = f"""Berdasarkan konteks berikut, jawab pertanyaan:

<context>
{context}
</context>

Pertanyaan: {user_query}"""
```

## 6.6 BM25 Lexical Search

### Apa itu BM25?
**Best Match 25** - algoritma pencarian leksikal yang melengkapi semantic search.

### Masalah Semantic Search Saja:
Bisa **miss exact term matches** -- contoh: dokumen medis tentang "bug" terambi untuk query software tentang "bug".

### Pendekatan Hybrid:
```
User Query --> [Semantic Search (Embeddings)] + [Lexical Search (BM25)] --> Merge Hasil
```

### Langkah BM25:
1. **Tokenisasi** query user (hapus punctuation, split spasi)
2. **Hitung frekuensi** setiap term di seluruh chunk/dokumen
3. **Assign importance** - term jarang = importance tinggi, term umum ("a", "the") = importance rendah
4. **Ranking** chunk berdasarkan seberapa sering mengandung term dengan bobot tinggi

### Insight:
Term yang sering muncul di seluruh corpus **kurang penting** untuk relevansi pencarian dibanding term spesifik yang jarang.

## 6.7 Multi-Index RAG Pipeline

### Komponen:
- **Vector Index** = semantic similarity search (embeddings)
- **BM25 Index** = lexical/keyword search
- **Retriever Class** = wrapper yang forward query ke kedua index dan merge hasilnya

### Reciprocal Rank Fusion (RRF):
Teknik untuk merge hasil pencarian dari index berbeda.

```
Formula: RRF_score = SUM of (1/(rank + 1)) untuk setiap metode pencarian

Contoh:
Vector search: [doc2, doc7, doc6]
BM25 search:   [doc6, doc2, doc7]

doc2: 1/(1+1) + 1/(2+1) = 0.5 + 0.33 = 0.83  <-- TERTINGGI
doc6: 1/(3+1) + 1/(1+1) = 0.25 + 0.5 = 0.75
doc7: 1/(2+1) + 1/(3+1) = 0.33 + 0.25 = 0.58

Ranking final: [doc2, doc6, doc7]
```

## 6.8 Reranking Results

### Definisi:
Langkah post-processing yang menggunakan **LLM untuk mengurutkan ulang** hasil pencarian berdasarkan relevansi.

### Proses:
```
Vector + BM25 search --> merge results --> 
kirim ke LLM dengan prompt minta ranking --> 
dapat hasil terurut ulang
```

### Trade-off:
- **Meningkatkan** akurasi pencarian
- **Meningkatkan** latency (ada LLM call tambahan)
- Efektif saat initial retrieval **miss nuanced query intent**

### Contoh:
Query "Apa yang dilakukan tim ENG dengan insiden 2023?" --> setelah reranking, bagian software engineering diprioritaskan di atas bagian cybersecurity (yang tadinya ranking lebih tinggi di hybrid search).

## 6.9 Contextual Retrieval

### Masalah:
Saat dokumen dipecah jadi chunk, chunk individual **kehilangan konteks** dari dokumen asli.

### Solusi: Pre-processing

```python
def add_context(chunk, source_document):
    prompt = f"""Berikut chunk dari dokumen yang lebih besar:

<source_document>
{source_document}
</source_document>

<chunk>
{chunk}
</chunk>

Buat konteks singkat yang menjelaskan hubungan chunk ini 
dengan dokumen yang lebih besar."""

    context = call_claude(prompt)
    return f"{context}\n\n{chunk}"  # contextualized chunk
```

### Strategi untuk Dokumen Besar:
Jika source document terlalu besar untuk satu prompt:
- Sertakan **starter chunks** (1-3) dari awal dokumen untuk summary/abstract
- Sertakan chunk **tepat sebelum** target chunk untuk konteks lokal
- **Skip** chunk tengah yang kurang relevan

---

# MODUL 7: FEATURES OF CLAUDE {#modul-7}

## 7.1 Extended Thinking

### Definisi:
Fitur Claude yang memungkinkan **waktu reasoning sebelum** menghasilkan respons final.

### Mekanik:
- Menampilkan **proses berpikir terpisah** yang terlihat oleh user
- Meningkatkan akurasi untuk task kompleks TAPI menambah **biaya** (charged thinking tokens) dan **latency**
- **Thinking budget** = minimum 1024 token untuk fase thinking
- `max_tokens` harus melebihi thinking budget (budget 1024 = max_tokens minimal 1025)

### Kapan Menggunakan:
Aktifkan SETELAH optimasi prompt **gagal** mencapai akurasi yang diinginkan.

### Implementasi:

```python
response = client.messages.create(
    model=model,
    max_tokens=8192,
    thinking={
        "type": "enabled",
        "budget_tokens": 4096  # minimal 1024
    },
    messages=[{"role": "user", "content": "Pertanyaan kompleks..."}]
)

# Struktur respons:
# response.content[0] = Thinking block (reasoning + signature)
# response.content[1] = Text block (jawaban final)
```

### Catatan Khusus:
- **Redacted thinking blocks** = teks thinking terenkripsi yang ditandai oleh safety systems
- Disediakan untuk kontinuitas percakapan tanpa kehilangan konteks

## 7.2 Image Support

### Kemampuan:
- Proses gambar dalam user messages
- Analisis, perbandingan, penghitungan, deskripsi

### Batasan:
- Max **100 gambar** per request
- Ada batasan ukuran/dimensi
- Gambar mengkonsumsi token (dihitung berdasarkan pixel)

### Implementasi:

```python
import base64

# Encode gambar
with open("image.png", "rb") as f:
    image_data = base64.standard_b64encode(f.read()).decode("utf-8")

message = client.messages.create(
    model=model,
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "image",
                "source": {
                    "type": "base64",
                    "media_type": "image/png",
                    "data": image_data
                }
            },
            {
                "type": "text",
                "text": "Analisis gambar ini secara detail. "
                       "Langkah 1: Identifikasi objek utama. "
                       "Langkah 2: Deskripsikan layout. "
                       "Langkah 3: Berikan assessment risiko."
            }
        ]
    }]
)
```

### Insight Kunci:
**Akurasi gambar bergantung sepenuhnya pada kecanggihan prompt**, bukan hanya kualitas gambar!

## 7.3 PDF Support

### Perubahan dari Image Processing:
| Parameter | Image | PDF |
|-----------|-------|-----|
| type | `"image"` | `"document"` |
| media_type | `"image/png"` | `"application/pdf"` |
| variable | `image_bytes` | `file_bytes` |

### Kemampuan:
- Baca teks + gambar + chart + tabel + konten campuran
- Solusi one-stop untuk analisis dokumen komprehensif

## 7.4 Citations

### Definisi:
Fitur yang memungkinkan Claude **mereferensikan dokumen sumber** dan menunjukkan dari mana informasi berasal.

### Tipe Citation:
| Tipe | Untuk | Info yang Ditampilkan |
|------|-------|-----------------------|
| `citation_page_location` | PDF | Index dokumen, judul, halaman awal/akhir, teks dikutip |
| `citation_char_location` | Plain text | Posisi karakter dalam text block |

### Implementasi:

```python
response = client.messages.create(
    model=model,
    max_tokens=1024,
    messages=[{
        "role": "user",
        "content": [
            {
                "type": "document",
                "source": {
                    "type": "base64",
                    "media_type": "application/pdf",
                    "data": pdf_data
                },
                "title": "Laporan Tahunan 2024",  # <-- identifikasi dokumen
                "citations": {"enabled": True}  # <-- aktifkan citations
            },
            {
                "type": "text",
                "text": "Apa temuan utama laporan ini?"
            }
        ]
    }]
)
```

## 7.5 Prompt Caching

### Masalah:
Saat follow-up requests berisi pesan input identik, Claude harus **ulangi semua computational work** yang sudah dibuang --> tidak efisien!

### Solusi:
Prompt caching **menyimpan hasil pemrosesan** input di cache sementara. Request berikutnya dengan input identik --> Claude ambil dari cache, bukan proses ulang!

### Aturan:
- **Durasi cache** = 1 jam maksimum
- Butuh **cache breakpoint manual** di message blocks
- **Urutan pemrosesan** konten: tools --> system prompt --> messages
- **Maksimum breakpoint** = 4 per request
- **Threshold minimum** = 1024 token untuk konten yang di-cache

### Format Text Block:
```python
# Shorthand (TIDAK BISA di-cache):
content = "text string"

# Longhand (BISA di-cache):
content = [{
    "type": "text",
    "text": "content",
    "cache_control": {"type": "ephemeral"}
}]
```

### Cache Invalidation:
Perubahan **APAPUN** pada konten sebelum breakpoint **membatalkan seluruh cache!**

## 7.6 Prompt Caching in Action

### Implementasi untuk Tool Schemas:

```python
def chat_with_caching(messages, tools, system_prompt=None):
    # Cache tool schemas (tambah cache_control ke tool terakhir)
    cached_tools = [t.copy() for t in tools]
    cached_tools[-1] = {**cached_tools[-1], "cache_control": {"type": "ephemeral"}}
    
    # Cache system prompt
    cached_system = None
    if system_prompt:
        cached_system = [{
            "type": "text",
            "text": system_prompt,
            "cache_control": {"type": "ephemeral"}
        }]
    
    response = client.messages.create(
        model=model,
        max_tokens=4096,
        tools=cached_tools,
        system=cached_system,
        messages=messages
    )
    return response
```

### Token Usage Monitoring:
- `cache_creation_input_tokens` = token ditulis ke cache (panggilan pertama)
- `cache_read_input_tokens` = token diambil dari cache (panggilan berikutnya)

## 7.7 Code Execution and Files API

### Files API:
Upload file di muka --> referensikan nanti via file ID

```python
# Upload file
file = client.files.create(
    file=open("data.csv", "rb"),
    purpose="assistants"
)
file_id = file.id
```

### Code Execution:
- Tool server-based di mana Claude **mengeksekusi Python code** di Docker container terisolasi
- Tidak perlu implementasi, cukup include **predefined tool schema**
- Claude bisa jalankan code **berkali-kali**, interpretasi hasil, generate respons final

### Batasan: Docker container **TIDAK ada akses network!**

### Combined Workflow:
```
Upload file --> Dapat file ID --> Include ID di container upload block --> 
Minta Claude analisis --> Claude tulis & eksekusi code --> Return analisis & hasil
```

---

# MODUL 8: MODEL CONTEXT PROTOCOL (MCP) {#modul-8}

## 8.1 Introducing MCP

### Definisi:
**Model Context Protocol** = lapisan komunikasi yang menyediakan Claude dengan konteks dan tools **tanpa developer perlu menulis kode yang melelahkan**.

### Arsitektur:
```
[MCP Client] <--> [MCP Server]
                      |
                 [Tools]
                 [Resources]
                 [Prompts]
```

### Masalah yang Diselesaikan:
Membuat chatbot GitHub butuh implementasi tools untuk repositories, pull requests, issues, projects --> **effort developer signifikan!**

### Solusi MCP:
MCP server handle **definisi tool dan eksekusi** -- bukan server aplikasi kamu. MCP servers = interface ke layanan luar, membungkus fungsionalitas jadi tools siap pakai.

### Siapa yang Buat MCP Server?
- Siapa saja! Sering kali **penyedia layanan** membuat implementasi resmi (AWS, dll.)

### MCP vs Direct API vs Tool Use:
- MCP **mengeliminasi** kebutuhan menulis tool schemas/functions sendiri
- MCP dan tool use **saling melengkapi** -- MCP handle SIAPA yang kerjakan (server vs developer)

## 8.2 MCP Clients

### Definisi:
Interface komunikasi antara server kamu dan MCP server, menyediakan akses ke tools server.

### Transport:
Client/server bisa komunikasi via: **stdio, HTTP, WebSockets** (transport agnostic)

### Tipe Pesan Kunci:

| Pesan | Arah | Fungsi |
|-------|------|--------|
| `list_tools_request` | Client --> Server | Minta daftar tools |
| `list_tools_result` | Server --> Client | Balas dengan daftar tools |
| `call_tool_request` | Client --> Server | Minta eksekusi tool |
| `call_tool_result` | Server --> Client | Balas dengan hasil eksekusi |

### Alur Lengkap:
```
User query --> Server --> MCP Client --> MCP Server (list tools)
                                              |
MCP Server (respond tools) --> MCP Client --> Server --> Claude
                                                           |
Claude (tool request) --> Server --> MCP Client --> MCP Server (execute)
                                                           |
MCP Server (result) --> MCP Client --> Server --> Claude --> User
```

## 8.3 Project Setup

### Proyek: CLI-based chatbot

**Komponen:**
- MCP client (connect ke custom MCP server)
- MCP server (2 tools: read document, update document)
- Document collection (fake documents di memory)

### Setup:
```bash
# 1. Download & extract starter code
# 2. Tambah API key di .env
# 3. Install dependencies
pip install -r requirements.txt
# atau
uv pip install -r requirements.txt

# 4. Jalankan
python main.py
# atau
uv run main.py
```

## 8.4 Defining Tools with MCP

### SDK Python MCP auto-generate JSON schemas dari definisi fungsi Python!

```python
from mcp.server import Server
from pydantic import Field

mcp = Server("document-server")

@mcp.tool(name="read_doc_contents", 
          description="Membaca isi dokumen berdasarkan ID")
def read_doc_contents(
    doc_id: str = Field(description="ID unik dokumen yang akan dibaca")
) -> str:
    if doc_id not in docs:
        raise ValueError(f"Dokumen dengan ID {doc_id} tidak ditemukan")
    return docs[doc_id]

@mcp.tool(name="edit_document",
          description="Edit dokumen dengan find and replace")
def edit_document(
    doc_id: str = Field(description="ID unik dokumen"),
    old_string: str = Field(description="Teks yang akan diganti"),
    new_string: str = Field(description="Teks pengganti")
) -> str:
    if doc_id not in docs:
        raise ValueError(f"Dokumen dengan ID {doc_id} tidak ditemukan")
    docs[doc_id] = docs[doc_id].replace(old_string, new_string)
    return "Dokumen berhasil diupdate"
```

### Keuntungan:
SDK **mengeliminasi penulisan JSON schema manual** -- generate otomatis dari function signature dan decorator!

## 8.5 The Server Inspector

### MCP Inspector = debugger in-browser untuk testing MCP server

```bash
mcp dev server.py
# Buka URL yang diberikan di browser
```

### Workflow Testing:
```
Connect ke server --> Navigate ke tools --> Pilih tool --> 
Input parameter --> Click run --> Verifikasi output
```

## 8.6 Implementing a Client

```python
from mcp import ClientSession

class MCPClient:
    def __init__(self):
        self.session = None
    
    async def connect(self, server_config):
        # Setup connection...
        self.session = ClientSession(...)
    
    async def list_tools(self):
        result = await self.session.list_tools()
        return result.tools
    
    async def call_tool(self, tool_name, tool_input):
        result = await self.session.call_tool(tool_name, tool_input)
        return result
    
    async def close(self):
        # Cleanup resources
        await self.session.close()
```

## 8.7 Defining Resources

### 2 Tipe Resource:

| Tipe | URI | Contoh |
|------|-----|--------|
| **Direct** (statis) | `"docs://documents"` | Daftar semua dokumen |
| **Templated** (parameterized) | `"docs://documents/{doc_id}"` | Dokumen spesifik |

### Implementasi:

```python
@mcp.resource("docs://documents", mime_type="application/json")
def list_documents():
    return list(docs.keys())

@mcp.resource("docs://documents/{doc_id}", mime_type="text/plain")
def get_document(doc_id: str):
    if doc_id not in docs:
        raise ValueError(f"Dokumen {doc_id} tidak ditemukan")
    return docs[doc_id]
```

### Resources vs Tools:
- **Resources** = data proaktif (fetch konten saat di-mention)
- **Tools** = aksi reaktif (saat Claude memutuskan untuk panggil)

## 8.8 Accessing Resources

```python
import json
from pydantic import AnyUrl

class MCPClient:
    async def read_resource(self, uri):
        result = await self.session.read_resource(AnyUrl(uri))
        resource = result.contents[0]
        
        if resource.mime_type == "application/json":
            return json.loads(resource.text)
        return resource.text
```

## 8.9 Defining Prompts

### MCP Prompts = template prompt pre-defined yang diexpose server ke client

```python
from mcp import types as base

@mcp.prompt(name="format_document", 
            description="Format dokumen ke markdown")
def format_document(doc_id: str):
    return [
        base.UserMessage(
            content=f"""Baca dokumen dengan ID "{doc_id}" menggunakan tool yang tersedia.
            Lalu format ulang ke markdown yang rapi.
            Simpan perubahan ke dokumen yang sama."""
        )
    ]
```

### Client Integration:
Prompts muncul sebagai **autocomplete options** (slash commands) di aplikasi client.

## 8.10 Prompts in the Client

```python
class MCPClient:
    async def list_prompts(self):
        result = await self.session.list_prompts()
        return result.prompts
    
    async def get_prompt(self, prompt_name, arguments):
        result = await self.session.get_prompt(prompt_name, arguments)
        return result.messages
```

### Alur:
```
Definisi prompt di server --> Client panggil get_prompt(name, args) --> 
Arguments di-interpolasi ke teks prompt --> 
Return messages array --> Feed langsung ke LLM
```

---

# MODUL 9: ANTHROPIC APPS {#modul-9}

## 9.1 Claude Code

### Definisi:
Asisten coding berbasis terminal yang berfungsi sebagai **engineer kolaboratif** pada proyek.

### Kemampuan:
- Search/read/edit files
- Web fetching, terminal access
- MCP client support
- Git operations (staging, committing)
- Project setup, feature design, testing, deployment, error fixing

### Setup:

```bash
# 1. Install Node.js (cek: npm help)
# 2. Install Claude Code
npm install -g @anthropic-ai/claude-code

# 3. Login
claude

# 4. Di dalam proyek, jalankan init
# Claude scan codebase --> buat claude.md file
```

### Tipe Memory:
- **Project memory** (shared) - claude.md
- **Local memory** - spesifik mesin
- **User memory** - lintas proyek

### 2 Strategi Prompting Efektif:

**Metode 1 - Three-Step Workflow:**
```
1. Identifikasi file relevan, minta Claude analisis
2. Deskripsikan fitur, minta Claude plan solusi (BELUM code!)
3. Minta Claude implementasi plan
```

**Metode 2 - Test-Driven Development:**
```
1. Berikan konteks relevan
2. Minta Claude suggest test untuk fitur
3. Pilih & implementasi test yang dipilih
4. Minta Claude tulis code sampai test pass
```

### Prinsip Inti:
Claude Code = **pengganda effort**. Instruksi lebih detail = hasil JAUH lebih baik!

## 9.2 Enhancements with MCP Servers

### Menambah MCP Server ke Claude Code:

```bash
claude mcp add document-server "uv run main.py"
# Restart Claude Code untuk akses capabilities baru
```

### Use Cases Umum:
- **Sentry** - production monitoring
- **Jira** - project management
- **Slack** - komunikasi
- **Custom tools** - workflow development khusus

## 9.3 Parallelizing Claude Code

### Masalah:
Multiple Claude instances memodifikasi file yang sama bersamaan = **conflict & kode invalid!**

### Solusi: Git Work Trees

```bash
# Buat work tree (salinan lengkap proyek di direktori terpisah)
git worktree add ../feature-auth feature-auth

# Assign task ke Claude instance di work tree tersebut
# Bekerja terisolasi --> commit --> merge kembali ke main
```

### Custom Commands:
```
.claude/commands/new_feature.md:
"Buat work tree baru untuk fitur: $ARGUMENTS
Implementasi fitur tersebut secara lengkap."
```

### Keuntungan:
Satu developer = **virtual team** software engineers!

## 9.4 Automated Debugging

### Workflow:
```
GitHub Action (daily) --> Fetch CloudWatch logs 24 jam terakhir --> 
Claude identifikasi & deduplikasi error --> 
Claude analisis & generate fixes --> 
Buat Pull Request dengan solusi
```

### Komponen:
- **GitHub Actions** untuk scheduling/automation
- **AWS CLI** untuk log retrieval
- **Claude Code** untuk error analysis & code fixes
- **CloudWatch** untuk production error monitoring

## 9.5 Computer Use

### Definisi:
Kemampuan Claude berinteraksi dengan interface komputer melalui **observasi visual dan aksi kontrol**.

### Kemampuan:
- Ambil screenshot
- Click button, ketik teks, navigasi interface
- Ikuti instruksi multi-step secara otonom
- QA testing & automation

### Cara Kerja:
```
Berjalan di Docker container terisolasi -->
User berikan instruksi via chat -->
Claude observasi layar secara visual -->
Claude eksekusi aksi -->
Claude generate laporan
```

### Yang Perlu Dipahami:
- Claude **TIDAK langsung** memanipulasi komputer
- Computer use = **tool system + computing environment** yang disediakan developer
- Anthropic menyediakan **reference implementation** (Docker container dengan kode mouse/keyboard)

---

# MODUL 10: AGENTS AND WORKFLOWS {#modul-10}

## 10.1 Kapan Pakai Workflow vs Agent?

### Aturan Keputusan:

| | Workflow | Agent |
|---|---------|-------|
| **Kapan** | Task jelas, langkah pasti | Task tidak jelas, butuh fleksibilitas |
| **Definisi** | Serangkaian panggilan Claude yang sudah ditentukan | Sistem AI yang membuat rencana sendiri menggunakan tools |
| **Testing** | Mudah (urutan diketahui) | Sulit (path eksekusi tidak terduga) |
| **Success rate** | Tinggi (pendekatan terstruktur) | Lebih rendah (kompleksitas didelegasikan) |
| **User experience** | Butuh input spesifik | Buat input sendiri dari query user |

### Rekomendasi:
**Prioritaskan workflow untuk reliability!** Gunakan agent HANYA ketika fleksibilitas benar-benar dibutuhkan.

> "Users want 100% working products over fancy agents."
> 
> "Solve problems reliably first, innovation second."

## 10.2 Parallelization Workflows

### Konsep:
Pecah **satu task kompleks** jadi beberapa **subtask simultan**, lalu aggregate hasilnya.

```
                    ┌─> [Evaluasi Metal]     ─┐
Input Task ────────>├─> [Evaluasi Polymer]    ─┤──> [Aggregator] ──> Output Final
                    ├─> [Evaluasi Ceramic]    ─┤
                    └─> [Evaluasi Composite]  ─┘
```

### Keuntungan:
- **Fokus** = setiap subtask handle satu analisis spesifik
- **Modularitas** = prompt individual bisa diperbaiki terpisah
- **Skalabilitas** = mudah tambah subtask baru
- **Kualitas** = mengurangi kebingungan dari single prompt yang terlalu kompleks

## 10.3 Chaining Workflows

### Konsep:
Pecah task besar jadi **serangkaian langkah sequential** terpisah.

```
User Input ──> [Search Trending] ──> [Select Topic] ──> [Research] ──> 
[Write Script] ──> [Generate Video] ──> [Post to Social Media]
```

### Kapan Pakai:
Saat Claude **konsisten mengabaikan constraints** di prompt kompleks meskipun diulang.

### Contoh Solusi:
```
Step 1: Kirim prompt awal, terima output imperfect
Step 2: Follow-up prompt minta Claude rewrite berdasarkan violations yang ditemukan
```

## 10.4 Routing Workflows

### Konsep:
Kategorisasi input user untuk menentukan **processing pipeline yang tepat**.

```
User Input ──> [Kategorisasi oleh Claude] ──> "educational"? ──> [Pipeline Edukasi]
                                           ──> "entertainment"? ──> [Pipeline Hiburan]
                                           ──> "business"? ──> [Pipeline Bisnis]
```

### Setiap pipeline punya:
- Prompt template khusus
- Tools spesifik
- Tone dan struktur berbeda

## 10.5 Agents and Tools

### Prinsip Abstraksi Tool:
Berikan tools yang **generik/abstrak**, bukan hyper-specialized!

```
BENAR (Abstrak):
- bash
- web_fetch  
- file_write

SALAH (Specialized):
- refactor_tool
- install_dependencies
```

### Kenapa?
Tools abstrak bisa **dikombinasikan secara kreatif** untuk menyelesaikan berbagai task.

Contoh: `get_current_datetime` + `add_duration` + `set_reminder` bisa menyelesaikan **berbagai** task terkait waktu melalui kombinasi berbeda.

## 10.6 Environment Inspection

### Definisi:
Agent **mengevaluasi lingkungan** dan hasil aksi untuk memahami progress.

### Contoh:
- **Computer use:** Claude ambil screenshot **setelah setiap aksi** untuk lihat perubahan
- **Code editing:** Agent HARUS baca file dulu sebelum memodifikasi
- **Video agent:** Pakai FFmpeg untuk extract screenshot, verifikasi hasil visual

### Manfaat:
Environment inspection memungkinkan agent **mengukur progress**, **deteksi error**, dan **adaptasi** terhadap hasil tak terduga.

---

# FINAL ASSESSMENT GUIDE {#final-assessment}

## Topik yang Perlu Dikuasai untuk Final Assessment:

### 1. API Fundamentals
- [ ] 5 langkah alur API
- [ ] Perbedaan token, embedding, kontekstualisasi
- [ ] Required parameters untuk API request
- [ ] Multi-turn conversation (manual history management)

### 2. Controlling Output
- [ ] System prompts -- fungsi dan implementasi
- [ ] Temperature -- efek 0 vs 1
- [ ] Pre-filling assistant messages
- [ ] Stop sequences
- [ ] Structured data extraction

### 3. Prompt Engineering
- [ ] Clear and direct -- action verbs, first line importance
- [ ] Being specific -- Type A (attributes) vs Type B (steps)
- [ ] XML tags -- kapan dan bagaimana menggunakan
- [ ] Examples -- one-shot vs multi-shot, best practices

### 4. Prompt Evaluation
- [ ] 6-step eval workflow
- [ ] 3 tipe grader (code, model, human)
- [ ] Dataset generation
- [ ] Scoring dan iterasi

### 5. Tool Use
- [ ] Complete tool flow (request --> tool_use --> execute --> tool_result --> response)
- [ ] Tool schemas (JSON Schema format)
- [ ] Multi-turn tool conversations (while loop pattern)
- [ ] Batch tool
- [ ] tool_choice parameter
- [ ] stop_reason == "tool_use"
- [ ] Text edit tool & web search tool

### 6. RAG
- [ ] 3 chunking strategies (size, structure, semantic)
- [ ] Embeddings & cosine similarity
- [ ] Full 7-step RAG flow
- [ ] BM25 lexical search
- [ ] Multi-index pipeline & Reciprocal Rank Fusion
- [ ] Reranking
- [ ] Contextual retrieval

### 7. Claude Features
- [ ] Extended thinking (budget, max_tokens, redacted blocks)
- [ ] Image support (base64, prompting techniques)
- [ ] PDF support
- [ ] Citations (page vs char location)
- [ ] Prompt caching (rules, breakpoints, invalidation)
- [ ] Code execution & Files API

### 8. MCP
- [ ] Architecture (client --> server, tools/resources/prompts)
- [ ] 4 message types (list tools, call tool, request/result)
- [ ] Defining tools with decorators
- [ ] Resources (direct vs templated)
- [ ] Prompts (server-defined templates)
- [ ] Server inspector

### 9. Anthropic Apps
- [ ] Claude Code (setup, 2 prompting methods, parallelization)
- [ ] Automated debugging workflow
- [ ] Computer use (Docker, tool system)

### 10. Agents & Workflows
- [ ] Workflows vs Agents -- kapan pakai masing-masing
- [ ] 3 workflow patterns (parallelization, chaining, routing)
- [ ] Agent tool design (abstract vs specialized)
- [ ] Environment inspection

---

# CHEAT SHEET & QUICK REFERENCE {#cheat-sheet}

## API Request Template

```python
import anthropic
from dotenv import load_dotenv
load_dotenv()

client = anthropic.Anthropic()
model = "claude-sonnet-4-20250514"

response = client.messages.create(
    model=model,
    max_tokens=1000,
    system="System prompt di sini",  # opsional
    temperature=0.7,  # opsional (0-1)
    stop_sequences=["STOP"],  # opsional
    tools=[tool_schema],  # opsional
    tool_choice={"type": "tool", "name": "tool_name"},  # opsional
    stream=True,  # opsional
    messages=[
        {"role": "user", "content": "Pertanyaan user"},
        {"role": "assistant", "content": "Pre-fill"}  # opsional
    ]
)
```

## Tool Schema Template

```python
from anthropic.types import ToolParam

tool_schema = ToolParam({
    "name": "tool_name",
    "description": "Deskripsi 3-4 kalimat",
    "input_schema": {
        "type": "object",
        "properties": {
            "param1": {
                "type": "string",
                "description": "Deskripsi parameter"
            }
        },
        "required": ["param1"]
    }
})
```

## Message Types

```python
# User message
{"role": "user", "content": "teks"}

# Assistant message  
{"role": "assistant", "content": "teks"}

# Tool result (dalam user message)
{
    "type": "tool_result",
    "tool_use_id": "toolu_xxx",
    "content": "hasil JSON string",
    "is_error": False
}
```

## Prompt Engineering Checklist

```
[ ] Baris pertama: Kata kerja aksi + task jelas
[ ] Spesifikasi output (format, panjang, struktur)
[ ] Guidelines (Type A atribut dan/atau Type B langkah)
[ ] XML tags untuk konten yang diinterpolasi
[ ] Contoh (one-shot/multi-shot) dengan reasoning
[ ] Test dengan evaluation pipeline
```

## RAG Pipeline Checklist

```
[ ] Pilih chunking strategy yang sesuai
[ ] Generate embeddings untuk semua chunks
[ ] Simpan di vector database
[ ] Implementasi BM25 untuk hybrid search
[ ] Merge hasil dengan Reciprocal Rank Fusion
[ ] (Opsional) Reranking dengan LLM
[ ] (Opsional) Contextual retrieval
[ ] Assembly prompt dengan chunks relevan
```

## Decision Framework

```
Butuh real-time data?     --> Tool Use
Dokumen besar?            --> RAG
Output terstruktur?       --> Tool + tool_choice ATAU Pre-fill + Stop Seq
Task kompleks, step pasti --> Workflow
Task tidak jelas          --> Agent
Latency penting?          --> Streaming + Haiku
Akurasi penting?          --> Extended Thinking + Opus
Biaya penting?            --> Prompt Caching + Haiku
```

---

## SUMBER BELAJAR

- **Kursus Resmi:** https://anthropic.skilljar.com/claude-with-the-anthropic-api/
- **Dokumentasi API:** https://docs.anthropic.com
- **Claude Code Docs:** https://docs.anthropic.com/claude-code
- **MCP Specification:** https://modelcontextprotocol.io

---

*MASTER SECRET BLUEPRINT - Building with Claude API*
*Dibuat dari materi kursus Anthropic Academy*
*Versi Bahasa Indonesia - Dokumentasi Komprehensif*
