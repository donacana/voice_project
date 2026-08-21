# FINAL FRONTEND REDESIGN BEFORE PHASE 15

## IMPORTANT

This task happens BEFORE PHASE 15.

PHASE 15 will be the final integration and voice-command validation after this redesign is complete.

Do NOT start PHASE 15 during this task.

Do NOT rebuild Docker.

Development must run locally:
- PostgreSQL only through Docker if needed
- FastAPI through the existing local `.venv`
- React/Vite through the existing local `node_modules`

Disk space is limited.
Do NOT install unnecessary large dependencies.

---

# 1. Final Project Goal

The project is NOT intended to be a collection of 10 generic React component demos.

The final project should behave like a real technical lecture based on the presentation structure of:

"10 Best React UI Libraries for 2026"

The presentation should explain:

1. Why React UI library selection matters
2. How the libraries can be divided into categories
3. What makes each library different
4. What each library is good at
5. What its limitations or trade-offs are
6. When a developer should choose it
7. How it differs from other libraries in the same category
8. A final decision guide for selecting a library

Voice AI is used to control and explore this lecture.

---

# 2. Keep Exactly These 10 Libraries

The lecture must cover exactly these 10 libraries:

## Category 1 — Design Systems

1. Material UI
2. Ant Design
3. Chakra UI

## Category 2 — Tailwind-Based

4. shadcn/ui
5. daisyUI
6. Headless UI

## Category 3 — Unstyled / Primitives

7. React Aria
8. Radix UI
9. Base UI

## Category 4 — Fast Development / All-in-One

10. Mantine

Do NOT add React Admin.

---

# 3. Main Presentation Structure

The frontend should follow this lecture flow:

INTRO
→ Category Overview
→ Category 1 lecture
→ Category 2 lecture
→ Category 3 lecture
→ Category 4 lecture
→ Decision Guide
→ Closing

The user should be able to navigate this presentation using both buttons and voice commands.

---

# 4. Category Overview Screen

Create one clear overview screen showing all four categories.

Example:

Design Systems
- Material UI
- Ant Design
- Chakra UI

Tailwind-Based
- shadcn/ui
- daisyUI
- Headless UI

Unstyled / Primitives
- React Aria
- Radix UI
- Base UI

Fast Development / All-in-One
- Mantine

Each category should visually communicate WHY those libraries belong together.

Do not simply display ten unrelated buttons.

---

# 5. Category Lecture Screens

Create a lecture screen for each category.

For categories containing three libraries, show the three libraries together so the presenter can compare them.

Example for Design Systems:

[ Material UI ] [ Ant Design ] [ Chakra UI ]

Each library card should contain:

- Library name
- One-line identity
- Representative visual/example
- Core strength
- Main trade-off
- Recommended use case
- "Official Site" action
- "Details" action if necessary

The purpose of the screen is comparison and teaching.

---

# 6. Remove Generic Repeated Demo Pattern

The current implementation repeatedly shows:

- Input
- Select
- Buttons
- Generic feature list

for almost every library.

This does NOT explain the differences between the libraries well enough.

Replace generic repeated demos with examples that demonstrate the UNIQUE reason each library exists.

---

# 7. Library-Specific Teaching Content

## Material UI

Teach:

- Based on Google's Material Design
- Large production-ready component ecosystem
- Strong theming system
- Good for rapid development
- Recognizable Material visual language can become a customization trade-off

Representative visual:

Show a clear Material-style card/button/navigation example.

Do NOT use only a generic input/select demo.

---

## Ant Design

Teach:

- Enterprise-focused React UI system
- Strong for admin interfaces and dashboards
- Data-heavy interfaces
- Forms, tables, filtering and business UI patterns
- Strong TypeScript ecosystem

Representative visual:

Use an admin/dashboard-style example.

For example:

- data table
- status badges
- filters
- business form

The audience should immediately understand why Ant Design is useful for enterprise applications.

---

## Chakra UI

Teach:

- Developer experience focused
- Accessible component foundation
- Composable components
- Convenient styling/customization
- Useful for building a custom design system quickly

Representative visual:

Show how a simple component can be customized clearly and quickly.

Do not describe Chakra only as "accessible".

---

## shadcn/ui

Teach:

- Different philosophy from a traditional component package
- Components are added to the project source code
- Developer owns the component code
- High customization freedom
- Commonly used with Tailwind CSS
- Accessible primitive foundations can vary depending on the component setup

Representative visual:

Show the concept:

Traditional library:
import component from dependency

