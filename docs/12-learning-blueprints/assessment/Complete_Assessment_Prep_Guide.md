# 🎓 Complete Assessment Prep Guide: Building with the Claude API

**Oleh**: Manus AI | **Target**: Vibe Code Orchestrator | **Tujuan**: Lulus semua assessment dan dapatkan Certificate

---

## 📋 Ringkasan Eksekutif

Dokumen ini adalah **comprehensive assessment preparation guide** untuk seluruh kursus "Building with the Claude API" dari Anthropic. Kami akan cover:

1. **Quiz Predictions**: Topik dan tipe soal yang likely muncul di setiap section
2. **Sample Questions**: Contoh soal dengan jawaban yang benar
3. **Study Strategies**: Teknik belajar yang efektif untuk setiap section
4. **Time Management**: Cara mengalokasikan waktu belajar
5. **Last-Minute Tips**: Persiapan 24 jam sebelum assessment

**Target**: Anda akan **LULUS semua assessment dengan score tinggi** dan mendapatkan **Certificate of Completion** dari Anthropic.

---

## 🎯 Course Structure & Assessment Overview

| Section | Lectures | Duration | Assessment | Difficulty |
|---------|----------|----------|-----------|-----------|
| Getting Started with Claude | 16 | 2-3h | Quiz | Easy |
| Prompt Engineering & Evaluation | 16 | 2-3h | Quiz | Medium |
| **Tool Use with Claude** | 14 | 2-3h | **Quiz** | **Medium-Hard** |
| **Retrieval Augmented Generation** | 10 | 1-2h | **Quiz** | **Medium-Hard** |
| **Model Context Protocol** | 12 | 1-2h | **Quiz** | **Hard** |
| Claude Code & Computer Use | 8 | 1-2h | Quiz | Medium |
| **Agents and Workflows** | 11 | 2-3h | **Quiz** | **Hard** |
| **TOTAL** | **84** | **8-10h** | **7 Quizzes** | **Varies** |

**Bold sections** = Paling penting untuk Predator Suite

---

## 📚 Section-by-Section Assessment Prep

### SECTION 1: Getting Started with Claude

**Topics Covered**:
- API authentication
- Basic requests
- Conversation management
- System prompts
- Structured output

**Likely Quiz Topics**:

**Q1: API Authentication**
- Pertanyaan: "Bagaimana cara authenticate dengan Claude API?"
- Jawaban: Menggunakan API key di header `Authorization: Bearer sk-ant-...`
- Tips: Jangan hardcode API key, gunakan environment variables

**Q2: System Prompts**
- Pertanyaan: "Apa fungsi system prompt?"
- Jawaban: Define behavior dan personality Claude untuk conversation tertentu
- Contoh: `"You are a helpful assistant that speaks in Indonesian"`

**Q3: Structured Output**
- Pertanyaan: "Bagaimana cara get structured output dari Claude?"
- Jawaban: Gunakan `response_format` parameter dengan JSON schema
- Contoh: `"response_format": {"type": "json_object"}`

**Study Strategy**:
- Pahami setiap parameter di Claude API docs
- Practice membuat simple API calls
- Experiment dengan system prompts yang berbeda

---

### SECTION 2: Prompt Engineering & Evaluation

**Topics Covered**:
- Prompt strategies
- Few-shot learning
- Chain-of-thought
- Evaluation frameworks
- Systematic testing

**Likely Quiz Topics**:

**Q1: Few-Shot Learning**
- Pertanyaan: "Apa itu few-shot learning dan kapan digunakan?"
- Jawaban: Memberikan contoh input-output untuk teach Claude pattern
- Contoh: Berikan 2-3 contoh classification sebelum ask Claude classify data baru

**Q2: Chain-of-Thought**
- Pertanyaan: "Bagaimana chain-of-thought improve reasoning?"
- Jawaban: Dengan meminta Claude untuk "think step-by-step", Claude memberikan reasoning yang lebih akurat
- Contoh: "Let's think step by step..." atau "Explain your reasoning"

