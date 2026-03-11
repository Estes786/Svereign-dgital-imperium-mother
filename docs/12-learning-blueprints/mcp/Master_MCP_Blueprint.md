# 🎓 Master MCP Blueprint: Model Context Protocol dengan Claude

**Oleh**: Manus AI | **Target**: Vibe Code Orchestrator | **Tujuan**: Kuasai MCP dan dapatkan Certificate

---

## 📋 Ringkasan Eksekutif

Model Context Protocol (MCP) adalah **"jembatan universal"** yang menghubungkan Claude dengan aplikasi eksternal, database, dan service tanpa perlu menulis boilerplate integration code yang rumit. MCP memungkinkan Claude untuk:

- **Memanggil tools** yang Anda definisikan
- **Mengakses resources** seperti file, database, atau API
- **Menerima prompts** yang sudah pre-defined untuk workflow tertentu

Dalam konteks **Sovereign Predator Suite**, MCP adalah **backbone** yang menghubungkan Claude dengan Google Maps, WhatsApp, QRIS, dan service lainnya.

---

## 🏗️ Struktur Modul MCP

Modul MCP dalam "Building with the Claude API" mencakup:

1. **Introducing MCP** - Konsep dasar dan arsitektur
2. **MCP Clients** - Cara membuat client yang connect ke MCP servers
3. **Project Setup** - Setup environment dan dependencies
4. **Defining Tools with MCP** - Cara define tools yang bisa dipanggil Claude
5. **The Server Inspector** - Tool debugging untuk MCP servers
6. **Implementing a Client** - Implementasi client secara praktis
7. **Defining Resources** - Cara expose data sebagai resources
8. **Accessing Resources** - Cara client mengakses resources
9. **Defining Prompts** - Cara define pre-built prompts untuk workflows
10. **Prompts in the Client** - Implementasi prompts di client
11. **MCP Review** - Ringkasan dan best practices
12. **Quiz on MCP** - Assessment untuk mendapatkan certificate

---

## 1️⃣ Introducing MCP: Konsep Dasar

### Apa itu Model Context Protocol?

**Model Context Protocol (MCP)** adalah sebuah standar terbuka yang dirancang oleh Anthropic untuk menghubungkan Claude (dan LLM lainnya) dengan aplikasi eksternal, tanpa perlu menulis custom integration code untuk setiap service.

**Analogi Sederhana**:
- **Tanpa MCP**: Claude harus tahu cara memanggil Google Maps API, WhatsApp API, QRIS, dll. Setiap API memiliki format berbeda, authentication berbeda, error handling berbeda.
- **Dengan MCP**: Claude hanya perlu tahu "ada tool bernama `search_nearby_businesses`". MCP server yang handle semua kompleksitas API.

### Arsitektur MCP

```
┌──────────────┐
│   Claude     │ (LLM yang akan memanggil tools)
└──────┬───────┘
       │ (MCP Protocol)
       │
┌──────▼───────────────────────────────┐
│      MCP Client                       │
│  (Biasanya di aplikasi Anda)         │
└──────┬───────────────────────────────┘
       │ (Stdio/HTTP/WebSocket)
       │
┌──────▼───────────────────────────────┐
│      MCP Server                       │
│  (Expose tools, resources, prompts)  │
│  - Tools: Fungsi yang bisa dipanggil │
│  - Resources: Data yang bisa diakses │
│  - Prompts: Workflow yang pre-built  │
└──────┬───────────────────────────────┘
       │
       ├─► Google Maps API
       ├─► WhatsApp API
       ├─► QRIS Payment
       └─► Database
```

### Mengapa MCP Penting untuk Predator Suite?

1. **Modular**: Setiap service (Google Maps, WhatsApp, QRIS) adalah MCP server terpisah
2. **Reusable**: MCP servers bisa digunakan oleh berbagai aplikasi
3. **Scalable**: Mudah menambah service baru tanpa mengubah core logic
4. **Maintainable**: Semua integration logic terpusat di MCP servers

---

## 2️⃣ MCP Clients: Cara Membuat Client

### Apa itu MCP Client?

MCP Client adalah aplikasi yang **menghubungkan Claude dengan MCP servers**. Dalam konteks Predator Suite, MCP Client adalah aplikasi utama yang orchestrate semua agen (Scout, Closer, Architect).

### Struktur MCP Client

```python
from anthropic import Anthropic
from mcp import Client

# 1. Initialize Anthropic client
client = Anthropic()

# 2. Initialize MCP client
mcp_client = Client()

# 3. Connect to MCP servers
await mcp_client.connect_server("google_maps_server")
await mcp_client.connect_server("whatsapp_server")
await mcp_client.connect_server("qris_server")

# 4. Get available tools from MCP servers
tools = await mcp_client.get_tools()

# 5. Use Claude with MCP tools
response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    tools=tools,
    messages=[
        {
            "role": "user",
            "content": "Cari bisnis kuliner di Jakarta dengan rating > 4.5"
        }
    ]
)
```

