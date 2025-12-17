# Settlement Management - Missing Features & Fixes

## CRITICAL: Items That MUST Be Fixed

### 1. Add Settlements Table to Schema ⚠️ BLOCKER

**File:** `frontend/db/schema.ts`

**Current situation:** The settlements table is NOT defined in the schema, but the server actions try to import it.

**Error that will occur:**
```
Module '"@/db/schema"' has no exported member 'settlements'
```

**Required addition to db/schema.ts:**

```typescript
import {
  date,  // Add this import
  integer,  // Add this import
  check,  // Add this import
  // ... existing imports
} from "drizzle-orm/pg-core";

// Add after splits table definition:
export const settlements = pgTable(
  "settlements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    fromPersonId: uuid("from_person_id")
      .notNull()
      .references(() => people.id, { onDelete: "restrict" }),
    toPersonId: uuid("to_person_id")
      .notNull()
      .references(() => people.id, { onDelete: "restrict" }),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    date: date("date").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  table => ({
    fromPersonIdx: index("settlements_from_person_idx").on(table.fromPersonId),
    toPersonIdx: index("settlements_to_person_idx").on(table.toPersonId),
    amountPositive: check("settlements_amount_positive", sql`${table.amount} > 0`),
    distinctParticipants: check(
      "settlements_distinct_participants",
      sql`${table.fromPersonId} <> ${table.toPersonId}`
    ),
  })
);

// Add relations after splitsRelations:
export const settlementsRelations = relations(settlements, ({ one }) => ({
  fromPerson: one(people, {
    fields: [settlements.fromPersonId],
    references: [people.id],
    relationName: "settlementsFrom",
  }),
  toPerson: one(people, {
    fields: [settlements.toPersonId],
    references: [people.id],
    relationName: "settlementsTo",
  }),
}));

// Update peopleRelations to include settlements:
export const peopleRelations = relations(people, ({ many }) => ({
  paidExpenses: many(expenses, { relationName: "expensePaidBy" }),
  splits: many(splits),
  settlementsFrom: many(settlements, { relationName: "settlementsFrom" }),
  settlementsTo: many(settlements, { relationName: "settlementsTo" }),
}));
```

**Also need to add these imports at top:**
```typescript
import { sql } from "drizzle-orm";
import { date, check } from "drizzle-orm/pg-core";
```

---

### 2. Regenerate Migration with Correct Types ⚠️ BLOCKER

**Current problem:** Migration uses `serial` (integer) IDs, but schema uses `uuid`.

**Steps to fix:**

```bash
cd frontend

# Delete the incorrect migration
rm drizzle/0001_settlement_management.sql

# Regenerate migration from schema
pnpm drizzle:generate

# This will create a new migration with UUID types matching the schema
```

**Expected result:** New migration file with:
```sql
CREATE TABLE "settlements" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "from_person_id" uuid NOT NULL,
  "to_person_id" uuid NOT NULL,
  -- ... rest with uuid types
);
```

---

### 3. Resolve Merge Conflict ⚠️ BLOCKER

**File:** `frontend/drizzle/0000_lyrical_hex.sql`

**Current state:** Contains git conflict markers:
```
<<<<<<< Current (Your changes)
=======
CREATE TABLE "people" (...)
>>>>>>> Incoming (Background Agent changes)
```

**Fix:** Choose the UUID version (incoming changes), remove conflict markers.

**Correct version should start with:**
```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
--> statement-breakpoint
CREATE TABLE "expenses" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  ...
```

---

### 4. Create BalanceSummary Container Component ⚠️ MISSING FEATURE

**File to create:** `frontend/components/expense/balance-summary.tsx`

This component doesn't exist but is needed to display balances.

**Implementation:**

