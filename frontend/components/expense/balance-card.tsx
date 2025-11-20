"use client";

import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface BalanceCardProps {
  fromName: string;
  toName: string;
  amount: number;
  onSettle: () => void;
  className?: string;
}

/**
 * BalanceCard displays a single balance owed between two people.
 *
 * Shows:
 * - Who owes whom
 * - Amount owed
 * - Button to settle the debt
 */
export function BalanceCard({
  fromName,
  toName,
  amount,
  onSettle,
  className,
}: BalanceCardProps) {
  return (
    <div
      className={cn(
        "border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors",
        className
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1">
          <p className="text-gray-900">
            <span className="text-red-600">{fromName}</span>
            {' '}owes{' '}
            <span className="text-green-600">{toName}</span>
          </p>
          <p className="text-indigo-600 font-medium text-lg">
            ${amount.toFixed(2)}
          </p>
        </div>
        <Button
          onClick={onSettle}
          className="bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Settle
        </Button>
      </div>
    </div>
  );
}
