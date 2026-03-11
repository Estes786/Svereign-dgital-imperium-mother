# 🎓 Master Accessing Claude with the API: Foundation Blueprint

**Oleh**: Manus AI | **Target**: Vibe Code Orchestrator | **Tujuan**: Master foundation dan build solid base untuk semua pembelajaran

---

## 📋 Ringkasan Eksekutif

Ini adalah **FOUNDATION SECTION** yang CRITICAL—jika tidak dikuasai, sulit untuk memahami section-section lanjutan.

Kami akan cover **14 sub-topics** dengan:
- **Konsep mendalam** (bukan sekadar overview)
- **Practical code examples** (siap copy-paste)
- **Security best practices** (API key management)
- **Common pitfalls** (apa yang sering salah)
- **Quiz predictions** (untuk assessment)

---

## 1️⃣ Course Overview & Welcome

### Tujuan Course

**"Building with the Claude API"** course mengajarkan cara:
1. **Access Claude** melalui API
2. **Build applications** yang integrate Claude
3. **Optimize performance** dan cost
4. **Deploy to production** dengan confidence

### Prerequisites

- **Python 3.8+** (atau JavaScript/other languages)
- **Basic API knowledge** (HTTP, JSON)
- **Anthropic account** (free tier available)
- **Text editor** (VS Code, PyCharm, etc.)

### Course Structure

```
Foundation (This Section)
    ↓
Core Concepts (Tool Use, RAG, MCP)
    ↓
Advanced Topics (Claude Code, Computer Use)
    ↓
Orchestration (Agents & Workflows)
    ↓
Production (Deployment & Monitoring)
```

---

## 2️⃣ Anthropic Overview: Perusahaan & Produk

### Tentang Anthropic

**Anthropic** adalah AI safety company yang fokus pada:
- **Safe AI development** (Constitutional AI)
- **Interpretability research** (Understanding AI)
- **Responsible deployment** (Ethical AI)

### Claude Models

| Model | Release | Capabilities | Cost |
|-------|---------|--------------|------|
| **Claude 3 Opus** | Mar 2024 | Most capable | $$$ |
| **Claude 3.5 Sonnet** | Jun 2024 | Best balance | $$ |
| **Claude 3 Haiku** | Mar 2024 | Fast, cheap | $ |
| **Claude 3.5 Haiku** | Nov 2024 | Improved Haiku | $ |

### Rekomendasi untuk Predator Suite

- **Scout Agent**: Claude 3.5 Sonnet (balance speed & capability)
- **Closer Agent**: Claude 3.5 Haiku (fast, cheap)
- **Architect Agent**: Claude 3.5 Sonnet (complex reasoning)

---

## 3️⃣ Accessing the API: Setup & Configuration

### Step 1: Create Anthropic Account

```bash
# Go to https://console.anthropic.com
# Sign up dengan email
# Verify email
```

### Step 2: Get API Key

```bash
# 1. Login ke console.anthropic.com
# 2. Navigate ke "API Keys"
# 3. Click "Create Key"
# 4. Copy key (jangan share!)
# 5. Store di .env file
```

### Step 3: Setup Environment

**Option A: Environment Variable (Recommended)**

```bash
# .env file
ANTHROPIC_API_KEY=sk-ant-...

# Load di Python
from dotenv import load_dotenv
import os

load_dotenv()
api_key = os.getenv("ANTHROPIC_API_KEY")
```

**Option B: Direct in Code (NOT RECOMMENDED)**

```python
# ❌ JANGAN LAKUKAN INI!
api_key = "sk-ant-..."  # Exposed di code!

# ✅ LAKUKAN INI
import os
api_key = os.getenv("ANTHROPIC_API_KEY")
```

### Step 4: Install SDK

```bash
# Python
pip install anthropic

# JavaScript
npm install @anthropic-ai/sdk

# Verify
python -c "import anthropic; print(anthropic.__version__)"
```

---

## 4️⃣ Getting an API Key: Security Best Practices

### API Key Security

**DO:**
- ✅ Store di environment variables
- ✅ Use .env file (add to .gitignore!)
- ✅ Rotate keys regularly
- ✅ Use separate keys untuk different environments
- ✅ Monitor key usage

