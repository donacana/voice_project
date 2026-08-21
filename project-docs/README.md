# React UI Voice Lecture - Cline Plan Package

This package is the source of truth for Cline during the **Plan phase**.

## Usage

1. Open the project root in VS Code.
2. Keep Ponytail at `.clinerules/ponytail.md`.
3. Put this `project-docs/` folder in the project root.
4. In Cline, select **Plan** mode.
5. Attach:
   - `CLINE_PLAN_PROMPT.md`
   - `MASTER_PLAN.md`
   - `ARCHITECTURE.md`
   - `DATABASE.md`
   - `AI_RAG.md`
   - `FRONTEND_UI.md`
   - `IMPLEMENTATION_STEPS.md`
   - `TEST_CHECKLIST.md`
   - `CLINE_RULES.md`
   - this `README.md`
6. Ask Cline to review the plan only.
7. Do not allow implementation until the plan is approved.
8. After approval, switch to Agent mode and follow `IMPLEMENTATION_STEPS.md`.
9. Each step must pass `TEST_CHECKLIST.md` before continuing.

## Core Principle

The project is primarily:
- a React UI library comparison lecture,
- controlled by voice,
- with RAG used only when content search is actually needed.

The backend, database, and AI stack must remain lightweight and support the frontend rather than become the project itself.
