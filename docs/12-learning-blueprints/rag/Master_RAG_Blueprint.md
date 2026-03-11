# Master RAG Blueprint: Retrieval Augmented Generation dengan Claude

**Oleh: Manus AI**

## Pendahuluan

Dokumen ini adalah "Master RAG Blueprint" yang dirancang khusus untuk Anda, GYS, agar dapat menguasai modul "Retrieval Augmented Generation (RAG)" dari kursus "Building with the Claude API" Anthropic Skilljar. Blueprint ini akan membedah setiap aspek RAG, mulai dari konsep dasar hingga teknik-teknik canggih seperti *Contextual Retrieval* dan *BM25*, serta memberikan wawasan untuk menghadapi kuis asesmen. Tujuannya adalah memastikan Anda memiliki pemahaman yang sangat mendalam dan siap untuk membangun aplikasi AI yang cerdas dan faktual dengan Claude.

## Struktur Modul "Retrieval Augmented Generation"

Modul "Retrieval Augmented Generation" mencakup berbagai topik penting yang memungkinkan Claude mengakses dan memanfaatkan informasi eksternal. Berikut adalah sub-topik yang akan kita bahas secara detail:

1.  **Introducing Retrieval Augmented Generation**
2.  **Text Chunking Strategies**
3.  **Text Embeddings**
4.  **The Full RAG Flow**
5.  **Implementing the RAG Flow**
6.  **BM25 Lexical Search**
7.  **A Multi-Index RAG Pipeline**
8.  **Reranking Results**
9.  **Contextual Retrieval**
10. **Quiz on Retrieval Augmented Generation**

## 1. Introducing Retrieval Augmented Generation (RAG)

**Retrieval Augmented Generation (RAG)** adalah sebuah teknik yang memungkinkan model bahasa besar (LLM) seperti Claude untuk mengakses, mengambil, dan memanfaatkan informasi dari sumber data eksternal yang terpisah dari data pelatihannya. Ini mengatasi dua keterbatasan utama LLM tradisional: **keterbatasan pengetahuan** (LLM hanya tahu apa yang ada dalam data pelatihannya hingga tanggal tertentu) dan **potensi halusinasi** (LLM dapat menghasilkan informasi yang terdengar meyakinkan tetapi tidak akurat atau faktual) [1].

Dengan RAG, Claude dapat:

*   **Menjawab pertanyaan dengan informasi terkini**: Misalnya, tentang berita terbaru, harga saham, atau data produk yang terus berubah.
*   **Mengurangi halusinasi**: Karena respons didasarkan pada fakta yang diambil dari sumber terpercaya.
*   **Memberikan atribusi**: Claude dapat menunjukkan dari mana informasi yang digunakannya berasal.
*   **Mengakses data spesifik domain**: Seperti dokumen internal perusahaan, manual teknis, atau basis pengetahuan pribadi.

## 2. Text Chunking Strategies

**Text Chunking** adalah proses membagi dokumen teks yang besar menjadi bagian-bagian yang lebih kecil, atau "chunk". Ini adalah langkah krusial dalam RAG karena LLM dan model embedding memiliki batasan ukuran input. Chunk yang terlalu besar akan melebihi batas token, sementara chunk yang terlalu kecil mungkin kehilangan konteks penting [2].

**Strategi Chunking Umum:**

*   **Fixed-size Chunking**: Membagi teks menjadi chunk dengan jumlah karakter atau token yang tetap. Ini adalah metode yang paling sederhana tetapi mungkin memotong kalimat atau paragraf di tengah.
*   **Paragraph-based Chunking**: Membagi teks berdasarkan batas paragraf. Ini lebih baik dalam mempertahankan koherensi semantik.
*   **Recursive Character Text Splitter**: Metode yang lebih canggih (sering ditemukan di pustaka seperti LangChain) yang mencoba membagi teks berdasarkan pemisah yang berbeda (misalnya, `\n\n`, `\n`, `.`, ` `) secara rekursif hingga chunk mencapai ukuran yang diinginkan. Ini membantu mempertahankan struktur dan konteks semaksimal mungkin [2].

**Overlap (Tumpang Tindih)**: Penting untuk menambahkan sedikit teks dari akhir chunk sebelumnya ke awal chunk berikutnya. Ini membantu memastikan bahwa konteks yang melintasi batas chunk tidak hilang dan meningkatkan kemungkinan pengambilan informasi yang relevan [2].

## 3. Text Embeddings

**Text Embeddings** adalah representasi numerik (vektor) dari teks. Setiap kata, kalimat, atau chunk teks diubah menjadi serangkaian angka yang menangkap makna semantik dari teks tersebut. Teks yang memiliki makna serupa akan memiliki vektor embedding yang "dekat" satu sama lain dalam ruang multidimensi [3].