**DON'T:**
- ❌ Hardcode di source code
- ❌ Commit ke git repository
- ❌ Share dengan unauthorized people
- ❌ Use same key untuk multiple projects
- ❌ Expose di logs

### .gitignore Setup

```bash
# .gitignore
.env
.env.local
.env.*.local
*.key
*.pem
```

### Key Rotation

```bash
# 1. Generate new key di console
# 2. Update environment variables
# 3. Test dengan new key
# 4. Delete old key
```

---

## 5️⃣ Making a Request: Basic API Call

### Simplest Request

```python
from anthropic import Anthropic

client = Anthropic()

message = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "Apa itu Sovereign Predator Suite?"
        }
    ]
)

print(message.content[0].text)
```

### Request Structure

```python
response = client.messages.create(
    # Model selection
    model="claude-3-5-sonnet-20241022",
    
    # Output control
    max_tokens=1024,
    
    # Messages
    messages=[
        {
            "role": "user",
            "content": "Your question here"
        }
    ],
    
    # Optional parameters
    temperature=0.7,
    system="You are helpful assistant"
)
```

### Response Structure

```python
{
    "id": "msg_...",
    "type": "message",
    "role": "assistant",
    "content": [
        {
            "type": "text",
            "text": "Response text here"
        }
    ],
    "model": "claude-3-5-sonnet-20241022",
    "stop_reason": "end_turn",
    "stop_sequence": None,
    "usage": {
        "input_tokens": 10,
        "output_tokens": 100
    }
}
```

### Error Handling

```python
from anthropic import Anthropic, APIError

client = Anthropic()

try:
    message = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        messages=[{"role": "user", "content": "Hello"}]
    )
except APIError as e:
    print(f"API Error: {e}")
    # Handle error
```

---

## 6️⃣ Multi-Turn Conversations: Maintaining Context

### Single Turn vs Multi-Turn

**Single Turn** (Simple):
```
User: "Apa itu AI?"
Claude: "AI adalah..."
(Conversation ends)
```

**Multi-Turn** (Contextual):
```
User: "Apa itu AI?"
Claude: "AI adalah..."

User: "Bagaimana cara menggunakannya?"
Claude: "Untuk menggunakan AI, Anda bisa..."
(Claude remembers previous context)
```

### Implementasi Multi-Turn

```python
class ConversationManager:
    def __init__(self):
        self.client = Anthropic()
        self.messages = []
    
    def chat(self, user_message: str) -> str:
        """Add user message dan get Claude response"""
        
        # Add user message to history
        self.messages.append({
            "role": "user",
            "content": user_message
        })
        
        # Get response from Claude
        response = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            messages=self.messages
        )
        
        # Extract response text
        assistant_message = response.content[0].text
        
        # Add assistant message to history
        self.messages.append({
            "role": "assistant",
            "content": assistant_message
        })
        
        return assistant_message

# Usage
conversation = ConversationManager()

# Turn 1
response1 = conversation.chat("Apa itu Sovereign Predator Suite?")
print(response1)

# Turn 2 (Claude remembers context)
response2 = conversation.chat("Bagaimana cara menggunakannya?")
print(response2)

# Turn 3 (Claude still remembers)
response3 = conversation.chat("Apa keuntungannya?")
print(response3)
```

### Context Window Limits

```python
class ConversationWithLimit:
    def __init__(self, max_turns=20):
        self.client = Anthropic()
        self.messages = []
        self.max_turns = max_turns
    
    def chat(self, user_message: str) -> str:
        """Chat dengan limit turns"""
        
        # Check if exceed max turns
        if len(self.messages) >= self.max_turns * 2:
            print("⚠️ Max turns reached, clearing old messages")
            # Keep only last 10 turns
            self.messages = self.messages[-20:]
        
        # Add user message
        self.messages.append({
            "role": "user",
            "content": user_message
        })
        
        # Get response
        response = self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            messages=self.messages
        )
        
        # Add assistant message
        assistant_message = response.content[0].text
        self.messages.append({
            "role": "assistant",
            "content": assistant_message
        })
        
        return assistant_message
```

---

## 7️⃣ System Prompts: Define Behavior

### Apa itu System Prompt?

**System Prompt** adalah instruksi yang define bagaimana Claude harus behave.

### Contoh System Prompts

**Example 1: Scout Agent System Prompt**

