# AI & RAG

## 1. Goal

AI supports voice-driven lecture control.

It is not the main presentation topic.

---

## 2. Deepgram

Role:

```text
speech → text
```

Example:

```text
Audio:
"Show the Ant Design installation command"

Deepgram:
"Show the Ant Design installation command"
```

Deepgram does not classify intent and does not perform RAG.

---

## 3. PyTorch Intent Classification

Role:

```text
sentence → command type
```

Examples:

```text
"Next screen" → NEXT
"Go back" → PREVIOUS
"Show the install command" → SHOW_INSTALL
"Find an enterprise UI" → SEARCH
```

This model is trained directly in the project.

---

## 4. Intent Labels

Initial labels:

```text
NEXT
PREVIOUS
HOME
OPEN_DEMO
SHOW_INSTALL
SHOW_FEATURES
SHOW_ADVANTAGES
SHOW_DISADVANTAGES
SHOW_EXAMPLE
SHOW_COMPARISON
SEARCH
PLAY_VIDEO
PAUSE_VIDEO
```

Create multiple Korean utterance examples per label.

---

## 5. LLM

Do not call on every command.

Use only when:
- "this", "that", "the previous one" is ambiguous;
- previous context is required;
- multiple search constraints need interpretation.

Example:

Current library:
Ant Design

Utterance:
"Not that one. Show me something more customizable."

LLM output:
- exclude Ant Design
- search for highly customizable React UI libraries

---

## 6. Embedding

Use OpenAI Embedding API.

No local embedding model training.

### Precompute
lecture content → embedding → DB

### Runtime
search query → embedding → query vector

---

## 7. Vector RAG

```text
Query Vector
↓
pgvector
↓
semantic similarity search
↓
Top-K lecture content
```

Vector RAG does not train embeddings.

---

## 8. LLM + Vector RAG

LLM + Vector RAG is not GraphRAG.

LLM:
- interpret context
- rewrite/clarify query

Vector RAG:
- retrieve semantically related content

GraphRAG:
- traverse explicit graph relationships

No GraphRAG in this project.

---

## 9. Retrieval Example

Stored content:

```text
Ant Design is suitable for enterprise admin pages and data-heavy dashboards.
```

User:

```text
Show me something good for company admin software.
```

The exact term "Ant Design" is not required.
Embedding similarity can still retrieve the content.

---

## 10. Context Command Example

Current:

```text
current_library = ant-design
```

Utterance:

```text
Show the install command for this library.
```

Intent:

```text
SHOW_INSTALL
```

Use direct context lookup instead of Vector RAG.

---

## 11. Search Example

Utterance:

```text
Find something accessible and highly customizable.
```

Flow:

```text
SEARCH
↓
optional LLM clarification
↓
Embedding
↓
Vector RAG
↓
Top-K
↓
optional final LLM judgment
↓
React
```

---

## 12. Confidence

PyTorch should return confidence.

Example:

```json
{
  "intent": "SEARCH",
  "confidence": 0.93
}
```

Low confidence:
- use fallback;
- or request a repeated command.

Keep failure handling simple and stable.

---

## 13. API Failure

Deepgram failure:
- show STT error state.

OpenAI LLM failure:
- clear direct/context commands should still work.

Embedding failure:
- search fails gracefully;
- manual/demo navigation still works.

---

## 14. Role Summary

```text
Deepgram = what was said
PyTorch = what command it is
LLM = what ambiguous context means
Embedding = convert text to search vector
Vector RAG = find relevant lecture content
React = move/render the actual screen
```
