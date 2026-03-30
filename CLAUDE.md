# CLAUDE.md

## Project Overview

**vamos-ecommerce** — a Next.js 16 e-commerce storefront with App Router.

- **Framework:** Next.js 16.2.1 + React 19
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 (uses `@import "tailwindcss"` in globals.css — not `@tailwind` directives)
- **State:** React built-in hooks only (`useState`, `useReducer`)
- **Data:** Mock data in `src/app/data/` — no backend or database yet
- **Path alias:** `@/*` → `./src/*`

---

## Project Structure

```
src/app/
├── components/       # Shared UI components (Header, ProductCard)
├── data/             # Mock data and TypeScript interfaces
├── cart/page.tsx     # Cart page
├── login/page.tsx    # Login page
├── products/page.tsx # Product listing page
├── page.tsx          # Home page
├── layout.tsx        # Root layout (Server Component)
└── globals.css       # Global styles + Tailwind import
```

**Existing pages:** `/` · `/products` · `/cart` · `/login`
**Existing components:** `Header.tsx` · `ProductCard.tsx`
**Existing data:** `src/app/data/products.ts` — exports `Product` interface and `products` array

---

## Core Rules

1. Follow the existing structure — check what already exists before creating anything new.
2. Do NOT install packages unless explicitly asked.
3. Do NOT rewrite entire files — only change what is required.
4. Prefer Server Components; add `"use client"` only when the component uses hooks or browser APIs.
5. Keep components small and single-responsibility (under 300 lines).
6. Keep logic separated from UI.

---

## Data

- All mock data lives in `src/app/data/` — do not hardcode values inside components.
- The `Product` interface is defined in `products.ts` — reuse it; do not redefine it elsewhere.
- When adding new data types, add the interface to the relevant file in `src/app/data/`.

---

## Styling

- Tailwind CSS v4 only — no inline styles, no CSS modules unless already present.
- Reuse existing utility patterns from the codebase before inventing new ones.
- Dark mode is handled via CSS variables in `globals.css`.

---

## State Management

- Use `useState` / `useReducer` locally — no Redux, Zustand, or Context unless asked.
- Cart state is currently local/mock — do not introduce global cart state without being asked.

---

## Naming Conventions

| Thing | Convention |
|---|---|
| Components | PascalCase (`ProductCard.tsx`) |
| Pages/layouts | lowercase (`page.tsx`, `layout.tsx`) |
| Variables | camelCase |
| Global constants | UPPER_CASE |

---

## Code Quality

- No unused imports.
- No `console.log` in final code.
- Handle empty states and edge cases (empty cart, no products matched, etc.).
- Use TypeScript interfaces for all props and data shapes.

---

## What Not To Do

- Do not restructure the project layout.
- Do not add abstraction layers for one-off needs.
- Do not mix data logic and UI in the same component.
- Do not assume standard Next.js behavior — this project uses Next.js 16 which may differ from common docs.

---

## If Unsure

Ask before making architectural decisions or adding new routes/components that don't follow the existing pattern.
