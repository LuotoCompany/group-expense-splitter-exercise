# AI Coding Agent Instructions

This repo is an **AI-assisted exercise project** for an Expense Splitter app with two main parts:

- `ui-proto/`: a Vite/React **design prototype** that serves as a concrete example for UX, layout, and domain behavior. It is not the production app.
- `frontend/`: a fresh `create-next-app` (App Router) shell where the final product will live and where new work should happen.
- `.devcontainer/`: dev environment (Postgres, Redis, Node) — you can largely ignore infra details unless asked.

## Big Picture & Architecture

- Treat `ui-proto/src/App.tsx` and its components as the **reference implementation** for UX, domain types, and client-side behavior; it is an example to copy from, not the final home for features.
- The long-term target is a **Next.js app in `frontend/`**, likely with server-backed persistence later. For now, mirroring the prototype client logic into Next is acceptable, but new features should be implemented in `frontend/`.
- Shared domain concepts:
  - `Person`, `Expense`, `Split`, `Settlement` interfaces are defined in `ui-proto/src/App.tsx` and used across components.
  - Core flows: add expenses (`AddExpense`), list expenses (`ExpenseList`), compute balances & settlements (`BalanceSummary`).
- Keep new work **cohesive with this domain model**; don’t invent alternate shapes unless explicitly requested.

## Developer Workflows

- **UI prototype (`ui-proto/` – design/example only):**
  - Install: `cd ui-proto && npm install`
  - Run dev server: `npm run dev` (Vite, default port 5173).
  - Use this primarily for exploring the intended UX and behavior; avoid adding long-lived features here.
- **Next.js frontend (`frontend/`):**
  - Install: `cd frontend && pnpm install` (prefer `pnpm`; `package.json` is standard create-next-app).
  - Run dev server: `pnpm dev` → visit `http://localhost:3000`.
  - Entry point to customize: `frontend/app/page.tsx`.
- **Dev container:**
  - `.devcontainer/.env.example` defines Postgres/Redis defaults. Infra is pre-wired for future backend work; **you don’t need to add DB code unless explicitly asked.**

## Project-Specific Conventions

- **Styling:**
  - Tailwind-style utility classes are used heavily in `ui-proto` components (e.g. `bg-gradient-to-br`, `rounded-xl`, `shadow-lg`).
  - When building new UI in `frontend/`, **reuse these class patterns** for visual consistency; copy from `ui-proto/src/components/*` when in doubt.
- **State management:**
  - Prototype uses `useState` in `App.tsx` to hold `people`, `expenses`, and `settlements` and passes props down.
  - For the Next.js port, start with **local/component state or lifted state via React hooks**; avoid introducing Redux or other global state unless requested.
- **Domain logic location:**
  - Calculation of who owes whom is encapsulated in `ui-proto/src/components/BalanceSummary.tsx` (`calculateBalances`).
  - Expense split validation & equal splitting live in `ui-proto/src/components/AddExpense.tsx`.
  - When extracting or reusing these behaviors (e.g., into `frontend/app`), prefer **small pure helpers** that mirror this logic rather than rewriting from scratch.
- **User feedback:**
  - Prototype uses simple `alert`/`confirm` for validation and settlements. Preserve behavior first; improving UX (toasts/modals) is a **secondary, explicit task**.

## How AI Agents Should Work Here

- **When adding features:**
  - First, check `ui-proto` for an existing pattern (component, type, or interaction) and then implement it in `frontend`, keeping `ui-proto` as a design/example reference.
  - Keep types (`Person`, `Expense`, `Split`, `Settlement`) consistent between proto and Next; if you extend them, update all usage sites.
- **When editing UI:**
  - Use JSX + Tailwind-like classnames, following examples in `ui-proto/src/components/*`.
  - Keep layout responsive with the same grid/flex patterns used in `App.tsx` (e.g. `grid-cols-1 lg:grid-cols-2`).
- **When touching environment/infra:**
  - Respect `.devcontainer/.env.example` variable names (`POSTGRES_USER`, `POSTGRES_DB`, etc.).
  - If you introduce a backend or DB connection, **centralize connection config** via `DATABASE_URL`-style env vars and keep them consistent with the example connection string.
- **Testing & validation:**
  - There are no formal tests yet. Manually verify core flows in the running app: add person → add expense with splits → view balances → settle.

## Good First AI Tasks (Examples)

- Port the `ui-proto` experience into `frontend/app/page.tsx` (or split into `app/(routes)` + components) while preserving domain logic.
- Extract calculation/validation logic from `ui-proto` into reusable helpers (e.g. `lib/expenses.ts`) and consume them from both the Next app and future backend code.
- Incrementally replace `alert`/`confirm` with proper UI components once a design is agreed, but only after a working baseline exists.
