# TEST CHECKLIST

## Frontend
- [ ] React dev server works
- [ ] Vite build works
- [ ] Intro
- [ ] Overview
- [ ] all 10 demos
- [ ] no console errors
- [ ] no major CSS conflicts
- [ ] lecture content panel works

## Backend
- [ ] FastAPI starts
- [ ] `/docs`
- [ ] health endpoint
- [ ] CORS
- [ ] React → FastAPI
- [ ] errors do not crash entire server

## Database
- [ ] PostgreSQL
- [ ] pgvector
- [ ] ui_libraries
- [ ] lecture_contents
- [ ] embeddings
- [ ] foreign keys
- [ ] 10 libraries inserted
- [ ] lecture content inserted
- [ ] vectors inserted

## Embedding
- [ ] OpenAI key via env
- [ ] embedding generated
- [ ] vectors stored
- [ ] duplicate seed avoided
- [ ] runtime query embedding works

## Vector RAG

### Query A
"enterprise admin UI"
Expected: Ant Design-related content in Top-K.

### Query B
"accessible UI"
Expected: React Aria / Radix UI or similarly appropriate content.

### Query C
"highly customizable UI"
Expected: Radix UI / Base UI / shadcn-related content.

### Query D
"many components and hooks"
Expected: Mantine-related content.

- [ ] Top-K quality acceptable
- [ ] score returned
- [ ] no single irrelevant library dominates all results

## PyTorch Intent

NEXT:
- [ ] Korean next-screen variants

PREVIOUS:
- [ ] Korean back/previous variants

SHOW_INSTALL:
- [ ] Korean install-code variants

SHOW_EXAMPLE:
- [ ] Korean example-code variants

SEARCH:
- [ ] Korean semantic-search variants

- [ ] confidence returned
- [ ] CPU inference
- [ ] checkpoint load

## Deepgram
- [ ] key via env
- [ ] browser mic permission
- [ ] Korean recognition
- [ ] acceptable latency
- [ ] graceful error state

## Context

Current:
Ant Design

Command:
"Show the install command for this library."

Expected:
Ant Design install content.

- [ ] current_library updates
- [ ] previous_library updates
- [ ] current_content_type updates

## LLM Fallback

Current:
Ant Design

Command:
"Not that one. Show something more customizable."

Expected:
- Ant Design excluded
- clear rewritten search query

- [ ] NEXT does not call LLM
- [ ] clear SHOW_INSTALL does not call LLM
- [ ] ambiguous search may call LLM

## End-to-End

Scenario 1:
"Open Ant Design."
→ Ant Design demo

Scenario 2:
"Show the install command for this library."
→ Ant Design install content

Scenario 3:
"Find something good for enterprise admin pages."
→ Vector RAG → appropriate result

Scenario 4:
"Not that one. Show something more customizable."
→ LLM fallback → Vector RAG → appropriate alternative

## Docker
- [ ] frontend image
- [ ] backend image
- [ ] postgres/pgvector
- [ ] compose network
- [ ] frontend → backend
- [ ] backend → postgres
- [ ] external API access

## Security
- [ ] `.env` ignored
- [ ] `.env.example`
- [ ] no secret in frontend bundle
- [ ] no secret in logs
- [ ] no hardcoded DB password

## AWS
- [ ] Docker installed
- [ ] Compose up
- [ ] public access
- [ ] HTTPS reviewed
- [ ] browser mic works
- [ ] Deepgram works
- [ ] OpenAI works
- [ ] DB works
- [ ] restart works

## Final Rehearsal
- [ ] all 10 demos
- [ ] 10 consecutive voice commands
- [ ] core flow without mouse
- [ ] retry behavior for STT failure
- [ ] fallback when RAG fails
- [ ] API quota/balance checked before presentation
