import { plantsPerHectare, rowSpacing, inRowSpacing } from '@/lib/spacing';
import { describe, it, expect } from 'vitest';

describe('Spacing', () => {
  it('plantsPerHectare > 0 for all valid inputs', () => {
    for (let row = 0.5; row <= 5; row += 0.5) {
      for (let inRow = 0.5; inRow <= 5; inRow += 0.5) {
        expect(plantsPerHectare(row, inRow)).toBeGreaterThan(0);
      }
    }
  });

  it('rowSpacing * inRowSpacing roughly = 10000/plantsPerHectare', () => {
    for (let row = 1; row <= 5; row += 0.5) {
      for (let inRow = 1; inRow <= 5; inRow += 0.5) {
        const pph = plantsPerHectare(row, inRow);
        expect(row * inRow * pph).toBeCloseTo(10000, -2);
      }
    }
  });

  it("targetDensity 'high' produces more plants than 'low'", () => {
    const low = plantsPerHectare(2, 2, 'low');
    const high = plantsPerHectare(2, 2, 'high');
    expect(high).toBeGreaterThan(low);
  });
});
