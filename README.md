# Group Expense Splitter (Exercise)

This repo contains an exercise project for a **Group Expense Splitter** app, with a production-ready Next.js shell and a separate UI prototype.

## Repository Structure

- `frontend/` – Next.js app (App Router) and future production code.
- `ui-proto/` – Vite + React **design prototype** for UX and domain behavior.
- `.devcontainer/` – Dev container setup (Postgres, Redis, Node).
- `.github/` – GitHub configuration (workflows, etc.).
- `flake.nix` – Optional Nix flake for setting up the dev environment.

## Getting Started

### 1. Recommended: Dev Container

If you are using VS Code, open this repository and **reopen it in the Dev Container** when prompted. The devcontainer comes with Node, Postgres, Redis and other tooling preconfigured, so you can start coding without setting anything up locally.

### 2. Manual Setup (outside Dev Container)

If you are not using the devcontainer:

- Install Node.js (LTS recommended)
- Install `pnpm` globally (`npm install -g pnpm`)
- Ensure you have a local Postgres instance available if you want to use the DB

### 3. Running the Next.js App (`frontend/`)

From the repo root:

```bash
cd frontend
pnpm install

# (optional) configure the database
cp .env.local.example .env.local  # or create manually
# ensure DATABASE_URL is set, e.g.:
# DATABASE_URL="postgres://postgres:postgres@localhost:5432/postgres"

# run migrations (optional but recommended when using the DB)
pnpm drizzle:generate
pnpm drizzle:migrate

# start the dev server
pnpm dev
```

Then open `http://localhost:3000` in your browser. The main entry point is `frontend/app/page.tsx`.

### 4. Running the UI Prototype (`ui-proto/`)

The prototype is for reference only; you don’t need it to run the Next app, but it’s useful to see the intended UX and domain logic.

```bash
cd ui-proto
npm install
npm run dev
```

Then open the URL printed by Vite (usually `http://localhost:5173`).

## Development Notes

- Treat `ui-proto/` as a **reference** only; new functionality should be implemented in `frontend/`.
- Reuse domain types and behaviors from `ui-proto/src/App.tsx` and its components when building the Next app.
- Database access must stay on the server side in `frontend/` (server components, route handlers, or server actions) via `db/client.ts`.

## Useful Scripts

From `frontend/`:

- `pnpm dev` – Run the Next.js dev server.
- `pnpm build` – Create a production build.
- `pnpm start` – Start the production server.
- `pnpm lint` – Run ESLint.
- `pnpm drizzle:generate` – Generate SQL migrations from the Drizzle schema.
- `pnpm drizzle:migrate` – Apply migrations to the database.
- `pnpm drizzle:studio` – Open Drizzle Studio for inspecting the local DB.

From `ui-proto/`:

- `npm run dev` – Run the Vite dev server.
- `npm run build` – Build the prototype for production.
