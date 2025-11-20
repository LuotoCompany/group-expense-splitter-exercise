"use client";

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { addSettlement } from '@/app/actions/settlements';
import type { Settlement } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SettlementDialog } from '@/components/expense/settlement-dialog';

export interface BalanceCardProps {
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  amount: number;
  onSettlementSuccess?: (settlement: Settlement) => void;
  createSettlement?: typeof addSettlement;
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
  fromId,
  fromName,
  toId,
  toName,
  amount,
  onSettlementSuccess,
  createSettlement,
  className,
}: BalanceCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const createSettlementAction = createSettlement ?? addSettlement;

  return (
    <>
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
            onClick={() => setDialogOpen(true)}
            className="bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Settle
          </Button>
        </div>
      </div>
      <SettlementDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        fromPerson={{ id: fromId, name: fromName }}
        toPerson={{ id: toId, name: toName }}
        amount={amount}
        onSuccess={onSettlementSuccess}
        onConfirm={({ date }) =>
          createSettlementAction({
            fromPersonId: fromId,
            toPersonId: toId,
            amount,
            date,
          })
        }
      />
    </>
  );
}
