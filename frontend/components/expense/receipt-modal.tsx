"use client";

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

export interface ReceiptModalProps {
  isOpen: boolean;
  receiptImage: string | null;
  onClose: () => void;
}

/**
 * ReceiptModal displays a full-size view of an expense receipt.
 *
 * Uses shadcn dialog component for the modal functionality.
 */
export function ReceiptModal({ isOpen, receiptImage, onClose }: ReceiptModalProps) {
  if (!receiptImage) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
        <DialogTitle className="sr-only">Receipt Image</DialogTitle>
        <div className="relative w-full flex items-center justify-center">
          <img
            src={receiptImage}
            alt="Receipt"
            className="max-w-full max-h-[80vh] object-contain rounded-md"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
