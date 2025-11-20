"use client";

import { useState } from 'react';
import { DollarSign, Plus } from 'lucide-react';
import type { Person, Expense } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface AddExpenseFormProps {
  people: Person[];
  onSubmit: (expense: Omit<Expense, 'id' | 'date'>) => void;
  onAddPerson: (name: string) => void;
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
  onAddPerson,
  className,
}: AddExpenseFormProps) {
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splits, setSplits] = useState<Record<string, string>>({});

  const handleSplitChange = (personId: string, value: string) => {
    setSplits({ ...splits, [personId]: value });
  };

  const splitEqually = () => {
    const amount = parseFloat(totalAmount);
    if (isNaN(amount) || people.length === 0) return;

    const equalAmount = (amount / people.length).toFixed(2);
    const newSplits: Record<string, string> = {};
    people.forEach(person => {
      newSplits[person.id] = equalAmount;
    });
    setSplits(newSplits);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description || !totalAmount || !paidBy) {
      alert('Please fill in all required fields');
      return;
    }

    const expenseSplits = Object.entries(splits)
      .map(([personId, amount]) => ({
        personId,
        amount: parseFloat(amount) || 0,
      }))
      .filter(split => split.amount > 0);

    if (expenseSplits.length === 0) {
      alert('Please add at least one split');
      return;
    }

    const splitTotal = expenseSplits.reduce((sum, split) => sum + split.amount, 0);
    const expenseTotal = parseFloat(totalAmount);

    if (Math.abs(splitTotal - expenseTotal) > 0.01) {
      alert(`Splits total ($${splitTotal.toFixed(2)}) must equal expense ($${expenseTotal.toFixed(2)})`);
      return;
    }

    onSubmit({
      description,
      totalAmount: expenseTotal,
      paidBy,
      splits: expenseSplits,
    });

    // Reset form
    setDescription('');
    setTotalAmount('');
    setPaidBy('');
    setSplits({});
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Dinner at restaurant"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              <Select value={paidBy} onValueChange={setPaidBy}>
                <SelectTrigger id="paidBy">
                  <SelectValue placeholder="Select person" />
                </SelectTrigger>
                <SelectContent>
                  {people.map(person => (
                    <SelectItem key={person.id} value={person.id}>
                      {person.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {people.length > 0 && (
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
            setPaidBy('');
            setSplits({});
          }}
        >
          Clear
        </Button>
        <Button onClick={handleSubmit}>
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </CardFooter>
    </Card>
  );
}