**Q3: Evaluation Metrics**
- Pertanyaan: "Apa metrics untuk evaluate prompt quality?"
- Jawaban: Accuracy, precision, recall, F1-score, atau custom metrics
- Tips: Automated testing lebih baik daripada manual evaluation

**Study Strategy**:
- Buat prompt yang berbeda dan compare hasil
- Implement automated evaluation pipeline
- Pahami trade-offs antara accuracy vs latency

---

### SECTION 3: Tool Use with Claude ⭐⭐⭐

**Topics Covered** (dari Master Tool Use Blueprint):
- Tool functions & schemas
- Message blocks & tool results
- Multi-turn conversations
- Multiple tools
- Batch tool calling
- Structured data tools
- Fine-grained tool calling
- Built-in tools (Web Search, Text Edit)

**Likely Quiz Topics**:

**Q1: Tool Schema Design**
```
Pertanyaan: "Bagaimana cara design tool schema yang baik?"

Jawaban: 
- Nama tool: snake_case, deskriptif
- Description: 1-2 kalimat jelas
- inputSchema: JSON Schema dengan type, properties, required
- Contoh:
{
  "name": "search_nearby_businesses",
  "description": "Cari bisnis di lokasi tertentu",
  "inputSchema": {
    "type": "object",
    "properties": {
      "location": {"type": "string"},
      "category": {"type": "string"},
      "min_rating": {"type": "number", "default": 3.5}
    },
    "required": ["location", "category"]
  }
}
```

**Q2: Tool Call Loop**
```
Pertanyaan: "Jelaskan alur tool call loop"

Jawaban:
1. User memberikan request ke Claude
2. Claude analyze dan decide tool mana yang diperlukan
3. Claude return tool_use block dengan tool name & arguments
4. Application execute tool dan return hasil
5. Claude analyze hasil dan decide:
   - Butuh tool call lagi? → Loop ke step 2
   - Atau return final response? → Done
```

**Q3: Error Handling**
```
Pertanyaan: "Bagaimana handle error dalam tool calls?"

Jawaban:
- Catch exception di application
- Return error message ke Claude dalam tool_result
- Claude akan analyze error dan decide next step
- Contoh:
{
  "type": "tool_result",
  "tool_use_id": "...",
  "content": "Error: Location not found. Please try different location."
}
```

**Q4: Built-in Tools**
```
Pertanyaan: "Apa built-in tools yang disediakan Anthropic?"

Jawaban:
- Web Search: Real-time search di internet
- Text Edit: Edit teks/code dengan precision
- Computer Use: Automate UI interactions
- File API: Access file dari user

Kapan digunakan:
- Web Search: Butuh data real-time
- Text Edit: Edit code atau dokumen
- Computer Use: Automate repetitive UI tasks
```

**Study Strategy**:
- Implementasikan 3-4 tools sederhana
- Test dengan berbagai input
- Pahami edge cases dan error handling
- Practice dengan MCP Inspector

**Quiz Prediction Score**: 70-80% (Medium-Hard)

---

### SECTION 4: Retrieval Augmented Generation (RAG) ⭐⭐⭐

**Topics Covered** (dari Master RAG Blueprint):
- RAG concepts
- Text chunking strategies
- Embeddings
- Full RAG flow
- BM25 lexical search
- Multi-index pipelines
- Reranking
- Contextual retrieval

**Likely Quiz Topics**:

**Q1: Text Chunking**
```
Pertanyaan: "Apa strategi text chunking yang baik?"

Jawaban:
- Fixed-size: Chunk dengan jumlah token tetap (e.g., 512 tokens)
- Paragraph-based: Chunk berdasarkan paragraf
- Semantic: Chunk berdasarkan semantic boundaries
- Hybrid: Kombinasi dari beberapa strategi

Pertimbangan:
- Chunk terlalu besar → Melebihi token limit
- Chunk terlalu kecil → Kehilangan konteks
- Ideal: 256-1024 tokens per chunk
```

