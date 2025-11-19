"use server";
import "server-only";

import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set in the environment");
}

const pool = new Pool({ connectionString });

export const db = drizzle({ client: pool });
