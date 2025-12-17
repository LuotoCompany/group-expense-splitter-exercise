# AI Agents for Group Expense Splitter

This document describes potential AI agents that could assist with developing and maintaining this Group Expense Splitter application.

## Overview

The Group Expense Splitter project is designed to be AI-friendly, with clear separation between the UI prototype (`ui-proto/`) and production Next.js app (`frontend/`). AI agents can help with various tasks across both parts of the codebase.

## Recommended Agent Roles

### 1. Frontend Component Agent

**Focus Area**: React/Next.js UI components  
**Primary Files**: 
- `frontend/app/**/*.tsx`
- `ui-proto/src/components/*.tsx`

**Responsibilities**:
- Port components from the UI prototype to the Next.js frontend
- Ensure Tailwind styling consistency
- Maintain responsive design patterns
- Keep component state management patterns consistent

**Key Guidelines**:
- Always reference `ui-proto/src/components/*` for design patterns
- Use Tailwind utility classes matching the prototype style
- Maintain responsive layouts with `grid-cols-1 lg:grid-cols-2` patterns

### 2. Domain Logic Agent

**Focus Area**: Business logic and data models  
**Primary Files**:
- `ui-proto/src/App.tsx` (reference types)
- `frontend/lib/expenses.ts` (if created)
- Domain calculations in components

**Responsibilities**:
- Extract and maintain domain types (`Person`, `Expense`, `Split`, `Settlement`)
- Implement expense splitting algorithms
- Calculate balances and settlements
- Validate expense data

**Key Guidelines**:
- Keep domain types consistent across prototype and production app
- Reference `BalanceSummary.tsx` for calculation logic
- Maintain pure functions for domain calculations

### 3. Database & Backend Agent

**Focus Area**: Data persistence and backend logic  
**Primary Files**:
- `frontend/db/schema.ts`
- `frontend/db/client.ts`
- Server components and actions in `frontend/app/`

**Responsibilities**:
- Manage Drizzle ORM schema changes
- Create and apply database migrations
- Implement server actions and route handlers
- Ensure proper server-only data access

**Key Guidelines**:
- All DB access must be server-side only
- Use `drizzle:generate` and `drizzle:migrate` for schema changes
- Never expose `DATABASE_URL` to the client
- Follow environment variable patterns from `.devcontainer/.env.example`

### 4. Testing & Validation Agent

**Focus Area**: Quality assurance  
**Primary Workflows**:
- Manual testing workflows: add person → add expense → view balances → settle
- Lint and build validation
- Edge case verification

**Responsibilities**:
- Validate core user flows work correctly
- Run linters and builds before completion
- Test edge cases in expense calculations
- Verify responsive design across viewports

**Key Guidelines**:
- No formal test infrastructure exists yet; use manual validation
- Always test the complete flow from person creation to settlement
- Verify calculations match expected balances

## Agent Coordination

When multiple agents work together:

1. **Domain Logic Agent** should establish types first
2. **Frontend Component Agent** implements UI using established types
3. **Database & Backend Agent** adds persistence when needed
4. **Testing & Validation Agent** verifies everything works end-to-end

## Quick Reference

### For All Agents

- **Minimal changes**: Make the smallest possible modifications to achieve goals
- **Reference first**: Always check `ui-proto/` for existing patterns before creating new ones
- **Server vs Client**: Database code stays on server; UI state uses React hooks
- **Consistency**: Keep styling, types, and behaviors consistent across the codebase

### Common Tasks

- **Adding a new component**: Check `ui-proto/src/components/` → port to `frontend/app/` → test
- **Modifying domain logic**: Update `ui-proto/src/App.tsx` types → sync to `frontend/` → validate
- **Database changes**: Edit `frontend/db/schema.ts` → `pnpm drizzle:generate` → `pnpm drizzle:migrate`
- **Styling updates**: Use Tailwind classes from prototype → maintain responsive patterns

## Resources

- [Project README](./README.md) - Setup and getting started
- [Copilot Instructions](./.github/copilot-instructions.md) - Detailed AI agent guidelines
- [UI Prototype](./ui-proto/) - Reference implementation
- [Frontend App](./frontend/) - Production Next.js application
