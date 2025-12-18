"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import type { Settlement, SettlementActionResult } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface SettlementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fromPerson: { id: string; name: string };
  toPerson: { id: string; name: string };
  amount: number;
  defaultDate?: Date;
  onSuccess?: (settlement: Settlement) => void;
  onConfirm: (options: { date: string }) => Promise<SettlementActionResult>;
}

const formatDateInputValue = (date: Date) =>
  [
    date.getFullYear(),
    `${date.getMonth() + 1}`.padStart(2, "0"),
    `${date.getDate()}`.padStart(2, "0"),
  ].join("-");

export function SettlementDialog({
  open,
  onOpenChange,
  fromPerson,
  toPerson,
  amount,
  defaultDate,
  onSuccess,
  onConfirm,
}: SettlementDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [paymentDate, setPaymentDate] = useState<string>(() =>
    formatDateInputValue(defaultDate ?? new Date()),
  );

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (open) {
      setPaymentDate(formatDateInputValue(defaultDate ?? new Date()));
      setError(null);
    }
  }, [open, defaultDate, fromPerson.id, toPerson.id, amount]);

  const summary = useMemo(
    () => `${fromPerson.name} will pay ${toPerson.name} $${amount.toFixed(2)}`,
    [fromPerson.name, toPerson.name, amount],
  );

  const handleConfirm = () => {
    if (!paymentDate) {
      setError("Please choose a payment date.");
      return;
    }

    setError(null);

    startTransition(async () => {
      const result = await onConfirm({ date: paymentDate });

      if (!result.success || !result.settlement) {
        setError(result.error ?? "Unable to create settlement.");
        return;
      }

      onSuccess?.(result.settlement);
      onOpenChange(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Settlement</DialogTitle>
          <DialogDescription>{summary}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm text-gray-700">
            <span>From</span>
            <span className="font-medium">{fromPerson.name}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-700">
            <span>To</span>
            <span className="font-medium">{toPerson.name}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-700">
            <span>Amount</span>
            <span className="font-semibold text-green-700">
              ${amount.toFixed(2)}
            </span>
          </div>
          <div className="space-y-1">
            <label
              htmlFor="settlement-date"
              className="text-sm font-medium text-gray-700"
            >
              Settlement date
            </label>
            <Input
              id="settlement-date"
              type="date"
              value={paymentDate}
              onChange={(event) => setPaymentDate(event.target.value)}
              disabled={isPending}
            />
          </div>
          {error && (
            <div className="text-sm text-red-600" role="alert">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={isPending}>
            {isPending ? "Recording..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

