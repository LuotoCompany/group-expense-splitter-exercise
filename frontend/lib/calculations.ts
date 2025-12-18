import type { Person, Expense, Settlement, Balance } from './types';

/**
 * Calculate outstanding balances between people based on expenses and settlements.
 *
 * This function:
 * 1. Initializes everyone's balance to 0
 * 2. Processes expenses (payer gets positive, split participants get negative)
 * 3. Processes settlements (reduces balances accordingly)
 * 4. Matches debtors with creditors to minimize number of transactions
 *
 * @param expenses - Array of expenses
 * @param people - Array of people in the group
 * @param settlements - Array of settlements that have already been made
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
