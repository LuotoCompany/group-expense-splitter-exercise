import { useState } from 'react';
import { Expense, Person, Settlement } from '../App';
import { Users, CheckCircle, X } from 'lucide-react';

interface Balance {
  from: string;
  to: string;
  amount: number;
}

interface BalanceSummaryProps {
  expenses: Expense[];
  people: Person[];
  settlements: Settlement[];
  onAddSettlement: (from: string, to: string, amount: number) => void;
  onDeleteSettlement: (id: string) => void;
}

export function BalanceSummary({ 
  expenses, 
  people, 
  settlements,
  onAddSettlement,
  onDeleteSettlement 
}: BalanceSummaryProps) {
  const getPersonName = (personId: string) => {
    return people.find(p => p.id === personId)?.name || 'Unknown';
  };

  // Calculate balances
  const calculateBalances = (): Balance[] => {
    const balanceMap: Record<string, number> = {};
    
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
      // Person who paid gets negative (they paid off debt)
      balanceMap[settlement.from] = (balanceMap[settlement.from] || 0) - settlement.amount;
      // Person who received gets negative (their credit reduced)
      balanceMap[settlement.to] = (balanceMap[settlement.to] || 0) + settlement.amount;
    });

    // Calculate who owes whom
    const balances: Balance[] = [];
    const creditors: Array<{ id: string; amount: number }> = [];
    const debtors: Array<{ id: string; amount: number }> = [];

    Object.entries(balanceMap).forEach(([personId, balance]) => {
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
            from: debtor.id,
            to: creditor.id,
            amount,
          });
          remaining -= amount;
          creditor.amount -= amount;
        }
      });
    });

    return balances;
  };

  const balances = calculateBalances();

  const handleSettle = (from: string, to: string, amount: number) => {
    if (confirm(`Mark $${amount.toFixed(2)} from ${getPersonName(from)} to ${getPersonName(to)} as settled?`)) {
      onAddSettlement(from, to, amount);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-indigo-900 mb-4 flex items-center gap-2">
        <Users className="w-5 h-5" />
        Balances & Settlements
      </h2>

      {/* Current Balances */}
      <div className="mb-6">
        <h3 className="text-gray-900 mb-3">Who Owes Whom</h3>
        {balances.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-green-50 rounded-lg">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
            <p>All settled up! 🎉</p>
          </div>
        ) : (
          <div className="space-y-3">
            {balances.map((balance, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <p className="text-gray-900">
                      <span className="text-red-600">{getPersonName(balance.from)}</span>
                      {' '}owes{' '}
                      <span className="text-green-600">{getPersonName(balance.to)}</span>
                    </p>
                    <p className="text-indigo-600">
                      ${balance.amount.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleSettle(balance.from, balance.to, balance.amount)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Settle
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settlement History */}
      {settlements.length > 0 && (
        <div>
          <h3 className="text-gray-900 mb-3">Settlement History</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {[...settlements].reverse().map(settlement => (
              <div
                key={settlement.id}
                className="border border-green-200 bg-green-50 rounded-lg p-3 flex items-center justify-between"
              >
                <div className="flex-1">
                  <p className="text-gray-900">
                    {getPersonName(settlement.from)} → {getPersonName(settlement.to)}
                  </p>
                  <p className="text-green-700">
                    ${settlement.amount.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => onDeleteSettlement(settlement.id)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                  aria-label="Remove settlement"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