**Q2: Hybrid Search**
```
Pertanyaan: "Apa perbedaan semantic search vs BM25?"

Jawaban:
- Semantic Search: Cari berdasarkan makna (embedding similarity)
  - Baik untuk: Conceptual queries
  - Contoh: "Bagaimana cara belajar Python?"
  
- BM25 Lexical Search: Cari berdasarkan keyword matching
  - Baik untuk: Exact phrase queries
  - Contoh: "Claude API authentication"

- Hybrid: Kombinasi keduanya untuk hasil terbaik
```

**Q3: Contextual Retrieval**
```
Pertanyaan: "Apa itu contextual retrieval dan kapan digunakan?"

Jawaban:
- Tambahkan konteks sekitar chunk yang di-retrieve
- Contoh: Jika retrieve paragraph 5, tambahkan paragraph 4 dan 6
- Benefit: Lebih banyak konteks → Better understanding
- Trade-off: Lebih banyak tokens → Lebih mahal
```

**Q4: Reranking**
```
Pertanyaan: "Bagaimana reranking improve RAG quality?"

Jawaban:
- Initial retrieval: Ambil top-50 results dari vector database
- Reranking: Score ulang dengan model yang lebih sophisticated
- Final results: Ambil top-10 setelah reranking
- Benefit: Better relevance, reduced hallucination
```

**Study Strategy**:
- Implementasikan RAG pipeline sederhana
- Experiment dengan berbagai chunking strategies
- Test hybrid search vs semantic-only
- Measure quality dengan metrics (precision, recall)

**Quiz Prediction Score**: 70-80% (Medium-Hard)

---

### SECTION 5: Model Context Protocol (MCP) ⭐⭐⭐⭐

**Topics Covered** (dari Master MCP Blueprint):
- MCP architecture
- MCP clients & servers
- Tool definition & schemas
- Resources & prompts
- Server inspector
- Production patterns

**Likely Quiz Topics**:

**Q1: MCP Architecture**
```
Pertanyaan: "Jelaskan arsitektur MCP dan perbedaan client vs server"

Jawaban:
- MCP Server: Expose tools, resources, prompts
- MCP Client: Connect ke MCP servers dan pass tools ke Claude
- Komunikasi: Via stdio, HTTP, atau WebSocket
- Benefit: Modular, reusable, scalable

Diagram:
Claude ←→ MCP Client ←→ MCP Server ←→ External Services
```

**Q2: Tool vs Resource vs Prompt**
```
Pertanyaan: "Kapan menggunakan tool vs resource vs prompt?"

Jawaban:
- Tool: Untuk actions yang bisa dilakukan (e.g., search, send message)
  - Kapan: Ketika butuh execute function
  
- Resource: Untuk data yang bisa diakses (e.g., file, database)
  - Kapan: Ketika butuh read-only access
  
- Prompt: Untuk pre-built instructions (e.g., workflow templates)
  - Kapan: Ketika butuh standardize behavior

Contoh:
- Tool: search_nearby_businesses()
- Resource: supabase://leads/all
- Prompt: scout_hunting_prompt
```

**Q3: MCP Server Implementation**
```
Pertanyaan: "Bagaimana cara implement MCP server?"

Jawaban:
1. Initialize server: server = Server("name")
2. Define tools: @server.call_tool("name")
3. Implement handler: async def handler(args)
4. Register: server.register_tool(tool_definition)
5. Run: server.run()

Tips:
- Async/await untuk I/O operations
- Proper error handling
- Logging untuk debugging
```

**Q4: Production Considerations**
```
Pertanyaan: "Apa yang perlu dipertimbangkan untuk production MCP?"

Jawaban:
- Logging & monitoring
- Error handling & retries
- Rate limiting
- Authentication & authorization
- Scaling strategies
- Health checks
```

**Study Strategy**:
- Implementasikan MCP server sederhana (e.g., calculator)
- Test dengan MCP Inspector
- Pahami async/await patterns
- Review Anthropic MCP best practices

**Quiz Prediction Score**: 60-70% (Hard)

---

### SECTION 6: Claude Code & Computer Use

