# MASTER PLAN

## 1. Project

**React UI Library Voice Lecture Project**

Presentation topic:

**10 React UI Libraries**

The final result is a real web-based lecture application, not only a PowerPoint presentation.

The presenter should be able to control the lecture mostly by voice.

---

## 2. Final Goal

During the lecture, voice commands should support:

- next screen
- previous screen
- open a specific library demo
- show installation commands
- show features
- show advantages/disadvantages
- show examples
- compare libraries
- search for a library by use case
- return home
- play/pause media if media is later included

Execution flow:

1. Speech is converted to text.
2. PyTorch classifies the command intent.
3. Simple commands are executed directly.
4. Ambiguous context uses an LLM only when necessary.
5. Search commands use Embedding + Vector RAG.
6. PostgreSQL + pgvector returns relevant lecture content.
7. FastAPI returns the result to React.
8. React performs the actual screen update.

Final deployment target: AWS using Docker Compose.

---

## 3. Project Priority

The main focus is:

1. comparing 10 different React UI approaches;
2. voice-driven lecture control.

AI infrastructure is supporting functionality, not the presentation topic.

Therefore:
- keep backend simple;
- keep database simple;
- avoid unnecessary services;
- optimize for a small AWS server;
- prefer external APIs over large local models.

---

## 4. UI Libraries

### Design System
- Material UI
- Ant Design
- Chakra UI

### Tailwind-related
- shadcn/ui
- daisyUI
- Headless UI

### Unstyled / Primitive
- React Aria
- Radix UI
- Base UI

### All-in-One
- Mantine

Notes:
- These categories are presentation-oriented, not strict taxonomy.
- Headless UI is fundamentally headless/unstyled.
- daisyUI is Tailwind-based rather than React-specific.
- The purpose is to compare different UI development approaches.

---

## 5. Selection Criteria

The 10 libraries are selected based on:

### A. Ecosystem interest
Use GitHub stars, community size, documentation quality, and ecosystem visibility as objective signals.

### B. Low conceptual overlap
The set should represent different ways of building UI:
- complete design systems,
- Tailwind-oriented approaches,
- source-owned component approaches,
- headless/unstyled components,
- accessibility-first primitives,
- all-in-one ecosystems.

---

## 6. Frontend

Technology:
- React
- Vite

React responsibilities:
- lecture UI
- 10 demo screens
- installation-code view
- feature view
- comparison view
- voice status
- search result display
- actual navigation and screen rendering

Vite responsibilities:
- dev server
- build tooling
- production build

---

## 7. Backend

Technology:
- FastAPI

Responsibilities:
- receive frontend requests
- connect to Deepgram
- run PyTorch intent inference
- call OpenAI LLM when needed
- call OpenAI Embedding
- query PostgreSQL
- run pgvector similarity search
- manage lecture context
- return structured actions to React

FastAPI must not render the UI itself.

---

## 8. Speech-to-Text

Use:

**Deepgram Speech-to-Text API**

Reason:
- real-time streaming is important;
- no local Whisper model;
- lower local CPU/RAM/disk requirements;
- suitable for voice-driven presentation control.

---

## 9. PyTorch Intent Classification

This is the only model trained directly in the project.

PyTorch is **not** used to create embedding vectors.

Its job is to classify command type.

Expected intents:

- NEXT
- PREVIOUS
- HOME
- OPEN_DEMO
- SHOW_INSTALL
- SHOW_FEATURES
- SHOW_ADVANTAGES
- SHOW_DISADVANTAGES
- SHOW_EXAMPLE
- SHOW_COMPARISON
- SEARCH
- PLAY_VIDEO
- PAUSE_VIDEO

The model must be lightweight and CPU-friendly.

---

## 10. OpenAI LLM

Use an OpenAI API model.

The LLM is not called for every command.

Use it only for:
- ambiguous references,
- previous-context interpretation,
- multi-condition queries,
- query rewriting.

Examples:
- "Show me something else than the previous one."
- "Show me something more customizable than this."
- "Show me something like the last one but better for enterprise."

---

## 11. OpenAI Embedding

Use OpenAI Embedding API.

Do not train an embedding model locally.

Two uses:

### Preprocessing
lecture content → embedding → vector → PostgreSQL

### Runtime search
user query → embedding → query vector → pgvector search

---

## 12. Vector RAG

Use only Vector RAG.

Purpose:

query vector
→ semantic similarity search
→ relevant lecture content
→ related UI library
→ FastAPI
→ React

Top-K search may be used when needed.

---

## 13. Why No GraphRAG

GraphRAG is useful when the system must traverse explicit multi-hop relationships.

This project mainly searches:
- enterprise suitability,
- accessibility,
- customization,
- installation,
- examples,
- pros/cons,
- library comparisons.

These are well suited to semantic retrieval.

Adding Neo4j + GraphRAG would increase complexity without enough benefit.

---

## 14. Database

Use:
- PostgreSQL
- pgvector

The DB is mainly a **content store for Vector RAG**.

Keep only 3 core tables:
- `ui_libraries`
- `lecture_contents`
- `embeddings`

---

## 15. Runtime Routing

Do not send every command through RAG.

### Direct command
"Next screen"
→ STT
→ PyTorch NEXT
→ React

### Context command
"Show the install command for this library"
→ STT
→ PyTorch SHOW_INSTALL
→ current library context
→ content lookup
→ React

### Search command
"Find a good enterprise UI library"
→ STT
→ PyTorch SEARCH
→ Embedding
→ Vector RAG
→ React

### Ambiguous search
"Not that one. Show me something more customizable."
→ STT
→ PyTorch SEARCH
→ LLM context interpretation
→ Embedding
→ Vector RAG
→ React

---

## 16. AWS Constraints

Target a low-cost / low-resource AWS environment.

Avoid:
- local Whisper
- Neo4j
- GraphRAG
- unnecessary Redis
- unnecessary microservices
- GPU requirements
- large local pretrained models

Docker Compose services:
- frontend
- backend
- postgres

External APIs:
- Deepgram
- OpenAI

---

## 17. Secrets

Use `.env`.

Expected variables:
- DEEPGRAM_API_KEY
- OPENAI_API_KEY
- DATABASE_URL
- POSTGRES_USER
- POSTGRES_PASSWORD
- POSTGRES_DB

Rules:
- never expose API keys in frontend code;
- never hardcode secrets;
- never commit `.env`;
- provide `.env.example`.

---

## 18. Final Demo Scenario

Presenter:
"Open Ant Design."

→ Ant Design demo

Presenter:
"Show the install command for this library."

→ Ant Design installation content

Presenter:
"Find a library suitable for enterprise admin pages."

→ Vector RAG
→ Ant Design-related result

Presenter:
"Not that one. Show me something more customizable."

→ LLM context interpretation
→ Vector RAG
→ Radix UI / Base UI / another appropriate candidate

Goal:
The main lecture flow should work without mouse interaction.
