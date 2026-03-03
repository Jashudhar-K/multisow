import { f_intercepted, f_transmitted } from '@/ml/utils/beers_law';
import { describe, it, expect } from 'vitest';

describe('Beers Law', () => {
  it('f_intercepted is always between 0 and 1', () => {
    for (let k = 0; k <= 2; k += 0.2) {
      for (let LAI = 0; LAI <= 10; LAI += 0.5) {
        const f = f_intercepted(k, LAI);
        expect(f).toBeGreaterThanOrEqual(0);
        expect(f).toBeLessThanOrEqual(1);
      }
    }
  });

  it('Higher LAI produces higher f_intercepted (monotonic)', () => {
    for (let k = 0.5; k <= 2; k += 0.5) {
      let prev = 0;
      for (let LAI = 0; LAI <= 10; LAI += 0.5) {
        const f = f_intercepted(k, LAI);
        expect(f).toBeGreaterThanOrEqual(prev);
        prev = f;
      }
    }
  });

  it('f_transmitted = 1 - f_intercepted always', () => {
    for (let k = 0.5; k <= 2; k += 0.5) {
      for (let LAI = 0; LAI <= 10; LAI += 0.5) {
        const f = f_intercepted(k, LAI);
        const t = f_transmitted(k, LAI);
        expect(f + t).toBeCloseTo(1, 5);
      }
    }
  });

  it('k=0, any LAI → f_intercepted = 0 (edge case)', () => {
    for (let LAI = 0; LAI <= 10; LAI += 0.5) {
      expect(f_intercepted(0, LAI)).toBeCloseTo(0, 5);
    }
  });

  it('LAI=0, any k → f_intercepted = 0 (edge case)', () => {
    for (let k = 0; k <= 2; k += 0.2) {
      expect(f_intercepted(k, 0)).toBeCloseTo(0, 5);
    }
  });

  it('multi-layer cascade: each layer PAR < previous layer PAR', () => {
    let PAR = 1000;
    const layers = [
      { k: 0.5, LAI: 2 },
      { k: 0.7, LAI: 1.5 },
      { k: 1.2, LAI: 1 },
    ];
    for (const layer of layers) {
      const intercepted = f_intercepted(layer.k, layer.LAI) * PAR;
      const transmitted = f_transmitted(layer.k, layer.LAI) * PAR;
      expect(intercepted).toBeLessThan(PAR);
      PAR = transmitted;
    }
  });
});