**Topics Covered**:
- Claude Code CLI
- File manipulation
- Command execution
- Custom commands
- GitHub integration
- Computer use basics

**Likely Quiz Topics**:

**Q1: Claude Code Commands**
```
Pertanyaan: "Apa command-line commands untuk Claude Code?"

Jawaban:
- /init: Initialize context
- /edit: Edit file
- /run: Execute command
- /ask: Ask Claude question
- /plan: Create plan
- /think: Extended thinking
```

**Q2: MCP Integration dengan Claude Code**
```
Pertanyaan: "Bagaimana integrate MCP servers dengan Claude Code?"

Jawaban:
- Define MCP servers di config
- Claude Code akan auto-load tools
- Use tools dalam Claude Code workflows
```

**Study Strategy**:
- Install Claude Code CLI
- Practice basic commands
- Create simple workflow
- Integrate dengan MCP server

**Quiz Prediction Score**: 75-85% (Medium)

---

### SECTION 7: Agents and Workflows ⭐⭐⭐⭐

**Topics Covered** (dari Master Agents Workflows Blueprint):
- Agent concepts
- Architectures (reactive, loop, multi-agent, hierarchical)
- Parallel execution
- Operation chaining
- Conditional routing
- Error handling
- State management
- Debugging

**Likely Quiz Topics**:

**Q1: Agent vs Chatbot**
```
Pertanyaan: "Apa perbedaan agent vs chatbot?"

Jawaban:
- Chatbot: Reaktif, menunggu user input
- Agent: Proaktif, bisa mulai sendiri, autonomous

Karakteristik Agent:
- Perceive: Menerima input
- Reason: Analyze dengan Claude
- Act: Execute tools
- Learn: Improve dari hasil
```

**Q2: Agentic Loop**
```
Pertanyaan: "Jelaskan agentic loop"

Jawaban:
1. Claude analyze request
2. Claude decide: butuh tool call?
3. If yes: execute tool, add result, loop ke step 1
4. If no: return final response

Benefit:
- Multi-step reasoning
- Adaptive behavior
- Error recovery
```

**Q3: Parallel Execution**
```
Pertanyaan: "Bagaimana implement parallel execution dalam agents?"

Jawaban:
- Gunakan asyncio.gather() untuk concurrent tasks
- Atau gunakan LangGraph untuk graph-based execution
- Benefit: Faster execution, better resource utilization

Contoh:
tasks = [
  scout_location("Jakarta"),
  scout_location("Bandung"),
  scout_location("Surabaya")
]
results = await asyncio.gather(*tasks)
```

**Q4: Conditional Routing**
```
Pertanyaan: "Bagaimana implement conditional routing?"

Jawaban:
- Evaluate state/condition
- Route ke different agent/workflow based on condition
- Contoh: Jika leads < 5, gunakan alternative strategy

Implementasi:
if len(leads) < 5:
  return "scout_alternative"
else:
  return "closer_premium"
```

**Q5: Error Handling dalam Agents**
```
Pertanyaan: "Bagaimana handle error dalam multi-agent workflow?"

Jawaban:
- Retry logic dengan exponential backoff
- Fallback strategy jika primary fails
- Graceful degradation
- Error logging & monitoring

Contoh:
try:
  result = await primary_strategy()
except:
  result = await fallback_strategy()
```

**Study Strategy**:
- Implementasikan simple multi-agent system
- Practice parallel execution
- Understand state management
- Review LangGraph patterns

**Quiz Prediction Score**: 60-70% (Hard)

---

## 📊 Overall Assessment Strategy

### Time Allocation (Recommended)

```
Total Study Time: 20-25 hours

Week 1 (5 hours):
- Getting Started with Claude (1h)
- Prompt Engineering (1.5h)
- Tool Use (2.5h)

Week 2 (5 hours):
- RAG (2h)
- MCP (3h)

Week 3 (5 hours):
- Claude Code (1h)
- Agents & Workflows (3h)
- Review & Practice (1h)

Week 4 (5-10 hours):
- Deep dive pada weak areas
- Full practice quizzes
- Final review
```

