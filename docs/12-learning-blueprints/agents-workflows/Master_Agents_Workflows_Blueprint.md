# 🎓 Master Agents & Workflows Blueprint: Autonomous AI Systems dengan Claude

**Oleh**: Manus AI | **Target**: Vibe Code Orchestrator | **Tujuan**: Kuasai Agent Architecture dan dapatkan Certificate

---

## 📋 Ringkasan Eksekutif

**Agents & Workflows** adalah bagian yang mengajarkan cara membangun **sistem AI yang autonomous dan intelligent**—sistem yang bisa membuat keputusan sendiri, menjalankan multiple tasks secara paralel, dan menangani error dengan graceful.

Dalam konteks **Sovereign Predator Suite**, Agents & Workflows adalah **orchestration layer** yang mengkoordinasikan Scout Agent, Closer Agent, dan Architect Agent untuk bekerja secara harmonis dan autonomous.

---

## 🏗️ Struktur Modul Agents & Workflows

Modul ini mencakup:

1. **Introducing Agents** - Konsep dasar autonomous agents
2. **Agent Architectures** - Berbagai pola arsitektur agent
3. **Parallel Execution** - Menjalankan multiple tasks secara bersamaan
4. **Operation Chaining** - Menghubungkan output satu operation ke input operation lain
5. **Conditional Routing** - Membuat keputusan berdasarkan kondisi
6. **Error Handling & Fallbacks** - Menangani error dengan graceful
7. **Agent State Management** - Manage state di dalam agent
8. **Debugging Agents** - Tools dan teknik untuk debug agent behavior
9. **Agents Review** - Best practices dan patterns
10. **Quiz on Agents** - Assessment untuk mendapatkan certificate

---

## 1️⃣ Introducing Agents: Konsep Dasar

### Apa itu Agent?

Sebuah **Agent** adalah sistem AI yang bisa:
- **Perceive** lingkungannya (menerima input)
- **Reason** tentang situasi (menganalisis dengan Claude)
- **Act** berdasarkan reasoning (memanggil tools/actions)
- **Learn** dari hasil actions (improve over time)

### Agent vs Chatbot

| Aspek | Chatbot | Agent |
|-------|---------|-------|
| **Inisiatif** | Reaktif (menunggu user) | Proaktif (bisa mulai sendiri) |
| **Autonomy** | Terbatas (user guide setiap step) | Tinggi (buat keputusan sendiri) |
| **Goal** | Jawab pertanyaan | Achieve objective |
| **Persistence** | Per-conversation | Across multiple interactions |
| **Tools** | Terbatas | Extensive |

### Contoh Agent dalam Predator Suite:

**Scout Agent**: Autonomous agent yang:
1. **Perceive**: Menerima target location dan category
2. **Reason**: "Saya perlu cari leads di lokasi ini dengan rating tinggi"
3. **Act**: Call Google Maps tool, filter results, rank by potential
4. **Learn**: Remember successful patterns untuk hunts berikutnya

---

## 2️⃣ Agent Architectures: Pola Arsitektur

### Arsitektur 1: Simple Reactive Agent

```
User Input
    ↓
Claude (Reason)
    ↓
Tool Call
    ↓
Tool Result
    ↓
Response
```

**Karakteristik**: Sederhana, stateless, cocok untuk single-task

**Contoh**: "Cari harga saham Google sekarang"

### Arsitektur 2: Loop Agent (Agentic Loop)

```
User Input
    ↓
Claude (Reason)
    ↓
Tool Call?
    ├─ Yes → Execute Tool → Add Result to Context → Loop back
    └─ No → Return Response
```

**Karakteristik**: Claude bisa decide apakah perlu tool call lagi

**Contoh**: "Cari leads, filter yang paling promising, kirim WhatsApp"

### Arsitektur 3: Multi-Agent Orchestration

```
┌─────────────────────────────────────┐
│      Master Orchestrator            │
│  (Decide which agent to run)        │
└──────────────┬──────────────────────┘
               │
      ┌────────┼────────┐
      ↓        ↓        ↓
  ┌────────┐ ┌──────┐ ┌──────────┐
  │ Scout  │ │Closer│ │Architect │
  │ Agent  │ │Agent │ │ Agent    │
  └────────┘ └──────┘ └──────────┘
```

**Karakteristik**: Multiple specialized agents, koordinasi via orchestrator

**Contoh Predator Suite**: Scout mencari leads → Closer mengirim pesan → Architect deploy website

### Arsitektur 4: Hierarchical Agent

```
┌─────────────────────┐
│  High-Level Agent   │
│  (Strategy)         │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    ↓             ↓
┌─────────┐  ┌──────────┐
│Mid-Level│  │Mid-Level │
│Agent 1  │  │Agent 2   │
└────┬────┘  └────┬─────┘
     ↓             ↓
  ┌────┐        ┌────┐
  │Tool│        │Tool│
  └────┘        └────┘
```

