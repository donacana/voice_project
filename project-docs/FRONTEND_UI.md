# FRONTEND UI

## 1. Purpose

The frontend is the center of the project.

It must demonstrate 10 different React UI development approaches in real screens.

---

## 2. Technology

- React
- Vite

Keep routing/dependencies minimal.

---

## 3. Main Screen Flow

```text
Intro
↓
Library Overview
↓
Library Demo
↓
Dynamic Lecture Content Panel
```

---

## 4. Demo Components

- MaterialUIDemo
- AntDesignDemo
- ChakraUIDemo
- ShadcnDemo
- DaisyUIDemo
- HeadlessUIDemo
- ReactAriaDemo
- RadixUIDemo
- BaseUIDemo
- MantineDemo

---

## 5. Comparison Principle

Use comparable UI patterns where useful:

- Button
- Form
- Login
- Modal
- Navigation
- Table
- Card
- Input

Do not force every library into the exact same example if that hides its strengths.

---

## 6. Lecture Content Panel

Possible content:
- introduction
- installation
- features
- advantages
- disadvantages
- use cases
- code example
- comparison

Example:

```text
Ant Design demo
↓
"Show the install command"
↓
show install content panel
```

---

## 7. Voice Status

Show minimal status:

- Listening
- Processing
- Searching
- Done
- Error

Keep it visible but non-intrusive.

---

## 8. Context Sync

Example:

```json
{
  "library": "ant-design",
  "screen": "demo",
  "contentType": "introduction"
}
```

Update context whenever the visible lecture state changes.

---

## 9. Action Mapping

Expected actions:

```text
NEXT
PREVIOUS
OPEN_DEMO
SHOW_CONTENT
SHOW_SEARCH_RESULT
HOME
PLAY_VIDEO
PAUSE_VIDEO
```

React executes them.

---

## 10. Demo Mapping

Keep routing/component mapping in frontend code.

Do not store React component names in PostgreSQL.

---

## 11. Example Lecture Flow

Current:
Ant Design demo

Voice:
"Show the install command."

Frontend:
- keep demo open
- show install panel

Voice:
"Next library."

Frontend:
- switch demo
- reset content panel

Voice:
"Find something good for enterprise admin pages."

Frontend:
- show Searching
- receive backend result
- switch to result demo
- show related content

---

## 12. Design Rules

- presentation-first
- no unnecessary dashboard complexity
- clean and readable
- visually compare libraries
- voice-control state should be clear
- core lecture should work without mouse use

---

## 13. Build Requirement

`npm run build` must succeed.

No console errors.

---

## 14. Dependency Isolation

Avoid unnecessary cross-library mixing.

If CSS/package conflicts occur:
- isolate the affected demo;
- solve locally;
- do not replace the whole architecture.
