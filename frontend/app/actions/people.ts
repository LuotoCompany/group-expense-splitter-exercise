"use server";

import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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


export interface ActionResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function addPerson(name: string): Promise<ActionResponse> {
  if (!name || name.trim().length === 0) {
    return { success: false, error: "Name is required" };
  }

  try {
    await db.insert(people).values({
      name: name.trim(),
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    // Unique constraint violation code for PostgreSQL
    if (error?.code === "23505") {
      return { success: false, error: "A person with this name already exists" };
    }
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to add person" 
    };
  }
}

export async function deletePerson(id: number): Promise<ActionResponse> {
  if (!id) {
    return { success: false, error: "ID is required" };
  }

  try {
    await db.delete(people).where(eq(people.id, id));
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    // Foreign key violation code for PostgreSQL
    if (error?.code === "23503") {
      return { 
        success: false, 
        error: "Cannot delete this person because they are part of existing expenses" 
      };
    }

    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to delete person" 
    };
  }
}
