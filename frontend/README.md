This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Database (Drizzle ORM)

This project is configured to use [Drizzle ORM](https://orm.drizzle.team/) with Postgres in development.

1. Create a `.env.local` file in `frontend/` with at least:

```bash
DATABASE_URL="postgres://postgres:postgres@localhost:5432/postgres"
```

2. Generate migrations from the TypeScript schema in `db/schema.ts`:

```bash
pnpm drizzle:generate
```

3. Apply migrations to the database:

```bash
pnpm drizzle:migrate
```

4. Launch Drizzle Studio (dev only) to inspect data:

```bash
pnpm drizzle:studio
```

Only use these commands against development databases; do not point `DATABASE_URL` at production from your local `.env.local`.
