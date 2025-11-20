import type { Meta, StoryObj } from '@storybook/react';
import { AddExpenseForm } from './add-expense-form';
import type { Person } from '@/lib/types';

const meta: Meta<typeof AddExpenseForm> = {
  title: 'Expense/AddExpenseForm',
  component: AddExpenseForm,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AddExpenseForm>;

const mockPeople: Person[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
  { id: '3', name: 'Charlie' },
];

export const Default: Story = {
  args: {
    people: mockPeople,
    onSubmit: (expense) => console.log('Add expense:', expense),
    onAddPerson: (name) => console.log('Add person:', name),
  },
};

export const TwoPeople: Story = {
  args: {
    people: mockPeople.slice(0, 2),
    onSubmit: (expense) => console.log('Add expense:', expense),
    onAddPerson: (name) => console.log('Add person:', name),
  },
};

export const ManyPeople: Story = {
  args: {
    people: [
      ...mockPeople,
      { id: '4', name: 'Diana' },
      { id: '5', name: 'Eve' },
      { id: '6', name: 'Frank' },
    ],
    onSubmit: (expense) => console.log('Add expense:', expense),
    onAddPerson: (name) => console.log('Add person:', name),
  },
};

export const NoPeople: Story = {
  args: {
    people: [],
    onSubmit: (expense) => console.log('Add expense:', expense),
    onAddPerson: (name) => console.log('Add person:', name),
  },
};
