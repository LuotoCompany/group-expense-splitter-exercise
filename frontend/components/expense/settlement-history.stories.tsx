import type { Meta, StoryObj } from '@storybook/react';
import { SettlementHistory } from './settlement-history';
import type { Settlement, Person } from '@/lib/types';

const meta: Meta<typeof SettlementHistory> = {
  title: 'Expense/SettlementHistory',
  component: SettlementHistory,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SettlementHistory>;

const mockPeople: Person[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Charlie' },
];

const mockSettlements: Settlement[] = [
  {
    id: '1',
    from: '1',
    to: '2',
    amount: 45.50,
    date: new Date('2024-11-19'),
    createdAt: new Date('2024-11-19T10:00:00Z'),
  },
  {
    id: '2',
    from: '3',
    to: '1',
    amount: 23.00,
    date: new Date('2024-11-18'),
    createdAt: new Date('2024-11-18T09:15:00Z'),
  },
];

const asyncDelete = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  console.log('Delete settlement:', id);
};

export const Default: Story = {
  args: {
    settlements: mockSettlements,
    people: mockPeople,
    onDelete: asyncDelete,
  },
};

export const Empty: Story = {
  args: {
    settlements: [],
    people: mockPeople,
    onDelete: asyncDelete,
  },
};

export const Single: Story = {
  args: {
    settlements: [mockSettlements[0]],
    people: mockPeople,
    onDelete: asyncDelete,
  },
};

export const Many: Story = {
  args: {
    settlements: [
      ...mockSettlements,
      {
        id: '3',
        from: '2',
        to: '3',
        amount: 67.25,
        date: new Date('2024-11-17'),
        createdAt: new Date('2024-11-17T12:00:00Z'),
      },
      {
        id: '4',
        from: '1',
        to: '3',
        amount: 12.50,
        date: new Date('2024-11-16'),
        createdAt: new Date('2024-11-16T08:30:00Z'),
      },
      {
        id: '5',
        from: '2',
        to: '1',
        amount: 89.00,
        date: new Date('2024-11-15'),
        createdAt: new Date('2024-11-15T08:30:00Z'),
      },
    ],
    people: mockPeople,
    onDelete: asyncDelete,
  },
};

export const LargeAmounts: Story = {
  args: {
    settlements: [
      {
        id: '1',
        from: '1',
        to: '2',
        amount: 1543.75,
        date: new Date('2024-11-19'),
        createdAt: new Date('2024-11-19T07:30:00Z'),
      },
      {
        id: '2',
        from: '3',
        to: '1',
        amount: 892.50,
        date: new Date('2024-11-18'),
        createdAt: new Date('2024-11-18T07:30:00Z'),
      },
    ],
    people: mockPeople,
    onDelete: asyncDelete,
  },
};
