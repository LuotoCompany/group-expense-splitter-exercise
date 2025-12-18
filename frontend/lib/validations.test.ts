import { describe, it, expect } from 'vitest';
import { validateExpenseInput, sumSplitAmounts, SPLIT_TOLERANCE } from './validations';

describe('sumSplitAmounts', () => {
  it('should sum split amounts correctly', () => {
    const splits = [
      { personId: 1, amount: 10.5 },
      { personId: 2, amount: 20.25 },
    ];
    expect(sumSplitAmounts(splits)).toBe(30.75);
  });

  it('should handle empty splits array', () => {
    expect(sumSplitAmounts([])).toBe(0);
  });

  it('should ignore non-finite amounts', () => {
    const splits = [
      { personId: 1, amount: 10 },
      { personId: 2, amount: NaN },
    ];
    expect(sumSplitAmounts(splits)).toBe(10);
  });
});

describe('validateExpenseInput', () => {
  const validInput = {
    description: 'Dinner',
    totalAmount: 30.0,
    paidBy: 1,
    splits: [
      { personId: 1, amount: 15.0 },
      { personId: 2, amount: 15.0 },
    ],
  };

  it('should validate correct expense input', () => {
    const result = validateExpenseInput(validInput);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.splitTotal).toBe(30.0);
  });

  it('should reject empty description', () => {
    const result = validateExpenseInput({
      ...validInput,
      description: '  ',
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Description is required.');
  });

  it('should reject zero total amount', () => {
    const result = validateExpenseInput({
      ...validInput,
      totalAmount: 0,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Total amount must be greater than zero.');
  });

  it('should reject negative total amount', () => {
    const result = validateExpenseInput({
      ...validInput,
      totalAmount: -10,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Total amount must be greater than zero.');
  });

  it('should reject missing paidBy', () => {
    const result = validateExpenseInput({
      ...validInput,
      paidBy: 0,
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Please select who paid for the expense.');
  });

  it('should reject empty splits', () => {
    const result = validateExpenseInput({
      ...validInput,
      splits: [],
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Please add at least one split.');
  });

  it('should reject split with zero amount', () => {
    const result = validateExpenseInput({
      ...validInput,
      splits: [
        { personId: 1, amount: 0 },
      ],
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Split amounts must be greater than zero.');
  });

  it('should reject split with negative amount', () => {
    const result = validateExpenseInput({
      ...validInput,
      splits: [
        { personId: 1, amount: -5 },
      ],
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Split amounts must be greater than zero.');
  });

  it('should reject splits that do not sum to total', () => {
    const result = validateExpenseInput({
      ...validInput,
      totalAmount: 30.0,
      splits: [
        { personId: 1, amount: 10.0 },
        { personId: 2, amount: 15.0 },
      ],
    });
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain('Splits total ($25.00) must equal expense ($30.00)');
  });

  it('should accept splits within tolerance', () => {
    const result = validateExpenseInput({
      ...validInput,
      totalAmount: 30.0,
      splits: [
        { personId: 1, amount: 15.0 },
        { personId: 2, amount: 15.0 + SPLIT_TOLERANCE / 2 },
      ],
    });
    expect(result.valid).toBe(true);
  });

  it('should reject splits outside tolerance', () => {
    const result = validateExpenseInput({
      ...validInput,
      totalAmount: 30.0,
      splits: [
        { personId: 1, amount: 15.0 },
        { personId: 2, amount: 15.0 + SPLIT_TOLERANCE * 2 },
      ],
    });
    expect(result.valid).toBe(false);
  });

  it('should reject split without personId', () => {
    const result = validateExpenseInput({
      ...validInput,
      splits: [
        { personId: 0, amount: 30.0 },
      ],
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Each split must reference a person.');
  });

  it('should collect multiple validation errors', () => {
    const result = validateExpenseInput({
      description: '',
      totalAmount: 0,
      paidBy: 0,
      splits: [],
    });
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });
});
