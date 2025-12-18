import type { Meta, StoryObj } from '@storybook/react';
import type { AddSettlementInput, SettlementActionResult } from '@/lib/types';
import { BalanceCard } from './balance-card';

const mockCreateSettlement = async (
  input: AddSettlementInput,
): Promise<SettlementActionResult> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return {
    success: true,
    settlement: {
      id: Math.random().toString(),
      from: input.fromPersonId.toString(),
      to: input.toPersonId.toString(),
      amount: input.amount,
      date: new Date(input.date ?? new Date()),
      createdAt: new Date(),
    },
  };
};

const meta: Meta<typeof BalanceCard> = {
  title: 'Expense/BalanceCard',
  component: BalanceCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BalanceCard>;

export const Default: Story = {
  args: {
    fromId: '1',
    fromName: 'Alice',
    toId: '2',
    toName: 'Bob',
    amount: 45.50,
    createSettlement: mockCreateSettlement,
  },
};

export const LargeAmount: Story = {
  args: {
    fromId: '3',
    fromName: 'Charlie',
    toId: '4',
    toName: 'Diana',
    amount: 523.75,
    createSettlement: mockCreateSettlement,
  },
};

export const SmallAmount: Story = {
  args: {
    fromId: '2',
    fromName: 'Bob',
    toId: '1',
    toName: 'Alice',
    amount: 5.25,
    createSettlement: mockCreateSettlement,
  },
};

export const LongNames: Story = {
  args: {
    fromId: '5',
    fromName: 'Alexander',
    toId: '6',
    toName: 'Elizabeth',
    amount: 100,
    createSettlement: mockCreateSettlement,
  },
};

export const Multiple: Story = {
  render: () => (
    <div className="space-y-3 max-w-2xl">
      <BalanceCard
        fromId="1"
        fromName="Alice"
        toId="2"
        toName="Bob"
        amount={45.50}
        createSettlement={mockCreateSettlement}
      />
      <BalanceCard
        fromId="3"
        fromName="Charlie"
        toId="1"
        toName="Alice"
        amount={23.00}
        createSettlement={mockCreateSettlement}
      />
      <BalanceCard
        fromId="2"
        fromName="Bob"
        toId="3"
        toName="Charlie"
        amount={12.50}
        createSettlement={mockCreateSettlement}
      />
    </div>
  ),
};
