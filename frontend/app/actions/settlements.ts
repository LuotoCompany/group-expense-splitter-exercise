"use server";

import { db } from "@/db/client";
import { people, settlements } from "@/db/schema";
import type { Settlement } from "@/lib/types";
import { InferSelectModel, desc, eq, inArray } from "drizzle-orm";

type SettlementRow = InferSelectModel<typeof settlements>;

export interface SettlementActionResult {
  success: boolean;
  settlement?: Settlement;
  error?: string;
}

export interface DeleteSettlementResult {
  success: boolean;
  error?: string;
}

export interface AddSettlementInput {
  fromPersonId: string | number;
  toPersonId: string | number;
  amount: number;
  date?: string | Date;
}

const toNumberId = (value: string | number): number | null => {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return value;
  }
  const numeric = Number(value);
  return Number.isInteger(numeric) && numeric > 0 ? numeric : null;
};

const toDateOnly = (value?: string | Date): Date => {
  if (!value) {
    return new Date();
  }
  const dateValue = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(dateValue.getTime())) {
    throw new Error("Invalid date supplied");
  }
  // Strip time to ensure consistency with DATE column.
  return new Date(
    Date.UTC(
      dateValue.getUTCFullYear(),
      dateValue.getUTCMonth(),
      dateValue.getUTCDate(),
    ),
  );
};

const mapSettlement = (row: SettlementRow): Settlement => ({
  id: row.id,
  from: row.fromPersonId,
  to: row.toPersonId,
  amount: Number(row.amount),
  date: new Date(row.date),
  createdAt: row.createdAt ?? new Date(row.date),
});

export async function listSettlements(): Promise<Settlement[]> {
  const rows = await db
    .select()
    .from(settlements)
    .orderBy(desc(settlements.date), desc(settlements.id));

  return rows.map(mapSettlement);
}

export async function addSettlement(
  input: AddSettlementInput,
): Promise<SettlementActionResult> {
  const fromId = toNumberId(input.fromPersonId);
  const toId = toNumberId(input.toPersonId);

  if (!fromId || !toId) {
    return { success: false, error: "Both people must be selected." };
  }

  if (fromId === toId) {
    return {
      success: false,
      error: "The payer and recipient must be different people.",
    };
  }

  const amount = Number(input.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return { success: false, error: "Settlement amount must be positive." };
  }

  let normalizedDate: Date;
  try {
    normalizedDate = toDateOnly(input.date);
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "A valid date is required.",
    };
  }

  const participants = await db
    .select({ id: people.id })
    .from(people)
    .where(inArray(people.id, [fromId, toId]));

  if (participants.length !== 2) {
    return {
      success: false,
      error: "Both people must exist before recording a settlement.",
    };
  }

  const [created] = await db
    .insert(settlements)
    .values({
      fromPersonId: fromId,
      toPersonId: toId,
      amount,
      date: normalizedDate,
    })
    .returning();

  if (!created) {
    return {
      success: false,
      error: "Unable to record the settlement. Please try again.",
    };
  }

  return {
    success: true,
    settlement: mapSettlement(created),
  };
}

export async function deleteSettlement(
  id: string | number,
): Promise<DeleteSettlementResult> {
  const numericId = toNumberId(id);
  if (!numericId) {
    return { success: false, error: "Invalid settlement id." };
  }

  const [deleted] = await db
    .delete(settlements)
    .where(eq(settlements.id, numericId))
    .returning({ id: settlements.id });

  if (!deleted) {
    return { success: false, error: "Settlement not found." };
  }

  return { success: true };
}

