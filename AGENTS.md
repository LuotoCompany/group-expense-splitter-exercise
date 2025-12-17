# AGENTS.md

This is the **authoritative** instruction file for AI agents and automation working in this repository.

Do not rely on any other agent-instruction files (for example, legacy Copilot instruction files). If you find conflicting guidance elsewhere, prefer this file and consider removing the duplicate.

This file supersedes any prior agent guidance files such as `CLAUDE.md` and `.github/copilot-instructions.md`.

## Repository Overview

This is an exercise project for a **Group Expense Splitter** app with two main parts:

- `ui-proto/`: Vite/React design prototype that serves as a reference for UX, layout, and domain behavior
- `frontend/`: Next.js 16 (App Router) production application where all new work should be implemented
- `.devcontainer/`: Pre-configured dev environment with Postgres, Redis, and Node

**Important**: Treat `ui-proto` as a **reference only**. New features and changes should be implemented in `frontend/`.

## Where New Work Goes

- `ui-proto/` is a design/reference implementation (UX + domain behavior).
- `frontend/` is the production app. Implement all new features and fixes here.

## Core Domain Model

Domain types are defined in `ui-proto/src/App.tsx` (lines 7-33):

- `Person`: `{ id, name }`
- `Expense`: `{ id, description, totalAmount, paidBy, splits, date, receiptImage? }`
- `Split`: `{ personId, amount }`
- `Settlement`: `{ id, from, to, amount, date }`

Keep these types consistent across both prototype and Next.js app.

## Development Commands

### Frontend (Next.js - primary development)

All commands run from `frontend/` directory:

```bash
cd frontend
pnpm install              # Install dependencies
pnpm dev                  # Run dev server (http://localhost:3000)
pnpm build                # Production build
pnpm start                # Start production server
pnpm lint                 # Run ESLint

# Database (Drizzle ORM)
pnpm drizzle:generate     # Generate migrations from schema
pnpm drizzle:migrate      # Apply migrations to database
pnpm drizzle:studio       # Open Drizzle Studio (dev only)

# Storybook
pnpm storybook            # Run Storybook dev server (http://localhost:6006)
pnpm build-storybook      # Build Storybook for production
```

### UI Prototype (reference only)

```bash
cd ui-proto
npm install               # Install dependencies
npm run dev               # Run Vite dev server (http://localhost:5173)
```

## Database Architecture (Drizzle ORM + Postgres)

**Schema location**: `frontend/db/schema.ts` (single source of truth for DB schema)
**Client**: `frontend/db/client.ts` (server-only, uses `pg` + `drizzle-orm/node-postgres`)
**Config**: `frontend/drizzle.config.ts`

**Key principles**:

- DB client is server-only - NEVER import `db` into client components
- Only use in server components, server actions, or route handlers
- Environment variable: `DATABASE_URL` (format: `postgres://user:password@host:port/database`)
- Dev environment defaults from `.devcontainer/.env.example`:
  - User: `postgres`
  - Password: `postgres`
  - Database: `expense_splitter_dev`

**Migration workflow**:

1. Edit `frontend/db/schema.ts`
2. Run `pnpm drizzle:generate` to create SQL migrations
3. Run `pnpm drizzle:migrate` to apply migrations

## Architecture Patterns

### State Management

- UI prototype uses local `useState` in `App.tsx` with prop drilling
- For Next.js, start with local/component state or lifted state via React hooks
- No global state management (Redux, etc.) unless explicitly requested

### Domain Logic Locations

- Balance calculations: `ui-proto/src/components/BalanceSummary.tsx` (`calculateBalances` function)
- Expense split validation: `ui-proto/src/components/AddExpense.tsx`
- When implementing in `frontend/`, create small pure helper functions that mirror this logic

### Styling

- Uses Tailwind CSS utility classes (v4 in frontend)
- Common patterns from prototype: `bg-gradient-to-br`, `rounded-xl`, `shadow-lg`, `grid-cols-1 lg:grid-cols-2`
- Maintain visual consistency by copying class patterns from `ui-proto/src/components/*`

### Component Development

- Storybook configured for visual component development
- Stories location: `frontend/stories/`
- Storybook uses Vite + Next.js integration (@storybook/nextjs-vite)
- Addons: Chromatic, Docs, A11y, Vitest, Onboarding