shadcn/ui:
component source exists inside your project
→ you can edit it directly

The key lesson is CODE OWNERSHIP.

Do not make the main demo another generic input/select.

---

## daisyUI

Teach:

- Component classes built on top of Tailwind CSS
- Reduces long Tailwind utility class strings
- Quick styling
- Theme support
- Keeps a Tailwind-oriented workflow

Representative visual:

Show a direct comparison:

Tailwind only:

class="inline-flex items-center justify-center px-4 py-2 ..."

daisyUI:

class="btn btn-primary"

This comparison should be visually obvious.

---

## Headless UI

Teach:

- Unstyled accessible components
- Behavior and interaction are provided
- Styling is controlled by the developer
- Works naturally with Tailwind CSS
- Useful for custom interfaces

Representative visual:

Show:

Unstyled component
→ developer styling
→ final custom UI

The audience should understand what "headless" means.

---

## React Aria

Teach:

- Accessibility-first
- Keyboard navigation
- Focus management
- Screen-reader support
- Behavior and accessibility rather than visual design
- Useful for creating accessible custom components

Representative visual:

Show a keyboard/accessibility interaction example.

For example:

Keyboard navigation
Tab / Arrow keys
→ focus moves correctly

The example must explain accessibility, not merely show another button.

---

## Radix UI

Teach:

- Low-level accessible UI primitives
- Dialog, Popover, Dropdown, Tabs, etc.
- Unstyled
- Full styling control
- Strong foundation for custom design systems

Representative visual:

Use Dialog or Popover.

Show conceptually:

Radix primitive
→ custom styling
→ design system component

---

## Base UI

Teach:

- Unstyled React components/primitives
- Flexible composition
- Accessibility-focused foundations
- Designed to work with different styling approaches
- Useful for developers who want strong behavior without a predefined visual design

Representative visual:

Demonstrate the same primitive with two different visual styles.

The difference from a complete design system should be obvious.

---

## Mantine

Teach:

- All-in-One React UI solution
- Large component collection
- Hooks included
- Useful utilities
- Fast application development
- Good when productivity is more important than building everything from primitives

Representative visual:

Show:

Component
+
Hook
+
Utility

as one integrated ecosystem.

Do NOT leave Mantine in a runtime error state.

---

# 8. Official Website Integration

Every library must have an official website URL stored in the frontend lecture data.

Add an "Official Site" action.

The official website MUST open in a NEW TAB.

Never replace the lecture application with the external website.

Concept:

Lecture application remains open
+
Official website opens separately

This allows the presenter to say:

"Ant Design 공식 사이트 열어줘"

and inspect the real library website while preserving the lecture system.

---

# 9. Voice Commands

Preserve the existing PHASE 14 voice pipeline.

Do NOT create a second navigation system.

Reuse the existing:

- LectureContext
- currentScreen
- currentLibrary
- currentContentType
- navigate()
- handleLibrarySelect()
- handleNextLibrary()
- handlePrevLibrary()
- handleVoiceAction()
- backend action normalization

Extend the existing actions only where necessary.

The presentation should support commands equivalent to:

- "다음"
- "이전"
- "홈으로"
- "다음 카테고리"
- "이전 카테고리"
- "Material UI 보여줘"
- "Ant Design 보여줘"
- "Radix UI 자세히 보여줘"
- "공식 사이트 열어줘"
- "Ant Design 공식 사이트 열어줘"
- "이 라이브러리 특징 보여줘"

Do not trigger navigation while the microphone is idle.

---

# 10. Push-to-Talk Safety

The lecture must NOT continuously interpret normal presentation speech as commands.

Final behavior:

Idle
→ presenter talks normally
→ NOTHING happens

User presses Start Listening
→ microphone/STT begins
→ one command is recognized
→ command is executed
→ listening automatically returns to idle

This prevents normal lecture sentences from accidentally changing screens.

Do NOT implement always-on command recognition.

---

# 11. AI / Vector RAG Role

The AI should support the lecture, not control everything.

Direct commands such as:

NEXT
PREVIOUS
HOME
OPEN_LIBRARY
OPEN_OFFICIAL_SITE

should execute directly without unnecessary LLM calls.

Vector RAG should be used for lecture questions such as:

- "관리자 페이지에는 어떤 라이브러리가 좋아?"
- "MUI랑 Ant Design 차이가 뭐야?"
- "직접 디자인 시스템 만들려면 어떤 게 좋아?"
- "Tailwind를 쓰면 어떤 라이브러리를 고르면 돼?"
- "접근성이 중요한 경우에는?"

