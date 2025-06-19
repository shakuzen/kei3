import { describe, it, expect } from 'vitest';
import { calculateFurusatoNozeiLimit } from '../utils/furusato';

// Test cases are based on typical Japanese tax brackets and expected behavior

describe('calculateFurusatoNozeiLimit', () => {
  it('calculates a reasonable limit for a middle-income salary (no one-stop)', () => {
    // Example: taxable income for residence tax = 4,000,000, national income tax = 3,000,000
    // Should use 20% cap of resident tax income portion, and correct marginal rate
    const limit = calculateFurusatoNozeiLimit(4_000_000, 3_000_000);
    expect(limit).toBeGreaterThan(0);
    expect(limit % 1000).toBe(0);
  });

  it('calculates a reasonable limit for a high-income salary (no one-stop)', () => {
    // Example: taxable income for residence tax = 10,000,000, national income tax = 9,000,000
    const limit = calculateFurusatoNozeiLimit(10_000_000, 9_000_000);
    expect(limit).toBeGreaterThan(0);
    expect(limit % 1000).toBe(0);
  });

  it('calculates a reasonable limit for a low-income salary (no one-stop)', () => {
    // Example: taxable income for residence tax = 1,000,000, national income tax = 800,000
    const limit = calculateFurusatoNozeiLimit(1_000_000, 800_000);
    expect(limit).toBeGreaterThan(0);
    expect(limit % 1000).toBe(0);
  });

  it('calculates a different limit when one-stop system is used', () => {
    // Example: taxable income for residence tax = 4,000,000, national income tax = 3,000,000
    const limitNormal = calculateFurusatoNozeiLimit(4_000_000, 3_000_000, false);
    const limitOneStop = calculateFurusatoNozeiLimit(4_000_000, 3_000_000, true);
    expect(limitOneStop).not.toBe(limitNormal);
    expect(limitOneStop).toBeGreaterThan(0);
    expect(limitOneStop % 1000).toBe(0);
  });

  it('returns 0 for zero or negative taxable income', () => {
    expect(calculateFurusatoNozeiLimit(0, 0)).toBe(0);
    expect(calculateFurusatoNozeiLimit(-1000, -1000)).toBe(0);
  });
});
