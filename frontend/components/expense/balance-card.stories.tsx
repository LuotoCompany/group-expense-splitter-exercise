import type { Meta, StoryObj } from '@storybook/react';
import { BalanceCard } from './balance-card';

const meta: Meta<typeof BalanceCard> = {
  title: 'Expense/BalanceCard',
  component: BalanceCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof BalanceCard>;

export const Default: Story = {
  args: {
    fromName: 'Alice',
    toName: 'Bob',
    amount: 45.50,
    onSettle: () => console.log('Settle clicked'),
  },
};

export const LargeAmount: Story = {
  args: {
    fromName: 'Charlie',
    toName: 'Diana',
    amount: 523.75,
    onSettle: () => console.log('Settle clicked'),
  },
};

export const SmallAmount: Story = {
  args: {
    fromName: 'Bob',
    toName: 'Alice',
    amount: 5.25,
    onSettle: () => console.log('Settle clicked'),
  },
};

export const LongNames: Story = {
  args: {
    fromName: 'Alexander',
    toName: 'Elizabeth',
    amount: 100,
    onSettle: () => console.log('Settle clicked'),
  },
};

export const Multiple: Story = {
  render: () => (
    <div className="space-y-3 max-w-2xl">
      <BalanceCard
        fromName="Alice"
        toName="Bob"
        amount={45.50}
        onSettle={() => console.log('Settle 1')}
      />
      <BalanceCard
        fromName="Charlie"
        toName="Alice"
        amount={23.00}
        onSettle={() => console.log('Settle 2')}
      />
      <BalanceCard
        fromName="Bob"
        toName="Charlie"
        amount={12.50}
        onSettle={() => console.log('Settle 3')}
      />
    </div>
  ),
};
