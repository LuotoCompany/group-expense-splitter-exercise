import { describe, it, expect } from 'vitest';
import { calculateBalances } from './balance';
import type { Expense, Person, Settlement } from './types';

describe('calculateBalances', () => {
  const people: Person[] = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
  ];

  it('returns empty array when no expenses', () => {
    const balances = calculateBalances([], people, []);
    expect(balances).toEqual([]);
  });

  it('calculates simple balance when one person paid and split equally', () => {
    const expenses: Expense[] = [
      {
        id: 1,
        description: 'Dinner',
        totalAmount: 60,
        paidBy: 1, // Alice paid
        splits: [
          { personId: 1, amount: 20 },
          { personId: 2, amount: 20 },
          { personId: 3, amount: 20 },
        ],
        date: new Date(),
      },
    ];

    const balances = calculateBalances(expenses, people, []);

    expect(balances).toHaveLength(2);
    expect(balances).toContainEqual({
      fromId: 2,
      toId: 1,
      amount: 20,
    });
    expect(balances).toContainEqual({
      fromId: 3,
      toId: 1,
      amount: 20,
    });
  });

  it('calculates balances after settlement', () => {
    const expenses: Expense[] = [
      {
        id: 1,
        description: 'Dinner',
        totalAmount: 60,
        paidBy: 1, // Alice paid
        splits: [
          { personId: 1, amount: 20 },
          { personId: 2, amount: 20 },
          { personId: 3, amount: 20 },
        ],
        date: new Date(),
      },
    ];

    const settlements: Settlement[] = [
      {
        id: 1,
        from: 2, // Bob paid
        to: 1, // Alice
        amount: 20,
        date: new Date(),
      },
    ];

    const balances = calculateBalances(expenses, people, settlements);

    // Bob settled his debt, so only Charlie owes Alice
    expect(balances).toHaveLength(1);
    expect(balances[0]).toEqual({
      fromId: 3,
      toId: 1,
      amount: 20,
    });
  });

  it('returns "all settled up" when balances are zero', () => {
    const expenses: Expense[] = [
      {
        id: 1,
        description: 'Dinner',
        totalAmount: 60,
        paidBy: 1, // Alice paid
        splits: [
          { personId: 1, amount: 20 },
          { personId: 2, amount: 20 },
          { personId: 3, amount: 20 },
        ],
        date: new Date(),
      },
    ];

    const settlements: Settlement[] = [
      {
        id: 1,
        from: 2, // Bob paid
        to: 1, // Alice
        amount: 20,
        date: new Date(),
      },
      {
        id: 2,
        from: 3, // Charlie paid
        to: 1, // Alice
        amount: 20,
        date: new Date(),
      },
    ];

    const balances = calculateBalances(expenses, people, settlements);
    expect(balances).toEqual([]);
  });

  it('handles complex scenario with multiple expenses and settlements', () => {
    const expenses: Expense[] = [
      {
        id: 1,
        description: 'Dinner',
        totalAmount: 90,
        paidBy: 1, // Alice paid $90
        splits: [
          { personId: 1, amount: 30 },
          { personId: 2, amount: 30 },
          { personId: 3, amount: 30 },
        ],
        date: new Date(),
      },
      {
        id: 2,
        description: 'Movie',
        totalAmount: 30,
        paidBy: 2, // Bob paid $30
        splits: [
          { personId: 1, amount: 10 },
          { personId: 2, amount: 10 },
          { personId: 3, amount: 10 },
        ],
        date: new Date(),
      },
    ];

    const balances = calculateBalances(expenses, people, []);

    // Alice: +90 - 30 - 10 = +50 (is owed)
    // Bob: +30 - 30 - 10 = -10 (owes)
    // Charlie: -30 - 10 = -40 (owes)
    expect(balances).toHaveLength(2);
    expect(balances).toContainEqual({
      fromId: 2,
      toId: 1,
      amount: 10,
    });
    expect(balances).toContainEqual({
      fromId: 3,
      toId: 1,
      amount: 40,
    });
  });

  it('ignores small rounding differences', () => {
    const expenses: Expense[] = [
      {
        id: 1,
        description: 'Dinner',
        totalAmount: 10,
        paidBy: 1,
        splits: [
          { personId: 1, amount: 3.33 },
          { personId: 2, amount: 3.33 },
          { personId: 3, amount: 3.34 },
        ],
        date: new Date(),
      },
    ];

    const settlements: Settlement[] = [
      {
        id: 1,
        from: 2,
        to: 1,
        amount: 3.33,
        date: new Date(),
      },
      {
        id: 2,
        from: 3,
        to: 1,
        amount: 3.34,
        date: new Date(),
      },
    ];

    const balances = calculateBalances(expenses, people, settlements);
    // Should be essentially zero (within 0.01 threshold)
    expect(balances).toEqual([]);
  });
});
