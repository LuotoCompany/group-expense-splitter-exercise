"use server";

import { asc } from "drizzle-orm";

import { db } from "@/db/client";
import { people } from "@/db/schema";
import type { Person } from "@/lib/types";

export async function listPeople(): Promise<Person[]> {
  const rows = await db
    .select({
      id: people.id,
      name: people.name,
    })
    .from(people)
    .orderBy(asc(people.createdAt));

  return rows.map(row => ({
    id: row.id,
    name: row.name,
  }));
}

