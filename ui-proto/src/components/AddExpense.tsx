import { useState } from 'react';
import { Person, Expense, Split } from '../App';
import { Plus, DollarSign, UserPlus, Upload, X } from 'lucide-react';

interface AddExpenseProps {
  people: Person[];
  onAddExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
  onAddPerson: (name: string) => void;
}

export function AddExpense({ people, onAddExpense, onAddPerson }: AddExpenseProps) {
  const [description, setDescription] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [splits, setSplits] = useState<Record<string, string>>({});
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const [receiptImage, setReceiptImage] = useState<string | null>(null);

  const handleSplitChange = (personId: string, value: string) => {
    setSplits({
      ...splits,
      [personId]: value,
    });
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeReceipt = () => {
    setReceiptImage(null);
  };

  const splitEqually = () => {
    const amount = parseFloat(totalAmount);
    if (isNaN(amount) || people.length === 0) return;
    
    // Calculate splits with last person getting any remaining cents
    const baseAmount = Math.floor((amount / people.length) * 100) / 100;
    const newSplits: Record<string, string> = {};
    
    people.forEach((person, index) => {
      if (index === people.length - 1) {
        // Last person gets the remainder
        const totalAssigned = baseAmount * (people.length - 1);
        const remainder = Math.round((amount - totalAssigned) * 100) / 100;
        newSplits[person.id] = remainder.toFixed(2);
      } else {
        newSplits[person.id] = baseAmount.toFixed(2);
      }
    });
    setSplits(newSplits);
  };

  // Auto-split equally when total amount changes
  const handleTotalAmountChange = (value: string) => {
    setTotalAmount(value);
    
    const amount = parseFloat(value);
    if (!isNaN(amount) && amount > 0 && people.length > 0) {
      // Calculate splits with last person getting any remaining cents
      const baseAmount = Math.floor((amount / people.length) * 100) / 100;
      const newSplits: Record<string, string> = {};
      
      people.forEach((person, index) => {
        if (index === people.length - 1) {
          // Last person gets the remainder
          const totalAssigned = baseAmount * (people.length - 1);
          const remainder = Math.round((amount - totalAssigned) * 100) / 100;
          newSplits[person.id] = remainder.toFixed(2);
        } else {
          newSplits[person.id] = baseAmount.toFixed(2);
        }
      });
      setSplits(newSplits);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !totalAmount || !paidBy) {
      alert('Please fill in all required fields');
      return;
    }

    const expenseSplits: Split[] = Object.entries(splits)
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
      alert(`Splits total ($${splitTotal.toFixed(2)}) must equal the expense amount ($${expenseTotal.toFixed(2)})`);
      return;
    }

    onAddExpense({
      description,
      totalAmount: expenseTotal,
      paidBy,
      splits: expenseSplits,
      receiptImage: receiptImage || undefined,
    });

    // Reset form
    setDescription('');
    setTotalAmount('');
    setPaidBy('');
    setSplits({});
    setReceiptImage(null);
  };

  const handleAddPerson = () => {
    if (newPersonName.trim()) {
      onAddPerson(newPersonName.trim());
      setNewPersonName('');
      setShowAddPerson(false);
    }
  };

  const currentSplitTotal = Object.values(splits).reduce(
    (sum, amount) => sum + (parseFloat(amount) || 0),
    0
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-indigo-900 flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Expense
        </h2>
        <button
          type="button"
          onClick={() => setShowAddPerson(!showAddPerson)}
          className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add Person
        </button>
      </div>

      {showAddPerson && (
        <div className="mb-4 p-3 bg-indigo-50 rounded-lg flex gap-2">
          <input
            type="text"
            value={newPersonName}
            onChange={(e) => setNewPersonName(e.target.value)}
            placeholder="Person name"
            className="flex-1 px-3 py-2 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onKeyPress={(e) => e.key === 'Enter' && handleAddPerson()}
          />
          <button
            onClick={handleAddPerson}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Add
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Dinner at restaurant"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Total Amount</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              step="0.01"
              value={totalAmount}
              onChange={(e) => handleTotalAmountChange(e.target.value)}
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Paid By</label>
          <select
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select person</option>
            {people.map(person => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-gray-700">Split Amounts</label>
            <button
              type="button"
              onClick={splitEqually}
              className="text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Split Equally
            </button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {people.map(person => (
              <div key={person.id} className="flex items-center gap-2">
                <label className="flex-1 text-gray-700">{person.name}</label>
                <div className="relative w-32">
                  <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    value={splits[person.id] || ''}
                    onChange={(e) => handleSplitChange(person.id, e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-7 pr-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            ))}
          </div>
          {totalAmount && (
            <div className="mt-2 text-right">
              <span className={`${
                Math.abs(currentSplitTotal - parseFloat(totalAmount)) < 0.01
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}>
                Split Total: ${currentSplitTotal.toFixed(2)} / ${parseFloat(totalAmount).toFixed(2)}
              </span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Receipt (optional)</label>
          {receiptImage ? (
            <div className="relative">
              <img 
                src={receiptImage} 
                alt="Receipt preview" 
                className="w-full h-40 object-cover rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={removeReceipt}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                aria-label="Remove receipt"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="block w-full p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 transition-colors cursor-pointer text-center">
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <span className="text-gray-600">Click to upload receipt image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleReceiptUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Expense
        </button>
      </form>
    </div>
  );
}