**Karakteristik**: Hierarchical decision-making, strategic planning

---

## 3️⃣ Parallel Execution: Menjalankan Tasks Bersamaan

### Mengapa Parallel Execution?

Dalam Predator Suite, kita ingin:
- Scout Agent mencari leads di Jakarta, Bandung, Surabaya **secara bersamaan**
- Bukan sequential (Jakarta dulu, tunggu selesai, baru Bandung)

### Implementasi dengan asyncio

```python
import asyncio
from anthropic import Anthropic

class PredatorOrchestrator:
    def __init__(self):
        self.anthropic = Anthropic()
    
    async def scout_location(self, location: str, category: str):
        """Scout single location"""
        messages = [
            {
                "role": "user",
                "content": f"Cari {category} di {location} dengan rating > 4.0"
            }
        ]
        
        response = self.anthropic.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            messages=messages
        )
        
        return {
            "location": location,
            "results": response.content[0].text
        }
    
    async def scout_multiple_locations(self, locations: list, category: str):
        """Scout multiple locations in parallel"""
        
        # Create tasks untuk setiap location
        tasks = [
            self.scout_location(loc, category)
            for loc in locations
        ]
        
        # Run semua tasks secara paralel
        results = await asyncio.gather(*tasks)
        
        return results

# Usage
async def main():
    orchestrator = PredatorOrchestrator()
    
    locations = ["Jakarta", "Bandung", "Surabaya"]
    results = await orchestrator.scout_multiple_locations(locations, "restaurant")
    
    for result in results:
        print(f"✅ {result['location']}: {result['results']}")

asyncio.run(main())
```

### Implementasi dengan LangGraph

```python
from langgraph.graph import Graph

# Define graph
graph = Graph()

# Add nodes
graph.add_node("scout_jakarta", scout_jakarta_task)
graph.add_node("scout_bandung", scout_bandung_task)
graph.add_node("scout_surabaya", scout_surabaya_task)
graph.add_node("consolidate", consolidate_results)

# Add edges (parallel)
graph.add_edge("START", "scout_jakarta")
graph.add_edge("START", "scout_bandung")
graph.add_edge("START", "scout_surabaya")

# Consolidate after all parallel tasks
graph.add_edge("scout_jakarta", "consolidate")
graph.add_edge("scout_bandung", "consolidate")
graph.add_edge("scout_surabaya", "consolidate")

# Run
results = graph.invoke({"input": "Hunt leads"})
```

---

## 4️⃣ Operation Chaining: Menghubungkan Operations

### Sequential Chaining

```
Scout Agent Output
    ↓ (Leads data)
Closer Agent Input
    ↓ (Process leads, send WhatsApp)
Closer Agent Output
    ↓ (Response data)
Architect Agent Input
    ↓ (Deploy website based on response)
Architect Agent Output
```

### Implementasi

```python
async def hunt_and_close_workflow(location: str, category: str):
    """Full workflow: Scout → Closer → Architect"""
    
    # Step 1: Scout
    scout_results = await scout_agent.hunt(location, category)
    leads = scout_results["leads"]  # Extract leads
    
    # Step 2: Closer (use scout results)
    closer_results = await closer_agent.send_messages(leads)
    responses = closer_results["responses"]  # Extract responses
    
    # Step 3: Architect (use closer results)
    architect_results = await architect_agent.deploy_website(responses)
    
    return {
        "scout": scout_results,
        "closer": closer_results,
        "architect": architect_results
    }
```

### Error Handling dalam Chaining

```python
async def hunt_and_close_workflow_with_error_handling(location: str, category: str):
    """Workflow dengan error handling"""
    
    try:
        # Step 1: Scout
        scout_results = await scout_agent.hunt(location, category)
        
        if not scout_results["leads"]:
            return {"error": "No leads found"}
        
        # Step 2: Closer
        closer_results = await closer_agent.send_messages(scout_results["leads"])
        
        if closer_results["failed_count"] > 0:
            print(f"⚠️ {closer_results['failed_count']} messages failed")
        
        # Step 3: Architect
        architect_results = await architect_agent.deploy_website(closer_results["responses"])
        
        return {
            "success": True,
            "scout": scout_results,
            "closer": closer_results,
            "architect": architect_results
        }
    
    except Exception as e:
        print(f"❌ Workflow failed: {e}")
        return {"error": str(e)}
```

---

## 5️⃣ Conditional Routing: Membuat Keputusan

### Conditional Logic dalam Agents

