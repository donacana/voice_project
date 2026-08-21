# ARCHITECTURE

## 1. Overall Flow

```text
Microphone
  ↓
Deepgram Speech-to-Text
  ↓
FastAPI
  ↓
PyTorch Intent Classification
  ↓
Command Router
  ├─ Direct
  │   ↓
  │  React
  │
  ├─ Context
  │   ↓
  │  Current Lecture Context
  │   ↓
  │  React
  │
  └─ Search
      ↓
    LLM only if needed
      ↓
    OpenAI Embedding
      ↓
    Vector RAG
      ↓
    PostgreSQL + pgvector
      ↓
    FastAPI
      ↓
    React
```

## 2. Responsibilities

### React
- render screens
- switch demos
- show lecture content
- show voice/search state

### FastAPI
- central API
- AI calls
- DB access
- context management
- routing
- structured response

### Deepgram
- speech → text only

### PyTorch
- intent classification only

### OpenAI LLM
- ambiguity/context fallback only

### OpenAI Embedding
- text → vector

### PostgreSQL + pgvector
- lecture content storage
- vector storage
- similarity search

---

## 3. Command Routes

### DIRECT
Examples:
- NEXT
- PREVIOUS
- HOME
- PAUSE_VIDEO

No DB/RAG unless explicitly needed.

### CONTEXT
Examples:
- SHOW_INSTALL
- SHOW_FEATURES
- SHOW_EXAMPLE

If `current_library` is known, use it directly.

### SEARCH
Examples:
- "enterprise UI"
- "accessible UI"
- "highly customizable UI"

Use Embedding + Vector RAG.

---

## 4. LLM Fallback

Only use when:
- pronouns/references are ambiguous;
- previous context is required;
- multiple constraints need interpretation;
- intent is SEARCH but query meaning is incomplete.

Prefer structured output, for example:

```json
{
  "intent": "SEARCH",
  "exclude_library": "ant-design",
  "query": "highly customizable React UI library"
}
```

---

## 5. Lecture Context

Minimum context:

```json
{
  "current_library": "ant-design",
  "current_content_type": "introduction",
  "current_screen": "demo",
  "previous_library": "material-ui",
  "previous_screen": "overview"
}
```

---

## 6. API Response Shape

Demo action:

```json
{
  "action": "OPEN_DEMO",
  "target": "ant-design",
  "content": null,
  "metadata": {}
}
```

Content action:

```json
{
  "action": "SHOW_CONTENT",
  "target": "ant-design",
  "content_type": "install",
  "content": "npm install antd",
  "metadata": {}
}
```

Search result:

```json
{
  "action": "SHOW_SEARCH_RESULT",
  "target": "ant-design",
  "content_type": "use_case",
  "content": "Suitable for enterprise admin dashboards...",
  "metadata": {
    "score": 0.91
  }
}
```

---

## 7. Docker

```text
Docker Compose
├─ frontend
├─ backend
└─ postgres
```

External:
- Deepgram API
- OpenAI API

No AI-specific container.

---

## 8. AWS

Prefer a simple single-server deployment first.

Avoid Kubernetes and unnecessary microservices.

---

## 9. Performance Rules

- direct commands skip RAG;
- LLM is conditional;
- lecture content embeddings are precomputed;
- only runtime query is embedded;
- use small Top-K;
- CPU-only PyTorch;
- minimize dependencies.

---

## 10. Failure Handling

### Deepgram failure
Show STT error; allow retry.

### OpenAI failure
Direct/context commands should still work where possible.

### PostgreSQL failure
Demo navigation should still remain usable.

### Low intent confidence
Use fallback logic or ask for a repeated command.

---

## 11. Forbidden Architecture Patterns

- every command → LLM
- every command → RAG
- API keys in frontend
- DB-controlled React routing
- Neo4j
- GraphRAG
- local Whisper
- unnecessary service splitting