```typescript
"use client";

import { useMemo } from 'react';
import { calculateBalances } from '@/lib/calculations';
import { BalanceCard } from './balance-card';
import type { Expense, Person, Settlement } from '@/lib/types';

export interface BalanceSummaryProps {
  expenses: Expense[];
  people: Person[];
  settlements: Settlement[];
  onSettlementSuccess?: () => void;
}

/**
 * BalanceSummary calculates and displays who owes whom.
 * 
 * Uses calculateBalances helper to determine outstanding debts
 * after accounting for expenses and settlements.
 */
export function BalanceSummary({
  expenses,
  people,
  settlements,
  onSettlementSuccess,
}: BalanceSummaryProps) {
  const balances = useMemo(
    () => calculateBalances(expenses, people, settlements),
    [expenses, people, settlements]
  );

  const getPersonName = (personId: string) => {
    return people.find(p => p.id === personId)?.name || 'Unknown';
  };

  if (balances.length === 0) {
    return (
      <div className="text-center py-8 rounded-xl bg-green-50 border border-green-200">
        <p className="text-green-700 font-medium">✅ All balanced! No outstanding debts.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Outstanding Balances</h3>
          <p className="text-sm text-gray-500">Who owes whom</p>
        </div>
      </div>
      {balances.map((balance, index) => (
        <BalanceCard
          key={`${balance.from}-${balance.to}-${index}`}
          fromId={balance.from}
          fromName={getPersonName(balance.from)}
          toId={balance.to}
          toName={getPersonName(balance.to)}
          amount={balance.amount}
          onSettlementSuccess={onSettlementSuccess}
        />
      ))}
    </div>
  );
}
```

---

### 5. Integrate into ExpenseManager ⚠️ MISSING FEATURE

**File:** `frontend/components/expense/expense-manager.tsx`

**Current:** Only shows expense form and list  
**Needed:** Add balance summary and settlement history

**Changes:**

```typescript
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import type { Expense, Person, Settlement } from '@/lib/types';  // Add Settlement
import { AddExpenseForm, type AddExpenseFormProps } from '@/components/expense/add-expense-form';
import { ExpenseCard } from '@/components/expense/expense-card';
import { BalanceSummary } from '@/components/expense/balance-summary';  // NEW
import { SettlementHistory } from '@/components/expense/settlement-history';  // NEW
import { addExpense, deleteExpense } from '@/app/actions/expenses';
import { deleteSettlement } from '@/app/actions/settlements';  // NEW
import { Separator } from '@/components/ui/separator';

export interface ExpenseManagerProps {
  people: Person[];
  expenses: Expense[];
  settlements: Settlement[];  // NEW
}

export function ExpenseManager({ 
  people, 
  expenses,
  settlements  // NEW
}: ExpenseManagerProps) {
  const router = useRouter();
  const [listError, setListError] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const handleAddExpense: AddExpenseFormProps['onSubmit'] = async expenseInput => {
    setListError(null);
    const result = await addExpense(expenseInput);

    if (result.success) {
      router.refresh();
    }

    return result;
  };

  const handleDeleteExpense = async (expenseId: string) => {
    setListError(null);
    setPendingDeleteId(expenseId);
    const result = await deleteExpense(expenseId);
    setPendingDeleteId(null);

    if (!result.success) {
      setListError(result.error ?? 'Failed to delete expense.');
      return;
    }

    router.refresh();
  };

  // NEW: Handle settlement deletion
  const handleDeleteSettlement = async (settlementId: string) => {
    setListError(null);
    const result = await deleteSettlement(settlementId);
    
    if (!result.success) {
      setListError(result.error ?? 'Failed to delete settlement.');
      return;
    }

    router.refresh();
  };

  // NEW: Handle successful settlement creation
  const handleSettlementSuccess = () => {
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <AddExpenseForm people={people} onSubmit={handleAddExpense} />
      
      <Separator />
      
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Expenses</h3>
            <p className="text-sm text-gray-500">Track and manage all shared spending</p>
          </div>
        </div>

        {listError && (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {listError}
          </div>
        )}

        {expenses.length === 0 ? (
          <p className="text-sm text-gray-500">No expenses yet. Add your first one above.</p>
        ) : (
          <div className="space-y-3">
            {expenses.map(expense => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                people={people}
                onDelete={handleDeleteExpense}
                isDeleting={pendingDeleteId === expense.id}
              />
            ))}
          </div>
        )}
      </section>

      {/* NEW: Balance Summary Section */}
      {expenses.length > 0 && (
        <>
          <Separator />
          <section>
            <BalanceSummary
              expenses={expenses}
              people={people}
              settlements={settlements}
              onSettlementSuccess={handleSettlementSuccess}
            />
          </section>
        </>
      )}

      {/* NEW: Settlement History Section */}
      {settlements.length > 0 && (
        <>
          <Separator />
          <section className="space-y-3">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Settlement History</h3>
              <p className="text-sm text-gray-500">Past payments between members</p>
            </div>
            <SettlementHistory
              settlements={settlements}
              people={people}
              onDelete={handleDeleteSettlement}
            />
          </section>
        </>
      )}
    </div>
  );
}
```

