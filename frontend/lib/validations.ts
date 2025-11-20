export const SPLIT_TOLERANCE = 0.01;

export interface SplitAmountInput {
  personId: string;
  amount: number;
}

export interface ExpenseValidationInput {
  description: string;
  totalAmount: number;
  paidBy: string;
  splits: SplitAmountInput[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  splitTotal: number;
}

export function sumSplitAmounts(splits: SplitAmountInput[]) {
  return splits.reduce((sum, split) => sum + (Number.isFinite(split.amount) ? split.amount : 0), 0);
}

export function validateExpenseInput(input: ExpenseValidationInput): ValidationResult {
  const errors: string[] = [];
  const description = input.description.trim();

  if (!description) {
    errors.push("Description is required.");
  }

  if (!Number.isFinite(input.totalAmount) || input.totalAmount <= 0) {
    errors.push("Total amount must be greater than zero.");
  }

  if (!input.paidBy) {
    errors.push("Please select who paid for the expense.");
  }

  if (!input.splits.length) {
    errors.push("Please add at least one split.");
  }

  input.splits.forEach(split => {
    if (!split.personId) {
      errors.push("Each split must reference a person.");
    }
    if (!Number.isFinite(split.amount) || split.amount <= 0) {
      errors.push("Split amounts must be greater than zero.");
    }
  });

  const splitTotal = sumSplitAmounts(input.splits);

  if (
    Number.isFinite(input.totalAmount) &&
    Math.abs(splitTotal - input.totalAmount) > SPLIT_TOLERANCE
  ) {
    errors.push(
      `Splits total ($${splitTotal.toFixed(2)}) must equal expense ($${input.totalAmount.toFixed(2)}).`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    splitTotal,
  };
}

