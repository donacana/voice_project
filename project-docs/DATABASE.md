# DATABASE

## 1. Purpose

The database is primarily a **Vector RAG content store**.

It is not intended to become a large business database.

Use only 3 core tables.

---

## 2. ui_libraries

Purpose:
Store basic information for the 10 libraries.

Fields:

```text
id
name
slug
category
description
created_at
```

Example:

```text
id: 2
name: Ant Design
slug: ant-design
category: Design System
description: React UI library suited to enterprise/admin interfaces
```

---

## 3. lecture_contents

Purpose:
Store content shown during the lecture.

Fields:

```text
id
library_id
title
content
content_type
display_order
created_at
```

Possible `content_type` values:

- introduction
- install
- features
- advantages
- disadvantages
- use_case
- example
- comparison
- components

---

## 4. embeddings

Purpose:
Store the embedding vector for each lecture content item.

Fields:

```text
id
content_id
embedding
embedding_model
created_at
```

Initial design:
one lecture content → one embedding.

---

## 5. Relationships

```text
ui_libraries.id
  ↓
lecture_contents.library_id

lecture_contents.id
  ↓
embeddings.content_id
```

---

## 6. DBML

```dbml
Table ui_libraries {
  id integer [pk, increment]
  name varchar [not null, unique]
  slug varchar [not null, unique]
  category varchar [not null]
  description text
  created_at timestamp
}

Table lecture_contents {
  id integer [pk, increment]
  library_id integer [not null]
  title varchar [not null]
  content text [not null]
  content_type varchar [not null]
  display_order integer
  created_at timestamp
}

Table embeddings {
  id integer [pk, increment]
  content_id integer [not null, unique]
  embedding vector [not null]
  embedding_model varchar
  created_at timestamp
}

Ref: lecture_contents.library_id > ui_libraries.id
Ref: embeddings.content_id - lecture_contents.id
```

---

## 7. Why No categories Table

There are only 10 libraries and a few presentation categories.

A separate category table adds little value here.

Keep `category` directly in `ui_libraries`.

---

## 8. Why No demo_components Table

React owns demo routing.

Example:

```javascript
demoMap = {
  "material-ui": MaterialUIDemo,
  "ant-design": AntDesignDemo
}
```

Do not store React component names in the DB.

---

## 9. Seed Process

```text
seed_data.py
↓
insert ui_libraries
↓
insert lecture_contents
↓
call OpenAI Embedding
↓
store vectors in embeddings
```

Do not re-embed static lecture content on every presentation run.

---

## 10. Content Quality

Weak:

```text
Ant Design is a React UI library.
```

Better:

```text
Ant Design is a design-system-based React UI library suited to enterprise
admin pages, dashboards, tables, forms, and data-heavy interfaces.
```

Retrieval quality depends heavily on content quality.

---

## 11. Runtime Search

```text
User query
↓
OpenAI Embedding
↓
Query Vector
↓
pgvector similarity search
↓
Top-K lecture contents
↓
associated UI library
```

Start with Top-K = 3.

---

## 12. DB Does Not

The database does not:
- render React screens;
- classify intents;
- perform STT;
- interpret context with an LLM.

---

## 13. Presentation Summary

"The database stores the 10 libraries, lecture content, and embedding vectors. pgvector is used to find the lecture content most semantically related to the presenter's request."