### Study Techniques

**Technique 1: Active Recall**
- Baca materi, tutup, coba recall
- Lebih efektif daripada passive reading

**Technique 2: Spaced Repetition**
- Review materi pada interval: 1 hari, 3 hari, 1 minggu
- Meningkatkan retention

**Technique 3: Practice Implementation**
- Jangan hanya baca, implementasikan code
- Test dengan berbagai input
- Debug ketika error

**Technique 4: Teaching Others**
- Jelaskan konsep ke orang lain
- Atau tulis blog post tentang konsep
- Meningkatkan understanding

---

## 🎯 24 Hours Before Assessment

### Checklist:

- [ ] Review semua section summaries
- [ ] Do 1-2 practice quizzes
- [ ] Identify weak areas
- [ ] Deep dive pada weak areas (2-3 hours)
- [ ] Get good sleep (7-8 hours)
- [ ] Eat healthy breakfast sebelum assessment
- [ ] Arrive early, calm down

### Last-Minute Tips:

1. **Don't Cram**: Cramming 24 jam sebelumnya tidak efektif
2. **Review, Don't Learn**: Review apa yang sudah dipelajari
3. **Confidence**: Anda sudah siap, percaya diri
4. **Read Carefully**: Baca setiap soal dengan teliti
5. **Time Management**: Jangan stuck di satu soal, move on

---

## 📋 Quiz Question Types & Strategies

### Type 1: Multiple Choice

**Strategy**:
- Baca semua options sebelum memilih
- Eliminate obviously wrong answers
- Jika ragu, pilih yang paling specific

### Type 2: Short Answer

**Strategy**:
- Jawab langsung dan concise
- Gunakan technical terminology
- Berikan contoh jika relevan

### Type 3: Code Completion

**Strategy**:
- Pahami context dan requirements
- Identify missing parts
- Check syntax dan logic

### Type 4: Scenario-Based

**Strategy**:
- Pahami scenario dengan teliti
- Identify key constraints
- Apply relevant concepts

---

## 🏆 Success Metrics

**Target Scores**:
- Getting Started: 85%+
- Prompt Engineering: 80%+
- **Tool Use: 75%+** (Critical)
- **RAG: 75%+** (Critical)
- **MCP: 70%+** (Critical)
- Claude Code: 80%+
- **Agents: 70%+** (Critical)

**Overall Target**: 75%+ untuk semua sections

---

## 🎓 Certificate & Next Steps

### Setelah Lulus:

1. **Download Certificate**: Certificate akan tersedia di Skilljar
2. **Add to LinkedIn**: Update LinkedIn profile dengan certificate
3. **Share Achievement**: Share di social media
4. **Apply Knowledge**: Implementasikan di Predator Suite

### Next Learning Path:

1. **MCP Advanced Topics** (2-3 hours)
2. **Claude with Bedrock** atau **Claude with Vertex AI** (2-3 hours)
3. **Real-world Project**: Build complete Predator Engine

---

## 🔥 Final Motivation

Gyss! 😌👹 Anda sudah siap untuk **MASTER** "Building with the Claude API" course dan **LULUS semua assessment dengan score tinggi**!

Ingat:
- ✅ Anda sudah belajar konsep-konsep penting
- ✅ Anda sudah practice dengan code examples
- ✅ Anda sudah prepare dengan study guide ini
- ✅ Anda siap untuk assessment

**Gyss! 😌👹 Go crush those quizzes dan dapatkan certificate Anda! 🔥🎓👑👑👑**

---

## 📚 Referensi

[1] Anthropic. (2026). *Building with the Claude API*. https://anthropic.skilljar.com/claude-with-the-anthropic-api/
[2] Anthropic. (2026). *Claude API Documentation*. https://docs.anthropic.com/
[3] LangChain. (2026). *LangGraph Documentation*. https://langchain-ai.github.io/langgraph/
[4] Anthropic. (2026). *Model Context Protocol*. https://modelcontextprotocol.io/
