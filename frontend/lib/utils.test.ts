import { describe, it, expect } from 'vitest';
import { cn, splitAmountEqually } from './utils';

describe('cn utility', () => {
  it('should merge class names', () => {
    const result = cn('px-2 py-1', 'px-4');
    expect(result).toBe('py-1 px-4');
  });

  it('should handle conditional classes', () => {
    const result = cn('base-class', true && 'active', false && 'disabled');
    expect(result).toBe('base-class active');
  });

  it('should handle empty inputs', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('should handle arrays and objects', () => {
    const result = cn(['class1', 'class2'], { class3: true, class4: false });
    expect(result).toBe('class1 class2 class3');
  });
});

describe('splitAmountEqually', () => {
  it('should split $10 among 3 people with last person getting extra cent', () => {
    const result = splitAmountEqually(10, 3);
    expect(result).toEqual([3.33, 3.33, 3.34]);
    expect(result.reduce((sum, val) => sum + val, 0)).toBe(10);
  });

  it('should split evenly when no remainder', () => {
    const result = splitAmountEqually(30, 3);
    expect(result).toEqual([10, 10, 10]);
    expect(result.reduce((sum, val) => sum + val, 0)).toBe(30);
  });

  it('should handle $100 among 3 people', () => {
    const result = splitAmountEqually(100, 3);
    expect(result).toEqual([33.33, 33.33, 33.34]);
    expect(result.reduce((sum, val) => sum + val, 0)).toBe(100);
  });

  it('should split $1 among 3 people', () => {
    const result = splitAmountEqually(1, 3);
    expect(result).toEqual([0.33, 0.33, 0.34]);
    expect(result.reduce((sum, val) => sum + val, 0)).toBe(1);
  });

  it('should handle 2 people', () => {
    const result = splitAmountEqually(10.01, 2);
    expect(result).toEqual([5.00, 5.01]);
    expect(result.reduce((sum, val) => sum + val, 0)).toBeCloseTo(10.01, 2);
  });

  it('should handle single person', () => {
    const result = splitAmountEqually(10, 1);
    expect(result).toEqual([10]);
  });

  it('should return empty array for zero people', () => {
    const result = splitAmountEqually(10, 0);
    expect(result).toEqual([]);
  });

  it('should return empty array for negative people count', () => {
    const result = splitAmountEqually(10, -1);
    expect(result).toEqual([]);
  });

  it('should handle zero amount', () => {
    const result = splitAmountEqually(0, 3);
    expect(result).toEqual([0, 0, 0]);
  });

  it('should handle small amounts with more people', () => {
    const result = splitAmountEqually(0.10, 3);
    expect(result).toEqual([0.03, 0.03, 0.04]);
    expect(result.reduce((sum, val) => sum + val, 0)).toBeCloseTo(0.10, 2);
  });
});