Use the existing lecture material/embedding/search architecture.

Do NOT create another RAG system.

---

# 12. Decision Guide Screen

Create a final decision screen.

It should clearly teach:

Need a complete design system?
→ Material UI / Ant Design / Chakra UI

Using Tailwind?
→ shadcn/ui / daisyUI / Headless UI

Building your own design system?
→ React Aria / Radix UI / Base UI

Need rapid development / All-in-One?
→ Mantine

Also provide short distinctions inside each branch.

Example:

Enterprise / data-heavy
→ Ant Design

Material Design ecosystem
→ Material UI

Developer-friendly customizable design system
→ Chakra UI

Code ownership
→ shadcn/ui

Simplified Tailwind classes
→ daisyUI

Headless Tailwind components
→ Headless UI

Accessibility behavior
→ React Aria

Accessible primitives
→ Radix UI / Base UI

All-in-One productivity
→ Mantine

---

# 13. Fix Existing Error States

Current screenshots show several pages displaying:

"Error occurred"

This must NOT remain in the final presentation.

Investigate why VoiceStatusIndicator enters an error state when switching libraries.

Do NOT hide real errors with CSS.

Fix the actual state-management/error cause.

Expected default state:

Ready to listen

When the page changes normally, it should remain:

Ready to listen

unless a real microphone/STT/backend error occurs.

---

# 14. Mantine Runtime Error

The current Mantine page has produced errors similar to:

- render2 is not a function
- Context.Consumer multiple children warning

Resolve the actual React/Mantine compatibility issue.

Do NOT upgrade the entire application to React 19 only for Mantine.

Prefer the compatible Mantine version for the existing React version.

If the final lecture design no longer requires importing Mantine runtime components, it is acceptable to replace the live Mantine demo with a lecture/example representation and remove the incompatible dependency.

Do not leave runtime errors in the browser console.

---

# 15. Dependency Strategy

The presentation does NOT require all ten UI libraries to be installed as runtime dependencies.

If a library is only being taught conceptually:

- use our React/CSS lecture UI
- show a representative example
- provide the official website link

Do not keep an npm dependency only to show one generic button.

Keep an actual library dependency only when it adds meaningful educational value.

Before removing any package:
- confirm it is no longer imported
- preserve existing application functionality
- update package.json/package-lock.json safely

Do NOT perform broad dependency deletion blindly.

---

# 16. Visual Design

Keep the existing dark presentation style.

Improve it into a lecture/presentation interface.

Priorities:

- large readable text
- strong category titles
- clear visual hierarchy
- comparison cards
- minimal text per card
- no tiny component demos
- no horizontal overflow
- no raw code comments rendered on screen
- no broken layouts
- no browser console runtime errors

The UI should be readable from a classroom projector.

---

# 17. Content Language

The application UI may keep library names and technical terms in English.

Lecture explanations should be easy to present in Korean.

Keep the content concise enough that the presenter explains the details verbally.

Do not turn each screen into a large article.

---

# 18. Do Not Break Existing Backend Features

Do NOT redesign:

- FastAPI architecture
- PostgreSQL schema unless strictly necessary
- STT service
- Vector RAG
- LLM fallback
- PHASE 14 routing logic

This task is mainly a FINAL PRESENTATION FRONTEND + CONTENT restructuring task.

Preserve all working PHASE 14 functionality.

---

# 19. Local Development Only

Do NOT rebuild Docker during this redesign.

Use:

Frontend:
npm run dev

Backend:
existing local .venv + uvicorn

Database:
existing PostgreSQL container only if required

Do not download CUDA/GPU packages.

This project remains CPU-only.

---

# 20. Validation Before PHASE 15

After the redesign is complete, verify:

- frontend TypeScript passes
- npm run build passes
- all 10 library lecture screens render
- all 4 category screens render
- no console runtime errors
- NEXT works
- PREVIOUS works
- category navigation works
- direct library selection works
- official site opens in a new tab
- VoiceStatusIndicator defaults correctly
- microphone idle does not execute commands
- Push-to-Talk starts correctly
- existing backend connection still works
- Vector RAG architecture is preserved

Do NOT call this PHASE 15.

This is the final redesign BEFORE PHASE 15.

When everything above is complete:

STOP.

Report:

1. files modified
2. new screen structure
3. library teaching examples created
4. voice commands added/changed
5. dependencies removed or preserved
6. errors fixed
7. frontend build result
8. remaining issues

PHASE 15 will be started separately after I review the redesigned frontend.