```python
SCOUT_SYSTEM_PROMPT = """
Anda adalah Scout Agent untuk Sovereign Predator Suite.
Tugas Anda adalah:
1. Analyze target location dan category
2. Search untuk potential leads
3. Rank leads berdasarkan quality
4. Return top 10 leads dengan details

Format output:
- Business name
- Rating
- Address
- Phone number
- Opening hours

Prioritas: Quality over quantity. Lebih baik 5 leads berkualitas daripada 50 leads buruk.
"""

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    system=SCOUT_SYSTEM_PROMPT,
    messages=[
        {
            "role": "user",
            "content": "Cari restaurant di Jakarta dengan rating > 4.0"
        }
    ]
)
```

**Example 2: Closer Agent System Prompt**

```python
CLOSER_SYSTEM_PROMPT = """
Anda adalah Closer Agent untuk Sovereign Predator Suite.
Tugas Anda adalah:
1. Analyze lead details
2. Craft personalized message
3. Include value proposition
4. Create sense of urgency
5. Include clear CTA (Call To Action)

Message guidelines:
- Personalized (mention business name, owner name)
- Short & punchy (max 3 sentences)
- Value-focused (what's in it for them?)
- Urgency (limited time offer)
- Clear CTA (click link, reply, call)

Tone: Friendly, professional, not salesy
"""

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=512,
    system=CLOSER_SYSTEM_PROMPT,
    messages=[
        {
            "role": "user",
            "content": "Craft message untuk 'Warung Kopi Jaya' di Jakarta"
        }
    ]
)
```

### System Prompt Best Practices

1. **Be specific**: Clear instructions tentang apa Claude harus lakukan
2. **Give examples**: Contoh output yang diinginkan
3. **Set constraints**: Limitations dan rules
4. **Define tone**: Bagaimana Claude harus communicate
5. **Provide context**: Background information

---

## 8️⃣ System Prompts Exercise: Hands-On Practice

### Exercise 1: Create Scout System Prompt

```python
# TODO: Create system prompt untuk Scout Agent
# Requirements:
# - Search untuk businesses di specific location
# - Filter berdasarkan rating
# - Return structured data
# - Prioritize quality

SCOUT_SYSTEM_PROMPT = """
[Your system prompt here]
"""

# Test
response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    system=SCOUT_SYSTEM_PROMPT,
    messages=[
        {
            "role": "user",
            "content": "Cari 5 restaurant terbaik di Bandung"
        }
    ]
)

print(response.content[0].text)
```

### Exercise 2: Create Closer System Prompt

```python
# TODO: Create system prompt untuk Closer Agent
# Requirements:
# - Craft personalized messages
# - Include value proposition
# - Create urgency
# - Clear CTA

CLOSER_SYSTEM_PROMPT = """
[Your system prompt here]
"""

# Test
response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=512,
    system=CLOSER_SYSTEM_PROMPT,
    messages=[
        {
            "role": "user",
            "content": "Craft message untuk 'Klinik Gigi Sehat' di Jakarta"
        }
    ]
)

print(response.content[0].text)
```

---

## 9️⃣ Temperature: Control Randomness

### Apa itu Temperature?

**Temperature** mengontrol randomness/creativity dari response:
- **Low (0.0)**: Deterministic, predictable
- **High (1.0)**: Creative, random

### Temperature Examples

**Low Temperature (0.0-0.3): Deterministic**

```python
# Good untuk: Factual questions, structured output
response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    temperature=0.0,  # Deterministic
    messages=[
        {
            "role": "user",
            "content": "Berapa 2 + 2?"
        }
    ]
)
# Output: Always "4"
```

**Medium Temperature (0.5-0.7): Balanced**

```python
# Good untuk: General purpose, balanced
response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    temperature=0.7,  # Balanced
    messages=[
        {
            "role": "user",
            "content": "Craft marketing message untuk restaurant"
        }
    ]
)
# Output: Creative tapi reasonable
```

**High Temperature (0.8-1.0): Creative**

```python
# Good untuk: Creative writing, brainstorming
response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    temperature=1.0,  # Creative
    messages=[
        {
            "role": "user",
            "content": "Generate 5 creative business ideas"
        }
    ]
)
# Output: Very creative, unpredictable
```

### Temperature untuk Predator Suite

