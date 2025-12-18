"use server";

import { revalidatePath } from "next/cache";
import { desc, eq, inArray } from "drizzle-orm";

import { db } from "@/db/client";
import { expenses, people, splits } from "@/db/schema";
import type { ActionResponse, AddExpensePayload, Expense } from "@/lib/types";
import {
  validateExpenseInput,
} from "@/lib/validations";

function mapExpenseRow(row: {
  id: number;
  description: string;
  totalAmount: string | number;
  paidBy: number;
  date: Date | null;
  createdAt: Date | null;
  splits: Array<{
    id: number;
    personId: number;
    amount: string | number;
  }>;
}): Expense {
  return {
    id: row.id,
    description: row.description,
    totalAmount: Number(row.totalAmount),
    paidBy: row.paidBy,
    date: row.date ?? row.createdAt ?? new Date(),
    splits: row.splits.map(split => ({
      personId: split.personId,
      amount: Number(split.amount),
    })),
  };
}

export async function listExpenses(): Promise<Expense[]> {
  const expenseRows = await db.query.expenses.findMany({
    orderBy: desc(expenses.createdAt),
    with: {
      splits: true,
    },
  });

  return expenseRows.map(mapExpenseRow);
}

export async function addExpense(payload: AddExpensePayload): Promise<ActionResponse> {
  const validation = validateExpenseInput({
    description: payload.description,
    totalAmount: payload.totalAmount,
    paidBy: payload.paidBy,
    splits: payload.splits,
  });

  if (!validation.valid) {
    return {
      success: false,
      error: validation.errors[0] ?? "Expense is invalid.",
    };
  }

  try {
    await db.transaction(async tx => {
      const payer = await tx.query.people.findFirst({
        where: eq(people.id, payload.paidBy),
      });

      if (!payer) {
        throw new Error("Selected payer does not exist.");
      }

      const uniqueSplitPersonIds = Array.from(
        new Set(payload.splits.map(split => split.personId))
      );

      if (uniqueSplitPersonIds.length === 0) {
        throw new Error("Splits must reference at least one person.");
      }

      const splitPeople = await tx
        .select({ id: people.id })
        .from(people)
        .where(inArray(people.id, uniqueSplitPersonIds));

      if (splitPeople.length !== uniqueSplitPersonIds.length) {
        throw new Error("One or more splits reference unknown people.");
      }

      const [newExpense] = await tx
        .insert(expenses)
        .values({
          description: payload.description.trim(),
          totalAmount: payload.totalAmount.toString(),
          paidBy: payload.paidBy,
          date: payload.date ?? new Date(),
        })
        .returning({
          id: expenses.id,
        });

      await tx.insert(splits).values(
        payload.splits.map(split => ({
          expenseId: newExpense.id,
          personId: split.personId,
          amount: split.amount.toString(),
        }))
      );
    });

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to add expense.";

    return { success: false, error: message };
  }
}

export async function deleteExpense(expenseId: number): Promise<ActionResponse> {
  if (!expenseId) {
    return { success: false, error: "Expense ID is required." };
  }

  try {
    const deleted = await db
      .delete(expenses)
      .where(eq(expenses.id, expenseId))
      .returning({ id: expenses.id });

    if (deleted.length === 0) {
      return { success: false, error: "Expense not found." };
    }

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete expense.";

    return { success: false, error: message };
  }
}

