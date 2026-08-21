# CLINE RULES

## Architecture
1. Keep React + Vite.
2. Keep FastAPI.
3. Use PostgreSQL + pgvector only.
4. Deepgram handles STT only.
5. PyTorch handles intent classification only.
6. OpenAI LLM is context fallback only.
7. OpenAI Embedding creates vectors.
8. Use Vector RAG only.
9. Do not add Neo4j.
10. Do not add GraphRAG.
11. Do not add a separate RAG Router service.
12. Do not add Redis without explicit approval.
13. Do not add local Whisper.

## Frontend
14. React owns actual screen navigation.
15. Do not store React component names in DB.
16. Keep the 10 demos reasonably isolated.
17. Avoid unnecessary cross-library mixing.
18. Do not add another frontend framework.

## Backend
19. FastAPI is the central API.
20. Do not call LLM for every command.
21. Do not call RAG for every command.
22. Keep Direct / Context / Search routes separate.
23. Keep secrets on backend only.

## Database
24. Default schema has 3 tables.
25. Do not add categories table without approval.
26. Do not add demo_components table without approval.
27. Ask before schema expansion.

## AI
28. Do not train a PyTorch embedding model.
29. Keep intent model CPU-friendly.
30. Separate training/evaluation/inference responsibilities.
31. Clear search queries may skip LLM.

## Deployment
32. Use Docker Compose.
33. Do not use Kubernetes.
34. Avoid unnecessary microservices.
35. Optimize for a low-resource AWS server.
36. Do not download large local AI models.

## Workflow
37. Test after each step.
38. Do not continue after failed tests.
39. Do not hide errors.
40. Do not silently change architecture.
41. Ask before changing the stack.
42. Justify new dependencies.
43. Do not hardcode secrets.
44. Do not commit `.env`.
45. Provide `.env.example`.

## Plan Mode
46. No file creation.
47. No file modification.
48. No terminal commands.
49. No package installation.
50. Report conflicts first.
51. Wait for user approval before implementation.
