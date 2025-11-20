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
  },
  {
    id: '2',
    from: '3',
    to: '1',
    amount: 23.00,
    date: new Date('2024-11-18'),
  },
];

export const Default: Story = {
  args: {
    settlements: mockSettlements,
    people: mockPeople,
    onDelete: (id) => console.log('Delete settlement:', id),
  },
};

export const Empty: Story = {
  args: {
    settlements: [],
    people: mockPeople,
    onDelete: (id) => console.log('Delete settlement:', id),
  },
};

export const Single: Story = {
  args: {
    settlements: [mockSettlements[0]],
    people: mockPeople,
    onDelete: (id) => console.log('Delete settlement:', id),
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
      },
      {
        id: '4',
        from: '1',
        to: '3',
        amount: 12.50,
        date: new Date('2024-11-16'),
      },
      {
        id: '5',
        from: '2',
        to: '1',
        amount: 89.00,
        date: new Date('2024-11-15'),
      },
    ],
    people: mockPeople,
    onDelete: (id) => console.log('Delete settlement:', id),
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
      },
      {
        id: '2',
        from: '3',
        to: '1',
        amount: 892.50,
        date: new Date('2024-11-18'),
      },
    ],
    people: mockPeople,
    onDelete: (id) => console.log('Delete settlement:', id),
  },
};
