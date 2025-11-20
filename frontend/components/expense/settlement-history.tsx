"use client";

import { X } from 'lucide-react';
import type { Settlement, Person } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface SettlementHistoryProps {
  settlements: Settlement[];
  people: Person[];
  onDelete: (id: string) => void;
  className?: string;
}

/**
 * SettlementHistory displays a list of past settlements.
 *
 * Shows:
 * - Who paid whom
 * - Amount settled
 * - Option to delete/undo settlement
 */
export function SettlementHistory({
  settlements,
  people,
  onDelete,
  className,
}: SettlementHistoryProps) {
  const getPersonName = (personId: string) => {
    return people.find(p => p.id === personId)?.name || 'Unknown';
  };

  if (settlements.length === 0) {
    return (
      <div className={cn("text-center py-8 text-gray-500", className)}>
        No settlements yet.
      </div>
    );
  }

  return (
    <div className={cn("space-y-2", className)}>
      {[...settlements].reverse().map(settlement => (
        <div
          key={settlement.id}
          className="border border-green-200 bg-green-50 rounded-lg p-3 flex items-center justify-between"
        >
          <div className="flex-1">
            <p className="text-gray-900">
              {getPersonName(settlement.from)} → {getPersonName(settlement.to)}
            </p>
            <p className="text-green-700 font-medium">
              ${settlement.amount.toFixed(2)}
            </p>
          </div>
          <button
            onClick={() => onDelete(settlement.id)}
            className="text-red-500 hover:text-red-600 transition-colors"
            aria-label="Remove settlement"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
