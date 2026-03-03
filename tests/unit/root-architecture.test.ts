import { ROI, nutrient_competition } from '@/ml/utils/root_architecture';
import { describe, it, expect } from 'vitest';

describe('Root Architecture', () => {
  it('ROI(A,B) === ROI(B,A) (symmetry)', () => {
    const a = { x: 0, y: 0, r: 2 };
    const b = { x: 3, y: 4, r: 2 };
    expect(ROI(a, b)).toBeCloseTo(ROI(b, a), 5);
  });

  it('Species 5m apart with 2m radius each → ROI = 0', () => {
    const a = { x: 0, y: 0, r: 2 };
    const b = { x: 5, y: 0, r: 2 };
    expect(ROI(a, b)).toBeCloseTo(0, 5);
  });

  it('Fully overlapping same-size species → ROI = 1.0', () => {
    const a = { x: 0, y: 0, r: 2 };
    const b = { x: 0, y: 0, r: 2 };
    expect(ROI(a, b)).toBeCloseTo(1, 5);
  });

  it('nutrient_competition increases as ROI increases (monotonic)', () => {
    const a = { x: 0, y: 0, r: 2 };
    const b = { x: 1, y: 0, r: 2 };
    const c = { x: 3, y: 0, r: 2 };
    const roi1 = ROI(a, b);
    const roi2 = ROI(a, c);
    expect(roi1).toBeGreaterThan(roi2);
    expect(nutrient_competition(roi1)).toBeGreaterThan(nutrient_competition(roi2));
  });
});
