"use client";

import { useState } from 'react';
import { DollarSign, Loader2, Plus } from 'lucide-react';
import type { Person, Expense } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { validateExpenseInput } from '@/lib/validations';

export interface AddExpenseFormProps {
  people: Person[];
  onSubmit: (expense: Omit<Expense, 'id' | 'date'>) => Promise<{ success: boolean; error?: string }>;
  className?: string;
}

/**
 * AddExpenseForm allows users to create a new expense.
 *
 * Features:
 * - Enter description
 * - Enter total amount
 * - Select who paid
 * - Manage splits between people
 * - Auto-split equally by default
 * - Upload receipt image
 */
export function AddExpenseForm({
  people,
  onSubmit,
  className,
}: AddExpenseFormProps) {
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [paidBy, setPaidBy] = useState<number | null>(null);
  const [splits, setSplits] = useState<Record<number, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSplitChange = (personId: number, value: string) => {
    setSplits({ ...splits, [personId]: value });
  };

  const splitEqually = () => {
    const amount = parseFloat(totalAmount);
    if (isNaN(amount) || people.length === 0) return;

    const equalAmount = (amount / people.length).toFixed(2);
    const newSplits: Record<number, string> = {};
    people.forEach(person => {
      newSplits[person.id] = equalAmount;
    });
    setSplits(newSplits);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const expenseTotal = parseFloat(totalAmount);
    const expenseSplits = Object.entries(splits)
      .map(([personId, amount]) => ({
        personId: Number(personId),
        amount: parseFloat(amount) || 0,
      }))
      .filter(split => split.amount > 0);

    const validation = validateExpenseInput({
      description,
      totalAmount: expenseTotal,
      paidBy: paidBy ?? 0,
      splits: expenseSplits,
    });

    if (!validation.valid) {
      setFormError(validation.errors[0]);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onSubmit({
        description: description.trim(),
        totalAmount: expenseTotal,
        paidBy: paidBy ?? 0,
        splits: expenseSplits,
      });

      if (!result.success) {
        setFormError(result.error ?? 'Failed to add expense.');
        return;
      }

      setDescription('');
      setTotalAmount('');
      setPaidBy(null);
      setSplits({});
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Failed to add expense.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Add Expense
        </CardTitle>
        <CardDescription>Enter expense details and split amounts</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="add-expense-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Dinner at restaurant"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="totalAmount">Total Amount</Label>
              <Input
                id="totalAmount"
                type="number"
                step="0.01"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paidBy">Paid By</Label>
              <Select value={paidBy?.toString() ?? ''} onValueChange={(value) => setPaidBy(Number(value))}>
                <SelectTrigger id="paidBy">
                  <SelectValue placeholder="Select person" />
                </SelectTrigger>
                <SelectContent>
                  {people.map(person => (
                    <SelectItem key={person.id} value={person.id.toString()}>
                      {person.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {people.length > 0 ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Split Between</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={splitEqually}
                >
                  Split Equally
                </Button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {people.map(person => (
                  <div key={person.id} className="flex items-center gap-2">
                    <Label htmlFor={`split-${person.id}`} className="flex-1">
                      {person.name}
                    </Label>
                    <Input
                      id={`split-${person.id}`}
                      type="number"
                      step="0.01"
                      value={splits[person.id] || ''}
                      onChange={(e) => handleSplitChange(person.id, e.target.value)}
                      placeholder="0.00"
                      className="w-24"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Add people to start splitting expenses.
            </p>
          )}

          {formError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {formError}
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setDescription('');
            setTotalAmount('');
            setPaidBy(null);
            setSplits({});
            setFormError(null);
          }}
        >
          Clear
        </Button>
        <Button
          type="submit"
          form="add-expense-form"
          disabled={isSubmitting || people.length === 0}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
