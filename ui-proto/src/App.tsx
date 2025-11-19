import { useState } from 'react';
import { AddExpense } from './components/AddExpense';
import { ExpenseList } from './components/ExpenseList';
import { BalanceSummary } from './components/BalanceSummary';
import { Receipt, Users } from 'lucide-react';

export interface Person {
  id: string;
  name: string;
}

export interface Split {
  personId: string;
  amount: number;
}

export interface Expense {
  id: string;
  description: string;
  totalAmount: number;
  paidBy: string;
  splits: Split[];
  date: Date;
  receiptImage?: string;
}

export interface Settlement {
  id: string;
  from: string;
  to: string;
  amount: number;
  date: Date;
}

export default function App() {
  const [people, setPeople] = useState<Person[]>([
    { id: '1', name: 'Alice' },
    { id: '2', name: 'Bob' },
    { id: '3', name: 'Charlie' },
  ]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);

  const addPerson = (name: string) => {
    const newPerson: Person = {
      id: Date.now().toString(),
      name,
    };
    setPeople([...people, newPerson]);
  };

  const addExpense = (expense: Omit<Expense, 'id' | 'date'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      date: new Date(),
    };
    setExpenses([...expenses, newExpense]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const addSettlement = (from: string, to: string, amount: number) => {
    const newSettlement: Settlement = {
      id: Date.now().toString(),
      from,
      to,
      amount,
      date: new Date(),
    };
    setSettlements([...settlements, newSettlement]);
  };

  const deleteSettlement = (id: string) => {
    setSettlements(settlements.filter(s => s.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Receipt className="w-10 h-10 text-indigo-600" />
            <h1 className="text-indigo-900">Expense Splitter</h1>
          </div>
          <p className="text-gray-600">Split expenses fairly with custom amounts</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <AddExpense 
              people={people} 
              onAddExpense={addExpense}
              onAddPerson={addPerson}
            />
            <ExpenseList 
              expenses={expenses}
              people={people}
              onDeleteExpense={deleteExpense}
            />
          </div>

          {/* Right Column */}
          <div>
            <BalanceSummary 
              expenses={expenses}
              people={people}
              settlements={settlements}
              onAddSettlement={addSettlement}
              onDeleteSettlement={deleteSettlement}
            />
          </div>
        </div>
      </div>
    </div>
  );
}