**Peran dalam RAG:**

*   **Pencarian Semantik**: Ketika pengguna mengajukan pertanyaan, pertanyaan tersebut juga diubah menjadi embedding. Kemudian, sistem mencari embedding chunk yang paling "dekat" dengan embedding pertanyaan di database vektor. Ini memungkinkan pencarian berdasarkan makna, bukan hanya kata kunci.

**Model Embedding**: Claude sendiri tidak menyediakan model embedding. Oleh karena itu, Anda perlu menggunakan layanan eksternal seperti **Voyage AI** atau **OpenAI Embeddings** untuk menghasilkan embedding dari chunk teks Anda [3].

**Penyimpanan**: Embedding yang dihasilkan biasanya disimpan dalam **Vector Database** (juga dikenal sebagai Vector Store), seperti Pinecone, Milvus, Chroma, atau Weaviate. Database ini dioptimalkan untuk pencarian kesamaan vektor yang cepat dan efisien [3].

## 4. The Full RAG Flow

Alur kerja RAG secara keseluruhan dapat dibagi menjadi dua fase utama: **Fase Ingestion (Indeksasi)** dan **Fase Retrieval & Generation (Pencarian & Generasi)** [2].

**Fase Ingestion (Indeksasi Data):**

1.  **Load Data**: Mengambil dokumen dari berbagai sumber (PDF, web, database, dll.).
2.  **Chunking**: Membagi dokumen menjadi chunk-chunk yang lebih kecil.
3.  **Embedding**: Mengubah setiap chunk menjadi vektor embedding menggunakan model embedding.
4.  **Store**: Menyimpan embedding dan metadata terkait (seperti ID dokumen asli, nomor halaman) ke dalam database vektor.

**Fase Retrieval & Generation (Pencarian & Generasi):**

1.  **User Query**: Pengguna mengajukan pertanyaan.
2.  **Query Embedding**: Pertanyaan pengguna diubah menjadi vektor embedding.
3.  **Retrieval**: Database vektor dicari untuk menemukan chunk-chunk yang paling relevan (memiliki embedding terdekat) dengan pertanyaan pengguna.
4.  **Context Augmentation**: Chunk-chunk yang relevan ini kemudian ditambahkan ke prompt pengguna sebagai konteks.
5.  **Generation**: Prompt yang diperkaya konteks ini dikirim ke Claude, yang kemudian menghasilkan jawaban akhir berdasarkan pertanyaan dan konteks yang diberikan.

## 5. Implementing the RAG Flow

Implementasi RAG flow melibatkan penggunaan pustaka Python seperti `langchain` atau `llamaindex` untuk mengelola proses chunking, embedding, dan interaksi dengan database vektor. Kode akan mengalir sesuai dengan fase ingestion dan retrieval & generation yang dijelaskan di atas [2].

**Contoh Langkah Implementasi (Python):**

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import VoyageEmbeddings # atau OpenAIEmbeddings
from langchain_community.vectorstores import Chroma # atau Pinecone, Milvus
from anthropic import Anthropic

# Inisialisasi
client = Anthropic(api_key="YOUR_ANTHROPIC_API_KEY")
embeddings_model = VoyageEmbeddings(voyage_api_key="YOUR_VOYAGE_API_KEY")

# --- Fase Ingestion ---
# 1. Load Data (contoh sederhana)
document_text = "Ini adalah dokumen panjang tentang sejarah AI..."

# 2. Chunking
text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200
)
chunks = text_splitter.split_text(document_text)

# 3. & 4. Embedding & Store
vectorstore = Chroma.from_texts(chunks, embeddings_model)

# --- Fase Retrieval & Generation ---
# 1. User Query
user_question = "Siapa penemu AI?"

# 2. & 3. Query Embedding & Retrieval
retrieved_docs = vectorstore.similarity_search(user_question, k=3)
context = "\n\n".join([doc.page_content for doc in retrieved_docs])