## Path Aliases

TypeScript path alias configured in `frontend/tsconfig.json`:

```
"@/*" → "./*"
```

Example: `import { db } from "@/db/client"`

## Key Workflows

### Adding New Features

1. Check `ui-proto/` for existing patterns (component, type, interaction)
2. Implement in `frontend/`, maintaining type consistency
3. Reuse Tailwind class patterns for visual consistency
4. Keep `ui-proto/` as reference only - don't add long-lived features there

### Working with Database

1. Define/update schema in `frontend/db/schema.ts`
2. Generate migration: `pnpm drizzle:generate`
3. Apply migration: `pnpm drizzle:migrate`
4. Use `db` client only in server code
5. Never expose `DATABASE_URL` to browser

### User Feedback

- Prototype uses simple `alert`/`confirm` for validation and settlements
- Preserve existing behavior first
- Improving UX (toasts, modals) is a secondary task unless explicitly requested

## Testing

The repo uses Vitest for unit/component verification and Playwright for end-to-end smoke checks.

### Definition of Done

1. **Domain logic** – Any new or modified helpers in `frontend/lib/**` require a matching Vitest unit test (`pnpm test:unit`).
2. **UI components** – Interactive React components should include a component test (or story-driven test) when their behavior changes (`pnpm test:component` or `pnpm test:storybook`).
3. **End-to-end flows** – Features that span multiple screens or affect primary user journeys must include/extend a Playwright spec under `frontend/e2e/**` (`pnpm test:e2e`).
4. **Coverage** – Keep `frontend/lib/**` unit coverage ≥80% lines. Use `pnpm test:coverage` locally before sending a PR that touches shared logic.
5. **Linting** – `pnpm lint` must succeed with no new warnings/errors before merging changes.

### Commands & Workflow

- `pnpm test:unit` – Vitest project for utilities/domain helpers (jsdom env, RTL setup in `test/setup.ts`).
- `pnpm test:component` – Component-focused Vitest project for React components.
- `pnpm test:storybook` – Runs Storybook stories through Vitest + `@storybook/test-runner`.
- `pnpm test:watch` / `pnpm test:ui` – Interactive Vitest watch modes.
- `pnpm test:e2e` / `pnpm test:e2e:ui` – Playwright smoke and interactive modes (chromium, auto-starts dev server).

Smoke coverage lives in:

- `frontend/lib/utils.test.ts` – ensures Vitest setup works.
- `frontend/e2e/smoke.spec.ts` – verifies the app renders and primary CTAs load.

When touching flows like “Add person”, “Add expense”, “View balances”, or “Settle debts”, rely on Playwright specs instead of manual-only verification.

## Environment Setup

### Dev Container (Recommended)

- VS Code: Reopen in Dev Container when prompted
- Pre-configured with Node, Postgres, Redis
- Variables from `.devcontainer/.env.example`

### Manual Setup

1. Install Node.js (LTS)
2. Install pnpm globally: `npm install -g pnpm`
3. Ensure local Postgres instance is available
4. Create `frontend/.env.local` with `DATABASE_URL`

## Repository Conventions

- Use `pnpm` for `frontend/`, `npm` for `ui-proto/`
- Entry point: `frontend/app/page.tsx`
- Keep environment secrets in `.env`/`.env.local`, never hard-coded
- Maintain responsive layouts with grid/flex patterns from prototype

## General Agent Guidelines

- Be precise and minimal: make the smallest change that satisfies the task.
- Keep types consistent with the shared domain model (`Person`, `Expense`, `Split`, `Settlement`).
- Avoid “nice-to-have” UX additions unless explicitly requested.
- Prefer pure helpers under `frontend/lib/**` for domain logic; UI components should be in `frontend/components/**`.

## Important Reminders

1. **Database access is server-only** - Never import `db` in client components
2. **ui-proto is reference only** - All new work goes in `frontend/`
3. **Type consistency** - Keep `Person`, `Expense`, `Split`, `Settlement` aligned
4. **Copy, don't invent** - Reuse patterns from `ui-proto` for consistency
5. **Environment security** - Never expose `DATABASE_URL` to browser or commit secrets