---

### 6. Fetch Settlements in Page ⚠️ MISSING FEATURE

**File:** `frontend/app/page.tsx`

**Changes:**

```typescript
import { Receipt } from "lucide-react";

import { listExpenses } from "@/app/actions/expenses";
import { listPeople } from "@/app/actions/people";
import { listSettlements } from "@/app/actions/settlements";  // NEW
import { ExpenseManager } from "@/components/expense/expense-manager";
import { PeopleManagerDialog } from "@/components/expense/people-manager-dialog";

export default async function Home() {
  // OLD: const [people, expenses] = await Promise.all([listPeople(), listExpenses()]);
  
  // NEW: Fetch settlements too
  const [people, expenses, settlements] = await Promise.all([
    listPeople(),
    listExpenses(),
    listSettlements(),
  ]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-10 px-4">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="rounded-2xl bg-white px-6 py-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3 text-indigo-600">
                <Receipt className="h-6 w-6" />
                <span className="font-semibold tracking-wide uppercase text-xs">
                  Group Expense Splitter
                </span>
              </div>
              <h1 className="mt-2 text-3xl font-semibold text-gray-900">
                Track expenses and split them fairly
              </h1>
              <p className="mt-1 text-gray-600">
                Add detailed expenses, assign who paid, and make sure every split balances.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
                {people.length === 0
                  ? "Add people to start tracking expenses."
                  : `${people.length} ${people.length === 1 ? "person" : "people"} in this group`}
              </div>
              <PeopleManagerDialog people={people} />
            </div>
          </div>
        </header>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          {/* OLD: <ExpenseManager people={people} expenses={expenses} /> */}
          {/* NEW: Pass settlements too */}
          <ExpenseManager 
            people={people} 
            expenses={expenses}
            settlements={settlements}
          />
        </div>
      </div>
    </main>
  );
}
```

---

## Summary of Required Changes

| # | File | Action | Priority |
|---|------|--------|----------|
| 1 | `db/schema.ts` | Add settlements table + relations | 🔴 P0 |
| 2 | Migration | Regenerate with UUID | 🔴 P0 |
| 3 | `0000_lyrical_hex.sql` | Resolve conflict | 🔴 P0 |
| 4 | `balance-summary.tsx` | Create new component | 🟡 P1 |
| 5 | `expense-manager.tsx` | Add balance/settlement sections | 🟡 P1 |
| 6 | `page.tsx` | Fetch settlements | 🟡 P1 |

**Total effort:** 2-3 hours to complete all fixes

---

## After These Fixes

The complete user flow will work:
1. ✅ User adds expenses with splits
2. ✅ App calculates and displays balances
3. ✅ User clicks "Settle" button
4. ✅ Custom dialog shows settlement details
5. ✅ User confirms settlement
6. ✅ Settlement saves to database
7. ✅ Balance updates (debt reduced)
8. ✅ Settlement appears in history
9. ✅ User can delete/undo settlement
10. ✅ Balance recalculates

All validation, error handling, and loading states are already implemented in the existing components!