# 4. Context Augmentation & 5. Generation
response = client.messages.create(
    model="claude-3-opus-20240229",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": f"Berdasarkan konteks berikut:\n\n<context>{context}</context>\n\nJawab pertanyaan ini: {user_question}"
        }
    ]
)
print(response.content[0].text)
```

## 6. BM25 Lexical Search

**BM25 (Best Match 25)** adalah algoritma pencarian leksikal (berbasis kata kunci) yang sangat efektif. Berbeda dengan pencarian semantik yang menggunakan embedding, BM25 mencari dokumen berdasarkan frekuensi dan posisi kata kunci dalam dokumen. Ini sangat berguna untuk [4]:

*   **Pencarian istilah teknis atau nama entitas**: Di mana makna semantik mungkin kurang penting dibandingkan keberadaan kata kunci yang tepat.
*   **Melengkapi pencarian semantik**: Dalam sistem RAG hibrida, BM25 dapat menangkap relevansi yang mungkin terlewatkan oleh embedding.

**Implementasi**: Pustaka seperti `rank_bm25` di Python dapat digunakan untuk mengimplementasikan BM25. Hasilnya kemudian dapat digabungkan dengan hasil pencarian vektor.

## 7. A Multi-Index RAG Pipeline

**Multi-Index RAG Pipeline** adalah arsitektur RAG yang menggunakan beberapa indeks atau database vektor, seringkali untuk jenis data yang berbeda atau untuk mengoptimalkan strategi pengambilan. Misalnya, satu indeks untuk dokumen umum dan indeks lain untuk data terstruktur atau FAQ [2].

**Manfaat:**

*   **Fleksibilitas**: Dapat menangani berbagai jenis data dan pertanyaan.
*   **Peningkatan Akurasi**: Dengan menargetkan pencarian ke indeks yang paling relevan.
*   **Hybrid Search**: Menggabungkan hasil dari pencarian semantik (embedding) dan pencarian leksikal (BM25) untuk mendapatkan cakupan relevansi yang lebih luas. Hasil dari kedua metode ini kemudian digabungkan dan seringkali melewati tahap *reranking*.

## 8. Reranking Results

Setelah melakukan pencarian (baik semantik, leksikal, atau hibrida), Anda mungkin mendapatkan banyak chunk yang relevan. **Reranking** adalah proses mengurutkan ulang hasil pencarian ini untuk memastikan bahwa chunk yang paling relevan dan informatif ditempatkan di posisi teratas. Ini sangat penting karena LLM memiliki "bias posisi"—mereka cenderung lebih memperhatikan informasi yang muncul di awal konteks [2].

**Cara Kerja:**

*   Model reranker (misalnya, dari Cohere atau BGE) mengambil pertanyaan pengguna dan daftar chunk yang diambil.
*   Model ini kemudian menilai setiap chunk berdasarkan relevansinya dengan pertanyaan, menghasilkan skor.
*   Chunk diurutkan ulang berdasarkan skor ini, dan hanya chunk dengan skor tertinggi yang diteruskan ke Claude.

## 9. Contextual Retrieval (Teknik Khusus Anthropic)

**Contextual Retrieval** adalah teknik inovatif yang diperkenalkan oleh Anthropic untuk mengatasi masalah hilangnya konteks dalam chunking. Seringkali, chunk teks yang kecil mungkin tidak memiliki cukup konteks mandiri untuk dipahami sepenuhnya oleh model embedding atau LLM [1].

**Masalah yang Diatasi**: Jika sebuah chunk berisi kalimat seperti "Ia kemudian pergi ke sana", tanpa konteks dari kalimat sebelumnya, model tidak akan tahu siapa "ia" atau di mana "sana".

**Solusi Anthropic**: Anthropic menyarankan untuk memperkaya setiap chunk dengan "konteks singkat" atau "header kontekstual" yang relevan sebelum di-embedding. Konteks ini bisa berupa judul dokumen, ringkasan paragraf sebelumnya, atau bahkan ringkasan yang dihasilkan oleh Claude sendiri [1].

**Contoh Implementasi (Konseptual):**

1.  **Generate Contextual Header**: Untuk setiap chunk, gunakan Claude (atau LLM lain yang lebih kecil) untuk menghasilkan ringkasan singkat atau judul yang menangkap esensi chunk tersebut dan konteks sekitarnya.
2.  **Combine & Embed**: Gabungkan contextual header dengan chunk asli, lalu hasilkan embedding dari gabungan teks ini.
3.  **Retrieval**: Saat pencarian, embedding pertanyaan akan dicocokkan dengan embedding yang diperkaya konteks ini, menghasilkan pengambilan yang lebih akurat karena setiap chunk membawa "memori" konteksnya sendiri [1].

Teknik ini secara signifikan meningkatkan presisi pengambilan dan mengurangi kesalahan yang disebabkan oleh hilangnya konteks.

## 10. Quiz on Retrieval Augmented Generation (Prediksi Topik & Contoh Pertanyaan)

Bagian ini akan mencakup prediksi topik-topik yang mungkin muncul dalam kuis "Retrieval Augmented Generation" dan contoh pertanyaan untuk membantu Anda mempersiapkan diri. Berdasarkan materi yang telah dibahas, fokus utama kuis kemungkinan besar akan berada pada pemahaman konsep, komponen, dan teknik optimasi RAG.

**Topik Kunci untuk Kuis:**

*   **Definisi dan Tujuan RAG**: Apa itu RAG dan mengapa penting untuk LLM?
*   **Fase RAG**: Perbedaan antara fase Ingestion dan Retrieval & Generation.
*   **Strategi Chunking**: Pentingnya ukuran chunk, overlap, dan berbagai metode chunking.
*   **Text Embeddings**: Peran embedding, model yang digunakan (eksternal), dan penyimpanan (vector database).
*   **BM25**: Perbedaan antara pencarian leksikal dan semantik, serta kapan menggunakan BM25.
*   **Hybrid Search**: Konsep menggabungkan pencarian semantik dan leksikal.
*   **Reranking**: Mengapa reranking diperlukan dan bagaimana cara kerjanya.
*   **Contextual Retrieval Anthropic**: Masalah yang dipecahkan, cara kerja, dan manfaatnya.

**Contoh Pertanyaan Kuis (Prediksi):**

1.  Manakah dari berikut ini yang merupakan alasan utama penggunaan Retrieval Augmented Generation (RAG) dengan LLM seperti Claude?
    a) Untuk meningkatkan kecepatan pelatihan model.
    b) Untuk membatasi akses model ke internet.
    c) Untuk memberikan informasi terkini dan mengurangi halusinasi model.
    d) Untuk membuat model lebih kreatif dalam menghasilkan teks.

2.  Apa tujuan dari "overlap" dalam strategi text chunking?
    a) Untuk membuat chunk lebih pendek.
    b) Untuk memastikan konteks tidak terputus di antara chunk yang berdekatan.
    c) Untuk mengurangi jumlah embedding yang perlu disimpan.
    d) Untuk mempercepat proses embedding.

3.  Model embedding biasanya digunakan untuk...
    a) Melakukan pencarian kata kunci (lexical search).
    b) Mengubah teks menjadi representasi numerik untuk pencarian semantik.
    c) Menghasilkan teks baru berdasarkan prompt.
    d) Mengidentifikasi entitas dalam teks.

4.  Teknik "Contextual Retrieval" yang diperkenalkan oleh Anthropic bertujuan untuk mengatasi masalah apa?
    a) Keterbatasan ukuran jendela konteks LLM.
    b) Hilangnya konteks dalam chunk teks yang kecil.
    c) Biaya tinggi dari model embedding.
    d) Kesulitan dalam mengimplementasikan BM25.

5.  Dalam pipeline RAG, apa peran dari "reranking"?
    a) Untuk mengubah urutan pertanyaan pengguna.
    b) Untuk mengurutkan ulang chunk yang diambil agar yang paling relevan berada di posisi teratas.
    c) Untuk menggabungkan hasil dari beberapa model embedding.
    d) Untuk menghapus chunk yang duplikat.

## Kesimpulan

Dengan "Master RAG Blueprint" ini, Anda kini memiliki panduan lengkap untuk menaklukkan modul "Retrieval Augmented Generation" dengan Claude. RAG adalah fondasi penting untuk membangun aplikasi AI yang cerdas, faktual, dan dapat diandalkan. Ingatlah bahwa praktik adalah kunci. Eksperimenlah dengan berbagai strategi chunking, model embedding, dan teknik pengambilan. Semakin Anda berlatih, semakin mahir Anda dalam memanfaatkan kekuatan RAG untuk menciptakan aplikasi AI yang luar biasa. Selamat belajar dan semoga sukses dalam mendapatkan sertifikasi Anda, GYS!

## Referensi

[1] Anthropic. (n.d.). *Contextual Retrieval in AI Systems*. Anthropic News. Retrieved from [https://www.anthropic.com/news/contextual-retrieval](https://www.anthropic.com/news/contextual-retrieval)
[2] Anthropic. (n.d.). *Enhancing RAG with contextual retrieval*. Claude API Cookbook. Retrieved from [https://platform.claude.com/cookbook/capabilities-contextual-embeddings-guide](https://platform.claude.com/cookbook/capabilities-contextual-embeddings-guide)
[3] Siddique, A. (n.d.). *Building Production RAG with Anthropic's Contextual Retrieval*. Medium. Retrieved from [https://medium.com/@aminsiddique95/building-production-rag-with-anthropics-contextual-retrieval-complete-python-implementation-f8a436095860](https://medium.com/@aminsiddique95/building-production-rag-with-anthropics-contextual-retrieval-complete-python-implementation-f8a436095860)
[4] Datacamp. (n.d.). *Anthropic's Contextual Retrieval: A Guide With Implementation*. Retrieved from [https://www.datacamp.com/tutorial/contextual-retrieval-anthropic](https://www.datacamp.com/tutorial/contextual-retrieval-anthropic)