### Key Points:

- **MCP Client menghubungkan** Claude dengan MCP servers melalui stdio, HTTP, atau WebSocket
- **Tools dari MCP servers** di-pass ke Claude sebagai `tools` parameter
- **Claude memutuskan** tool mana yang akan dipanggil berdasarkan user request
- **MCP Client mengeksekusi** tool call dan mengembalikan hasil ke Claude

---

## 3️⃣ Project Setup: Setup Environment

### Prerequisites

```bash
# Python 3.11+
python --version

# Install dependencies
pip install anthropic mcp

# Optional: untuk development
pip install pytest black mypy
```

### Struktur Project MCP

```
predator_suite/
├── client/
│   ├── main.py              # MCP Client utama
│   ├── orchestrator.py      # Orchestrate Scout, Closer, Architect
│   └── config.py            # Configuration
├── servers/
│   ├── google_maps_server.py
│   ├── whatsapp_server.py
│   ├── qris_server.py
│   └── supabase_server.py
├── agents/
│   ├── scout_agent.py
│   ├── closer_agent.py
│   └── architect_agent.py
└── tests/
    ├── test_mcp_client.py
    └── test_servers.py
```

### Environment Variables

```bash
# .env
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_MAPS_API_KEY=...
WHATSAPP_API_KEY=...
QRIS_MERCHANT_ID=...
SUPABASE_URL=...
SUPABASE_KEY=...
```

---

## 4️⃣ Defining Tools with MCP: Cara Define Tools

### Struktur Tool Definition

Setiap tool di MCP server harus di-define dengan:
- **name**: Nama tool (lowercase, underscore-separated)
- **description**: Deskripsi jelas apa yang tool lakukan
- **inputSchema**: JSON Schema yang define input parameters

### Contoh: Google Maps Tool

```python
from mcp.server import Server
from mcp.types import Tool, TextContent

server = Server("google_maps_server")

# Define tool
SEARCH_NEARBY_TOOL = {
    "name": "search_nearby_businesses",
    "description": "Cari bisnis di lokasi tertentu berdasarkan kategori dan rating minimum",
    "inputSchema": {
        "type": "object",
        "properties": {
            "location": {
                "type": "string",
                "description": "Lokasi pencarian (e.g., 'Jakarta', 'Bandung')"
            },
            "category": {
                "type": "string",
                "description": "Kategori bisnis (e.g., 'restaurant', 'cafe', 'clinic')"
            },
            "min_rating": {
                "type": "number",
                "description": "Rating minimum (0-5)",
                "default": 3.5
            },
            "max_results": {
                "type": "integer",
                "description": "Jumlah hasil maksimal",
                "default": 10
            }
        },
        "required": ["location", "category"]
    }
}

# Register tool
@server.call_tool("search_nearby_businesses")
async def search_nearby(location: str, category: str, min_rating: float = 3.5, max_results: int = 10):
    """
    Implementasi tool yang sebenarnya
    """
    # Call Google Maps API
    results = google_maps_client.search_nearby_places(
        location=location,
        category=category,
        min_rating=min_rating,
        max_results=max_results
    )
    
    return {
        "type": "text",
        "text": f"Ditemukan {len(results)} bisnis:\n" + 
                "\n".join([f"- {r['name']} (Rating: {r['rating']})" for r in results])
    }
```

### Best Practices untuk Tool Definition:

1. **Nama Tool**: Gunakan snake_case, jelas dan deskriptif
2. **Description**: Jelaskan apa tool lakukan dalam 1-2 kalimat
3. **Input Schema**: Jelaskan setiap parameter dengan tipe data dan contoh
4. **Error Handling**: Handle edge cases dan return error yang informatif

---

## 5️⃣ The Server Inspector: Debugging Tool

### Apa itu MCP Inspector?

MCP Inspector adalah tool debugging built-in dari Anthropic yang memungkinkan Anda untuk:
- Test tool calls tanpa perlu Claude
- Lihat struktur tools, resources, prompts
- Debug error di MCP servers

### Cara Menggunakan MCP Inspector

```bash
# Start MCP server
python servers/google_maps_server.py

# Di terminal lain, jalankan inspector
mcp-inspector --server google_maps_server

# Buka browser ke http://localhost:3000
# Anda bisa test tools langsung di UI
```

### Contoh Testing di Inspector:

```json
{
  "name": "search_nearby_businesses",
  "arguments": {
    "location": "Jakarta",
    "category": "restaurant",
    "min_rating": 4.0,
    "max_results": 5
  }
}
```

---

