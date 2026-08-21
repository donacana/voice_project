# IMPLEMENTATION STEPS

## Rules

- Do not reorder phases without approval.
- Test each step before continuing.
- Do not continue while the current phase is broken.

---

# PHASE 0 - Plan Validation

1. Read all design documents.
2. Check conflicts.
3. Propose final folder structure.
4. Get user approval.

No implementation before approval.

---

# PHASE 1 - Project Skeleton

5. Create root structure:

```text
project-root/
├─ frontend/
├─ backend/
├─ project-docs/
├─ docker-compose.yml
├─ .env.example
└─ README.md
```

Finalize detailed structure during Plan review.

---

# PHASE 2 - Frontend Base

6. Create React + Vite app.
7. Verify dev server.
8. Verify production build.
9. Create base layout and Intro screen.

---

# PHASE 3 - 10 UI Libraries

10. Analyze package/dependency conflicts first.
11. Material UI demo.
12. Ant Design demo.
13. Chakra UI demo.
14. shadcn/ui demo.
15. daisyUI demo.
16. Headless UI demo.
17. React Aria demo.
18. Radix UI demo.
19. Base UI demo.
20. Mantine demo.

Each demo:
- directly reachable;
- shows representative components;
- no cross-demo breakage;
- build passes.

---

# PHASE 4 - Lecture UI

21. Library overview.
22. Dynamic lecture content panel.
23. Voice status indicator.
24. Frontend action mapping.
25. Verify screen switching with minimal temporary test data.

Do not build a permanent mock subsystem.

---

# PHASE 5 - Backend Base

26. Create FastAPI app.
27. Add health endpoint.
28. Verify `/docs`.
29. Configure CORS.
30. Connect React → FastAPI.

---

# PHASE 6 - PostgreSQL + pgvector

31. Add PostgreSQL + pgvector Docker service.
32. Verify DB connection.
33. Verify pgvector extension.
34. Implement DB connection.
35. Create 3 tables:
   - ui_libraries
   - lecture_contents
   - embeddings
36. Test insert/select.

---

# PHASE 7 - Lecture Data

37. Create 10 library records.
38. Create lecture content.

Suggested types:
- introduction
- install
- features
- advantages
- disadvantages
- use_case
- example
- comparison
- components

Only create useful content.

---

# PHASE 8 - Embedding

39. Configure OpenAI API key.
40. Implement embedding client.
41. Implement seed script.
42. Insert library data.
43. Insert lecture content.
44. Embed lecture content.
45. Store vectors.

---

# PHASE 9 - Vector Search

46. Implement pgvector similarity search.
47. Add Top-K retrieval.
48. Build Vector RAG service.
49. Test semantic queries.

---

# PHASE 10 - PyTorch Intent

50. Finalize intent labels.
51. Build training dataset.
52. Implement preprocessing.
53. Implement lightweight classifier.
54. Train on CPU.
55. Evaluate.
56. Save checkpoint.
57. Load checkpoint in FastAPI.
58. Verify inference.

---

# PHASE 11 - Deepgram

59. Configure Deepgram API.
60. Implement STT integration.
61. Test real-time/streaming approach.
62. Add browser microphone integration.
63. Verify Korean speech recognition.

---

# PHASE 12 - Context

64. Implement current lecture context.
65. Update context on screen transitions.
66. Implement context commands.
67. Verify:
   "Show the install command for this library."

---

# PHASE 13 - LLM Fallback

68. Implement OpenAI LLM client.
69. Define fallback conditions.
70. Use structured output.
71. Verify clear commands skip LLM.

---

# PHASE 14 - Full Router

72. Direct route.
73. Context route.
74. Search route.
75. LLM fallback route.
76. Verify route separation.

---

# PHASE 15 - End-to-End Voice Lecture

77. Voice NEXT flow.
78. Voice SHOW_INSTALL flow.
79. Voice SEARCH flow.
80. Ambiguous context + SEARCH flow.
81. Verify main lecture can run without mouse.

---

# PHASE 16 - Docker

82. Frontend Dockerfile.
83. Backend Dockerfile.
84. PostgreSQL + pgvector service.
85. Integrate Docker Compose.
86. Verify `docker compose up`.

---

# PHASE 17 - Production

87. Production frontend build.
88. Production backend config.
89. Secret/env validation.
90. API key leak check.
91. restart/recovery test.

---

# PHASE 18 - AWS

92. Prepare AWS server.
93. Install Docker.
94. Upload project.
95. Configure `.env`.
96. Run Docker Compose.
97. Verify public access.
98. Verify HTTPS/microphone requirements.
99. Verify Deepgram/OpenAI/DB.
100. Final rehearsal.
