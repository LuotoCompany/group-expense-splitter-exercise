"use client";

import { useMemo, useState } from 'react';
import { LoaderCircle, X } from 'lucide-react';
import type { Settlement, Person } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface SettlementHistoryProps {
  settlements: Settlement[];
  people: Person[];
  onDelete: (id: string | number) => Promise<void> | void;
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
  const [pendingId, setPendingId] = useState<string | number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getPersonName = (personId: number | string) => {
    const id = typeof personId === 'string' ? Number(personId) : personId;
    return people.find(p => p.id === id)?.name || 'Unknown';
  };

  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    []
  );

  const handleDelete = (id: string | number) => {
    setError(null);
    const result = onDelete(id);
    if (result && typeof result.then === 'function') {
      setPendingId(id);
      result
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Unable to delete settlement.');
        })
        .finally(() => setPendingId(null));
    }
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
      {error && (
        <div className="text-sm text-red-600" role="alert">
          {error}
        </div>
      )}
      {[...settlements].reverse().map(settlement => (
        <div
          key={settlement.id}
          className="border border-green-200 bg-green-50 rounded-lg p-3 flex items-center justify-between gap-4"
        >
          <div className="flex-1">
            <p className="text-gray-900">
              {getPersonName(settlement.from)} → {getPersonName(settlement.to)}
            </p>
            <p className="text-green-700 font-medium">
              ${settlement.amount.toFixed(2)}
            </p>
            <p className="text-xs text-gray-500">
              {formatter.format(settlement.date ?? settlement.createdAt ?? new Date())}
            </p>
          </div>
          <button
            onClick={() => handleDelete(settlement.id)}
            className="text-red-500 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            aria-label="Remove settlement"
            disabled={pendingId === settlement.id}
          >
            {pendingId === settlement.id ? (
              <LoaderCircle className="w-4 h-4 animate-spin" />
            ) : (
              <X className="w-4 h-4" />
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