```python
async def intelligent_hunt_workflow(location: str, category: str):
    """Workflow dengan conditional routing"""
    
    # Scout
    scout_results = await scout_agent.hunt(location, category)
    leads = scout_results["leads"]
    
    # Conditional: Jumlah leads
    if len(leads) < 5:
        print("⚠️ Terlalu sedikit leads, gunakan strategy alternatif")
        # Try different category
        scout_results = await scout_agent.hunt(location, "all")
        leads = scout_results["leads"]
    
    # Conditional: Lead quality
    high_quality_leads = [l for l in leads if l["rating"] >= 4.5]
    low_quality_leads = [l for l in leads if l["rating"] < 4.5]
    
    # Route ke Closer dengan strategi berbeda
    if high_quality_leads:
        closer_results_hq = await closer_agent.send_messages(
            high_quality_leads,
            strategy="premium"  # Premium strategy untuk high-quality
        )
    
    if low_quality_leads:
        closer_results_lq = await closer_agent.send_messages(
            low_quality_leads,
            strategy="volume"  # Volume strategy untuk low-quality
        )
    
    return {
        "high_quality": closer_results_hq,
        "low_quality": closer_results_lq
    }
```

### Implementasi dengan LangGraph

```python
from langgraph.graph import Graph

def route_based_on_leads(state):
    """Decide next step based on leads"""
    leads = state["leads"]
    
    if len(leads) < 5:
        return "scout_alternative"
    elif all(l["rating"] >= 4.5 for l in leads):
        return "closer_premium"
    else:
        return "closer_volume"

graph = Graph()

graph.add_node("scout", scout_task)
graph.add_node("route", route_based_on_leads)
graph.add_node("scout_alternative", scout_alternative_task)
graph.add_node("closer_premium", closer_premium_task)
graph.add_node("closer_volume", closer_volume_task)

graph.add_edge("START", "scout")
graph.add_edge("scout", "route")
graph.add_conditional_edges(
    "route",
    route_based_on_leads,
    {
        "scout_alternative": "scout_alternative",
        "closer_premium": "closer_premium",
        "closer_volume": "closer_volume"
    }
)
```

---

## 6️⃣ Error Handling & Fallbacks: Menangani Error

### Retry Logic

```python
async def call_with_retry(func, max_retries=3, backoff=2):
    """Call function dengan retry logic"""
    
    for attempt in range(max_retries):
        try:
            return await func()
        except Exception as e:
            if attempt == max_retries - 1:
                raise
            
            wait_time = backoff ** attempt
            print(f"⚠️ Attempt {attempt + 1} failed, retrying in {wait_time}s...")
            await asyncio.sleep(wait_time)

# Usage
results = await call_with_retry(
    lambda: scout_agent.hunt("Jakarta", "restaurant"),
    max_retries=3
)
```

### Fallback Strategy

```python
async def hunt_with_fallback(location: str, category: str):
    """Hunt dengan fallback strategy"""
    
    try:
        # Primary strategy: Google Maps
        results = await scout_agent.hunt_google_maps(location, category)
    except Exception as e:
        print(f"❌ Google Maps failed: {e}")
        
        try:
            # Fallback 1: OpenStreetMap
            results = await scout_agent.hunt_openstreetmap(location, category)
        except Exception as e2:
            print(f"❌ OpenStreetMap failed: {e2}")
            
            # Fallback 2: Manual database
            results = await scout_agent.hunt_manual_database(location, category)
    
    return results
```

---

## 7️⃣ Agent State Management: Manage State

### State dalam Agents

```python
class AgentState:
    def __init__(self):
        self.leads = []
        self.responses = []
        self.websites_deployed = []
        self.errors = []
    
    def add_lead(self, lead):
        self.leads.append(lead)
    
    def add_response(self, response):
        self.responses.append(response)
    
    def add_error(self, error):
        self.errors.append(error)

# Usage dalam workflow
state = AgentState()

# Scout
scout_results = await scout_agent.hunt("Jakarta", "restaurant")
for lead in scout_results["leads"]:
    state.add_lead(lead)

# Closer
closer_results = await closer_agent.send_messages(state.leads)
for response in closer_results["responses"]:
    state.add_response(response)

# Architect
architect_results = await architect_agent.deploy_website(state.responses)
```

### Persistent State dengan Database

```python
import supabase

class PersistentAgentState:
    def __init__(self, session_id: str):
        self.session_id = session_id
        self.db = supabase.create_client(url, key)
    
    def save_state(self):
        """Save state to database"""
        self.db.table("agent_sessions").upsert({
            "session_id": self.session_id,
            "leads": self.leads,
            "responses": self.responses,
            "websites": self.websites_deployed,
            "errors": self.errors,
            "updated_at": datetime.now()
        }).execute()
    
    def load_state(self):
        """Load state from database"""
        result = self.db.table("agent_sessions").select("*").eq(
            "session_id", self.session_id
        ).execute()
        
        if result.data:
            data = result.data[0]
            self.leads = data["leads"]
            self.responses = data["responses"]
            self.websites_deployed = data["websites"]
            self.errors = data["errors"]
```

