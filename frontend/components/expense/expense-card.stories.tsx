import type { Meta, StoryObj } from '@storybook/react';
import { ExpenseCard } from './expense-card';
import type { Expense, Person } from '@/lib/types';

const meta: Meta<typeof ExpenseCard> = {
  title: 'Expense/ExpenseCard',
  component: ExpenseCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ExpenseCard>;

const mockPeople: Person[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Charlie' },
];

const mockExpense: Expense = {
  id: '1',
  description: 'Dinner at Restaurant',
  totalAmount: 150,
  paidBy: '1',
  splits: [
    { personId: '1', amount: 50 },
    { personId: '2', amount: 50 },
    { personId: '3', amount: 50 },
  ],
  date: new Date('2024-11-19'),
};

export const Default: Story = {
  args: {
    expense: mockExpense,
    people: mockPeople,
    onDelete: (id) => console.log('Delete expense:', id),
  },
};

export const WithReceipt: Story = {
  args: {
    expense: {
      ...mockExpense,
      receiptImage: 'https://via.placeholder.com/600x800',
    },
    people: mockPeople,
    onDelete: (id) => console.log('Delete expense:', id),
    onReceiptClick: (image) => console.log('View receipt:', image),
  },
};

export const UnevenSplit: Story = {
  args: {
    expense: {
      id: '2',
      description: 'Groceries',
      totalAmount: 85.50,
      paidBy: '2',
      splits: [
        { personId: '1', amount: 30.50 },
        { personId: '2', amount: 25 },
        { personId: '3', amount: 30 },
      ],
      date: new Date('2024-11-18'),
    },
    people: mockPeople,
    onDelete: (id) => console.log('Delete expense:', id),
  },
};

export const LargeAmount: Story = {
  args: {
    expense: {
      id: '3',
      description: 'Hotel Booking',
      totalAmount: 1250.75,
      paidBy: '1',
      splits: [
        { personId: '1', amount: 416.92 },
        { personId: '2', amount: 416.92 },
        { personId: '3', amount: 416.91 },
      ],
      date: new Date('2024-11-20'),
    },
    people: mockPeople,
    onDelete: (id) => console.log('Delete expense:', id),
  },
};

export const LongDescription: Story = {
  args: {
    expense: {
      id: '4',
      description: 'Team Lunch at the Italian Restaurant Downtown with Extra Appetizers',
      totalAmount: 210,
      paidBy: '3',
      splits: [
        { personId: '1', amount: 70 },
        { personId: '2', amount: 70 },
        { personId: '3', amount: 70 },
      ],
      date: new Date('2024-11-17'),
    },
    people: mockPeople,
    onDelete: (id) => console.log('Delete expense:', id),
  },
};

export const TwoPeople: Story = {
  args: {
    expense: {
      id: '5',
      description: 'Movie Tickets',
      totalAmount: 30,
      paidBy: '1',
      splits: [
        { personId: '1', amount: 15 },
        { personId: '2', amount: 15 },
      ],
      date: new Date('2024-11-15'),
    },
    people: mockPeople.slice(0, 2),
    onDelete: (id) => console.log('Delete expense:', id),
  },
};

export const Deleting: Story = {
  args: {
    expense: mockExpense,
    people: mockPeople,
    onDelete: (id) => console.log('Delete expense:', id),
    isDeleting: true,
  },
};

export const Multiple: Story = {
  render: () => (
    <div className="space-y-3 max-w-2xl">
      <ExpenseCard
        expense={mockExpense}
        people={mockPeople}
        onDelete={(id) => console.log('Delete:', id)}
      />
      <ExpenseCard
        expense={{
          id: '2',
          description: 'Coffee Shop',
          totalAmount: 24.50,
          paidBy: '2',
          splits: [
            { personId: '1', amount: 8.50 },
            { personId: '2', amount: 8 },
            { personId: '3', amount: 8 },
          ],
          date: new Date('2024-11-19'),
          receiptImage: 'https://via.placeholder.com/400x600',
        }}
        people={mockPeople}
        onDelete={(id) => console.log('Delete:', id)}
        onReceiptClick={(img) => console.log('Receipt:', img)}
      />
      <ExpenseCard
        expense={{
          id: '3',
          description: 'Taxi Ride',
          totalAmount: 45,
          paidBy: '3',
          splits: [
            { personId: '1', amount: 15 },
            { personId: '2', amount: 15 },
            { personId: '3', amount: 15 },
          ],
          date: new Date('2024-11-18'),
        }}
        people={mockPeople}
        onDelete={(id) => console.log('Delete:', id)}
      />
    </div>
  ),
};
