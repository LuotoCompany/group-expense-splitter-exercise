import { describe, it, expect } from 'vitest';
import { cn } from './utils';

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
