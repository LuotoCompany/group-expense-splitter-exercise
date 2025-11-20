"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import type { Expense, Person } from '@/lib/types';
import { AddExpenseForm, type AddExpenseFormProps } from '@/components/expense/add-expense-form';
import { ExpenseCard } from '@/components/expense/expense-card';
import { addExpense, deleteExpense } from '@/app/actions/expenses';
import { Separator } from '@/components/ui/separator';

export interface ExpenseManagerProps {
  people: Person[];
  expenses: Expense[];
}

export function ExpenseManager({ people, expenses }: ExpenseManagerProps) {
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
    </div>
  );
}

