import type { Meta, StoryObj } from '@storybook/react';
import { ReceiptModal } from './receipt-modal';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const meta: Meta<typeof ReceiptModal> = {
  title: 'Expense/ReceiptModal',
  component: ReceiptModal,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ReceiptModal>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>View Receipt</Button>
        <ReceiptModal
          isOpen={open}
          receiptImage="https://via.placeholder.com/600x800/4F46E5/FFFFFF?text=Receipt"
          onClose={() => setOpen(false)}
        />
      </>
    );
  },
};

export const WideReceipt: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>View Wide Receipt</Button>
        <ReceiptModal
          isOpen={open}
          receiptImage="https://via.placeholder.com/1200x600/4F46E5/FFFFFF?text=Wide+Receipt"
          onClose={() => setOpen(false)}
        />
      </>
    );
  },
};

export const TallReceipt: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>View Tall Receipt</Button>
        <ReceiptModal
          isOpen={open}
          receiptImage="https://via.placeholder.com/400x1200/4F46E5/FFFFFF?text=Tall+Receipt"
          onClose={() => setOpen(false)}
        />
      </>
    );
  },
};
