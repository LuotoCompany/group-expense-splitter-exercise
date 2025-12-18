import type { Expense, Person, Settlement, Balance } from './types';

/**
 * Calculate who owes whom based on expenses and settlements.
 * 
 * Algorithm:
 * 1. Initialize balance map for all people
 * 2. Process expenses: payer gets positive balance, split participants get negative
 * 3. Process settlements: payer gets negative, recipient gets negative (reduces credit)
 * 4. Separate creditors (positive balance) and debtors (negative balance)
 * 5. Match debtors with creditors to generate payment suggestions
 * 
 * @param expenses List of all expenses
 * @param people List of all people in the group
 * @param settlements List of all settlements
 * @returns Array of balances showing who owes whom
 */
export function calculateBalances(
  expenses: Expense[],
  people: Person[],
  settlements: Settlement[]
): Balance[] {
  const balanceMap: Record<number, number> = {};

  // Initialize all people with 0 balance
  people.forEach(person => {
    balanceMap[person.id] = 0;
  });

  // Process expenses
  expenses.forEach(expense => {
    // Person who paid gets positive balance
    balanceMap[expense.paidBy] = (balanceMap[expense.paidBy] || 0) + expense.totalAmount;

    // People who owe get negative balance
    expense.splits.forEach(split => {
      balanceMap[split.personId] = (balanceMap[split.personId] || 0) - split.amount;
    });
  });

  // Process settlements
  settlements.forEach(settlement => {
    // Person who paid increases their balance (reduces their debt)
    balanceMap[settlement.from] = (balanceMap[settlement.from] || 0) + settlement.amount;
    // Person who received decreases their balance (their credit is reduced)
    balanceMap[settlement.to] = (balanceMap[settlement.to] || 0) - settlement.amount;
  });

  // Calculate who owes whom
  const balances: Balance[] = [];
  const creditors: Array<{ id: number; amount: number }> = [];
  const debtors: Array<{ id: number; amount: number }> = [];

  Object.entries(balanceMap).forEach(([personIdStr, balance]) => {
    const personId = Number(personIdStr);
    if (balance > 0.01) {
      creditors.push({ id: personId, amount: balance });
    } else if (balance < -0.01) {
      debtors.push({ id: personId, amount: -balance });
    }
  });

  // Match debtors with creditors
  const creditorsCopy = [...creditors];
  const debtorsCopy = [...debtors];

  debtorsCopy.forEach(debtor => {
    let remaining = debtor.amount;

    creditorsCopy.forEach(creditor => {
      if (remaining > 0.01 && creditor.amount > 0.01) {
        const amount = Math.min(remaining, creditor.amount);
        balances.push({
          fromId: debtor.id,
          toId: creditor.id,
          amount,
        });
        remaining -= amount;
        creditor.amount -= amount;
      }
    });
  });

  return balances;
}