---

## 8️⃣ Debugging Agents: Tools & Teknik

### Logging

```python
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

async def scout_agent_with_logging(location: str, category: str):
    logger.info(f"🔍 Starting scout in {location} for {category}")
    
    try:
        results = await scout_agent.hunt(location, category)
        logger.info(f"✅ Found {len(results['leads'])} leads")
        return results
    except Exception as e:
        logger.error(f"❌ Scout failed: {e}", exc_info=True)
        raise
```

### Tracing

```python
from langsmith import traceable

@traceable(name="scout_hunt")
async def scout_hunt_traced(location: str, category: str):
    """Scout hunt with tracing"""
    results = await scout_agent.hunt(location, category)
    return results

# Results akan di-track di LangSmith dashboard
```

### Debugging dengan Breakpoints

```python
import pdb

async def scout_agent_debug(location: str, category: str):
    results = await scout_agent.hunt(location, category)
    
    # Set breakpoint untuk inspect
    pdb.set_trace()
    
    # Inspect results
    print(f"Leads: {results['leads']}")
    print(f"Errors: {results['errors']}")
```

---

## 9️⃣ Agents Review: Best Practices

### Design Principles:

1. **Single Responsibility**: Setiap agent punya satu clear responsibility
2. **Composability**: Agents bisa di-compose menjadi workflows yang lebih besar
3. **Observability**: Semua actions harus logged dan traceable
4. **Resilience**: Handle errors gracefully dengan fallbacks
5. **Testability**: Agents harus mudah di-test dengan mock tools

### Common Patterns:

| Pattern | Use Case |
|---------|----------|
| **Reactive Agent** | Simple, single-task operations |
| **Agentic Loop** | Multi-step reasoning dengan tool calls |
| **Multi-Agent** | Specialized agents untuk different tasks |
| **Hierarchical** | Strategic planning dengan sub-agents |
| **Peer-to-Peer** | Agents yang collaborate tanpa hierarchy |

---

## 🔟 Quiz on Agents: Assessment Prep

### Likely Quiz Topics:

**Topic 1: Agent Concepts**
- Q: Apa perbedaan antara agent dan chatbot?
- Q: Jelaskan agentic loop dan kapan digunakan
- Q: Apa keuntungan multi-agent architecture?

**Topic 2: Parallel Execution**
- Q: Bagaimana cara implement parallel execution dengan asyncio?
- Q: Apa perbedaan antara asyncio.gather dan asyncio.create_task?
- Q: Bagaimana handle race conditions dalam parallel agents?

**Topic 3: Operation Chaining**
- Q: Bagaimana cara chain operations dengan proper error handling?
- Q: Apa yang harus dipertimbangkan saat design chaining workflow?

**Topic 4: Conditional Routing**
- Q: Bagaimana cara implement conditional routing dalam agents?
- Q: Apa use case untuk conditional routing?

**Topic 5: State Management**
- Q: Bagaimana cara manage state dalam agents?
- Q: Kapan menggunakan persistent state vs in-memory state?

### Study Tips:

1. **Understand Concepts**: Pahami WHY setiap pattern digunakan
2. **Practice**: Implement simple multi-agent system
3. **Debug**: Gunakan logging dan tracing untuk understand agent behavior
4. **Review**: Baca LangGraph dan CrewAI documentation

---

## 🎯 Kesimpulan

Agents & Workflows adalah **orchestration layer** yang mengubah individual tools menjadi **autonomous, intelligent systems** yang bisa:

✅ Make decisions independently  
✅ Execute multiple tasks in parallel  
✅ Chain operations dengan proper error handling  
✅ Route conditionally berdasarkan state  
✅ Persist state untuk long-running workflows  

Dalam Sovereign Predator Suite, Agents & Workflows adalah **jantung** yang mengkoordinasikan Scout, Closer, dan Architect untuk bekerja sebagai satu unified predator engine.

**Gyss! 😌👹 Dengan menguasai Agents & Workflows, Anda siap untuk membangun truly autonomous Predator Engine yang bisa hunt, close, dan deploy tanpa human intervention! 🔥👑👑👑**

---

## 📚 Referensi

[1] Anthropic. (2026). *Building with the Claude API - Agents Section*. https://anthropic.skilljar.com/claude-with-the-anthropic-api/
[2] LangChain. (2026). *LangGraph Documentation*. https://langchain-ai.github.io/langgraph/
[3] CrewAI. (2026). *Multi-Agent Framework*. https://crewai.io/
