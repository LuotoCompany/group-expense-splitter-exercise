import { Expense, Person } from '../App';
import { Trash2, Receipt, Image } from 'lucide-react';
import { useState } from 'react';

interface ExpenseListProps {
  expenses: Expense[];
  people: Person[];
  onDeleteExpense: (id: string) => void;
}

export function ExpenseList({ expenses, people, onDeleteExpense }: ExpenseListProps) {
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const getPersonName = (personId: string) => {
    return people.find(p => p.id === personId)?.name || 'Unknown';
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-indigo-900 mb-4 flex items-center gap-2">
          <Receipt className="w-5 h-5" />
          Recent Expenses
        </h2>
        <div className="text-center py-8 text-gray-500">
          No expenses yet. Add one to get started!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-indigo-900 mb-4 flex items-center gap-2">
        <Receipt className="w-5 h-5" />
        Recent Expenses
      </h2>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {[...expenses].reverse().map(expense => (
          <div
            key={expense.id}
            className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-gray-900">{expense.description}</h3>
                  {expense.receiptImage && (
                    <button
                      onClick={() => setSelectedReceipt(expense.receiptImage!)}
                      className="text-indigo-600 hover:text-indigo-700 transition-colors"
                      aria-label="View receipt"
                    >
                      <Image className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <p className="text-gray-600">
                  Paid by {getPersonName(expense.paidBy)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-indigo-600">${expense.totalAmount.toFixed(2)}</span>
                <button
                  onClick={() => onDeleteExpense(expense.id)}
                  className="text-red-500 hover:text-red-600 transition-colors"
                  aria-label="Delete expense"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="text-gray-600 space-y-1">
              {expense.splits.map(split => (
                <div key={split.personId} className="flex justify-between">
                  <span>{getPersonName(split.personId)}</span>
                  <span>${split.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Receipt Modal */}
      {selectedReceipt && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedReceipt(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img 
              src={selectedReceipt} 
              alt="Receipt" 
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedReceipt(null)}
              className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <Receipt className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}