## 6️⃣ Implementing a Client: Praktik Client Implementation

### Full MCP Client Implementation

```python
import asyncio
from anthropic import Anthropic
from mcp import Client
import json

class PredatorMCPClient:
    def __init__(self):
        self.anthropic = Anthropic()
        self.mcp_client = Client()
        self.tools = []
    
    async def connect_servers(self):
        """Connect ke semua MCP servers"""
        servers = [
            "google_maps_server",
            "whatsapp_server",
            "qris_server",
            "supabase_server"
        ]
        
        for server in servers:
            await self.mcp_client.connect_server(server)
            print(f"✅ Connected to {server}")
        
        # Get all tools
        self.tools = await self.mcp_client.get_tools()
        print(f"📚 Loaded {len(self.tools)} tools")
    
    async def hunt_leads(self, location: str, category: str):
        """Scout Agent: Cari leads"""
        messages = [
            {
                "role": "user",
                "content": f"Cari {category} di {location} dengan rating > 4.0. Ambil 10 hasil terbaik."
            }
        ]
        
        # Call Claude dengan MCP tools
        response = self.anthropic.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2048,
            tools=self.tools,
            messages=messages
        )
        
        # Handle tool calls
        while response.stop_reason == "tool_use":
            tool_calls = [block for block in response.content if block.type == "tool_use"]
            
            for tool_call in tool_calls:
                # Execute tool via MCP
                result = await self.mcp_client.call_tool(
                    tool_call.name,
                    tool_call.input
                )
                
                # Add result to messages
                messages.append({
                    "role": "assistant",
                    "content": response.content
                })
                messages.append({
                    "role": "user",
                    "content": [
                        {
                            "type": "tool_result",
                            "tool_use_id": tool_call.id,
                            "content": result.text
                        }
                    ]
                })
            
            # Continue conversation
            response = self.anthropic.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=2048,
                tools=self.tools,
                messages=messages
            )
        
        return response.content[0].text

# Usage
async def main():
    client = PredatorMCPClient()
    await client.connect_servers()
    
    leads = await client.hunt_leads("Jakarta", "restaurant")
    print(leads)

asyncio.run(main())
```

---

## 7️⃣ Defining Resources: Cara Expose Data

### Apa itu Resources?

Resources adalah **data yang bisa diakses langsung** oleh Claude, bukan melalui tool call. Berguna untuk:
- Expose file atau dokumen
- Expose database records
- Expose configuration atau metadata

### Contoh: Supabase Resources

```python
from mcp.server import Server
from mcp.types import Resource

server = Server("supabase_server")

# Define resource
@server.list_resources()
async def list_resources():
    """List semua resources yang tersedia"""
    return [
        {
            "uri": "supabase://leads/all",
            "name": "All Leads Database",
            "description": "Semua leads yang sudah di-hunt"
        },
        {
            "uri": "supabase://leads/successful",
            "name": "Successful Leads",
            "description": "Leads yang sudah convert"
        }
    ]

@server.read_resource("supabase://leads/all")
async def read_leads():
    """Read all leads from Supabase"""
    leads = supabase.table("leads").select("*").execute()
    
    return {
        "type": "text",
        "text": json.dumps(leads.data, indent=2)
    }
```

---

## 8️⃣ Accessing Resources: Cara Client Mengakses

### Client-side Resource Access

```python
# List available resources
resources = await mcp_client.list_resources()

for resource in resources:
    print(f"📦 {resource.name}: {resource.uri}")

# Read specific resource
leads_data = await mcp_client.read_resource("supabase://leads/all")
print(leads_data.text)
```

---

## 9️⃣ Defining Prompts: Workflow Pre-built

### Apa itu Prompts di MCP?

Prompts adalah **template instructions yang pre-built** untuk workflow tertentu. Berguna untuk:
- Standardize agent behavior
- Reduce hallucination
- Ensure consistent output format

### Contoh: Scout Agent Prompt

```python
@server.list_prompts()
async def list_prompts():
    """List semua prompts yang tersedia"""
    return [
        {
            "name": "scout_hunting_prompt",
            "description": "Prompt untuk Scout Agent saat hunting leads",
            "arguments": [
                {
                    "name": "location",
                    "description": "Lokasi target hunting"
                },
                {
                    "name": "category",
                    "description": "Kategori bisnis target"
                }
            ]
        }
    ]

@server.get_prompt("scout_hunting_prompt")
async def get_scout_prompt(location: str, category: str):
    """Get prompt untuk Scout Agent"""
    prompt = f"""
    Anda adalah Scout Agent dalam Predator Suite. Tugas Anda:
    
    1. Cari {category} di {location}
    2. Filter berdasarkan:
       - Rating minimum 4.0
       - Memiliki kontak WhatsApp atau phone
       - Belum pernah di-contact sebelumnya
    3. Untuk setiap lead, extract:
       - Nama bisnis
       - Rating
       - Lokasi
       - Nomor WhatsApp/Phone
       - Kategori produk/service
    4. Ranking berdasarkan potential value (rating + review count)
    5. Return top 10 leads dalam format JSON
    
    Format output:
    {{
        "leads": [
            {{
                "name": "...",
                "rating": 4.5,
                "location": "...",
                "whatsapp": "...",
                "category": "...",
                "potential_score": 8.5
            }}
        ]
    }}
    """
    
    return {
        "type": "text",
        "text": prompt
    }
```