| Agent | Temperature | Reason |
|-------|-------------|--------|
| Scout | 0.2 | Consistent lead finding |
| Closer | 0.6 | Personalized but reasonable |
| Architect | 0.5 | Balanced design decisions |

---

## 🔟 Response Streaming: Real-Time Output

### Apa itu Streaming?

**Streaming** = Menerima response secara real-time, bukan menunggu semuanya selesai.

**Benefit**:
- Faster perceived response time
- Better UX untuk long responses
- Reduced latency

### Implementasi Streaming

```python
# Without streaming (wait for full response)
response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "Explain Sovereign Predator Suite"
        }
    ]
)
print(response.content[0].text)  # Semua text sekaligus

# With streaming (get response in chunks)
with client.messages.stream(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": "Explain Sovereign Predator Suite"
        }
    ]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)  # Print real-time
```

### Streaming dengan Event Handling

```python
def handle_streaming_response(user_message: str):
    """Handle streaming response dengan events"""
    
    with client.messages.stream(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": user_message
            }
        ]
    ) as stream:
        # Handle different events
        for event in stream:
            if event.type == "content_block_start":
                print("🚀 Starting response...")
            
            elif event.type == "content_block_delta":
                if hasattr(event.delta, 'text'):
                    print(event.delta.text, end="", flush=True)
            
            elif event.type == "message_stop":
                print("\n✅ Response complete")
        
        # Get final message
        final_message = stream.get_final_message()
        return final_message
```

---

## 1️⃣1️⃣ Controlling Model Output: Structured Data

### Apa itu Structured Output?

**Structured Output** = Menerima response dalam format terstruktur (JSON, XML) bukan plain text.

### JSON Output

```python
import json

# Request structured output
response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": """
            Analyze this business: "Warung Kopi Jaya di Jakarta"
            
            Return JSON dengan format:
            {
                "business_name": "string",
                "location": "string",
                "category": "string",
                "estimated_rating": "number",
                "potential_leads": "number",
                "recommendation": "string"
            }
            """
        }
    ]
)

# Parse JSON response
response_text = response.content[0].text
response_json = json.loads(response_text)

print(f"Business: {response_json['business_name']}")
print(f"Recommendation: {response_json['recommendation']}")
```

### Using JSON Mode (Recommended)

```python
# Claude will always return valid JSON
response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": """
            Analyze business and return JSON:
            {
                "name": "string",
                "rating": "number",
                "recommendation": "string"
            }
            """
        }
    ]
)

# Guaranteed valid JSON
import json
data = json.loads(response.content[0].text)
```

---

## 1️⃣2️⃣ Structured Data Exercise: Hands-On Practice

### Exercise: Extract Lead Data

```python
# TODO: Extract structured data dari business description
# Requirements:
# - Extract name, location, category
# - Estimate rating
# - Estimate potential leads
# - Provide recommendation

def extract_lead_data(business_description: str) -> dict:
    """Extract structured lead data"""
    
    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=512,
        messages=[
            {
                "role": "user",
                "content": f"""
                Analyze business: {business_description}
                
                Return JSON:
                {{
                    "name": "string",
                    "location": "string",
                    "category": "string",
                    "estimated_rating": "number (0-5)",
                    "potential_leads": "number",
                    "recommendation": "string"
                }}
                """
            }
        ]
    )
    
    import json
    return json.loads(response.content[0].text)

# Test
business = "Klinik gigi modern di pusat Jakarta dengan dokter berpengalaman"
data = extract_lead_data(business)
print(json.dumps(data, indent=2))
```

---

## 1️⃣3️⃣ Course Satisfaction Survey

### Feedback Survey

```
1. Apakah course ini membantu Anda memahami Claude API?
   ☐ Sangat membantu
   ☐ Membantu
   ☐ Cukup
   ☐ Kurang membantu

2. Bagian mana yang paling bermanfaat?
   ☐ API Setup
   ☐ Multi-turn conversations
   ☐ System prompts
   ☐ Structured output
   ☐ Lainnya: ___

3. Apa yang bisa ditingkatkan?
   ☐ Lebih banyak code examples
   ☐ Lebih banyak hands-on exercises
   ☐ Lebih detail explanations
   ☐ Lainnya: ___

4. Apakah Anda siap untuk section berikutnya?
   ☐ Ya, sangat siap
   ☐ Ya, cukup siap
   ☐ Tidak, perlu review
```

