"use client";

import { Trash2, Image } from 'lucide-react';
import type { Expense, Person } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface ExpenseCardProps {
  expense: Expense;
  people: Person[];
  onDelete: (id: string) => void;
  onReceiptClick?: (image: string) => void;
  className?: string;
}

/**
 * ExpenseCard displays a single expense with its details.
 *
 * Shows:
 * - Description
 * - Who paid
 * - Total amount
 * - How it was split between people
 * - Optional receipt image indicator
 */
export function ExpenseCard({
  expense,
  people,
  onDelete,
  onReceiptClick,
  className,
}: ExpenseCardProps) {
  const getPersonName = (personId: string) => {
    return people.find(p => p.id === personId)?.name || 'Unknown';
  };

  return (
    <div
      className={cn(
        "border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors",
        className
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-gray-900">{expense.description}</h3>
            {expense.receiptImage && onReceiptClick && (
              <button
                onClick={() => onReceiptClick(expense.receiptImage!)}
                className="text-indigo-600 hover:text-indigo-700 transition-colors"
                aria-label="View receipt"
              >
                <Image className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-gray-600">
            Paid by {getPersonName(expense.paidBy)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-indigo-600">${expense.totalAmount.toFixed(2)}</span>
          <button
            onClick={() => onDelete(expense.id)}
            className="text-red-500 hover:text-red-600 transition-colors"
            aria-label="Delete expense"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="text-gray-600 space-y-1">
        {expense.splits.map(split => (
          <div key={split.personId} className="flex justify-between">
            <span>{getPersonName(split.personId)}</span>
            <span>${split.amount.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