---

## 🔟 Prompts in the Client: Implementasi di Client

### Menggunakan Prompts di Client

```python
# Get prompt
prompt_data = await mcp_client.get_prompt(
    "scout_hunting_prompt",
    location="Jakarta",
    category="restaurant"
)

# Use prompt dalam Claude call
messages = [
    {
        "role": "user",
        "content": prompt_data.text
    }
]

response = anthropic.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=2048,
    tools=tools,
    messages=messages
)
```

---

## 1️⃣1️⃣ MCP Review: Best Practices & Patterns

### Best Practices:

1. **Tool Design**:
   - Satu tool = satu responsibility
   - Input schema harus jelas dan validated
   - Error messages harus informatif

2. **Server Implementation**:
   - Async/await untuk I/O operations
   - Proper error handling dan logging
   - Rate limiting untuk API calls

3. **Client Implementation**:
   - Handle tool call loops dengan benar
   - Implement retry logic untuk failed calls
   - Cache resources untuk performance

4. **Security**:
   - Validate semua input dari Claude
   - Implement authentication untuk sensitive operations
   - Log semua tool calls untuk audit trail

### Common Patterns:

**Pattern 1: Sequential Tool Calls**
```
Claude: "Cari leads di Jakarta"
  ↓
Tool: search_nearby_businesses()
  ↓
Claude: "Sekarang kirim WhatsApp ke top 3"
  ↓
Tool: send_whatsapp_message()
```

**Pattern 2: Parallel Tool Calls**
```
Claude: "Cari leads di Jakarta, Bandung, dan Surabaya"
  ↓
Tool 1: search_nearby_businesses(Jakarta)
Tool 2: search_nearby_businesses(Bandung)
Tool 3: search_nearby_businesses(Surabaya)
  ↓ (All parallel)
Claude: "Combine results dan rank by potential"
```

---

## 1️⃣2️⃣ Quiz on MCP: Assessment Prep

### Likely Quiz Topics:

**Topic 1: MCP Architecture**
- Q: Apa perbedaan antara MCP Client dan MCP Server?
- Q: Jelaskan alur komunikasi antara Claude, MCP Client, dan MCP Server
- Q: Apa keuntungan menggunakan MCP dibanding hardcoding API calls?

**Topic 2: Tool Definition**
- Q: Bagaimana cara define tool dengan proper input schema?
- Q: Apa yang harus ada di dalam tool description?
- Q: Bagaimana error handling di MCP tools?

**Topic 3: Resources & Prompts**
- Q: Kapan menggunakan Resources vs Tools?
- Q: Bagaimana cara define dan access resources?
- Q: Apa keuntungan menggunakan pre-built prompts?

**Topic 4: Implementation**
- Q: Bagaimana cara implement MCP client yang handle tool calls?
- Q: Bagaimana cara connect ke multiple MCP servers?
- Q: Bagaimana cara debug MCP servers menggunakan Inspector?

### Study Tips:

1. **Pahami Konsep**: Jangan hanya hafal, tapi pahami WHY MCP penting
2. **Practice**: Buat MCP server sederhana (e.g., calculator server)
3. **Test**: Gunakan MCP Inspector untuk test tools
4. **Review**: Baca Anthropic docs tentang MCP best practices

---

## 🎯 Kesimpulan

MCP adalah **fondasi modular** untuk membangun aplikasi AI yang scalable dan maintainable. Dalam konteks Sovereign Predator Suite, MCP memungkinkan kita untuk:

✅ Decouple Claude dari specific services  
✅ Reuse MCP servers across multiple applications  
✅ Scale dengan menambah service baru tanpa core changes  
✅ Maintain code yang clean dan organized  

**Gyss! 😌👹 Dengan menguasai MCP, Anda siap untuk membangun Predator Engine yang truly modular dan production-ready! 🔥👑👑👑**

---

## 📚 Referensi

[1] Anthropic. (2026). *Model Context Protocol Documentation*. https://modelcontextprotocol.io/
[2] Anthropic. (2026). *Building with the Claude API - MCP Section*. https://anthropic.skilljar.com/claude-with-the-anthropic-api/
