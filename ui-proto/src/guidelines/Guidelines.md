# Cursor Rules

## Primary Context

- `frontend/` is the production Next.js 16 app; implement all work there. `ui-proto/` is reference-only.
- TypeScript alias `@/*` points to `frontend/*`. Prefer absolute imports that use this alias.
- Database code under `frontend/db/**` is server-only; never import `db` into client components.
- Tailwind CSS v4 utility classes are standard for styling. Reuse class patterns from `ui-proto` for consistency.

## Definition of Done (mirrors `AGENTS.md`)

1. **Domain helpers**: Any change under `frontend/lib/**` needs a Vitest unit test (`pnpm test:unit`).
2. **UI components**: Behavior changes require component or story-driven tests (`pnpm test:component` or `pnpm test:storybook`).
3. **End-to-end flows**: Multi-screen journeys must include/extend a Playwright spec in `frontend/e2e/**` (`pnpm test:e2e`).
4. **Coverage**: Maintain ≥80 % line coverage for shared helpers (`pnpm test:coverage`).
5. **Linting**: `pnpm lint` must pass with zero new warnings/errors.

## Testing & Tooling Commands

- `pnpm test:unit` – Vitest unit suite (jsdom+RTL via `test/setup.ts`).
- `pnpm test:component` – Component-level tests.
- `pnpm test:storybook` – Runs Storybook stories with Vitest.
- `pnpm test:e2e` / `pnpm test:e2e:ui` – Playwright smoke/E2E tests (chromium, starts dev server on port 3100 by default).
- `pnpm test:coverage` – Coverage report for units/utilities.
- `pnpm lint` – ESLint (must succeed as part of DoD).

## Workflow Reminders

- Keep `frontend/lib/utils.test.ts` and `frontend/e2e/smoke.spec.ts` as smoke tests; extend them when new foundations are added.
- Storybook lives in `frontend/stories/**`; prefer updating stories alongside component changes.
- Use `pnpm` for `frontend/` and `npm` for `ui-proto/`; never mix lockfiles.
