import { presetToLayout } from '@/lib/presetToLayout';
import { describe, it, expect } from 'vitest';
import { RegionalPreset } from '@/types/landing';

const mockPreset: RegionalPreset = {
  id: 'mock',
  name: 'Mock Preset',
  emoji: '🌱',
  state: 'Test',
  crops: 'A+B',
  ler: '1.0',
  revenue: '₹0',
};

describe('presetToLayout', () => {
  it('returns array of PlantLayout[]', () => {
    const layout = presetToLayout(mockPreset, 1);
    expect(Array.isArray(layout)).toBe(true);
    expect(layout.length).toBeGreaterThan(0);
  });

  it('All plants have x, y, layer, species defined', () => {
    const layout = presetToLayout(mockPreset, 1);
    for (const plant of layout) {
      expect(typeof plant.x).toBe('number');
      expect(typeof plant.y).toBe('number');
      expect(typeof plant.layer).toBe('string');
      expect(typeof plant.species).toBe('string');
    }
  });

  it('No two plants share identical x,y coordinates', () => {
    const layout = presetToLayout(mockPreset, 1);
    const coords = new Set();
    for (const plant of layout) {
      const key = `${plant.x},${plant.y}`;
      expect(coords.has(key)).toBe(false);
      coords.add(key);
    }
  });

  it('Plants for canopy layer have height > middle tier plants', () => {
    const layout = presetToLayout(mockPreset, 1);
    const canopy = layout.filter(p => p.layer === 'overstory');
    const mid = layout.filter(p => p.layer === 'middle');
    if (canopy.length && mid.length) {
      expect(Math.min(...canopy.map(p => p.height || 0))).toBeGreaterThan(Math.max(...mid.map(p => p.height || 0)));
    }
  });
});