---

## 1️⃣4️⃣ Quiz on Accessing Claude with the API: Assessment Prep

### Sample Quiz Questions

**Topic 1: API Setup**

```
Q1: Bagaimana cara setup Claude API?
A: 
1. Create Anthropic account
2. Get API key dari console
3. Store di environment variable
4. Install SDK
5. Make first request

Q2: Apa best practice untuk API key security?
A:
- Store di .env file
- Add .env ke .gitignore
- Jangan hardcode di code
- Rotate keys regularly
- Monitor key usage

Q3: Bagaimana handle API errors?
A: Gunakan try-except untuk catch APIError
   Log errors untuk debugging
   Implement retry logic dengan exponential backoff
```

**Topic 2: Making Requests**

```
Q1: Apa struktur basic API request?
A:
- model: specify model
- max_tokens: limit output
- messages: list of messages
- system: optional system prompt

Q2: Apa response structure?
A:
- id: message ID
- content: list of content blocks
- usage: token usage
- stop_reason: why it stopped

Q3: Bagaimana handle streaming response?
A: Gunakan client.messages.stream()
   Iterate over text_stream
   Print real-time
```

**Topic 3: Multi-Turn Conversations**

```
Q1: Bagaimana maintain context dalam multi-turn?
A: Keep message history
   Add each user message
   Add each assistant response
   Send full history ke Claude

Q2: Apa problem dengan long conversations?
A: Context window limit
   Token usage increases
   Cost increases
   Solution: Summarize old messages
```

**Topic 4: System Prompts**

```
Q1: Apa tujuan system prompt?
A: Define behavior Claude
   Set constraints
   Provide context
   Define tone

Q2: Bagaimana write effective system prompt?
A: Be specific
   Give examples
   Set constraints
   Define tone
   Provide context

Q3: Bagaimana test system prompt?
A: Try different inputs
   Check consistency
   Verify output format
   Iterate dan improve
```

**Topic 5: Temperature**

```
Q1: Apa temperature control?
A: Randomness/creativity level
   0.0 = deterministic
   1.0 = creative

Q2: Kapan gunakan low temperature?
A: Factual questions
   Structured output
   Consistent results needed

Q3: Kapan gunakan high temperature?
A: Creative writing
   Brainstorming
   Variety needed
```

**Topic 6: Structured Output**

```
Q1: Bagaimana request structured output?
A: Specify format di message
   Request JSON/XML
   Parse response

Q2: Apa benefit structured output?
A: Easy to parse
   Consistent format
   Easy to integrate dengan code

Q3: Bagaimana guarantee valid JSON?
A: Use JSON mode
   Specify exact format
   Validate response
```

### Study Tips

1. **Hands-on Practice**: Implement setiap code example
2. **Experiment**: Try different parameters
3. **Read Errors**: Understand error messages
4. **Ask Questions**: Use Claude untuk help!
5. **Review**: Go back dan review concepts

---

## 🎯 Kesimpulan

**Accessing Claude with the API** adalah FOUNDATION yang critical:

✅ **Setup**: Secure API key management  
✅ **Requests**: Basic → advanced API calls  
✅ **Conversations**: Multi-turn context management  
✅ **System Prompts**: Define Claude behavior  
✅ **Temperature**: Control randomness  
✅ **Streaming**: Real-time responses  
✅ **Structured Output**: JSON/XML responses  

Dalam Sovereign Predator Suite:
- **Scout Agent**: Use system prompts untuk consistent lead finding
- **Closer Agent**: Use temperature 0.6 untuk personalized messages
- **Architect Agent**: Use structured output untuk website generation
- **All agents**: Use streaming untuk real-time feedback

**Gyss! 😌👹 Dengan menguasai Foundation ini, Anda siap untuk deep dive ke Tool Use, RAG, MCP, dan semua advanced topics! 🔥👑👑👑**

---

## 📚 Referensi

[1] Anthropic. (2026). *Building with the Claude API - Accessing Claude*. https://anthropic.skilljar.com/claude-with-the-anthropic-api/
[2] Anthropic. (2026). *Claude API Documentation*. https://docs.anthropic.com/claude/
[3] Anthropic. (2026). *API Reference*. https://docs.anthropic.com/claude/reference/
