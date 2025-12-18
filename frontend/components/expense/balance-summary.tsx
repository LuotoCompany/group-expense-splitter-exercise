"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, CheckCircle } from 'lucide-react';
import type { Expense, Person, Settlement } from '@/lib/types';
import { calculateBalances } from '@/lib/calculations';
import { BalanceCard } from '@/components/expense/balance-card';
import { SettlementHistory } from '@/components/expense/settlement-history';
import { deleteSettlement } from '@/app/actions/settlements';

export interface BalanceSummaryProps {
  expenses: Expense[];
  people: Person[];
  settlements: Settlement[];
}

/**
 * BalanceSummary displays who owes whom and the settlement history.
 *
 * Features:
 * - Shows current balances calculated from expenses and settlements
 * - Displays "All settled up!" message when no balances remain
 * - Shows settlement history with delete functionality
 * - Refreshes data after settlements are created or deleted
 */
export function BalanceSummary({
  expenses,
  people,
  settlements,
}: BalanceSummaryProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const balances = calculateBalances(expenses, people, settlements);

  const handleSettlementSuccess = () => {
    setError(null);
    router.refresh();
  };

  const handleDeleteSettlement = async (id: string) => {
    setError(null);
    const result = await deleteSettlement(id);

    if (!result.success) {
      setError(result.error ?? 'Failed to delete settlement.');
      return;
    }

    router.refresh();
  };

  const getPersonName = (personId: number) => {
    return people.find(p => p.id === personId)?.name || 'Unknown';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-indigo-900 mb-4 flex items-center gap-2">
        <Users className="w-5 h-5" />
        Balances & Settlements
      </h2>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Current Balances */}
      <div className="mb-6">
        <h3 className="text-base font-medium text-gray-900 mb-3">Who Owes Whom</h3>
        {balances.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-green-50 rounded-lg">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
            <p className="font-medium">All settled up! 🎉</p>
          </div>
        ) : (
          <div className="space-y-3">
            {balances.map((balance, index) => (
              <BalanceCard
                key={index}
                fromId={balance.fromId.toString()}
                fromName={getPersonName(balance.fromId)}
                toId={balance.toId.toString()}
                toName={getPersonName(balance.toId)}
                amount={balance.amount}
                onSettlementSuccess={handleSettlementSuccess}
              />
            ))}
          </div>
        )}
      </div>

      {/* Settlement History */}
      {settlements.length > 0 && (
        <div>
          <h3 className="text-base font-medium text-gray-900 mb-3">Settlement History</h3>
          <div className="max-h-64 overflow-y-auto">
            <SettlementHistory
              settlements={settlements}
              people={people}
              onDelete={handleDeleteSettlement}
            />
          </div>
        </div>
      )}
    </div>
  );
}
